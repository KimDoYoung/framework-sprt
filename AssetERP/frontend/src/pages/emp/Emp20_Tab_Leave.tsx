/**
 * [1032] 신청 > 01. 외출/출장/휴가 > 휴가신청 (Y01)
 * AS-IS: myApp/client/vi/emp/Emp20_Tab_Leave.java (567줄) + Emp20_Edit_Leave.java (935줄, 아래 편집 폼) + components/lookup/Emp22_Lookup_EtcLeave·Emp00_Lookup_SelectSingle
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L91-163, 스타일 SGEF 견본 Fnd01_Tab_FundCode): 위(여백 20·20·0·20) = 툴바(기준연도 · [조회][등록][등록(복사)][삭제]) + 휴가 그리드(체크 단일, 11열) + 요약 두 줄
 *   (연차휴가 총/사용/잔여/기간 · 포상휴가 총/사용/잔여 + 안내 아이콘) / 아래(260) = 편집 폼(Emp20_Edit_Leave)
 * 결재창 A01(휴가) 연결은 편집 폼의 [상신하기]가 한다 — 제공자는 기존 HrLinkSeedProvider.leave
 * 다음 단계: 편집 폼의 [대결자 지정](Apr07_Lookup_AltAppr)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, Splitter, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empLeaveApi, empMyLeaveApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { MyLeave } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Emp20_Edit_Leave } from './Emp20_Edit_Leave';
import { Emp22_Lookup_EtcLeave } from './Emp22_Lookup_EtcLeave';

const gb = gbFor<MyLeave>();
const FORMAT = 'YYYY-MM-DD';

/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
/** buildGrid() L300 addDynamicCell(apprStatusCode, …, {"10","20","30","40","99"}) — 이 상태일 때만 상세보기 아이콘 */
const VIEW_STATUS = new Set(['10', '20', '30', '40', '99']);

/** 요약 칸 (읽기 전용 TextField) */
const SummaryBox: React.FC<{ value: string; width: number }> = ({ value, width }) => (
  <Input readOnly size="small" value={value} style={{ width, textAlign: 'center' }} />
);
const Sep: React.FC<{ text?: string }> = ({ text = ' / ' }) => <span style={{ whiteSpace: 'pre' }}>{text}</span>;
const Lbl: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ whiteSpace: 'nowrap' }}>{children}</b>;

const EMPTY_SUMMARY = { total01: '', pyRemain: '', use01: '', remain01: '', stdPeriod: '', total02: '', use02: '', remain02: '' };
const str = (v: number | string | null | undefined) => (v == null ? '' : String(v));

