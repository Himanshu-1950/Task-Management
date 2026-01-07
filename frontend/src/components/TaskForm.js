import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

const TaskForm = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    category_id: '',
    tag_ids: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchCategoriesAndTags();
    if (id) {
      setIsEdit(true);
      fetchTask();
    } else {
      setFetchLoading(false);
    }
  }, [id]);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/tasks/categories/'),
        axios.get('http://localhost:8000/api/tasks/tags/'),
      ]);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      setError('Failed to load categories and tags');
    }
  };

  const fetchTask = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tasks/${id}/`);
      const task = response.data;
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        category_id: task.category ? task.category.id : '',
        tag_ids: task.tags ? task.tags.map(tag => tag.id) : [],
      });
    } catch (error) {
      setError('Failed to load task');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({
      ...formData,
      tag_ids: selectedOptions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        category_id: formData.category_id || null,
        tag_ids: formData.tag_ids,
      };

      console.log('Sending data:', dataToSend); // Debug log

      if (isEdit) {
        await axios.put(`http://localhost:8000/api/tasks/${id}/`, dataToSend);
      } else {
        await axios.post('http://localhost:8000/api/tasks/', dataToSend);
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error.response?.data); // Debug log
      setError(error.response?.data?.detail || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <Card className="fade-in">
          <Card.Header className="text-center">
            <h3 className="mb-0">
              {isEdit ? '✏️ Edit Task' : '✨ Create New Task'}
            </h3>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Form.Select
                  multiple
                  name="tag_ids"
                  value={formData.tag_ids}
                  onChange={handleTagChange}
                >
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Hold Ctrl (Cmd on Mac) to select multiple tags
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/tasks')}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TaskForm;
