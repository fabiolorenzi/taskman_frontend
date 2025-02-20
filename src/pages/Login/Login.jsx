import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";

import "./Login.scss";

function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [result, setResult] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (localStorage.getItem("passcode")) {
            navigate("/dashboard");
        };
    }, []);

    useEffect(() => {
        if (result) {
            if (result?.data) {
                alert("Login successfully");
                localStorage.setItem("passcode", result.data.passcode);
                navigate("/dashboard");
            } else {
                alert("Login failed, please try again");
            };
        };
    }, [result]);

    const handleChange = e => {
        e.preventDefault();
        setLoginData({...loginData, [e.target.name]: e.target.value});
    };

    const handleKey = e => {
        if (e.key === "Enter") {
            submitButton(e);
        };
    };

    const cancelButton = e => {
        e.preventDefault();
        setLoginData({
            email: "",
            password: ""
        });
    };

    const submitButton = e => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/v1/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "email": loginData.email,
                "password": loginData.password
            })
        })
        .then(resp => resp.json())
        .then(data => setResult(data))
        .catch(err => {
            console.log(err);
            alert("Error. Please try again");
        });
    };

    return(
        <div className="loginPage">
            <Helmet>
                <title>Taskman | Login</title>
            </Helmet>
            <div className="loginPage_container">
                <div className="login_title">
                    <h1>Login</h1>
                </div>
                <div className="login_body">
                    <div className="login_inputLineFirst">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            autoComplete="off"
                            onKeyDown={e => handleKey(e)}
                        />
                    </div>
                    <div className="login_inputLineSecond">
                        <label htmlFor="password">Password</label>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"} name="password" value={loginData.password}
                                onChange={handleChange}
                                autoComplete="off"
                                onKeyDown={e => handleKey(e)}
                            />
                            <button onClick={() => setShowPassword(!showPassword)}>Show</button>
                        </div>
                    </div>
                    <div className="login_inputLineThird">
                        <Button func={cancelButton} text="Cancel" isCancel />
                        <Button func={submitButton} text="Submit" isSubmit />
                    </div>
                </div>
                <div className="login_linkSection">
                    <p>If you don't have an accout, please <NavLink to="/signin" className="login_link">Sign in</NavLink></p>
                </div>
            </div>
        </div>
    );
};

export default Login;