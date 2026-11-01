/**
 * [1170] 고유자산 > 30. 고유자산 현황 > PC장비상세 (W19)
 * AS-IS: myApp/client/vi/bmt/Bmt12_Tab_PcList.java (221줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L50-77: 가운데(여백 20) = 툴바 50(기준일자 100 · 검색어 300 "사원명/내부IP/Mac주소/종목명/기타사항" · [조회][등록][삭제]) + 그리드(SingleGrid, 행번호)
 *   그리드 L137-147: 사원명 100 · 시작(사용)일자 100 · 내부IP 150 · Mac주소 200 · PC명 250 · 기타사항 400(줄바꿈) · History 60(아이콘)
 * 하위 창(W18 재사용): 등록 Bmt12_Edit_PcHistory.insert(callback) / History 아이콘 Bmt10_Lookup_History
 * 스타일: SGP (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조건이 2개라 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { bmtPcHistoryApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtPcList } from '@/types/bmt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Bmt10_Lookup_History, BmtHistoryTarget } from './Bmt10_Lookup_History';
import { Bmt12_Edit_PcHistory, BmtPcHistoryEditTarget } from './Bmt12_Edit_PcHistory';

const gb = gbFor<BmtPcList>();
const DATE = 'YYYY-MM-DD';

export const Bmt12_Tab_PcList: React.FC = () => {
  const gridRef = useRef<AgGridReact<BmtPcList>>(null);
  // settings() L79-112: 기준일자 = 오늘, 검색어 빈칸
  const [baseDate, setBaseDate] = useState(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BmtPcList[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BmtPcHistoryEditTarget | null>(null);
  const [historyTarget, setHistoryTarget] = useState<BmtHistoryTarget | null>(null);

  // retrieve() L149-170: bmt.Bmt12_PcHistory.selectByCompanyId(companyId는 서버, baseDate, searchText = "%" + 글자 + "%" — 서버가 감싼다)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await bmtPcHistoryApi.searchList(baseDate.format(DATE), searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [baseDate, searchText]);

  // [E0] 화면 열림 (생성자 L50-77) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E3] insertButton[등록].Select (L100) → insert() L172-180: Bmt12_Edit_PcHistory.insert(callback → retrieve())
  const insert = () => setEditTarget({ mode: 'insert', infoId: null, astClassTreeName: null });

  // [E4] deleteButton[삭제].Select (L106) → deleteCheck() L182-201: 확인(400) "해당 PC정보를 삭제하시겠습니까?"
  //   → [E6] msgBox.DialogHide [YES] (L185) → delete() L203-216: bmt.Bmt12_PcHistory.deleteByInfoId(고른 행의 infoId — 그 장비의 이력 전부) → retrieve()
  const deleteCheck = () => {
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    Modal.confirm({
      title: '확인',
      content: '해당 PC정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        if (!sel) return;  // 원본은 고른 행이 없으면 NullPointerException으로 아무 일도 안 한다
        try {
          await bmtPcHistoryApi.removeByInfo(sel.infoId);
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L112-147
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 100, '사원명'),  // L138
    gb.date('startDate', 100, '시작(사용)일자'),  // L139
    gb.text('internalIp', 150, '내부IP'),  // L140
    gb.text('macAddress', 200, 'Mac주소'),  // L141
    gb.text('astClassTreeName', 250, 'PC명'),  // L142
    gb.textArea('etc', 400, '기타사항'),  // L143
    // [E5] historyCell (ImageCell "Detail").callbackOnCreate (L128) → Bmt10_Lookup_History.open(infoId, PC명, callback → retrieve())
    iconCell<BmtPcList>('view', 'historyAction', 60, 'History', row => setHistoryTarget({ infoId: row.infoId, astClassTreeName: row.astClassTreeName })),  // L144
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L94) → retrieve(), [E1] searchText.KeyPress [Enter] (L85) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={loading}
        extra={(
          <>
            <Button type="register" onClick={insert}>등록</Button>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
          </>
        )}
      >
        <SearchBar.Field label="기준일자">
          <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} onChange={d => d && setBaseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색어">
          <SearchBar.Input style={{ width: 300 }} placeholder="사원명/내부IP/Mac주소/종목명/기타사항" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BmtPcList> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.pcHistoryId)} />
      </div>
      <Bmt12_Edit_PcHistory target={editTarget} onClose={() => setEditTarget(null)} onDone={() => void retrieve()} />
      <Bmt10_Lookup_History target={historyTarget} onClosed={() => void retrieve()} onClose={() => setHistoryTarget(null)} />
    </div>
  );
};
