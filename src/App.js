import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Signin from "./pages/Signin/Signin.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Logout from "./pages/Logout/Logout.jsx";
import Error from "./pages/Error/Error.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return(
        <div className="app">
            <Header />
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;