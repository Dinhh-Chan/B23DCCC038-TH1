// src/components/ProgressTracker.tsx

import React from 'react';
import { Subject } from '../models/subject';

interface ProgressTrackerProps {
  subject: Subject;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ subject }) => {
  const handleProgressChange = (newProgress: number) => {
    // Cập nhật tiến độ môn học
    // Ví dụ: gọi updateSubject để lưu lại tiến độ
  };

  return (
    <div>
      <h3>{subject.name}</h3>
      <p>Tiến độ: {subject.progress}%</p>
      <p>Mục tiêu: {subject.target} bài học</p>
      <button onClick={() => handleProgressChange(subject.progress + 10)}>Tăng tiến độ</button>
    </div>
  );
};

export default ProgressTracker;
