import React, { useEffect, useState } from "react";
import styles from "./overview.module.css";
import eye from "../../assets/eye.png";
import { backendBaseUrl } from "../../constants";
import axios from "axios";
function Overview() {
  const [quizArr, setQuizArr] = useState([]);
  const [impressions, setImpressions] = useState(null);
  const [questions, setQuestions] = useState(null);
  async function getData() {
    try {
      const jwToken = localStorage.getItem("jwToken");
      const headers = {
        "Content-Type": "application/json",
        authorization: jwToken,
      };
      const response = await axios.get(`${backendBaseUrl}/quizs`, {
        headers: headers,
      });
      let impressions = 0;
      let questions = 0;
      // eslint-disable-next-line
      response.data.data.map((el) => {
        impressions += el.impressions;
        questions += el.questions;
      });
      setImpressions(() => impressions);
      setQuestions(() => questions);
      setQuizArr(response.data.data);
    } catch (err) {
      console.log(err);
      return alert("Something went wrong");
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.data}>
          <div
            style={{
              color: "#FF5D01",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {quizArr.length}
            </span>{" "}
            Quizz <br /> Created
          </div>
          <div
            style={{
              color: "#60B84B",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {questions}
            </span>{" "}
            Questions <br /> Created
          </div>
          <div
            style={{
              color: "#5076FF",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {impressions > 1000
                ? `${(impressions / 1000).toFixed(1)}K`
                : impressions}
            </span>{" "}
            Total <br /> Impressions
          </div>
        </div>
        <div className={styles.trending}>
          <div
            style={{
              color: "#474444",
              fontFamily: "Poppins",
              fontSize: "1.8rem",
              fontWeight: "800",
              paddingLeft: "7%",
              //   border: "1px solid red",
            }}
          >
            Trending Quizs
          </div>

          <div className={styles.quizContainer}>
            {quizArr.map((el, index) => (
              <div key={index} className={styles.quizBanner}>
                <div className={styles.bannerTop}>
                  <div className={styles.quizName}>{el.quizzName}</div>
                  <div className={styles.views}>
                    {el.impressions} <img alt="eye" src={eye} />
                  </div>
                </div>
                <div className={styles.bannerBottom}>
                  Created on: &nbsp;{el.createdOn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Overview;
