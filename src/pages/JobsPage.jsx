import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import jobs from "../data/jobs";

function JobsPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="app">
      <header className="navbar">
        <Link className="brand" to="/" aria-label="DevHire home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            dev<span className="brand-accent">hire</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/jobs">Find jobs</Link>
          <Link to="/#how-it-works">How it works</Link>
        </nav>

        <div className="nav-actions">
          <Link className="btn btn-ghost" to="/">
            Home
          </Link>
          <span className="section-kicker">YOUR NEXT MOVE</span>
        </div>
      </header>

      <main>
        <section className="jobs-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">THE DEVHIRE JOB BOARD</span>
              <h1>
                Find your next{" "}
                <span className="gradient-text">opportunity.</span>
              </h1>
              <p>
                Explore developer roles, discover new teams, and find work that
                matches your skills.
              </p>
            </div>
          </div>

          <form
            className="search-bar"
            onSubmit={(event) => event.preventDefault()}
          >
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              aria-label="Search all jobs"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by role, skill, company, or location..."
            />

            {query && (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            )}
          </form>

          <p className="search-summary" aria-live="polite">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "opportunity" : "opportunities"} found
          </p>

          <div className="job-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <article className="job-card" key={job.id}>
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
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      ↗
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="no-results">
                No matching jobs yet. Try a different keyword.
              </p>
            )}
          </div>

          <p className="demo-note">
            Demo listings only — these are sample opportunities, not verified
            vacancies.
          </p>

          <p>
            <Link to="/">← Back to the homepage</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default JobsPage;
