export interface Sentence {
  id: string;
  targetSentence: string;
  englishSentence: string;
  albanianSentence: string;
  verb?: string;
  verbEnglish?: string;
  verbAlbanian?: string;
  audioSrcFr: string;
  audioSrcEn: string;
}

export enum StudyMode {
  ReadListen = 'readListen',
  ActiveRecall = 'activeRecall',
}

export interface PlaybackSpeed {
  label: string;
  value: number;
}
