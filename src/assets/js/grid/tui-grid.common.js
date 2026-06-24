if (typeof tui !== 'undefined' && tui.Grid) {

  tui.Grid.applyTheme('clean', {
    cell: {
      normal: {
        background: '#ffffff',
        border: '#e5e7eb', // Tailwind gray-200
        showVerticalBorder: false,
      },
      header: {
        background: '#f9fafb', // Tailwind gray-50
        border: '#e5e7eb',
        text: '#111827',
        fontWeight: '600'
      },
      selectedHead: { background: '#f3f4f6' },
      focused: { border: '#666' } // 인디고 포인트 포커스
    }
  });
}

const TuiGridCommon = {
  createGrid({ el, columns, data = [], customOptions = {} }) {
    const targetEl = typeof el === 'string' ? document.getElementById(el) : el;

    if (!targetEl) {
      console.error(`[TuiGridCommon] '${el}' 요소를 찾을 수 없어 그리드를 생성하지 못했습니다.`);
      return null;
    }

    const defaultOptions = {
      el: targetEl,
      data: data,
      columns: columns,
      bodyHeight: 'auto',
      minBodyHeight: 150,
      scrollX: true,
      scrollY: false,
      columnOptions: {
        resizable: true
      },
      pageOptions: {
        useClient: true,
        perPage: 10
      }
    };

    const finalOptions = Object.assign({}, defaultOptions, customOptions);

    return new tui.Grid(finalOptions);
  },

  // perPage select 바인딩 — toolbar 내 <select class="tui-perpage-select"> 와 연결
  bindPerPage(gridInstance, toolbarEl, sizes = [10, 20, 50, 100]) {
    if (!gridInstance || !toolbarEl) return;

    const select = document.createElement('select');
    select.className = 'tui-perpage-select border border-slate-200 rounded text-xs px-2 py-1.5 bg-white cursor-pointer';

    const currentPerPage = gridInstance.store
      ? gridInstance.store.data.pageOptions.perPage
      : sizes[0];

    sizes.forEach(function(n) {
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = n + '줄 보기';
      if (n === currentPerPage) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function() {
      gridInstance.setPerPage(Number(select.value));
    });

    toolbarEl.appendChild(select);
  }
};

// 전역 스코프 공유 (ESM 미사용 보수적 환경 대응)
window.TuiGridCommon = TuiGridCommon;