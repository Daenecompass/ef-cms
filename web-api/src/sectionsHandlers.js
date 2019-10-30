require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  getDocumentQCBatchedForSectionLambda: require('./workitems/getDocumentQCBatchedForSectionLambda')
    .handler,
  getDocumentQCInboxForSectionLambda: require('./workitems/getDocumentQCInboxForSectionLambda')
    .handler,
  getDocumentQCServedForSectionLambda: require('./workitems/getDocumentQCServedForSectionLambda')
    .handler,
  getInboxMessagesForSectionLambda: require('./workitems/getInboxMessagesForSectionLambda')
    .handler,
  getSentMessagesForSectionLambda: require('./workitems/getSentMessagesForSectionLambda')
    .handler,
  getUsersInSectionLambda: require('./users/getUsersInSectionLambda').handler,
};
