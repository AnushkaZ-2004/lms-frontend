import React, { useState } from 'react';
import Pagination from './Pagination';
import './DataTable.css';

function DataTable({
    columns,
    data,
    pagination = false,
    itemsPerPage = 10,
    onRowClick,
    className = ''
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState(null);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = pagination
        ? data.slice(startIndex, startIndex + itemsPerPage)
        : data;

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return paginatedData;

        return [...paginatedData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [paginatedData, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className={`data-table-container ${className}`}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                onClick={() => column.sortable && requestSort(column.accessor)}
                                className={column.sortable ? 'sortable' : ''}
                            >
                                {column.header}
                                {sortConfig?.key === column.accessor && (
                                    <span className="sort-icon">
                                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={onRowClick ? 'clickable-row' : ''}
                            >
                                {columns.map((column) => (
                                    <td key={`${row.id || rowIndex}-${column.accessor}`}>
                                        {column.render
                                            ? column.render(row)
                                            : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="no-data">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {pagination && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

export default DataTable;