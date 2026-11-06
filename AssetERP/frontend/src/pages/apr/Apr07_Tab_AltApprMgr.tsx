/**
 * [1022] 관리자 > 04. 전자결재 > 대결자 지정(관리자) (EE02)
 * AS-IS: myApp/client/vi/apr/Apr07_Tab_AltApprMgr.java (381줄) + Emp00_Lookup_SelectSingle(연결, 이미 변환) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L70-98: center(여백 20, 테두리) = 툴바 50(등록기간 시작 ~ 끝 · 원결재자 검색 · [조회][삭제][등록][저장]) + 셀 편집 그리드(행번호, 체크박스 단일;
 *   묶음 헤더 원결재자(성명 90 · 사번 50 · 부서 150 · 직책 90) · 대결자(같은 4열, 파랑) · 시작일 100 · 종료일 100 · 인감날인은(부)책임자가 대리 120 · 대결사유 250 · 본인비상연락망 120 · 비고 200)
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개 미만이라 넣지 않는다
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button as AntButton, DatePicker, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprAltApprMgrApi } from '@/api/apr';
import { AprAltApprMgr } from '@/types/apr';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AprAltApprMgr>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALT_COLOR = '#0069B4';  // addText(…, "0069B4") — 대결자 열 글자색
/** 체크박스 단일 선택(setChecked SINGLE). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

/** update() L248-332: 필수 검사(수정한 행, 순서대로) → 같은 원결재자의 기간이 겹치는 행 검사(모든 행, altApprId가 있는 쪽 기준) */
const validate = (changed: AprAltApprMgr[], all: AprAltApprMgr[]): string | undefined => {
  for (const m of changed) {
    if (m.targetEmpId == null) return '원결재자를 지정해야 합니다';  // L256
    if (m.altEmpId == null) return '대결자를 지정해야 합니다';  // L260
    if (!m.startDate) return '시작일을 지정해야 합니다';  // L264
    if (!m.closeDate) return '종료일을 지정해야 합니다';  // L268
    if (!m.reasonCd) return '대결사유를 입력해야 합니다';  // L272
  }
  for (let i = 0; i < all.length; i++) {
    const m1 = all[i];
    for (let j = i + 1; j < all.length; j++) {
      const m2 = all[j];
      // 추가 행의 임시 음수 ID는 AS-IS가 insertRow에서 getSeq로 받아 둔 ID에 해당 → 새 행도 같은 규칙으로 검사한다
      if (m1.altApprId !== m2.altApprId && m1.targetEmpId === m2.targetEmpId && m1.startDate && m1.closeDate && m2.startDate && m2.closeDate
        && m1.startDate <= m2.closeDate && m1.closeDate >= m2.startDate) {
        return '대결자 설정기간이 중복되는 값이 존재합니다';  // L323
      }
    }
  }
  return undefined;
};

