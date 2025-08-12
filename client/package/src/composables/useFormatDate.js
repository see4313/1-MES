// useFormatDate.js
export function useFormatDate() {
  const pad = (n) => String(n).padStart(2, '0');

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
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return [year, month, day].join(sep);
  };

  const toISO = (display) => {
    if (!display) return null;
    const m = display.match(/^(\d{4})[.\-\/](\d{2})[.\-\/](\d{2})$/);
    if (!m) return null;
    const [, y, mm, dd] = m;
    return `${y}-${mm}-${dd}`;
  };

  // 로컬 타임존 기준 DATETIME (YYYY-MM-DD HH:MM:SS)
  const formatDateTime = (input, { withSeconds = true } = {}) => {
    if (!input) return '';
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${y}-${m}-${day} ${hh}:${mm}${withSeconds ? `:${ss}` : ''}`;
  };

  // MariaDB에 넣기 좋은 로컬 기준 DATETIME 별칭
  const toSqlDatetimeLocal = (input) => formatDateTime(input, { withSeconds: true });

  // 특정 오프셋(분) 기준 DATETIME (예: KST=540)
  const toSqlDatetimeWithOffset = (input, offsetMinutes) => {
    if (!input && input !== 0) return '';
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    // epoch → UTC → 오프셋 적용
    const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
    const tz = new Date(utcMs + offsetMinutes * 60000);
    const y = tz.getUTCFullYear();
    const m = pad(tz.getUTCMonth() + 1);
    const day = pad(tz.getUTCDate());
    const hh = pad(tz.getUTCHours());
    const mm = pad(tz.getUTCMinutes());
    const ss = pad(tz.getUTCSeconds());
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
  };

  // KST(UTC+9) 고정 DATETIME
  const toSqlDatetimeKST = (input) => toSqlDatetimeWithOffset(input, 9 * 60);

  // 'YYYY-MM-DD' + 'HH:mm'/'HH:mm:ss' → 'YYYY-MM-DD HH:mm:ss'
  const mergeDateAndTime = (dateStr, timeStr = '00:00:00') => {
    const iso = toISO(dateStr) ?? formatDate(dateStr); // 유연하게 보정
    if (!iso) return '';
    let t = timeStr;
    if (/^\d{2}:\d{2}$/.test(t)) t = `${t}:00`;
    if (!/^\d{2}:\d{2}:\d{2}$/.test(t)) t = '00:00:00';
    return `${iso} ${t}`;
  };

  const minDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
  };

  return {
    formatDate,
    toISO,
    formatDateTime,
    toSqlDatetimeLocal,
    toSqlDatetimeWithOffset,
    toSqlDatetimeKST,
    mergeDateAndTime,
    minDate
  };
}
