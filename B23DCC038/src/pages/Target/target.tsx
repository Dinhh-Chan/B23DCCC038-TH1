import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AddGoal, { GoalData } from './AddGoal';
import GoalList from './GoalList';

const ParentComponent: React.FC = () => {
  const [goals, setGoals] = useState<GoalData[]>([]);

  // Khi component mount, lấy dữ liệu từ localStorage (nếu có)
  useEffect(() => {
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Hàm thêm mục tiêu mới, cập nhật state và lưu vào localStorage
  const addGoal = (goal: GoalData) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/list">Danh sách mục tiêu</Link>
          <Link to="/add" style={{ marginLeft: '10px' }}>Thêm mục tiêu</Link>
        </nav>
        <Switch>
          <Route path="/add">
            <AddGoal onSaveGoal={addGoal} />
          </Route>
          <Route path="/list">
            <GoalList goals={goals} />
          </Route>
          {/* Mặc định hiển thị trang danh sách mục tiêu */}
          <Route path="/">
            <GoalList goals={goals} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default ParentComponent;
