const columnDefs2 = [
  { 
    field: 'id', 
    headerName: '번호', 
    width: 70,
  },
  { 
    field: 'code', 
    headerName: '상품코드', 
    width: 120,
  },
  { 
    field: 'prodThumb', 
    headerName: '이미지', 
    width: 80,
    cellRenderer: GridUtils.imageCellRenderer,
    cellRendererParams: {
      style: 'square',
      w: 50,
      h: 40
    }
  },
  { 
    field: 'productName', 
    headerName: '상품명', 
    cellRenderer: GridUtils.linkCellRenderer,
    cellRendererParams: {
      getUrl: function(data) {
        return data.link || '#';
      },
      target: '_blank'
    }
  },
  {
    field: 'category',
    headerName: '카테고리',
  },
  {
    field: 'saleStatus',
    headerName: '판매상태',
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
    field: 'stockQuantity',
    headerName: '재고수량',
  },
  {
    field: 'displayStatus',
    headerName: '전시상태',
  },
  {
    field: 'shippingFee',
    headerName: '배송비',
  },
  {
    field: 'createdAt',
    headerName: '등록일',
    valueFormatter: GridFormatters.dateTimeFormatter 
  },
  {
    field: 'updatedAt',
    headerName: '수정일',
    valueFormatter: GridFormatters.dateTimeFormatter 
  },
  {
    colId: 'actions',
    headerName: '관리',
    width: 200,
    cellRenderer: GridUtils.actionsCellRenderer,
    sortable: false,
    filter: false,
    resizable: false
  }
];

const AdminProdMockFactory = {
  // 랜덤 조립용 기초 데이터 소스
  names: ['무선 블루투스 이어폰', '스마트 워치 프로', '노트북 파우치 13인치', '프리미엄 텀블러 500ml', '휴대용 미니 선풍기', 'USB-C 멀티 허브', '책상 정리 수납함', '무선 마우스 게이밍', '스마트폰 거치대', 'LED 스탠드 조명', '기계식 키보드 청축', '인체공학 버티컬 마우스', '고속 무선 충전 패드', '4K 모니터 암', '가죽 데스크 매드'],
  categories: ['전자제품 > 오디오', '전자제품 > 웨어러블', '패션잡화 > 가방', '생활용품 > 주방', '전자제품 > 생활가전', '전자제품 > 액세서리', '생활용품 > 사무용품', '전자제품 > 컴퓨터', '생활용품 > 조명'],
  saleStatuses: ['판매중', '품절', '판매중지'],
  displayStatuses: ['전시', '비전시'],
  shippingFees: ['무료', '2,500원', '3,000원'],
  images: ['/assets/images/_temp/temp01.jpg', '/assets/images/_temp/temp02.jpg', ''],

  generate: function(count) {
    const list = [];
    const totalCount = count || 120;

    for (let i = totalCount; i >= 1; i--) {
      // 1. 기초 인덱스 난수 확보
      const nameIdx = Math.floor(Math.random() * this.names.length);
      const cateIdx = Math.floor(Math.random() * this.categories.length);
      const statusIdx = Math.floor(Math.random() * this.saleStatuses.length);
      const displayIdx = Math.floor(Math.random() * this.displayStatuses.length);
      const shipIdx = Math.floor(Math.random() * this.shippingFees.length);
      const imgIdx = Math.floor(Math.random() * this.images.length);

      // 2. 비즈니스 로직 정합성 세팅 (정가, 판매가 계산 및 재고 싱크 맞추기)
      const originalPrice = (Math.floor(Math.random() * 45) + 1) * 10000; // 1만 ~ 45만 원 사이
      const discountRate = Math.floor(Math.random() * 30); // 0 ~ 30% 할인율
      const salePrice = originalPrice * (1 - (discountRate / 100));
      
      // 상태가 '품절'이면 재고량은 무조건 0, 아니면 랜덤 수량 확보
      const saleStatus = this.saleStatuses[statusIdx];
      const stockQuantity = (saleStatus === '품절') ? 0 : Math.floor(Math.random() * 500) + 10;

      // 3. 고유 상품코드 포맷 생성 (백틱 제거 문법)
      const codeNumber = String(i).padStart(3, '0');
      const code = 'PROD-' + codeNumber;

      // 4. 날짜 및 시간 데이터 생성 (2024년 고정 가상 스펙 무작위화)
      const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const createdAt = '2024-' + randomMonth + '-' + randomDay;
      const updatedAt = '2024-12-15'; // 수정일은 정적 매핑 처리

      // 5. 최종 데이터 객체 조립 후 밀어넣기 (JSP 연동을 위해 임시 외부 링크도 배치)
      list.push({
        no: i,
        id: i, // AG Grid 고유 식별을 위한 필수 id 필드 추가 매핑 ★
        code: code,
        prodImage: this.images[imgIdx],
        productName: this.names[nameIdx] + ' (샘플 ' + i + ')',
        category: this.categories[cateIdx],
        saleStatus: saleStatus,
        originalPrice: originalPrice,
        salePrice: salePrice,
        discountRate: discountRate,
        stockQuantity: stockQuantity,
        displayStatus: this.displayStatuses[displayIdx],
        shippingFee: this.shippingFees[shipIdx],
        createdAt: createdAt,
        updatedAt: updatedAt,
        link: 'https://www.naver.com' // 상품명 클릭 시 가상 연동될 공통 링크 경로
      });
    }

    return list;
  }
};

const rowData2 = AdminProdMockFactory.generate(120);

const sampleGridApi2 = GridCommon.init(document.querySelector('#sampleGrid2'), {
  columnDefs: columnDefs2,
  rowData: rowData2,
  rowSelection: {
    mode: 'multiRow', // 한개씩 선택 singleRow, 여러개 선택 multiRow
  },
  rowHeight: 46,
  headerHeight: 46,
});