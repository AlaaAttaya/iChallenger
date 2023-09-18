import React from "react";
import "./styles/app.css";
import "./styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingHOC from "./components/LoadingHOC";
import LandingPage from "./pages/LandingPage";
import ContactusPage from "./pages/ContactusPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const WrappedLandingPage = LoadingHOC(LandingPage);
const WrappedContactusPage = LoadingHOC(ContactusPage);
const WrappedLoginPage = LoadingHOC(LoginPage);
const WrappedForgotPasswordPage = LoadingHOC(ForgotPasswordPage);

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<WrappedLandingPage />} />
            <Route path="/Home" element={<WrappedLandingPage />} />
            <Route path="/Contactus" element={<WrappedContactusPage />} />

            <Route path="/Login" element={<WrappedLoginPage />} />
            <Route
              path="/ForgotPassword"
              element={<WrappedForgotPasswordPage />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
