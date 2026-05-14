export type HistoryEntryStatus = 'COMPLETED' | 'PENDING' | 'SYSTEM';
export type HistoryEntryType = 'debit' | 'credit';

export interface RewardHistory {
  id: string;
  title: string;
  date: string;
  points: number;
  type: HistoryEntryType;
  status: HistoryEntryStatus;
  icon: string;
}
