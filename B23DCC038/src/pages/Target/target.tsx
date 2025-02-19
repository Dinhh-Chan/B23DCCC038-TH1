import React, { useState, useEffect } from 'react';
import MonthGoal from './index';
import { Subject } from '../../models/subject';

const ParentComponent: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]); // Đảm bảo dùng useState để tạo state

  // Lấy subjects từ localStorage khi component mount
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    setSubjects(storedSubjects);
  }, []);

  return (
    <div>
      <MonthGoal subjects={subjects} setSubjects={setSubjects} /> {/* Truyền setSubjects vào đây */}
    </div>
  );
};

export default ParentComponent;
