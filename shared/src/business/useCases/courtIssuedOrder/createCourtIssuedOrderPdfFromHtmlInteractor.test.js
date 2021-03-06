const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');

describe('createCourtIssuedOrderPdfFromHtmlInteractor', () => {
  const mockPdfUrl = 'www.example.com';

  beforeAll(() => {
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      caseCaption: 'Dr. Leo Marvin, Petitioner',
      caseId: '123',
    });

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'docketclerk',
      userId: '321',
    });
  });

  it('throws an error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitioner',
      userId: '432',
    });

    await expect(
      createCourtIssuedOrderPdfFromHtmlInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('fetches the case by id', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext,
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
  });

  it('calls the pdf document generator function', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext,
    });
    expect(applicationContext.getDocumentGenerators().order).toHaveBeenCalled();
  });

  it('returns the pdf url from the temp documents bucket', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toBeCalledWith(expect.objectContaining({ useTempBucket: true }));
    expect(result).toEqual(mockPdfUrl);
  });
});
