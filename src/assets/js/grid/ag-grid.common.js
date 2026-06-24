const GridCommon = {
  baseOptions: {
    localeText: AG_GRID_LOCALE_KR,
    getRowId: (params) => String(params.data.id), // ID를 고유 키로 매핑해주어야 행 삭제(getRowNode) 시 정상 동작
    defaultColDef: {
        sortable: true,
        resizable: true,
        cellStyle: {
          'display': 'flex',
          'align-items': 'center'
        }
    },
    enableCellTextSelection: true,
    ensureDomOrder: true,
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100, 300, 500],
  },
  init: function(element, customOptions = {}) {
    if (!element) return console.error("그리드 마운트 대상 DOM이 없습니다.");

    const finalOptions = {
        ...this.baseOptions,
        ...customOptions,
        defaultColDef: {
            ...this.baseOptions.defaultColDef,
            ...(customOptions.defaultColDef || {})
        }
    };

    // 최종 객체로 그리드 생성 후 API 인스턴스 반환
    return agGrid.createGrid(element, finalOptions);
  }
}

// Toolbar 관련
const GridToolbar = {
  _validate: function(gridApi) {
    if (!gridApi || typeof gridApi.applyColumnState !== 'function') {
      console.error('GridToolbar: 유효하지 않은 그리드 API입니다.', gridApi);
      return false;
    }
    return true;
  },
  // 정렬 초기화
  resetAlign: function(gridApi) {
    if (!this._validate(gridApi)) return;
    gridApi.applyColumnState({ defaultState: { sort: null } });
  },
  // 필터 초기화
  resetFilter: function(gridApi) {
    if (!this._validate(gridApi)) return;
    gridApi.setFilterModel(null);
  },
  // 컬럼 고정 선택 패널
  resetPinned: function(gridApi, triggerEl) {
    if (!this._validate(gridApi)) return;

    const existingPanel = document.getElementById('_gridPinnedPanel');
    if (existingPanel) { existingPanel.remove(); return; }

    const columns = gridApi.getColumns() || [];

    const panel = document.createElement('div');
    panel.id = '_gridPinnedPanel';
    panel.className = 'absolute z-[9999] bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-40 max-h-80 overflow-y-auto';

    const listCheckbox = document.createElement('div');
    listCheckbox.className = 'max-h-[200px] overflow-hidden overflow-y-auto';
    const checkboxes = [];
    columns.forEach(col => {
      const headerName = col.getColDef().headerName || col.getColId();
      const colId = col.getColId();
      if (!headerName || colId === 'dragColumn') return;

      const row = document.createElement('label');
      row.className = 'flex items-center gap-2 px-3.5 py-1.5 cursor-pointer text-xs whitespace-nowrap hover:bg-slate-50';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!col.getPinned();
      cb.onchange = () => gridApi.applyColumnState({ state: [{ colId, pinned: cb.checked ? 'left' : null }] });
      checkboxes.push(cb);

      row.appendChild(cb);
      row.appendChild(document.createTextNode(headerName));
      listCheckbox.appendChild(row);
    });
    panel.appendChild(listCheckbox);

    const divider = document.createElement('hr');
    divider.className = 'border-0 border-t border-slate-200 my-1.5';
    panel.appendChild(divider);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '전체 초기화';
    resetBtn.className = 'block w-[calc(100%-28px)] mx-3.5 py-1 text-xs text-center bg-slate-100 hover:bg-slate-200 rounded cursor-pointer border-0';
    resetBtn.onclick = () => {
      gridApi.applyColumnState({ defaultState: { pinned: null } });
      checkboxes.forEach(cb => cb.checked = false);
    };
    panel.appendChild(resetBtn);

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
  // 컬럼 표시 선택 (커뮤니티용 커스텀 패널)
  columnSelect: function(gridApi, triggerEl) {
    if (!this._validate(gridApi)) return;

    const existingPanel = document.getElementById('_gridColumnPanel');
    if (existingPanel) { existingPanel.remove(); return; }

    const columns = gridApi.getColumns() || [];

    const panel = document.createElement('div');
    panel.id = '_gridColumnPanel';
    panel.className = 'absolute z-[9999] bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-40 max-h-80 overflow-y-auto';

    const listCheckbox = document.createElement('div');
    listCheckbox.className = 'max-h-[200px] overflow-hidden overflow-y-auto';
    const checkboxes = [];
    const colIds = [];
    columns.forEach(col => {
      const headerName = col.getColDef().headerName || col.getColId();
      const colId = col.getColId();
      if (!headerName || colId === 'dragColumn') return;

      const row = document.createElement('label');
      row.className = 'flex items-center gap-2 px-3.5 py-1.5 cursor-pointer text-xs whitespace-nowrap hover:bg-slate-50';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = col.isVisible();
      cb.onchange = () => gridApi.setColumnsVisible([colId], cb.checked);
      checkboxes.push(cb);
      colIds.push(colId);

      row.appendChild(cb);
      row.appendChild(document.createTextNode(headerName));
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
      gridApi.setColumnsVisible(colIds, true);
      checkboxes.forEach(cb => cb.checked = true);
    };

    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.textContent = '선택 해제';
    deselectAllBtn.className = btnClass;
    deselectAllBtn.onclick = () => {
      gridApi.setColumnsVisible(colIds, false);
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
  csvDown: function(gridApi) {
    if (!this._validate(gridApi)) return;
    gridApi.exportDataAsCsv();
  },
  // 순서 변경
  editRow: function(gridApi, triggerEl) {
    if (!this._validate(gridApi)) return;

    // 원본 순서 백업
    const originalRowDataBackup = [];
    gridApi.forEachNode(function(node) {
      originalRowDataBackup.push(Object.assign({}, node.data));
    });

    // 드래그 컬럼 노출
    const columnDefs = gridApi.getGridOption('columnDefs');
    columnDefs.forEach(function(col) {
      if (col.colId === 'dragColumn') col.hide = false;
    });
    gridApi.setGridOption('columnDefs', columnDefs);

    // 버튼 전환: 편집버튼 숨기고 변경/취소 노출
    triggerEl.style.display = 'none';
    const btnSave   = document.getElementById('btnSaveOrder');
    const btnCancel = document.getElementById('btnCancelOrder');
    btnSave.classList.remove('hidden');
    btnCancel.classList.remove('hidden');

    // 편집 종료 공통 처리
    const finish = () => {
      columnDefs.forEach(function(col) {
        if (col.colId === 'dragColumn') col.hide = true;
      });
      gridApi.setGridOption('columnDefs', columnDefs);
      triggerEl.style.display = '';
      btnSave.classList.add('hidden');
      btnCancel.classList.add('hidden');
      btnSave.removeEventListener('click', onSave);
      btnCancel.removeEventListener('click', onCancel);
    };

    // 변경 저장: 현재 그리드 순서 수집 후 서버 전송
    const onSave = () => {
      const newOrder = [];
      gridApi.forEachNode(function(node) {
        newOrder.push(node.data);
      });
      console.log('저장할 순서:', newOrder);
      if (!confirm('변경된 순서를 저장하시겠습니까?')) return;
      finish();
    };

    // 취소: 원본 순서로 복원
    const onCancel = () => {
      if (!confirm('순서 변경을 취소하시겠습니까?')) return;
      gridApi.setGridOption('rowData', originalRowDataBackup);
      finish();
    };

    btnSave.addEventListener('click', onSave);
    btnCancel.addEventListener('click', onCancel);
  }
}
