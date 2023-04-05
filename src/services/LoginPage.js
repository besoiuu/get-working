import { useRef, useState } from "react";
import { signup, login, logout, useAuth } from "./firebase";
import { useNavigate } from "react-router";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentUser = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSignup() {
    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
      setIsLoggedIn(true);
      emailRef.current.value = "";
      passwordRef.current.value = "";
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      setIsLoggedIn(false);
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  function handleGoToPortfolio() {
    navigate("/portfolio");
  }

  function handleTakeAPeek() {
    navigate("/guest");
  }

  return (
    <div id="main" className="loginContainer">
      {isLoggedIn && (
        <div className="loggedInfo m-3">
          Currently logged in as: {currentUser?.email}{" "}
        </div>
      )}
      {!isLoggedIn && (
        <div id="fields" className="mb-3">
          <div className="unloggedInfo m-3">Login to your portfolio</div>
          <input
            ref={emailRef}
            className="form-control mb-2"
            placeholder="Email"
          />
          <input
            ref={passwordRef}
            className="form-control mb-2"
            type="password"
            placeholder="Password"
          />
        </div>
      )}
      {!isLoggedIn && (
        <div className="mb-3">
          <button
            disabled={loading}
            className="btn btn-primary me-2"
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button
            disabled={loading}
            className="btn btn-primary me-2"
            onClick={handleLogin}
          >
            Log In
          </button>
          <button
            disabled={loading}
            className="btn btn-secondary me-2"
            onClick={handleLogout}
          >
            Log Out
          </button>
          <button className="btn btn-secondary" onClick={handleTakeAPeek}>
            Take a peek
          </button>
        </div>
      )}
      {isLoggedIn && (
        <div className="mb-3">
          <button
            disabled={loading}
            className="btn btn-primary me-2"
            onClick={handleGoToPortfolio}
          >
            Go to Portfolio
          </button>
          <button
            disabled={loading}
            className="btn btn-secondary me-2"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
