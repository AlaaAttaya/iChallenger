import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./styles.css";
import "../../styles/global.css";

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main></main>
      <Footer />
    </div>
  );
};

export default Layout;
