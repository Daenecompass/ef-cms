import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { navigateToDocumentQCAction } from '../actions/navigateToDocumentQCAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const serveCaseToIrsSequence = [
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([
    serveCaseToIrsAction,
    {
      electronic: [
        clearModalAction,
        getServeToIrsAlertSuccessAction,
        setAlertSuccessAction,
        setSaveAlertsForNavigationAction,
        navigateToDocumentQCAction,
      ],
      paper: [
        clearModalAction,
        setPdfPreviewUrlAction,
        setCurrentPageAction('PrintPaperPetitionReceipt'),
      ],
    },
  ]),
];
