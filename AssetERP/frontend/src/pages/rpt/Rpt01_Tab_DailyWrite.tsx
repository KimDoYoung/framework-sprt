/**
 * [1236] 커뮤니티 > 04. 업무보고 > 일일업무 입력 (Z08)
 * AS-IS: myApp/client/vi/rpt/Rpt01_Tab_DailyWrite.java (223줄) + Rpt01_Edit_DailyWrite (176줄, 등록/수정 창) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L54-84: north = 툴바 50(조회기간 ~ · 검색 250 "업무내용/비고" · [조회][등록][삭제]), center = 일일업무 그리드(행번호, 체크박스 다중)
 * 스타일: SGP (견본 — docs/page-style/SGP/Chk02_Tab_DailyList.tsx, 편집 팝업 Rpt01_Edit_DailyWrite)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { rptDailyApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptDaily } from '@/types/rpt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Rpt01_Edit_DailyWrite, RptDailyEdit } from './Rpt01_Edit_DailyWrite';

const gb = gbFor<RptDaily>();
const DATE = 'YYYY-MM-DD';

export const Rpt01_Tab_DailyWrite: React.FC = () => {
  const gridRef = useRef<AgGridReact<RptDaily>>(null);
  const [rows, setRows] = useState<RptDaily[]>([]);
  const [editTarget, setEditTarget] = useState<RptDailyEdit | null>(null);

  // settings() L86-144: 조회기간 = 이번 달 1일 ~ 그 달 말일, 검색어 빈칸("업무내용/비고")
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('month'), closeDate: dayjs().endOf('month'), searchText: '' }));
  const { startDate, closeDate, searchText } = sp.values;

  // retrieve() L176-191: 서비스 rpt.Rpt01_Daily.selectByText(companyId·personId(서버), startDate, closeDate, "%검색어%")
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      setRows(await rptDailyApi.search(v.startDate.format(DATE), v.closeDate.format(DATE), v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // [E0] 화면 열림 (생성자 L54-84) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E3] insertButton[등록].Select (L115) → insertRow() L193-201: Rpt01_Edit_DailyWrite.insert(): 일자 오늘 · 저장하면 retrieve()
  const insertRow = () => setEditTarget({ date: dayjs().format(DATE) });

  // [E4] deleteButton[삭제].Select [YES] (L121) → "n건의 내용을 삭제하시겠습니까?"(제목 "확인", 폭 310)
  //   → [E5] msgBox.DialogHide [YES] (L126) → deleteRow() L203-218: 선택 없으면 "대상을 먼저 선택해주세요", 확인처리된 행이 있으면 "이미 확인처리된 업무가 있습니다."
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 내용을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 310,
      onOk: async () => {
        const sel = gridRef.current?.api?.getSelectedRows() ?? [];
        if (sel.length === 0) { message.warning('대상을 먼저 선택해주세요'); return; }
        if (sel.some(r => r.confirmYn === true)) { message.warning('이미 확인처리된 업무가 있습니다.'); return; }
        try {
          await rptDailyApi.delete(sel.map(r => r.dailyId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L146-174
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자'),  // L166
    gb.textArea('content', 610, '업무내용(공개)'),  // L167 addTextLimitArea
    gb.textArea('note', 550, '비고(비공개)'),  // L168 addTextLimitArea
    // [E6] editCell (ImageCell "Edit").callbackOnCreate (L153) → Rpt01_Edit_DailyWrite.edit(선택 행, callback → retrieve())
    iconCell<RptDaily>('edit', 'actionCell', 80, '수정', row => setEditTarget(row)),  // L169
    gb.textCenter('confirmYnName', 80, '확인여부'),  // L170
    gb.textCenter('confirmName', 100, '확인자'),  // L171
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L109) → retrieve(), [E1] searchText.KeyPress [Enter] (L101) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="업무내용/비고" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<RptDaily>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.dailyId)}
        />
      </div>
      <Rpt01_Edit_DailyWrite model={editTarget} onClose={() => setEditTarget(null)} onDone={() => { void retrieve(); }} />
    </div>
  );
};
