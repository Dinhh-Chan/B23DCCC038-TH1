// src/components/SubjectDetails.tsx

import React, { useState } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import { Subject } from '../models/subject';
import { updateSubject } from '../utils/localStorageUtils';

interface SubjectDetailsProps {
  subject: Subject;
  onClose: () => void;
}

const SubjectDetails: React.FC<SubjectDetailsProps> = ({ subject, onClose }) => {
  const [form] = Form.useForm();
  const [subjectData, setSubjectData] = useState<Subject>(subject);

  const handleSave = () => {
    updateSubject(subject.id, subjectData);
    onClose();
  };

  const handleChange = (field: keyof Subject, value: any) => {
    setSubjectData({ ...subjectData, [field]: value });
  };

  return (
    <Modal
      title="Chi tiết môn học"
      visible={true}
      onCancel={onClose}
      onOk={handleSave}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Tên môn học">
          <Input
            value={subjectData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Thời gian học">
          <Input
            value={subjectData.studyTime}
            onChange={(e) => handleChange('studyTime', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Thời lượng học (phút)">
          <Input
            type="number"
            value={subjectData.duration}
            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Nội dung đã học">
          <Input
            value={subjectData.contentLearned}
            onChange={(e) => handleChange('contentLearned', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Ghi chú">
          <Input
            value={subjectData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectDetails;
