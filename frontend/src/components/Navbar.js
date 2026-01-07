import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="glass" variant="dark" expand="lg" className="navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/dashboard" className="navbar-brand">
          Task Manager
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3">
                  <span className="text-white">Welcome, {user.first_name}!</span>
                </Nav.Item>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
