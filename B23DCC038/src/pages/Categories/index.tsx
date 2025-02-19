// src/App.tsx

import React from 'react';
import SubjectManager from '../../components/SubjectManager';
<<<<<<< HEAD
import ProgressTracker from '../../components/ProgressTracker';
import { getSubjects } from '../../utils/localStorageUtils';

const App: React.FC = () => {
  const subjects = getSubjects();
=======
import CalendarView from '../../components/CalendarView';
import { Subject } from '../../models/subject';
import { getSubjects } from '../../utils/localStorageUtils';

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(Object.values(getSubjects()));
>>>>>>> 6aaffcdb573ac24d0fced28b6ac3c485d9307d44

  return (
    <div>
      <h1>Quản lý tiến độ học tập</h1>
      <SubjectManager />
<<<<<<< HEAD
      <div>
        <h2>Tiến độ học tập</h2>
        {Object.values(subjects).map((subject) => (
          <ProgressTracker key={subject.id} subject={subject} />
        ))}
      </div>
=======
      <h2>Lịch học</h2>
      <CalendarView subjects={subjects} />
>>>>>>> 6aaffcdb573ac24d0fced28b6ac3c485d9307d44
    </div>
  );
};

export default App;
