/**
 * 내부통제 준수확인서 작성 (K01) — 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수확인서 작성 #1310
 * AS-IS: myApp/client/vi/ics/Ics31_Tab_ComplianceWrite.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L100-143: center = vlc = 툴바(왼쪽: 기준 분기(월): 기준년도 · 월/분기 콤보 · 미체크 보기 · [조회][제출][제출취소] · [새로작성] · [엑셀다운로드]
 *   / 오른쪽 500: 상신상태 · [결재요청][문서보기]) / 그리드.
 * 원본 2026-11-04·05(CH-0182): 회사 설정 임직원준수점검 상신자(complyApprRegEmpType)가 '1'(작성자)이면 [제출][제출취소]와 제출여부·확인여부·확인자 열을
 *   감추고, 작성자가 직접 [결재요청](링크 A53 "{기준}_임직원 내부통제 준수확인서 - 부서 이름")·[문서보기]를 한다. 아니면 지금처럼 [제출] 후 확인자가 #1311에서 상신.
 * 회사의 체크주기(M 월 / Q 분기)로 콤보 종류를 정하고 기준을 지난 달(분기)로 둔다. 열 때 자동 조회는 없다(원본 그대로 — [조회]를 눌러야 한다).
 * 체크 한 번마다 저장한다(E8). 엑셀은 RD 리포트 서버(Ics31_Rd_ComplianceWrite) 대신 서버가 한 시트 xlsx로 만든다.
 * UX보강(10): 툴바 = SearchBar(UX-01), 그룹 모두펼치기/접기 = ExpandCollapseButtons(UX-09)
 * 스타일: SGP (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal } from 'antd';
import type { CellValueChangedEvent, ICellRendererParams } from 'ag-grid-community';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsComplianceWrite, IcsComplianceWriteItem } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { ExpandCollapseButtons } from '@/components/button/ExpandCollapseButtons';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Ics31_Edit_Reason } from './Ics31_Edit_Reason';
import { Ics31_Lookup_Confirmer } from './Ics31_Lookup_Confirmer';
import { dcrApi } from '@/api/dcr';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Apr01_Lookup_ApprLink } from '../apr/Apr01_Lookup_ApprLink';
import { defaultPeriod, getDate } from './icsComplyPeriod';

/** 그리드 행 — 예·아니오·해당없음 체크박스 값은 답변 코드(Y·N·X)에서 정한다 (AS-IS Ics30_ComplianceModel.getYes/getNo/getNot) */
type Row = IcsComplianceWrite & { yes: boolean; no: boolean; not: boolean };
/** 표시용 행 — 분류가 바뀔 때 끼우는 그룹 헤더 행(AS-IS GXT GroupingView). 전체 폭 행으로 그린다 */
type DisplayRow = Row & { __group?: boolean; groupTitle?: string; collapsed?: boolean; toggle?: () => void };
const gb = gbFor<Row>();

const GroupHeader: React.FC<ICellRendererParams<DisplayRow>> = ({ data }) => (
  <div
    onClick={data?.toggle}
    style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 4, borderBottom: '1px solid #8fb4e3', cursor: 'pointer',
      color: '#15428b', fontWeight: 'bold', fontSize: 11 }}
  >
    <span style={{ display: 'inline-block', width: 9, height: 9, lineHeight: '7px', textAlign: 'center', fontSize: 10, border: '1px solid #8fa4c4', marginRight: 6 }}>
      {data?.collapsed ? '+' : '−'}
    </span>
    {data?.groupTitle}
  </div>
);

const toRow = (r: IcsComplianceWrite): Row => ({ ...r, yes: r.answerCode === 'Y', no: r.answerCode === 'N', not: r.answerCode === 'X' });
const merge = (r: Row, item: IcsComplianceWriteItem): Row => toRow({
  ...r, complianceWriteId: item.complianceWriteId, answerCode: item.answerCode, reason: item.reason, fixYn: item.fixYn, confirmYn: item.confirmYn,
});

