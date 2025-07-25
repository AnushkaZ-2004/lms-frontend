import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Settings.css';

function Settings() {
    const { user } = useContext(AuthContext);
    const [settings, setSettings] = useState({
        appName: 'Learning Management System',
        logo: '',
        darkMode: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement settings save
        alert('Settings saved!');
    };

    return (
        <div className="settings-page">
            <h1>System Settings</h1>

            <form onSubmit={handleSubmit} className="settings-form">
                <Input
                    label="Application Name"
                    name="appName"
                    value={settings.appName}
                    onChange={handleChange}
                />

                <div className="form-group">
                    <label className="form-label">Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    setSettings(prev => ({ ...prev, logo: event.target.result }));
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}
                    />
                    {settings.logo && (
                        <div className="logo-preview">
                            <img src={settings.logo} alt="Logo preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="darkMode"
                            checked={settings.darkMode}
                            onChange={handleChange}
                        />
                        Enable Dark Mode
                    </label>
                </div>

                <div className="form-actions">
                    <Button type="submit" primary>
                        Save Settings
                    </Button>
                </div>
            </form>

            <div className="user-info">
                <h2>User Information</h2>
                <p><strong>Name:</strong> {user?.fullName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>
        </div>
    );
}

export default Settings;