const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { getTimestampSchema } = require('../../../utilities/dateSchema');
const { TrialSession } = require('./TrialSession');

const joiStrictTimestamp = getTimestampSchema();

NewTrialSession.validationName = 'TrialSession';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function NewTrialSession(rawSession, { applicationContext }) {
  TrialSession.prototype.init.call(this, rawSession, { applicationContext });
}

NewTrialSession.VALIDATION_ERROR_MESSAGES = {
  ...TrialSession.VALIDATION_ERROR_MESSAGES,
};

joiValidationDecorator(
  NewTrialSession,
  joi.object().keys({
    ...TrialSession.validationRules.COMMON,
    startDate: joiStrictTimestamp.min('now').required(),
  }),
  NewTrialSession.VALIDATION_ERROR_MESSAGES,
);

module.exports = { NewTrialSession };
