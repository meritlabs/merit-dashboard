export class Nodes {
  constructor(public loading: boolean, public nodes: Node[]) {}
}
export class Node {
  constructor(public source: string, public target: string, public weight: number, public label?: string) {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.label = label || 'Anonymous';
  }
}

export interface INodes {
  loading: boolean;
  nodes: INode[];
}

export interface INode {
  source: string;
  target: string;
  weight: number;
  label?: string;
}
