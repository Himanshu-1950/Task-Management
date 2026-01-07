import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/');
      const tasks = response.data;
      const totalTasks = tasks.length;
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;

      setStats({
        totalTasks,
        pendingTasks,
        completedTasks,
        inProgressTasks,
      });
    } catch (error) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-primary">{stats.totalTasks}</Card.Title>
              <Card.Text>Total Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-warning">{stats.pendingTasks}</Card.Title>
              <Card.Text>Pending Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-info">{stats.inProgressTasks}</Card.Title>
              <Card.Text>In Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-success">{stats.completedTasks}</Card.Title>
              <Card.Text>Completed Tasks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100 slide-in-left">
            <Card.Header className="text-center">
              <h4 className="mb-0">🚀 Quick Actions</h4>
            </Card.Header>
            <Card.Body className="text-center">
              <p className="text-muted mb-4">Get started with your tasks</p>
              <div className="d-grid gap-3">
                <Link to="/tasks/new" className="btn btn-primary btn-lg">
                  <span className="me-2">➕</span>
                  Create New Task
                </Link>
                <Link to="/tasks" className="btn btn-outline-primary btn-lg">
                  <span className="me-2">📝</span>
                  View All Tasks
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="h-100 slide-in-right">
            <Card.Header className="text-center">
              <h4 className="mb-0">👋 Welcome Back!</h4>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-4">
                <div style={{
                  fontSize: '4rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  🎯
                </div>
                <h5 className="font-weight-bold">Hello {user?.first_name || user?.email}!</h5>
              </div>
              <div className="bg-light p-3 rounded">
                <p className="mb-2">
                  <strong>{stats.pendingTasks}</strong> pending tasks to work on
                </p>
                <p className="mb-0 text-muted">
                  Keep up the great work managing your tasks! 💪
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
