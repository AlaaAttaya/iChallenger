import React, { useEffect, useState } from "react";
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
import ProfilePage from "./pages/ProfilePage";
import { refreshToken, verifyToken } from "./services/auth";

const WrappedLandingPage = LoadingHOC(LandingPage);
const WrappedContactusPage = LoadingHOC(ContactusPage);
const WrappedLoginPage = LoadingHOC(LoginPage);
const WrappedForgotPasswordPage = LoadingHOC(ForgotPasswordPage);
const WrappedProfilePage = LoadingHOC(ProfilePage);

const App = () => {
  const [userSignedIn, setUserSignedIn] = useState(false);

  const handleTokenVerification = async () => {
    try {
      const userData = await verifyToken();
      if (!userData) {
        localStorage.clear();
        window.location.href = "/Login";
      }
    } catch (error) {
      localStorage.clear();
      window.location.href = "/Login";
    }
  };

  const handleTokenChange = () => {
    const token = localStorage.getItem("token");
    setUserSignedIn(!!token);

    const currentPath = window.location.pathname;

    if (currentPath === "/Profile" && !token) {
      window.location.href = "/Login";
    } else if (currentPath === "/Profile" && userSignedIn) {
      handleTokenVerification();
    }
  };

  useEffect(() => {
    handleTokenChange();

    const refreshInterval = setInterval(() => {
      if (userSignedIn) {
        refreshToken()
          .then((newToken) => {
            if (!newToken) {
              clearInterval(refreshInterval);
            }
          })
          .catch((error) => {
            console.error("Token refresh failed:", error);
            localStorage.clear();
          });
      }
    }, 360000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [userSignedIn]);

  window.addEventListener("storage", (e) => {
    if (e.key === "token") {
      handleTokenChange();
    }
  });
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
            <Route path="/Profile" element={<WrappedProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
