// useFormatDate.js
export function useFormatDate() {
    const formatDate = (date, sep = '-') => {
        if (!date) return '';
        if (typeof date === 'string') {
            const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m) {
                const [, y, mm, dd] = m;
                return [y, mm, dd].join(sep);
            }
        }

        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return [year, month, day].join(sep);
    };

    const toISO = (display) => {
        if (!display) return null;
        const m = display.match(/^(\d{4})[.\-\/](\d{2})[.\-\/](\d{2})$/);
        if (!m) return null;
        const [, y, mm, dd] = m;
        return `${y}-${mm}-${dd}`;
    };

    return { formatDate, toISO };
}
