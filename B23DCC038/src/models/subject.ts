// src/models/subject.ts

export interface Subject {
    id: string;
    name: string;
    studyTime: string[]; // Thay đổi từ string thành string[] để hỗ trợ nhiều thời gian học
    duration: number;  // Thời lượng học (ví dụ: phút)
    contentLearned: string; // Nội dung đã học
    notes: string; // Ghi chú
  }
  
  export interface SubjectList {
    [key: string]: Subject;
  }
  