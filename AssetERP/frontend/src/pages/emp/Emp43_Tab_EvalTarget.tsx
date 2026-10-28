/**
 * [1392] 경영관리 > 05. 인사평가 > 인사평가 대상자 (T01)
 * AS-IS: myApp/client/vi/emp/Emp43_Tab_EvalTarget.java (735줄) + Emp43_Lookup_SelectSingle(272줄) + Emp43_Lookup_SelectMulti(206줄) + Emp43_Edit_ChangeEval(201줄)
 *   + Emp00_Lookup_SelectSingle(공용)·Org00_Lookup_SelectSingle(공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L1-735 / settings() L129-229: 위 툴바 50 = 평가기간 [년도 45] 년 [상반기/하반기 콤보 100] [조직 150 "전체"] [조회][저장][등록][삭제] [평가자 변경(선택)],
 *   아래 = 인사평가 대상자 셀 편집 그리드(행번호, 체크박스 다중, 2단 헤더: 인사평가 대상자(구분 80 · 직위 80 · 성명 80 · 부서 180) · 1차 평가자(직책 180 · 성명 80 · 비중(%) 80) · 2차 평가자(같은 열) · 평가비중 합계(%) 80 · 진행상태 100)
 * 처음에는 [저장]·[등록]·[삭제]가 비활성 — 조회가 끝나면(checkFinalApprStatus L515-549) 최종 결재가 완료(30)가 아닐 때만 활성
 * 평가기간 콤보는 회사 설정(sys01 인사평가 평가기간)이 05(반기별)일 때만 켜지고, 아니면 "전체" 비활성 + 조회는 기간코드 "10"
 * 스타일: SGP (견본 — docs/page-style.md). UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 조건이 3개지만 한 줄에 다 들어가지 않아 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalSetting, EvalTarget, OrgInfo, TransInfo } from '@/types/emp';
import { useLoginUser } from '@/hooks/useLoginUser';
import { useGridCrud, editableCol } from '@/hooks/useGridCrud';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import { SearchBar } from '@/components/search';
import { Emp43_Edit_ChangeEval } from './Emp43_Edit_ChangeEval';
import { Emp43_Lookup_SelectMulti, EvalCandidateResult } from './Emp43_Lookup_SelectMulti';
import { Emp43_Lookup_SelectSingle } from './Emp43_Lookup_SelectSingle';

const gb = gbFor<EvalTarget>();

/** setHtmlGridStyle(제목, 색) L723-726 — 굵은 글씨 + 색 */
const FIRST = { color: '#456EA6', fontWeight: 'bold' };
const SECOND = { color: '#DD5E5E', fontWeight: 'bold' };

/** 진행상태가 상신중·완료면 고칠 수 없다 (L561·L660·L706) */
const isLocked = (r: EvalTarget) => r.status === '상신중' || r.status === '완료';

/** 비중이 비면 0으로 본다 (L585-593) */
const num = (v: number | null | undefined) => v ?? 0;

