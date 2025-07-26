import React from 'react';

function Header({ user }) {
    return (
        <header className="header">
            <div className="header-left">
                <h1>Admin Dashboard</h1>
            </div>
            <div className="header-right">
                <div className="user-info">
                    <span>Welcome, {user.fullName}</span>
                    <div className="user-avatar">
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;