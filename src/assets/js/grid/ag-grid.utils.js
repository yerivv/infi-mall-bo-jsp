const GridFormatters = {
  currencyFormatter: (params) => {
    if (params.value == null || params.value === '') return '-';
    return `${Number(params.value).toLocaleString()}원`;
  },

  rateFormatter: (params) => {
    if (params.value == null || params.value === '') return '-';
    const val = params.value < 1 ? params.value * 100 : params.value;
    return `${Math.round(val)}%`;
  },

  dateTimeFormatter: (params) => {
    if (!params.value) return '-';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },

  dateFormatter: (params) => {
    if (!params.value) return '-';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },
};