export const Emp43_Tab_EvalTarget: React.FC = () => {
  const user = useLoginUser();
  // settings() L129-229: 기준 = 이번 달 1일의 전날(지난달) — 년도, 1~6월이면 상반기 아니면 하반기
  const initDate = useMemo(() => dayjs().startOf('month').subtract(1, 'day'), []);
  const [stdYear, setStdYear] = useState(initDate.format('YYYY'));
  const [termCode, setTermCode] = useState<string | undefined>(initDate.month() < 6 ? '20' : '30');
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);
  const [setting, setSetting] = useState<EvalSetting | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [lookupTarget, setLookupTarget] = useState<{ orderNum: '1' | '2'; model: EvalTarget } | null>(null);
  const [changeTargets, setChangeTargets] = useState<EvalTarget[] | null>(null);

  // 조회 조건을 동기로 들고 있는다 (이벤트에서 상태 반영 전 값으로 조회하려고)
  const query = useRef({ stdYear, termCode, orgId, cycle: null as string | null });
  const committedYear = useRef(stdYear);
  const deleteWrites = useRef(false);
  const cycle05 = () => query.current.cycle === '05';
  /** 조회·등록이 쓰는 평가기간 코드 (L498-503) */
  const stdTermCd = () => (cycle05() ? query.current.termCode ?? null : '10');

  const search = useCallback(
    () => empEvalApi.searchEvalTargets(query.current.stdYear, query.current.cycle === '05' ? query.current.termCode ?? '' : '10', query.current.orgId),
    [],
  );

  /** 저장 전 검사 L551-630 (순서까지 원본 그대로) */
  const validateRows = useCallback((changed: EvalTarget[]): string | undefined => {
    for (const m of changed) {
      if (isLocked(m)) return '완료건이 포함되어있습니다';
      if (m.firstEvaluatorId == null) return '1차 평가자는 필수선택항목입니다';
      if (m.firstEvalWeight == null) return '1차 평가자의 비중(%)은 필수입력항목입니다';
      if (m.secondEvaluatorId != null && m.secondEvalWeight == null) return '2차 평가자의 비중(%)은 필수입력항목입니다';
      if (num(m.firstEvalWeight) + num(m.secondEvalWeight) !== 100) return '평가비중 합계는 100(%)이어야합니다';
    }
    return undefined;
  }, []);

  const rowsRef = useRef<EvalTarget[]>([]);
  const crud = useGridCrud<EvalTarget>({
    idField: 'evalTargetId',
    search,
    // update L642-650 / updateList L632-640: 진행중인 행이 있어 확인한 경우(deleteWrites)만 바뀐 평가자의 작성 내역을 지운다
    save: rows => empEvalApi.saveEvalTargets(rows, deleteWrites.current),
    // deleteList L685-694: 화면에 보이는 평가자 값을 함께 보낸다
    remove: async ids => { await empEvalApi.deleteEvalTargets(rowsRef.current.filter(r => ids.includes(r.evalTargetId))); },
    newRow: () => ({ companyId: user.companyId, status: '' }),
    deleteConfirm: '삭제하시겠습니까?',  // deleteChk L652-683 "삭제하시겠습니까?"
    validate: validateRows,
  });
  rowsRef.current = crud.rows;

  // checkFinalApprStatus() L515-549: 결재 행이 없거나 최종 결재가 완료(30)가 아니면 [저장][등록][삭제] 활성
  const checkFinalApprStatus = useCallback(async () => {
    try {
      const status = await empEvalApi.getFinalApprStatus(query.current.stdYear, stdTermCd() ?? '');
      setCanEdit(status !== '30');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E4] retrieveButton[조회].Select (L199) → retrieve() L494-513
  const retrieve = useCallback(async () => {
    await crud.retrieve();
    await checkFinalApprStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crud.retrieve, checkFinalApprStatus]);

  // [E0] 화면 열림 (생성자 L97-127) → settings(): 서비스 sys.Sys01_Company.selectById(회사 평가기간 설정) → retrieve().
  //   원본은 설정 응답을 기다리지 않고 조회해 반기별 회사의 처음 조회가 기간코드 "10"으로 나갈 수 있다 — 설정을 읽은 뒤 조회한다(작업기록 결정)
  useEffect(() => {
    void (async () => {
      try {
        const s = await empEvalApi.getEvalSetting();
        setSetting(s);
        query.current.cycle = s.empEvalCycleCode;
        if (s.empEvalCycleCode !== '05') setTermCode(undefined);  // 비활성 + "전체"
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      await retrieve();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E2] dataYearText.ValueChange (L143) → retrieve()
  const onYearCommit = () => {
    if (stdYear === committedYear.current) return;
    committedYear.current = stdYear;
    query.current.stdYear = stdYear;
    void retrieve();
  };

  // [E3] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L193) → retrieve()
  const onTermChange = (code: string | undefined) => {
    setTermCode(code);
    query.current.termCode = code;
    void retrieve();
  };

  // [E1] orgName.TriggerClick (L133) → openLookupOrgInfo() L231-246: Org00_Lookup_SelectSingle.open(오늘, true, callback) — 고르면 조직, [전체](null)이면 비운다
  const onOrgResult = (org: OrgInfo | null) => {
    setOrgName(org?.korNm ?? '');
    setOrgId(org?.orgCodeId ?? null);
    query.current.orgId = org?.orgCodeId ?? null;
    setOrgOpen(false);
  };

  // [E5] insertButton[등록].Select (L205) → insertRow() L368-424 → insertRow(evalListStdId) L426-492
  const insertRow = async () => {
    if (cycle05() && termCode == null) { message.warning('상/하반기를 선택해주세요'); return; }
    // 평가기간 시작·종료일 (L376-401)
    const base = dayjs(`${stdYear}-${setting?.empEvalMonthCode ?? '01'}-01`);
    let start = base;
    let close = base.add(12, 'month').subtract(1, 'day');
    if (cycle05()) {
      if (termCode === '20') {  // 상반기
        close = start.add(6, 'month').subtract(1, 'day');
      } else if (termCode === '30') {  // 하반기
        start = base.add(6, 'month');
        close = start.add(6, 'month').subtract(1, 'day');
      }
    }
    insertDates.current = { start: start.format('YYYY-MM-DD'), close: close.format('YYYY-MM-DD') };
    try {
      // emp.Emp40_EvalListStd.getEvalListStdId(companyId(서버), startDate = 종료일)
      const evalListStdId = await empEvalApi.getAppliedEvalListStdId(insertDates.current.close);
      if (evalListStdId == null) { message.warning('인사평가항목을 먼저 등록해주세요'); return; }
      insertStdId.current = evalListStdId;
      setInsertOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  const insertDates = useRef({ start: '', close: '' });
  const insertStdId = useRef(0);

  // Emp43_Lookup_SelectMulti callback L426-492: 고른 사원마다 emp.Emp00_TransInfo.getHighInfo(상위 조직장) → 행 추가(변경으로 침)
  const onInsertResult = async ({ rows, firstWeight, secondWeight }: EvalCandidateResult) => {
    const { start, close } = insertDates.current;
    try {
      const inits: Partial<EvalTarget>[] = [];
      for (const m of rows) {
        const infos = await empEvalApi.getHighInfos(m.personId, m.orgCodeId, close);
        const init: Partial<EvalTarget> = {
          companyId: user.companyId, personId: m.personId, stdYear, evalListStdId: insertStdId.current,
          stdTermCd: stdTermCd() ?? '10', evalStartDate: start, evalCloseDate: close,
          orgHeadNm: m.orgHeadNm, posNm: m.posNm, personNm: m.korNm, orgNm: m.orgTitleNm, status: '',
        };
        if (infos[0]) {
          Object.assign(init, { firstOrgNm: infos[0].orgTitleNm, firstPersonNm: infos[0].korNm, firstEvaluatorId: infos[0].personId, firstEvalWeight: firstWeight, sumEvalWeight: firstWeight });
        }
        if (infos[1]) {
          Object.assign(init, { secondOrgNm: infos[1].orgTitleNm, secondPersonNm: infos[1].korNm, secondEvaluatorId: infos[1].personId, secondEvalWeight: secondWeight, sumEvalWeight: firstWeight + secondWeight });
        }
        inits.push(init);
      }
      crud.addRows(inits, true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E6] updateButton[저장].Select (L211) → updateChk() L551-630
  //   → [E11] msgBox.DialogHide [YES] (L611) → updateList() — 진행중인 인사평가내역이 있으면 확인(폭 450)
  const updateChk = () => {
    const changed = crud.getChanged();
    const invalid = validateRows(changed);
    if (invalid) { message.warning(invalid); return; }
    if (changed.some(m => m.status === '진행중')) {
      Modal.confirm({
        title: '확인',
        content: '진행중인 인사평가내역이 존재합니다. 저장하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 450,
        onOk: () => { deleteWrites.current = true; return crud.saveRows().finally(() => { deleteWrites.current = false; }); },
      });
    } else {
      deleteWrites.current = false;
      void crud.saveRows();
    }
  };

  // [E7] deleteButton[삭제].Select (L217) → deleteChk() L652-683 → [E12] msgBox.DialogHide [YES] (L667) → deleteList() L685-694
  const deleteChk = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 내용을 선택해주세요'); return; }
    if (checked.some(isLocked)) { message.warning('완료건이 포함되어있습니다'); return; }
    crud.deleteChecked();
  };

  // [E8] changeButton[평가자 변경(선택)].Select (L223) → changeChk() L696-721
  const changeChk = () => {
    if (crud.hasChanges()) { message.warning('저장 후 선택해주세요'); return; }
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('변경할 내용을 선택해주세요'); return; }
    if (checked.some(isLocked)) { message.warning('완료건이 포함되어있습니다'); return; }
    setChangeTargets(checked);
  };

  // [E9] lookup01.TriggerClick (L251)·[E10] lookup02.TriggerClick (L300) → Emp43_Lookup_SelectSingle.open("1"|"2", 선택한 행, callback)
  const openEvaluator = useCallback((orderNum: '1' | '2', model: EvalTarget) => {
    if (model.status === '완료') { message.warning('완료건은 수정이 불가능합니다'); return; }
    setLookupTarget({ orderNum, model });
  }, []);
  const openEvaluatorRef = useRef(openEvaluator);
  openEvaluatorRef.current = openEvaluator;

  const onEvaluatorResult = (row: TransInfo | null) => {
    if (!lookupTarget) return;
    const { orderNum, model } = lookupTarget;
    const id = model.evalTargetId;
    if (row == null) {  // [미선택] — 평가자·비중을 비운다 (L267-272·L316-321)
      crud.updateRow(id, orderNum === '1'
        ? { firstOrgNm: null, firstPersonNm: null, firstEvaluatorId: null, firstEvalWeight: null }
        : { secondOrgNm: null, secondPersonNm: null, secondEvaluatorId: null, secondEvalWeight: null });
      return;
    }
    const other = orderNum === '1' ? model.secondEvaluatorId : model.firstEvaluatorId;
    if (other != null && row.personId === other) { message.warning('1,2차 평가자는 중복지정할 수 없습니다'); return; }
    crud.updateRow(id, orderNum === '1'
      ? { firstOrgNm: row.orgKorNm, firstPersonNm: row.korNm, firstEvaluatorId: row.personId }
      : { secondOrgNm: row.orgKorNm, secondPersonNm: row.korNm, secondEvaluatorId: row.personId });
  };

  /** 조회창 트리거 열(LookupTriggerField) — 11 §1 */
  const triggerCell = (orderNum: '1' | '2') => (p: { data?: EvalTarget; value?: string | null }) => (
    <>
      <AntButton type="text" size="small" icon={<SearchOutlined />}
        onClick={e => { e.stopPropagation(); if (p.data) openEvaluatorRef.current(orderNum, p.data); }} />
      {p.value}
    </>
  );

  // buildGrid() L248-366
  const columnDefs = useMemo(() => [
    gb.group('인사평가 대상자', [  // HeaderGroupMap(0, 2, "인사평가 대상자", 1, 4) L330
      gb.textCenter('orgHeadNm', 80, '구분'),  // L333
      gb.textCenter('posNm', 80, '직위'),  // L334
      gb.textCenter('personNm', 80, '성명'),  // L335
      gb.textCenter('orgNm', 180, '부서'),  // L336
    ]),
    { ...gb.group('1차 평가자', [  // HeaderGroupMap(0, 6, …, 1, 3) L331
      gb.textCenter('firstOrgNm', 180, '직책', { headerStyle: FIRST }),  // L337
      gb.textCenter('firstPersonNm', 80, '성명', { headerStyle: FIRST, cellRenderer: triggerCell('1'), cellStyle: { color: '#1677ff' } }),  // L338 lookup01
      editableCol(gb.longCenter('firstEvalWeight', 80, '비중(%)', { editor: 'number', headerStyle: FIRST })),  // L339 LongField
    ]), headerStyle: FIRST },
    { ...gb.group('2차 평가자', [  // HeaderGroupMap(0, 9, …, 1, 3) L332
      gb.textCenter('secondOrgNm', 180, '직책', { headerStyle: SECOND }),  // L340
      gb.textCenter('secondPersonNm', 80, '성명', { headerStyle: SECOND, cellRenderer: triggerCell('2'), cellStyle: { color: '#1677ff' } }),  // L341 lookup02
      editableCol(gb.longCenter('secondEvalWeight', 80, '비중(%)', { editor: 'number', headerStyle: SECOND })),  // L342 LongField
    ]), headerStyle: SECOND },
    gb.longCenter('sumEvalWeight', 80, '평가비중<br>합계(%)'),  // L343
    gb.textCenter('status', 100, '진행상태'),  // L344
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E4] retrieveButton[조회].Select (L199) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        extra={
          <>
            <Button type="save" count={crud.changes} disabled={!canEdit} onClick={updateChk}>저장</Button>
            <Button type="register" disabled={!canEdit} onClick={insertRow}>등록</Button>
            <Button type="delete" disabled={!canEdit} onClick={deleteChk}>삭제</Button>
            <Button type="change" onClick={changeChk}>평가자 변경(선택)</Button>
          </>
        }
      >
        <SearchBar.Field label="평가기간">
          <Input style={{ width: 60 }} maxLength={4} value={stdYear} onChange={e => setStdYear(e.target.value)} onBlur={onYearCommit} onPressEnter={onYearCommit} />
          <span>년</span>
          <SystemCodeComboBox kindGroupCd="EmpEvalTermCode0001" style={{ width: 100 }} placeholder="전체" disabled={setting != null && setting.empEvalCycleCode !== '05'}
            value={termCode} onChange={onTermChange} />
        </SearchBar.Field>
        <SearchBar.Field label="조직">
          <LookupInput width={150} value={orgName} placeholder="전체" onOpen={() => setOrgOpen(true)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<EvalTarget> crud={crud} columnDefs={columnDefs} />
      </div>
      <Org00_Lookup_SelectSingle baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined} allButton onAll={() => onOrgResult(null)} onSelect={onOrgResult} onClose={() => setOrgOpen(false)} />
      <Emp43_Lookup_SelectMulti open={insertOpen} onResult={r => { void onInsertResult(r); }} onClose={() => setInsertOpen(false)} />
      <Emp43_Lookup_SelectSingle target={lookupTarget} onResult={onEvaluatorResult} onClose={() => setLookupTarget(null)} />
      <Emp43_Edit_ChangeEval targets={changeTargets} onChanged={() => { void retrieve(); }} onClose={() => setChangeTargets(null)} />
    </div>
  );
};
