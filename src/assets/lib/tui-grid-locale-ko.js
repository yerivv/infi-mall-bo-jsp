if (typeof tui !== 'undefined' && tui.Grid) {
  tui.Grid.setLanguage('ko', {
    display: {
      noData:            '데이터가 없습니다.',
      loadingData:       '불러오는 중입니다.',
      resizeHandleGuide: '드래그하여 컬럼 너비를 조정할 수 있습니다.',
    },
    net: {
      confirmCreate: '{{count}}건을 저장하시겠습니까?',
      confirmUpdate: '{{count}}건을 수정하시겠습니까?',
      confirmDelete: '{{count}}건을 삭제하시겠습니까?',
      confirmModify: '{{count}}건을 변경하시겠습니까?',
      noDataToCreate: '저장할 데이터가 없습니다.',
      noDataToUpdate: '수정할 데이터가 없습니다.',
      noDataToDelete: '삭제할 데이터가 없습니다.',
      noDataToModify: '변경할 데이터가 없습니다.',
      failResponse:   '데이터 요청 중 오류가 발생했습니다.\n다시 시도해 주세요.',
    },
    filter: {
      contains:   '포함',
      eq:         '같음',
      ne:         '같지 않음',
      start:      '시작 문자',
      end:        '끝 문자',
      after:      '이후',
      afterEq:    '이후 (포함)',
      before:     '이전',
      beforeEq:   '이전 (포함)',
      apply:      '적용',
      clear:      '초기화',
      selectAll:  '전체 선택',
      emptyValue: '(공백)',
    },
    contextMenu: {
      copy:        '복사',
      copyColumns: '열 복사',
      copyRows:    '행 복사',
      export:      '내보내기',

      
      txtExport:   'Text 다운로드',
      csvExport:   'CSV 다운로드',
      excelExport: 'Excel 다운로드',
    },
    pagination: {
      nextPage:   '다음 페이지',
      prevPage:   '이전 페이지',
      firstPage:  '첫 번째 페이지',
      lastPage:   '마지막 페이지',
      pageNumber: '페이지 번호',
    },
  });
}
