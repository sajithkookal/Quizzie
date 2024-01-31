import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendBaseUrl } from "../../constants";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar/Navbar";
import Overview from "../../components/Overview/Overview";
import Analytics from "../../components/Analytics/Analytics";
import styles from "./dashboard.module.css";
import QuizType from "../../components/Quizz/QuizType";
import QuestionModal from "../../components/Quizz/QuestionModal";
import Success from "../../components/Success/Success";
import DeleteQuiz from "../../components/Delete/DeleteQuiz";
import Analysis from "../../components/Analysis/Analysis";
function Dashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(true); // modified for analysis
  const [analytics, setAnalytics] = useState(false); // set false after design
  const [analysis, setAnalysis] = useState(true);
  const [createQuizModal, setCreateQuizModal] = useState(false);
  const [quizTypeModal, setQuizTypeModal] = useState(false);
  const [questionsModal, setQuestionsModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [quizLink, setQuizLink] = useState(null);
  const [deleteQuiz, setDeleteQuiz] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [edit, setEdit] = useState(false);
  const handleAnalysis = (state) => {
    setAnalysis(state);
    setAnalytics(!state);
  };
  const handleEdit = (state) => {
    setEdit(state);
    if (state) {
      setQuizTypeModal(false);
      setQuestionsModal(true);
    }
  };
  const handleQuizId = (quizzId) => {
    setQuizId(quizzId);
  };
  const handleDeleteQuiz = (state) => {
    setDeleteQuiz(state);
  };
  const handleQuizLink = (link) => {
    setQuizLink(link);
  };
  // ============= Updates fro succes modal ============
  const handleSuccessModal = (state) => {
    setSuccessModal(state);
  };
  // ===================================================
  // ========== updates from quizType.jsx ============
  const [quizType, setQuizType] = useState("");
  const [quizName, setQuizName] = useState("");
  const handleCancel = () => {
    setCreateQuizModal(false);
    setQuizTypeModal(false);
    setQuestionsModal(false);
    setQuizName("");
    setQuizType("");
  };
  const handleContinue = () => {
    if (quizName === "" || quizType === "") {
      return alert("All Feilds are required");
    }
    setQuizTypeModal(false);
    setQuestionsModal(true);
  };
  const handleQuizType = (type) => {
    setQuizType(type);
  };
  const handleQuizName = (Name) => {
    setQuizName(Name);
  };
  // ========================================
  //  ===========Updates form Question modal =================
  const handleFinalCancel = () => {
    setCreateQuizModal(false);
    setQuizTypeModal(false);
    setQuestionsModal(false);
    setEdit(false);
    setQuizName("");
    setQuizType("");
  };
  // =========================================================
  const handleNav = (btnId) => {
    if (btnId === 1) {
      setOverview(true);
      setAnalytics(false);
    } else if (btnId === 2) {
      setOverview(false);
      setAnalytics(true);
    } else if (btnId === 3) {
      setCreateQuizModal(true);
      setQuizTypeModal(true);
    }
  };

  useEffect(() => {
    verify();
    // eslint-disable-next-line
  }, []);

  const jwToken = localStorage.getItem("jwToken");
  if (!jwToken) {
    return <Navigate to="/" />;
  }

  async function verify() {
    try {
      const jwToken = localStorage.getItem("jwToken");
      if (!jwToken) {
        return <Navigate to="/" />;
      }
      const headers = {
        "Content-Type": "application/json",
        authorization: jwToken,
      };

      await axios.post(`${backendBaseUrl}/verify`, {}, { headers: headers });
    } catch (err) {
      alert("Session timed out");
      return navigate("/");
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.navbarContainer}>
          <Navbar handleNav={handleNav} />
          <Outlet />
        </div>
        <div className={styles.content}>
          {overview ? (
            <div
              style={{
                width: "95%",
                margin: "auto",
                height: "90%",
                marginTop: "5%",
              }}
            >
              <Overview />
            </div>
          ) : analytics ? (
            <div
              style={{
                width: "95%",
                margin: "auto",
                height: "90%",
                marginTop: "3%",
              }}
            >
              <Analytics
                handleEdit={handleEdit}
                handleQuizId={handleQuizId}
                handleDeleteQuiz={handleDeleteQuiz}
                handleAnalysis={handleAnalysis}
              />
            </div>
          ) : analysis ? (
            <div
              style={{
                width: "95%",
                margin: "auto",
                height: "90%",
                marginTop: "3%",
                // border: "1px solid red",
              }}
            >
              <Analysis quizId={quizId} />
            </div>
          ) : (
            ""
          )}
        </div>
        {createQuizModal || successModal || deleteQuiz || edit ? (
          <div className={styles.modals}>
            {quizTypeModal ? (
              <QuizType
                handleQuizType={handleQuizType}
                handleQuizName={handleQuizName}
                handleContinue={handleContinue}
                handleCancel={handleCancel}
                quizType={quizType}
                quizName={quizName}
              />
            ) : (
              ""
            )}
            {questionsModal ? (
              <QuestionModal
                edit={edit}
                quizType={quizType}
                quizName={quizName}
                handleFinalCancel={handleFinalCancel}
                handleSuccessModal={handleSuccessModal}
                handleQuizLink={handleQuizLink}
                quizId={quizId}
                handleQuizType={handleQuizType} //
              />
            ) : (
              ""
            )}
            {successModal ? (
              <Success
                quizLink={quizLink}
                handleSuccessModal={handleSuccessModal}
              />
            ) : (
              ""
            )}
            {deleteQuiz ? (
              <DeleteQuiz quizId={quizId} handleDeleteQuiz={handleDeleteQuiz} />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Dashboard;
