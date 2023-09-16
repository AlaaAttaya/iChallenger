import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Layout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
