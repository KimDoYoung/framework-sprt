/**
 * 내부통제 준수확인서 작성 (K01) — 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수확인서 작성 #1310
 * AS-IS: myApp/client/vi/ics/Ics31_Tab_ComplianceWrite.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L82-110: center = vlc = 툴바(기준 분기(월): 기준년도 · 월/분기 콤보 · 미체크 보기 · [조회][제출][제출취소] · [새로작성] · [엑셀다운로드]) / 그리드.
 * 회사의 체크주기(M 월 / Q 분기)로 콤보 종류를 정하고 기준을 지난 달(분기)로 둔다. 열 때 자동 조회는 없다(원본 그대로 — [조회]를 눌러야 한다).
 * 체크 한 번마다 저장한다(E8). 엑셀은 RD 리포트 서버(Ics31_Rd_ComplianceWrite) 대신 서버가 한 시트 xlsx로 만든다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import type { CellValueChangedEvent, ICellRendererParams } from 'ag-grid-community';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsComplianceWrite, IcsComplianceWriteItem } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Ics31_Edit_Reason } from './Ics31_Edit_Reason';
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

export const Ics31_Tab_ComplianceWrite: React.FC = () => {
  const [cycleType, setCycleType] = useState<string | null>(null);  // enable(cycleType) — null이면 화면 비활성
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [period, setPeriod] = useState('');
  const [checkBox, setCheckBox] = useState(false);  // "미체크 보기"
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());  // 접은 분류
  const [reasonTarget, setReasonTarget] = useState<IcsComplianceWriteItem | null>(null);
  const view = useRef({ cycleType, year, period, checkBox, rows });
  view.current = { cycleType, year, period, checkBox, rows };

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
  }, []);

  const enabled = cycleType != null && period !== '';
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
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 목록을 서버가 알려 준 작성 행으로 되돌린다(고칠 수 없는 행을 눌렀거나 저장이 실패했을 때) */
  const revert = () => setRows(prev => prev.map(toRow));

  // [E8] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L214): 예·아니오·해당없음 체크 → 확인/제출된 행은 되돌리고 안내, 아니면
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
    try {
      await icsApi.updateComplianceWriteFix(check, list.map(m => m.complianceWriteId).filter((id): id is number => id != null));
      message.info(check ? '준수확인서 제출이 완료되었습니다' : '준수확인서 제출이 취소되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E6] deleteButton[새로작성].Select (L176) → preDelete() L514-532: ConfirmBox "확인"/"작성한 내역을 삭제하시겠습니까?"(폭 350)
  const preDelete = () => {
    Modal.confirm({
      title: '확인',
      content: '작성한 내역을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => remove(),  // [E9] msgBox.DialogHide [YES] (L517) → delete()
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

  // [E7] excelDownloadButton[엑셀다운로드].Select (L182) → 확인된 항목이 하나도 없으면 안내, 있으면 downLoad() L556-607 (RD 대신 서버 xlsx)
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
    gb.booleanYn('fixYn', 80, '제출여부'),
    gb.booleanYn('confirmYn', 80, '확인여부'),
    gb.text('confirmerName', 80, '확인자'),
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
              <Button type="save" disabled={!enabled} onClick={() => fixChk(true)}>제출</Button>
              <Button type="cancel" disabled={!enabled} onClick={() => fixChk(false)}>제출취소</Button>
              <Button type="view" disabled={!enabled} onClick={preDelete}>새로작성</Button>
              <Button type="download" disabled={!enabled} onClick={excelDownload}>엑셀다운로드</Button>
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
                onChange={code => { if (code) setPeriod(code); }}
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
    </div>
  );
};
