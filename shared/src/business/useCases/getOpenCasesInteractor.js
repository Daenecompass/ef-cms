const { Case } = require('../entities/cases/Case');
const { UserCase } = require('../entities/UserCase');

/**
 * getOpenCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the open cases data
 */
exports.getOpenCasesInteractor = async ({ applicationContext }) => {
  let foundCases = [];
  let userCaseIdsMap = {};

  const { userId } = await applicationContext.getCurrentUser();

  const openCases = await applicationContext
    .getPersistenceGateway()
    .getOpenCasesByUser({ applicationContext, userId });

  if (openCases && openCases.length) {
    const caseMapping = {};
    const leadCaseIdsToGet = [];

    openCases.forEach(caseRecord => {
      const userCaseEntity = new UserCase(caseRecord).validate().toRawObject();
      const { caseId, leadCaseId } = userCaseEntity;

      userCaseEntity.isRequestingUserAssociated = true;
      userCaseIdsMap[caseId] = true;

      if (!leadCaseId || leadCaseId === caseId) {
        caseMapping[caseId] = userCaseEntity;
      }

      if (leadCaseId && !leadCaseIdsToGet.includes(leadCaseId)) {
        leadCaseIdsToGet.push(leadCaseId);
      }
    });

    for (const leadCaseId of leadCaseIdsToGet) {
      const consolidatedCases = await applicationContext
        .getPersistenceGateway()
        .getCasesByLeadCaseId({
          applicationContext,
          leadCaseId,
        });

      const consolidatedCasesValidated = Case.validateRawCollection(
        consolidatedCases,
        { applicationContext, filtered: true },
      );

      if (!caseMapping[leadCaseId]) {
        const leadCase = consolidatedCasesValidated.find(
          consolidatedCase => consolidatedCase.caseId === leadCaseId,
        );
        leadCase.isRequestingUserAssociated = false;
        caseMapping[leadCaseId] = leadCase;
      }

      const caseConsolidatedCases = [];
      consolidatedCasesValidated.forEach(consolidatedCase => {
        consolidatedCase.isRequestingUserAssociated = !!userCaseIdsMap[
          consolidatedCase.caseId
        ];
        if (consolidatedCase.caseId !== leadCaseId) {
          caseConsolidatedCases.push(consolidatedCase);
        }
      });

      caseMapping[leadCaseId].consolidatedCases = Case.sortByDocketNumber(
        caseConsolidatedCases,
      );
    }

    foundCases = Object.keys(caseMapping).map(caseId => caseMapping[caseId]);
  }

  return foundCases;
};
