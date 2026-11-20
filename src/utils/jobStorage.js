import sampleJobs from "../data/jobs";

const STORAGE_KEY = "devhire-jobs";

export function getJobs() {
  try {
    const storedJobs = localStorage.getItem(STORAGE_KEY);

    const employerJobs = storedJobs ? JSON.parse(storedJobs) : [];

    if (!Array.isArray(employerJobs)) {
      return sampleJobs;
    }

    return [...sampleJobs, ...employerJobs];
  } catch (error) {
    console.error("Error loading jobs:", error);
    return sampleJobs;
  }
}

export function createJob(jobData) {
  const currentJobs = getJobs();

  const newJob = {
    ...jobData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const employerJobs = currentJobs.filter((job) => job.isEmployerCreated);

  const updatedJobs = [...employerJobs, { ...newJob, isEmployerCreated: true }];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));

  return newJob;
}

export function deleteJob(jobId, employerId) {
  const currentJobs = getJobs();

  const jobToDelete = currentJobs.find(
    (job) =>
      job.id === jobId &&
      job.isEmployerCreated &&
      job.employerId === employerId,
  );

  if (!jobToDelete) {
    return false;
  }

  const updatedJobs = currentJobs.filter((job) => job.id !== jobId);

  const employerJobs = updatedJobs.filter((job) => job.isEmployerCreated);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(employerJobs));

  return true;
}
