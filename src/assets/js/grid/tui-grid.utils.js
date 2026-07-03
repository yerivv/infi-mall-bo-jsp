const TuiGridUtils = {
  BUTTON_STYLES: {
    primary:   'bg-black hover:bg-gray-800 text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer',
    danger:    'bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer',
    secondary: 'bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer',
    default:   'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-1 rounded text-xs transition-colors cursor-pointer'
  },

  /**
   * 버튼 셀 렌더러
   */
  ActionButtonsRenderer: class {
    constructor(props) {
      this.el = document.createElement('div');
      this.el.className = 'flex h-full items-center px-2 gap-2';
      this._opts = (props.columnInfo.renderer && props.columnInfo.renderer.options) || {};
      this.render(props);
    }
    getElement() { return this.el; }
    render({ grid, rowKey }) {
      this.el.innerHTML = '';
      const row = grid.getRow(rowKey);
      if (!row) return;
      const { buttons = [] } = this._opts;
      buttons.forEach(btn => {
        if (btn.show && !btn.show(row)) return;
        const buttonEl = document.createElement('button');
        buttonEl.textContent = btn.label;
        buttonEl.className = TuiGridUtils.BUTTON_STYLES[btn.variant || 'default'];
        if (btn.onClick) {
          buttonEl.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.onClick(row);
          });
        }
        this.el.appendChild(buttonEl);
      });
    }
  },

  /**
   * 이미지 셀 렌더러
   */
  ImageCellRenderer: class {
    constructor(props) {
      this.el = document.createElement('div');
      this.el.className = 'flex items-center h-full py-1';
      this._opts = (props.columnInfo.renderer && props.columnInfo.renderer.options) || {};
      this.render(props);
    }
    getElement() { return this.el; }
    render({ value }) {
      const { style = 'circle', w = 40, h = 40 } = this._opts;
      const NO_IMAGE = '/images/1.png';
      const src = (value && String(value).trim()) ? value : NO_IMAGE;
      const img = document.createElement('img');
      img.src = src;
      img.alt = '미리보기';
      img.style.cssText = `width:${w}px;height:${h}px;object-fit:cover;border-radius:${style === 'circle' ? '50%' : '4px'};margin:0 auto;`;
      img.onerror = function() { this.onerror = null; this.src = NO_IMAGE; };
      this.el.innerHTML = '';
      this.el.appendChild(img);
    }
  },

  /**
   * 링크 셀 렌더러
   */
  LinkCellRenderer: class {
    constructor(props) {
      this.el = document.createElement('div');
      this.el.className = 'flex items-center h-full';
      this._opts = (props.columnInfo.renderer && props.columnInfo.renderer.options) || {};
      this.render(props);
    }
    getElement() { return this.el; }
    render({ value, grid, rowKey }) {
      this.el.innerHTML = '';
      const { getUrl, target = '_blank', onClick } = this._opts;
      const displayValue = value != null ? String(value) : '';
      const row = grid.getRow(rowKey);
      const url = getUrl ? getUrl(row) : displayValue;
      if (!url) {
        this.el.textContent = displayValue;
        return;
      }
      const a = document.createElement('a');
      a.href = url;
      a.target = target;
      a.textContent = displayValue;
      a.className = 'text-blue-500 underline hover:text-blue-700 transition-colors cursor-pointer';
      if (onClick) {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(row);
        });
      }
      this.el.appendChild(a);
    }
  },

  /**
   * 체크된 행들의 특정 컬럼 값들만 배열로 추출
   */
  getCheckedKeys(gridInstance, keyName) {
    if (!gridInstance) return [];
    return gridInstance.getCheckedRows().map(row => row[keyName]);
  },

  /**
   * 화면 크기 변화나 부모 탭 전환 시 그리드 깨짐 방지용 리프레시
   */
  fitLayout(gridInstance) {
    if (gridInstance) {
      setTimeout(() => gridInstance.refreshLayout(), 50);
    }
  }
};

const TuiGridFormatters = {
  /**
   * 금액 천단위 콤마 포맷터
   */
  formatCurrency: function({ value }) {
    if (value === undefined || value === null) return '0';
    return Number(value).toLocaleString();
  },

  /**
   * 날짜 포맷터 (YYYY-MM-DD)
   */
  formatDate: function({ value }) {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toISOString().split('T')[0];
  },

  /**
   * 날짜+시간 포맷터 (YYYY-MM-DD HH:MM:SS)
   */
  formatDateTime: function({ value }) {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },

  /**
   * 할인율 / 백분율(%) 포맷터
   */
  formatRate: function({ value }) {
    if (value === undefined || value === null || value === '') return '-';
    const val = value < 1 ? value * 100 : value;
    return Math.round(val) + '%';
  },
};

window.TuiGridUtils = TuiGridUtils;
window.TuiGridFormatters = TuiGridFormatters;
