import React from 'react';
import Button from '../common/Button';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <Button
                small
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                « First
            </Button>
            <Button
                small
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹ Prev
            </Button>

            {startPage > 1 && (
                <span className="pagination-ellipsis">...</span>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    small
                    primary={currentPage === page}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            {endPage < totalPages && (
                <span className="pagination-ellipsis">...</span>
            )}

            <Button
                small
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next ›
            </Button>
            <Button
                small
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                Last »
            </Button>
        </div>
    );
}

export default Pagination;