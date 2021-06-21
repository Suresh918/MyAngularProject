import * as NavBarActions from '../actions/nav-bar.actions';
import {NavBarPayload, NavBarState, ParallelUpdateState} from '../../../shared/models/mc-store.model';
import {Action, createReducer, on} from '@ngrx/store';

const initialState: NavBarState = {
  'leftNavBarState': {
    'isOpen': false,
    'panelMode': '',
    'isPanelFormDirty': false
  } as NavBarPayload,
  'rightNavBarState': {
    'isOpen': false,
    'panelMode': '',
    'isPanelFormDirty': false
  } as NavBarPayload,
} as NavBarState;

const _navBarReducer = createReducer(initialState,
  on(NavBarActions.setLeftSideNavBar, (state, action) => {
    return {
      ...state,
      leftNavBarState: {
        ...state.leftNavBarState,
        isOpen: new Boolean(action.isOpen),
        panelMode: action.panelMode
      }
    };
  }),
  on(NavBarActions.setRightSideNavBar, (state, action) => {
    return {
      ...state,
      rightNavBarState: {
        ...state.rightNavBarState,
        isOpen: new Boolean(action.isOpen),
        panelMode: action.panelMode
      }
    };
  }),
  on(NavBarActions.closeSideNavBars, (state, action) => {
    return {
      ...state,
      leftNavBarState: {...state.leftNavBarState, isOpen: new Boolean(false), panelMode: ''},
      rightNavBarState: {...state.rightNavBarState, isOpen: new Boolean(false), panelMode: ''}
    };
  }),
  on(NavBarActions.setRightPanelFormDirty, (state, action) => {
    return {
      ...state,
      rightNavBarState: {
        ...state.rightNavBarState,
        isPanelFormDirty: new Boolean(action.isPanelFormDirty)
      }
    };
  })
);

export function navBarReducer(state: NavBarState, action: Action): NavBarState {
  return _navBarReducer(state, action);
}
