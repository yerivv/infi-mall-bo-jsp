if (typeof tui !== 'undefined' && tui.Grid) {
  tui.Grid.applyTheme('clean', {
    cell: {
      normal: {
        background: '#ffffff',
        border: '#e5e7eb',
        showVerticalBorder: false,
      },
      header: {
        background: '#f9fafb',
        border: '#e5e7eb',
        text: '#111827',
        fontWeight: '600'
      },
      selectedHead: { background: '#f3f4f6' },
      focused: { border: '#666' }
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
      data,
      columns,
      bodyHeight: 'auto',
      minBodyHeight: 150,
      scrollX: true,
      scrollY: false,
      columnOptions: { resizable: true },
      pageOptions: { useClient: true, perPage: 10 },
    };

    return new tui.Grid(Object.assign({}, defaultOptions, customOptions));
  },

  // perPage select 바인딩 — toolbar 내 .ml-auto 영역에 <select> 생성
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
  },

  // 체크박스 선택 개수 바인딩
  bindCheckCounter(gridInstance, countEl) {
    if (!gridInstance || !countEl) return;
    const updateCount = () => {
      const n = gridInstance.getCheckedRows().length;
      countEl.textContent = '선택 ' + n + '개';
    };

    // TOAST UI Grid 체크 관련 이벤트 전체 바인딩
    gridInstance.on('check', updateCount);
    gridInstance.on('uncheck', updateCount);
    gridInstance.on('checkAll', updateCount);
    gridInstance.on('uncheckAll', updateCount);
    
    // 그리드 데이터가 새로 로드되거나 변경되었을 때도 동기화
    gridInstance.on('onGridUpdated', updateCount); 

    // 최초 1회 즉시 실행 (초기화)
    updateCount();
  },

  // 총 결과 수 바인딩
  bindTotalCounter(gridInstance, totalEl) {
    if(!gridInstance || !totalEl) return;
    const updateTotalCount = () => {
      // 그리드의 전체 행(Row) 개수를 가져옴
      const total = gridInstance.getRowCount();
      totalEl.textContent = `총 ${total}건`;
    };

    // 데이터 로드, 필터링, 정렬, 행 추가/삭제 등 그리드가 업데이트될 때마다 실행
    gridInstance.on('onGridUpdated', updateTotalCount);

    // 최초 1회 즉시 실행 (초기화)
    updateTotalCount();

  },
};

const TuiGridToolbar = {
  _validate: function(grid) {
    if (!grid || typeof grid.getData !== 'function') {
      console.error('TuiGridToolbar: 유효하지 않은 그리드 인스턴스입니다.', grid);
      return false;
    }
    return true;
  },

  // 정렬 초기화
  resetSort: function(grid) {
    if (!this._validate(grid)) return;
    const gridId = grid.getAttribute('data-grid-id');
    const targetGrid = window.pageGrids[gridId];

    targetGrid.unsort();
  },

  // 필터 초기화
  resetFilter: function(grid) {
    if (!this._validate(grid)) return;
    grid.unfilter();
  },

  // 컬럼 표시/숨김 선택 패널
  columnSelect: function(grid, triggerEl) {
    if (!this._validate(grid)) return;

    const existingPanel = document.getElementById('_tuiColumnPanel');
    if (existingPanel) { existingPanel.remove(); return; }

    // _로 시작하는 내부 컬럼(rowHeader 등) 제외
    const allColumns = (grid.store.column.allColumns || []).filter(col => !col.name.startsWith('_'));

    const panel = document.createElement('div');
    panel.id = '_tuiColumnPanel';
    panel.className = 'absolute z-[9999] bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-40 max-h-80 overflow-y-auto';

    const listCheckbox = document.createElement('div');
    listCheckbox.className = 'max-h-[200px] overflow-hidden overflow-y-auto';
    const checkboxes = [];
    const colNames = [];

    allColumns.forEach(col => {
      const row = document.createElement('label');
      row.className = 'flex items-center gap-2 px-3.5 py-1.5 cursor-pointer text-xs whitespace-nowrap hover:bg-slate-50';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !col.hidden;
      cb.onchange = () => { if (cb.checked) grid.showColumn(col.name); else grid.hideColumn(col.name); };
      checkboxes.push(cb);
      colNames.push(col.name);

      row.appendChild(cb);
      row.appendChild(document.createTextNode(col.header || col.name));
      listCheckbox.appendChild(row);
    });
    panel.appendChild(listCheckbox);

    const divider = document.createElement('hr');
    divider.className = 'border-0 border-t border-slate-200 my-1.5';
    panel.appendChild(divider);

    const btnWrap = document.createElement('div');
    btnWrap.className = 'flex gap-1.5 px-3.5';
    const btnClass = 'flex-1 py-1 text-xs text-center bg-slate-100 hover:bg-slate-200 rounded cursor-pointer border-0';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = '전체 선택';
    selectAllBtn.className = btnClass;
    selectAllBtn.onclick = () => {
      colNames.forEach(n => grid.showColumn(n));
      checkboxes.forEach(cb => cb.checked = true);
    };

    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.textContent = '선택 해제';
    deselectAllBtn.className = btnClass;
    deselectAllBtn.onclick = () => {
      colNames.forEach(n => grid.hideColumn(n));
      checkboxes.forEach(cb => cb.checked = false);
    };

    btnWrap.appendChild(selectAllBtn);
    btnWrap.appendChild(deselectAllBtn);
    panel.appendChild(btnWrap);

    const rect = (triggerEl || document.body).getBoundingClientRect();
    panel.style.top = (rect.bottom + window.scrollY + 4) + 'px';
    panel.style.left = (rect.left + window.scrollX) + 'px';
    document.body.appendChild(panel);

    const close = (e) => {
      if (!panel.contains(e.target) && e.target !== triggerEl) {
        panel.remove();
        document.removeEventListener('mousedown', close);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', close), 0);
  },

  // CSV 다운로드
  csvDown: function(grid) {
    if (!this._validate(grid)) return;
    grid.export('csv', { fileName: 'data', useFormattedValue: true });
  },

  // 전시 순서 변경 모드
  // triggerEl: '순서 변경' 버튼, 저장/취소 버튼은 id="btnSaveOrder" / id="btnCancelOrder" 를 사용
  editRow: function(grid, triggerEl) {
    if (!this._validate(grid)) return;

    const backupData = JSON.parse(JSON.stringify(grid.getData()));

    grid.showColumn('_draggable');
    triggerEl.style.display = 'none';

    const btnSave   = document.getElementById('btnSaveOrder');
    const btnCancel = document.getElementById('btnCancelOrder');
    btnSave.classList.remove('hidden');
    btnCancel.classList.remove('hidden');

    const finish = () => {
      grid.hideColumn('_draggable');
      triggerEl.style.display = '';
      btnSave.classList.add('hidden');
      btnCancel.classList.add('hidden');
      btnSave.removeEventListener('click', onSave);
      btnCancel.removeEventListener('click', onCancel);
    };

    const onSave = () => {
      const rows = grid.getData();
      console.log('저장할 순서:', rows);
      if (!confirm('변경된 순서를 저장하시겠습니까?')) return;
      finish();
    };

    const onCancel = () => {
      if (!confirm('순서 변경을 취소하시겠습니까?')) return;
      grid.resetData(backupData);
      finish();
    };

    btnSave.addEventListener('click', onSave);
    btnCancel.addEventListener('click', onCancel);
  }
};

window.TuiGridCommon = TuiGridCommon;
window.TuiGridToolbar = TuiGridToolbar;