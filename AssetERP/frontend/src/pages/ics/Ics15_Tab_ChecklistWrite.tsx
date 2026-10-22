/**
 * 내부통제 체크리스트 작성 (K05) — 준법감시 > 30. 내부통제 체크리스트 > 내부통제 체크리스트 작성 #1229
 * AS-IS: myApp/client/vi/ics/Ics15_Tab_ChecklistWrite.java (727줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L92-127: center = vlc = 툴바({기준년도}{월/분기} 대분류 · 중분류 · 검색 "대분류/중분류/체크내용/근거" · 미체크 보기 · [조회][제출][제출취소][새로작성]) / 그리드.
 * 회사의 체크주기(M 월 / Q 분기)로 콤보 종류를 정하고 기준을 지난 달(분기)로 둔다. 열 때 자동 조회는 없다(원본 그대로 — 콤보를 고르거나 [조회]).
 * 체크 한 번마다 저장한다(E13). 제출한 뒤에도 답은 바꿀 수 있다(원본은 확인된 행만 막는다 — 준수확인서 K01과 다름).
 * [E12 생략] sendMailButton[메일발송]은 원본도 툴바에 안 붙인 도달 불가.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, message, Modal, Select, Space } from 'antd';
import type { CellValueChangedEvent } from 'ag-grid-community';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklistClassCode, IcsChecklistWrite, IcsChecklistWriteItem } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';
import { Ics15_Edit_Reason } from './Ics15_Edit_Reason';
import { defaultPeriod, getDate } from './icsComplyPeriod';

/** 그리드 행 — 예·아니오·해당없음 체크박스 값은 답변 코드(Y·N·X)에서 정한다 (AS-IS Ics10_ChecklistModel.getYes/getNo/getNot) */
type Row = IcsChecklistWrite & { yes: boolean; no: boolean; not: boolean };
const gb = gbFor<Row>();
const ALL = '%';  // 대분류·중분류 "전체"

const toRow = (r: IcsChecklistWrite): Row => ({ ...r, yes: r.answerCode === 'Y', no: r.answerCode === 'N', not: r.answerCode === 'X' });
const merge = (r: Row, item: IcsChecklistWriteItem): Row => toRow({
  ...r, checklistWriteId: item.checklistWriteId, answerCode: item.answerCode, reason: item.reason, fixYn: item.fixYn, confirmYn: item.confirmYn,
});

const MSG_CONFIRMED = '담당자가 확인처리한 체크리스트로 수정이 불가능합니다';
const ANSWER_CODE = { yes: 'Y', no: 'N', not: 'X' } as const;

