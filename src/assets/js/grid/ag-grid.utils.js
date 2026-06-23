const GridUtils = {
  BUTTON_STYLES: {
    primary:   'bg-black hover:bg-gray-800 text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer',
    danger:    'bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer',
    secondary: 'bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer',
    default:   'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-1 rounded text-xs transition-colors cursor-pointer'
  },
  /**
   * 버튼 셀 렌더러
   */
  actionButtonsCellRenderer: function(params) {
    const data = params.data;
    const colDef = params.colDef;

    if (!data) return '';

    const { buttons = [] } = (colDef?.cellRendererParams || {});

    const container = document.createElement('div');
    container.className = 'flex h-full items-center gap-2';

    buttons.forEach(btn => {
        if (btn.show && !btn.show(data)) return; 

        const buttonEl = document.createElement('button');
        buttonEl.textContent = btn.label;
        buttonEl.className = GridUtils.BUTTON_STYLES[btn.variant || 'default'];

        if (btn.onClick) {
            buttonEl.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.onClick(data);
            });
        }
        container.appendChild(buttonEl);
    });

    return container;
  },

  /**
   * 이미지 셀 렌더러
   */
  imageCellRenderer: function(params) {
    const value = params.value;
    const colDef = params.colDef;

    const {
        style = 'circle',
        w = 40,
        h = 40
    } = (colDef?.cellRendererParams || {});

    const borderRadius = style === 'circle' ? '50%' : '4px'; // 웹 표준상 원형은 50%가 안전
    
    const NO_IMAGE_PATH = '/images/1.png'; 

    const imgSrc = (value && value.trim() !== "") ? value : NO_IMAGE_PATH;

    return '<div class="flex items-center h-full py-1">' +
      '<img ' +
          'src="' + imgSrc + '" ' +
          'alt="미리보기" ' +
          'width="' + w + '" ' +
          'height="' + h + '" ' +
          'style="' +
              'width: ' + w + 'px; ' +
              'height: ' + h + 'px; ' +
              'object-fit: cover; ' +
              'border-radius: ' + borderRadius + '; ' +
              'margin: 0 auto;' +
          '" ' +
          'onerror="this.onerror=null; this.src=\'' + NO_IMAGE_PATH + '\';" ' +
      '/>' +
    '</div>';
  },

  /**
   * 링크 셀 렌더러
   */
  linkCellRenderer: function(params) {
    const { value, data, colDef } = params;
    
    // 값이 존재하지 않을 때 방어 코드 추가
    const displayValue = (value !== null && value !== undefined) ? value : '';
    
    // 렌더러 파라미터 핸들링
    const url = colDef?.cellRendererParams?.getUrl?.(data) || displayValue;
    const target = colDef?.cellRendererParams?.target || '_blank';

    // 만약 데이터나 URL이 아예 없는 빈 셀인 경우 텍스트만 출력
    if (!url) {
      return '<span>' + displayValue + '</span>';
    }

    // 1. 순수 HTML 링크 엘리먼트 메모리 동적 생성 (가장 안전하고 깔끔한 바인딩 기법)
    const anchorEl = document.createElement('a');
    anchorEl.href = url;
    anchorEl.target = target;
    anchorEl.textContent = displayValue;
    
    // Tailwind 혹은 표준 CSS 텍스트 데코레이션 가이드 적용
    anchorEl.className = 'text-blue-500 underline hover:text-blue-700 transition-colors cursor-pointer';

    // 2. colDef를 통해 커스텀 onClick 핸들러가 주입된 경우 가로채기 처리
    if (colDef?.cellRendererParams?.onClick) {
      anchorEl.addEventListener('click', function(e) {
        e.preventDefault(); // 기본 링크 이동 동작 막기
        e.stopPropagation(); // 그리드 Row 선택 방지
        colDef.cellRendererParams.onClick(data); // 주입된 함수 실행
      });
    }

    return anchorEl;
  }
}

const GridFormatters = {
  /**
   * 3자리 콤마 + '원' 포맷터
   */
  currencyFormatter: (params) => {
    if (params.value == null || params.value === '') return '-';
    
    return Number(params.value).toLocaleString() + '원';
  },

  /**
   * 할인율 / 백분율(%) 포맷터
   */
  rateFormatter: (params) => {
    if (params.value == null || params.value === '') return '-';
    const val = params.value < 1 ? params.value * 100 : params.value;
    
    return Math.round(val) + '%';
  },

  /**
   * 날짜/시간 포맷터 (yyyy-mm-dd HH:MM:SS)
   */
  dateTimeFormatter: (params) => {
    if (!params.value) return '-';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;
    const pad = (num) => String(num).padStart(2, '0');
    
    return date.getFullYear() + '-' + 
      pad(date.getMonth() + 1) + '-' + 
      pad(date.getDate()) + ' ' + 
      pad(date.getHours()) + ':' + 
      pad(date.getMinutes()) + ':' + 
      pad(date.getSeconds());
  },

  /**
   * 날짜 포맷터 (yyyy-mm-dd)
   */
  dateFormatter: (params) => {
    if (!params.value) return '-';
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;
    const pad = (num) => String(num).padStart(2, '0');
    
    return date.getFullYear() + '-' + 
      pad(date.getMonth() + 1) + '-' + 
      pad(date.getDate());
  },
};
