import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message, Select } from 'antd';
import { Subject, SubjectList } from '../models/subject';
import { addSubject, updateSubject, deleteSubject, getSubjects } from '../utils/localStorageUtils';

const { TextArea } = Input;
const { Option } = Select;

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectList>({});
  const [subjectName, setSubjectName] = useState('');
  const [contentLearned, setContentLearned] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const handleAddSubject = () => {
    if (!subjectName || !contentLearned || !notes) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      studyTime: [], // Lịch học rỗng khi thêm môn học mới
      duration: 0, // Thời gian học mặc định
      contentLearned: contentLearned,
      notes: notes,
    };
    addSubject(newSubject);
    setSubjects(getSubjects());
    setIsModalVisible(false);
    resetForm();
  };

  const handleEditSubject = (subjectId: string) => {
    const subject = subjects[subjectId];
    setSubjectName(subject.name);
    setContentLearned(subject.contentLearned);
    setNotes(subject.notes);
    setEditingSubjectId(subjectId);
    setIsModalVisible(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    deleteSubject(subjectId);
    setSubjects(getSubjects());
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    resetForm();
    setEditingSubjectId(null);
  };

  const resetForm = () => {
    setSubjectName('');
    setContentLearned('');
    setNotes('');
  };

  const handleSaveEdit = () => {
    if (editingSubjectId) {
      const updatedSubject: Partial<Subject> = {
        name: subjectName,
        contentLearned: contentLearned,
        notes: notes,
      };
      updateSubject(editingSubjectId, updatedSubject);
      setSubjects(getSubjects());
      handleCloseModal();
    }
  };

  // Chỉ hiển thị tên môn học, nội dung học và ghi chú trong bảng
  const columns = [
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nội dung đã học',
      dataIndex: 'contentLearned',
      key: 'contentLearned',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: string, record: Subject) => (
        <div>
          <Button onClick={() => handleEditSubject(record.id)} style={{ marginRight: 10 }}>
            Sửa
          </Button>
          <Button onClick={() => handleDeleteSubject(record.id)} danger>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)} type="primary" style={{ marginBottom: '20px' }}>
        Thêm môn học
      </Button>

      <Modal
        title={editingSubjectId ? 'Sửa môn học' : 'Thêm môn học'}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={editingSubjectId ? handleSaveEdit : handleAddSubject}
      >
        <Form layout="vertical">
          {/* Form thêm môn học */}
          <Form.Item label="Tên môn học">
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Nhập tên môn học"
            />
          </Form.Item>

          <Form.Item label="Nội dung đã học">
            <TextArea
              value={contentLearned}
              onChange={(e) => setContentLearned(e.target.value)}
              rows={4}
              placeholder="Nhập nội dung đã học"
            />
          </Form.Item>

          <Form.Item label="Ghi chú">
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Nhập ghi chú"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={Object.values(subjects)}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default SubjectManager;
