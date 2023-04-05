import React from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router";
import { FcUndo } from "react-icons/fc";

export default function Header() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="title">Get Working</h1>
      <button className="btn btn-secondary back" onClick={() => handleGoBack()}>
        <FcUndo/>
      </button>
    </header>
  );
}
