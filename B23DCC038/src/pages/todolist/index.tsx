import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Form, Input, Row, Col } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './TodoList.css';

interface Task {
  id: string;
  title: string;
  description: string;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const pastelColors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E2BAFF'];

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (newTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const openModal = (task?: Task) => {
    setIsModalVisible(true);
    if (task) {
      setEditingTask(task);
      form.setFieldsValue(task);
    } else {
      setEditingTask(null);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = (values: Omit<Task, 'id'>) => {
    if (editingTask) {
      const updatedTasks = tasks.map((t) =>
        t.id === editingTask.id ? { ...t, ...values } : t
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
    } else {
      const newTask: Task = {
        id: uuidv4(),
        ...values,
      };
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
    }
    setIsModalVisible(false);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>TODO LIST</h1>
        <Button type="primary" className="create-btn" onClick={() => openModal()}>
          CREATE TASK
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {tasks.map((task, index) => {
          // Lấy màu nền pastel dựa trên index
          const backgroundColor = pastelColors[index % pastelColors.length];
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
              <Card
                className="task-card"
                title={task.title}
                extra={
                  <>
                    <Button type="link" onClick={() => openModal(task)}>
                      <EditOutlined />
                    </Button>
                    <Button type="link" danger onClick={() => deleteTask(task.id)}>
                      <DeleteOutlined />
                    </Button>
                  </>
                }
                style={{ backgroundColor }}
              >
                <p>{task.description}</p>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title={editingTask ? 'Sửa nhiệm vụ' : 'Tạo nhiệm vụ'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          className="modal-form"
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Hãy nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Hãy nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingTask ? 'Cập nhập' : 'Tạo'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;
