/**
 * [1358] 신청 > 01. 외출/출장/휴가 > 외출등록 (Y04)
 * AS-IS: myApp/client/vi/emp/Emp54_Tab_Errand.java (524줄) + Emp54_Edit_Errand(575줄)·Emp56_Lookup_Share(339줄, 공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-106: 가운데(여백 20, 테두리) = 툴바(조회기간 100 ~ 100 · [조회][등록][반복등록][저장][삭제] · 안내 글) + 셀 편집 그리드(CellEditGrid, 체크 다중).
 * 결재요청 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A45(이익수령 제외신청) — checkAppr() L339-371 → checkDcr() L398-424 → insertLinkApproval() L426-437 → updateApprId() L439-456.
 * 스타일: SGP (견본 Chk02_Tab_DailyList — 바깥 여백 20, 안쪽 padding 10, 툴바-그리드 간격 8). 이 화면은 셀 편집 그리드 + [반복등록] 편집창(Emp54_Edit_Errand).
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n) UX-03
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empMyErrandApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MyErrand } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Emp54_Edit_Errand } from './Emp54_Edit_Errand';
import { Emp56_Lookup_Share } from './Emp56_Lookup_Share';

const gb = gbFor<MyErrand>();
const FORMAT = 'YYYY-MM-DD';
const LINK_CODE = 'A45';

export const Emp54_Tab_Errand: React.FC = () => {
  // settings() L108-150: 조회기간 = 오늘 ~ (오늘 + 6개월)의 1일
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().add(6, 'month').startOf('month'));
  const [errandCodes, setErrandCodes] = useState<Code[]>([]);
  const [cycleOpen, setCycleOpen] = useState(false);
  const [shareId, setShareId] = useState<number | null>(null);
  const [classPick, setClassPick] = useState<MyErrand | null>(null);   // checkDcr(): 문서분류가 없을 때 Dcr01_Lookup_Class
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [viewStatus, setViewStatus] = useState<string | null>(null);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; refId: number } | null>(null);
  const range = useRef({ startDate, closeDate });
  range.current = { startDate, closeDate };

  // retrieve() L199-212: emp.Emp54_Errand.selectByDate(personId, startDate, closeDate)
  const search = useCallback(() => empMyErrandApi.search(range.current.startDate.format(FORMAT), range.current.closeDate.format(FORMAT)), []);
  // update() L215-237: 수정된 줄에 상신문서가 있고 반려가 아니면 수정 불가 → 저장 뒤 retrieve()
  const validate = useCallback((changed: MyErrand[]) => (
    changed.some(r => r.apprId != null && r.aprStatusName !== '반려') ? '상신문서가 존재하는 내역은 수정이 불가능합니다' : undefined
  ), []);
  const save = useCallback((rows: MyErrand[]) => empMyErrandApi.save(rows), []);
  const remove = useCallback((ids: number[]) => empMyErrandApi.deleteMine(ids), []);
  // insertRow() L240-248: 회사·사원·일자 = 오늘·공개 true
  const newRow = useCallback((): Partial<MyErrand> => ({ date: dayjs().format(FORMAT), publicYn: true }), []);

  const crud = useGridCrud<MyErrand>({
    idField: 'errandId', search, save, remove, newRow, firstEditField: 'date', validate, reloadAfterSave: true,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L77-106) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCodes('ErrandCode').then(setErrandCodes).catch(() => {});
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const select = (row: MyErrand) => crud.gridRef.current?.api?.getRowNode(String(row.errandId))?.setSelected(true, true);

  // [E5] deleteButton[삭제].Select (L144) → deleteChk() L260-278: "n건을 삭제하시겠습니까?"(제목 "삭제", 폭 250) → [E7] [YES] (L263) → deleteRow() L281-308
  const deleteChk = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }  // 05 §8: 선택 없이 삭제는 경고만
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 250,
      onOk: async () => {
        // deleteRow() L281-308: 고른 줄이 모두 진행 중 문서(결재 ID 있음, 반려·임시저장 아님)일 때만 막는다 (이상한점 #101)
        const locked = checked.every(r => r.apprId != null && r.aprStatusName !== '반려' && r.aprStatusName !== '임시저장');
        if (locked) { message.warning('상신문서가 존재하는 내역은 삭제가 불가능합니다'); return; }
        try {
          const saved = checked.filter(r => r.errandId > 0).map(r => r.errandId);
          if (saved.length > 0) await remove(saved);
          crud.removeRows(checked.map(r => r.errandId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // lookupShare() L310-337: Emp56_Lookup_Share.open(errandId) → 전체공개였으면 false로 바꾼 행을, 아니면 공유명을 그리드에 반영
  const lookupShare = (row: MyErrand) => {
    select(row);
    if (crud.hasChanges()) { message.warning('저장 후 공유정보를 설정하세요'); return; }
    setShareId(row.errandId);
  };
  const onShareResult = async (info: string) => {
    const id = shareId;
    setShareId(null);
    const row = crud.rows.find(r => r.errandId === id);
    if (id == null || !row) return;
    try {
      if (row.publicYn) crud.replaceRow(id, await empMyErrandApi.updatePublic(id, false));
      else crud.replaceRow(id, { ...row, shareInfo: info });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // apprView() L373-396: apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve())
  const apprView = (apprId: number | null, status: string | null) => { setViewStatus(status); setViewApprId(apprId); };

  // checkDcr() L398-424: dcr.Dcr30_Link.selectByLinkCode("A45") — 없으면 Dcr01_Lookup_Class로 고르고, 있으면 첫 건 → insertLinkApproval() L426-437
  const checkDcr = async (row: MyErrand) => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      if (list.length === 0) setClassPick(row);
      else setLink({ classTreeId: list[0].classTreeId, linkCode: LINK_CODE, refId: row.errandId });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // checkAppr() L339-371: 결재상태 이름이 없으면 바로, 반려면 확인 뒤 새로(아니오는 문서 열기), 그 밖은 문서 열기
  const checkAppr = (row: MyErrand) => {
    select(row);
    if (row.errandId <= 0) { message.warning('저장 후 결재요청을 진행하세요'); return; }   // 원본은 저장 전 행도 열지만 상신 대상 ID가 없어 TOBE는 저장 뒤에 한다
    if (row.aprStatusName == null) { void checkDcr(row); return; }
    if (row.aprStatusName === '반려') {
      // [E8] msgBox.DialogHide [YES] (L350) → checkDcr(), apprView()
      Modal.confirm({
        title: '확인', content: '새로운 결재요청을 진행하시겠습니까?', okText: '예', cancelText: '아니오', width: 450,
        onOk: () => void checkDcr(row),
        onCancel: () => apprView(row.apprId, row.aprStatusCode),
      });
      return;
    }
    apprView(row.apprId, row.aprStatusCode);
  };

  // updateApprId() L439-456: emp.Emp54_Errand.update → 성공하면 retrieve()
  const updateApprId = async (apprId: number) => {
    if (!link) return;
    try {
      await empMyErrandApi.updateApprId(link.refId, apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // buildGrid() L152-196 (setChecked MULTI, 셀 편집 8열)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자', { editor: 'date' }),                                          // L180
    gb.textCenter('weekday', 70, '요일'),                                                       // L181
    // [E6] errandComboBox[ErrandCode].Collapse (L154) → 인라인 L154-160: 고른 구분 이름의 코드를 errandCode 변경으로 기록
    gb.textCenter('errandName', 100, '구분', {                                                  // L182
      editor: 'select',
      values: errandCodes.map(c => c.name),
      valueSetter: p => {
        p.data.errandName = p.newValue;
        p.data.errandCode = errandCodes.find(c => c.name === p.newValue)?.code ?? p.data.errandCode;
        return true;
      },
    }),
    gb.textCenter('departTime', 120, '외출시각', { editor: 'text' }),                          // L183
    gb.textCenter('returnTime', 120, '복귀시각', { editor: 'text' }),                          // L184
    gb.text('reason', 400, '사유', { editor: 'text' }),                                         // L185
    gb.text('venue', 150, '장소', { editor: 'text' }),                                          // L186
    gb.text('host', 150, '주최자', { editor: 'text' }),                                         // L187
    gb.text('note', 150, '비고', { editor: 'text' }),                                           // L188
    iconCell<MyErrand>('edit', 'apprCell', 70, '이익수령<br>제외신청', checkAppr),              // L189
    gb.textCenter('aprStatusName', 80, '결재상태'),                                             // L190
    gb.boolean('publicYn', 50, '공개', { editable: true }),                                     // L191
    gb.text('shareInfo', 150, '공유지정'),                                                      // L192
    iconCell<MyErrand>('edit', 'shareCell', 30, '', lookupShare),                               // L193
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [errandCodes, crud.rows]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L120) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={crud.loading}
          extra={
            <>
              {/* [E2] insertButton[등록].Select (L126) → insertRow() */}
              <Button type="register" onClick={() => crud.addRow()}>등록</Button>
              {/* [E3] cycleInsertButton[반복등록].Select (L132) → insertCycle() L250-258: Emp54_Edit_Errand.insert(→ retrieve()) */}
              <Button type="register" onClick={() => setCycleOpen(true)}>반복등록</Button>
              {/* [E4] updateButton[저장].Select (L138) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={deleteChk}>삭제</Button>
              <span style={{ color: '#527BB7', marginLeft: 8 }}>* 이익수령이 있는 경우 &apos;이익수령 제외 신청서&apos;를 상신하세요</span>
            </>
          }
        >
          <SearchBar.Field label="조회기간">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </span>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<MyErrand> crud={crud} columnDefs={columnDefs} getRowId={p => String(p.data.errandId)} />
        </div>
      </div>
      <Emp54_Edit_Errand open={cycleOpen} onDone={() => void retrieve()} onClose={() => setCycleOpen(false)} />
      <Emp56_Lookup_Share parentId={shareId} onResult={info => void onShareResult(info)} onClose={() => setShareId(null)} />
      <Dcr01_Lookup_Class
        open={classPick != null}
        onResult={r => { const row = classPick; setClassPick(null); if (row) setLink({ classTreeId: r.classTreeId, linkCode: LINK_CODE, refId: row.errandId }); }}
        onClose={() => setClassPick(null)}
      />
      {/* 상세보기 = retrieveApproval, 결재요청 = insertLinkApproval(classTreeModel, "A45", 외출 행, …) */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        statusCode={viewStatus}
        link={link}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLink(null); }}
      />
    </div>
  );
};
