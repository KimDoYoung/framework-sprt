/**
 * 대결자 지정 (G05) — 문서작성 > 04. 전자결재 > 대결자 지정 #1021
 * AS-IS: myApp/client/vi/apr/Apr07_Tab_AltAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L67-112: 위 = 툴바 [대결자 등록 - (결재권한을 이관할 직원을 등록합니다.)] [조회][등록][저장][삭제], 아래 = 셀 편집 그리드(행번호, 체크박스 단일:
 *   성명 100(조회창 트리거) · 사번 80 · 부서명 200 · 직책 150 · 시작일 100 · 종료일 100 · 인감날인은(부)책임자가 대리 120 · 대결사유 500 · 비상연락망(비고) 300), 바깥 여백 20
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { aprAltApprApi } from '@/api/apr';
import { AprAltAppr } from '@/types/apr';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AprAltAppr>();
/** 체크박스 단일 선택(setChecked SINGLE). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

/** update() L196-275: 필수 검사(수정한 행) → 기간이 겹치는 행 검사(모든 행, altApprId가 있는 쪽 기준) */
const validate = (changed: AprAltAppr[], all: AprAltAppr[]): string | undefined => {
  for (const m of changed) {
    if (m.altEmpId == null) return '대결자는 필수입력 항목입니다';  // L204
    if (!m.startDate) return '시작일은 필수입력 항목입니다';  // L208
    if (!m.closeDate) return '종료일은 필수입력 항목입니다';  // L212
    if (!m.reasonCd) return '대결사유는 필수입력 항목입니다';  // L216
  }
  for (let i = 0; i < all.length; i++) {
    const m1 = all[i];
    for (let j = i + 1; j < all.length; j++) {
      const m2 = all[j];
      // 추가 행은 임시 음수 ID라 AS-IS의 altApprId == null 에 해당 → m1이 새 행이면 건너뛴다
      if (m1.altApprId > 0 && m1.altApprId !== m2.altApprId && m1.startDate && m1.closeDate && m2.startDate && m2.closeDate
        && m1.startDate <= m2.closeDate && m1.closeDate >= m2.startDate) {
        return `'${m1.altEmpName}'님과 대결자 설정기간이 중복됩니다`;  // L266
      }
    }
  }
  return undefined;
};

export const Apr07_Tab_AltAppr: React.FC = () => {
  const [pickOpen, setPickOpen] = useState(false);
  const [pickRowId, setPickRowId] = useState<number | null>(null);

  const crud = useGridCrud<AprAltAppr>({
    idField: 'altApprId',
    // retrieve() L176-180: 서비스 apr.Apr07_AltAppr.selectByEmpId(empId = 로그인 사원)
    search: aprAltApprApi.searchAltApprs,
    // updateFinal() L277-289: GridUpdate → apr.Apr07_AltAppr.update
    save: aprAltApprApi.saveAltApprs,
    // delete() L311-315: GridDeleteData → apr.Apr07_AltAppr.delete
    remove: aprAltApprApi.deleteAltApprs,
    // [E4] deleteButton[삭제].Select (L86) → deleteChk() L291-309: "삭제"/"선택한 항목을 삭제하시겠습니까?"(폭 300) → [E6] msgBox.DialogHide [YES] (L294) → delete()
    deleteConfirm: '선택한 항목을 삭제하시겠습니까?',
    // [E2] insertButton[등록].Select (L74) → insertRow() L182-194: GridInsertRow, targetEmpId ← 로그인 사원(서버가 채운다)
    newRow: useCallback(() => ({ stampYn: 'false' }), []),
    firstEditField: 'altEmpName',
    // [E3] updateButton[저장].Select (L80) → update() L196-275
    validate,
  });

  // [E0] 화면 열림 (생성자 L62-65) → makeLayout(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E5] lookupEmpInfo.TriggerClick (L118) → openLookupEmpInfo() L156-174: 사원찾기(open(오늘, …)) → 선택 행에 대결자 사원 정보를 넣는다
  const onPick = (emp: TransInfo | null) => {
    setPickOpen(false);
    if (!emp || pickRowId == null) return;
    crud.updateRow(pickRowId, {
      altEmpId: emp.personId,
      altEmpNo: emp.empNo,
      altEmpName: emp.korNm,
      altOrgName: emp.orgKorNm,
      altTitleName: emp.titleNm,
    });
  };

  // buildGrid() L114-140
  const columnDefs = useMemo(() => [
    gb.text('altEmpName', 100, '성명', {  // L129 (LookupTriggerField)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: AprAltAppr; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) { setPickRowId(p.data.altApprId); setPickOpen(true); } }} />
          {p.value}
        </>
      ),
    }),
    gb.text('altEmpNo', 80, '사번'),  // L130
    gb.text('altOrgName', 200, '부서명'),  // L131
    gb.text('altTitleName', 150, '직책'),  // L132
    // [생략] minDate.setMinValue(오늘): 날짜 편집기에 최소일 옵션이 없다(부품 제안)
    gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L133
    gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L134
    gb.boolean('stampYn', 120, '인감날인은<br>(부)책임자가 대리', { editable: true }),  // L135
    gb.text('reasonCd', 500, '대결사유', { editor: 'text' }),  // L136
    gb.text('emgrPoint', 300, '비상연락망(비고)', { editor: 'text' }),  // L137
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <b>대결자 등록 - (결재권한을 이관할 직원을 등록합니다.)</b>
          {/* [E1] retrieveButton[조회].Select (L68) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AprAltAppr> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={pickOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickOpen(false)} />
    </div>
  );
};
