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

let originalRowDataBackup = [];

document.addEventListener('DOMContentLoaded', function() {
  const btnEdit = document.querySelector('#btnEditOrder');
  const btnSave = document.querySelector('#btnSaveOrder');
  const btnCancel = document.querySelector('#btnCancelOrder');

    // ==========================================
    // ① [순서 변경] 버튼 클릭 시 (편집 모드 진입)
    // ==========================================
    btnEdit.addEventListener('click', function() {
        // 1-1. [순서 백업] 사용자가 드래그하기 전의 원본 데이터를 복사해서 메모리에 백업합니다.
        originalRowDataBackup = [];
        sampleGridApi3.forEachNode(function(node) {
            // 오브젝트 얕은 복사로 순수 데이터만 배열에 깊게 밀어넣음
            originalRowDataBackup.push(Object.assign({}, node.data));
        });

        // 1-2. [최신 v31+ 스펙] 드래그 컬럼 보이기 처리
        const columnDefs = sampleGridApi3.getGridOption('columnDefs');
        columnDefs.forEach(function(col) {
            if (col.colId === 'dragColumn') col.hide = false; // 숨김 해제
        });
        sampleGridApi3.setGridOption('columnDefs', columnDefs);

        // 1-3. [버튼 전환] 순서변경 숨기고 -> 확인/취소 보여주기
        btnEdit.classList.add('hidden');
        btnSave.classList.remove('hidden');
        btnCancel.classList.remove('hidden');
    });

    // ==========================================
    // ② [확인] 버튼 클릭 시 (순서 실제 적용 및 저장)
    // ==========================================
    btnSave.addEventListener('click', function() {
        if (!confirm('변경된 순서를 저장하시겠습니까?')) return;

        // 2-1. 드래그 완료된 현재 순서대로 배열 추출
        const finalRows = [];
        sampleGridApi3.forEachNode(function(node) {
            finalRows.push(node.data);
        });

        console.log('최종 확정되어 서버(JSP)로 보낼 데이터:', finalRows);
        alert('순서가 반영되었습니다.');

        // 2-2. [최신 v31+ 스펙] 드래그 컬럼 다시 숨기기
        const columnDefs = sampleGridApi3.getGridOption('columnDefs');
        columnDefs.forEach(function(col) {
            if (col.colId === 'dragColumn') col.hide = true; // 숨김
        });
        sampleGridApi3.setGridOption('columnDefs', columnDefs);

        // 2-3. [버튼 원상복구] 확인/취소 숨기고 -> 다시 [순서 변경] 노출
        btnEdit.classList.remove('hidden');
        btnSave.classList.add('hidden');
        btnCancel.classList.add('hidden');
    });

    // ==========================================
    // ③ [취소] 버튼 클릭 시 (★ 순서 원복 + 버튼 원상복구)
    // ==========================================
    btnCancel.addEventListener('click', function() {
        if (!confirm('순서 변경을 취소하시겠습니까?')) return;

        // 3-1. [데이터 롤백] 편집 진입 직전(①단계)에 복사해둔 백업 배열을 그리드에 강제로 재주입합니다.
        // 이 한 줄 덕분에 마우스로 바꿨던 순서들이 저장되지 않고 초기 상태로 리셋됩니다.
        sampleGridApi3.setGridOption('rowData', originalRowDataBackup);

        // 3-2. [최신 v31+ 스펙] 드래그 컬럼 다시 숨기기
        const columnDefs = sampleGridApi3.getGridOption('columnDefs');
        columnDefs.forEach(function(col) {
            if (col.colId === 'dragColumn') col.hide = true; // 숨김
        });
        sampleGridApi3.setGridOption('columnDefs', columnDefs);

        // 3-3. [버튼 원상복구] 요구사항 반영
        // 활성화되었던 확인/취소 버튼 세트를 다시 hidden 클래스로 숨깁니다.
        btnSave.classList.add('hidden');
        btnCancel.classList.add('hidden');
        
        // 숨겨두었던 [순서 변경] 버튼을 다시 화면에 노출합니다.
        btnEdit.classList.remove('hidden');
    });
});