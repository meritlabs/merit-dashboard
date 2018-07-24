import { appReducer, IAppState } from '@dashboard/common/reducers/app.reducer';
import { IRanks } from '@dashboard/common/models/ranks';
import { rankReducer } from '@dashboard/common/reducers/rank.reducer';
export interface IRootAppState {
  app: IAppState;
  ranks: IRanks;
}

export const reducer = {
  app: appReducer,
  ranks: rankReducer,
};
