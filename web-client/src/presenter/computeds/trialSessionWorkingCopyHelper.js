import { camelCase } from 'lodash';
import {
  compareCasesByDocketNumber,
  formatCase,
} from './formattedTrialSessionDetails';
import { state } from 'cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount = (a.practitioners && a.practitioners.length && 1) || 0;
  const bCount = (b.practitioners && b.practitioners.length && 1) || 0;

  return aCount - bCount;
};

export const trialSessionWorkingCopyHelper = (get, applicationContext) => {
  const { TRIAL_STATUS_TYPES } = get(state.constants);
  const trialSession = get(state.trialSession) || {};
  const { sort, sortOrder } = get(state.trialSessionWorkingCopy) || {};

  const formatCaseName = myCase => {
    myCase.caseName = applicationContext.getCaseCaptionNames(
      myCase.caseCaption || '',
    );
    return myCase;
  };

  let formattedSessions = (trialSession.calendaredCases || [])
    .map(formatCase)
    .map(formatCaseName)
    .sort(compareCasesByDocketNumber);

  if (sort === 'practitioner') {
    formattedSessions = formattedSessions.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    formattedSessions = formattedSessions.slice().reverse();
  }

  const trialStatusOptions = TRIAL_STATUS_TYPES.map(value => ({
    key: camelCase(value),
    value,
  }));

  return {
    formattedSessions,
    title: trialSession.title || 'Birmingham, Alabama',
    trialStatusOptions,
  };
};