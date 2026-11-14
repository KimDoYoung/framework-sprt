/**
 * [1363] 신청 > 90. 기타신청 > 화환 신청 (Y12)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Tab_FloralRequest.java (295줄) + Bbs20_Edit_FloralRequest (762줄, 등록·수정·보기) + Bbs20_Lookup_OccasionsOption (176줄) + Mkt01_Lookup_Select (240줄, 1단계)
 *   + Bbs21_Lookup_FloralRequestShare (317줄) + Bbs20_Lookup_Message (196줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L63-97: 툴바(조회기간 ~ · 검색 200 "신청자/거래처/거래처담당자" · ☑미완료건만 보기 · [조회][등록][삭제]) + 신청 그리드(체크 단일, 15열, 받는 사람 묶음 머리)
 * 스타일: SGP (견본 Chk02_Tab_DailyList: 조회 툴바 + 그리드 하나 + 편집 팝업)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { GridApi } from 'ag-grid-community';
import { bbsFloralApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsFloralRequest } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Bbs20_Edit_FloralRequest, FloralEditTarget } from './Bbs20_Edit_FloralRequest';
import { Bbs20_Lookup_Message } from './Bbs20_Lookup_Message';
import { Bbs21_Lookup_FloralRequestShare } from './Bbs21_Lookup_FloralRequestShare';

const gb = gbFor<BbsFloralRequest>();
const DATE = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다. 행 클릭은 선택을 바꾸지 않는다(삭제 대상, 03 원칙 16) */
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

export const Bbs20_Tab_FloralRequest: React.FC = () => {
  const user = useLoginUser();
  // settings() L99-158: 조회기간 = 올해 1월 1일 ~ 오늘, ☑미완료건만 보기, 검색칸 빈칸(신청자/거래처/거래처담당자)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [confirmYn, setConfirmYn] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsFloralRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<FloralEditTarget | null>(null);
  const [shareId, setShareId] = useState<number | null>(null);
  const [messageModel, setMessageModel] = useState<BbsFloralRequest | null>(null);
  const gridApi = useRef<GridApi<BbsFloralRequest> | null>(null);

  // retrieve() L266-282: bbs.Bbs20_FloralRequest.selectByText(companyId, personId, startDate, closeDate, "%검색어%", confirmYn)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await bbsFloralApi.searchMine(startDate.format(DATE), closeDate.format(DATE), searchText, confirmYn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L63-97) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] insertButton[등록].Select (L122) → Bbs20_Edit_FloralRequest.insert(true, callback → retrieve())
  const insert = () => setEditTarget({ mode: 'NEW', model: null });

  // [E4] deleteButton[삭제].Select (L134) → deleteRow() L226-264 → [E7] msgBox.DialogHide [YES] (L246) → bbs.Bbs20_FloralRequest.delete(체크한 행)
  const deleteRow = () => {
    const selected = gridApi.current?.getSelectedRows() ?? [];
    for (const m of selected) {
      if (m.endDate != null) { message.warning('완료처리된 신청내역은 삭제가 불가능합니다.'); return; }
      if (m.statusName != null && m.statusCode !== '10') { message.warning('접수 또는 발송완료된 신청내역은 삭제가 불가능합니다.'); return; }
      if (m.personId !== user.userId) { message.warning('본인의 신청내역만 삭제 가능합니다.'); return; }
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 신청내역을 삭제하시겠습니까?',
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await bbsFloralApi.deleteRequests(selected.map(r => r.floralRequestId));
          message.success('삭제가 완료되었습니다.');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L160-219
  const columnDefs = useMemo(() => [
    // L194 editCell → [E6] editCell (ImageCell).callbackOnCreate (L167) → Bbs20_Edit_FloralRequest.edit(false, 선택한 행, callback → retrieve()) — 본인이 아니거나 신청상태가 10이 아니면 창이 보기 모드로 연다
    iconCell<BbsFloralRequest>('edit', 'editCell', 40, '수정', row => setEditTarget({ mode: 'EDIT', model: row })),
    gb.date('regDate', 90, '신청일'),  // L190
    gb.text('personInfo', 130, '신청자'),  // L191
    gb.textCenter('occasionsName', 80, '경조구분'),  // L192
    gb.text('reason', 200, '신청사유'),  // L193
    gb.text('sendEmp', 150, '보내는 사람'),  // L194
    gb.group('받는 사람', [  // L186 addHeaderGroupMap(HeaderGroupConfig "받는 사람", 1, 2)
      gb.text('rcvCompany', 150, '회사명'),  // L198
      gb.text('rcvInfo', 150, '담당자'),  // L199 — SQL에 없는 열이라 원본도 늘 빈칸
    ]),
    gb.date('sendRequestDate', 90, '발송요청일'),  // L203
    gb.text('shareInfo', 120, '신청공유'),  // L204
    // L205 editCell2 → Bbs21_Lookup_FloralRequestShare.open(신청ID, callback → retrieve())
    iconCell<BbsFloralRequest>('edit', 'editCell2', 40, ' ', row => setShareId(row.floralRequestId)),
    gb.textCenter('statusName', 80, '신청상태'),  // L206
    gb.date('endDate', 90, '완료일'),  // L207
    // L208 sendCell → sendMessage() L221-224: Bbs20_Lookup_Message.open("01", 선택한 행)
    iconCell<BbsFloralRequest>('send', 'sendCell', 50, '문자발송', row => setMessageModel(row)),
  ], []);

  // [E5] grid.CellClick (L140): 신청상태 칸(13번째)을 눌렀을 때 상태가 95(반려)면 반려사유를 보여 준다. 사유가 없으면 "반려사유가 존재하지 않습니다"
  const onCellClicked = (e: { colDef: { colId?: string }; data?: BbsFloralRequest }) => {
    if (e.colDef.colId !== 'statusName' || !e.data) return;
    if (e.data.statusCode === '95') {
      if (e.data.rejectReason == null) { message.warning('반려사유가 존재하지 않습니다'); return; }
      Modal.info({ title: '반려사유', content: <div style={{ whiteSpace: 'pre-wrap' }}>{e.data.rejectReason}</div>, okText: '확인', width: 450 });
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E1] searchText.KeyPress [Enter] (L108), [E2] retrieveButton[조회].Select (L116) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={loading}
        extra={
          <>
            <Button type="register" onClick={insert}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="신청자/거래처/거래처담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={confirmYn} onChange={e => setConfirmYn(e.target.checked)}>미완료건만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BbsFloralRequest>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.floralRequestId)}
          loading={loading}
          rowSelection={SINGLE_CHECKED}
          onGridReady={e => { gridApi.current = e.api; }}
          onCellClicked={onCellClicked}
        />
      </div>
      <Bbs20_Edit_FloralRequest target={editTarget} onSaved={() => void retrieve()} onClose={() => setEditTarget(null)} />
      <Bbs21_Lookup_FloralRequestShare floralRequestId={shareId} onResult={() => { void retrieve(); }} onClose={() => setShareId(null)} />
      <Bbs20_Lookup_Message target={messageModel ? { option: '01', model: messageModel } : null} onClose={() => setMessageModel(null)} />
    </div>
  );
};
