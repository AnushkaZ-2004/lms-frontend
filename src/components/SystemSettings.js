import React, { useState } from 'react';

function SystemSettings() {
    const [settings, setSettings] = useState({
        appName: 'Learning Management System',
        logo: '',
        primaryColor: '#2563eb',
        secondaryColor: '#ffffff'
    });

    const handleSaveSettings = () => {
        // Here you would typically save settings to your backend
        localStorage.setItem('lmsSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    const handleResetSettings = () => {
        if (window.confirm('Are you sure you want to reset all settings to default?')) {
            setSettings({
                appName: 'Learning Management System',
                logo: '',
                primaryColor: '#2563eb',
                secondaryColor: '#ffffff'
            });
            localStorage.removeItem('lmsSettings');
            alert('Settings reset to default values!');
        }
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>System Settings</h1>
                <p>Configure application settings</p>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h3>Application Settings</h3>
                    <div className="form-group">
                        <label>Application Name</label>
                        <input
                            type="text"
                            value={settings.appName}
                            onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                            placeholder="Enter application name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Logo URL</label>
                        <input
                            type="url"
                            value={settings.logo}
                            onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                </div>

                <div className="settings-card">
                    <h3>Theme Settings</h3>
                    <div className="form-group">
                        <label>Primary Color</label>
                        <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Secondary Color</label>
                        <input
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        />
                    </div>
                </div>

                <div className="settings-card">
                    <h3>System Information</h3>
                    <div className="info-row">
                        <span>Version:</span>
                        <span>1.0.0</span>
                    </div>
                    <div className="info-row">
                        <span>Database:</span>
                        <span>MySQL</span>
                    </div>
                    <div className="info-row">
                        <span>Backend:</span>
                        <span>Spring Boot Microservices</span>
                    </div>
                    <div className="info-row">
                        <span>Frontend:</span>
                        <span>React.js</span>
                    </div>
                    <div className="info-row">
                        <span>Admin Users:</span>
                        <span>Active</span>
                    </div>
                    <div className="info-row">
                        <span>Last Backup:</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>API Endpoints</h3>
                    <div className="info-row">
                        <span>Auth Service:</span>
                        <span>Port 8081</span>
                    </div>
                    <div className="info-row">
                        <span>Student Service:</span>
                        <span>Port 8082</span>
                    </div>
                    <div className="info-row">
                        <span>Lecturer Service:</span>
                        <span>Port 8083</span>
                    </div>
                    <div className="info-row">
                        <span>Course Service:</span>
                        <span>Port 8084</span>
                    </div>
                    <div className="info-row">
                        <span>Assignment Service:</span>
                        <span>Port 8085</span>
                    </div>
                    <div className="info-row">
                        <span>Submission Service:</span>
                        <span>Port 8086</span>
                    </div>
                    <div className="info-row">
                        <span>Announcement Service:</span>
                        <span>Port 8087</span>
                    </div>
                    <div className="info-row">
                        <span>Quiz Service:</span>
                        <span>Port 8088</span>
                    </div>
                    <div className="info-row">
                        <span>Material Service:</span>
                        <span>Port 8089</span>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                    Save Settings
                </button>
                <button className="btn btn-secondary" onClick={handleResetSettings}>
                    Reset to Default
                </button>
            </div>
        </div>
    );
}

export default SystemSettings;