/**
 * [1184] 신청 > 01. 외출/출장/휴가 > 연월차휴가 지정통보 (Y03)
 * AS-IS: myApp/client/vi/emp/Emp21_Tab_PersonList.java (286줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L55-78, 스타일 SG 견본 Tdm01_Tab_Hr): 툴바(해당 연도 · [조회]) + 통보 그리드(체크 단일, 8열)
 * 결재요청 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A15(미사용 연차·월차 휴가 사용 시기 지정통보서, 제공자는 기존 UnLeaveLinkSeedProvider)
 *   — [상신] findLinkCode() L213 → openLookupDoc() L241 → insertAppr() L252 → updateApprId() L265
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empMyUnLeaveApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { MyUnLeave } from '@/types/emp';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<MyUnLeave>();
const LINK_CODE = 'A15';
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Emp21_Tab_PersonList: React.FC = () => {
  const gridRef = useRef<AgGridReact<MyUnLeave>>(null);
  const [year, setYear] = useState(dayjs().format('YYYY'));   // settings() L81: 해당 연도 = 오늘 연도
  const [rows, setRows] = useState<MyUnLeave[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [classPick, setClassPick] = useState<{ row: MyUnLeave; classTreeId: number | null } | null>(null);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; refId: number } | null>(null);
  const yearRef = useRef(year);
  yearRef.current = year;

  // [E1] retrieveButton[조회].Select (L84) → retrieve() L195-211: emp.Emp21_UnLeave.selectByPersonId(companyId, personId, stdYear) → 첫 행 선택
  const retrieve = async () => {
    setLoading(true);   // grid.mask("Loading")
    try {
      setRows(await empMyUnLeaveApi.search(yearRef.current));
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L55-78) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);

  // [E2] actionCell2 (ImageCell "View").callbackOnCreate (L139) → 인라인 L139-144: apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …), 없으면 "관련 상신문서가 존재하지 않습니다"
  // [E3] actionCell3 (ImageCell "View").callbackOnCreate (L169) → 인라인 L169-174: 같은 일을 지정통보 문서(expectApprId)로 한다
  const view = (apprId: number | null) => {
    if (apprId == null) { message.warning('관련 상신문서가 존재하지 않습니다'); return; }
    setViewApprId(apprId);
  };

  // actionCell1 (ImageCell "Edit" = [상신]) L99-120 (이벤트 번호 없음): 선택이 하나일 때만 — 02·04·06은 상신 불가, 통지일부터 10일 안에만 가능
  const apply = (row: MyUnLeave) => {
    gridRef.current?.api?.getRowNode(String(row.unLeaveId))?.setSelected(true, true);
    if (['02', '04', '06'].includes(row.unLeaveCode)) { message.warning('해당 구분은 상신이 불가능합니다'); return; }
    const start = dayjs(row.startDate);
    const today = dayjs().startOf('day');
    if (today.isBefore(start, 'day') || today.isAfter(start.add(10, 'day'), 'day')) {
      message.warning('사용시기 지정통보 기간이 지났습니다. (통지일로부터 10일이내에만 가능)');
      return;
    }
    void findLinkCode(row);
  };

  // findLinkCode() L213-239: 지정통보 문서가 진행 중이면 막고, dcr.Dcr30_Link.selectByLinkCode("A15")가 정확히 1건이면 그 분류를 기본값으로 문서분류 창을 연다
  //   (여러 건·없음이면 AS-IS는 기본 분류 null에서 오류가 나 창이 안 열린다 — TOBE는 기본값 없이 연다, 이상한점 #107)
  const findLinkCode = async (row: MyUnLeave) => {
    if (row.expectApprStatusCode != null && ['10', '20', '30'].includes(row.expectApprStatusCode)) {
      message.warning('상신 진행 중인 공지구분입니다');
      return;
    }
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      setClassPick({ row, classTreeId: list.length === 1 ? list[0].classTreeId : null });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // insertAppr() L252-263: Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A15", 통보 행, false, …)
  const onClassResult = (classTreeId: number | null) => {
    const pick = classPick;
    setClassPick(null);
    if (pick && classTreeId != null) setLink({ classTreeId, linkCode: LINK_CODE, refId: pick.row.unLeaveId });
  };

  // updateApprId() L265-281: emp.Emp21_UnLeave.update(expectApprId) → 성공하면 retrieve()
  const updateApprId = async (apprId: number) => {
    if (!link) return;
    try {
      await empMyUnLeaveApi.updateExpectApprId(link.refId, apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // buildGrid() L98-193 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.date('startDate', 100, '통지일자'),   // L183
    gb.text('unLeaveName', 240, '구분'),   // L184
    gb.double('remainDays', 60, '잔여휴가'),   // L185
    gb.textCenter('apprStatusName', 180, '지정통보문서'),   // L186
    iconCell<MyUnLeave>('view', 'apprView', 60, '상세보기', row => view(row.apprId)),   // L187 actionCell2
    iconCell<MyUnLeave>('edit', 'apply', 60, '상신', apply),   // L188 actionCell1
    gb.textCenter('expectApprStatusName', 180, '결재상태'),   // L189
    iconCell<MyUnLeave>('view', 'expectView', 60, '상세보기', row => view(row.expectApprId)),   // L190 actionCell3
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="해당 연도">
            <SearchBar.Input style={{ width: 80 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<MyUnLeave>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={ROW_SELECTION}
            getRowId={p => String(p.data.unLeaveId)}
            loading={loading}
          />
        </div>
      </div>
      {/* openLookupDoc() L241-250: Dcr01_Lookup_Class.open(classTreeId, classTreeModel, callback) */}
      <Dcr01_Lookup_Class
        open={classPick != null}
        classTreeId={classPick?.classTreeId ?? null}
        onResult={r => onClassResult(r.classTreeId)}
        onClose={() => setClassPick(null)}
      />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={link}
        onLinkSaved={id => void updateApprId(id)}
        onClose={() => { setViewApprId(null); setLink(null); }}
      />
    </div>
  );
};
