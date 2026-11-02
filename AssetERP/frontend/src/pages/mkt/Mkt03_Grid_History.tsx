/**
 * 업무활동내역 목록 (Z05) — Mkt01_Tab_TargetCompany 아래 칸 (erpProductCode가 A1인 회사만)
 * AS-IS: myApp/client/vi/mkt/Mkt03_Grid_History.java (275줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-87: 위 툴바 50(▼ 업무활동내역 · 시작일 ~ 종료일 · 검색 250 "활동처/활동내용/작성자" · □전체활동처 조회 · [조회][등록][삭제]) + 체크 다중 그리드
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { mktHistoryApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MktHistory } from '@/types/mkt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_File } from '@/pages/sys/Sys10_Lookup_File';
import { Mkt03_Lookup_History, MktHistoryTarget } from './Mkt03_Lookup_History';

const gb = gbFor<MktHistory>();
const FORMAT = 'YYYY-MM-DD';

interface Props {
  /** setItemType(itemType) L89-91 — 위 목록의 활동처 구분 코드 (`%` 전체) */
  itemType: string;
  /** getTargetCompanyId() L199-205 — 위 목록에서 고른 활동처 (없으면 null) */
  target: { id: number; name: string } | null;
  /** 이 값이 바뀔 때마다 다시 읽는다 (AS-IS historyPage.retrieve() 호출) */
  nonce: number;
}

export const Mkt03_Grid_History: React.FC<Props> = ({ itemType, target, nonce }) => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<MktHistory>>(null);
  // setting() L93-132: 시작일 = 올해 1월 1일(LoginUser.getNewYearDay), 종료일 = 오늘, 검색 250, 전체활동처 조회 false
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [allYn, setAllYn] = useState(false);
  const [rows, setRows] = useState<MktHistory[]>([]);
  const [checked, setChecked] = useState<MktHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState<MktHistoryTarget | null>(null);
  const [fileParent, setFileParent] = useState<number | null>(null);

  // [E1] searchText.KeyPress [Enter] (L102), [E2] retrieveButton[조회].Select (L114) → retrieve() L177-197: mkt.Mkt03_History.selectByTargetCompanyId
  // [E0] 화면 열림 (생성자 L59-87) → setting() — 목록은 위 활동처를 고를 때(retrieveHistory) 읽는다
  const retrieve = useCallback(async () => {
    setRows([]);
    setLoading(true);
    try {
      setRows(await mktHistoryApi.search({
        itemType, targetCompanyId: target?.id ?? null, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT),
        allContactYn: allYn, searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [itemType, target, startDate, closeDate, allYn, searchText]);

  useEffect(() => {
    if (nonce > 0) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  // [E3] insertButton[등록].Select (L120) → insert() L207-221
  const insert = () => {
    if (target == null) { message.warning('상단의 활동처를 선택하세요'); return; }
    setLookup({ mode: 'new', targetCompanyId: target.id, targetCompanyName: target.name });
  };

  // [E4] deleteButton[삭제].Select (L126) → preDelete() L223-248 → [E6] messageBox.DialogHide [YES] (L239) → delete() L250-264: mkt.Mkt03_History.delete
  const preDelete = () => {
    if (checked.length === 0) { message.warning('삭제 대상을 선택하세요'); return; }
    if (checked.some(r => r.personId !== user.userId)) { message.warning('작성자가 본인이 아닌 활동내역은 삭제할 수 없습니다'); return; }
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 활동내역을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await mktHistoryApi.remove(checked.map(r => r.historyId));
          const ids = new Set(checked.map(r => r.historyId));
          setRows(prev => prev.filter(r => !ids.has(r.historyId)));
          setChecked([]);
          message.info('삭제가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // updateEnd() L515-520: grid.getStore().update(historyModel) — 새 행이면 맨 아래에 더한다(GridInsertRow)
  const onSaved = (saved: MktHistory) => setRows(prev => (prev.some(r => r.historyId === saved.historyId)
    ? prev.map(r => (r.historyId === saved.historyId ? saved : r))
    : [...prev, saved]));

  // buildGrid() L134-175 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    // [E5] editCell (ImageCell).callbackOnCreate (L150) → 내가 쓴 것은 edit(), 남이 쓴 것은 open()(보기)
    iconCell<MktHistory>('edit', 'editCell', 40, '수정', row => setLookup({ mode: row.personId === user.userId ? 'edit' : 'view', row })),  // L163
    gb.date('activityDate', 100, '활동일'),           // L164
    gb.text('targetCompanyName', 150, '활동처'),      // L165
    gb.text('activityTitle', 350, '활동내용'),        // L166
    gb.text('fundInfo', 250, '연결펀드'),             // L167
    gb.textCenter('fileCount', 70, '첨부파일'),       // L168
    iconCell<MktHistory>('view', 'viewCell', 35, ' ', row => setFileParent(row.historyId)),  // L169 viewCell → Sys10_Lookup_File.open(historyId)
    gb.date('regDate', 100, '작성일'),                // L170
    gb.text('personOrgName', 200, '작성자'),          // L171
    gb.text('shareInfo', 200, '공유'),                // L172
  ], [user.userId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SearchBar
        onSearch={retrieve}
        loading={loading}
        extra={
          <>
            <Button type="register" onClick={insert}>등록</Button>
            <Button type="delete" onClick={preDelete}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="▼ 업무활동내역">
          <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="활동처/활동내용/작성자" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={allYn} onChange={e => setAllYn(e.target.checked)}>전체활동처 조회</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
        <MultiGrid<MktHistory> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.historyId)} onCheckedChange={setChecked} />
      </div>
      <Mkt03_Lookup_History target={lookup} onSaved={onSaved} onClose={() => setLookup(null)} />
      <Sys10_Lookup_File parentId={fileParent} onClose={() => setFileParent(null)} />
    </div>
  );
};
