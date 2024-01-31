import React from "react";
import styles from "./quiztype.module.css";
function QuizType({
  handleQuizType,
  handleQuizName,
  quizType,
  quizName,
  handleContinue,
  handleCancel,
}) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.quizName}>
          {" "}
          <input
            onChange={(e) => handleQuizName(e.target.value)}
            placeholder="Quiz Name"
            type="text"
            value={quizName}
          />{" "}
        </div>
        <div className={styles.type}>
          <div
            style={{
              color: "#9F9F9F",
              textAlign: "center",
              fontSize: "1.2rem",
              paddingTop: "10px",
              fontFamily: "Poppins",
            }}
          >
            Quiz Type
          </div>
          <div>
            {" "}
            <button
              style={{
                color: quizType === "qna" ? "white" : "",
                background: quizType === "qna" ? "#60B84B" : "",
              }}
              onClick={() => handleQuizType("qna")}
            >
              Q & A
            </button>{" "}
          </div>
          <div>
            {" "}
            <button
              style={{
                color: quizType === "poll" ? "white" : "",
                background: quizType === "poll" ? "#60B84B" : "",
              }}
              onClick={() => handleQuizType("poll")}
            >
              Poll Type
            </button>{" "}
          </div>
        </div>
        <div className={styles.options}>
          <button
            onClick={() => handleCancel()}
            style={{
              color: "#474444",
              fontFamily: "Poppins",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleContinue()}
            style={{
              background: "#60B84B",
              color: "white",
              fontFamily: "Poppins",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

export default QuizType;
