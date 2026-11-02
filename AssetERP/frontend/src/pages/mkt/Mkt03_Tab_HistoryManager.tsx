/**
 * [1408] 커뮤니티 > 03. 업무활동 > 업무활동등록(관리자) (Z06)
 * AS-IS: myApp/client/vi/mkt/Mkt03_Tab_HistoryManager.java (214줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L53-83: 가운데(여백 20, 테두리) = 툴바(활동기간 시작일 ~ 종료일 · 활동처(조회 트리거, 빈칸 "전체") · 검색 250 "활동처/활동내용/작성자" · [조회]) + 단일 선택 그리드(상세·첨부·공유 아이콘)
 * 함께: Mkt01_Lookup_TargetCompany2(활동처 선택). 재사용: Mkt03_Lookup_History(Z05)·Mkt05_Lookup_Share(Z05)·Sys10_Lookup_File
 * 스타일: SG (견본 docs/page-style/SG/Tdm01_Tab_Hr.tsx — 바깥 여백 20 · 안쪽 padding 10 · gap 8 · 테두리 없음)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { mktHistoryApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MktHistory, MktTargetItem } from '@/types/mkt';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_File } from '@/pages/sys/Sys10_Lookup_File';
import { Mkt01_Lookup_TargetCompany2 } from './Mkt01_Lookup_TargetCompany2';
import { Mkt03_Lookup_History, MktHistoryTarget } from './Mkt03_Lookup_History';
import { Mkt05_Lookup_Share } from './Mkt05_Lookup_Share';

const gb = gbFor<MktHistory>();
const FORMAT = 'YYYY-MM-DD';

export const Mkt03_Tab_HistoryManager: React.FC = () => {
  const user = useLoginUser();
  // setting() L85-132: 시작일 = 이번 달 1일(LoginUser.getMonthFirstDay), 종료일 = 오늘, 활동처 250 "전체", 검색 250
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [target, setTarget] = useState<{ id: number; name: string } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MktHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [history, setHistory] = useState<MktHistoryTarget | null>(null);
  const [fileParent, setFileParent] = useState<number | null>(null);
  const [shareParent, setShareParent] = useState<number | null>(null);

  // retrieve() L183-209: mkt.Mkt03_History.selectByTargetCompanyId (isManager true · 구분 전체 · 활동처 없으면 allContactYn)
  const retrieve = async () => {
    setRows([]);
    setLoading(true);
    try {
      setRows(await mktHistoryApi.searchManage({
        targetCompanyId: target?.id ?? null, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L53-83) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] targetCompany.TriggerClick [result != null] (L95) — Mkt01_Lookup_TargetCompany2: 확인 = 고른 활동처, 전체 = 비움
  const onTargetResult = (row: MktTargetItem | null) => setTarget(row ? { id: row.targetCompanyId, name: row.targetCompanyName } : null);

  // updateEnd — 편집창에서 저장한 활동내역으로 그 행만 바꾼다 (grid.getStore().update)
  const onSaved = (saved: MktHistory) => setRows(prev => prev.map(r => (r.historyId === saved.historyId ? saved : r)));

  // buildGrid() L134-181
  const columnDefs = useMemo(() => [
    // L168 addCell(viewCell) → Mkt03_Lookup_History.open(선택 행, null): 내가 쓴 것은 수정, 남이 쓴 것은 보기
    iconCell<MktHistory>('view', 'viewCell', 40, '상세', row => setHistory({ mode: row.personId === user.userId ? 'edit' : 'view', row })),
    gb.date('activityDate', 100, '활동일'),           // L169
    gb.text('targetCompanyName', 150, '활동처'),      // L170
    gb.text('activityTitle', 350, '활동내용'),        // L171
    gb.text('fundInfo', 250, '연결펀드'),             // L172
    gb.textCenter('fileCount', 70, '첨부파일'),       // L173
    iconCell<MktHistory>('view', 'fileCell', 35, ' ', row => setFileParent(row.historyId)),   // L174 fileCell → Sys10_Lookup_File.open(historyId)
    gb.date('regDate', 100, '작성일'),                // L175
    gb.text('personOrgName', 200, '작성자'),          // L176
    gb.text('shareInfo', 200, '공유'),                // L177
    iconCell<MktHistory>('edit', 'shareCell', 35, ' ', row => setShareParent(row.historyId)), // L178 shareCell → Mkt05_Lookup_Share.open(historyId)
  ], [user.userId]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] searchText.KeyPress [Enter] (L117), [E3] retrieveButton[조회].Select (L126) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="활동기간">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="활동처">
            <LookupInput width={250} value={target?.name ?? ''} placeholder="전체" onOpen={() => setLookupOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="활동처/활동내용/작성자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<MktHistory> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.historyId)} />
        </div>
      </div>
      <Mkt01_Lookup_TargetCompany2 open={lookupOpen} onResult={onTargetResult} onClose={() => setLookupOpen(false)} />
      <Mkt03_Lookup_History target={history} onSaved={onSaved} onClose={() => setHistory(null)} />
      <Sys10_Lookup_File parentId={fileParent} onClose={() => setFileParent(null)} />
      {/* shareCell: 저장하면 공유 요약을 그 행에 반영 (grid.getStore().update) */}
      <Mkt05_Lookup_Share
        parentId={shareParent}
        onResult={info => setRows(prev => prev.map(r => (r.historyId === shareParent ? { ...r, shareInfo: info } : r)))}
        onClose={() => setShareParent(null)}
      />
    </div>
  );
};
