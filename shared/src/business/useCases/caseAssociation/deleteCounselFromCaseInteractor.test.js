const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteCounselFromCaseInteractor,
} = require('./deleteCounselFromCaseInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

describe('deleteCounselFromCaseInteractor', () => {
  const mockPrivatePractitioners = [
    {
      role: User.ROLES.privatePractitioner,
      userId: '02f8a9cf-3bc8-4c91-a765-2f19013cd004',
    },
    {
      role: User.ROLES.privatePractitioner,
      userId: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
    },
    {
      role: User.ROLES.privatePractitioner,
      userId: '6de95584-fbf2-42d7-bd81-bf9e10633404',
    },
  ];

  const mockIrsPractitioners = [
    {
      role: User.ROLES.irsPractitioner,
      userId: '547f2148-3bb8-408b-bbaa-40d53f14f924',
    },
    {
      role: User.ROLES.irsPractitioner,
      userId: 'bfd97089-cda0-45e0-8454-dd879023d0af',
    },
    {
      role: User.ROLES.irsPractitioner,
      userId: '55c50d5d-b2eb-466e-9775-d0e1b464472d',
    },
  ];

  const mockPetitioners = [
    {
      role: User.ROLES.petitioner,
      userId: '835f072c-5ea1-493c-acb8-d67b05c96f85',
    },
  ];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'fb39f224-7985-438d-8327-2df162c20c8e',
    });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(({ userId }) => {
        return mockPrivatePractitioners
          .concat(mockIrsPractitioners)
          .concat(mockPetitioners)
          .find(user => user.userId === userId);
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => ({
        ...MOCK_CASE,
        caseId,
        irsPractitioners: mockIrsPractitioners,
        privatePractitioners: mockPrivatePractitioners,
      }));
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
    });

    await expect(
      deleteCounselFromCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userIdToDelete: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('deletes a practitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userIdToDelete: '141d4c7c-4302-465d-89bd-3bc8ae16f07d',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
  });

  it('deletes an irsPractitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userIdToDelete: 'bfd97089-cda0-45e0-8454-dd879023d0af',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
  });

  it('throws an error if the userIdToDelete is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      deleteCounselFromCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userIdToDelete: '835f072c-5ea1-493c-acb8-d67b05c96f85',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });
});
