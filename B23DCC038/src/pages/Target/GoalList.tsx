import React, { useState } from 'react';
import { Card, List, Tag, Button, Modal, Form, Input, Checkbox, message } from 'antd';
import { GoalData } from './types';
import './styles.css';

interface GoalListProps {
  goals: GoalData[];
  onUpdateGoal: (index: number, updatedGoal: GoalData) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onUpdateGoal }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingGoal, setEditingGoal] = useState<GoalData>({ goal: '', description: '', completed: false });

  // Mở modal chỉnh sửa với dữ liệu hiện tại
  const showEditModal = (index: number, goal: GoalData) => {
    setEditingIndex(index);
    setEditingGoal(goal);
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    if (!editingGoal.goal || !editingGoal.description) {
      message.warning('Vui lòng nhập đầy đủ mục tiêu và mô tả.');
      return;
    }
    if (editingIndex !== null) {
      onUpdateGoal(editingIndex, editingGoal);
      setIsEditModalVisible(false);
      setEditingIndex(null);
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingIndex(null);
  };

  return (
    <Card title="Danh sách Mục tiêu">
      <List
        dataSource={goals}
        renderItem={(goal, index) => (
          <List.Item key={index}>
            <List.Item.Meta title={goal.goal} description={goal.description} />
            {goal.completed ? <Tag color="green">Hoàn thành</Tag> : <Tag color="red">Chưa hoàn thành</Tag>}
            <Button type="link" className="btn-custom" onClick={() => showEditModal(index, goal)}>
              Chỉnh sửa
            </Button>
          </List.Item>
        )}
      />
      {/* Modal chỉnh sửa mục tiêu */}
      <Modal
        title="Chỉnh sửa Mục tiêu"
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Mục tiêu" required>
            <Input
              value={editingGoal.goal}
              onChange={(e) => setEditingGoal({ ...editingGoal, goal: e.target.value })}
              placeholder="Nhập mục tiêu"
            />
          </Form.Item>
          <Form.Item label="Mô tả" required>
            <Input.TextArea
              value={editingGoal.description}
              onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
              placeholder="Nhập mô tả"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Checkbox
              checked={editingGoal.completed}
              onChange={(e) => setEditingGoal({ ...editingGoal, completed: e.target.checked })}
            >
              {editingGoal.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default GoalList;
