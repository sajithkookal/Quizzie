import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./livequiz.module.css";
import { backendBaseUrl } from "../../constants";
import sample from "../../assets/sampleImage.png";
import axios from "axios";
import Timer from "../../components/Timer/Timer";
function LiveQuiz() {
  // const ref = useRef(null);
  const [qArr, setQArr] = useState(null);
  const navigate = useNavigate();
  const [quizType, setQuizType] = useState(null);
  const [timer, setTimer] = useState("off");
  const { quizId } = useParams();
  const [optionType, setOptionType] = useState(null);
  // =======================================
  // const [btnId, setBtnId] = useState(() => {
  //   return localStorage.getItem("btnId");
  // }); This one.
  const [btnId, setBtnId] = useState(null);
  // ========================================
  // =====================================================
  // const [showQuestion, setShowQuestion] = useState(() => {
  //   return localStorage.getItem("currIdx") - "0";
  // });
  const [showQuestion, setShowQuestion] = useState(0);
  // =========================================================
  // ===============================================
  const [ansArr, setAnsArr] = useState([]);
  // const [ansArr, setAnsArr] = useState(() => {
  //   return localStorage.getItem("ansArr");
  // });
  // =============================================
  const nextQuestion = () => {
    setBtnId(null);
    // localStorage.removeItem("btnId");
    // let prev = localStorage.getItem("currIdx") - "0";
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
      // localStorage.setItem("ansArr", JSON.stringify(updated)); this one
      setAnsArr(updated);
    }
    // prev = prev - "0"; this one

    if (showQuestion + 1 < qArr.length) {
      // localStorage.setItem("currIdx", prev + 1); this one

      setShowQuestion((showQuestion) => {
        // return localStorage.getItem("currIdx") - "0"; this one
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
    // console.log(ansArr);
    const quizzId = quizId;
    axios
      .post(`${backendBaseUrl}/${quizzId}/submit`, ansArr)
      .then((res) => {
        if (res.data.status === "OK") {
          // console.log("score", res.data.score);
          // localStorage.removeItem("currIdx");
          // localStorage.removeItem("ansArr");
          // localStorage.removeItem("btnId");
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
    // console.log("Submitted");
  };
  const getQuestions = async () => {
    try {
      const quizzId = quizId;
      const res = await axios.get(`${backendBaseUrl}/quizz/${quizzId}`);
      console.log(res.data.data);
      setQArr(res.data.data.questions);
      setQuizType(res.data.data.quizType);
      setTimer(res.data.data.timer);
      setOptionType(res.data.data.questions[0].optionType);
      // if (!localStorage.getItem("currIdx")) {
      //   localStorage.setItem("currIdx", 0);
      // }
      // if (!localStorage.getItem("ansArr")) {
      //   localStorage.setItem("ansArr", JSON.stringify([]));
      // }
    } catch (err) {
      console.log(err);
      return alert("something went wrong in getting questions");
    }
  };
  useEffect(() => {
    getQuestions();
    // ==========================================
    // setShowQuestion(() => {
    //   return localStorage.getItem("currIdx") - "0" || 0;
    // });
    // setAnsArr(() => {
    //   return JSON.parse(localStorage.getItem("ansArr")) || [];
    // });
    // setBtnId(() => {
    //   return localStorage.getItem("btnId")
    //     ? localStorage.getItem("btnId") - "0"
    //     : null;
    // });
    // time();
    // eslint-disable-next-line
    // ============================================
    // eslint-disable-next-line
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
    // localStorage.setItem("btnId", btnId); this one
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
      // localStorage.setItem("ansArr", JSON.stringify(updated));
      setAnsArr(updated);
    } else {
      updated[answered].ansSelectedId = optId;
      // localStorage.setItem("ansArr", JSON.stringify(updated));
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
              // ""
              //
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
                        // style={{ border: btnId === 1 ? "3px solid #5076FF" : "" }}
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
                          // style={{ border: "1px solid red" }}
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
          {/* <div
            onClick={() => setBtnId(2)}
            style={{ border: btnId === 2 ? "3px solid #5076FF" : "" }}
            className={getClass()}
          >
            {optionType === "txt" ? "Option" : ""}
            {optionType === "img" ? (
              <div>
                <img
                  // style={}
                  width={"200px"}
                  height={"110px"}
                  src={sample}
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
                  text
                </div>
                <div>
                  <img width={"100%"} height={"100%"} src={sample} />
                </div>{" "}
              </>
            ) : (
              ""
            )}
          </div>
          <div
            onClick={() => setBtnId(3)}
            style={{ border: btnId === 3 ? "3px solid #5076FF" : "" }}
            className={getClass()}
          >
            {optionType === "txt" ? "Option" : ""}
            {optionType === "img" ? (
              <div>
                <img
                  // style={{ border: btnId ===  ? "3px solid #5076FF" : "" }}
                  width={"200px"}
                  height={"110px"}
                  src={sample}
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
                  text
                </div>
                <div>
                  <img width={"100%"} height={"100%"} src={sample} />
                </div>{" "}
              </>
            ) : (
              ""
            )}
          </div>
          <div
            onClick={() => setBtnId(4)}
            style={{ border: btnId === 4 ? "3px solid #5076FF" : "" }}
            className={getClass()}
          >
            {optionType === "txt" ? "Option" : ""}
            {optionType === "img" ? (
              <div>
                <img
                  // style={{ border: btnId === 1 ? "3px solid #5076FF" : "" }}
                  width={"200px"}
                  height={"110px"}
                  src={sample}
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
                  text
                </div>
                <div>
                  <img width={"100%"} height={"100%"} src={sample} />
                </div>{" "}
              </>
            ) : (
              ""
            )}
          </div> */}
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
