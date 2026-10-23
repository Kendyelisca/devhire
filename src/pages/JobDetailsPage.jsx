import { Link, useParams } from "react-router-dom";
import jobs from "../data/jobs";

export default function JobDetailsPage() {
  const { id } = useParams();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <main className="job-details-page">
        <h1>Job not found</h1>
        <p>This listing doesn't exist in our demo data.</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return (
    <main className="job-details-page">
      <Link to="/" className="back-link">
        ← Back to DevHire
      </Link>

      <section className="job-details">
        <span className="section-kicker">JOB DETAILS</span>

        <div className="job-card-top">
          <div className="company-logo">{job.initials}</div>
          <span className="job-type">{job.type}</span>
        </div>

        <h1>{job.role}</h1>

        <p className="company-name">
          {job.company} · {job.location}
        </p>

        <h2>{job.salary}</h2>

        <div className="job-tags">
          {job.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <h2>About the role</h2>
        <p>{job.description}</p>

        <h2>Responsibilities</h2>
        <ul>
          {job.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Requirements</h2>
        <ul>
          {job.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="demo-note">
          Demo listing only. This is not a verified vacancy, and applications
          are not open through DevHire yet.
        </p>

        <button
          className="apply-button"
          onClick={() => alert("Applications are coming soon to DevHire!")}
        >
          Apply soon ↗
        </button>
      </section>
    </main>
  );
}
