// TUI Grid 샘플 공통 데이터
const tuiSampleData = [
  { id: 1, productName: '기계식 키보드 청축',  category: '전자제품', status: '판매중',   originalPrice: 120000, discountRate: 15, salePrice: 102000, stock: 50,  createdAt: '2026-06-22' },
  { id: 2, productName: '인체공학 무선 마우스', category: '전자제품', status: '품절',     originalPrice:  89000, discountRate: 20, salePrice:  71200, stock: 0,   createdAt: '2026-05-10' },
  { id: 3, productName: '가죽 데스크 패드',     category: '생활용품', status: '판매중',   originalPrice:  25000, discountRate:  0, salePrice:  25000, stock: 200, createdAt: '2026-01-01' },
  { id: 4, productName: '한정판 에코백',         category: '패션잡화', status: '판매중지', originalPrice:  45000, discountRate: 10, salePrice:  40500, stock: 30,  createdAt: '2026-03-15' },
  { id: 5, productName: 'USB-C 멀티 허브',       category: '전자제품', status: '판매중',   originalPrice:  35000, discountRate:  5, salePrice:  33250, stock: 150, createdAt: '2026-04-20' },
  { id: 6, productName: '스마트 워치 프로',      category: '전자제품', status: '판매중',   originalPrice: 280000, discountRate: 10, salePrice: 252000, stock: 80,  createdAt: '2026-02-14' },
  { id: 7, productName: '노트북 파우치 13인치',  category: '패션잡화', status: '판매중',   originalPrice:  28000, discountRate:  0, salePrice:  28000, stock: 300, createdAt: '2026-05-30' },
  { id: 8, productName: '프리미엄 텀블러 500ml', category: '생활용품', status: '품절',     originalPrice:  32000, discountRate: 15, salePrice:  27200, stock: 0,   createdAt: '2025-12-10' },
];

// 페이지네이션 샘플용 대량 데이터 (25건)
const tuiPagData = (function() {
  const names = ['기계식 키보드', '무선 마우스', '데스크 패드', 'USB 허브', '스마트 워치', '이어폰', '웹캠', '모니터 암'];
  const categories = ['전자제품', '생활용품', '패션잡화'];
  const statuses = ['판매중', '품절', '판매중지'];
  const result = [];
  for (let i = 1; i <= 25; i++) {
    const price = (Math.floor(Math.random() * 30) + 1) * 10000;
    const discount = [0, 5, 10, 15, 20][Math.floor(Math.random() * 5)];
    result.push({
      id: i,
      productName: names[i % names.length] + ' (No.' + i + ')',
      category: categories[i % 3],
      status: statuses[i % 3],
      salePrice: Math.round(price * (1 - discount / 100)),
      stock: i % 3 === 1 ? 0 : Math.floor(Math.random() * 200) + 10,
      createdAt: '2026-' + String(Math.floor((i - 1) / 8) + 1).padStart(2, '0') + '-' + String((i % 28) + 1).padStart(2, '0'),
    });
  }
  return result;
})();
