import { CaseDeadlinesInternal } from './CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailPendingReportList } from './CaseDetailPendingReportList';
import { CaseDetailSubnavTabs } from './CaseDetailSubnavTabs';
import { CaseInformationInternal } from './CaseInformationInternal';
import { CaseNotes } from './CaseNotes';
import { Correspondence } from '../Correspondence/Correspondence';
import { DocketRecord } from '../DocketRecord/DocketRecord';
import { DraftDocuments } from '../DraftDocuments/DraftDocuments';
import { EditPetitionDetails } from './EditPetitionDetails';
import { ErrorNotification } from '../ErrorNotification';
import { MessagesInProgress } from './MessagesInProgress';
import { PaperServiceConfirmModal } from './PaperServiceConfirmModal';
import { PetitionerInformation } from './PetitionerInformation';
import { RespondentInformation } from './RespondentInformation';
import { SealCaseModal } from './SealCaseModal';
import { Statistics } from './Statistics';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    caseDetailInternalTabs:
      state.currentViewMetadata.caseDetail.caseDetailInternalTabs,
    primaryTab: state.currentViewMetadata.caseDetail.primaryTab,
    showEditPetition: state.currentViewMetadata.caseDetail.showEditPetition,
    showModal: state.modal.showModal,
  },
  function CaseDetailInternal({
    caseDetailInternalTabs,
    showEditPetition,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-0" />
        <CaseDetailSubnavTabs />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <SuccessNotification />
          <ErrorNotification />
          {caseDetailInternalTabs.docketRecord && (
            <>
              <div className="title">
                <h1>Docket Record</h1>
              </div>
              <DocketRecord />
            </>
          )}
          {caseDetailInternalTabs.deadlines && (
            <>
              <div className="title">
                <h1>Deadlines</h1>
              </div>
              <CaseDeadlinesInternal />
            </>
          )}
          {caseDetailInternalTabs.inProgress && (
            <Tabs
              bind="currentViewMetadata.caseDetail.inProgressTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-draft-documents"
                tabName="draftDocuments"
                title="Draft Documents"
              >
                <DraftDocuments />
              </Tab>
              <Tab id="tab-messages" tabName="messages" title="Messages">
                <MessagesInProgress />
              </Tab>
              <Tab
                id="tab-pending-report"
                tabName="pendingReport"
                title="Pending Report"
              >
                <CaseDetailPendingReportList />
              </Tab>
            </Tabs>
          )}
          {caseDetailInternalTabs.correspondence && (
            <>
              <Correspondence />
            </>
          )}
          {caseDetailInternalTabs.caseInformation && showEditPetition && (
            <EditPetitionDetails />
          )}
          {caseDetailInternalTabs.caseInformation && !showEditPetition && (
            <Tabs
              bind="currentViewMetadata.caseDetail.caseInformationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab id="tab-overview" tabName="overview" title="Overview">
                <CaseInformationInternal />
              </Tab>
              <Tab id="tab-statistics" tabName="statistics" title="Statistics">
                <Statistics />
              </Tab>
              <Tab id="tab-petitioner" tabName="petitioner" title="Petitioner">
                <PetitionerInformation />
              </Tab>
              <Tab id="tab-respondent" tabName="respondent" title="Respondent">
                <RespondentInformation />
              </Tab>
            </Tabs>
          )}
          {caseDetailInternalTabs.notes && (
            <>
              <div className="title">
                <h1>Notes</h1>
              </div>
              <CaseNotes />
            </>
          )}
        </section>

        {showModal === 'PaperServiceConfirmModal' && (
          <PaperServiceConfirmModal />
        )}
        {showModal === 'SealCaseModal' && <SealCaseModal />}
      </>
    );
  },
);
