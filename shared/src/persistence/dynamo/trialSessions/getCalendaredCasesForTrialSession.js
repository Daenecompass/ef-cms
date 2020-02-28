const client = require('../../dynamodbClientService');

exports.getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  const trialSession = await client.get({
    Key: {
      pk: `trial-session-${trialSessionId}`,
      sk: `trial-session-${trialSessionId}`,
    },
    applicationContext,
  });

  const { caseOrder } = trialSession;

  const results = await client.batchGet({
    applicationContext,
    keys: caseOrder.map(myCase => ({
      pk: myCase.caseId,
      sk: myCase.caseId,
    })),
  });

  const afterMapping = caseOrder.map(myCase => ({
    ...myCase,
    ...results.find(r => myCase.caseId === r.pk),
  }));

  return afterMapping;
};
