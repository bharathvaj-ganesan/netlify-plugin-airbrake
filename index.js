const airbrake = require('./airbrake');

module.exports = {
  async onPostBuild(pluginApi) {
    const { inputs, utils } = pluginApi;
    const { IS_LOCAL } = constants;
    const env = require('process').env;
    try {
      // Set user inputs
      const airbrakeProjectId =
        env.AIRBRAKE_PROJECT_ID || inputs.airbrakeProjectId;
      const airbrakeProjectKey = env.AIRBRAKE_PROJECT_KEY;

      // Set env values (Read-Only)
      const runningInNetlify = !IS_LOCAL;
      const airbrakeRepo = env.REPOSITORY_URL;
      const airbrakeRevision = env.COMMIT_REF;

      // precheck credentials
      if (!airbrakeProjectId) {
        return utils.build.failPlugin(
          'Please set env variable AIRBRAKE_PROJECT_ID or set airbrakeProjectId as a plugin input'
        );
      } else if (!airbrakeProjectKey) {
        return utils.build.failPlugin(
          'Please set env variable AIRBRAKE_PROJECT_KEY'
        );
      }

      if (runningInNetlify) {
        await airbrake.createDeploy(airbrakeProjectId, airbrakeProjectKey, {
          environment: env.AIRBRAKE_ENVIRONMENT || inputs.airbrakeEnvironment,
          username:
            env.AIRBRAKE_DEPLOY_USER_NAME || inputs.airbrakeDeployUserName,
          email:
            env.AIRBRAKE_DEPLOY_USER_EMAIL || inputs.airbrakeDeployUserEmail,
          revision: env.AIRBRAKE_VERSION || inputs.airbrakeVersion,
          repository: airbrakeRepo,
          version: airbrakeRevision,
        });
      }
    } catch (error) {
      return utils.build.failPlugin('Failed to create Airbrake Deployment', {
        error,
      });
    }
  },
};
