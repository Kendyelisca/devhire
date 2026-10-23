import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import JobDetailsPage from "./pages/JobDetailsPage";
import jobs from "./data/jobs";

function HomePage() {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Filter jobs by title, company, location, type, and skills.
  // Every word in the search must match somewhere in the job details.
  const filteredJobs = jobs.filter((job) => {
    const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const searchableText = [
      job.role,
      job.company,
      job.location,
      job.type,
      ...job.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchTerms.every((term) => searchableText.includes(term));
  });

  function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      setMessage("Enter a role, skill, or company to get started.");
      return;
    }

    setMessage(`Showing results for "${query.trim()}".`);

    document.getElementById("jobs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handlePopularSearch(searchTerm) {
    setQuery(searchTerm);
    setMessage(`Showing results for "${searchTerm}".`);

    document.getElementById("jobs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="DevHire home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            dev<span className="brand-accent">hire</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#jobs">Find jobs</a>
          <a href="#how-it-works">How it works</a>
          <a href="#companies">For companies</a>
        </nav>

        <div className="nav-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setMessage("Developer sign-in is coming soon!")}
          >
            Log in
          </button>

          <button
            className="btn btn-primary nav-cta"
            onClick={() => setMessage("Account creation is coming soon!")}
          >
            Get started <span aria-hidden="true">↗</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              THE NEXT CHAPTER OF YOUR CAREER
            </div>

            <h1>
              Your skills deserve
              <br />a <span className="gradient-text">better opportunity.</span>
            </h1>

            <p className="hero-description">
              Meet the companies building the future. Discover developer jobs,
              showcase your work, and find where you belong.
            </p>

            <form className="search-bar" onSubmit={handleSearch}>
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>

              <input
                aria-label="Search jobs"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setMessage("");
                }}
                placeholder="Job title, skill, or company..."
              />

              <button className="btn btn-primary search-button" type="submit">
                Find jobs <span aria-hidden="true">→</span>
              </button>
            </form>

            {message && (
              <p className="feedback" role="status">
                {message}
              </p>
            )}

            <div className="popular-searches">
              <span>Popular:</span>

              <a
                href="#jobs"
                onClick={(event) => {
                  event.preventDefault();
                  handlePopularSearch("React Developer");
                }}
              >
                React
              </a>

              <a
                href="#jobs"
                onClick={(event) => {
                  event.preventDefault();
                  handlePopularSearch("Python Developer");
                }}
              >
                Python
              </a>

              <a
                href="#jobs"
                onClick={(event) => {
                  event.preventDefault();
                  handlePopularSearch("Remote Developer");
                }}
              >
                Remote
              </a>

              <a
                href="#jobs"
                onClick={(event) => {
                  event.preventDefault();
                  handlePopularSearch("Full Stack Developer");
                }}
              >
                Full Stack
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Developer profile preview">
            <div className="visual-glow" />

            <div className="code-card">
              <div className="code-top">
                <div className="window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span>developer.js</span>
                <span className="code-language">JS</span>
              </div>

              <pre>
                <code>
                  <span className="code-purple">const</span> developer = {"{"}
                  {"\n"} name: <span className="code-green">'Your Name'</span>,
                  {"\n"} skills: [<span className="code-green">'React'</span>,{" "}
                  <span className="code-green">'Node.js'</span>],
                  {"\n"} openToWork: <span className="code-orange">true</span>,
                  {"\n"} dreamJob:{" "}
                  <span className="code-green">'Your next big thing'</span>
                  {"\n"}
                  {"}"}
                </code>
              </pre>

              <div className="code-footer">
                <span>
                  <span className="status-dot" /> Profile ready
                </span>
                <span>devhire.app</span>
              </div>
            </div>

            <div className="floating-card profile-card">
              <div className="avatar">JD</div>

              <div className="profile-info">
                <strong>Jane Developer</strong>
                <span>Full Stack Engineer</span>

                <div className="profile-skills">
                  <span>React</span>
                  <span>Node.js</span>
                </div>
              </div>

              <span className="verified">✓</span>
            </div>

            <div className="floating-card match-card">
              <span className="match-icon">✳</span>

              <div>
                <strong>Great things start here.</strong>
                <span>Your next opportunity awaits.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" id="companies">
          <p>BUILT FOR THE PEOPLE WHO BUILD THE FUTURE</p>

          <div className="trust-items">
            <span>⌘ Developers</span>
            <span>◈ Startups</span>
            <span>✳ Tech teams</span>
            <span>↗ Remote talent</span>
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="section-heading">
            <div>
              <span className="section-kicker">OPPORTUNITIES</span>

              <h2>
                Find your next <span className="gradient-text">big move.</span>
              </h2>

              <p>
                A preview of the opportunities DevHire is being built to help
                you discover.
              </p>
            </div>

            <a
              className="view-all"
              href="#home"
              onClick={() => {
                setQuery("");
                setMessage("");
              }}
            >
              Explore opportunities <span>→</span>
            </a>
          </div>

          {query.trim() && (
            <p className="search-summary" aria-live="polite">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
              found
            </p>
          )}

          <div className="job-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <article
                  className="job-card"
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="job-card-top">
                    <div className={`company-logo ${job.color}`}>
                      {job.initials}
                    </div>

                    <span className="job-type">{job.type}</span>
                  </div>

                  <h3>{job.role}</h3>

                  <p className="company-name">
                    {job.company} <span>·</span> {job.location}
                  </p>

                  <div className="job-tags">
                    {job.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="job-card-bottom">
                    <strong>{job.salary}</strong>

                    <button
                      className="apply-button"
                      aria-label={`View ${job.role} at ${job.company}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                    >
                      ↗
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="no-results">
                No jobs found. Try another role or skill.
              </p>
            )}
          </div>

          <p className="demo-note">
            Demo listings only — these are sample opportunities, not verified
            vacancies.
          </p>
        </section>

        <section className="how-section" id="how-it-works">
          <span className="section-kicker">SIMPLE BY DESIGN</span>

          <h2>
            Your next move starts with{" "}
            <span className="gradient-text">three steps.</span>
          </h2>

          <div className="steps-grid">
            <article>
              <span>01</span>
              <h3>Build your profile</h3>
              <p>
                Showcase your skills, projects, and the work you're proud of.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Discover opportunities</h3>
              <p>
                Explore roles that match your skills, goals, and preferred work
                style.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Make your move</h3>
              <p>Connect with teams and take the next step in your career.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            dev<span className="brand-accent">hire</span>
          </span>
        </a>

        <p>Built for developers. Designed for what's next.</p>
        <span>© 2026 DevHire · Project in development</span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
