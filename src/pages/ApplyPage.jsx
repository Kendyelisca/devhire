import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import jobs from "../data/jobs";
import "../App.css";

export default function ApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = jobs.find((item) => item.id === id);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    experience: "",
    coverLetter: "",
  });

  const [cv, setCv] = useState(null);

  if (!job) {
    return (
      <main className="job-details-page">
        <h1>Job not found</h1>
        <Link to="/jobs">Back to jobs</Link>
      </main>
    );
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!cv) {
      alert("Please upload your CV.");
      return;
    }

    const application = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobRole: job.role,
      company: job.company,
      ...formData,
      cvName: cv.name,
      status: "Submitted",
      appliedAt: new Date().toISOString(),
    };

    const existingApplications = JSON.parse(
      localStorage.getItem("devhire-applications") || "[]",
    );

    localStorage.setItem(
      "devhire-applications",
      JSON.stringify([...existingApplications, application]),
    );

    navigate("/applications");
  };

  return (
    <main className="job-details-page">
      <section className="job-details">
        <Link to={`/jobs/${job.id}`} className="back-link">
          ← Back to job details
        </Link>

        <span className="section-kicker">DEVHIRE APPLICATION</span>

        <h1>Apply for {job.role}</h1>

        <p className="company-name">
          {job.company} · {job.location}
        </p>

        <form className="application-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="experience">Years of experience</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select experience</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1–2 years">1–2 years</option>
            <option value="3–5 years">3–5 years</option>
            <option value="5+ years">5+ years</option>
          </select>

          <label htmlFor="cv">Upload your CV</label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setCv(event.target.files[0] || null)}
            required
          />

          <label htmlFor="coverLetter">Cover letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Tell the employer why you're a good fit..."
            rows="6"
          />

          <button className="apply-button" type="submit">
            Submit application ↗
          </button>
        </form>

        <p className="demo-note">
          Demo application only. Your submission is stored locally in this
          browser and is not sent to the employer.
        </p>
      </section>
    </main>
  );
}
