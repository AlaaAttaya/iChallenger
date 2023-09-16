import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import LandingPage from "../../pages/LandingPage";
import "./styles.css";
const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main>
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
