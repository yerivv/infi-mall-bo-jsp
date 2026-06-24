const TuiGridUtils = {
  /**
   * 금액 천단위 콤마 포맷터 (그리드 cell formatter 전용)
   * @example { name: 'price', formatter: TuiGridUtils.formatCurrency }
   */
  formatCurrency({ value }) {
    if (value === undefined || value === null) return '0';
    return Number(value).toLocaleString();
  },

  /**
   * 날짜 포맷터 (YYYY-MM-DD)
   */
  formatDate({ value }) {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toISOString().split('T')[0];
  },

  /**
   * 체크된 행들의 특정 컬럼 값들만 배열로 추출
   * @param {tui.Grid} gridInstance 
   * @param {string} keyName - 추출할 오브젝트 키값 (예: 'prodId')
   */
  getCheckedKeys(gridInstance, keyName) {
    if (!gridInstance) return [];
    return gridInstance.getCheckedRows().map(row => row[keyName]);
  },

  /**
   * 화면 크기 변화나 부모 탭 전환 시 그리드 깨짐 방지용 리프레시 헬퍼
   * @param {tui.Grid} gridInstance 
   */
  fitLayout(gridInstance) {
    if (gridInstance) {
      setTimeout(() => {
        gridInstance.refreshLayout();
      }, 50); // DOM 렌더링 스레드 시점 보장
    }
  }
};

window.TuiGridUtils = TuiGridUtils;