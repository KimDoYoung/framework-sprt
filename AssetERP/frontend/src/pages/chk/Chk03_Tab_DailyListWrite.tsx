/**
 * [1241] 펀드관리 > 10. 펀드회계 일일점검 > 일일점검내역 작성 (R02)
 * AS-IS: myApp/client/vi/chk/Chk03_Tab_DailyListWrite.java (419줄) + Chk03_Edit_Reason.java (106줄) + Chk03_Edit_Note.java (106줄) + Chk02_Edit_DailyList(공용) + Chk01_Lookup_ClassTree(공용)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-98: center = vlc = 툴바 50(점검일자 100 · 분류 300 · 검색 250 "분류/점검내용/설명" · 미점검 내용만 보기 · [조회]) / 그리드(행번호, 단일 선택)
 * 스타일: SGP (견본 — docs/page-style.md)
 * 열 때 분류(링크코드 "01")를 읽어 곧바로 조회한다. 체크 한 번마다 저장한다(E4). 검색칸은 원본도 SQL이 쓰지 않아 조회에 영향이 없다(원본 그대로)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 [조회] 한 줄에 공간이 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree, ChkDailyListWrite, ChkDailyListWriteItem } from '@/types/chk';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Chk01_Lookup_ClassTree } from './Chk01_Lookup_ClassTree';
import { Chk02_Edit_DailyList, ChkDailyListEdit } from './Chk02_Edit_DailyList';
import { Chk03_Edit_Note } from './Chk03_Edit_Note';
import { Chk03_Edit_Reason } from './Chk03_Edit_Reason';

/** 그리드 행 — 예·아니오·해당없음 체크박스 값은 답변 코드(Y·N·X)에서 정한다 (AS-IS Chk02_DailyListModel.getYes/getNo/getNot) */
type Row = ChkDailyListWrite & { yes: boolean; no: boolean; not: boolean };
const gb = gbFor<Row>();
const FORMAT = 'YYYY-MM-DD';

const toRow = (r: ChkDailyListWrite): Row => ({ ...r, yes: r.answerCode === 'Y', no: r.answerCode === 'N', not: r.answerCode === 'X' });
const merge = (r: Row, item: ChkDailyListWriteItem): Row => toRow({
  ...r, dailyListWriteId: item.dailyListWriteId, answerCode: item.answerCode, reason: item.reason, note: item.note, confirmYn: item.confirmYn,
});

const MSG_CONFIRMED = '담당자가 확인처리한 일일점검내역으로 수정이 불가능합니다';
const ANSWER_CODE = { yes: 'Y', no: 'N', not: 'X' } as const;

