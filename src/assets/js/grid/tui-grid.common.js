if (typeof tui !== 'undefined' && tui.Grid) {
  tui.Grid.setLanguage('ko');

  tui.Grid.applyTheme('clean', {
    cell: {
      normal: {
        background: '#ffffff',
        border: '#e5e7eb', // Tailwind gray-200
        showVerticalBorder: false // 트렌디한 수평선 위주 레이아웃
      },
      header: {
        background: '#f9fafb', // Tailwind gray-50
        border: '#e5e7eb',
        text: '#111827',
        fontWeight: '600'
      },
      selectedHead: { background: '#f3f4f6' },
      focused: { border: '#4f46e5' } // 인디고 포인트 포커스
    }
  });
}

const TuiGridCommon = {
  /**
   * 기본 설정을 포함한 TUI Grid 생성
   * @param {Object} params 
   * @param {HTMLElement|string} params.el - 마운트할 엘리먼트 또는 ID
   * @param {Array} params.columns - 컬럼 정의 배열
   * @param {Array} [params.data=[]] - 초기 데이터
   * @param {Object} [params.customOptions={}] - 화면별 개별 확장 옵션
   * @returns {tui.Grid} 생성된 TUI Grid 인스턴스
   */
  createGrid({ el, columns, data = [], customOptions = {} }) {
    const targetEl = typeof el === 'string' ? document.getElementById(el) : el;

    if (!targetEl) {
      console.error(`[TuiGridCommon] '${el}' 요소를 찾을 수 없어 그리드를 생성하지 못했습니다.`);
      return null;
    }

    // 백오피스 표준 기본 옵션 정의
    const defaultOptions = {
      el: targetEl,
      data: data,
      columns: columns,
      bodyHeight: 'auto',
      minBodyHeight: 150,
      scrollX: true,
      scrollY: false,
      columnOptions: {
        resizable: true // 기본적으로 모든 컬럼 리사이즈 허용
      },
      pageOptions: {
        perPage: 10
      }
    };

    // 딥 카피 혹은 깊은 병합이 필요한 특수 옵션 외에는 기본 shallow merge 수행
    const finalOptions = Object.assign({}, defaultOptions, customOptions);

    // 인스턴스 생성 및 반환
    return new tui.Grid(finalOptions);
  }
};

// 전역 스코프 공유 (ESM 미사용 보수적 환경 대응)
window.TuiGridCommon = TuiGridCommon;