import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFileAction } from '../actions/CourtIssuedOrder/getPdfFileAction';
import { setMetadataAsPristineAction } from '../actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';

export const convertHtml2PdfSequence = [
  createOrderAction,
  clearPdfPreviewUrlAction,
  getPdfFileAction,
  setPdfFileAction,
  setPdfPreviewUrlAction,
  setMetadataAsPristineAction,
];
