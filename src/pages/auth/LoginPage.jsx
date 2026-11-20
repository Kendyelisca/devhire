import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const loggedInUser = login(email, password);

      navigate(
        loggedInUser.role === "employer" ? "/employer" : "/applications",
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand">
        <span className="brand-icon">&lt;/&gt;</span>
        <span>
          dev<span className="brand-accent">hire</span>
        </span>
      </Link>

      <section className="auth-card">
        <span className="section-kicker">WELCOME BACK</span>

        <h1>Sign in to your account.</h1>

        <p className="auth-description">
          Your next opportunity is waiting. Let's get you back in.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="auth-password-heading">
            <label htmlFor="password">Password</label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">
            Sign in <span>→</span>
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </section>

      <p className="auth-footer">
        Built for developers. Designed for what's next.
      </p>
    </main>
  );
}
