export interface Subject {
    id: string;
    name: string;
    progress: number; // Tiến độ học tập (0 - 100%)
    target: number; // Mục tiêu học tập (ví dụ: số bài học trong tháng)
  }
  
  export interface SubjectList {
    [key: string]: Subject;
  }