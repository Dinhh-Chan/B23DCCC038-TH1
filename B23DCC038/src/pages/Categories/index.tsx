// src/App.tsx

import React from 'react';
import SubjectManager from '../../components/SubjectManager';
import ProgressTracker from '../../components/ProgressTracker';
import { getSubjects } from '../../utils/localStorageUtils';

const App: React.FC = () => {
  const subjects = getSubjects();

  return (
    <div>
      <h1>Quản lý tiến độ học tập</h1>
      <SubjectManager />
      <div>
        <h2>Tiến độ học tập</h2>
        {Object.values(subjects).map((subject) => (
          <ProgressTracker key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default App;
