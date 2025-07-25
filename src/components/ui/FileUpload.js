import React, { useState } from 'react';
import Button from '../common/Button';
import './FileUpload.css';

function FileUpload({ label, onUpload, accept }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            await onUpload(file);
            setFile(null);
            // Clear file input
            document.getElementById('file-upload').value = '';
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload">
            <label className="form-label">{label}</label>
            <div className="upload-controls">
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleChange}
                    accept={accept}
                />
                <Button
                    small
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            </div>
            {file && (
                <div className="file-info">
                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
            )}
        </div>
    );
}

export default FileUpload;