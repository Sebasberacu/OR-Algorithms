export interface OptimalBstData {
  keys: Key[];
}

export interface Key{
  identifier: string;
  probability: number; // sum of all weights / weight
  weight: number; // selected by user
}