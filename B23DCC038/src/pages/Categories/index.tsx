// src/App.tsx

import React, { useState } from 'react';
import SubjectManager from '../../components/SubjectManager';
import SubjectDetails from '../../components/SubjectDetails';
import { Subject } from '../../models/subject';

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleCloseDetails = () => {
    setSelectedSubject(null);
  };

  return (
    <div>
      <h1>Quản lý tiến độ học tập</h1>
      <SubjectManager />
      {selectedSubject && (
        <SubjectDetails subject={selectedSubject} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default App;
