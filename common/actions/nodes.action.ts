import { Action } from '@ngrx/store';
import { Nodes } from '../models/network';

export namespace NODES_ACTION {
  export const LOAD_NODES = 'LOAD_NODES';
}

export class LoadNodes implements Action {
  readonly type = NODES_ACTION.LOAD_NODES;

  constructor(public payload: Nodes) {}
}

export type RanksAction = LoadNodes;
