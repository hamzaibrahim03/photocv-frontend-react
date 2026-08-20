import React from "react";
import "../assets/css/Loader.css";

function Loader({ show }) {
  if (!show) return null;

  return (
    <>
      <div className="loader-overlay">
        <div className="loader"></div>
        <p>Loading, please wait...</p>
      </div>
    </>
  );
}

export default Loader;
