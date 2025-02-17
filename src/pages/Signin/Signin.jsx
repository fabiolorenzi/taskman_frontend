import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";

import "./Signin.scss";

function Signin() {
    const [userData, setUserData] = useState({
        name: "",
        surname: "",
        email: "",
        password: ""
    });
    const [result, setResult] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (sessionStorage.getItem("passcode")) {
            navigate("/dashboard");
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (result) {
            if (result?.data) {
                alert("User created successfully");
                navigate("/signin");
                setUserData({
                    name: "",
                    surname: "",
                    email: "",
                    password: ""
                });
            } else {
                alert("Creation failed, please try again");
            };
        };
        // eslint-disable-next-line
    }, [result]);

    const handleChange = e => {
        e.preventDefault();
        setUserData({...userData, [e.target.name]: e.target.value});
    };

    const handleKey = e => {
        if (e.key === "Enter") {
            submitButton(e);
        };
    };

    const cancelButton = e => {
        e.preventDefault();
        setUserData({
            name: "",
            surname: "",
            email: "",
            password: ""
        });
    };

    const submitButton = e => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/v1/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "name": userData.name,
                "surname": userData.surname,
                "email": userData.email,
                "password": userData.password
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
        <div className="signinPage">
            <Helmet>
                <title>Taskman | Sign in</title>
            </Helmet>
            <div className="signinPage_container">
                <div className="signin_title">
                    <h1>Sign in</h1>
                </div>
                <div className="signin_body">
                    <div className="signin_inputLineFirst">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            autoComplete="off"
                            onKeyDown={e => handleKey(e)}
                        />
                    </div>
                    <div className="signin_inputLineFirst">
                        <label htmlFor="surname">Surname</label>
                        <input
                            type="text"
                            name="surname"
                            value={userData.surname}
                            onChange={handleChange}
                            autoComplete="off"
                            onKeyDown={e => handleKey(e)}
                        />
                    </div>
                    <div className="signin_inputLineFirst">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            autoComplete="off"
                            onKeyDown={e => handleKey(e)}
                        />
                    </div>
                    <div className="signin_inputLineSecond">
                        <label htmlFor="password">Password</label>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"} name="password" value={userData.password}
                                onChange={handleChange}
                                autoComplete="off"
                                onKeyDown={e => handleKey(e)}
                            />
                            <button onClick={() => setShowPassword(!showPassword)}>Show</button>
                        </div>
                    </div>
                    <div className="signin_inputLineThird">
                        <Button func={cancelButton} text="Cancel" isCancel />
                        <Button func={submitButton} text="Submit" isSubmit />
                    </div>
                </div>
                <div className="signin_linkSection">
                    <p>If you already have an accout, please <NavLink to="/login" className="login_link">Login</NavLink></p>
                </div>
            </div>
        </div>
    );
};

export default Signin;