import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initial) {
    const [v, setV] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved === null ? initial : JSON.parse(saved);
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(v));
        } catch { /* ignore */ }
    }, [key, v]);

    return [v, setV];
}
