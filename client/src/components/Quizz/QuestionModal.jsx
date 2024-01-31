import React, { useEffect, useState } from "react";
import styles from "./questionmodal.module.css";
import add from "../../assets/add.png";
import del from "../../assets/del.png";
import { backendBaseUrl } from "../../constants";
import { frontEndBaseUrl } from "../../constants";
import axios from "axios";
function QuestionModal({
  handleFinalCancel,
  quizType,
  quizName,
  handleSuccessModal,
  handleQuizLink,
  edit,
  quizId,
  handleQuizType,
}) {
  const [optionType, setOptionType] = useState("");
  const [showQuestionIndex, setShowQuestionIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState(null);
  const [quizTypeEdit, setQuizTypeEdit] = useState(""); //
  const initailOptArr = [
    { value: "", isAnswer: false, imgUrl: "" },
    { value: "", isAnswer: false, imgUrl: "" },
    { value: "", isAnswer: false, imgUrl: "" },
    { value: "", isAnswer: false, imgUrl: "" },
  ];
  const [qArr, setQArr] = useState([
    { question: "", optionType: "", options: initailOptArr },
  ]);
  const quizzId = quizId;
  useEffect(() => {
    if (edit) {
      const jwToken = localStorage.getItem("jwToken");
      if (!jwToken) {
        return alert("Your are not LoggedIn");
      }
      const headers = {
        "Content-Type": "application/json",
        authorization: jwToken,
      };
      axios
        .get(`${backendBaseUrl}/fetch/${quizzId}`, { headers: headers })
        .then((res) => {
          // setQArr(res.data.quizData.quesions);
          setQArr(res.data.quizData[0].questions);
          setTimer(res.data.quizData[0].timer);
          setQuizTypeEdit(res.data.quizData[0].quizzType); //
          // setQuizType(res.data.quizData.quizzType); //
          // quizType = res.data.quizData.quizzType;
        })
        .catch((err) => {
          console.log(err);
          return alert("Something went wrong in getting data");
        });
    }
    // eslint-disable-next-line
  }, []);
  const [correctAnsIndex, setCorrectAnsIndex] = useState(null);
  const handleUpdateQuiz = async () => {
    try {
      const quizzId = quizId;
      const jwToken = localStorage.getItem("jwToken");
      if (!jwToken) {
        return alert("You are not LoggedIn");
      }
      const headers = {
        "Content-Type": "application/json",
        authorization: jwToken,
      };
      // const payload = {question}
      const payload = {
        timer: timer,
        qArr,
      };
      axios
        .put(`${backendBaseUrl}/update-quizz/${quizzId}`, payload, {
          headers: headers,
        })
        .then((res) => {
          const quizId = res.data.quizId;
          handleFinalCancel();
          handleSuccessModal(true);
          handleQuizLink(`${frontEndBaseUrl}/quiz/${quizId}`);
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong in updating quiz");
        });
    } catch (err) {
      console.log(err);
      alert("Something went wrong in updating quiz");
    }
  };
  const handleCreateQuiz = async () => {
    const quizzData = {
      quizzName: quizName,
      quizzType: quizType,
      questions: qArr,
      timer: timer,
    };
    if (quizzData.quizzType === "qna") {
      let ans = 0;
      quizzData.questions.forEach((que) => {
        const found = que.options.findIndex(
          (op) => op.isAnswer === true && (op.value !== "" || op.imgUrl !== "")
        );
        if (found !== -1) {
          ans++;
        }
      });
      if (!(ans === quizzData.questions.length))
        return alert("All feilds are required in ans");
    } else {
    }
    const jwToken = localStorage.getItem("jwToken");
    if (!jwToken) {
      return alert("You are not LoggedIn");
    }
    const headers = {
      "Content-type": "application/json",
      authorization: jwToken,
    };
    axios
      .post(`${backendBaseUrl}/create-quizz`, quizzData, { headers: headers })
      .then((res) => {
        if (res.data.status === "OK") {
          // console.log(res.data.quizId);
          const quizId = res.data.quizId;
          handleFinalCancel();
          handleSuccessModal(true);
          handleQuizLink(`${frontEndBaseUrl}/quiz/${quizId}`);
        }
      })
      .catch((err) => {
        console.log(err);
        return alert("All Feilds are required in catch");
      });
  };
  const addQuestion = (index) => {
    console.log(index);
    const updated = [...qArr];
    if (updated.length === 5) return;
    if (updated[index - 1].question === "") return alert("Question required");
    if (updated[index - 1].optionType === "")
      return alert("Option Type required");
    const foundIdx = updated[index - 1].options.findIndex(
      (el) => el.value === "" && el.imgUrl === ""
    );
    if (foundIdx !== -1) {
      return alert("Fill all Options");
    }
    if (quizType === "qna") {
      const foundIdx = updated[index].options.findIndex(
        (el) => el.isAnswer === true
      );
      if (foundIdx === -1) {
        return alert("You must select an answer");
      }
    }
    updated.push({
      question: "",
      optionType: "",
      options: initailOptArr,
    });
    updated[index].question = question;
    updated[index].optionType = optionType;
    setQArr(updated);
    setShowQuestionIndex(updated.length - 1);
    setQuestion("");
    setOptionType("");
  };
  const deleteQuestion = (index) => {
    const updatedQArr = [...qArr];
    updatedQArr.splice(index, 1);
    setQArr(updatedQArr);
    if (index === updatedQArr.length) {
      setShowQuestionIndex(index - 1);
    } else {
      setShowQuestionIndex(index);
    }
  };
  const handleOptChange = (index, value) => {
    const updatedQArr = [...qArr];
    updatedQArr[showQuestionIndex].options[index].value = value;
    setQArr(updatedQArr);
  };
  const handleOptChangeURL = (index, value) => {
    const updatedQArr = [...qArr];
    updatedQArr[showQuestionIndex].options[index].imgUrl = value;
    setQArr(updatedQArr);
  };
  const handleDeleteOptions = (index) => {
    console.log("delete option");
    const updatedQArr = [...qArr];
    updatedQArr[showQuestionIndex].options.splice(index, 1);
    setQArr(updatedQArr);
    if (index === correctAnsIndex) {
      setCorrectAnsIndex(null);
    }
  };
  const handleAddOpt = () => {
    console.log("add option");
    const updatedQArr = [...qArr];
    updatedQArr[showQuestionIndex].options.push({
      value: "",
      isAnswer: false,
      imgUrl: "",
    });
    setQArr(updatedQArr);
  };
  const handleAnsSelect = (index) => {
    setCorrectAnsIndex(index);
    const oldQArr = [...qArr];

    if (oldQArr[showQuestionIndex] && oldQArr[showQuestionIndex].options) {
      const opts = oldQArr[showQuestionIndex].options.map((opt, idx) => ({
        ...opt,
        isAnswer: idx === index,
      }));
      oldQArr[showQuestionIndex].options = opts;
      setQArr(oldQArr);
    }
  };
  const handleCancel = () => {
    handleFinalCancel();
  };
  // const handleOptType = (e) => {
  //   setOptionType(e.target.value);
  // };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.qContainer}>
          <div className={styles.qno}>
            {qArr.map((el, index) => (
              <div
                onClick={() => setShowQuestionIndex(index)}
                style={{
                  opacity: showQuestionIndex === index ? "1" : "0.5",
                  cursor: "pointer",
                }}
                key={index}
                className={styles.qBanner}
              >
                {index + 1}
                {index !== 0 ? (
                  <span
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(index);
                    }}
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "-1px",
                      cursor: "pointer",
                    }}
                  >
                    x
                  </span>
                ) : (
                  ""
                )}
              </div>
            ))}
            <div
              onClick={() => addQuestion(qArr.length)} //qArr.length - 1
              style={{
                marginTop: "10px",
                cursor: "pointer",
                opacity: qArr.length === 5 ? "0.1" : "",
              }}
            >
              {" "}
              <img src={add} alt="add" />{" "}
            </div>
          </div>
          <div className={styles.caption}>Max 5 Questions</div>
        </div>
        <div className={styles.questionIn}>
          <input
            onChange={(e) => {
              setQuestion(e.target.value);
              const updatedQArr = [...qArr];
              updatedQArr[showQuestionIndex].question = e.target.value;
              setQArr(updatedQArr);
            }}
            // value={question}
            value={
              showQuestionIndex < qArr.length
                ? qArr[showQuestionIndex].question || question
                : question
            }
            placeholder="Enter Question"
            type="text"
            name="question"
          />
        </div>
        <div className={styles.optionType}>
          <div
            style={{
              color: "#9F9F9F",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              flex: "20%",
            }}
          >
            Option type
          </div>
          <div className={styles.types}>
            <div>
              <input
                checked={
                  qArr[showQuestionIndex].optionType === "txt" ||
                  optionType === "txt"
                }
                onClick={(e) => {
                  setOptionType(e.target.value);
                  const updatedQArr = [...qArr];
                  updatedQArr[showQuestionIndex].optionType = e.target.value;
                  setQArr(updatedQArr);
                }}
                type="radio"
                name="optionType"
                value="txt"
              />{" "}
              <label>Text</label>
            </div>
            <div>
              <input
                checked={
                  qArr[showQuestionIndex].optionType === "img" ||
                  optionType === "img"
                }
                onClick={(e) => {
                  setOptionType(e.target.value);
                  const updatedQArr = [...qArr];
                  updatedQArr[showQuestionIndex].optionType = e.target.value;
                  setQArr(updatedQArr);
                }}
                type="radio"
                name="optionType"
                value="img"
              />{" "}
              <label>Image URL</label>
            </div>
            <div>
              <input
                checked={
                  qArr[showQuestionIndex].optionType === "txtimg" ||
                  optionType === "txtimg"
                }
                onClick={(e) => {
                  setOptionType(e.target.value);
                  const updatedQArr = [...qArr];
                  updatedQArr[showQuestionIndex].optionType = e.target.value;
                  setQArr(updatedQArr);
                }}
                type="radio"
                name="optionType"
                value="txtimg"
              />{" "}
              <label>Text & Image URL</label>
            </div>
          </div>
        </div>
        <div className={styles.optionsContainer}>
          <div className={styles.left}>
            {qArr[showQuestionIndex]?.options?.map((el, index) => (
              <>
                <div
                  key={index}
                  className={
                    optionType === "txtimg" ? styles.mvalues : styles.values
                  }
                >
                  {quizType !== "poll" ? (
                    <input
                      checked={
                        qArr[showQuestionIndex]?.options[index].isAnswer ===
                        true
                      }
                      onChange={() => handleAnsSelect(index)}
                      type="radio"
                      name="option"
                    />
                  ) : (
                    ""
                  )}
                  <input
                    style={{
                      background: el.isAnswer ? "#60B84B" : "",
                      color: el.isAnswer ? "white" : "",
                    }}
                    // value={el.value}
                    value={
                      showQuestionIndex < qArr.length &&
                      qArr[showQuestionIndex].options.length !== 0
                        ? qArr[showQuestionIndex].options[index].value ||
                          el.value
                        : el.value
                    }
                    onChange={(e) => handleOptChange(index, e.target.value)}
                    placeholder={
                      optionType === "txt" || optionType === "txtimg"
                        ? "Text"
                        : "Image Url"
                    }
                    className={styles.option}
                  />
                  {optionType === "txtimg" && quizTypeEdit !== "poll" ? (
                    <input
                      style={{ background: el.isAnswer ? "#60B84B" : "" }}
                      value={el.imgUrl}
                      onChange={(e) =>
                        handleOptChangeURL(index, e.target.value)
                      }
                      placeholder={optionType === "txtimg" ? "Image URL" : ""}
                      className={styles.option}
                    />
                  ) : (
                    ""
                  )}
                  {index > 1 ? (
                    <img
                      onClick={(e) => handleDeleteOptions(index)}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      src={del}
                      alt="delete"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </>
            ))}
            <button
              onClick={handleAddOpt}
              // disabled={optArr.length === 4} make add button disable
              style={{
                // opacity: optArr.length === 4 ? "0.5" : "", make opaque
                color: "#9F9F9F",
                fontFamily: "Poppins",
                fontSize: "1.1rem",
                cursor: "pointer",
                width: "296px",
                border: "none",
                height: "50px",
                borderRadius: "10px",
                background: "#FFF",
                boxShadow: "0px 0px 25px 0px rgba(0, 0, 0, 0.15)",
              }}
            >
              Add Option
            </button>
          </div>
          {quizType !== "poll" && quizTypeEdit !== "poll" ? (
            <div className={styles.right}>
              <div>Timer</div>
              <button
                style={{
                  background: timer === "5" ? "#D60000" : "",
                  color: timer === "5" ? "white" : "",
                }}
                onClick={() => setTimer("5")}
              >
                5 Sec
              </button>
              <button
                style={{
                  background: timer === "10" ? "#D60000" : "",
                  color: timer === "10" ? "white" : "",
                }}
                onClick={() => setTimer("10")}
              >
                10 Sec
              </button>
              <button
                style={{
                  background: timer === "off" ? "#D60000" : "",
                  color: timer === "off" ? "white" : "",
                }}
                onClick={() => setTimer("off")}
              >
                OFF
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.action}>
          <button onClick={handleCancel}>Cancel</button>
          <button
            onClick={() => {
              if (edit) {
                handleUpdateQuiz();
              } else {
                handleCreateQuiz();
              }
            }}
            style={{ background: "#60B84B", color: "white" }}
          >
            {edit ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </div>
    </>
  );
}

export default QuestionModal;
