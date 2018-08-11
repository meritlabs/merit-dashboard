import * as moment from 'moment';
import { Blocks, IBlocks } from '../models/blocks';
import { BLOCKS_ACTION, LoadBlocks } from '../actions/blocks.action';

const INITIAL_STATE = new Blocks(true, []);

export function blocksReducer(state: IBlocks = INITIAL_STATE, action: LoadBlocks) {
  switch (action.type) {
    case BLOCKS_ACTION.LOAD_BLOCKS:
      let blocks = action.payload.blocks;
      blocks.map((item, index) => {
        if (index === 0) {
        }
        let currentBlockDiff = item.difficulty;
        let prevBlockDiff = currentBlockDiff;
        let difficultyChange = 0;
        if (index !== blocks.length - 1) prevBlockDiff = blocks[index + 1].difficulty;
        difficultyChange = ((currentBlockDiff - prevBlockDiff) / ((currentBlockDiff + prevBlockDiff) / 2)) * 100;
        item.difficultyChange = `${difficultyChange.toFixed(2)}%`;
        item.lastChange = moment(item.timestamp).format('MMM Do YYYY');
        item.timestamp = `${moment(item.timestamp)}`;
        return item;
      });
      blocks.reverse();
      action.payload.blocks = blocks;
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
