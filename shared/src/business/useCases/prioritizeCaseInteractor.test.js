const { prioritizeCaseInteractor } = require('./prioritizeCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { Case } = require('../entities/cases/Case');

describe('prioritizeCaseInteractor', () => {
  let applicationContext;
  let updateCaseTrialSortMappingRecordsMock = jest.fn();

  it('should update the case with the highPriority flag set as true and attach a reason', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateCaseTrialSortMappingRecords: updateCaseTrialSortMappingRecordsMock,
        };
      },
    };
    const result = await prioritizeCaseInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      reason: 'just because',
    });
    expect(result).toMatchObject({
      highPriority: true,
      highPriorityReason: 'just because',
    });
    expect(updateCaseTrialSortMappingRecordsMock).toHaveBeenCalled();
    expect(
      updateCaseTrialSortMappingRecordsMock.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to prioritize cases', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'nope',
          userId: 'nope',
        };
      },
    };
    let error;
    try {
      await prioritizeCaseInteractor({
        applicationContext,
        caseId: '123',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });

  it('should throw an error if the case status is calendared', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve({
              ...MOCK_CASE,
              status: Case.STATUS_TYPES.calendared,
            }),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateCaseTrialSortMappingRecords: updateCaseTrialSortMappingRecordsMock,
        };
      },
    };
    let error;
    try {
      await prioritizeCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        reason: 'just because',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toEqual(
      'Cannot set a calendared case as high priority',
    );
  });

  it('should throw an error if the case is blocked', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve({
              ...MOCK_CASE,
              blocked: true,
              blockedReason: 'something',
              blockedDate: '2019-08-16T17:29:10.132Z',
            }),
          updateCase: ({ caseToUpdate }) => caseToUpdate,
          updateCaseTrialSortMappingRecords: updateCaseTrialSortMappingRecordsMock,
        };
      },
    };
    let error;
    try {
      await prioritizeCaseInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        reason: 'just because',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toEqual('Cannot set a blocked case as high priority');
  });
});