import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { registerUser, loginUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

const LoginComponent = () => {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     router.push("/dashboard");
  //   }
  // }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, []);

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    console.log("registering");
    dispatch(registerUser({ username, name, email, password }));
  };

  const handleLogin = () => {
    console.log("login");
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign in" : "Sign Up"}
            </p>
            {authState?.message?.message}

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <input
                className={styles.inputField}
                type="text"
                placeholder="Email"
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <input
                className={styles.inputField}
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign in" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            {userLoginMethod ? (
              <p>Don't have an account</p>
            ) : (
              <p>Already have an account</p>
            )}
            <div
              onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }}
              style={{
                color: "black",
                backgroundColor: "white",
                textAlign: "center",
              }}
              className={styles.buttonWithOutline}
            >
              <p>{userLoginMethod ? "Sign up" : "Sign in"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
