import React from "react";
import styles from "./success.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Success({ handleSuccessModal, quizLink }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.close}>
          <button
            onClick={() => {
              handleSuccessModal(false);
              window.location.reload();
            }}
          >
            X
          </button>
        </div>
        <ToastContainer />
        <h1>
          Congrats your Quiz is
          <br /> Published!
        </h1>
        <div className={styles.link}>{quizLink}</div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(quizLink);
            return toast("Link Copied to Clipboard");
          }}
          className={styles.share}
        >
          Share
        </button>
      </div>
    </>
  );
}

export default Success;
