import React, { useState } from 'react';

function StudentProfile({ api, user }) {
    const [profileData, setProfileData] = useState({
        fullName: user.fullName || '',
        email: user.email || '',
        registrationNo: user.registrationNo || ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.updateStudent(user.id, profileData);
            // Update local user data
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">👤 My Profile</h1>
                <p className="page-subtitle">Manage your personal information</p>
            </div>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">{user.fullName}</h2>
                        <p className="profile-role">👨‍🎓 Student</p>
                    </div>
                    <button
                        className="edit-button"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
                    </button>
                </div>

                <div className="profile-content">
                    <div className="form-group">
                        <label className="label">Full Name</label>
                        <input
                            className="input"
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                fullName: e.target.value
                            })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Email Address</label>
                        <input
                            className="input"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                email: e.target.value
                            })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Registration Number</label>
                        <input
                            className="input"
                            type="text"
                            value={profileData.registrationNo}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                registrationNo: e.target.value
                            })}
                            disabled={!isEditing}
                        />
                    </div>

                    {isEditing && (
                        <div className="profile-actions">
                            <button
                                className="primary-button"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentProfile;