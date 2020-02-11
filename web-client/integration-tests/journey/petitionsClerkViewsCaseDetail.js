import { Case } from '../../../shared/src/business/entities/cases/Case';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export default (test, expectedDocumentCount = 2) => {
  return it('Petitions clerk views case detail', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(Case.STATUS_TYPES.new);
    expect(test.getState('caseDetail.documents').length).toEqual(
      expectedDocumentCount,
    );
    expect(test.getState('caseDetail.associatedJudge')).toEqual(
      Case.CHIEF_JUDGE,
    );

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showDocumentStatus).toEqual(true);
    expect(helper.showIrsServedDate).toEqual(false);

    const caseDetail = test.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    // need to block case
    // expect(caseDetail.blocked).toBeDefined();
    // expect(caseDetail.blockedDate).toBeDefined();
    // expect(caseDetail.blockedReason).toBeDefined();
    expect(caseDetail.caseNote).toBeDefined();
    expect(caseDetail.highPriority).toBeDefined();
    expect(caseDetail.highPriorityReason).toBeDefined();
    expect(caseDetail.qcCompleteForTrial).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(caseDetail.userId).toBeDefined();
    // need to add work items
    // expect(caseDetail.workItems).toBeDefined();
  });
};
