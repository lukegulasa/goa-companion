
// This file is kept for compatibility but all cloud sync functionality has been removed
import { DataType } from './types';

export const fetchCloudData = async <T extends 'players' | 'games'>(): Promise<{ data: DataType<T>[], hasChanges: boolean }> => {
  return { data: [] as DataType<T>[], hasChanges: false };
};

export const pushToCloud = async <T extends 'players' | 'games'>(): Promise<void> => {
  // No-op function
  return;
};

export const mergeData = <T extends 'players' | 'games'>(
  localData: DataType<T>[]
): DataType<T>[] => {
  return localData;
};

export const setupCloudListener = <T extends 'players' | 'games'>(
  store: T,
  onCloudUpdate: () => void
): () => void => {
  // Return empty cleanup function
  return () => {};
};
