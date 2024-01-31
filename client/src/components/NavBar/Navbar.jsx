import React, { useState } from "react";
import styles from "./navbar.module.css";
function Navbar({ handleNav }) {
  const [btnClicked, setBtnClicked] = useState(1);

  const handleClick = (btnId) => {
    setBtnClicked(btnId);
    handleNav(btnId);
  };

  const logout = () => {
    localStorage.removeItem("jwToken");
    window.location.reload();
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <div className={styles.title}>QUIZZIE</div>
          <div className={styles.menu}>
            <div>
              <button
                style={{
                  backgroundColor: btnClicked === 1 ? "#FFF" : "",
                  boxShadow:
                    btnClicked === 1
                      ? "0px 0px 14px 0px rgba(0, 0, 0, 0.12)"
                      : "",
                }}
                onClick={() => handleClick(1)}
              >
                Dashboard
              </button>
            </div>
            <div>
              <button
                style={{
                  backgroundColor: btnClicked === 2 ? "#FFF" : "",
                  boxShadow:
                    btnClicked === 2
                      ? "0px 0px 14px 0px rgba(0, 0, 0, 0.12)"
                      : "",
                }}
                onClick={() => handleClick(2)}
              >
                Analytics
              </button>
            </div>
            <div>
              <button
                style={{
                  backgroundColor: btnClicked === 3 ? "#FFF" : "",
                  boxShadow:
                    btnClicked === 3
                      ? "0px 0px 14px 0px rgba(0, 0, 0, 0.12)"
                      : "",
                }}
                onClick={() => handleClick(3)}
              >
                Create Quiz
              </button>
            </div>
          </div>
          <div className={styles.logout}>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
