import React, { useState, useEffect } from 'react';

function SystemSettings({ api }) {
    const [systemInfo, setSystemInfo] = useState({
        services: {},
        stats: {},
        lastUpdated: null
    });
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        appName: 'Learning Management System',
        theme: 'blue',
        itemsPerPage: 10,
        autoRefresh: true,
        notifications: true
    });
    const [testingServices, setTestingServices] = useState(false);

    const services = [
        { name: 'Auth Service', port: 8081, endpoint: '/api/auth/health', key: 'auth' },
        { name: 'Student Service', port: 8082, endpoint: '/api/students', key: 'student' },
        { name: 'Lecturer Service', port: 8083, endpoint: '/api/lecturers', key: 'lecturer' },
        { name: 'Course Service', port: 8084, endpoint: '/api/courses', key: 'course' },
        { name: 'Assignment Service', port: 8085, endpoint: '/api/assignments', key: 'assignment' },
        { name: 'Submission Service', port: 8086, endpoint: '/api/submissions', key: 'submission' },
        { name: 'Announcement Service', port: 8087, endpoint: '/api/announcements', key: 'announcement' },
        { name: 'Quiz Service', port: 8088, endpoint: '/api/quizzes', key: 'quiz' },
        { name: 'Material Service', port: 8089, endpoint: '/api/materials', key: 'material' }
    ];

    useEffect(() => {
        loadSystemInfo();
        loadSettings();

        // Auto-refresh every 30 seconds if enabled
        const interval = settings.autoRefresh ? setInterval(loadSystemInfo, 30000) : null;
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [settings.autoRefresh]);

    const loadSettings = () => {
        const savedSettings = localStorage.getItem('lmsSettings');
        if (savedSettings) {
            setSettings({ ...settings, ...JSON.parse(savedSettings) });
        }
    };

    const saveSettings = () => {
        localStorage.setItem('lmsSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    const loadSystemInfo = async () => {
        setLoading(true);
        try {
            // Get real statistics from backend
            const stats = await api.getDashboardStats();

            // Test service connectivity
            const serviceStatus = await testAllServices();

            setSystemInfo({
                services: serviceStatus,
                stats: stats,
                lastUpdated: new Date()
            });
        } catch (error) {
            console.error('Error loading system info:', error);
        }
        setLoading(false);
    };

    const testAllServices = async () => {
        const serviceStatus = {};

        for (const service of services) {
            try {
                const startTime = Date.now();
                const response = await fetch(`http://localhost:${service.port}${service.endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000
                });

                const responseTime = Date.now() - startTime;

                serviceStatus[service.key] = {
                    status: response.ok ? 'online' : 'error',
                    responseTime: responseTime,
                    statusCode: response.status,
                    lastChecked: new Date()
                };
            } catch (error) {
                serviceStatus[service.key] = {
                    status: 'offline',
                    error: error.message,
                    lastChecked: new Date()
                };
            }
        }

        return serviceStatus;
    };

    const testSingleService = async (serviceKey) => {
        setTestingServices(true);
        const service = services.find(s => s.key === serviceKey);

        try {
            const startTime = Date.now();
            const response = await fetch(`http://localhost:${service.port}${service.endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const responseTime = Date.now() - startTime;

            setSystemInfo(prev => ({
                ...prev,
                services: {
                    ...prev.services,
                    [serviceKey]: {
                        status: response.ok ? 'online' : 'error',
                        responseTime: responseTime,
                        statusCode: response.status,
                        lastChecked: new Date()
                    }
                }
            }));

            alert(`${service.name}: ${response.ok ? 'Online' : 'Error'} (${responseTime}ms)`);
        } catch (error) {
            setSystemInfo(prev => ({
                ...prev,
                services: {
                    ...prev.services,
                    [serviceKey]: {
                        status: 'offline',
                        error: error.message,
                        lastChecked: new Date()
                    }
                }
            }));

            alert(`${service.name}: Offline - ${error.message}`);
        }

        setTestingServices(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#10b981';
            case 'error': return '#f59e0b';
            case 'offline': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'online': return '✅';
            case 'error': return '⚠️';
            case 'offline': return '❌';
            default: return '❓';
        }
    };

    const resetToDefaults = () => {
        if (window.confirm('Are you sure you want to reset all settings to default?')) {
            setSettings({
                appName: 'Learning Management System',
                theme: 'blue',
                itemsPerPage: 10,
                autoRefresh: true,
                notifications: true
            });
            localStorage.removeItem('lmsSettings');
            alert('Settings reset to defaults!');
        }
    };

    const exportSystemInfo = () => {
        const exportData = {
            systemInfo,
            settings,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `lms-system-info-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>System Settings & Information</h1>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={loadSystemInfo}
                        disabled={loading}
                        title="Refresh System Info"
                    >
                        🔄 {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={exportSystemInfo}
                        title="Export System Information"
                    >
                        📥 Export Info
                    </button>
                </div>
            </div>

            <div className="settings-grid">
                {/* System Overview */}
                <div className="settings-card">
                    <h3>📊 System Overview</h3>
                    {loading ? (
                        <div className="loading-small">Loading...</div>
                    ) : (
                        <div className="system-overview">
                            <div className="overview-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Total Students:</span>
                                    <span className="stat-value">{systemInfo.stats.totalStudents}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Total Lecturers:</span>
                                    <span className="stat-value">{systemInfo.stats.totalLecturers}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Total Courses:</span>
                                    <span className="stat-value">{systemInfo.stats.totalCourses}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Total Submissions:</span>
                                    <span className="stat-value">{systemInfo.stats.totalSubmissions}</span>
                                </div>
                            </div>
                            {systemInfo.lastUpdated && (
                                <div className="last-updated">
                                    Last updated: {systemInfo.lastUpdated.toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Application Settings */}
                <div className="settings-card">
                    <h3>⚙️ Application Settings</h3>
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
                        <label>Theme Color</label>
                        <select
                            value={settings.theme}
                            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                        >
                            <option value="blue">Blue (Default)</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Items Per Page</label>
                        <select
                            value={settings.itemsPerPage}
                            onChange={(e) => setSettings({ ...settings, itemsPerPage: parseInt(e.target.value) })}
                        >
                            <option value="5">5 items</option>
                            <option value="10">10 items</option>
                            <option value="20">20 items</option>
                            <option value="50">50 items</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.autoRefresh}
                                onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                            />
                            Auto-refresh system info (30s)
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                            />
                            Enable notifications
                        </label>
                    </div>
                </div>

                {/* Service Status */}
                <div className="settings-card service-status-card">
                    <h3>🛠️ Microservices Status</h3>
                    <div className="services-list">
                        {services.map(service => {
                            const status = systemInfo.services[service.key];
                            return (
                                <div key={service.key} className="service-item">
                                    <div className="service-info">
                                        <div className="service-name">
                                            <span className="service-icon">
                                                {getStatusIcon(status?.status)}
                                            </span>
                                            <span>{service.name}</span>
                                            <span className="service-port">:{service.port}</span>
                                        </div>
                                        <div className="service-details">
                                            {status && (
                                                <>
                                                    <span
                                                        className="service-status"
                                                        style={{ color: getStatusColor(status.status) }}
                                                    >
                                                        {status.status.toUpperCase()}
                                                    </span>
                                                    {status.responseTime && (
                                                        <span className="response-time">
                                                            {status.responseTime}ms
                                                        </span>
                                                    )}
                                                    {status.statusCode && (
                                                        <span className="status-code">
                                                            HTTP {status.statusCode}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => testSingleService(service.key)}
                                        disabled={testingServices}
                                        title={`Test ${service.name}`}
                                    >
                                        🔧 Test
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="service-actions">
                        <button
                            className="btn btn-primary"
                            onClick={loadSystemInfo}
                            disabled={loading}
                        >
                            🔄 Test All Services
                        </button>
                    </div>
                </div>

                {/* Database Information */}
                <div className="settings-card">
                    <h3>🗄️ Database Information</h3>
                    <div className="database-list">
                        <div className="db-item">
                            <span>Auth Database:</span>
                            <span>lms_auth_db</span>
                        </div>
                        <div className="db-item">
                            <span>Student Database:</span>
                            <span>lms_student_db</span>
                        </div>
                        <div className="db-item">
                            <span>Lecturer Database:</span>
                            <span>lms_lecturer_db</span>
                        </div>
                        <div className="db-item">
                            <span>Course Database:</span>
                            <span>lms_course_db</span>
                        </div>
                        <div className="db-item">
                            <span>Assignment Database:</span>
                            <span>lms_assignment_db</span>
                        </div>
                        <div className="db-item">
                            <span>Submission Database:</span>
                            <span>lms_submission_db</span>
                        </div>
                        <div className="db-item">
                            <span>Announcement Database:</span>
                            <span>lms_announcement_db</span>
                        </div>
                        <div className="db-item">
                            <span>Quiz Database:</span>
                            <span>lms_quiz_db</span>
                        </div>
                        <div className="db-item">
                            <span>Material Database:</span>
                            <span>lms_material_db</span>
                        </div>
                    </div>
                </div>

                {/* System Information */}
                <div className="settings-card">
                    <h3>💻 System Information</h3>
                    <div className="system-info-list">
                        <div className="info-row">
                            <span>Version:</span>
                            <span>1.0.0</span>
                        </div>
                        <div className="info-row">
                            <span>Backend Framework:</span>
                            <span>Spring Boot</span>
                        </div>
                        <div className="info-row">
                            <span>Frontend Framework:</span>
                            <span>React.js 18.2.0</span>
                        </div>
                        <div className="info-row">
                            <span>Database:</span>
                            <span>MySQL</span>
                        </div>
                        <div className="info-row">
                            <span>Architecture:</span>
                            <span>Microservices</span>
                        </div>
                        <div className="info-row">
                            <span>Authentication:</span>
                            <span>JWT Token</span>
                        </div>
                        <div className="info-row">
                            <span>Current User:</span>
                            <span>{JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Unknown'}</span>
                        </div>
                        <div className="info-row">
                            <span>Session Started:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* API Endpoints */}
                <div className="settings-card">
                    <h3>🔗 API Endpoints</h3>
                    <div className="endpoint-list">
                        {services.map(service => (
                            <div key={service.key} className="endpoint-item">
                                <div className="endpoint-info">
                                    <span className="endpoint-name">{service.name}:</span>
                                    <code className="endpoint-url">
                                        http://localhost:{service.port}{service.endpoint}
                                    </code>
                                </div>
                                <span
                                    className="endpoint-status"
                                    style={{
                                        color: getStatusColor(systemInfo.services[service.key]?.status)
                                    }}
                                >
                                    {getStatusIcon(systemInfo.services[service.key]?.status)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="btn btn-success" onClick={saveSettings}>
                    💾 Save Settings
                </button>
                <button className="btn btn-secondary" onClick={resetToDefaults}>
                    🔄 Reset to Defaults
                </button>
                <button className="btn btn-primary" onClick={loadSystemInfo}>
                    🔍 Check System Health
                </button>
            </div>
        </div>
    );
}

export default SystemSettings;