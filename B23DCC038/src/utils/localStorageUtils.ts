// src/utils/localStorageUtils.ts

import { Subject, SubjectList } from '../models/subject';

// Lưu danh sách môn học vào localStorage
export const saveSubjects = (subjects: SubjectList) => {
  localStorage.setItem('subjects', JSON.stringify(subjects));
};

// Lấy danh sách môn học từ localStorage
export const getSubjects = (): SubjectList => {
  const storedSubjects = localStorage.getItem('subjects');
  return storedSubjects ? JSON.parse(storedSubjects) : {};
};

// Thêm môn học mới
export const addSubject = (subject: Subject) => {
  const subjects = getSubjects();
  subjects[subject.id] = subject;
  saveSubjects(subjects);
};

// Sửa môn học
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
