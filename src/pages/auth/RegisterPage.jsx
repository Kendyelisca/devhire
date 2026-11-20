import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const { role } = useParams();
  const { register } = useAuth();
  const navigate = useNavigate();

  const validRole = role === "employer" ? "employer" : "candidate";

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      const newUser = register({
        name,
        email,
        password,
        role: validRole,
        company,
      });

      navigate(newUser.role === "employer" ? "/employer" : "/applications");
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
        <span className="section-kicker">JOIN DEVHIRE</span>

        <h1>Create your account.</h1>

        <p className="auth-description">
          {validRole === "employer"
            ? "Find and connect with exceptional tech talent."
            : "Discover opportunities and take your developer career forward."}
        </p>

        <div className="auth-role-switch">
          <Link
            to="/register/candidate"
            className={validRole === "candidate" ? "active" : ""}
          >
            I'm a developer
          </Link>

          <Link
            to="/register/employer"
            className={validRole === "employer" ? "active" : ""}
          >
            I'm hiring
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">
            {validRole === "employer" ? "Your name" : "Full name"}
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          {validRole === "employer" && (
            <>
              <label htmlFor="company">Company name</label>
              <input
                id="company"
                type="text"
                placeholder="Your company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">
            Create account <span>→</span>
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>

      <p className="auth-footer">
        Built for developers. Designed for what's next.
      </p>
    </main>
  );
}
