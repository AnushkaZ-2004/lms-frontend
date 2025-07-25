import React from 'react';
import './Button.css';

function Button({
    children,
    primary = false,
    danger = false,
    small = false,
    disabled = false,
    ...props
}) {
    const className = [
        'btn',
        primary ? 'btn-primary' : '',
        danger ? 'btn-danger' : '',
        small ? 'btn-small' : '',
        disabled ? 'disabled' : ''
    ].filter(Boolean).join(' ');

    return (
        <button className={className} disabled={disabled} {...props}>
            {children}
        </button>
    );
}

export default Button;