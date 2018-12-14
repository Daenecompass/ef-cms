const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * updateCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.put = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    return applicationContext.getUseCases().updateCase({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body),
      userId,
      applicationContext,
    });
  });
