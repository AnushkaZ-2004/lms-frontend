import { useState, useEffect } from 'react';

export const useApi = (apiCall, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiCall();
                setData(result);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiCall, initialPage = 0, pageSize = 10) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchData = async (page = currentPage, search = '') => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall(page, pageSize, search);
            setData(result.content || []);
            setTotalPages(result.totalPages || 0);
            setTotalElements(result.totalElements || 0);
            setCurrentPage(page);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const goToPage = (page) => {
        fetchData(page);
    };

    const search = (searchTerm) => {
        fetchData(0, searchTerm);
    };

    const refresh = () => {
        fetchData(currentPage);
    };

    return {
        data,
        loading,
        error,
        currentPage,
        totalPages,
        totalElements,
        goToPage,
        search,
        refresh
    };
};