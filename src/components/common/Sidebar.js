import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ items }) {
    const location = useLocation();

    return (
        <nav className="sidebar">
            <ul className="sidebar-nav">
                {items.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                isActive || location.pathname.startsWith(item.path)
                                    ? 'active'
                                    : ''
                            }
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Sidebar;