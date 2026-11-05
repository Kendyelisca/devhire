import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import jobs from "../data/jobs";

function JobsPage() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedEmployment, setSelectedEmployment] = useState("All");
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("recommended");
  const [activeTab, setActiveTab] = useState("all");
  const [savedJobs, setSavedJobs] = useState(() => {
    const storedJobs = localStorage.getItem("devhire-saved-jobs");
    return storedJobs ? JSON.parse(storedJobs) : [];
  });
  useEffect(() => {
    localStorage.setItem("devhire-saved-jobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs((currentSavedJobs) =>
      currentSavedJobs.includes(jobId)
        ? currentSavedJobs.filter((id) => id !== jobId)
        : [...currentSavedJobs, jobId],
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesTab = activeTab === "all" || savedJobs.includes(job.id);
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

    const matchesSearch = searchTerms.every((term) =>
      searchableText.includes(term),
    );

    const matchesType =
      selectedType === "All" ||
      job.location.toLowerCase().includes(selectedType.toLowerCase());

    const matchesEmployment =
      selectedEmployment === "All" ||
      job.type.toLowerCase() === selectedEmployment.toLowerCase();

    return matchesSearch && matchesType && matchesEmployment && matchesTab;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "salary-high") {
      const salaryA = Number(a.salary.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
      const salaryB = Number(b.salary.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);

      return salaryB - salaryA;
    }

    if (sortBy === "salary-low") {
      const salaryA = Number(a.salary.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
      const salaryB = Number(b.salary.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);

      return salaryA - salaryB;
    }

    return 0;
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
          <div className="job-filters" aria-label="Filter jobs by work type">
            {["All", "Remote", "Hybrid", "On-site"].map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-button ${
                  selectedType === type ? "active" : ""
                }`}
                aria-pressed={selectedType === type}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div
            className="job-filters"
            aria-label="Filter jobs by employment type"
          >
            {["All", "Full-time", "Contract"].map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-button ${
                  selectedEmployment === type ? "active" : ""
                }`}
                aria-pressed={selectedEmployment === type}
                onClick={() => setSelectedEmployment(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="job-tabs">
            <button
              type="button"
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Jobs
            </button>

            <button
              type="button"
              className={activeTab === "saved" ? "active" : ""}
              onClick={() => setActiveTab("saved")}
            >
              Saved Jobs ({savedJobs.length})
            </button>
          </div>

          <div className="sort-control">
            <label htmlFor="sortBy">Sort by:</label>

            <select
              id="sortBy"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="salary-high">Salary: highest to lowest</option>
              <option value="salary-low">Salary: lowest to highest</option>
            </select>
          </div>

          <p className="search-summary" aria-live="polite">
            {sortedJobs.length}{" "}
            {sortedJobs.length === 1 ? "opportunity" : "opportunities"} found
          </p>

          <div className="job-grid">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <div className={`company-logo ${job.color}`}>
                      {job.initials}
                    </div>

                    <div className="job-card-actions">
                      <span className="job-type">{job.type}</span>

                      <button
                        type="button"
                        className={`save-job-button ${
                          savedJobs.includes(job.id) ? "saved" : ""
                        }`}
                        onClick={() => toggleSaveJob(job.id)}
                        aria-label={
                          savedJobs.includes(job.id)
                            ? "Remove saved job"
                            : "Save job"
                        }
                        aria-pressed={savedJobs.includes(job.id)}
                        title={
                          savedJobs.includes(job.id)
                            ? "Remove saved job"
                            : "Save job"
                        }
                      >
                        {savedJobs.includes(job.id) ? "♥" : "♡"}
                      </button>
                    </div>
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
                {activeTab === "saved" && savedJobs.length === 0
                  ? "You haven't saved any jobs yet. Click the heart on a job to save it!"
                  : activeTab === "saved"
                    ? "No saved jobs match your current search or filters."
                    : "No matching jobs yet. Try a different keyword."}
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
