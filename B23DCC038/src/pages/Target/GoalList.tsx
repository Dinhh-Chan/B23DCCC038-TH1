import React from 'react';
import { Card, List, Tag } from 'antd';
import { GoalData } from './AddGoal';

interface GoalListProps {
  goals: GoalData[];
}

const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  return (
    <Card title="Danh sách Mục tiêu">
      <List
        dataSource={goals}
        renderItem={(goal, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={goal.goal}
              description={goal.description}
            />
            {goal.completed 
              ? <Tag color="green">Hoàn thành</Tag> 
              : <Tag color="red">Chưa hoàn thành</Tag>
            }
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GoalList;
