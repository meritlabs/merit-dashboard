import { appReducer, IAppState } from './app.reducer';
import { IRanks } from '../models/ranks';
import { rankReducer } from './rank.reducer';
import { IBlocks } from '../models/blocks';
import { blocksReducer } from './blocks.reducer';
import { INodes } from '../models/network';
import { nodesReducer } from './network.reducer';

export interface IRootAppState {
  app: IAppState;
  ranks: IRanks;
  blocks: IBlocks;
  nodes: INodes;
}

export const reducer = {
  app: appReducer,
  ranks: rankReducer,
  blocks: blocksReducer,
  nodes: nodesReducer,
};
