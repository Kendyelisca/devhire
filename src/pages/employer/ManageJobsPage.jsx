import { useState } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import { getJobs, deleteJob } from "../../utils/jobStorage";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState(() =>
    getJobs().filter((job) => job.isEmployerCreated),
  );

  const handleDelete = (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    deleteJob(jobId);

    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
  };

  return (
    <main className="employer-dashboard">
      <header className="employer-header">
        <div>
          <Link to="/" className="brand">
            <span className="brand-icon">&lt;/&gt;</span>
            <span>
              dev<span className="brand-accent">hire</span>
            </span>
          </Link>
          <p>Employer workspace</p>
        </div>

        <Link to="/employer" className="btn btn-ghost">
          ← Dashboard
        </Link>
      </header>

      <section className="create-job-heading">
        <span className="section-kicker">EMPLOYER WORKSPACE</span>
        <h1>Manage your jobs.</h1>
        <p>Keep track of your published developer opportunities.</p>
      </section>

      <section className="employer-content">
        <div className="employer-section-heading">
          <div>
            <h2>Published opportunities</h2>
            <p>{jobs.length} jobs published</p>
          </div>

          <Link to="/employer/jobs/new" className="btn btn-primary">
            + Post a job
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="managed-jobs-list">
            {jobs.map((job) => (
              <article className="managed-job-card" key={job.id}>
                <div className="managed-job-info">
                  <div className="company-logo purple">{job.initials}</div>

                  <div>
                    <h3>{job.role}</h3>
                    <p>
                      {job.company} · {job.location}
                    </p>
                    <div className="job-tags">
                      {job.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="managed-job-actions">
                  <span className="job-type">{job.type}</span>

                  <Link to={`/jobs/${job.id}`} className="view-all">
                    View ↗
                  </Link>

                  <button
                    type="button"
                    className="delete-job-button"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="employer-empty-state">
            <h3>No published jobs yet</h3>
            <p>Your published opportunities will appear here.</p>
            <Link to="/employer/jobs/new" className="btn btn-primary">
              Create your first job
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
