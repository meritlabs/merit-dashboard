export class Node {
  constructor(public source: string, public target: string, public weight: string, public label?: string) {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.label = label || 'Anonymous';
  }
}
