const columnDefs = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'productName', headerName: '상품명', flex: 1, },
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
  {
    colId: 'actions',
    headerName: '관리',
    width: 240,
    sortable: false,
    filter: false,
    resizable: false,
    cellRenderer: GridUtils.actionButtonsCellRenderer,
    cellRendererParams: {
        buttons: [
          {
              label: '수정',
              variant: 'primary',
              onClick: (data) => {
                  console.log(data)
                  location.href = "${pageContext.request.contextPath}/admin/userEdit.do?id=" + data.id;
              }
          },
          {
            label: '삭제',
            variant: 'danger',
            onClick: (data) => {
              if (confirm('정말 삭제하시겠습니까?')) {
                console.log('삭제:', data);
              }
            },
          },
          {
            label: '버튼명',
            variant: 'secondary',
            onClick: (data) => {
              console.log('버튼:', data);
            },
          },
          {
            label: '버튼명',
            onClick: (data) => {
              console.log('버튼:', data);
            },
          },
        ]
    }
  }
];

// 샘플 데이터 (할인율이 소수점 형태든 정수 형태든 모두 호환되도록 설계)
const rowData = [
  { id: 1, productName: '기계식 키보드 청축', originalPrice: 120000, discountRate: 0.15, salePrice: 102000, createdAt: '2026-06-22T11:15:30' },
  { id: 2, productName: '인체공학 무선 마우스', originalPrice: 89000, discountRate: 20, salePrice: 71200, createdAt: '2026-05-10T09:01:05' },
  { id: 3, productName: '가죽 데스크 패드', originalPrice: 25000, discountRate: 0, salePrice: 25000, createdAt: '2026-01-01T00:00:00' },
  { id: 4, productName: '한정판 에코백', originalPrice: null, discountRate: null, salePrice: 0, createdAt: null } 
];

const sampleGridApi = GridCommon.init(document.querySelector('#sampleGrid'), {
  columnDefs: columnDefs,
  rowData: rowData,
});