export const Apr07_Tab_AltApprMgr: React.FC = () => {
  // settings() L100-107: 시작일 = 오늘 - 7일, 종료일 = 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [pickFlag, setPickFlag] = useState<1 | 2 | null>(null);
  const [pickRowId, setPickRowId] = useState<number | null>(null);
  const cond = useRef({ startDate, endDate, searchText });
  cond.current = { startDate, endDate, searchText };

  const crud = useGridCrud<AprAltApprMgr>({
    idField: 'altApprId',
    // retrieve() L222-235: apr.Apr07_AltAppr.selectByText (companyId는 서버가 세션에서, searchText는 '%글자%'도 서버가)
    search: useCallback(() => aprAltApprMgrApi.search({
      startDate: cond.current.startDate.format(DATE_FORMAT),
      endDate: cond.current.endDate.format(DATE_FORMAT),
      searchText: cond.current.searchText,
    }), []),
    // updateFinal() L334-346: GridUpdate → apr.Apr07_AltAppr.update → "정상적으로 등록완료되었습니다"
    save: async rows => {
      const saved = await aprAltApprMgrApi.save(rows);
      message.success('정상적으로 등록완료되었습니다');
      return saved;
    },
    // delete() L368-372: GridDeleteData → apr.Apr07_AltAppr.delete
    remove: aprAltApprMgrApi.remove,
    // [E2] deleteButton[삭제].Select (L115) → deleteChk() L348-366: "삭제"/"선택한 항목을 삭제하시겠습니까?" → [E8] msgBox.DialogHide [YES] (L351) → delete()
    deleteConfirm: '선택한 항목을 삭제하시겠습니까?',
    // [E3] insertRowButton[등록].Select (L121) → insertRow() L237-246: GridInsertRow (빈 모델)
    newRow: useCallback(() => ({ stampYn: 'false' }), []),
    firstEditField: 'targetEmpName',
    // [E4] saveButton[저장].Select (L127) → update() L248-332
    validate,
  });

  // [E0] 화면 열림 (생성자 L70-98) → settings(), getCenterLayout()  — 열 때 자동 조회는 없다(원본 생성자는 retrieve()를 부르지 않는다)
  // (자동 조회 없음)

  // [E6]·[E7] lookupEmpInfo1·2.TriggerClick (L146·L154) → openLookupEmpInfo(flag) L195-220: 사원찾기(open(오늘, …)) → 선택 행에 원결재자(1)·대결자(2) 사원 정보를 넣는다
  const onPick = (emp: TransInfo | null) => {
    const flag = pickFlag;
    setPickFlag(null);
    if (!emp || pickRowId == null || flag == null) return;
    crud.updateRow(pickRowId, flag === 1
      ? { targetEmpId: emp.personId, targetEmpNo: emp.empNo, targetEmpName: emp.korNm, targetOrgName: emp.orgKorNm, targetTitleName: emp.titleNm }
      : { altEmpId: emp.personId, altEmpNo: emp.empNo, altEmpName: emp.korNm, altOrgName: emp.orgKorNm, altTitleName: emp.titleNm });
  };

  const triggerCol = (field: 'targetEmpName' | 'altEmpName', flag: 1 | 2, color?: string) =>
    gb.text(field, 90, '성명', {
      cellStyle: { color: color ?? '#1677ff' },
      cellRenderer: (p: { data?: AprAltApprMgr; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) { setPickRowId(p.data.altApprId); setPickFlag(flag); } }} />
          {p.value}
        </>
      ),
    });

  // buildGrid() L143-180
  const columnDefs = useMemo(() => [
    gb.group('원결재자', [  // L162 HeaderGroupMap(0, 2, …, 1, 4)
      triggerCol('targetEmpName', 1),  // L164 (LookupTriggerField)
      gb.text('targetEmpNo', 50, '사번'),  // L165
      gb.text('targetOrgName', 150, '부서'),  // L166
      gb.text('targetTitleName', 90, '직책'),  // L167
    ]),
    gb.group('대결자', [  // L163 HeaderGroupMap(0, 6, …, 1, 4) — 파랑
      triggerCol('altEmpName', 2, ALT_COLOR),  // L168
      gb.text('altEmpNo', 50, '사번', { cellStyle: { color: ALT_COLOR } }),  // L169
      gb.text('altOrgName', 150, '부서', { cellStyle: { color: ALT_COLOR } }),  // L170
      gb.text('altTitleName', 90, '직책', { cellStyle: { color: ALT_COLOR } }),  // L171
    ]),
    gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L172
    gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L173
    gb.boolean('stampYn', 120, '인감날인은<br>(부)책임자가 대리', { editable: true }),  // L174
    gb.text('reasonCd', 250, '대결사유', { editor: 'text' }),  // L175
    gb.text('emgrPoint', 120, '본인비상연락망', { editor: 'text' }),  // L176
    gb.text('note', 200, '비고', { editor: 'text' }),  // L177
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E1] retrieveButton[조회].Select (L109), [E5] searchText.KeyPress [Enter] (L133) → retrieve() */}
      <SearchBar
        onSearch={() => void crud.retrieve()}
        extra={
          <>
            <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          </>
        }
      >
        <SearchBar.Field label="등록기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="원결재자">
          <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AprAltApprMgr> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
      </div>
      <Emp00_Lookup_SelectSingle open={pickFlag != null} transDate={dayjs().format(DATE_FORMAT)} onResult={onPick} onClose={() => setPickFlag(null)} />
    </div>
  );
};
