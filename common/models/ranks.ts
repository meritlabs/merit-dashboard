export interface IRanks {
  limit: number;
  lotteryanv: number;
  lotteryentrants: number;
  rannks: IRank[];
}

export interface IRank {
  address: string;
  alias: string;
  rank: number;
  percentile: number;
  anv: number;
  anvpercent: number;
}
