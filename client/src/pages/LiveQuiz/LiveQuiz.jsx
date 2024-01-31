import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./livequiz.module.css";
import { backendBaseUrl } from "../../config";
import sample from "../../assets/sampleImage.png";
import axios from "axios";
import Timer from "../../components/Timer/Timer";
function LiveQuiz() {
 
  const [qArr, setQArr] = useState(null);
  const navigate = useNavigate();
  const [quizType, setQuizType] = useState(null);
  const [timer, setTimer] = useState("off");
  const { quizzId } = useParams();
  const [optionType, setOptionType] = useState(null);
  
  const [btnId, setBtnId] = useState(null);
 
  const [showQuestion, setShowQuestion] = useState(0);

  const [ansArr, setAnsArr] = useState([]);
 
  const nextQuestion = () => {
    setBtnId(null);
  
    const qId = qArr[showQuestion]._id;
    const updated = [...ansArr];
    const answered = updated.findIndex((el) => {
      return el.questionId === qId;
    });
    if (answered === -1) {
      const ans = {
        questionId: qId,
        ansSelectedId: null,
      };
      updated.push(ans);
    
      setAnsArr(updated);
    }
   
    if (showQuestion + 1 < qArr.length) {  
      setShowQuestion((showQuestion) => {
       
        return showQuestion + 1;
      });
      setOptionType(() => {
        if (showQuestion + 1 < qArr.length) {
          return qArr[showQuestion + 1].optionType;
        }
      });
    } else {
      return;
    }
  };

  const handleSubmit = () => {
    console.log("quizzIdquizzId")
    console.log(quizzId)
    const quizId = quizzId;
    axios
      .post(`${backendBaseUrl}/api/${quizId}/submit`, ansArr)
      .then((res) => {
        if (res.data.status === "OK") {
          if (quizType === "qna") {
            return navigate("/result", {
              state: {
                score: res.data.score,
                ques: qArr.length,
                poll: quizType === "poll",
              },
            });
          } else {
            return navigate("/result", { state: { poll: true } });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        return alert("Something went wrong in submitting");
      });
   
  };
  const getQuestions = async () => {
    try {
      const quizId = quizzId;
      const res = await axios.get(`${backendBaseUrl}/api/quizz/${quizId}`);
      console.log(res.data.data);
      setQArr(res.data.data.questions);
      setQuizType(res.data.data.quizType);
      setTimer(res.data.data.timer);
      setOptionType(res.data.data.questions[0].optionType);
     
    } catch (err) {
      console.log(err);
      return alert("something went wrong in getting questions");
    }
  };
  useEffect(() => {
    getQuestions();
   
  }, []);
  const getClass = () => {
    if (optionType === "txt") {
      return styles.option;
    } else if (optionType === "img") {
      return styles.justImage;
    } else {
      return styles.withImage;
    }
  };
  function handleAnsSelect(btnId, qIdx, optId) {
    setBtnId(btnId);
    
    const updated = [...ansArr];
    const answered = updated.findIndex(
      (el) => el.questionId === qArr[qIdx]._id
    );
    if (answered === -1) {
      const ans = {
        questionId: qArr[qIdx]._id,
        ansSelectedId: optId,
      };
      updated.push(ans);
     
      setAnsArr(updated);
    } else {
      updated[answered].ansSelectedId = optId;
    
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.qnt}>
          <div className={styles.qno}>
            {qArr ? `0${showQuestion + 1}/0${qArr.length}` : "loading.."}
          </div>
          <div className={styles.timer}>
            {quizType === "poll" || timer === "off" ? (
              ""
            ) : (            
              <Timer
                nextQuestion={nextQuestion}
                handleSubmit={handleSubmit}
                arrlen={qArr ? qArr.length : 0}
                timer={timer}
                showQuestion={showQuestion}
              />
            )}
          </div>
        </div>
        <div className={styles.question}>
          {qArr && showQuestion < qArr.length
            ? qArr[showQuestion].question
            : "loading..."}
        </div>
        <div className={styles.optContainer}>
          {qArr && showQuestion < qArr.length
            ? qArr[showQuestion].options.map((op, index) => (
                <div
                  onClick={() => handleAnsSelect(index, showQuestion, op._id)}
                  style={{ border: btnId === index ? "3px solid #5076FF" : "" }}
                  className={getClass()}
                >
                  {optionType === "txt" ? op.value : ""}
                  {optionType === "img" ? (
                    <div>
                      <img
                      
                        width={"200px"}
                        height={"110px"}
                        src={op.value || sample}
                        alt="option"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {optionType === "txtimg" ? (
                    <>
                      {" "}
                      <div
                        style={{
                          paddingTop: "10px",
                          flex: "40%",
                        }}
                      >
                        {op.value || `option ${index + 1}`}
                      </div>
                      <div style={{ flex: "60%" }}>
                        <img
                        
                          width={"100%"}
                          height={"100%"}
                          src={op.imgUrl || sample}
                          alt="option"
                        />
                      </div>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))
            : "loading..."}       
        </div>
        <div className={styles.btn}>
          <button
            onClick={() => {
              if (showQuestion === qArr.length - 1) {
                handleSubmit();
              } else {
                nextQuestion();
              }
            }}
          >
            {qArr
              ? showQuestion === qArr.length - 1
                ? "Submit"
                : "Next"
              : "Next"}
          </button>{" "}
        </div>
      </div>
    </>
  );
}

export default LiveQuiz;
