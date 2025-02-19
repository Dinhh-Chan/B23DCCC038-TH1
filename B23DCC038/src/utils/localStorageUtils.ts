// src/utils/localStorageUtils.ts

import { Subject, SubjectList } from '../models/subject';

// Lưu danh sách môn học vào localStorage
export const saveSubjects = (subjects: SubjectList) => {
  localStorage.setItem('subjects', JSON.stringify(subjects));
};

// Lấy danh sách môn học từ localStorage
export const getSubjects = (): SubjectList => {
  const storedSubjects = localStorage.getItem('subjects');
  return storedSubjects ? JSON.parse(storedSubjects) : getDefaultSubjects(); // Nếu chưa có môn học, trả về môn học mặc định
};

// Tạo dữ liệu môn học mặc định
export const getDefaultSubjects = (): SubjectList => {
  return {
    "1": {
      id: "1",
      name: "Toán",
      studyTime: [
        "2025-02-19T10:00:00",
        "2025-02-20T11:00:00",
      ],
      duration: 60,
      contentLearned: "Giải phương trình bậc 2",
      notes: "Chú ý cách giải phương trình",
    },
    "2": {
      id: "2",
      name: "Văn",
      studyTime: [
        "2025-02-19T14:00:00",
      ],
      duration: 90,
      contentLearned: "Đọc văn bản nghị luận",
      notes: "Luyện tập viết văn",
    }
  };
};

// Thêm môn học mới
export const addSubject = (subject: Subject) => {
  const subjects = getSubjects();
  subjects[subject.id] = subject;
  saveSubjects(subjects);
};

// Cập nhật môn học
export const updateSubject = (subjectId: string, updatedSubject: Partial<Subject>) => {
  const subjects = getSubjects();
  if (subjects[subjectId]) {
    subjects[subjectId] = { ...subjects[subjectId], ...updatedSubject };
    saveSubjects(subjects);
  }
};

// Xóa môn học
export const deleteSubject = (subjectId: string) => {
  const subjects = getSubjects();
  delete subjects[subjectId];
  saveSubjects(subjects);
};
