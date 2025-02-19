// src/models/subject.ts

export interface Subject {
<<<<<<< HEAD
  id: string;
  name: string;
  studyTime: string;
  duration: number;
  content: string;
  note: string;
}


export type SubjectList = Subject[];
=======
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
  
>>>>>>> 6aaffcdb573ac24d0fced28b6ac3c485d9307d44
