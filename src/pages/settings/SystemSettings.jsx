import React, { useState } from 'react';
import { Save, Settings, Upload, Bell, Shield, Database } from 'lucide-react';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        appName: 'Learning Management System',
        appLogo: '',
        enableNotifications: true,
        maxFileSize: '10',
        allowedFileTypes: 'pdf,doc,docx,ppt,pptx,txt',
        sessionTimeout: '30',
        enableRegistration: true,
        defaultUserRole: 'STUDENT',
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: false
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error saving settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                            <input
                                type="text"
                                value={settings.appName}
                                onChange={(e) => handleChange('appName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Application Logo</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Logo</span>
                                </label>
                                <span className="text-sm text-gray-500">PNG, JPG up to 2MB</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                            <input
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* File Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Database className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">File Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                            <input
                                type="number"
                                value={settings.maxFileSize}
                                onChange={(e) => handleChange('maxFileSize', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
                            <input
                                type="text"
                                value={settings.allowedFileTypes}
                                onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="e.g., pdf,doc,docx,jpg,png"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated list of file extensions</p>
                        </div>
                    </div>
                </div>

                {/* User Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">User Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Enable User Registration</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.enableRegistration}
                                    onChange={(e) => handleChange('enableRegistration', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Default User Role</label>
                            <select
                                value={settings.defaultUserRole}
                                onChange={(e) => handleChange('defaultUserRole', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="LECTURER">Lecturer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.enableNotifications}
                                    onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.smsNotifications}
                                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span className="text-sm font-medium text-green-800">Database</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Connected</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span className="text-sm font-medium text-green-800">File Storage</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Available</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span className="text-sm font-medium text-green-800">Email Service</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Operational</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;