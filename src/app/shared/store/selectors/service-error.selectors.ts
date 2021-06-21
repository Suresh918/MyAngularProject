import { ErrorState, ServiceError } from '../../models/mc-store.model';

export const getServiceError = (errorStoreRoot: ErrorState) => (errorStoreRoot) ? errorStoreRoot.serviceError : {};
export const getHighSeverityStackState = (serviceError: ServiceError) => serviceError.highSeverityStack;
export const getMediumSeverityStackState = (serviceError: ServiceError) => serviceError.mediumSeverityStack;
export const getLowSeverityStackState = (serviceError: ServiceError) => serviceError.lowSeverityStack;
export const getErrorPopupClosed = (serviceError: ServiceError) => serviceError.errorPopupClosed;
