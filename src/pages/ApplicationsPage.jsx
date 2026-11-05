import { Link } from "react-router-dom";
import "../App.css";

export default function ApplicationsPage() {
  const applications = JSON.parse(
    localStorage.getItem("devhire-applications") || "[]",
  );

  return (
    <main className="job-details-page">
      <section className="job-details">
        <Link to="/jobs" className="back-link">
          ← Back to jobs
        </Link>

        <span className="section-kicker">YOUR DEVHIRE ACCOUNT</span>

        <h1>My Applications</h1>

        <p className="company-name">
          Track the opportunities you've applied for.
        </p>

        {applications.length === 0 ? (
          <div className="applications-empty">
            <h2>No applications yet</h2>
            <p>
              You haven't applied for any jobs. Explore opportunities and submit
              your first application!
            </p>
            <Link to="/jobs" className="apply-button">
              Explore jobs ↗
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <article className="application-card" key={application.id}>
                <div>
                  <h2>{application.jobRole}</h2>
                  <p className="company-name">{application.company}</p>
                  <p>CV: {application.cvName}</p>
                  <p>
                    Applied:{" "}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="application-status">{application.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
