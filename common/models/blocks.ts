export interface IBlocks {
  loading: boolean;
  blocks?: IBlock[];
}

export interface IBlock {
  difficulty: number;
  hash: string;
  height: number;
  timestamp: string;
  lastChange?: string;
  difficultyChange?: string;
}

export class Blocks {
  constructor(public loading: boolean, public blocks?: Block[]) {}
}
export class Block {
  constructor(
    public difficulty: number,
    public hash: string,
    public height: number,
    public timestamp: string,
    public lastChange?: string,
    public difficultyChange?: string
  ) {}
}
