import React from 'react'
import '../styles/Header.css'
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  }

  return (
    <header className="header">
        <h1 className="title">Get Working</h1>
        <button className='btn btn-secondary back' onClick={() => handleGoBack()}>Go Back</button>
      </header>
  )
}
