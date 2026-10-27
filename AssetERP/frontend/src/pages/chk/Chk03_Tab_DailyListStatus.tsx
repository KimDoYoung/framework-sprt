/**
 * [1243] 펀드관리 > 10. 펀드회계 일일점검 > 일일점검내역 (R04)
 * AS-IS: myApp/client/vi/chk/Chk03_Tab_DailyListStatus.java (257줄) + Chk02_Edit_DailyList(공용, 읽기 전용 상세보기) + Chk01_Lookup_ClassTree(공용)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L70-113: center = vlc = 툴바1 50(일자 · 분류 300 · [조회][출력/다운로드]) / 툴바2 36(검색 457 · 미점검 보기 · 미확인 보기) / 그리드(행번호, 체크 다중) + 페이징 툴바(100)
 * 스타일: SGP (견본 — docs/page-style.md)
 * R03(확인)과 같은 SQL인데 확인자 조건 없이 회사 전체 담당자의 점검 현황을 본다(원본이 confirmerId를 주지 않는다). 확인·확인취소 버튼은 없다.
 * [출력/다운로드]는 원본도 핸들러가 비어 있어 아무 일도 하지 않는다(원본 그대로)
 * 검색 영역 = SearchPanel(두 줄). UX-01·04 적용
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree, ChkDailyListConfirm, ChkDailyListConfirmParams } from '@/types/chk';
import { MultiGrid, PagingToolBar, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchPanel } from '@/components/search';
import { Chk01_Lookup_ClassTree } from './Chk01_Lookup_ClassTree';
import { Chk02_Edit_DailyList, ChkDailyListEdit } from './Chk02_Edit_DailyList';

const LIMIT = 100;  // gridToolBar.setToolBar(100)
const FORMAT = 'YYYY-MM-DD';
const gb = gbFor<ChkDailyListConfirm>();

export const Chk03_Tab_DailyListStatus: React.FC = () => {
  // settings() L70-113 settings(): 일자 오늘 · 링크코드 "01" 분류가 기준 분류(classTreeModel), 분류칸은 그 이름 · 검색어 빈칸 · 미점검/미확인 보기 꺼짐
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [classTreeModel, setClassTreeModel] = useState<ChkClassTree | null>(null);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [unCheckYn, setUnCheckYn] = useState(false);
  const [unConfirmYn, setUnConfirmYn] = useState(false);
  const [rows, setRows] = useState<ChkDailyListConfirm[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<ChkDailyListEdit | null>(null);
  const gridRef = useRef<AgGridReact<ChkDailyListConfirm>>(null);
  /** resultDate와 gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader). 확인 저장도 이 날짜로 한다 */
  const paramRef = useRef<ChkDailyListConfirmParams | undefined>(undefined);
  const view = useRef({ startDate, classTreeId, searchText, unCheckYn, unConfirmYn });
  view.current = { startDate, classTreeId, searchText, unCheckYn, unConfirmYn };

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수. 끝나면 첫 행을 선택한다(L243 select(0, false))
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await chkApi.searchDailyListStatuses({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L223-248: 조건을 만들어 1페이지부터 다시 읽는다 (검색어의 "%…%"는 서버가 만든다)
  const retrieve = (over?: { id?: number | null }) => {
    const v = view.current;
    const id = over?.id !== undefined ? over.id : v.classTreeId;
    if (id == null) return;  // 원본은 기준 분류가 없으면 classTreeId가 null인 채로 조회 → 결과 없음
    paramRef.current = {
      classTreeId: id, date: v.startDate.format(FORMAT), searchText: v.searchText, unCheckYn: v.unCheckYn, unConfirmYn: v.unConfirmYn,
    };
    void getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L80-125) → settings(): 서비스 chk.Chk01_ClassTree.selectByLinkCode(linkCode "01") → 분류칸 채우고 retrieve()
  useEffect(() => {
    void (async () => {
      try {
        const model = await chkApi.getClassTreeByLinkCode('01');
        if (!model) return;
        setClassTreeModel(model);
        setClassTreeId(model.classTreeId);
        setClassTreeName(model.classTreeName ?? '');
        retrieve({ id: model.classTreeId });
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] classTreeName.TriggerClick [result != null] (L142) → Chk01_Lookup_ClassTree.open(기준 분류): 결과가 있으면 분류 교체, [전체](null)이면 기준 분류로 되돌린다
  const onClassResult = (node: ChkClassTree | null) => {
    if (node) {
      setClassTreeId(node.classTreeId);
      setClassTreeName(node.classTreeName ?? '');
    } else if (classTreeModel) {
      setClassTreeId(classTreeModel.classTreeId);
      setClassTreeName(classTreeModel.classTreeName ?? '');
    }
  };

  // [E5] actionCell (ImageCell).callbackOnCreate (L201) → 상세보기 창(Chk02_Edit_DailyList.open) [닫기]에서는 아무것도 하지 않는다(callback 비어 있음)
  const columnDefs = [
    gb.text('classTreeName', 250, '분류'),  // L211
    gb.textArea('content', 600, '점검내용'),  // L212
    iconCell<ChkDailyListConfirm>('view', 'viewCell', 40, ' ', row => setViewTarget(row)),  // L213
    gb.textArea('reason', 300, '점검결과'),  // L214
    gb.text('orgName', 100, '담당부서'),  // L215
    gb.text('personName', 100, '담당자'),  // L216
    gb.text('confirmerName', 100, '확인자'),  // L217
    gb.booleanYn('confirmYn', 80, '확인여부'),  // L218
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L179) → retrieve(), [E2] searchText.KeyPress [Enter] (L165) → retrieve() — 원본 buttonBar1·2 두 줄 */}
      <SearchPanel onSearch={() => retrieve()} loading={loading}>
        <SearchPanel.Row>
          <SearchPanel.Field label="일자">
            <DatePicker style={{ width: 135 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          </SearchPanel.Field>
          <SearchPanel.Field label="분류">
            <LookupInput width={300} value={classTreeName} onOpen={() => setClassOpen(true)} />
          </SearchPanel.Field>
        </SearchPanel.Row>
        <SearchPanel.Row>
          <SearchPanel.Field label="검색" grow>
            <SearchPanel.Input style={{ flex: 1 }} placeholder="분류/점검내용/담당부서/담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchPanel.Field>
        </SearchPanel.Row>
        <SearchPanel.Actions>
          {/* [E4] downLoadButton[출력/다운로드].Select (L185) — 원본 핸들러가 비어 있다 */}
          <Button type="download" onClick={() => undefined}>출력/다운로드</Button>
        </SearchPanel.Actions>
        <SearchPanel.Actions>
          <Checkbox checked={unCheckYn} onChange={e => setUnCheckYn(e.target.checked)}>미점검 보기</Checkbox>
          <Checkbox checked={unConfirmYn} onChange={e => setUnConfirmYn(e.target.checked)}>미확인 보기</Checkbox>
        </SearchPanel.Actions>
      </SearchPanel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<ChkDailyListConfirm>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.keyId)}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => { void getPaging(p); }} />
      <Chk02_Edit_DailyList model={viewTarget} baseClassTreeId={classTreeModel?.classTreeId} readOnly onClose={() => setViewTarget(null)} />
      <Chk01_Lookup_ClassTree open={classOpen} mode="open" classTreeId={classTreeModel?.classTreeId} onResult={onClassResult} onClose={() => setClassOpen(false)} />
    </div>
  );
};
