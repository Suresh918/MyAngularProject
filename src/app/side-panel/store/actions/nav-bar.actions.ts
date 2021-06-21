import {createAction} from '@ngrx/store';

export enum NavBarActionTypes {
  SetLeftSideNavBar = '[Side Panel] Set Left Side Nav Bar',
  SetRightSideNavBar = '[Side Panel] Set Right Side Nav Bar',
  CloseSideNavBars = '[Side Panel] Close Both (left/right) side nav bars',
  SetRightPanelFormDirty = '[Side Panel] Sit Right Panel Form Dirty'
}

export const setLeftSideNavBar = createAction(NavBarActionTypes.SetLeftSideNavBar, (isOpen: boolean, panelMode: string) => ({isOpen: isOpen, panelMode: panelMode}));
export const setRightSideNavBar = createAction(NavBarActionTypes.SetRightSideNavBar, (isOpen: boolean, panelMode: string) => ({isOpen: isOpen, panelMode: panelMode}));
export const closeSideNavBars = createAction(NavBarActionTypes.CloseSideNavBars);
export const setRightPanelFormDirty = createAction(NavBarActionTypes.SetRightPanelFormDirty, (isDirty: boolean) => ({isPanelFormDirty: isDirty}));

