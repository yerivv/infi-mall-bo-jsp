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