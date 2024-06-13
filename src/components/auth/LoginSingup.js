import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./login.css";
import BackgroundImage from "../../assets/images/background.png";
import Logo from "../../assets/images/logo.png";
import { useLoginWithPasswordMutation, useSignUpNewUserMutation } from "../../service";
import Cookies from "universal-cookie";
import { setSession } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const cookies = new Cookies();
const LoginSingup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector((state) => state?.authState?.session);
  const [reqLogin, resLogin] = useLoginWithPasswordMutation();
  const [reqSinup, resSinup] = useSignUpNewUserMutation();
  const [isLogin, setIsLogin] = useState(true);
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(session){
      navigate('/')
    }
  },[session])


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (isLogin) {
      reqLogin({ email: inputUsername, password: inputPassword });
    } else {
      reqSinup({ email: inputUsername, password: inputPassword })
    }

    // await delay(500);
    // console.log(`Username :${inputUsername}, Password :${inputPassword}`);
    // if (inputUsername !== "admin" || inputPassword !== "admin") {
    //   setShow(true);
    // }
    // setLoading(false);
  };

  const handlePassword = () => { };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (resLogin?.isSuccess) {
      cookies.set("non_vote", resLogin?.data?.session)
      dispatch(setSession(resLogin?.data?.session))
      setLoading(false);
      navigate('/')
    }
    if (resLogin?.isError) {
      setLoading(false);
      setShow(true);
      setError(resLogin?.error?.error)
    }
  }, [resLogin]);

  useEffect(() => {
    if (resSinup?.isSuccess) {
      setLoading(false);
      toast.success("Singup SuccessFully, please check your mail", {
        position: "top-center",
      });
      setIsLogin(true);
    }
    if (resSinup?.isError) {
      setLoading(false);
      setShow(true);
      setError(resSinup?.error?.error)
    }
  }, [resSinup]);

  return (
    <div
      className="sign-in__wrapper"
      
    >
      {/* Overlay */}
      <div className="c-col_5 c-left_side">
        <img src={BackgroundImage} alt="image"/>
      </div>
      {/* Form */}
      <div className="c-col_5">
      <Form className="shadow bg-white" onSubmit={handleSubmit}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">{isLogin ? 'Sign In' : 'Sign up'}</div>
        {/* ALert */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            {error}
          </Alert>
        ) : (
          <div />
        )}
        <Toaster position="top-center" reverseOrder={false} />
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={inputUsername}
            placeholder="Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            {isLogin ? 'Login' : 'Signup'}
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            {isLogin ? 'Logging In...' : 'Signup In...'}
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Switch to Signup' : 'Switch to Login'}
          </Button>
        </div>
        {isLogin && (
          <div className="d-grid justify-content-end">
            <Button
              className="text-muted px-0"
              variant="link"
              onClick={handlePassword}
            >
              Forgot password?
            </Button>
          </div>
        )}
      </Form>
      </div>
      {/* Footer */}
      {/* <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hendrik C | &copy;2022
      </div> */}
    </div>
  );
};

export default LoginSingup;
