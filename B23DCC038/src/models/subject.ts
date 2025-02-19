// src/models/subject.ts

export interface Subject {
  id: string;
  name: string;
  studyTime: string;
  duration: number;
  content: string;
  note: string;
}


export type SubjectList = Subject[];
