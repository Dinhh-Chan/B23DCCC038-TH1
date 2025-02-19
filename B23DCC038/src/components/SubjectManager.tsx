// src/components/SubjectManager.tsx

import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, InputNumber, message, Select } from 'antd';
import { Subject, SubjectList } from '../models/subject';
import { addSubject, updateSubject, deleteSubject, getSubjects } from '../utils/localStorageUtils';
import moment, { Moment } from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectList>({});
  const [subjectName, setSubjectName] = useState('');
  const [studyTimes, setStudyTimes] = useState<Moment[]>([]); // Lưu nhiều thời gian học
  const [duration, setDuration] = useState<number>(0);
  const [contentLearned, setContentLearned] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<Moment | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    // Tải lại dữ liệu môn học mỗi khi component được mount hoặc khi subjects thay đổi
    const subjectsFromStorage = getSubjects();
    setSubjects(subjectsFromStorage);
  }, []); // Chạy một lần khi component được mount

  // Cập nhật lại trạng thái khi thêm hoặc sửa môn học
  const reloadSubjects = () => {
    const subjectsFromStorage = getSubjects();
    setSubjects(subjectsFromStorage);
  };

  const handleAddSubject = () => {
    if (!subjectName || !studyTimes.length || duration <= 0 || !contentLearned) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      studyTime: studyTimes.map(time => time.format('YYYY-MM-DD HH:mm:ss')),
      duration: duration,
      contentLearned: contentLearned,
      notes: notes,
    };
    addSubject(newSubject);
    reloadSubjects(); // Tải lại môn học sau khi thêm
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
    reloadSubjects(); // Tải lại môn học sau khi xóa
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
        studyTime: studyTimes.map(time => time.format('YYYY-MM-DD HH:mm:ss')),
        duration: duration,
        contentLearned: contentLearned,
        notes: notes,
      };
      updateSubject(editingSubjectId, updatedSubject);
      reloadSubjects(); // Tải lại môn học sau khi sửa
      handleCloseModal();
    }
  };

  // Chức năng thêm thời gian học
  const handleAddStudyTime = () => {
    if (!newTime || !selectedSubject) {
      message.error('Vui lòng chọn thời gian học và môn học');
      return;
    }

    // Cập nhật mảng studyTimes cho môn học tương ứng
    const updatedSubjects = { ...subjects };
    const subjectToUpdate = updatedSubjects[selectedSubject];

    if (subjectToUpdate) {
      subjectToUpdate.studyTime = [
        ...subjectToUpdate.studyTime,
        newTime.format('YYYY-MM-DD HH:mm:ss'),
      ];
      updateSubject(subjectToUpdate.id, subjectToUpdate); // Cập nhật môn học trong localStorage
    }

    // Tải lại danh sách môn học
    reloadSubjects();
    setNewTime(null); // Reset thời gian học
    setSelectedSubject(null); // Reset môn học
  };

  // Chọn môn học để thêm lịch học
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const handleTimeChange = (value: Moment | null) => {
    setNewTime(value);
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
      render: (text: string[], record: Subject) => (
        <div>
          {text.map((time, idx) => (
            <div key={idx}>
              <span>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          ))}
        </div>
      ),
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

      <Button
        onClick={() => setIsModalVisible(true)}
        type="primary"
        style={{ marginBottom: '20px', marginLeft: '20px' }}
      >
        Thêm lịch học
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
              value={newTime}
              onChange={handleTimeChange}
              style={{ width: '100%' }}
              placeholder="Chọn thời gian học"
            />
          </Form.Item>

          <Form.Item label="Chọn môn học để thêm lịch học">
            <Select
              value={selectedSubject}
              onChange={handleSubjectChange}
              style={{ width: '100%' }}
              placeholder="Chọn môn học"
            >
              {Object.values(subjects).map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button onClick={handleAddStudyTime} type="primary" style={{ width: '100%' }}>
              Lưu lịch học
            </Button>
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
