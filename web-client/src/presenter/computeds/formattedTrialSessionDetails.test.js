import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from './formattedTrialSessionDetails';
import { omit } from 'lodash';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

describe('formattedTrialSessionDetails', () => {
  const TRIAL_SESSION = {
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
    judge: 'Test Judge',
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'CT',
    term: 'Fall',
    termYear: '2019',
    trialClerk: 'Test Trial Clerk',
    trialLocation: 'Hartford, Connecticut',
  };

  it('formats trial session when all fields have values', async () => {
    const result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: TRIAL_SESSION,
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT 12345',
      formattedCourtReporter: 'Test Court Reporter',
      formattedIrsCalendarAdministrator: 'Test Calendar Admin',
      formattedJudge: 'Test Judge',
      formattedStartTime: '10:00 am',
      formattedTerm: 'Fall 19',
      formattedTrialClerk: 'Test Trial Clerk',
    });
  });

  it('formats trial session when address fields are empty', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['city', 'state', 'postalCode']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: '',
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['city']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'CT 12345',
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['state']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['state']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['postalCode']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT',
    });
  });

  it('formats trial session when session assignments are empty', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, [
          'courtReporter',
          'irsCalendarAdministrator',
          'judge',
          'trialClerk',
        ]),
      },
    });
    expect(result).toMatchObject({
      formattedCourtReporter: 'Not assigned',
      formattedIrsCalendarAdministrator: 'Not assigned',
      formattedJudge: 'Not assigned',
      formattedTrialClerk: 'Not assigned',
    });
  });

  it('formats trial session start time', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: { ...TRIAL_SESSION, startTime: '14:00' },
      },
    });
    expect(result).toMatchObject({
      formattedStartTime: '2:00 pm',
    });
  });
});