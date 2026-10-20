/**
 * [1439] 문서작성 > 04. 전자결재 > 결재선 예외처리 (G10)
 * AS-IS: myApp/client/vi/emp/Emp30_Tab_ApprStepExcept.java (208줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-112: center=vlc(테두리, 여백 20) — 툴바 [담당자명 칸][조회][등록][저장][삭제] + 셀 편집 그리드(체크박스 다중, 4열: 등록일 100 · 사원명 100(조회창 트리거) ·
 *   사용여부 80(체크) · 사유(비고) 500). 사원찾기 조회창(Emp00_Lookup_SelectSingle)은 기존 부품을 쓴다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { empApprStepExceptApi } from '@/api/emp';
import { EmpApprStepExcept, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<EmpApprStepExcept>();

export const Emp30_Tab_ApprStepExcept: React.FC = () => {
  // 담당자명 칸(searchTextField)은 있지만 AS-IS retrieve()는 companyId만 넘긴다 — 글자는 조회 조건에 쓰이지 않는다
  const [searchText, setSearchText] = useState('');
  const [pickRowId, setPickRowId] = useState<number | null>(null);

  const crud = useGridCrud<EmpApprStepExcept>({
    idField: 'apprStepExceptId',
    // retrieve() L148-159: 서비스 emp.Emp30_ApprStepExcept.selectByCompanyId(companyId)
    search: empApprStepExceptApi.searchApprStepExcepts,
    // update() L162-165: GridUpdate → emp.Emp30_ApprStepExcept.update
    save: empApprStepExceptApi.saveApprStepExcepts,
    // deleteRow() L199-203: GridDeleteData → emp.Emp30_ApprStepExcept.delete
    remove: empApprStepExceptApi.deleteApprStepExcepts,
    // [E5] deleteButton[삭제].Select (L92) → deleteChk() L178-196: "삭제"/"n건의 항목을 삭제하시겠습니까?"(폭 300) → [E7] msgBox.DialogHide [YES] (L181) → deleteRow()
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // [E3] insertButton[등록].Select (L78) → insertRow() L168-176: GridInsertRow, 회사 = 로그인 회사(서버), 등록일 = 오늘, 사용 true
    newRow: useCallback(() => ({ regDate: dayjs().format('YYYY-MM-DD'), useYn: 'true' }), []),
  });

  // [E0] 화면 열림 (생성자 L55-112) → retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E6] lookupEmpInfo.TriggerClick (L116) → openLookupEmpInfo() L133-145: 사원찾기(오늘) → 그 행의 사원ID·사원명
  const onPick = (emp: TransInfo | null) => {
    const rowId = pickRowId;
    setPickRowId(null);
    if (!emp || rowId == null) return;
    crud.updateRow(rowId, { personId: emp.personId, personName: emp.korNm });
  };

  // buildGrid() L114-131
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L125
    {  // L126 addTextCenter(personName, 100, "사원명", lookupEmpInfo)
      ...gb.textCenter('personName', 100, '사원명'),
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: EmpApprStepExcept; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setPickRowId(p.data.apprStepExceptId); }} />
          {p.value}
        </>
      ),
    },
    gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L127
    gb.text('note', 500, '사유(비고)', { editor: 'text' }),  // L128
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        {/* [E1] searchTextField.KeyPress [Enter] (L62) → retrieve(), [E2] retrieveButton[조회].Select (L71) → retrieve() */}
        <div style={{ overflowX: 'auto' }}>
          <SearchBar onSearch={crud.retrieve} loading={crud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
            {/* [E3] insertButton[등록].Select (L78) → insertRow() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            {/* [E4] updateButton[저장].Select (L85) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
          </>}>
            <SearchBar.Field label="담당자명">
              <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<EmpApprStepExcept> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={pickRowId != null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickRowId(null)} />
    </div>
  );
};