const MSG_CONFIRMED = '담당자가 확인처리한 체크리스트로 수정이 불가능합니다';
const MSG_FIXED = '제출한 체크리스트는 수정이 불가능합니다';
const ANSWER_CODE = { yes: 'Y', no: 'N', not: 'X' } as const;
const LINK_CODE = 'A53';  // 임직원 내부통제 준수 점검(작성자) — insertLinkApprovals(classTreeModel, "A53", …)

/** insertLinkApproval()에 넘기는 값 — [결재요청]을 누른 시점의 기준 분기(월)와 고른 문서분류 */
interface LinkDoc { classTreeId: number; stdDate: string; cycleType: string; year: string; cycleName: string }

export const Ics31_Tab_ComplianceWrite: React.FC = () => {
  const [confirmTarget, setConfirmTarget] = useState<{ ids: number[]; std: string } | null>(null);  // 제출 중인 행들(확인자 선택창이 열린 동안)
  const [cycleType, setCycleType] = useState<string | null>(null);  // enable(cycleType) — null이면 화면 비활성
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [period, setPeriod] = useState('');
  const [checkBox, setCheckBox] = useState(false);  // "미체크 보기"
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());  // 접은 분류
  const [reasonTarget, setReasonTarget] = useState<IcsComplianceWriteItem | null>(null);
  const [periodName, setPeriodName] = useState('');  // periodComboBox.getText() — 결재 제목의 분기(월) 이름
  // 작성자 상신 (원본 2026-11-04·05)
  const [apprRegEmpType, setApprRegEmpType] = useState<string | null>(null);  // '1'이면 작성자가 결재요청
  const writerAppr = apprRegEmpType === '1';
  const [apprId, setApprId] = useState<number | null>(null);
  const [apprStepName, setApprStepName] = useState('');
  const [apprEnabled, setApprEnabled] = useState(false);
  const [apprViewEnabled, setApprViewEnabled] = useState(false);
  const [classPick, setClassPick] = useState<{ classTreeId: number | null } | null>(null);  // Dcr01_Lookup_Class 열린 동안
  const [linkDoc, setLinkDoc] = useState<LinkDoc | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [apprListIds, setApprListIds] = useState<number[] | null>(null);
  const view = useRef({ cycleType, year, period, periodName, checkBox, rows });
  view.current = { cycleType, year, period, periodName, checkBox, rows };

  // [E0] 화면 열림 (생성자 L82-110) → settings()
  // settings() L112-298 / enable() L300-348: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다. 설정이 없으면 안내하고 화면을 끈다
  useEffect(() => {
    icsApi.getComplianceWriteCycleType().then(c => {
      if (c === 'M' || c === 'Q') {
        const d = defaultPeriod(c);
        setCycleType(c); setYear(String(d.year)); setPeriod(d.period);
      } else {
        message.warning('체크주기가 설정되어있지않습니다. 관리자에게 연락해주세요');
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
    icsApi.getComplianceApprRegEmpType().then(setApprRegEmpType).catch(() => setApprRegEmpType(null));
  }, []);

  const enabled = cycleType != null && period !== '';

  // apprChk() L761-805: ics.Ics32_RelateAppr.selectApprCheck(apprType 2, linkCode A53) — 없으면 미상신, 반려(40)면 다시 상신 가능, 그 밖이면 문서보기만
  const apprChk = useCallback(async () => {
    const d = getDate(view.current.year, view.current.period, view.current.cycleType ?? 'M');
    if (!d) return;
    try {
      const r = await icsApi.getComplianceWriteAppr(d.format('YYYY-MM-DD'), view.current.cycleType ?? 'M');
      if (!r || r.statusCode == null) {
        setApprStepName('미상신'); setApprId(null); setApprEnabled(true); setApprViewEnabled(false);
      } else {
        setApprStepName(r.statusName ?? ''); setApprId(r.apprId); setApprEnabled(r.statusCode === '40'); setApprViewEnabled(true);
      }
    } catch {
      setApprStepName('미상신'); setApprId(null); setApprEnabled(true); setApprViewEnabled(false);  // AS-IS result.getStatus() != 1
    }
  }, []);
  const stdDateText = () => {
    const d = getDate(view.current.year, view.current.period, view.current.cycleType ?? 'M');
    if (!d) message.warning('기준년도를 4자리 숫자로 입력하세요.');
    return d?.format('YYYY-MM-DD') ?? null;
  };

  // [E3] retrieveButton[조회].Select (L158) → retrieve() L431-454: ics.Ics30_Compliance.selectByPersonId (searchText "%")
  const retrieve = useCallback(async (overrideCheckBox?: boolean): Promise<Row[] | null> => {
    const std = stdDateText();
    if (!std) return null;
    setLoading(true);
    try {
      const list = (await icsApi.searchComplianceWrites(std, view.current.cycleType ?? 'M', overrideCheckBox ?? view.current.checkBox)).map(toRow);
      setRows(list);
      void apprChk();  // 원본 2026-11-05: 조회가 끝나면 상신 상태를 읽는다
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [apprChk]);

  /** 목록을 서버가 알려 준 작성 행으로 되돌린다(고칠 수 없는 행을 눌렀거나 저장이 실패했을 때) */
  const revert = () => setRows(prev => prev.map(toRow));

  // [E10] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L247): 예·아니오·해당없음 체크 → 확인/제출된 행은 되돌리고 안내, 아니면
  // 그 답변으로 ics.Ics31_ComplianceWrite.updateAnswerCode. '해당없음'을 못 쓰는 항목이면 안내하고 답변을 비운다
  const onCellValueChanged = async (e: CellValueChangedEvent<Row>) => {
    const field = e.colDef.field as keyof typeof ANSWER_CODE | undefined;
    if (!field || !(field in ANSWER_CODE) || !e.data) return;
    const row = e.data;
    if (row.confirmYn) { revert(); message.info(MSG_CONFIRMED); return; }
    if (row.fixYn) { revert(); message.info(MSG_FIXED); return; }
    let answerCode: string | null = ANSWER_CODE[field];
    if (field === 'not' && row.naUseYn !== 'true') {
      answerCode = null;
      message.info("해당 항목은 '해당없음'을 선택할 수 없습니다");
    }
    try {
      const yyyymm = getDate(view.current.year, view.current.period, view.current.cycleType ?? 'M')?.format('YYYY.MM');
      if (!yyyymm) { revert(); return; }
      const item = await icsApi.updateComplianceWriteAnswer(row.complianceId, answerCode, yyyymm, view.current.cycleType ?? 'M');
      setRows(prev => prev.map(r => (r.complianceId === row.complianceId ? merge(r, item) : r)));
    } catch (err) {
      revert();
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // 분류(complianceTypeName)가 바뀔 때마다 그룹 헤더 행을 끼우고, 접은 분류의 문항은 뺀다 (저장·제출은 평면 rows를 그대로 쓴다)
  const displayRows = useMemo<DisplayRow[]>(() => {
    const out: DisplayRow[] = [];
    let prev: string | null | undefined;
    rows.forEach((r, i) => {
      const type = r.complianceTypeName ?? '';
      if (i === 0 || type !== prev) {
        const closed = collapsed.has(type);
        out.push({ ...r, complianceId: -(i + 1), __group: true, groupTitle: type, collapsed: closed,
          toggle: () => setCollapsed(c => { const n = new Set(c); if (n.has(type)) n.delete(type); else n.add(type); return n; }) });
        prev = type;
      }
      if (!collapsed.has(type)) out.push(r);
    });
    return out;
  }, [rows, collapsed]);

  // UX-09: 모두펼치기/모두접기 — 지금 목록에 있는 모든 분류를 비우거나 채운다
  const expandAll = () => setCollapsed(new Set());
  const collapseAll = () => setCollapsed(new Set(rows.map(r => r.complianceTypeName ?? '')));

  // 수정 아이콘 L350-429 (buildGrid의 editCell): 확인된 행은 안내, 작성 행이 없으면 답변 없이 만들고(modelUpdate), 있으면 읽어서(selectById) 사유 창을 연다
  const editReason = async (row: Row) => {
    if (row.confirmYn) { message.info(MSG_CONFIRMED); return; }
    const yyyymm = getDate(view.current.year, view.current.period, view.current.cycleType ?? 'M')?.format('YYYY.MM');
    if (!yyyymm) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    try {
      setReasonTarget(row.complianceWriteId == null
        ? await icsApi.createComplianceWrite(row.complianceId, yyyymm, view.current.cycleType ?? 'M')
        : await icsApi.getComplianceWrite(row.complianceWriteId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] fixButton[제출].Select (L164) / [E5] cancleButton[제출취소].Select (L170) → fixChk() L456-506
  // preFixCheck() L508-512: 제출·제출취소 전에 "미체크 보기"를 끄고 최신 데이터로 다시 조회한 뒤 검사한다
  const fixChk = async (check: boolean) => {
    setCheckBox(false);
    const list = await retrieve(false);
    if (!list) return;
    for (const model of list) {
      if (check) {
        if (model.answerCode == null) { message.info('미완료된 문항이 있습니다'); return; }
        if (model.fixYn) { message.info('이미 제출이 완료되었습니다'); return; }
      } else {
        if (!model.fixYn) { message.info('제출 전 입니다'); return; }
        if (model.confirmYn) { message.info('담당자가 확인처리한 체크리스트로 제출취소가 불가능합니다'); return; }
      }
    }
    const ids = list.map(m => m.complianceWriteId).filter((id): id is number => id != null);
    // 제출이면 확인자 선택창(Ics31_Lookup_Confirmer, EE75)을 열고, 고른 확인자로 updateFixYn() L548-590. 제출취소는 바로
    if (check) setConfirmTarget({ ids, std: stdDateText() ?? '' });
    else await updateFixYn(false, ids);
  };

  // updateFixYn() L548-590: (제출이면 확인자가 이미 부서장 준수확인서를 상신했는지 서버가 보고 거절) → ics.Ics31_ComplianceWrite.updateFixYn → 안내 → retrieve()
  const updateFixYn = async (check: boolean, ids: number[], confirm?: { confirmerId: number; stdDate: string; cycleType: string }) => {
    try {
      await icsApi.updateComplianceWriteFix(check, ids, confirm);
      message.info(check ? '준수확인서 제출이 완료되었습니다' : '준수확인서 제출이 취소되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E6] deleteButton[새로작성].Select (L222) → preDelete() L514-532: ConfirmBox "확인"/"작성한 내역을 삭제하시겠습니까?"(폭 350)
  const preDelete = () => {
    Modal.confirm({
      title: '확인',
      content: '작성한 내역을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => remove(),  // [E11] msgBox.DialogHide [YES] (L639) → delete()
    });
  };

  // delete() L534-554: ics.Ics31_ComplianceWrite.deleteByPersonId — 제출한 내역이 있으면 서버가 거절한다
  const remove = async () => {
    const std = stdDateText();
    if (!std) return;
    try {
      await icsApi.deleteComplianceWrites(std, view.current.cycleType ?? 'M');
      message.info('삭제가 완료되었습니다.');
      await retrieve();
    } catch (err) {
      message.info(errorMessage(err, '삭제 실패'));
    }
  };

  // [E7] apprButton[결재요청].Select (L228) → lastDcrChk() L807-825: ics.Ics32_RelateAppr.selectLastAppr — 지난 상신 문서의 문서분류가 있으면 그것으로,
  //   없으면 dcrChk(): dcr.Dcr30_Link.selectByLinkCode(A53) 첫 분류(없으면 빈칸)로 Dcr01_Lookup_Class → [확인] → insertLinkApproval()
  const lastDcrChk = async () => {
    setApprEnabled(false);  // apprButton.setEnabled(false)
    try {
      const last = await icsApi.getComplianceWriteLastClassTreeId();
      if (last != null) { setClassPick({ classTreeId: last }); return; }
      const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      setClassPick({ classTreeId: list.length === 0 ? null : list[0].classTreeId });
    } catch (err) {
      setApprEnabled(true);
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // insertLinkApproval() L869-905: ics.Ics30_Compliance.selectWriterReport → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A53", …) — 본문은 서버가 만든다(A53 seed)
  const insertLinkApproval = (classTreeId: number) => {
    const std = stdDateText();
    if (!std) { setApprEnabled(true); return; }
    const v = view.current;
    setLinkDoc({ classTreeId, stdDate: std, cycleType: v.cycleType ?? 'M', year: v.year, cycleName: v.periodName });
  };

  // updateApprId() L907-925: ics.Ics32_RelateAppr.insertApprId(apprType 2) → "상신완료 되었습니다" → apprChk()
  const updateApprId = async (newApprId: number) => {
    if (!linkDoc) return;
    try {
      await icsApi.insertComplianceWriteApprId(linkDoc.stdDate, linkDoc.cycleType, newApprId);
      message.success('상신완료 되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 연결하지 못했습니다'));
    } finally {
      setApprEnabled(true);
      void apprChk();
    }
  };

  // [E8] apprViewButton[문서보기].Select (L235) → apprView() L827-865: ics.Ics32_RelateAppr.selectApprList — 둘 이상이면 문서 목록 창(Apr01_Lookup_ApprLink),
  //   하나면 그 문서(Apr01_Edit_ApprDoc.retrieveApproval), 없으면 "문서가 조회되지 않습니다." — 닫으면 apprChk()
  const apprView = async () => {
    const std = stdDateText();
    if (!std) return;
    try {
      const ids = await icsApi.searchComplianceWriteApprIds(std, view.current.cycleType ?? 'M');
      if (ids.length > 1) setApprListIds(ids);
      else if (ids.length === 1) setViewApprId(apprId ?? ids[0]);
      else message.info('문서가 조회되지 않습니다.');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E9] excelDownloadButton[엑셀다운로드].Select (L241) → confirmCheck(): 확인된 항목이 하나도 없으면 안내, 있으면 downLoad() (RD 대신 서버 xlsx)
  const excelDownload = async () => {
    const std = stdDateText();
    if (!std) return;
    try {
      const list = await icsApi.searchComplianceWrites(std, view.current.cycleType ?? 'M', view.current.checkBox);
      if (!list.some(m => m.confirmYn)) { message.info('확인이 전부 완료된 뒤에 다운로드가 가능합니다.'); return; }
      const first = view.current.rows[0] ?? list[0];
      const fileName = `내부통제 준수확인서(${view.current.year}년 ${view.current.period}월)_${first?.orgName ?? ''} ${first?.personName ?? ''}`;
      await icsApi.downloadComplianceWriteExcel(std, view.current.cycleType ?? 'M', view.current.checkBox, fileName);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // buildGrid() L350-429 — 열 순서·폭·제목은 원본 그대로. 예·아니오·해당없음은 "체크" 묶음 헤더 아래
  const columnDefs = [
    gb.textArea('content', 800, '내용'),
    gb.group('체크', [
      gb.boolean('yes', 70, '예', { editable: true }),
      gb.boolean('no', 70, '아니오', { editable: true }),
      gb.boolean('not', 70, '해당없음', { editable: true }),
    ]),
    gb.textArea('reason', 300, '사유'),
    iconCell<Row>('edit', 'actionCell', 40, ' ', row => { void editReason(row); }),
    // 상신자가 작성자('1')가 아니면만 (원본 2026-11-05) — 폭·제목은 원본 최종
    ...(writerAppr ? [] : [
      gb.booleanYn('fixYn', 50, '제출<br>여부'),
      gb.booleanYn('confirmYn', 50, '확인<br>여부'),
      gb.textCenter('confirmerName', 90, '확인자'),
    ]),
  ];

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
        ...(cycleType == null ? { pointerEvents: 'none', opacity: 0.5 } : {}) }}>
        <SearchBar
          onSearch={() => retrieve()}
          disabled={!enabled}
          extra={
            <>
              {!writerAppr && <Button type="save" disabled={!enabled} onClick={() => fixChk(true)}>제출</Button>}
              {!writerAppr && <Button type="cancel" disabled={!enabled} onClick={() => fixChk(false)}>제출취소</Button>}
              <Button type="view" disabled={!enabled} onClick={preDelete}>새로작성</Button>
              <Button type="download" disabled={!enabled} onClick={excelDownload}>엑셀다운로드</Button>
              <ExpandCollapseButtons onExpandAll={expandAll} onCollapseAll={collapseAll} disabled={!enabled || rows.length === 0} />
              {/* buttonBarR (오른쪽, 상신자가 작성자일 때만): 상신상태 · [결재요청][문서보기] */}
              {writerAppr && (
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span>상신상태</span>
                  <Input readOnly style={{ width: 100 }} value={apprStepName} />
                  <Button type="register" disabled={!enabled || !apprEnabled} onClick={() => void lastDcrChk()}>결재요청</Button>
                  <Button type="view" disabled={!enabled || !apprViewEnabled} onClick={() => void apprView()}>문서보기</Button>
                </span>
              )}
            </>
          }
        >
          <SearchBar.Field label="기준 분기(월)">
            {/* [E1] yyyyText.ValueChange (L137) → yyyyStr 갱신. [E2] periodComboBox[MonthsCode].ValueChange (L147) → periodStr 갱신 (조회할 때 읽는다) */}
            <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            {cycleType != null && (
              <SystemCodeComboBox
                kindCd={cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                style={{ width: 80 }}
                allowClear={false}
                value={period}
                onLoad={codes => setPeriodName(codes.find(c => c.code === view.current.period)?.name ?? '')}
                onChange={(code, name) => { if (code) { setPeriod(code); setPeriodName(name ?? ''); } }}
              />
            )}
          </SearchBar.Field>
          <Checkbox checked={checkBox} onChange={e => setCheckBox(e.target.checked)}>미체크 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<DisplayRow>
            rowData={displayRows}
            isFullWidthRow={p => !!p.rowNode.data?.__group}
            fullWidthCellRenderer={GroupHeader}
            getRowHeight={p => (p.data?.__group ? 28 : undefined)}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.complianceId)}
            loading={loading}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
      {/* 사유 창: 저장하면 그 행의 작성 행(사유)을 바꾼다 */}
      <Ics31_Edit_Reason
        model={reasonTarget}
        onSaved={item => setRows(prev => prev.map(r => (r.complianceId === item.complianceId ? merge(r, item) : r)))}
        onClose={() => setReasonTarget(null)}
      />
      {/* 확인자 선택창(EE75): [확인]하면 고른 확인자로 제출, 닫으면 제출하지 않는다(AS-IS는 callback이 null이면 "확인자가 선택되지 않았습니다" — 닫기만으로는 callback이 안 불린다) */}
      <Ics31_Lookup_Confirmer
        open={confirmTarget != null}
        stdDate={confirmTarget?.std ?? ''}
        onResult={id => { if (confirmTarget) void updateFixYn(true, confirmTarget.ids, { confirmerId: id, stdDate: confirmTarget.std, cycleType: view.current.cycleType ?? 'M' }); }}
        onClose={() => setConfirmTarget(null)}
      />
      {/* 작성자 상신 (원본 2026-11-05): 문서분류 확인 → 결재창(A53) → 저장하면 insertApprId */}
      <Dcr01_Lookup_Class
        open={classPick != null}
        classTreeId={classPick?.classTreeId ?? null}
        onResult={r => { setClassPick(null); insertLinkApproval(r.classTreeId); }}
        onClose={() => { setClassPick(null); setApprEnabled(true); }}
      />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? {
          classTreeId: linkDoc.classTreeId,
          linkCode: LINK_CODE,
          args: { stdDate: linkDoc.stdDate, cycleType: linkDoc.cycleType, yyyy: linkDoc.year, cycleName: linkDoc.cycleName },
        } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void apprChk()}
        onClose={() => { setViewApprId(null); if (linkDoc) setApprEnabled(true); setLinkDoc(null); }}
      />
      <Apr01_Lookup_ApprLink apprIds={apprListIds} onClosed={() => void apprChk()} onClose={() => setApprListIds(null)} />
    </div>
  );
};
