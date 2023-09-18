import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import LoadingHOC from "./components/LoadingHOC";
import "./styles/app.css";
import "./styles/global.css";
const WrappedLandingPage = LoadingHOC(LandingPage);
const WrappedLoginPage = LoadingHOC(LoginPage);
const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<WrappedLandingPage />} />
            <Route path="/Home" element={<WrappedLandingPage />} />
            <Route path="/Login" element={<WrappedLoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
