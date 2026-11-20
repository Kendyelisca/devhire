import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import { createJob } from "../../utils/jobStorage";
import { useAuth } from "../../context/AuthContext";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    type: "Full-time",
    location: "Remote",
    salary: "",
    tags: "",
    description: "",
    responsibilities: "",
    requirements: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.company.trim() ||
      !formData.role.trim() ||
      !formData.salary.trim() ||
      !formData.description.trim() ||
      !formData.tags.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const newJob = {
      ...formData,
      employerId: user.id,
      initials: formData.company.trim().charAt(0).toUpperCase(),
      color: "purple",
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      responsibilities: formData.responsibilities
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      requirements: formData.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    createJob(newJob);
    navigate("/employer");
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
        <h1>Publish a new opportunity.</h1>
        <p>
          Find your next great developer by creating a detailed job listing.
        </p>
      </section>

      <form className="create-job-form" onSubmit={handleSubmit}>
        <section className="employer-content">
          <h2>Basic information</h2>
          <p>Start with the essential details of the vacancy.</p>

          <div className="employer-form-grid">
            <label>
              Company name *
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Technologies"
                required
              />
            </label>

            <label>
              Job title *
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                required
              />
            </label>

            <label>
              Employment type
              <select name="type" value={formData.type} onChange={handleChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </label>

            <label>
              Work arrangement
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </label>

            <label>
              Salary *
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $3k–$5k / month"
                required
              />
            </label>

            <label>
              Required skills *
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL"
                required
              />
            </label>
          </div>
        </section>

        <section className="employer-content">
          <h2>Job description</h2>
          <p>Tell developers what this opportunity is about.</p>

          <label>
            About the role *
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, team and opportunity..."
              rows={5}
              required
            />
          </label>

          <label>
            Responsibilities
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder={
                "Build scalable applications.\nCollaborate with the engineering team."
              }
              rows={5}
            />
            <small>Write one responsibility per line.</small>
          </label>

          <label>
            Requirements
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder={"Experience with React.\nKnowledge of REST APIs."}
              rows={5}
            />
            <small>Write one requirement per line.</small>
          </label>
        </section>

        {error && (
          <p className="create-job-error" role="alert">
            {error}
          </p>
        )}

        <div className="create-job-actions">
          <Link to="/employer" className="btn btn-ghost">
            Cancel
          </Link>

          <button type="submit" className="btn btn-primary">
            Publish job ↗
          </button>
        </div>
      </form>
    </main>
  );
}
