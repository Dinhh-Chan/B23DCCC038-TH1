import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Modal, Form, Input, Checkbox, message } from 'antd';
import { GoalData } from './types';
import './styles.css'; // Import file CSS cho nút
import GoalList from './GoalList';

const ParentComponent: React.FC = () => {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState<GoalData>({ goal: '', description: '', completed: false });

  // Khi component mount, lấy dữ liệu từ localStorage (nếu có)
  useEffect(() => {
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Thêm mục tiêu mới
  const addGoal = (goal: GoalData) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
    message.success('Mục tiêu đã được lưu.');
  };

  const handleAddModalOk = () => {
    if (!newGoal.goal || !newGoal.description) {
      message.warning('Vui lòng nhập đầy đủ mục tiêu và mô tả.');
      return;
    }
    addGoal(newGoal);
    setNewGoal({ goal: '', description: '', completed: false });
    setIsAddModalVisible(false);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  // Cập nhật mục tiêu (được truyền xuống GoalList)
  const updateGoal = (index: number, updatedGoal: GoalData) => {
    const newGoals = [...goals];
    newGoals[index] = updatedGoal;
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
    message.success('Mục tiêu đã được cập nhật.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button
          type="primary"
          className="btn-custom"
          onClick={() => setIsAddModalVisible(true)}
          style={{ marginRight: '10px' }}
        >
          Thêm mục tiêu
        </Button>
      </div>

      <GoalList goals={goals} onUpdateGoal={updateGoal} />

      {/* Modal thêm mục tiêu */}
      <Modal
        title="Thêm Mục tiêu"
        visible={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        okText="Lưu mục tiêu"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Mục tiêu" required>
            <Input
              value={newGoal.goal}
              onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
              placeholder="Nhập mục tiêu"
            />
          </Form.Item>
          <Form.Item label="Mô tả" required>
            <Input.TextArea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Nhập mô tả"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Checkbox
              checked={newGoal.completed}
              onChange={(e) => setNewGoal({ ...newGoal, completed: e.target.checked })}
            >
              {newGoal.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParentComponent;
