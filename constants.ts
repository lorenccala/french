import { PlaybackSpeed } from './types';

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2x', value: 2 },
];

export const DEFAULT_CHUNK_SIZE = 10;
export const MIN_CHUNK_SIZE = 1;
export const MAX_CHUNK_SIZE = 100; // Arbitrary max, adjust as needed
export const DEFAULT_PRACTICE_TIME_MINUTES = 5;