export const Chk03_Tab_DailyListWrite: React.FC = () => {
  // settings() L100-235: 점검일자 오늘 · 링크코드 "01" 분류가 기준 분류(classTreeModel), 분류칸은 그 이름 · 검색어 빈칸 · 미점검 내용만 보기 꺼짐
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [classTreeModel, setClassTreeModel] = useState<ChkClassTree | null>(null);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<ChkDailyListEdit | null>(null);
  const [reasonTarget, setReasonTarget] = useState<ChkDailyListWriteItem | null>(null);
  const [noteTarget, setNoteTarget] = useState<ChkDailyListWriteItem | null>(null);
  /** resultDate — 마지막으로 조회한 점검일자. 체크 저장·작성 행 만들기는 이 날짜로 한다(조회 뒤 점검일자를 바꿔도 그대로) */
  const resultDate = useRef(dayjs().format(FORMAT));
  const view = useRef({ startDate, classTreeId, checkBox });
  view.current = { startDate, classTreeId, checkBox };

  // retrieve() L386-405: resultDate = 점검일자 → chk.Chk02_DailyList.selectByPersonId(companyId·personId(서버), classTreeId, useYn "true", "%검색어%", checkBox, date)
  const retrieve = useCallback(async (over?: { id?: number | null }) => {
    const id = over?.id !== undefined ? over.id : view.current.classTreeId;
    resultDate.current = view.current.startDate.format(FORMAT);
    if (id == null) return;  // 원본은 기준 분류가 없으면 classTreeId가 null인 채로 조회 → 결과 없음
    setLoading(true);
    try {
      setRows((await chkApi.searchDailyListWrites(id, resultDate.current, view.current.checkBox)).map(toRow));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L71-98) → settings(): 서비스 chk.Chk01_ClassTree.selectByLinkCode(linkCode "01") → 분류칸 채우고 retrieve()
  useEffect(() => {
    void (async () => {
      try {
        const model = await chkApi.getClassTreeByLinkCode('01');
        if (!model) return;
        setClassTreeModel(model);
        setClassTreeId(model.classTreeId);
        setClassTreeName(model.classTreeName ?? '');
        await retrieve({ id: model.classTreeId });
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  }, [retrieve]);

  // [E1] classTreeName.TriggerClick [result != null] (L127) → Chk01_Lookup_ClassTree.open(기준 분류): 결과가 있으면 분류 교체, [전체](null)이면 기준 분류로 되돌린다
  const onClassResult = (node: ChkClassTree | null) => {
    if (node) {
      setClassTreeId(node.classTreeId);
      setClassTreeName(node.classTreeName ?? '');
    } else if (classTreeModel) {
      setClassTreeId(classTreeModel.classTreeId);
      setClassTreeName(classTreeModel.classTreeName ?? '');
    }
  };

  /** 목록을 서버가 알려 준 작성 행으로 되돌린다(고칠 수 없는 행을 눌렀거나 저장이 실패했을 때) — AS-IS grid.getStore().update(model) 전체 */
  const revert = () => setRows(prev => prev.map(toRow));

  // [E4] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L168): 예·아니오·해당없음 체크 → 확인된 행은 되돌리고 안내, 아니면
  //   그 답변으로 chk.Chk03_DailyListWrite.updateAnswerCode (작성 행이 없으면 서버가 만든다). 체크를 풀어도 답변은 그대로다(AS-IS setYes 등이 답변 코드를 다시 넣는다)
  const onCellValueChanged = async (e: CellValueChangedEvent<Row>) => {
    const field = e.colDef.field as keyof typeof ANSWER_CODE | undefined;
    if (!field || !(field in ANSWER_CODE) || !e.data) return;
    const row = e.data;
    if (row.confirmYn) { revert(); message.info(MSG_CONFIRMED); return; }
    try {
      const item = await chkApi.updateDailyListWriteAnswer(row.dailyListId, ANSWER_CODE[field], resultDate.current);
      setRows(prev => prev.map(r => (r.dailyListId === row.dailyListId ? merge(r, item) : r)));
    } catch (err) {
      revert();
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // buildGrid() L237-281 editCell01·editCell02 → edit() L283-306: 작성 행이 있으면 selectById로 확인여부를 보고(확인되면 안내) updateReasonNote(),
  //   없으면 updateReasonNote() L308-384: 답변 없이 작성 행을 먼저 만들고(modelUpdate) 점검결과(reason)·비고(note) 창을 연다
  const edit = async (row: Row, actionCode: 'reason' | 'note') => {
    try {
      let item: ChkDailyListWriteItem;
      if (row.dailyListWriteId != null) {
        item = await chkApi.getDailyListWrite(row.dailyListWriteId);
        if (item.confirmYn) { message.info(MSG_CONFIRMED); return; }
      } else {
        item = await chkApi.createDailyListWrite(row.dailyListId, resultDate.current);
        setRows(prev => prev.map(r => (r.dailyListId === row.dailyListId ? merge(r, item) : r)));
      }
      if (actionCode === 'reason') setReasonTarget(item); else setNoteTarget(item);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // Chk03_Edit_Reason·Chk03_Edit_Note callback: 저장한 점검결과·비고를 그 행에 넣는다 (AS-IS setReason/setNote + grid.getStore().update)
  const onTextSaved = (item: ChkDailyListWriteItem) => {
    setRows(prev => prev.map(r => (r.dailyListId === item.dailyListId ? merge(r, item) : r)));
  };

  // [E5] actionCell (ImageCell).callbackOnCreate (L244) → 상세보기 창(Chk02_Edit_DailyList.open) [닫기]에서 retrieve()
  const columnDefs = [
    gb.text('classTreeName', 200, '분류'),  // L266
    gb.textArea('content', 500, '점검내용'),  // L267
    gb.textCenter('cutoff', 70, 'CutOff'),  // L268
    gb.textCenter('windowNo', 100, '화면번호'),  // L269
    iconCell<Row>('view', 'viewCell', 40, ' ', row => setViewTarget(row)),  // L270 Chk02_Edit_DailyList.open(selectModel, callback → retrieve())
    gb.group('체크', [  // L255 HeaderGroupMap(0, 6, "체크" 1×3)
      gb.boolean('yes', 70, '예', { editable: true }),  // L271
      gb.boolean('no', 70, '아니오', { editable: true }),  // L272
      gb.boolean('not', 70, '해당없음', { editable: true }),  // L273
    ]),
    gb.textArea('reason', 200, '점검결과'),  // L274
    iconCell<Row>('edit', 'editReason', 40, ' ', row => { void edit(row, 'reason'); }),  // L275 editCell01
    gb.textArea('note', 200, '비고'),  // L276
    iconCell<Row>('edit', 'editNote', 40, ' ', row => { void edit(row, 'note'); }),  // L277 editCell02
    gb.booleanYn('confirmYn', 80, '확인여부'),  // L278
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L162) → retrieve(), [E2] searchText.KeyPress [Enter] (L150) → retrieve() */}
      <SearchBar onSearch={() => retrieve()} loading={loading}>
        <SearchBar.Field label="점검일자">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="분류">
          <LookupInput width={300} value={classTreeName} onOpen={() => setClassOpen(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="분류/점검내용/설명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={checkBox} onChange={e => setCheckBox(e.target.checked)}>미점검 내용만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<Row>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.dailyListId)}
          onCellValueChanged={e => { void onCellValueChanged(e); }}
        />
      </div>
      <Chk02_Edit_DailyList model={viewTarget} baseClassTreeId={classTreeModel?.classTreeId} readOnly
        onClosed={() => { void retrieve(); }} onClose={() => setViewTarget(null)} />
      <Chk03_Edit_Reason model={reasonTarget} onSaved={onTextSaved} onClose={() => setReasonTarget(null)} />
      <Chk03_Edit_Note model={noteTarget} onSaved={onTextSaved} onClose={() => setNoteTarget(null)} />
      <Chk01_Lookup_ClassTree open={classOpen} mode="open" classTreeId={classTreeModel?.classTreeId} onResult={onClassResult} onClose={() => setClassOpen(false)} />
    </div>
  );
};
