import React, { useState, useEffect } from "react";
import styles from "./analytics.module.css";
import edit from "../../assets/edit.png";
import del from "../../assets/del.png";
import share from "../../assets/share.png";
import axios from "axios";
import { backendBaseUrl, frontEndBaseUrl } from "../../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Analytics({
  handleDeleteQuiz,
  handleQuizId,
  handleEdit,
  handleAnalysis,
}) {
  const [quizArr, setQuizArr] = useState([]);
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
      setQuizArr(response.data.data);
    } catch (err) {
      console.log(err);
      return alert("Something went wrong in getting data");
    }
  }
  const handleEditQuiz = async (quizzId) => {
    try {
      handleEdit(true);
      handleQuizId(quizzId); // using pre defined state;
    } catch (err) {
      console.log(err);
      alert("something went wrong in editing");
    }
  };
  const handleShare = async (quizzId) => {
    try {
      await navigator.clipboard.writeText(`${frontEndBaseUrl}/quiz/${quizzId}`);
      return toast("Link copied");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={styles.container}>
        <ToastContainer />
        <div className={styles.title}>Quiz Analysis</div>
        <div className={styles.data}>
          <div className={styles.info}>
            <table>
              <tr>
                <th>S.No</th>
                <th>Quiz Name</th>
                <th>Created on</th>
                <th>Impressions</th>
                <th></th>
                <th></th>
              </tr>
              {quizArr.map((quiz, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{quiz.quizzName}</td>
                  <td> {quiz.createdOn} </td>
                  <td> {quiz.impressions} </td>
                  <td>
                    <img
                      onClick={() => handleEditQuiz(quiz.quizzId)}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      src={edit}
                      alt="edit"
                    />
                    <img
                      onClick={() => {
                        handleDeleteQuiz(true);
                        handleQuizId(quiz.quizzId);
                      }}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      src={del}
                      alt="delete"
                    />
                    <img
                      onClick={() => handleShare(quiz.quizzId)}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                      src={share}
                      alt="share"
                    />
                  </td>
                  <td
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    <span
                      onClick={() => {
                        handleAnalysis(true);
                        handleQuizId(quiz.quizzId);
                      }}
                    >
                      Question Wise Analysis
                    </span>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
