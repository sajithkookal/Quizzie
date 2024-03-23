import React, { useState } from "react";
import styles from "./auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendBaseUrl } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Auth() {
  const [btnClicked, setBtnClicked] = useState(1);
  const [signup, setSignup] = useState(true);
  const [login, setLogin] = useState(false);
  const [apiRequested, setApiRequested] = useState(false);
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
    email: false,
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
  // Use a regular expression to validate the email format
  const validateEmail = (newEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(newEmail);
    return isValid;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (signup === true) {
      let { Name, email, password, confirmPassword } = signupData;
      Name = Name.trim();
      email = email.trim();
      let signupPayload = signupData;
      let syncErrors = errors;
      signupPayload = { name: Name, email, password };
   //   console.log(signupPayload);
      if (Name.length < 1) {
        syncErrors = { ...syncErrors, Name: true };
        setErrors((prevData) => ({ ...prevData, Name: true }));
      }
      if (email.length < 1 || !validateEmail(email)) {
        syncErrors = { ...syncErrors, email: true };
        setErrors((prevData) => ({ ...prevData, email: true }));
      }
      if (password !== confirmPassword) {
        syncErrors = { ...syncErrors, confirmPassword: true };
        setErrors((prevData) => ({ ...prevData, confirmPassword: true }));
      }
      if (password.length < 6) {
        syncErrors = { ...syncErrors, password: true };
        setErrors((prevData) => ({ ...prevData, password: true }));
        toast("Minimum 6 characters required");
      }
      if (goodToPost(syncErrors)) {
        setApiRequested(true);
        try {
          const response = await axios.post(`${backendBaseUrl}/api/signup`, signupPayload);
          
              if (response.data.success) {
                toast("Account Created Successfully");

                setSignUpData((prevData) => clearFormData(prevData));
                setSignup(false);
                setLogin(true);
                setBtnClicked(() => 2);
              } else {
                alert(response.data.error);
              }
           
           
        } catch (error) {
          setSignUpData((prevData) => clearFormData(prevData));
         return alert(error.response.data.error);
        }
      }
    } else if (login === true) {
      setApiRequested(true);
      try {
        axios
          .post(`${backendBaseUrl}/api/login`, loginData)
          .then((res) => {

            if (res.data.status === "OK") {
              setLoginData(() => clearFormData(loginData));
              localStorage.setItem("jwToken", res.data.token);
              navigate("/dashboard");
            } else {
              alert(res.data.error);
            }
          })
          .catch((err) => {
            return alert(err.response.data.error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className={styles.container}>
        <ToastContainer />
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
                    fontSize: "1.2rem"
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
                    fontSize: "1.2rem"
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
                    placeholder={errors.email ? "Invalid Email" : ""}
                    style={{
                      border: errors.email ? "1px solid red" : "",
                    }}
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
                    fontSize: "1.2rem"
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
                    flex: "35%",
                    justifyContent: "flex-end",             
                    display: signup ? "block" : "none",
                    fontSize: "1.2rem",
                    textAlign:"right"
                  }}
                >
                  Confirm Password
                </div>
                <div
                  style={{
                    flex: "80%",
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
                <button type="submit">
                  {signup ? "Sign-Up":  apiRequested ? "Loading..." : "Log In"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Auth;
