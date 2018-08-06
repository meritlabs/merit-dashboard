import { Ranks, IRanks } from '../models/ranks';
import { RANKS_ACTION, LoadRanks } from '../actions/rank.action';

const INITIAL_STATE = new Ranks(true, 0, 0, []);

export function rankReducer(state: IRanks = INITIAL_STATE, action: LoadRanks) {
  switch (action.type) {
    case RANKS_ACTION.LOAD_RANKS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
