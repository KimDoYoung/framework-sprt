/**
 * 법규 분류 조회창 (E03) — Ics20_Edit_RevisionHistoryAdmin의 [행 추가]에서 연다 (연결법규를 고른다).
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-131: 모달 1500×700 "법규 분류", 위 툴바(분류 200 "전체" · 법규검색 200 "법규코드/법규명" · 조문검색 200 "관련조문" · [검색] · 상세내용 포함)
 *   + 체크박스 다중 그리드 + 페이징 툴바(50), 아래 가운데 [확인][닫기]
 * actionCode: "classTree"(고른 법규 목록을 그대로 돌려줌, 1→1, E03)·"deadline"(고른 법규마다 그 기한을 selectByListIcsId로 읽어 돌려줌, 1→n, E04). openUnConn(relateTable)은 쓰는 화면(tdm)에서 더한다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode, IcsLaw, IcsLawDeadline, IcsLawLookup } from '@/types/ics';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Ics01_Lookup_Content } from './Ics01_Lookup_Content';
import { Ics01_Lookup_SelectParent } from './Ics01_Lookup_SelectParent';

const gb = gbFor<IcsLawLookup>();
const LIMIT = 50;  // gridToolBar.setToolBar(50)

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) */
const textLimitArea = (field: keyof IcsLawLookup & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

interface Props {
  /** open(actionCode, callback) L85 — 값이 true면 열린다 */
  open: boolean;
  /** "classTree"(기본) → onResult(고른 법규), "deadline" → onResultDeadlines(고른 법규와 그 기한 쌍) */
  actionCode?: 'classTree' | 'deadline';
  /** callback.execute(list) — actionCode "classTree" */
  onResult?: (list: IcsLawLookup[]) => void;
  /** callback.execute(result.getResult()) — actionCode "deadline": 법규 하나에 기한이 여럿이면 여러 행 */
  onResultDeadlines?: (list: IcsLawDeadline[]) => void;
  onClose: () => void;
}

export const Ics01_Lookup_SelectMulti: React.FC<Props> = ({ open, actionCode = 'classTree', onResult, onResultDeadlines, onClose }) => {
  // settings() L133-198: 분류 "전체"(classTreeId null), 법규검색·조문검색 빈칸, 상세내용 포함 해제
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('전체');
  const [lawSearch, setLawSearch] = useState('');
  const [statuteSearch, setStatuteSearch] = useState('');
  const [detailSearchYn, setDetailSearchYn] = useState(false);
  const [rows, setRows] = useState<IcsLawLookup[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [detailLaw, setDetailLaw] = useState<IcsLaw | null>(null);
  const gridRef = useRef<AgGridReact<IcsLawLookup>>(null);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean } | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icsApi.searchLawLookup({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E4] retrieveButton[검색].Select (L180) → retrieve() L230-255: 조건을 만들어 1페이지부터 다시 읽는다 (법규검색·조문검색은 서버가 %…%로 만든다)
  const retrieve = (id: number | null = classTreeId) => {
    paramRef.current = { classTreeId: id, lawSearch, statuteSearch, detailSearchYn };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L71-77, open() L85-131) → settings(), show(), retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    if (!open) return;
    setClassTreeId(null);
    setClassTreeName('전체');
    setLawSearch('');
    setStatuteSearch('');
    setDetailSearchYn(false);
    setRows([]);
    setTotal(0);
    setPage(1);
    paramRef.current = { classTreeId: null, lawSearch: '', statuteSearch: '', detailSearchYn: false };
    void getPaging(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] classTreeName[전체].TriggerClick [result == null] (L139) → Ics01_Lookup_SelectParent: 고른 분류(없으면 "전체")를 칸에 넣는다 (조회는 [검색]을 눌러야 한다)
  const selectParent = (node: ClassTreeNode | null) => {
    setClassTreeName(node ? (node.classTreeName ?? '') : '전체');
    setClassTreeId(node ? node.classTreeId : null);
  };

  // buildGrid() L200-228
  const columnDefs = useMemo(() => [
    gb.textCenter('classTreeCode', 70, '법규코드'),  // L219
    gb.textArea('classTreeName', 300, '법규명'),  // L220
    textLimitArea('content', 400, '상세내용'),  // L221
    // L222 actionCell(Detail) → Ics01_Lookup_Content.view(selectModel)
    iconCell<IcsLawLookup>('view', 'actionCell', 35, ' ', row => setDetailLaw({
      classTreeId: row.classTreeId, classTreeCode: row.classTreeCode, classTreeName: row.classTreeName,
      content: row.content, submitTo: row.submitTo, cycleName: row.cycleName, relatedLaw: row.relatedLaw,
    })),
    gb.textArea('submitTo', 200, '제출처'),  // L223
    gb.text('cycleName', 100, '주기'),  // L224
    gb.textArea('relatedLaw', 200, '관련조문'),  // L225
    gb.textArea('classTreeFullName', 250, '분류'),  // L226
  ], []);

  // [E5] changeButton[확인].Select (L186) → update() L257-295: 고른 법규가 없으면 "우측 법규를 선택해주세요", actionCode가 "classTree"면 callback.execute(list); hide(),
  //   그 밖(E04 "deadline")이면 서비스 ics.Ics01_ClassTree.selectByListIcsId(고른 법규 id들) → callback.execute(result); hide()
  const update = async () => {
    const selectList = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selectList.length === 0) {
      message.warning('우측 법규를 선택해주세요');
      return;
    }
    if (actionCode === 'classTree') {
      onResult?.(selectList);
      onClose();
      return;
    }
    try {
      onResultDeadlines?.(await icsApi.searchLawDeadlines(selectList.map(r => r.classTreeId)));
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  return (
    <Modal
      open={open}
      title="법규 분류"
      width={1540}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E6] cancleButton[닫기].Select (L192) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 540 }}>
        {/* [E2] lawSearch.KeyPress [Enter] (L160) → retrieve(), [E3] statuteSearch.KeyPress [Enter] (L170) → retrieve() */}
        <SearchBar
          searchText="검색"
          onSearch={() => retrieve()}
          loading={loading}
          extra={<Checkbox checked={detailSearchYn} onChange={e => setDetailSearchYn(e.target.checked)}>상세내용 포함</Checkbox>}
        >
          <SearchBar.Field label="분류">
            <Input style={{ width: 200, cursor: 'pointer' }} readOnly value={classTreeName} onClick={() => setParentOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="법규검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="법규코드/법규명" value={lawSearch} onChange={e => setLawSearch(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="조문검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="관련조문" value={statuteSearch} onChange={e => setStatuteSearch(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<IcsLawLookup> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.classTreeId)} loading={loading} />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <Ics01_Lookup_SelectParent open={parentOpen} onResult={selectParent} onClose={() => setParentOpen(false)} />
      <Ics01_Lookup_Content law={detailLaw} readOnly onClosed={() => undefined} onClose={() => setDetailLaw(null)} />
    </Modal>
  );
};
