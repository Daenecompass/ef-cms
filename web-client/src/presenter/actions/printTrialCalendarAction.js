import { state } from 'cerebral';
import printTrialCalendarTemplate from '../../views/TrialSessionDetail/printTrialCalendarTemplate.html';

/**
 * Prints the trial calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.store the cerebral store object
 * @returns {object} the docket number and stringified docketRecordHtml
 */
export const printTrialCalendarAction = ({ get }) => {
  const caseDetail = get(state.formattedCaseDetail);
  const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails);
  const openCases = get(state.formattedTrialSessionDetails.openCases);

  const renderCases = item => {
    return `<tr>
      <td>
          ${item.docketNumberWithSuffix}
      </td>
      <td>${item.caseCaption}</td>
      <td>
        ${item.practitioners.map(practitioner => `${practitioner.name}`)}
      </td>
      <td>${item.respondent || ''}</td>
    </tr>`;
  };

  const renderTrialCalendar = () => {
    return `
      <div class="court-header">
        <div class="us-tax-court-seal"></div>
        <h1 class="mb-1 text-center">United States Tax Court</h1>
        <h2 class="text-center">${
          formattedTrialSessionDetails.trialLocation
        }</h2>
        <h3 class="text-center">
          ${formattedTrialSessionDetails.formattedStartDateFull}
          ${formattedTrialSessionDetails.sessionType}
        </h3>
      </div>

      <div class="grid-container">
        <div class="panel">
          <div class="header">
            Trial Information
          </div>

          <div class="content grid-container">
            <div>
              <h4>Start Time</h4>
              <p>${formattedTrialSessionDetails.formattedStartTime}</p>
            </div>
            <div>
              <h4>Location</h4>
              ${
                formattedTrialSessionDetails.noLocationEntered
                  ? '<p>No location entered</p>'
                  : ''
              }
              <p>${formattedTrialSessionDetails.courthouseName || ''}</p>
              <p>
                <span className="address-line">
                  ${formattedTrialSessionDetails.address1 || ''}
                </span>
                <span className="address-line">
                  ${formattedTrialSessionDetails.address2 || ''}
                </span>
                <span className="address-line">
                  ${formattedTrialSessionDetails.formattedCityStateZip || ''}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="header">
            Assignments
          </div>
          <div class="content grid-container">
            <div>
              <h4>Judge</h4>
              <p class="mb-2">${formattedTrialSessionDetails.formattedJudge}</p>

              <h4>Court Reporter</h4>
              <p>${formattedTrialSessionDetails.formattedCourtReporter}</p>
            </div>
            <div>
              <h4>Trial Clerk</h4>
              <p class="mb-2">${
                formattedTrialSessionDetails.formattedTrialClerk
              }</p>

              <h4>IRS Calendar Administrator</h4>
              <p>${
                formattedTrialSessionDetails.formattedIrsCalendarAdministrator
              }</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel mb-4">
        <div class="header">
          Session Notes
        </div>
        <div class="content">
          <p>${formattedTrialSessionDetails.notes || ''}</p>
        </div>
      </div>

      <h3 class="open-cases bold">Open Cases (${openCases.length})</h3>

      <table>
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Name</th>
            <th>Petitioner Counsel</th>
            <th>Respondent Counsel</th>
          </tr>
        </thead>
        <tbody>
          ${openCases.map(renderCases)}
        </tbody>
      </table>
    `;
  };

  const output = printTrialCalendarTemplate.replace(
    /{{ trialCalendar }}/g,
    renderTrialCalendar(),
  );

  return {
    docketNumber: caseDetail.docketNumberWithSuffix,
    docketRecordHtml: output,
  };
};