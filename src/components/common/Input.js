import React from 'react';
import './Input.css';

function Input({ label, type = 'text', value, onChange, required = false, ...props }) {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                required={required}
                {...props}
            />
        </div>
    );
}

export default Input;