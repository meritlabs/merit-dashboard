import { appReducer, IAppState } from '@dashboard/common/reducers/app.reducer';

export interface IRootAppState {
  app: IAppState;
}

export const reducer = {
  app: appReducer,
};
