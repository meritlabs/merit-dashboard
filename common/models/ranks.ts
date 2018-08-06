export interface IRanks {
  loading: boolean;
  lotteryanv: number;
  lotteryentrants: number;
  rannks?: IRank[];
}

export interface IRank {
  address: string;
  alias: string;
  rank: number;
  percentile: number;
  anv: number;
  anvpercent: number;
}

export class Ranks {
  constructor(
    public loading: boolean,
    public lotteryanv: number,
    public lotteryentrants: number,
    public ranks?: Rank[]
  ) {}
}

export class Rank {
  constructor(
    public address: string,
    public alias: string,
    public rank: number,
    public percentile: number,
    public anv: number,
    public anvpercent: number
  ) {}
}
