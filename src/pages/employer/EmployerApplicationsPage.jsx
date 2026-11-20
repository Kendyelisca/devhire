import { useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../../utils/jobStorage";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import { getCV } from "../../utils/cvStorage";

const APPLICATIONS_KEY = "devhire-applications";

function getStoredApplications() {
  try {
    const stored = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || "[]");

    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error("Error loading applications:", error);
    return [];
  }
}

export default function EmployerApplicationsPage() {
  const { user } = useAuth();

  const employerJobs = getJobs().filter(
    (job) => job.isEmployerCreated && job.employerId === user.id,
  );

  const employerJobIds = new Set(employerJobs.map((job) => job.id));

  const [applications, setApplications] = useState(() =>
    getStoredApplications()
      .filter((application) => employerJobIds.has(application.jobId))
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime(),
      ),
  );

  const handleStatusChange = (applicationId, newStatus) => {
    const allApplications = getStoredApplications();

    const belongsToEmployer = allApplications.some(
      (application) =>
        application.id === applicationId &&
        employerJobIds.has(application.jobId),
    );

    if (!belongsToEmployer) return;

    const updatedApplications = allApplications.map((application) =>
      application.id === applicationId && employerJobIds.has(application.jobId)
        ? { ...application, status: newStatus }
        : application,
    );

    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updatedApplications));

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? { ...application, status: newStatus }
          : application,
      ),
    );
  };

  const handleDownloadCV = async (application) => {
    try {
      const file = await getCV(application.id);

      if (!file) {
        alert("CV file not found. The candidate may need to upload it again.");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download = application.cvName || "candidate-cv";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Unable to download this CV. Please try again.");
    }
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
        <h1>Manage applications.</h1>
        <p>Review candidates and keep track of your recruitment process.</p>
      </section>

      <section className="employer-content">
        <div className="employer-section-heading">
          <div>
            <h2>All applications</h2>
            <p>
              {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"}{" "}
              received
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="employer-empty-state">
            <h3>No applications yet</h3>
            <p>
              Applications submitted for your published jobs will appear here.
            </p>
            <Link to="/employer/jobs" className="btn btn-primary">
              View your jobs
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <article className="application-card" key={application.id}>
                <div>
                  <h2>{application.fullName}</h2>

                  <p className="company-name">
                    {application.jobRole} · {application.company}
                  </p>

                  <p>Email: {application.email}</p>
                  <p>Experience: {application.experience || "Not provided"}</p>
                  <p>CV: {application.cvName || "Not provided"}</p>
                  {application.cvStored && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleDownloadCV(application)}
                    >
                      ↓ Download CV
                    </button>
                  )}
                  <p>
                    Applied:{" "}
                    {application.appliedAt
                      ? new Date(application.appliedAt).toLocaleDateString()
                      : "Date unavailable"}
                  </p>

                  {application.coverLetter && (
                    <div>
                      <h3>Cover letter</h3>
                      <p>{application.coverLetter}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label>
                    Application status
                    <select
                      className="application-status"
                      value={application.status || "Submitted"}
                      onChange={(event) =>
                        handleStatusChange(application.id, event.target.value)
                      }
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
