import React from 'react';
import './Select.css';

function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    loading = false,
    required = false,
    ...props
}) {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            {loading ? (
                <div className="select-loading">Loading options...</div>
            ) : (
                <select
                    name={name}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    required={required}
                    {...props}
                >
                    <option value="">Select an option</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}

export default Select;