export const Emp20_Tab_Leave: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<MyLeave>>(null);
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [rows, setRows] = useState<MyLeave[]>([]);
  const [selected, setSelected] = useState<MyLeave | null>(null);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [etcOpen, setEtcOpen] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [viewStatus, setViewStatus] = useState<string | null>(null);
  const [delAlt, setDelAlt] = useState<MyLeave | null>(null);   // deleteChk(): 대결자 지정 내역도 함께 삭제할지 묻는 창
  const remainRef = useRef<number | null>(null);               // TempData.setLeaveCount
  const mobileRef = useRef<string | null>(null);
  const pendingSelect = useRef<number | null>(null);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);
  const [overVisible, setOverVisible] = useState(false);

  // settings() L193-251: 결산월 '03'이면 3월까지는 전년이 기준연도, 초과휴가 허용 & 승인 후 사용이면 승인상태·승인자 열(11·12)을 보인다
  useEffect(() => {
    empLeaveApi.getOption().then(o => {
      setOverVisible(o.leaveYn && o.leaveConfirmYn);
      const now = dayjs();
      const y = o.leaveMonthCode === '03' && now.month() + 1 <= 3 ? String(now.year() - 1) : String(now.year());
      setYear(y);
      void retrieve(y);
    }).catch(() => void retrieve(year));
    empMyLeaveApi.getCodes().then(c => { mobileRef.current = c.mobileTelNo; }).catch(() => undefined);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // checkRemainDay() L340-402: emp.Emp20_Leave.selectByDays + emp.Emp22_EtcLeave.selectByDays(apprCheckYn=false) → 요약 칸, 남은 연차 일수를 기억한다(TempData)
  const checkRemainDay = useCallback(async (y = year): Promise<number | null> => {
    try {
      const d = await empMyLeaveApi.getDays(y);
      if (!d) return remainRef.current;
      setSummary({
        total01: str(d.totalDays), pyRemain: str(d.pyRemainMonthDays), use01: str(d.useDays), remain01: str(d.remainDays), stdPeriod: str(d.stdPeriod),
        total02: d.etcTotalDays != null ? str(d.etcTotalDays) : '', use02: d.etcUseDays != null ? str(d.etcUseDays) : '', remain02: d.etcRemainDays != null ? str(d.etcRemainDays) : '',
      });
      remainRef.current = d.remainDays ?? null;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    return remainRef.current;
  }, [year]);

  // insertRow() L410-427 (03 원칙 17: 맨 아래에 넣고 보여 준다)
  const insertRow = useCallback(() => {
    const today = dayjs().format(FORMAT);
    const row: MyLeave = {
      leaveId: --tempId.current, personId: user.userId, leaveCode: '01', leaveName: '연차휴가', spcLeaveCode: null, spcLeaveName: null, etcLeaveId: null,
      regDate: today, startDate: today, closeDate: null, leaveCount: null, reason: null, managerName: null, emergencyTelno: mobileRef.current,
      note: null, apprId: null, apprStatusCode: null, apprStatusName: null, classTreeId: null, classTreeFullName: null, altPersonName: null, cancel: null,
      overConfirmStatusCode: null, overConfirmStatusName: null, overConfirmerName: null, overConfirmDateStr: null,
    };
    pendingSelect.current = row.leaveId;
    setRows(prev => [...prev, row]);
  }, [user.userId]);

  // [E0] 화면 열림 → retrieve() / [E3] leaveYText.KeyPress [Enter] (L211)·[E4] retrieveButton[조회].Select (L219) → retrieve() L314-338
  const retrieve = useCallback(async (y = year) => {
    const my = ++retrieveSeq.current;
    setLoading(true);   // grid.mask("Loading")
    try {
      const list = await empMyLeaveApi.search(y);
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(list);
      await checkRemainDay(y);
      if (list.length === 0) { setSelected(null); insertRow(); }   // 행이 없으면 새 행을 만든다
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, [year, checkRemainDay, insertRow]);

  // [E6] copyButton[등록(복사)].Select (L231) → copyInsertRow() L429-457
  const copyInsertRow = () => {
    const src = gridRef.current?.api?.getSelectedRows()[0];
    if (!src) { message.warning('복사할 대상을 선택해주세요.'); return; }
    const row: MyLeave = {
      leaveId: --tempId.current, personId: user.userId, leaveCode: src.leaveCode, leaveName: src.leaveName, spcLeaveCode: null, spcLeaveName: null, etcLeaveId: null,
      regDate: dayjs().format(FORMAT), startDate: src.startDate, closeDate: src.closeDate, leaveCount: null, reason: src.reason, managerName: src.managerName,
      emergencyTelno: mobileRef.current, note: src.note, apprId: null, apprStatusCode: null, apprStatusName: null, classTreeId: null, classTreeFullName: null,
      altPersonName: null, cancel: null, overConfirmStatusCode: null, overConfirmStatusName: null, overConfirmerName: null, overConfirmDateStr: null,
    };
    pendingSelect.current = row.leaveId;
    setRows(prev => [...prev, row]);
  };

  // [E7] deleteButton[삭제].Select (L237) → deleteRow() L460-486
  const deleteRow = () => {
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) { message.warning('문서를 선택해주세요'); return; }
    if (!(sel.apprStatusCode == null || ['00', '40', '99'].includes(sel.apprStatusCode))) { message.warning('해당 문서는 삭제가 불가능합니다'); return; }
    Modal.confirm({
      title: '삭제', content: '선택한 내용을 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 300,
      onOk: () => void deleteChk(sel),   // [E9] messageBox.DialogHide [YES] (L472) → deleteChk()
    });
  };

  // deleteChk() L488-523: apr.Apr07_AltAppr.selectByLeaveId — 대결자 지정 내역이 있으면 함께 지울지 묻는다 (YES: 대결자까지, NO: 휴가만, 닫기: 아무것도 안 함)
  const deleteChk = async (sel: MyLeave) => {
    if (sel.leaveId <= 0) { deleteSelectedRow(sel, false); return; }
    try {
      if (await empMyLeaveApi.hasAltAppr(sel.leaveId)) setDelAlt(sel);
      else deleteSelectedRow(sel, false);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // deleteAltAppr() L525-536 · deleteSelectedRow() L538-554: emp.Emp20_Leave.delete 뒤 폼을 비우고 첫 행을 고른다
  const deleteSelectedRow = async (sel: MyLeave, deleteAltAppr: boolean) => {
    try {
      if (sel.leaveId > 0) await empMyLeaveApi.delete([sel.leaveId], deleteAltAppr);
      pendingSelect.current = null;
      setRows(prev => prev.filter(r => r.leaveId !== sel.leaveId));
      setSelected(null);
      if (sel.leaveId > 0) void checkRemainDay();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E2] grid.RowClick (L157) → retrieveEditPage() L308-311 (SelectionChanged로 같게 한다)
  const retrieveEditPage = () => setSelected(gridRef.current?.api?.getSelectedRows()[0] ?? null);

  // Emp20_Edit_Leave 저장·승인요청 결과 행으로 목록을 바꾼다 (GridUpdate.update(store, …))
  const onSaved = (oldId: number, saved: MyLeave) => {
    pendingSelect.current = saved.leaveId;
    setRows(prev => prev.map(r => (r.leaveId === oldId ? saved : r)));
  };

  // buildGrid() L254-306 (setChecked SINGLE, 읽기 전용)
  const columnDefs = useMemo(() => [
    gb.date('startDate', 100, '시작일'),   // L293
    gb.date('closeDate', 100, '종료일'),   // L294
    gb.text('leaveName', 100, '휴가구분'),   // L295
    gb.doubleCenter('leaveCount', 60, '기간'),   // L296
    gb.text('managerName', 360, '대직자'),   // L297
    gb.text('note', 360, '비고'),   // L298
    gb.textCenter('apprStatusName', 80, '문서상태'),   // L299
    // [E8] actionCell (ImageCell).callbackOnCreate (L275) → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …)
    {
      ...iconCell<MyLeave>('view', 'apprView', 35, '', row => { setViewStatus(row.apprStatusCode); setViewApprId(row.apprId); }),   // L300
      cellRendererSelector: (p: { data?: MyLeave }) => (p.data?.apprStatusCode != null && VIEW_STATUS.has(p.data.apprStatusCode) ? undefined : { component: () => null }),
    },
    gb.textCenter('cancel', 70, '취소여부'),   // L301
    // headerGroupMap(0, 11, "초과휴가", 1, 2) L290: 승인상태·승인자 — 초과휴가 허용 & 승인 후 사용일 때만 보인다
    gb.group('초과휴가', [
      gb.textCenter('overConfirmStatusName', 70, '승인상태', { hide: !overVisible }),   // L302
      gb.textCenter('overConfirmerName', 100, '승인자', { hide: !overVisible }),   // L303
    ]),
  ], [overVisible]);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={200} max={1000}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  {/* [E5] insertButton[등록].Select (L225) → insertRow() */}
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
                  <Button type="delete" onClick={deleteRow}>삭제</Button>
                </>}
              >
                <SearchBar.Field label="기준연도">
                  <SearchBar.Input style={{ width: 80 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<MyLeave>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.leaveId)}
                  loading={loading}
                  rowSelection={ROW_SELECTION}
                  onRowDataUpdated={e => {
                    // 조회·등록·저장 뒤 고를 행(없으면 첫 행)을 고르고 보여 준다
                    const node = pendingSelect.current != null ? e.api.getRowNode(String(pendingSelect.current)) : e.api.getDisplayedRowAtIndex(0);
                    pendingSelect.current = null;
                    if (node) {
                      node.setSelected(true);
                      if (node.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                    }
                  }}
                  onSelectionChanged={retrieveEditPage}
                />
              </div>
              {/* centerButtonBar01 L120·L124-137 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', padding: '8px 0 0 5px' }}>
                <Lbl>연차휴가 총 일수</Lbl><SummaryBox value={summary.total01} width={50} />
                <Sep text=" + " /><SummaryBox value={summary.pyRemain} width={50} />
                <span style={{ color: '#4472C4', whiteSpace: 'nowrap' }}>(전년도 미사용 월차)</span>
                <Sep /><Lbl>연차휴가 사용 일수</Lbl><SummaryBox value={summary.use01} width={50} />
                <Sep /><Lbl>연차휴가 잔여 일수</Lbl><SummaryBox value={summary.remain01} width={50} />
                <Sep /><Lbl>휴가사용기간</Lbl><SummaryBox value={summary.stdPeriod} width={180} />
              </div>
              {/* centerButtonBar02 L121·L139-149 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', padding: '8px 0 8px 5px' }}>
                <Lbl>포상휴가 총 일수</Lbl><SummaryBox value={summary.total02} width={50} />
                <Sep /><Lbl>포상휴가 사용 일수</Lbl><SummaryBox value={summary.use02} width={50} />
                <Sep /><Lbl>포상휴가 잔여 일수</Lbl><SummaryBox value={summary.remain02} width={50} />
                <span style={{ color: '#4472C4', whiteSpace: 'nowrap', marginLeft: 6 }}>※ 사용만료기간의 차이로 잔여 일수가 일치하지 않을 수 있습니다. 자세한 내용은 우측 아이콘을 통해 확인해주세요.</span>
                {/* [E1] helpAnchor.MouseDown (L96) → Emp22_Lookup_EtcLeave.view(LoginUser.getUserId()) */}
                <InfoCircleOutlined style={{ color: '#4472C4', cursor: 'pointer', fontSize: 16 }} onMouseDown={() => setEtcOpen(true)} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={330} min={330} max={900}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Emp20_Edit_Leave
              model={selected}
              refreshDays={() => checkRemainDay()}
              getRemain={() => remainRef.current}
              onSaved={onSaved}
              onRetrieve={() => void retrieve()}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Emp22_Lookup_EtcLeave personId={etcOpen ? user.userId : null} onClose={() => setEtcOpen(false)} />
      {/* deleteChk() L499: 대결자 지정 내역도 함께 삭제하시겠습니까? — YES = deleteAltAppr, NO = deleteSelectedRow, 닫기 = 아무것도 안 함 */}
      <Modal
        open={delAlt != null}
        title="확인"
        width={300}
        maskClosable={false}
        onCancel={() => setDelAlt(null)}
        footer={<div style={{ textAlign: 'center' }}>
          <Button type="select" onClick={() => { const s = delAlt; setDelAlt(null); if (s) void deleteSelectedRow(s, true); }}>예</Button>
          <Button type="close" onClick={() => { const s = delAlt; setDelAlt(null); if (s) void deleteSelectedRow(s, false); }}>아니오</Button>
        </div>}
      >
        대결자 지정 내역도 함께 삭제하시겠습니까?
      </Modal>
      <Apr01_Edit_ApprDoc apprId={viewApprId} statusCode={viewStatus} onClose={() => setViewApprId(null)} />
    </div>
  );
};
