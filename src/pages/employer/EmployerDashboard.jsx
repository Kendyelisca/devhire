import { Link } from "react-router-dom";
import { getJobs } from "../../utils/jobStorage";
import "../../App.css";

export default function EmployerDashboard() {
  const employerJobs = getJobs().filter((job) => job.isEmployerCreated);

  let applications = [];

  try {
    const storedApplications = JSON.parse(
      localStorage.getItem("devhire-applications") || "[]",
    );

    if (Array.isArray(storedApplications)) {
      applications = storedApplications;
    }
  } catch (error) {
    console.error("Error loading applications:", error);
  }

  const employerJobIds = new Set(employerJobs.map((job) => job.id));

  const employerApplications = applications.filter((application) =>
    employerJobIds.has(application.jobId),
  );

  const shortlistedCount = employerApplications.filter(
    (application) => application.status?.toLowerCase() === "shortlisted",
  ).length;

  const hiredCount = employerApplications.filter(
    (application) => application.status?.toLowerCase() === "hired",
  ).length;

  const stats = [
    { label: "Active Jobs", value: employerJobs.length },
    { label: "Total Applications", value: employerApplications.length },
    { label: "Shortlisted", value: shortlistedCount },
    { label: "Hired", value: hiredCount },
  ];

  const recentJobs = [...employerJobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  const recentApplications = [...employerApplications]
    .sort(
      (a, b) =>
        new Date(b.appliedAt || 0).getTime() -
        new Date(a.appliedAt || 0).getTime(),
    )
    .slice(0, 5);

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

        <Link to="/jobs" className="btn btn-ghost">
          View job board →
        </Link>
      </header>

      <section className="employer-welcome">
        <div>
          <span className="section-kicker">EMPLOYER OVERVIEW</span>
          <h1>Welcome back, Employer.</h1>
          <p>Manage your developer vacancies and discover talented people.</p>
        </div>

        <Link to="/employer/jobs/new" className="btn btn-primary">
          + Post a job
        </Link>
      </section>

      <section className="employer-stats">
        {stats.map((stat) => (
          <article className="employer-stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      <section className="employer-content">
        <div className="employer-section-heading">
          <div>
            <h2>Your job listings</h2>
            <p>Manage your published developer opportunities.</p>
          </div>

          <Link to="/employer/jobs" className="view-all">
            Manage jobs →
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="employer-empty-state">
            <span className="empty-icon">⌕</span>
            <h3>No jobs posted yet</h3>
            <p>
              Start recruiting by publishing your first developer opportunity.
            </p>
            <Link to="/employer/jobs/new" className="btn btn-primary">
              Create your first job
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {recentJobs.map((job) => (
              <article className="application-card" key={job.id}>
                <div>
                  <h2>{job.role}</h2>
                  <p className="company-name">{job.company}</p>
                  <p>
                    {job.location} · {job.type}
                  </p>
                </div>
                <span className="application-status">Published</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="employer-content">
        <div className="employer-section-heading">
          <div>
            <h2>Recent applications</h2>
            <p>Keep track of candidates applying to your jobs.</p>
          </div>

          <Link to="/employer/applications" className="view-all">
            View applications →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="employer-empty-state">
            <h3>No applications yet</h3>
            <p>Applications received for your jobs will appear here.</p>
          </div>
        ) : (
          <div className="applications-list">
            {recentApplications.map((application) => (
              <article className="application-card" key={application.id}>
                <div>
                  <h2>{application.fullName}</h2>
                  <p className="company-name">
                    {application.jobRole} · {application.company}
                  </p>
                  <p>{application.email}</p>
                  <p>
                    Applied:{" "}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="application-status">
                  {application.status || "Submitted"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
