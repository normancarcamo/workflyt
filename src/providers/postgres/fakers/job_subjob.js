const jobs = require('./job');
const data = [];

data.push({
  job_id: jobs.find(job => job.code === 'JOB/001').id,
  subjob_id: jobs.find(job => job.code === 'JOB/002').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  job_id: jobs.find(job => job.code === 'JOB/001').id,
  subjob_id: jobs.find(job => job.code === 'JOB/003').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

module.exports = data;
