/**
 * [1242] 펀드관리 > 10. 펀드회계 일일점검 > 일일점검내역 확인 (R03)
 * AS-IS: myApp/client/vi/chk/Chk03_Tab_DailyListConfirm.java (355줄) + Chk02_Edit_DailyList(공용, 읽기 전용 상세보기) + Chk01_Lookup_ClassTree(공용)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L80-125: center = vlc = 툴바1 50(일자 100 · 분류 300 · [조회][출력/다운로드] · [확인][확인취소]) / 툴바2 36(검색 457 · 미점검 보기 · 미확인 보기) / 그리드(행번호, 체크 다중) + 페이징 툴바(100)
 * 스타일: SGP (견본 — docs/page-style.md)
 * 열 때 분류(링크코드 "01")를 읽어 곧바로 조회한다. 조회 결과는 로그인 사용자가 확인자인 담당자별 점검내역이다.
 * [출력/다운로드]는 원본도 핸들러가 비어 있어 아무 일도 하지 않는다(원본 그대로)
 * 검색 영역 = SearchPanel(두 줄: 왼쪽 입력 2줄 + 오른쪽 버튼 2줄, R03에서 신설). UX-01·04 적용
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, Modal, message } from 'antd';
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

export const Chk03_Tab_DailyListConfirm: React.FC = () => {
  // settings() L127-216: 일자 오늘 · 링크코드 "01" 분류가 기준 분류(classTreeModel), 분류칸은 그 이름 · 검색어 빈칸 · 미점검/미확인 보기 꺼짐
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
  const [checked, setChecked] = useState<ChkDailyListConfirm[]>([]);
  const gridRef = useRef<AgGridReact<ChkDailyListConfirm>>(null);
  /** resultDate와 gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader). 확인 저장도 이 날짜로 한다 */
  const paramRef = useRef<ChkDailyListConfirmParams | undefined>(undefined);
  const view = useRef({ startDate, classTreeId, searchText, unCheckYn, unConfirmYn });
  view.current = { startDate, classTreeId, searchText, unCheckYn, unConfirmYn };

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수. 끝나면 첫 행을 선택한다(L266 select(0, false))
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await chkApi.searchDailyListConfirms({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
      setChecked([]);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L246-272: 조건을 만들어 1페이지부터 다시 읽는다 (검색어의 "%…%"는 서버가 만든다)
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

  // [E1] classTreeName.TriggerClick [result != null] (L154) → Chk01_Lookup_ClassTree.open(기준 분류): 결과가 있으면 분류 교체, [전체](null)이면 기준 분류로 되돌린다
  const onClassResult = (node: ChkClassTree | null) => {
    if (node) {
      setClassTreeId(node.classTreeId);
      setClassTreeName(node.classTreeName ?? '');
    } else if (classTreeModel) {
      setClassTreeId(classTreeModel.classTreeId);
      setClassTreeName(classTreeModel.classTreeName ?? '');
    }
  };

  // [E5] confirmButton[확인] (L204)·[E6] cancleButton[확인취소] (L210) → confirmChk() L274-319: 선택이 없으면 안내, 있으면 N건 확인(취소) 묻고
  //   [E8][E9] msgBox YES → confirm() L321-346: 답변이 없는 대상이 있으면 안내하고 중단, 아니면 chk.Chk03_DailyListWrite.updateConfirmYn 뒤 retrieve()
  const confirmChk = (check: boolean) => {
    if (checked.length === 0) { message.info('대상을 먼저 선택해주세요'); return; }
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 항목을 ${check ? '확인' : '확인취소'}하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 320,
      onOk: async () => {
        if (checked.some(r => r.answerCode == null)) {
          message.info('선택한 일일점검항목중에 결과값이 없는 대상이 포함되어 있습니다');
          return;
        }
        try {
          await chkApi.updateDailyListConfirm(check, paramRef.current?.date ?? view.current.startDate.format(FORMAT),
            checked.map(r => ({ dailyListId: r.dailyListId, personId: r.personId })));
          retrieve();
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // [E7] actionCell (ImageCell).callbackOnCreate (L225) → 상세보기 창(Chk02_Edit_DailyList.open) [닫기]에서는 아무것도 하지 않는다(callback 비어 있음)
  const columnDefs = [
    gb.text('classTreeName', 250, '분류'),  // L235
    gb.textArea('content', 600, '점검내용'),  // L236
    iconCell<ChkDailyListConfirm>('view', 'viewCell', 40, ' ', row => setViewTarget(row)),  // L237
    gb.textArea('reason', 300, '점검결과'),  // L238
    gb.text('orgName', 100, '담당부서'),  // L239
    gb.text('personName', 100, '담당자'),  // L240
    gb.booleanYn('confirmYn', 80, '확인여부'),  // L241
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L191) → retrieve(), [E2] searchText.KeyPress [Enter] (L177) → retrieve() — 원본 buttonBar1·2 두 줄 */}
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
          {/* [E4] downLoadButton[출력/다운로드].Select (L197) — 원본 핸들러가 비어 있다 */}
          <Button type="download" onClick={() => undefined}>출력/다운로드</Button>
          <Button type="save" onClick={() => confirmChk(true)}>확인</Button>
          <Button type="cancel" onClick={() => confirmChk(false)}>확인취소</Button>
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
          onCheckedChange={setChecked}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => { void getPaging(p); }} />
      <Chk02_Edit_DailyList model={viewTarget} baseClassTreeId={classTreeModel?.classTreeId} readOnly onClose={() => setViewTarget(null)} />
      <Chk01_Lookup_ClassTree open={classOpen} mode="open" classTreeId={classTreeModel?.classTreeId} onResult={onClassResult} onClose={() => setClassOpen(false)} />
    </div>
  );
};
