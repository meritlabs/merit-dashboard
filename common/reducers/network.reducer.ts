import { Nodes, INode } from '../models/network';
import { NODES_ACTION, LoadNodes } from '../actions/nodes.action';

const INITIAL_STATE = new Nodes(false, 500, '', {}, []);

export function nodesReducer(state: Nodes = INITIAL_STATE, action: LoadNodes) {
  switch (action.type) {
    case NODES_ACTION.LOAD_NODES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
