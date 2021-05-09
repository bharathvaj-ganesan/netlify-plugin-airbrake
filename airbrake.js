const axios = require('axios');

const BASE_API_URL = 'https://airbrake.io/api/v4';

const createDeploy = async (projectId, projectKey, payload) => {
  try {
    const res = await axios.default.post(
      `${BASE_API_URL}/projects/${projectId}/deploys?key=${projectKey}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDeploy,
};
