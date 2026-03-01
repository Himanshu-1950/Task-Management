import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Spinner, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    fetchTags();
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, statusFilter, priorityFilter, tagFilter]);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (tagFilter) params.tags = tagFilter;

      const response = await axios.get('http://localhost:8000/api/tasks/', { params });
      setTasks(response.data);
    } catch (error) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tags/');
      setTags(response.data);
    } catch (error) {
      console.error('Failed to load tags');
    }
  };



  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📋 Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary btn-lg">
          ➕ Create New Task
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Card className="mb-4 fade-in">
        <Card.Body>
          <Row>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="in_progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.name}>🏷️ {tag.name}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Task List */}
      <Row>
        {tasks.length === 0 ? (
          <Col>
            <Card className="text-center fade-in">
              <Card.Body>
                <div className="py-5">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                  <h4 className="text-muted">No tasks found</h4>
                  <p className="text-muted">Create your first task to get started!</p>
                  <Link to="/tasks/new" className="btn btn-primary btn-lg">
                    ✨ Create Your First Task
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          tasks.map(task => (
            <Col md={6} lg={4} key={task.id} className="mb-4">
              <Card className={`task-card ${task.priority} fade-in`}>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-start mb-3">
                    <span className="fw-bold">{task.title}</span>
                    <Badge bg={getPriorityBadgeVariant(task.priority)} className="ms-2">
                      {task.priority.toUpperCase()}
                    </Badge>
                  </Card.Title>

                  <Card.Text className="text-muted mb-3">
                    {task.description || 'No description provided'}
                  </Card.Text>

                  <div className="mb-3">
                    <Badge bg={getStatusBadgeVariant(task.status)} className="me-2 mb-1">
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {task.category && (
                      <Badge bg="light" text="dark" className="mb-1">
                        📁 {task.category.name}
                      </Badge>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="mb-3">
                      {task.tags.map(tag => (
                        <Badge
                          key={tag.id}
                          className="me-1 mb-1"
                          style={{
                            backgroundColor: tag.color,
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          🏷️ {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-muted">
                      📅 Due: {formatDate(task.due_date)}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <Link to={`/tasks/edit/${task.id}`} className="btn btn-outline-primary btn-sm flex-fill">
                      ✏️ Edit
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="flex-fill"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default TaskList;
