import { Action } from '@ngrx/store';
import { Ranks, IRanks } from '@dashboard/common/models/ranks';

export interface IAppState {
  loading: boolean;
  ranks: Ranks;
}

const INITIAL_STATE: IAppState = {
  loading: true,
  ranks: new Ranks(100, 0, 0),
};

export enum AppReducerActionType {
  UPDATE = '[App] Update',
}

export class UpdateAppAction implements Action {
  type = AppReducerActionType.UPDATE;
  constructor(public payload: Partial<IAppState>) {}
}

export type AppReducerAction = UpdateAppAction;

export function appReducer(state: IAppState = INITIAL_STATE, action: AppReducerAction) {
  switch (action.type) {
    case AppReducerActionType.UPDATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
