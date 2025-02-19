// src/pages/CalendarPage.tsx
import React, { useState, useEffect } from 'react';
import CalendarView from '../../components/CalendarView';
import { Subject } from '../../models/subject';
import { getSubjects } from '../../utils/localStorageUtils';

const CalendarPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(Object.values(getSubjects())); // Đảm bảo đây là useState

  return (
    <div>
      <h1>Lịch học</h1>
      <CalendarView subjects={subjects} setSubjects={setSubjects} /> {/* Truyền setSubjects */}
    </div>
  );
};

export default CalendarPage;
