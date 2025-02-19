import React from 'react';
import { Subject } from '@/models/subjectModel';

interface GoalPageProps {
  subjects: Subject[];
}

const GoalPage: React.FC<GoalPageProps> = ({ subjects }) => {
  return (
    <div>
      <h2>Set Learning Goals</h2>
      {subjects.map((subject) => (
        <div key={subject.id}>
          <h3>{subject.name}</h3>
          {/* Form or UI to set goals */}
        </div>
      ))}
    </div>
  );
};

export default GoalPage;
