import React, { useState, useEffect } from "react";
import { Card, InputNumber, Button, Select, Progress, message } from "antd";
import { Option } from "antd/es/mentions";

interface Subject {
  name: string;
  target: number;
  completed: number;
}

const Target: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // "YYYY-MM"
  const [selectedSubject, setSelectedSubject] = useState<string>(""); 
  const [subjects, setSubjects] = useState<Subject[]>([]); 
  const [targetMinutes, setTargetMinutes] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Load danh sách môn học từ localStorage khi component mount
  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    setSubjects(storedSubjects);
  }, []);

  // Chọn môn học và tải mục tiêu học tập
  useEffect(() => {
    if (selectedSubject) {
      const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
      const subject = storedSubjects.find((sub: Subject) => sub.name === selectedSubject);
      if (subject) {
        setTargetMinutes(subject.target);
        setProgress(subject.completed);
      }
    }
  }, [selectedSubject]);

  // Lưu mục tiêu học tập vào localStorage
  const handleSetGoal = () => {
    if (targetMinutes <= 0) {
      message.warning("Mục tiêu phải lớn hơn 0 phút!");
      return;
    }

    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const updatedSubjects = storedSubjects.map((subject: Subject) => {
      if (subject.name === selectedSubject) {
        return { ...subject, target: targetMinutes };
      }
      return subject;
    });
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
    message.success(`Đã đặt mục tiêu ${targetMinutes} phút cho môn học ${selectedSubject}`);
  };

  // Cập nhật tiến độ học tập
  const handleUpdateProgress = (minutes: number) => {
    if (minutes <= 0) {
      message.warning("Số phút học phải lớn hơn 0!");
      return;
    }

    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const updatedSubjects = storedSubjects.map((subject: Subject) => {
      if (subject.name === selectedSubject) {
        const newCompleted = subject.completed + minutes;
        return { ...subject, completed: newCompleted };
      }
      return subject;
    });

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
    setProgress(progress + minutes);
    message.success(`Đã cộng thêm ${minutes} phút vào tiến độ học tập cho môn ${selectedSubject}!`);
  };

  // Chọn tháng và lưu lại
  const handleChangeMonth = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <div>
      <Card title="🎯 Quản lý Mục tiêu Học tập">
        <div style={{ marginBottom: 16 }}>
          <p><strong>Chọn tháng:</strong></p>
          <Select
            defaultValue={selectedMonth}
            onChange={handleChangeMonth}
            style={{ width: "100%" }}
          >
            <Option value="2025-01">Tháng 1, 2025</Option>
            <Option value="2025-02">Tháng 2, 2025</Option>
            {/* Add more months */}
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
            <p><strong>Chọn môn học:</strong></p>
            <Select
                value={selectedSubject}
                onChange={setSelectedSubject}
                style={{ width: "100%" }}
                >
                {subjects.map((subject) => (
                    <Select.Option key={subject.name} value={subject.name}>
                    {subject.name}
                    </Select.Option>
                ))}
            </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p><strong>Nhập mục tiêu học tập (phút):</strong></p>
          <InputNumber
            min={1}
            value={targetMinutes}
            onChange={(value) => setTargetMinutes(value || 0)}
            style={{ width: "100%" }}
          />
          <Button
            type="primary"
            onClick={handleSetGoal}
            style={{ marginTop: 8, width: "100%" }}
          >
            Lưu mục tiêu
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p><strong>Nhập số phút đã học:</strong></p>
          <InputNumber
            min={1}
            onChange={(value) => handleUpdateProgress(value || 0)}
            style={{ width: "100%" }}
          />
        </div>

        <p><strong>Tiến độ học tập:</strong></p>
        <Progress percent={(progress / targetMinutes) * 100} status={progress >= targetMinutes ? "success" : "active"} />

        {progress >= targetMinutes ? (
          <p style={{ color: "green", fontWeight: "bold" }}>🎉 Chúc mừng! Bạn đã hoàn thành mục tiêu!</p>
        ) : (
          <p>📊 Bạn đã học {progress}/{targetMinutes} phút.</p>
        )}
      </Card>
    </div>
  );
};

export default Target;
