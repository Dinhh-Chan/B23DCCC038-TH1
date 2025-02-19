export interface Subject {
    id: string;
    name: string;
    studyTime: string; // Thời gian học (Ngày giờ)
    duration: number;  // Thời lượng học (ví dụ: phút)
    contentLearned: string; // Nội dung đã học
    notes: string; // Ghi chú
  }
  
  export interface SubjectList {
    [key: string]: Subject;
  }