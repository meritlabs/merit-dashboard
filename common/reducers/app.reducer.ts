import { Action } from '@ngrx/store';
import { Ranks } from '../models/ranks';
import { Blocks } from '../models/blocks';
import { Nodes } from '@dashboard/common/models/network';

export interface IAppState {
  loading: boolean;
  ranks: Ranks;
  blocks: Blocks;
  nodes: Nodes;
}

const INITIAL_STATE: IAppState = {
  loading: true,
  ranks: new Ranks(false, 0, 0),
  blocks: new Blocks(false, []),
  nodes: new Nodes(false, []),
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
