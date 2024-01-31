import React, { useEffect, useState } from "react";
import prize from "../../assets/prize.png";
import styles from "./result.module.css";
import { Navigate, useLocation } from "react-router-dom";
function Result() {
  const [poll, setPoll] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setPoll(location.state.poll);
    }
    // eslint-disable-next-line
  }, []);
  if (!location.state) {
    return <Navigate to="/not-found" />;
  }

  return (
    <>
      {!poll ? (
        <div>
          <div className={styles.caption}>Congrats Quiz is completed</div>
          <div
            className={styles.imageCont}
            style={{
              // border: "1px solid red",
              width: "fit-content",
              margin: "auto",
            }}
          >
            <img alt="img" src={prize} />
          </div>
          <div className={styles.score}>
            Your Score is:{" "}
            <span>{`0${location.state.score}/0${location.state.ques}`}</span>
          </div>
        </div>
      ) : (
        <div className={styles.poll}>
          Thank You <br /> for Participating in <br /> the Poll
        </div>
      )}
    </>
  );
}

export default Result;
