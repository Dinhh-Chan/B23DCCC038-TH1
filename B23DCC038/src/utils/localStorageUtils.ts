// src/utils/localStorageUtils.ts
import { Subject, SubjectList } from '../models/subject';

// Lưu danh sách môn học vào localStorage dưới dạng mảng
export const saveSubjects = (subjects: SubjectList) => {
  localStorage.setItem('subjects', JSON.stringify(subjects));
};

// Lấy danh sách môn học từ localStorage
export const getSubjects = (): SubjectList => {
  const storedSubjects = localStorage.getItem('subjects');
  return storedSubjects ? JSON.parse(storedSubjects) : [];
};

// Thêm môn học mới
export const addSubject = (subject: Subject) => {
  const subjects = getSubjects();
  subjects.push(subject); // Thêm môn học mới vào mảng
  saveSubjects(subjects);
};

// Sửa môn học
export const updateSubject = (subjectId: string, updatedSubject: Partial<Subject>) => {
  const subjects = getSubjects();
  const subjectIndex = subjects.findIndex((subject) => subject.id === subjectId);

  if (subjectIndex !== -1) {
    // Cập nhật môn học
    subjects[subjectIndex] = { ...subjects[subjectIndex], ...updatedSubject };
    saveSubjects(subjects);
  }
};

// Xóa môn học
export const deleteSubject = (subjectId: string) => {
  const subjects = getSubjects();
  const updatedSubjects = subjects.filter((subject) => subject.id !== subjectId);
  saveSubjects(updatedSubjects); // Cập nhật lại danh sách môn học
};
