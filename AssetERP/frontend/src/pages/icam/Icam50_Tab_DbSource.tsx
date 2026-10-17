/**
 * [1269] I/F > 10. ICAM > ICAM DB Source Get (D09)
 * AS-IS: myApp/client/vi/icam/Icam50_Tab_DbSource.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-103: 위 = 툴바(기준일자 · 서버 · 소스 · 검색(소스명, 소스내용) · 조회 · ICAM DB소스 가져오기), 아래 = 그리드(행번호, 체크박스 없음, 8열) + 페이징 툴바(300)
 * UX보강(10): 툴바 = SearchBar(UX-01). 원본에 초기화 버튼이 없고 툴바가 이미 길어 onReset(UX-02)은 넣지 않는다
 * 버튼 type: 조회 `search`, ICAM DB소스 가져오기 = `download`(D07·D08과 같음).
 * 가져오기(Icam50_Source.insertIcamDbSource)는 외부 ICAM DB를 읽는 작업이라 서버가 거절한다 — 작업기록 의존
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamSource } from '@/types/icam';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Icam50_Lookup_Source } from './Icam50_Lookup_Source';

const LIMIT = 300;   // gridToolBar.setToolBar(300)
const FORMAT = 'YYYY-MM-DD';
const SERVER_TYPES = ['전체', '운용서버', '자문서버'];
const SOURCE_TYPES = ['전체', 'PROCEDURE', 'FUNCTION', 'TRIGGER'];
const gb = gbFor<IcamSource>();

interface Condition {
  stdDate: string;
  serverType: string;
  sourceType: string;
  nameSearchText: string;
  sourceSearchText: string;
}

// [E0] 화면 열림 (생성자 L62-103) → setting() L105-182: 기준일자 오늘, 서버·소스 "전체", 검색칸 빈칸 글자 "소스명"·"소스내용". 열 때 gridToolBar.toolBar.refresh()
export const Icam50_Tab_DbSource: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcamSource>>(null);
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [serverType, setServerType] = useState('전체');
  const [sourceType, setSourceType] = useState('전체');
  const [nameSearchText, setNameSearchText] = useState('');
  const [sourceSearchText, setSourceSearchText] = useState('');
  const [rows, setRows] = useState<IcamSource[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewText, setViewText] = useState<string | null>(null);
  /** 조회한 때의 조건 — 페이지를 넘길 때 같은 조건으로 (gridToolBar.addParam) */
  const cond = useRef<Condition | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L236-238) */
  const selectFirst = useRef(false);

  /** AS-IS buildGrid() L184-207 */
  const columnDefs = useMemo(() => [
    gb.date('stdDate', 100, '기준일'),
    gb.textCenter('serverType', 100, '서버'),
    gb.textCenter('owner', 100, 'OWNER'),
    gb.textCenter('type', 120, '구분'),
    gb.text('name', 300, '소스명'),
    // actionCell: ImageCell("보기") → viewSource() L261-264
    iconCell<IcamSource>('view', 'actionCell', 50, '', row => setViewText(row.text ?? '')),
    gb.longCenter('lineCnt', 100, '라인수'),
    gb.textCenter('workDateString', 170, '작업일시'),
  ], []);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    const c = cond.current;
    if (!c) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icamApi.searchSources({ ...c, offset: (p - 1) * LIMIT, limit: LIMIT });
      selectFirst.current = true;
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // [E1] nameSearchField.KeyPress [Enter] (L134)·[E2] sourceSearchField.KeyPress [Enter] (L144)·[E3] retrieveButton[조회].Select (L153) → retrieve() L209-242
  // 서버·소스가 "전체"면 "%", 검색어는 "%text%"(서버가 만든다) → 1페이지부터 조회, 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    cond.current = { stdDate: stdDate.format(FORMAT), serverType, sourceType, nameSearchText, sourceSearchText };
    await getPaging(1);
  }, [stdDate, serverType, sourceType, nameSearchText, sourceSearchText, getPaging]);

  // getSource() L244-259: 성공이면 "소스 가져오기가 완료되었습니다." 뒤 retrieve(), 실패면 서버 메시지
  const getSource = async () => {
    try {
      await icamApi.fetchSource();
      message.info('소스 가져오기가 완료되었습니다.');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  // [E4] sourceGetButton[ICAM DB소스 가져오기].Select (L160) → 확인창 → [E5] msgBox.DialogHide [YES] (L165) → getSource()
  const confirmGetSource = () => {
    Modal.confirm({
      title: '삭제',   // 원본 HtmlMessageBox 제목이 "삭제"(복사 흔적) 그대로
      content: '소스 가져오기 작업을 진행하시겠습니까? (작업시간이 많이 소요됨)',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: getSource,
    });
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, background: '#fff' }}>
      <SearchBar
        onSearch={retrieve}
        extra={<Button type="download" onClick={confirmGetSource}>ICAM DB소스 가져오기</Button>}
      >
        <SearchBar.Field label="기준일자">
          <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="서버">
          <Select style={{ width: 100 }} value={serverType} onChange={setServerType} options={SERVER_TYPES.map(v => ({ value: v, label: v }))} />
        </SearchBar.Field>
        <SearchBar.Field label="소스">
          <Select style={{ width: 120 }} value={sourceType} onChange={setSourceType} options={SOURCE_TYPES.map(v => ({ value: v, label: v }))} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="소스명" value={nameSearchText} onChange={e => setNameSearchText(e.target.value)} />
          <SearchBar.Input style={{ width: 200 }} placeholder="소스내용" value={sourceSearchText} onChange={e => setSourceSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<IcamSource>
          gridRef={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => p.data.sourceId}
          onRowDataUpdated={e => {
            if (selectFirst.current) {
              selectFirst.current = false;
              e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
            }
          }}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      {viewText !== null && <Icam50_Lookup_Source sourceText={viewText} onClose={() => setViewText(null)} />}
    </div>
  );
};
