export class currentBlock {
  constructor(public height: number, public hash: string, public timestamp: string, public difficulty: number) {}
}

export class lastRetargetBlock {
  constructor(public height: number, public hash: string, public timestamp: string, public difficulty: number) {}
}

export class Stats {
  constructor(
    public networkCyclesPS: number,
    public networkAvgCyclesPS: number,
    public currentBlock: currentBlock,
    public lastRetargetBlock: lastRetargetBlock,
    public lastRetargetInBlocks: number,
    public blockTime: number,
    public retargetInBlocks: number,
    public retargetTimestamp: number,
    public retargetIn: string,
    public retargetAt: string,
    public retargetDifficulty: number,
    public currentSupply: number
  ) {}
}
