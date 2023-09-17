import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import LandingPage from "../../pages/LandingPage";
import "./styles.css";
import "../../styles/global.css";

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
