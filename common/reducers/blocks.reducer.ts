import { Blocks, IBlocks } from '../models/blocks';
import { BLOCKS_ACTION, LoadBlocks } from '../actions/blocks.action';

const INITIAL_STATE = new Blocks(true, []);

export function blocksReducer(state: IBlocks = INITIAL_STATE, action: LoadBlocks) {
  switch (action.type) {
    case BLOCKS_ACTION.LOAD_BLOCKS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
