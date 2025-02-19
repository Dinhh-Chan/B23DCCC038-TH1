export interface Subject {
  id: string;
  name: string;
  studyTime: string[]; // Danh sách thời gian học
  duration: number; // Thời lượng học mỗi buổi
  contentLearned: string;
  notes: string;
  target?: number; // Mục tiêu học tập (phút)
  tasks?: string[]; // Các công việc cần làm (mảng các công việc được chọn)
  completed?: number; // Tổng số phút học đã hoàn thành
}

export type SubjectList = { [key: string]: Subject };
