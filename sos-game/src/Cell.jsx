import React from "react";
import './App.css';

function Cell({ value, onClick, color }) {
  return (
    <button
      className="cell"
      style={{ color: color }} // Renk dinamik olarak oyuncuya göre değişecek
      onClick={onClick}
    >
      {value}
    </button>
  );
}

export default Cell;
