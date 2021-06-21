export enum CaseObjectLabel {
  ChangeRequest = 'CR',
  ChangeNotice = 'CN',
  ReleasePackage = 'RP',
  Review = 'Review',
  Agendas = 'Agendas'
}
export enum CaseObjectRouterPath {
  ChangeRequest = 'change-requests',
  ChangeNotice = 'change-notices',
  ReleasePackage = 'release-packages',
  Review = 'review',
  Agendas = 'agenda',
  AgendaItem = 'agenda-items',
  Actions = 'actions'
}

export enum CaseObjectServicePath {
  ChangeRequest = 'change-request-service/change-requests',
  ChangeRequestRoot = 'change-request-service',
  ChangeNotice = 'change-notice-service/change-notices',
  ChangeNoticeImpactedItem = 'change-notices',
  ChangeRequestImpactedItem = 'change-requests',
  ReleasePackage = 'release-package-service/release-packages',
  ReleasePackageRoot = 'release-package-service',
  ChangeRequestInstanceUpdate = 'change-request-service',
  ReleasePackageInstanceUpdate = 'release-package-service',
  ReviewRoot = 'review-service',
  reviewRoot = 'review-service',
  Review = 'review-service/reviews',
  ReviewEntry = 'review-service/review-entries',
  ReviewInstanceUpdate = 'review-service/reviews',
  ReviewTaskInstanceUpdate = 'review-service/reviews/review-tasks',
  ReviewEntryInstanceUpdate = 'review-service/reviews/review-entries'
}

export enum CaseObjectFilterTitle {
  ChangeRequest = 'Change Requests',
  ChangeNotice = 'Change Notices',
  ReleasePackage = 'Release Packages',
  Review = 'Review',
  Agendas = 'Agendas'

}
export enum CaseObjectFilter {
  ChangeRequest = 'changeRequest',
  ChangeNotice = 'changeNotice',
  ReleasePackage = 'releasePackage',
  Agendas = 'agenda',
  MyTeamManagement = 'myTeamManagement'
}

export enum CaseObjectFilterLabel {
  changeRequest = 'CR',
  changeNotice = 'CN',
  releasePackage = 'RP',
  review = 'Review',
  trackerBoard = 'Tracker Board',
  agenda = 'Agendas',
  myTeamManagement = 'MyTeamManagement'
}
