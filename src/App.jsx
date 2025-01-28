import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const Card = () => {
  return (
    <div className="card">
      <h2>Card Component</h2>
    </div>
  );
};

const App = () => {
  return (
    <div className="card-container">
      <h2>Arrow Component</h2>
      <Card />
      <Card />
      <Card />
    </div>
  );
};

export default App;
