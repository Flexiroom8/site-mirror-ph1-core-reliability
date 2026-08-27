import bodyParser from 'body-parser';
import express from 'express';
import { createJob, listJobs, getJob } from '../mirror/runner';
import { validateJobCreate } from '../validation/job-schema';
import { scheduleAndRun } from '../mirror/scheduler';
import { apiKeyMiddleware } from '../middleware/apiKey';

const router = express.Router();
router.use(bodyParser.json());

// Protect POST /jobs with API key
router.post('/jobs', apiKeyMiddleware(), async (req, res) => {
  try{
    const input = validateJobCreate(req.body);
    const job = await createJob(input.url);
    // schedule async
    scheduleAndRun(job.id).catch((e)=>console.error('job schedule failed', e));
    res.status(201).json(job);
  }catch(e:any){
    res.status(400).json({ error: e.message });
  }
});

// List jobs (public)
router.get('/jobs', (req, res) => {
  res.json({ jobs: listJobs() });
});

// Get job
router.get('/jobs/:id', (req, res) => {
  const j = getJob(req.params.id);
  if (!j) return res.status(404).json({ error: 'not found' });
  res.json(j);
});

export default router;