export const Ics15_Tab_ChecklistWrite: React.FC = () => {
  const [cycleType, setCycleType] = useState<string | null>(null);  // enable(cycleType) — null이면 화면 비활성
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [period, setPeriod] = useState('');
  const [lClass, setLClass] = useState(ALL);
  const [mClass, setMClass] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [checkBox, setCheckBox] = useState(false);  // "미체크 보기"
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);  // fixChk 동안 [제출][제출취소] 비활성
  const [reasonTarget, setReasonTarget] = useState<IcsChecklistWriteItem | null>(null);
  const [viewTarget, setViewTarget] = useState<ChecklistEditTarget | null>(null);
  const view = useRef({ cycleType, year, period, lClass, mClass, searchText, checkBox, rows });
  view.current = { cycleType, year, period, lClass, mClass, searchText, checkBox, rows };

  // [E0] 화면 열림 (생성자 L92-127) → settings()
  // settings() L129-351 / enable() L506-565: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다. 설정이 없으면 안내하고 화면을 끈다
  useEffect(() => {
    icsApi.getChecklistWriteCycleType().then(c => {
      if (c === 'M' || c === 'Q') {
        const d = defaultPeriod(c);
        setCycleType(c); setYear(String(d.year)); setPeriod(d.period);
      } else {
        message.warning('체크주기가 설정되어있지않습니다. 관리자에게 연락해주세요');
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
    icsApi.searchChecklistMCodes(null).then(setMCodes).catch(() => undefined);
  }, []);

  const enabled = cycleType != null && period !== '';
  const stdDate = () => (cycleType == null ? null : getDate(view.current.year, view.current.period, cycleType)?.format('YYYY-MM-DD') ?? null);
  const stdDateText = () => {
    const d = stdDate();
    if (!d) message.warning('기준년도를 4자리 숫자로 입력하세요.');
    return d;
  };
  const yyyymm = () => getDate(view.current.year, view.current.period, view.current.cycleType ?? 'M')?.format('YYYY.MM') ?? null;

  // [E1] yyyyText.ValueChange (L158) / [E2] periodComboBox[MonthsCode].ValueChange (L172) → getDate(): 기준이 바뀌면 그 기준일로 대분류 콤보를 다시 읽는다
  useEffect(() => {
    const d = cycleType == null ? null : getDate(year, period, cycleType)?.format('YYYY-MM-DD');
    if (cycleType != null && period !== '' && !d) return;
    icsApi.searchChecklistLCodes(d ?? undefined).then(setLCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [cycleType, year, period]);

  // [E7] retrieveButton[조회].Select (L246) → retrieve() L427-464: ics.Ics10_Checklist.selectByPersonId (대분류·중분류 id, "%검색어%", 미체크 보기)
  const retrieve = useCallback(async (over?: { l?: string; m?: string; checkBox?: boolean }): Promise<Row[] | null> => {
    const std = stdDateText();
    if (!std) return null;
    const v = view.current;
    const l = over?.l ?? v.lClass;
    const m = over?.m ?? v.mClass;
    setLoading(true);
    try {
      const list = (await icsApi.searchChecklistWrites({
        stdDate: std,
        cycleType: v.cycleType ?? 'M',
        checklistLClassId: l === ALL ? null : Number(l),
        checklistMClassId: m === ALL ? null : Number(m),
        searchText: v.searchText,
        checkBox: over?.checkBox ?? v.checkBox,
      })).map(toRow);
      setRows(list);
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // [E3] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L201) → 중분류를 "전체"로 되돌리고 refreshCode() L488-504:
  //   고른 대분류의 중분류 콤보를 다시 읽고 retrieve()
  const refreshCode = async (l: string) => {
    setLClass(l);
    setMClass(ALL);
    try {
      setMCodes(await icsApi.searchChecklistMCodes(l === ALL ? null : Number(l), stdDate() ?? undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await retrieve({ l, m: ALL });
  };

  /** 목록을 서버가 알려 준 작성 행으로 되돌린다(고칠 수 없는 행을 눌렀거나 저장이 실패했을 때) */
  const revert = () => setRows(prev => prev.map(toRow));

  // [E13] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L286): 예·아니오·해당없음 체크 → 확인된 행은 되돌리고 안내, 아니면
  // 그 답변으로 ics.Ics15_ChecklistWrite.updateAnswerCode (작성 행이 없으면 서버가 만든다). 체크를 풀어도 답변은 그대로다(AS-IS setYes 등이 답변 코드를 다시 넣는다)
  const onCellValueChanged = async (e: CellValueChangedEvent<Row>) => {
    const field = e.colDef.field as keyof typeof ANSWER_CODE | undefined;
    if (!field || !(field in ANSWER_CODE) || !e.data) return;
    const row = e.data;
    if (row.confirmYn) { revert(); message.info(MSG_CONFIRMED); return; }
    try {
      const ym = yyyymm();
      if (!ym) { revert(); return; }
      const item = await icsApi.updateChecklistWriteAnswer(row.checklistId, ANSWER_CODE[field], ym, view.current.cycleType ?? 'M');
      setRows(prev => prev.map(r => (r.checklistId === row.checklistId ? merge(r, item) : r)));
    } catch (err) {
      revert();
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // buildGrid() L353-425 editCell(수정 아이콘): 확인된 행은 안내, 작성 행이 없으면 답변 없이 만들고(modelUpdate) lookupReason() L567-590: selectById → 사유 창
  const editReason = async (row: Row) => {
    if (row.confirmYn) { message.info(MSG_CONFIRMED); return; }
    const ym = yyyymm();
    if (!ym) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    try {
      let writeId = row.checklistWriteId;
      if (writeId == null) {
        const created = await icsApi.createChecklistWrite(row.checklistId, ym, view.current.cycleType ?? 'M');
        writeId = created.checklistWriteId;
        setRows(prev => prev.map(r => (r.checklistId === row.checklistId ? merge(r, created) : r)));
      }
      setReasonTarget(await icsApi.getChecklistWrite(writeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E8] fixButton[제출].Select (L252) / [E9] cancelButton[제출취소].Select (L258) → fixChk() L598-662
  // preFixCheck() L592-596: 제출·제출취소 전에 "미체크 보기"를 끄고 최신 데이터로 다시 조회한 뒤 검사한다
  const fixChk = async (check: boolean) => {
    setBusy(true);
    try {
      setCheckBox(false);
      const list = await retrieve({ checkBox: false });
      if (!list) return;
      for (const model of list) {
        if (check) {
          if (model.checklistWriteId == null) { message.info('미완료된 문항이 있습니다'); return; }
          if (model.fixYn) { message.info('이미 제출이 완료되었습니다'); return; }
        } else if (model.confirmYn) {
          message.info('담당자가 확인처리한 체크리스트로 제출취소가 불가능합니다');
          return;
        }
      }
      try {
        await icsApi.updateChecklistWriteFix(check, list.map(m => m.checklistWriteId).filter((id): id is number => id != null));
        message.info(check ? '체크리스트 제출이 완료되었습니다' : '체크리스트 제출이 취소되었습니다');
        await retrieve();
      } catch (err) {
        message.error(errorMessage(err, '저장 실패'));
      }
    } finally {
      setBusy(false);
    }
  };

  // [E10] deleteButton[새로작성].Select (L264): HtmlMessageBox "확인"/"작성한 내역을 삭제하시겠습니까?"(폭 350)
  const preDelete = () => {
    Modal.confirm({
      title: '확인',
      content: '작성한 내역을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => remove(),  // [E11] messageBox.DialogHide [YES] (L268) → delete()
    });
  };

  // delete() L466-486: ics.Ics15_ChecklistWrite.deleteByPersonId — 작성내역이 없거나 확인이 끝난 내역이 있으면 서버가 거절한다
  const remove = async () => {
    const std = stdDateText();
    if (!std) return;
    try {
      await icsApi.deleteChecklistWrites(std, view.current.cycleType ?? 'M');
      message.info('삭제가 완료되었습니다.');
      await retrieve();
    } catch (err) {
      message.info(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L353-425 — 열 순서·폭·제목은 원본 그대로. 예·아니오·해당없음은 "체크" 묶음 헤더 아래
  const columnDefs = [
    gb.text('checkLClassName', 150, '대분류'),
    gb.text('checkMClassName', 200, '중분류'),
    gb.textArea('content', 500, '체크대상'),
    // View 아이콘: Ics10_Edit_Checklist.open(selectModel, callback → retrieve())
    iconCell<Row>('view', 'viewCell', 40, ' ', row => setViewTarget({ model: row })),
    gb.group('체크', [
      gb.boolean('yes', 70, '예', { editable: true }),
      gb.boolean('no', 70, '아니오', { editable: true }),
      gb.boolean('not', 70, '해당없음', { editable: true }),
    ]),
    gb.textArea('reason', 250, '체크내용'),
    iconCell<Row>('edit', 'editCell', 40, ' ', row => { void editReason(row); }),
    gb.booleanYn('fixYn', 50, '제출<br>여부'),
    gb.booleanYn('confirmYn', 50, '확인<br>여부'),
  ];

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
        ...(cycleType == null ? { pointerEvents: 'none', opacity: 0.5 } : {}) }}>
        <SearchBar
          onSearch={() => retrieve()}
          disabled={!enabled}
          extra={
            <>
              <Button type="save" disabled={!enabled || busy} onClick={() => fixChk(true)}>제출</Button>
              <Button type="cancel" disabled={!enabled || busy} onClick={() => fixChk(false)}>제출취소</Button>
              <Button type="view" disabled={!enabled} onClick={preDelete}>새로작성</Button>
            </>
          }
        >
          <Space size={6}>
            <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            {cycleType != null && (
              <SystemCodeComboBox
                kindCd={cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                style={{ width: 80 }}
                allowClear={false}
                value={period}
                onChange={code => { if (code) setPeriod(code); }}
              />
            )}
          </Space>
          <SearchBar.Field label="대분류">
            <Select style={{ width: 180 }} value={lClass} onChange={v => { void refreshCode(v); }}
              options={[{ value: ALL, label: '전체' }, ...lCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="중분류">
            {/* [E4] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L219) → retrieve() */}
            <Select style={{ width: 230 }} value={mClass} onChange={v => { setMClass(v); void retrieve({ m: v }); }}
              options={[{ value: ALL, label: '전체' }, ...mCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E5] searchText.KeyPress [Enter] (L228) → retrieve() — SearchBar.Input의 Enter가 조회 */}
            <SearchBar.Input style={{ width: 250 }} placeholder="대분류/중분류/체크내용/근거" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          {/* [E6] checkBox[미체크 보기].ValueChange (L239) → retrieve() */}
          <Checkbox checked={checkBox} onChange={e => { setCheckBox(e.target.checked); void retrieve({ checkBox: e.target.checked }); }}>미체크 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Row>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.checklistId)}
            loading={loading}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
      {/* 사유 창: 저장하면 그 행의 작성 행(사유)을 바꾼다 */}
      <Ics15_Edit_Reason
        model={reasonTarget}
        onSaved={item => setRows(prev => prev.map(r => (r.checklistId === item.checklistId ? merge(r, item) : r)))}
        onClose={() => setReasonTarget(null)}
      />
      {/* 체크리스트 보기 창(읽기 전용) — 닫으면 다시 조회 */}
      <Ics10_Edit_Checklist target={viewTarget} readOnly onClosed={() => { void retrieve(); }} onClose={() => setViewTarget(null)} />
    </div>
  );
};
