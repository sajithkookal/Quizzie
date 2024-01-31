import React, { useState } from "react";
import styles from "./auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendBaseUrl } from "../../constants";
function Auth() {
  const [btnClicked, setBtnClicked] = useState(1);
  const [signup, setSignup] = useState(true);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const [signupData, setSignUpData] = useState({
    Name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    Name: false,
    password: false,
    confirmPassword: false,
  });
  const handleAuthBtns = (buttonId) => {
    setBtnClicked(buttonId);
    if (buttonId === 1) {
      setSignup(true);
      setLogin(false);
    } else if (buttonId === 2) {
      setSignup(false);
      setLogin(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (signup) {
      setSignUpData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevData) => ({ ...prevData, [name]: false }));
    } else if (login) {
      setLoginData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevData) => ({ ...prevData, [name]: false }));
    }
  };

  const validName = (Name) => {
    for (let i = 0; i < Name.length; i++) {
      if (isNaN(Name[i]) === false) {
        return false;
      }
    }
    return true;
  };

  const clearFormData = (obj) => {
    const clearedObj = {};

    for (let key in obj) {
      clearedObj[key] = "";
    }

    return clearedObj;
  };
  const goodToPost = (syncErrors) => {
    for (let err in syncErrors) {
      if (syncErrors[err] === true) {
        return false;
      }
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (signup === true) {
      let { Name, email, password, confirmPassword } = signupData;
      Name = Name.trim();
      email = email.trim();
      let signupPayload = signupData;
      let syncErrors = errors;
      signupPayload = { name: Name, email, password };
      if (!validName(signupPayload.name)) {
        syncErrors = { ...syncErrors, Name: true };
        setErrors((prevData) => ({ ...prevData, Name: true }));
      }
      if (password !== confirmPassword) {
        syncErrors = { ...syncErrors, confirmPassword: true };
        setErrors((prevData) => ({ ...prevData, confirmPassword: true }));
      }
      if (password.length < 6) {
        syncErrors = { ...syncErrors, password: true };
        setErrors((prevData) => ({ ...prevData, password: true }));
      }
      if (goodToPost(syncErrors)) {
        axios
          .post(`${backendBaseUrl}/signup`, signupPayload)
          .then((res) => {
            if (res.data.status === "OK") {
              alert("Account Created Successfully");
              setSignUpData((prevData) => clearFormData(prevData));
              setSignup(false);
              setLogin(true);
              setBtnClicked(() => 2);
            }
          })
          .catch((err) => {
            setSignUpData((prevData) => clearFormData(prevData));
            if (err.response.data.status >= 500) {
              return alert("User already Exists/ something went wrong");
            }
          });
      }
    } else if (login === true) {
      axios
        .post(`${backendBaseUrl}/login`, loginData)
        .then((res) => {
          setLoginData(() => clearFormData(loginData));
          localStorage.setItem("jwToken", res.data.jwToken);
          navigate("/dashboard");
        })
        .catch((err) => {
          if (err.response.data.status === 404) {
            return alert("User doesn't exist");
          } else if (err.response.data.status === 401) {
            return alert("Incorrect Credentials");
          } else {
            return alert("Something went wrong");
          }
        });
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>QUIZZIE</div>
        <div className={styles.buttonsContainer}>
          <button
            className={
              btnClicked === 1 ? styles.clickedAuth : styles.normalAuth
            }
            onClick={() => handleAuthBtns(1)}
          >
            Sign Up
          </button>
          <button
            className={
              btnClicked === 2 ? styles.clickedAuth : styles.normalAuth
            }
            onClick={() => handleAuthBtns(2)}
          >
            Log In
          </button>
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.feildContainer}>
              <div>
                <div
                  style={{
                    flex: "30%",
                    justifyContent: "flex-end",
                    display: signup ? "" : "none",
                  }}
                >
                  Name
                </div>
                <div
                  style={{
                    flex: "70%",
                    justifyContent: "flex-end",
                  }}
                >
                  <input
                    placeholder={errors.Name ? "Invalid Name" : ""}
                    style={{
                      display: signup ? "" : "none",
                      border: errors.Name ? "1px solid red" : "",
                    }}
                    onChange={handleChange}
                    required={signup}
                    type="text"
                    name="Name"
                    value={errors.Name && signup ? "" : signupData.Name}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    flex: "30%",
                    justifyContent: "flex-end",
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    flex: "70%",
                    justifyContent: "flex-end",
                  }}
                >
                  <input
                    value={signup ? signupData.email : loginData.email}
                    required
                    type="email"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    flex: "30%",
                    justifyContent: "flex-end",
                  }}
                >
                  Password
                </div>
                <div
                  style={{
                    flex: "70%",
                    justifyContent: "flex-end",
                  }}
                >
                  <input
                    placeholder={errors.password ? "weak password" : ""}
                    value={
                      signup && errors.password
                        ? ""
                        : login && signup === false
                        ? loginData.password
                        : signupData.password
                    }
                    style={{
                      border: errors.password ? "1px solid red" : "",
                    }}
                    required
                    type="password"
                    name="password"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    flex: "30%",
                    justifyContent: "flex-end",
                    display: signup ? "block" : "none",
                  }}
                >
                  Confirm Password
                </div>
                <div
                  style={{
                    flex: "70%",
                    justifyContent: "flex-end",
                  }}
                >
                  <input
                    placeholder={
                      errors.confirmPassword ? "password doesn't match" : ""
                    }
                    style={{
                      display: signup ? "" : "none",
                      border: errors.confirmPassword ? "1px solid red" : "",
                    }}
                    required={signup}
                    type="password"
                    name="confirmPassword"
                    value={
                      errors.confirmPassword && signup
                        ? ""
                        : signupData.confirmPassword
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.submitBtnContainer}>
                <button type="submit">{signup ? "Sign-Up" : "Log In"}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Auth;
