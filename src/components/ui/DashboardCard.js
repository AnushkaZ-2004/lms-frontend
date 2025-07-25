import React from 'react';
import './DashboardCard.css';

function DashboardCard({ title, value, icon, color, onClick }) {
    return (
        <div
            className="dashboard-card"
            style={{ borderTop: `4px solid ${color}` }}
            onClick={onClick}
        >
            <div className="card-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{value}</p>
            </div>
        </div>
    );
}

export default DashboardCard;