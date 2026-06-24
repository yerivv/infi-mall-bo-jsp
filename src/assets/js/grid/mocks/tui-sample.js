document.addEventListener('DOMContentLoaded', () => {
  
  // TUI Grid 문법 구조에 맞는 컬럼 선언 (field 대신 name 사용)
  const tuiColumnDefs = [
    { header: 'ID', name: 'id', width: 70, align: 'center' },
    { header: '상품명', name: 'productName', minWidth: 200, align: 'left', filter: { type: 'text', showApplyBtn: true, showClearBtn: true }},
    { 
      header: '정가', 
      name: 'originalPrice', 
      width: 140, 
      align: 'right',
      formatter: TuiGridUtils.formatCurrency
    },
    { 
      header: '할인율', 
      name: 'discountRate', 
      width: 110, 
      align: 'center'
    },
    { 
      header: '판매가', 
      name: 'salePrice', 
      width: 140, 
      align: 'right',
      formatter: TuiGridUtils.formatCurrency
    },
    { 
      header: '등록 일시', 
      name: 'createdAt', 
      width: 220, 
      align: 'center',
      formatter: TuiGridUtils.formatDate
    }
  ];

  const tuiRowData = [
    { id: 1, productName: '기계식 키보드 청축', originalPrice: 120000, discountRate: '15%', salePrice: 102000, createdAt: '2026-06-22' },
    { id: 2, productName: '인체공학 무선 마우스', originalPrice: 89000, discountRate: '20%', salePrice: 71200, createdAt: '2026-05-10' },
    { id: 3, productName: '가죽 데스크 패드', originalPrice: 25000, discountRate: '0%', salePrice: 25000, createdAt: '2026-01-01' }
  ];

  // HTML 내부에 지정한 마운트 컨테이너 ID(#tuiGrid)와 매핑 진행
  const gridContainer = document.getElementById('tuiGrid');
  
  if (gridContainer) {
    // 공통 팩토리 추상화기를 통해 깔끔하게 인스턴스 렌더링 시작
    const sampleTuiGrid = TuiGridCommon.createGrid({
      el: gridContainer,
      columns: tuiColumnDefs,
      data: tuiRowData,
      customOptions: {
        bodyHeight: 450 // 고정 높이 수동 오버라이딩 옵션
      }
    });
    
    console.log("TUI Grid 렌더링 완료:", sampleTuiGrid);
  } else {
    console.error("화면 내에 #tuiGrid 컨테이너 요소를 찾을 수 없어 빌드를 취소합니다.");
  }
});