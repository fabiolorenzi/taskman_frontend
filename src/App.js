import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Signin from "./pages/Signin/Signin.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import CreateProject from "./pages/CreateProject/CreateProject.jsx";
import Project from "./pages/Project/Project.jsx";
import UpdateProject from "./pages/UpdateProject/UpdateProject.jsx";
import CreateTeam from "./pages/CreateTeam/CreateTeam.jsx";
import UpdateTeam from "./pages/UpdateTeam/UpdateTeam.jsx";
import DeleteTeam from "./pages/DeleteTeam/DeleteTeam.jsx";
import DeleteProject from "./pages/DeleteProject/DeleteProject.jsx";
import ProjectTable from "./pages/ProjectTable/ProjectTable.jsx";
import CreateIteration from "./pages/CreateIteration/CreateIteration.jsx";
import UpdateIteration from "./pages/UpdateIteration/UpdateIteration.jsx";
import DeleteIteration from "./pages/DeleteIteration/DeleteIteration.jsx";
import CreateTask from "./pages/CreateTask/CreateTask.jsx";
import Task from "./pages/Task/Task.jsx";
import DeleteTask from "./pages/DeleteTask/DeleteTask.jsx";
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
                <Route path="/projects" element={<Projects />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/project" element={<Project />} />
                <Route path="/update-project" element={<UpdateProject />} />
                <Route path="/create-team" element={<CreateTeam />} />
                <Route path="/update-team" element={<UpdateTeam />} />
                <Route path="/delete-team" element={<DeleteTeam />} />
                <Route path="/delete-project" element={<DeleteProject />} />
                <Route path="/project-table" element={<ProjectTable />} />
                <Route path="/create-iteration" element={<CreateIteration />} />
                <Route path="/update-iteration" element={<UpdateIteration />} />
                <Route path="/delete-iteration" element={<DeleteIteration />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/task" element={<Task />} />
                <Route path="/delete-task" element={<DeleteTask />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;