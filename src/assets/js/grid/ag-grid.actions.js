const RowActionHandler = {
  detail: (id) => {
    alert(`ID: ${id}번 상세 페이지로 이동합니다.`);
  },
  edit: (id) => {
    alert(`ID: ${id}번 수정 페이지로 이동합니다.`);
  },
  delete: (id) => {
    if (confirm(`ID: ${id}번 데이터를 정말 삭제하시겠습니까?`)) {
      const rowNode = gridApi.getRowNode(id);
      if (rowNode) {
        gridApi.applyTransaction({ remove: [rowNode.data] });
        alert('삭제되었습니다.');
      }
    }
  },
  custom: (id, actionName) => {
    alert(`ID: ${id}번 행에서 [${actionName}] 커스텀 액션이 발생했습니다.`);
  },
};

function actionsCellRenderer(params) {
  const data = params.data;
  if (!data) return '';
}
