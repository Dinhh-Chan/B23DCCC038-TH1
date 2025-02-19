import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Progress, message, Form, Select, Checkbox, Modal } from 'antd';
import { Subject } from '../../models/subject';

interface MonthGoalProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const MonthGoal: React.FC<MonthGoalProps> = ({ subjects, setSubjects }) => {
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0); // Mục tiêu tổng thời gian học trong tháng
  const [totalCompleted, setTotalCompleted] = useState<number>(0); // Tổng thời gian đã học trong tháng
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal để thêm mục tiêu học tập
  const [selectedSubject, setSelectedSubject] = useState<string>(""); // Môn học được chọn cho mục tiêu học tập
  const [targetMinutes, setTargetMinutes] = useState<number>(0); // Mục tiêu học tập (phút)
  const [tasks, setTasks] = useState<string[]>([]); // Các công việc cần làm (mảng các công việc được chọn)

  // Lấy dữ liệu từ localStorage (cập nhật các mục tiêu học tập cho các môn học)
  useEffect(() => {
    // Kiểm tra nếu localStorage chứa subjects
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      const parsedSubjects = JSON.parse(storedSubjects);
      setSubjects(parsedSubjects); // Cập nhật state với dữ liệu từ localStorage
    } else {
      console.log('No subjects found in localStorage');
    }

    // Lấy mục tiêu học tập từ localStorage
    const storedMonthGoal = localStorage.getItem('monthGoal');
    if (storedMonthGoal) {
      const parsedMonthGoal = JSON.parse(storedMonthGoal);
      if (parsedMonthGoal.monthlyGoal) {
        setMonthlyGoal(parsedMonthGoal.monthlyGoal);
      }
      if (parsedMonthGoal.tasks) {
        setTasks(parsedMonthGoal.tasks);
      }
    } else {
      console.log('No monthGoal found in localStorage');
    }
  }, [setSubjects]);

  // Tính toán tổng thời gian học trong tháng
  const calculateMonthProgress = () => {
    let total = 0;
    if (Array.isArray(subjects)) {
      subjects.forEach(subject => {
        total += subject.studyTime.length * subject.duration; // Tính tổng thời gian học trong tháng
      });
    }
    setTotalCompleted(total);
  };

  // Lưu mục tiêu học tập cho tháng
  const handleSetMonthlyGoal = () => {
    if (monthlyGoal <= 0) {
      message.warning('Mục tiêu tháng phải lớn hơn 0!');
      return;
    }

    // Lưu mục tiêu học tập vào localStorage
    const monthGoalData = { monthlyGoal, tasks };
    localStorage.setItem('monthGoal', JSON.stringify(monthGoalData));

    message.success(`Đã thiết lập mục tiêu học tập ${monthlyGoal} phút trong tháng.`);
    calculateMonthProgress();
  };

  // Tính tiến độ học tập
  const getMonthProgress = () => {
    if (monthlyGoal === 0) return 0; // Tránh chia cho 0
    return (totalCompleted / monthlyGoal) * 100;
  };

  // Hiển thị modal thêm mục tiêu học tập
  const showAddGoalModal = () => {
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Lưu mục tiêu học tập cho môn học
  const handleSaveGoal = () => {
    if (!selectedSubject || targetMinutes <= 0 || tasks.length === 0) {
      message.warning('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const newSubjectGoal = {
      subject: selectedSubject,
      target: targetMinutes,
      tasks,
    };

    const updatedSubjects = [...subjects];
    const subjectIndex = updatedSubjects.findIndex((subject) => subject.name === selectedSubject);

    if (subjectIndex > -1) {
      updatedSubjects[subjectIndex].target = targetMinutes;
      updatedSubjects[subjectIndex].tasks = tasks;
    }

    setSubjects(updatedSubjects);
    setIsModalVisible(false);
    message.success('Mục tiêu học tập đã được lưu.');
  };

  // Cập nhật tiến độ học tập
  const handleUpdateProgress = () => {
    if (!selectedSubject || targetMinutes <= 0) {
      message.warning('Vui lòng nhập số phút học!');
      return;
    }

    const updatedSubjects = [...subjects];
    const subjectIndex = updatedSubjects.findIndex((subject) => subject.name === selectedSubject);

    if (subjectIndex > -1) {
      updatedSubjects[subjectIndex].completed = (updatedSubjects[subjectIndex].completed || 0) + targetMinutes;
    }

    setSubjects(updatedSubjects);
    message.success(`Đã cộng ${targetMinutes} phút vào tiến độ học tập của môn ${selectedSubject}`);
  };

  // Xóa mục tiêu học tập của môn học
  const handleDeleteGoal = () => {
    const updatedSubjects = subjects.filter(subject => subject.name !== selectedSubject);

    setSubjects(updatedSubjects);
    message.success('Mục tiêu học tập của môn học đã được xóa');
    setIsModalVisible(false);
  };

  useEffect(() => {
    calculateMonthProgress();
  }, [subjects]);

  return (
    <div>
      <Card title="🎯 Thiết lập Mục tiêu Học tập">
        <Form layout="vertical">
          <Form.Item label="Mục tiêu học tập trong tháng (phút)">
            <InputNumber
              value={monthlyGoal}
              onChange={(value) => setMonthlyGoal(value ?? 0)}
              min={0}
              style={{ width: '100%' }}
              placeholder="Nhập mục tiêu học tập"
            />
          </Form.Item>
          <Button type="primary" onClick={handleSetMonthlyGoal} style={{ width: '100%' }}>
            Lưu Mục Tiêu
          </Button>
        </Form>

        <p><strong>Tiến độ học tập tháng:</strong></p>
        <Progress percent={getMonthProgress()} status={totalCompleted >= monthlyGoal ? 'success' : 'active'} />
        <p>{totalCompleted >= monthlyGoal ? '🎉 Chúc mừng! Bạn đã đạt mục tiêu tháng!' : `Tiến độ học tập: ${totalCompleted} phút`}</p>
      </Card>

      <Button type="primary" onClick={showAddGoalModal} style={{ marginTop: 20 }}>
        Thêm Mục Tiêu Học Tập
      </Button>

      {/* Modal để thêm mục tiêu học tập */}
      <Modal
        title="Thêm Mục Tiêu Học Tập"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSaveGoal}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Chọn môn học">
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: '100%' }}
              placeholder="Chọn môn học"
            >
              {Array.isArray(subjects) && subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.name}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Mục tiêu học tập (phút)">
            <InputNumber
              value={targetMinutes}
              onChange={(value) => setTargetMinutes(value ?? 0)}
              min={0}
              style={{ width: '100%' }}
              placeholder="Nhập mục tiêu học tập"
            />
          </Form.Item>

          <Form.Item label="Các công việc cần làm">
            <Checkbox.Group
              options={[
                { label: 'Luyện tập bài tập', value: 'practice' },
                { label: 'Xem video học', value: 'video' },
                { label: 'Đọc tài liệu', value: 'read' },
                { label: 'Giải đề thi', value: 'test' },
              ]}
              value={tasks}
              onChange={(checkedValues) => setTasks(checkedValues as string[])} // Chuyển kiểu checkedValues về string[]
            />
          </Form.Item>
        </Form>

        <Button type="primary" onClick={handleUpdateProgress} style={{ marginTop: 10, width: '100%' }}>
          Cập nhật tiến độ
        </Button>

        <Button danger onClick={handleDeleteGoal} style={{ marginTop: 10, width: '100%' }}>
          Xóa mục tiêu học tập
        </Button>
      </Modal>
    </div>
  );
};

export default MonthGoal;
