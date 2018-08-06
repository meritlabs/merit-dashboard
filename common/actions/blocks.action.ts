import { Action } from '@ngrx/store';
import { Blocks } from '../models/blocks';

export namespace BLOCKS_ACTION {
  export const LOAD_BLOCKS = 'LOAD_BLOCKS';
}

export class LoadBlocks implements Action {
  readonly type = BLOCKS_ACTION.LOAD_BLOCKS;

  constructor(public payload: Blocks) {}
}

export type RanksAction = LoadBlocks;
