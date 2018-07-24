import { Action } from '@ngrx/store';
import { Ranks } from '@dashboard/common/models/ranks';

export namespace RANKS_ACTION {
  export const LOAD_RANKS = 'LOAD_RANKS';
}

export class LoadRanks implements Action {
  readonly type = RANKS_ACTION.LOAD_RANKS;

  constructor(public payload: Ranks) {}
}

export type RanksAction = LoadRanks;
