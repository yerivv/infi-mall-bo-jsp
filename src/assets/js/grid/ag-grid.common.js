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
  // 컬럼 고정 해제
  resetPinned: function(gridApi) {
    if (!this._validate(gridApi)) return;
    gridApi.applyColumnState({ defaultState: { pinned: null } });
  },
  // 컬럼 표시 선택 (커뮤니티용 커스텀 패널)
  columnSelect: function(gridApi, triggerEl) {
    if (!this._validate(gridApi)) return;

    const existingPanel = document.getElementById('_gridColumnPanel');
    if (existingPanel) { existingPanel.remove(); return; }

    const columns = gridApi.getColumns() || [];

    const panel = document.createElement('div');
    panel.id = '_gridColumnPanel';
    panel.style.cssText = 'position:absolute;z-index:9999;background:#fff;border:1px solid #e2e8f0;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.12);padding:8px 0;min-width:160px;max-height:320px;overflow-y:auto;';

    columns.forEach(col => {
      const headerName = col.getColDef().headerName || col.getColId();
      const colId = col.getColId();
      if (!headerName || colId === 'dragColumn') return;

      const row = document.createElement('label');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 14px;cursor:pointer;font-size:12px;white-space:nowrap;';
      row.onmouseenter = () => row.style.background = '#f8fafc';
      row.onmouseleave = () => row.style.background = '';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = col.isVisible();
      cb.onchange = () => gridApi.setColumnsVisible([colId], cb.checked);

      row.appendChild(cb);
      row.appendChild(document.createTextNode(headerName));
      panel.appendChild(row);
    });

    // 버튼 기준으로 위치 계산
    const rect = (triggerEl || document.body).getBoundingClientRect();
    panel.style.top = (rect.bottom + window.scrollY + 4) + 'px';
    panel.style.left = (rect.left + window.scrollX) + 'px';
    document.body.appendChild(panel);

    // 외부 클릭 시 닫기
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
