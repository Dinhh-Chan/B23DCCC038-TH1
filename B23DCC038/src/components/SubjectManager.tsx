import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, InputNumber, message } from 'antd';
import { Subject, SubjectList } from '../models/subject';
import { addSubject, updateSubject, deleteSubject, getSubjects } from '../utils/localStorageUtils';
import moment, { Moment } from 'moment';

const { TextArea } = Input;

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectList>({});
  const [subjectName, setSubjectName] = useState('');
  const [studyTimes, setStudyTimes] = useState<Moment[]>([]); // Lưu nhiều thời gian học
  const [duration, setDuration] = useState<number>(0);
  const [contentLearned, setContentLearned] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const handleAddSubject = () => {
    if (!subjectName || !studyTimes.length || duration <= 0 || !contentLearned) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      studyTime: studyTimes.map(time => time.format('YYYY-MM-DD HH:mm:ss')), // Lưu nhiều thời gian học
      duration: duration,
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
    setStudyTimes(subject.studyTime.map((time: string) => moment(time, 'YYYY-MM-DD HH:mm:ss')));
    setDuration(subject.duration);
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
    setStudyTimes([]);
    setDuration(0);
    setContentLearned('');
    setNotes('');
  };

  const handleSaveEdit = () => {
    if (editingSubjectId) {
      const updatedSubject: Partial<Subject> = {
        name: subjectName,
        studyTime: studyTimes.map(time => time.format('YYYY-MM-DD HH:mm:ss')), // Lưu nhiều thời gian học
        duration: duration,
        contentLearned: contentLearned,
        notes: notes,
      };
      updateSubject(editingSubjectId, updatedSubject);
      setSubjects(getSubjects());
      handleCloseModal();
    }
  };

  const handleAddStudyTime = (value: Moment | null, dateString: string) => {
    if (value && value.isBefore(moment())) {
      message.error('Thời gian học không thể ở quá khứ');
      return;
    }
    if (value) {
      setStudyTimes([...studyTimes, value]);
    }
  };

  const columns = [
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thời gian học',
      dataIndex: 'studyTime',
      key: 'studyTime',
      render: (text: string[]) => text.map(time => moment(time).format('YYYY-MM-DD HH:mm:ss')).join(', '),
    },
    {
      title: 'Thời lượng học',
      dataIndex: 'duration',
      key: 'duration',
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
          <Form.Item label="Tên môn học">
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Nhập tên môn học"
            />
          </Form.Item>

          <Form.Item label="Thời gian học">
            <DatePicker
              showTime
              onChange={handleAddStudyTime}
              style={{ width: '100%' }}
              placeholder="Chọn thời gian học"
            />
          </Form.Item>

          <Form.Item label="Thời lượng học (phút)">
            <InputNumber
              value={duration}
              onChange={(value) => setDuration(value!)}
              min={0}
              style={{ width: '100%' }}
              placeholder="Nhập thời lượng học (phút)"
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
