import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from './Button';
import './Header.css';

function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="admin-header">
            <div className="header-content">
                <h1>Learning Management System</h1>
                <div className="user-controls">
                    <span className="user-email">{user?.email}</span>
                    <Button small onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </header>
    );
}

export default Header;