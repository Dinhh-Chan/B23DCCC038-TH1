import React, { useState } from 'react';
import { Card, Input, Button, Checkbox, Form, message } from 'antd';

export interface GoalData {
  goal: string;
  description: string;
  completed: boolean;
}

interface AddGoalProps {
  onSaveGoal: (data: GoalData) => void;
}

const AddGoal: React.FC<AddGoalProps> = ({ onSaveGoal }) => {
  const [goal, setGoal] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!goal || !description) {
      message.warning('Vui lòng nhập đầy đủ mục tiêu và mô tả.');
      return;
    }
    const newGoal: GoalData = { goal, description, completed };
    onSaveGoal(newGoal);
    message.success('Mục tiêu đã được lưu.');
    // Reset form sau khi lưu
    setGoal('');
    setDescription('');
    setCompleted(false);
  };

  return (
    <Card title="Thêm Mục tiêu">
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Mục tiêu" required>
          <Input 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)} 
            placeholder="Nhập mục tiêu" 
          />
        </Form.Item>
        <Form.Item label="Mô tả" required>
          <Input.TextArea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Nhập mô tả" 
            rows={4} 
          />
        </Form.Item>
        <Form.Item label="Trạng thái">
          <Checkbox 
            checked={completed} 
            onChange={(e) => setCompleted(e.target.checked)}
          >
            {completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Lưu mục tiêu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddGoal;
