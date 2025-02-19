import React, { useState, useEffect } from "react";
import { Card, InputNumber, Button, Select, Progress, message, Modal } from "antd";
import { Option } from "antd/es/mentions";

interface Subject {
  name: string;
  target: number;  // Mục tiêu học tập (phút)
  completed: number;  // Tiến độ đã học (phút)
}

const Target: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // "YYYY-MM"
  const [selectedSubject, setSelectedSubject] = useState<string>(""); 
  const [subjects, setSubjects] = useState<Subject[]>([]); 
  const [subjects2, setSubjects2] = useState<Subject[]>([]); 
  const [targetMinutes, setTargetMinutes] = useState<number>(0);
  const [completedHours, setCompletedHours] = useState<number>(0); 
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Quản lý trạng thái của Modal
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false); // Modal chi tiết môn học
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null); // Lưu môn học hiện tại khi xem chi tiết

  // Load danh sách môn học từ localStorage khi component mount
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    setSubjects(Array.isArray(storedSubjects) ? storedSubjects : []);
  }, []);

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects2") || "[]");
    setSubjects2(Array.isArray(storedSubjects) ? storedSubjects : []);
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
      const subject = storedSubjects.find((sub: Subject) => sub.name === selectedSubject);
      if (subject) {
        setTargetMinutes(subject.target);
        setCompletedHours(Math.floor(subject.completed / 60));
      }
    }
  }, [selectedSubject]);

  const handleSetGoal = () => {
    if (targetMinutes <= 0) {
      message.warning("Mục tiêu phải lớn hơn 0 phút!");
      return;
    }

    const storedSubjects = JSON.parse(localStorage.getItem("subjects2") || "[]");
    const existingSubject = storedSubjects.find((subject: Subject) => subject.name === selectedSubject);

    if (existingSubject) {
      message.warning("Môn học này đã có mục tiêu!");
      return;
    }

    const newSubject = { name: selectedSubject, target: targetMinutes, completed: completedHours * 60 };
    const updatedSubjects = [...storedSubjects, newSubject];
    localStorage.setItem("subjects2", JSON.stringify(updatedSubjects));

    setSubjects2(updatedSubjects);
    message.success(`Đã đặt mục tiêu ${targetMinutes} phút cho môn học ${selectedSubject}`);
    setIsModalVisible(false);
  };

  const handleUpdateProgress = (subjectName: string, minutes: number) => {
    if (minutes <= 0) {
      message.warning("Số phút học phải lớn hơn 0!");
      return;
    }

    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const updatedSubjects = storedSubjects.map((subject: Subject) => {
      if (subject.name === subjectName) {
        const newCompleted = subject.completed + minutes;
        return { ...subject, completed: newCompleted };
      }
      return subject;
    });

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
    setSubjects(updatedSubjects);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDetailModalVisible(false);
  };

  const handleDeleteSubject = (subjectName: string) => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects2") || "[]");
    const updatedSubjects = storedSubjects.filter((subject: Subject) => subject.name !== subjectName);
    localStorage.setItem("subjects2", JSON.stringify(updatedSubjects));
    setSubjects2(updatedSubjects);
    message.success(`Đã xóa môn học ${subjectName}`);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject.name);
    setTargetMinutes(subject.target);
    setCompletedHours(Math.floor(subject.completed / 60));
    setIsModalVisible(true);
  };

  const handleViewDetail = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsDetailModalVisible(true);
  };

  const convertMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} giờ ${remainingMinutes} phút`;
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tạo kế hoạch học tập
      </Button>

      <Modal
        title="Tạo Kế Hoạch Học Tập"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Card title="🎯 Quản lý Mục tiêu Học tập">
          <div style={{ marginBottom: 16 }}>
            <p><strong>Chọn tháng:</strong></p>
            <Select
              defaultValue={selectedMonth}
              onChange={(month) => setSelectedMonth(month)}
              style={{ width: "100%" }}
            >
              <Option value="2025-01">Tháng 1, 2025</Option>
              <Option value="2025-02">Tháng 2, 2025</Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p><strong>Chọn môn học:</strong></p>
            <Select
              value={selectedSubject}
              onChange={(value) => setSelectedSubject(value)}
              style={{ width: "100%" }}
            >
              {subjects.map((subject) => (
                <Option key={subject.name} value={subject.name}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p><strong>Nhập mục tiêu học tập (phút):</strong></p>
            <InputNumber
              min={1}
              value={targetMinutes}
              onChange={(value) => setTargetMinutes(value || 0)} // Sửa lại cho phù hợp
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <p><strong>Nhập số giờ đã học:</strong></p>
            <InputNumber
              min={0}
              value={completedHours}
              onChange={(value) => setCompletedHours(value || 0)} // Sửa lại cho phù hợp
              style={{ width: "100%" }}
            />
          </div>

          <Button
            type="primary"
            onClick={handleSetGoal}
            style={{ marginTop: 8, width: "100%" }}
          >
            Lưu mục tiêu
          </Button>
        </Card>
      </Modal>

      <Modal
        title="Chi Tiết Môn Học"
        visible={isDetailModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {currentSubject && (
          <Card title={`Chi Tiết Môn Học: ${currentSubject.name}`}>
            <p><strong>Mục tiêu học tập:</strong> {currentSubject.target} phút</p>
            <p><strong>Tiến độ học:</strong> {currentSubject.completed} phút ({convertMinutesToHours(currentSubject.completed)} đã học)</p>
          </Card>
        )}
      </Modal>

      <div>
        <h3>Môn học hiện tại:</h3>
        {subjects2.length === 0 ? (
          <p>Chưa có môn học nào.</p>
        ) : (
          <ul>
            {subjects2.map((subject) => (
              <li key={subject.name}>
                <strong>{subject.name}</strong> - Mục tiêu: {subject.target} phút
                <br />
                Tiến độ: {subject.completed} phút ({convertMinutesToHours(subject.completed)} đã học)
                <Progress percent={(subject.completed / subject.target) * 100} status={subject.completed >= subject.target ? "success" : "active"} />
                <Button onClick={() => handleViewDetail(subject)} style={{ marginLeft: 8 }}>
                  Xem Chi Tiết
                </Button>
                <Button onClick={() => handleEditSubject(subject)} style={{ marginLeft: 8 }}>
                  Sửa
                </Button>
                <Button onClick={() => handleDeleteSubject(subject.name)} style={{ marginLeft: 8 }} danger>
                  Xóa
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Target;
