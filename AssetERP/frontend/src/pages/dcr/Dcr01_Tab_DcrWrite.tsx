/**
 * [1318] 문서작성 > 01. 문서작성 > 신규 문서작성 (F01, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Tab_DcrWrite.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L99-193: north(140) = 박스 안 툴바 3줄(문서분류 대/중/문서분류 · 세부분류 · [불러오기] / 문서명 + 작성요령 / 비고 + [신규문서 작성] + 북마크),
 *   center = 툴바(등록기간 · 검색 · 수신처 · 조건 포함 체크 · [조회]) + 문서 그리드(체크박스 단일) + 페이징 툴바(100)
 * 1단계(사용자 결정 2026-10-19): [신규문서 작성]·상세보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc과 북마크 아이콘이 여는 Apr50_Lookup_ApprList는
 *   다른 도메인(apr)이라 다음 단계(F01-2)에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조건이 길어 한 줄을 넘기므로 초기화(UX-02)는 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Select, Typography } from 'antd';
import { QuestionCircleFilled, StarFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { aprApi } from '@/api/apr';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AprDcrWrite } from '@/types/apr';
import { DcrClassDetail, DcrWriteCode } from '@/types/dcr';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Dcr08_Lookup_SelectSingle } from './Dcr08_Lookup_SelectSingle';

const gb = gbFor<AprDcrWrite>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const DATE_FORMAT = 'YYYY-MM-DD';

const toOptions = (list: DcrWriteCode[]) => list.map(c => ({ value: c.code, label: c.name }));

export const Dcr01_Tab_DcrWrite: React.FC = () => {
  // 분류 콤보 4개 (dcrClassLComboBox·MComboBox·SComboBox·DetailComboBox) — 값은 코드(분류 ID), 목록은 서버가 준 것
  const [lId, setLId] = useState<number | null>(null);
  const [mId, setMId] = useState<number | null>(null);
  const [sId, setSId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [lOptions, setLOptions] = useState<DcrWriteCode[]>([]);
  const [mOptions, setMOptions] = useState<DcrWriteCode[]>([]);
  const [sOptions, setSOptions] = useState<DcrWriteCode[]>([]);
  const [detailOptions, setDetailOptions] = useState<DcrWriteCode[]>([]);
  /** classTreeId: 가장 아래까지 고른 분류 ID (조회 조건 "상단의 문서분류를 조회조건에 포함"에 쓴다) */
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  /** classTreeModel: 문서분류(S)를 고르면 서버에서 읽어 둔다. 1단계는 ID만 쓴다 — 전체 모델은 편집창(F01-2)이 쓴다 */
  const [classTreeModelId, setClassTreeModelId] = useState<number | null>(null);
  const [classDetailModel, setClassDetailModel] = useState<DcrClassDetail | null>(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));  // lastMonthDate
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());  // LoginUser.getToday()
  const [searchText, setSearchText] = useState('');
  const [receiveName, setReceiveName] = useState('');
  const [aprChecked, setAprChecked] = useState(false);

  const [rows, setRows] = useState<AprDcrWrite[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [oftenOpen, setOftenOpen] = useState(false);
  const gridRef = useRef<AgGridReact<AprDcrWrite>>(null);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ startDate: string; closeDate: string; searchText: string; receiveName: string; classTreeId: number | null } | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("loading")
    try {
      const res = await aprApi.searchDcrWrite({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L577-609: 조건을 만들어 1페이지부터 다시 읽고, 읽고 나면 첫 행을 고른다(onRowDataUpdated). 검색어·수신처는 서버가 %…%로 만든다
  const retrieve = () => {
    paramRef.current = {
      startDate: startDate.format(DATE_FORMAT),
      closeDate: closeDate.format(DATE_FORMAT),
      searchText,
      receiveName,
      classTreeId: aprChecked ? classTreeId : null,
    };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L99-193) → settings() L195-459: 대분류 목록을 읽는다 (조직·회사는 서버가 세션에서), retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    void dcrApi.searchWriteClasses(1).then(setLOptions).catch(err => message.error(errorMessage(err, '조회 실패')));
    void retrieveRef.current();
  }, []);

  // refreshCode() L461-481: 고른 단계의 아래 목록을 읽고, 문서명·비고를 비운다. classTreeId = 가장 아래까지 고른 분류
  const refreshCode = async (level: 1 | 2 | 3, id: number) => {
    setClassTreeId(id);
    setTitle('');
    setNote('');
    try {
      if (level === 1) setMOptions(await dcrApi.searchWriteClasses(2, id));
      else if (level === 2) setSOptions(await dcrApi.searchWriteClasses(3, id));
      else setDetailOptions(await dcrApi.searchWriteDetails(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] dcrClassLComboBox[sys.Sys09_Code.selectByDcrLv1].Collapse [preValue == null] (L207) → refreshCode(): 아래 콤보와 선택 모델을 비운다
  const changeL = (id: number) => {
    setLId(id);
    setMId(null); setMOptions([]);
    setSId(null); setSOptions([]);
    setDetailId(null); setDetailOptions([]);
    setClassTreeModelId(null);
    setClassDetailModel(null);
    void refreshCode(1, id);
  };

  // [E3] dcrClassMComboBox[sys.Sys09_Code.selectByDcrLv2].Collapse [preValue == null] (L238) → refreshCode()
  const changeM = (id: number) => {
    setMId(id);
    setSId(null); setSOptions([]);
    setDetailId(null); setDetailOptions([]);
    setClassTreeModelId(null);
    setClassDetailModel(null);
    void refreshCode(2, id);
  };

  // [E4] dcrClassSComboBox[sys.Sys09_Code.selectByDcrLv3].Collapse [preValue == null] (L267) → refreshCode(), getClassTreeModel()
  const changeS = (id: number) => {
    setSId(id);
    setDetailId(null); setDetailOptions([]);
    setClassDetailModel(null);
    void refreshCode(3, id);
    void getClassTreeModel(id);
  };

  // getClassTreeModel() L483-498: dcr.Dcr01_ClassTree.selectById(classTreeId)
  // [E4 일부 생략] 서버에서 분류 모델(인감·결재선 그룹 등)을 읽는 부분 — 그 모델은 전자결재 편집창(F01-2)이 쓴다. 지금은 고른 분류 ID만 둔다
  const getClassTreeModel = async (id: number | null) => {
    setClassTreeModelId(id);
  };

  // getClassDetailModel() L500-521: 세부분류를 읽어 문서명(세부분류명)·비고(키워드)를 채운다. 세부분류가 없으면 비운다
  const getClassDetailModel = async (id: number | null) => {
    if (id == null) {
      setClassDetailModel(null);
      setTitle('');
      setNote('');
      return;
    }
    try {
      const model = await dcrApi.getClassDetail(id);
      setClassDetailModel(model);
      setTitle(model.classDetailName ?? '');
      setNote(model.keyword ?? '');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E5] dcrClassDetailComboBox[sys.Sys09_Code.selectByDcrDetail].Collapse [preValue == null] (L296) → getClassDetailModel()
  const changeDetail = (id: number) => {
    setDetailId(id);
    void getClassDetailModel(id);
  };

  // [E6] oftenUseButton[불러오기].Select [result != null] (L316) → getClassDetailModel(): 최근 쓴 문서분류를 콤보에 채운다
  //   AS-IS는 전체 경로 글자를 " > "로 쪼개 콤보 이름으로 찾지만 이 DB의 경로 구분자는 '/'라 서버가 대분류·중분류 ID를 같이 준다
  const applyOftenUse = async (row: { lClassTreeId?: number | null; mClassTreeId?: number | null; classTreeId: number; classDetailId?: number | null }) => {
    if (row.lClassTreeId == null || row.mClassTreeId == null) {
      message.warning('최근사용한 문서분류의 상위 분류를 찾을 수 없습니다');
      return;
    }
    setClassTreeModelId(row.classTreeId);
    setLId(row.lClassTreeId);
    setMId(row.mClassTreeId);
    setSId(row.classTreeId);
    setClassTreeId(row.classTreeId);
    try {
      const [m, s, d] = await Promise.all([
        dcrApi.searchWriteClasses(2, row.lClassTreeId),
        dcrApi.searchWriteClasses(3, row.mClassTreeId),
        dcrApi.searchWriteDetails(row.classTreeId),
      ]);
      setMOptions(m);
      setSOptions(s);
      setDetailOptions(d);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    setDetailId(row.classDetailId ?? null);
    await getClassDetailModel(row.classDetailId ?? null);
  };

  // [E7] helpAnchor.MouseDown (L376) → 메시지 "작성요령" (세부분류의 작성요령, 없으면 "해당 세부분류는 작성요령이 없습니다")
  const showHelp = () => {
    // 세부분류를 고르기 전에는 AS-IS도 classDetailModel이 비어 있어 아무 일도 일어나지 않는다
    if (!classDetailModel) return;
    Modal.info({
      title: '작성요령',
      content: <div style={{ whiteSpace: 'pre-wrap' }}>{classDetailModel.guide || '해당 세부분류는 작성요령이 없습니다'}</div>,
    });
  };

  // insertApproval() L523-536: 문서분류를 안 골랐으면 "상단 문서분류를 선택해주세요", 아니면 Apr01_Edit_ApprDoc 신규 작성 창을 열고 닫힌 뒤 retrieve()
  // [E8 일부 생략] 편집창은 다음 단계(F01-2)에서 연결한다
  const insertApproval = () => {
    if (classTreeModelId == null) {
      message.warning('상단 문서분류를 선택해주세요');
      return;
    }
    message.info('전자결재 문서 작성 창은 다음 단계에서 연결됩니다');
  };

  // [E8] insertButton[신규문서 작성].Select (L387) → insertApproval(): 전용화면을 쓰는 세부분류(linkYn)는 안내만 하고 끝낸다
  // [E8 일부 생략] dcr.Dcr08_OftenUse.insertUpdate(최근 사용 횟수 올리기)는 편집창이 열릴 때 같이 한다(F01-2) — 창 없이 횟수만 올리지 않는다
  const insertButton = () => {
    if (classDetailModel && classDetailModel.linkYn === 'true') {
      if (!classDetailModel.guide) message.warning('해당 세부분류는 전용화면을 이용해야 합니다.');
      else Modal.info({ content: <div style={{ whiteSpace: 'pre-wrap' }}>{classDetailModel.guide}</div> });
      return;
    }
    insertApproval();
  };

  // [E1] bookmarkAnchor.MouseDown (L125) → Apr50_Lookup_ApprList.open()
  // [E1 생략] 북마크 문서 조회창은 다음 단계(F01-2)에서 연결한다
  const openBookmark = () => message.info('북마크 문서 조회창은 다음 단계에서 연결됩니다');

  // buildGrid() L538-575
  const columnDefs = useMemo(() => [
    gb.bookmarkYn('bookmarkYn', 30, ' '),  // L562
    gb.date('regDate', 90, '등록일'),  // L563
    gb.date('effectDate', 90, '시행일'),  // L564
    gb.textCenter('regEmpName', 100, '등록자'),  // L565
    gb.text('classTreeName', 250, '문서분류'),  // L566
    gb.textHtml('title', 400, '문서명'),  // L567
    gb.text('receiveName', 150, '수신처'),  // L568
    gb.text('relateDisplayName', 250, '연관펀드(일임)'),  // L569
    gb.textHtml('statusNameBold', 80, '상태'),  // L570
    // L571 actionCell(View): 폐기 문서는 "해당문서는 폐기되어 열람이 불가능합니다", 아니면 Apr01_Edit_ApprDoc.retrieveApproval(model, false) 뒤 retrieveOne()
    // [L571 일부 생략] 편집창·retrieveOne(apr.Apr01_Appr.selectByApprId2)은 다음 단계(F01-2)
    iconCell<AprDcrWrite>('view', 'actionCell', 80, '상세보기', row => {
      if ((row.title ?? '').indexOf('style=color:#E33E31;>[폐기]') !== -1) {
        message.warning('해당문서는 폐기되어 열람이 불가능합니다');
      } else {
        message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
      }
    }),
    gb.text('note', 300, '비고'),  // L572
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* north: buttonBarVlc — 테두리 안 툴바 3줄 */}
      <div style={{ border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Typography.Text strong>문서분류</Typography.Text>
          <Select style={{ width: 200 }} placeholder="대분류를 선택하세요" value={lId} options={toOptions(lOptions)} onChange={changeL} />
          <Select style={{ width: 200 }} placeholder="중분류를 선택하세요" value={mId} options={toOptions(mOptions)} onChange={changeM} />
          <Select style={{ width: 200 }} placeholder="문서분류를 선택하세요" value={sId} options={toOptions(sOptions)} onChange={changeS} />
          <Typography.Text strong style={{ marginLeft: 8 }}>세부분류</Typography.Text>
          <Select style={{ width: 300 }} placeholder="선택하세요" value={detailId} options={toOptions(detailOptions)} onChange={changeDetail} />
          <Button type="register" onClick={() => setOftenOpen(true)}>불러오기</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text strong style={{ width: 56, textAlign: 'right' }}>문서명</Typography.Text>
          <Input style={{ width: 610 }} placeholder="세부분류 선택시 작성됩니다.(작성요령을 확인하여 완성해주세요)" value={title} onChange={e => setTitle(e.target.value)} />
          <a onClick={showHelp} style={{ textDecoration: 'none', color: '#4472C4', fontWeight: 600, fontSize: 12 }}>
            <QuestionCircleFilled /> 작성요령
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text strong style={{ width: 56, textAlign: 'right' }}>비고</Typography.Text>
          <Input style={{ width: 610 }} placeholder="세부분류 선택시 작성됩니다." value={note} onChange={e => setNote(e.target.value)} />
          <Button type="register" onClick={insertButton}>신규문서 작성</Button>
          <StarFilled title="북마크 문서" style={{ color: '#FFCD43', fontSize: 18, cursor: 'pointer' }} onClick={openBookmark} />
        </div>
      </div>

      {/* center: vlc — 조회 툴바 + 그리드 + 페이징 */}
      <div style={{ flex: 1, minHeight: 0, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E9] searchText.KeyPress [Enter] (L431)·[E10] receiveName.KeyPress [Enter] (L441)·[E11] retrieveButton[조회].Select (L453) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="등록기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="등록자/문서분류/문서명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="수신처">
            <SearchBar.Input style={{ width: 200 }} placeholder="미입력" value={receiveName} onChange={e => setReceiveName(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={aprChecked} onChange={e => setAprChecked(e.target.checked)}>상단의 문서분류를 조회조건에 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprDcrWrite>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>

      <Dcr08_Lookup_SelectSingle
        open={oftenOpen}
        onResult={row => void applyOftenUse(row)}
        onClose={() => setOftenOpen(false)}
      />
    </div>
  );
};
