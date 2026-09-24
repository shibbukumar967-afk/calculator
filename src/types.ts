export type CalculatorMode = 
  | 'standard' 
  | 'scientific' 
  | 'financial' 
  | 'converter' 
  | 'date' 
  | 'programmer';

export type AngleMode = 'DEG' | 'RAD';

export type Theme = 'dark' | 'light';

export type Language = 'en' | 'hi';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalculatorMode;
}

export type UnitCategory = 
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'storage'
  | 'time';

export interface UnitDefinition {
  id: string;
  name: string;
  nameHi: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}
