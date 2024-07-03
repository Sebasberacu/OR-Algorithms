export interface KnapsackProblemData {
  items: KnapsackItem[];
  maxKnapsackCapacity: number;
  maxPerItemCapacity: number;
}

export interface KnapsackItem {
  weight: number;
  value: number;
  identifier: string;
}