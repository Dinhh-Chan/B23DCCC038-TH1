// src/components/SubjectManager.tsx

import React, { useState, useEffect } from 'react';
import { Button, Input, List } from 'antd';
import { Subject, SubjectList } from '../models/subject';
import { addSubject, updateSubject, deleteSubject, getSubjects } from '../utils/localStorageUtils';

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectList>({});
  const [subjectName, setSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const handleAddSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      progress: 0,
      target: 0,
    };
    addSubject(newSubject);
    setSubjects(getSubjects());
    setSubjectName('');
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
  };

  const handleSaveEdit = () => {
    if (editingSubject) {
      updateSubject(editingSubject.id, { name: subjectName });
      setSubjects(getSubjects());
      setEditingSubject(null);
      setSubjectName('');
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    deleteSubject(subjectId);
    setSubjects(getSubjects());
  };

  return (
    <div>
      <Input
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        placeholder="Nhập tên môn học"
      />
      <Button onClick={editingSubject ? handleSaveEdit : handleAddSubject}>
        {editingSubject ? 'Lưu' : 'Thêm môn học'}
      </Button>

      <List
        bordered
        dataSource={Object.values(subjects)}
        renderItem={(subject) => (
          <List.Item>
            {subject.name}
            <Button onClick={() => handleEditSubject(subject)}>Sửa</Button>
            <Button onClick={() => handleDeleteSubject(subject.id)}>Xóa</Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default SubjectManager;
