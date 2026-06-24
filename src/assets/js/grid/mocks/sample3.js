const columnDefs3 = [
  {
    colId: 'dragColumn',      // 제어를 위한 고유 ID
    rowDrag: true,            // 드래그 핸들러 활성화 옵션 ★
    rowDragText: function(params) {
      // 상품명이 없을 때를 대비한 기본값 처리 포함
      return params.rowNode.data.productName || '상품명 없음';
    },
    width: 50,
    minWidth: 50,
    maxWidth: 50,
    pinned: 'left',
    sortable: false,
    filter: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    hide: true                // 초기 상태에는 숨김 처리 ★
  },
  { 
    field: 'productName', 
    headerName: '상품명', 
    width: 800,
    cellRenderer: GridUtils.linkCellRenderer,
    cellRendererParams: {
      getUrl: function(data) {
        return data.link || '#';
      },
      target: '_blank'
    }
  },
  {
    field: 'prodThumb',
    headerName: '이미지',
    width: 140,
    cellRenderer: GridUtils.imageCellRenderer,
    cellRendererParams: {
      style: 'square',
      w: 50,
      h: 40
    }
  },
  {
      field: 'originalPrice',
      headerName: '정가',
      width: 140,
      valueFormatter: GridFormatters.currencyFormatter
  },
  {
      field: 'discountRate',
      headerName: '할인율',
      width: 110,
      valueFormatter: GridFormatters.rateFormatter,
      cellClass: 'text-red-500 font-semibold'
  },
  {
      field: 'salePrice',
      headerName: '판매가',
      width: 140,
      valueFormatter: GridFormatters.currencyFormatter
  },
  {
      field: 'createdAt',
      headerName: '등록 일시',
      width: 220,
      valueFormatter: GridFormatters.dateTimeFormatter
  },
];

const rowData3 = [
  { id: 1, productName: '기계식 키보드 청축', prodThumb: '/assets/images/_temp/temp01.jpg', link: 'https://www.naver.com', originalPrice: 120000, discountRate: 0.15, salePrice: 102000, createdAt: '2026-06-22T11:15:30' },
  { id: 2, productName: '인체공학 무선 마우스', prodThumb: null, originalPrice: 89000, discountRate: 20, salePrice: 71200, createdAt: '2026-05-10T09:01:05' },
  { id: 3, productName: '가죽 데스크 패드', prodThumb: null, originalPrice: 25000, discountRate: 0, salePrice: 25000, createdAt: '2026-01-01T00:00:00' },
  { id: 4, productName: '한정판 에코백', prodThumb: null, originalPrice: null, discountRate: null, salePrice: 0, createdAt: null }
];

const sampleGridApi3 = GridCommon.init(document.querySelector('#sampleGrid3'), {
  columnDefs: columnDefs3,
  rowData: rowData3,
  pagination: false,
  // 행 드래그가 끝났을 때 정렬/필터가 켜져있으면 순서가 꼬이므로 자동으로 제어되도록 설정
  rowDragManaged: true, 
  animateRows: true
});