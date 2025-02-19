// src/App.tsx

import React, { useState } from 'react';
import SubjectManager from '../../components/SubjectManager';
// import CalendarView from '../../components/CalendarView';
import { Subject } from '../../models/subject';
import { getSubjects } from '../../utils/localStorageUtils';

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(Object.values(getSubjects()));

  return (
    <div>
      <h1>Quản lý tiến độ học tập</h1>
      <SubjectManager />
      {/* <h2>Lịch học</h2>
      <CalendarView subjects={subjects} /> */}
    </div>
  );
};

export default App;
