/**
 * 전표등록·전표변경 편집창 (X01) — Act02_Tab_CreateJournal 의 [등록](NEW)과 그리드 [변경] 아이콘(MODI)이 연다
 * AS-IS: myApp/client/vi/act/Act02_Lookup_CreateJournal.java (680줄) + Act02_Lookup_JournalList (pages/act) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L104-120 / open() L139-158: 모달 1000×600, "NEW"면 "전표등록"(전표일자 입력 가능 · [불러오기] 보임), "MODI"면 "전표변경"(전표일자 막힘 · [불러오기] 숨김).
 * getEditor() L274-308: 라벨 폭 85, 전표일자·전표번호(막힘) · [불러오기] / 거래처(막힘, 트리거 = Sys15_Lookup_Corp) / 적요(TextArea 70)
 *   / 전표 = 툴바([차변 행추가][대변 행추가][행 삭제] ⟳ … 대차차액) + 셀 편집 그리드 250(구분·계정코드·계정과목·금액·관리계좌·적요), 아래 가운데 [저장][닫기]
 * 편집창 규격(11 §4a, modal 원칙): antd Modal + 머리말 아래 선·푸터 위 선, 라벨 오른쪽 정렬
 * NEW는 AS-IS가 위 그리드에 빈 행을 먼저 넣고 [닫기]에서 뺐지만, TOBE는 저장할 때 서버가 전표를 만들므로 닫기는 그냥 닫는다
 * 분개 편집은 Act02_Lookup_ModiJournal(W05 2단계)과 같은 규칙이다
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalTmp } from '@/types/act';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast01_Lookup_CorpAccount } from '../ast/Ast01_Lookup_CorpAccount';
import { FieldRow } from '../ast/Ast06_EditParts';
import { Act02_Lookup_JournalList } from './Act02_Lookup_JournalList';

const gb = gbFor<JournalTmp>();
const FORMAT = 'YYYY-MM-DD';
const LABEL = 85;
const ALL = '%';
const DR = '차변';
const CR = '대변';

/** 조회창 트리거 셀: 돋보기 + 값(LookupTriggerField) */
const triggerCell = (open: (row: JournalTmp) => void) => ({
  cellStyle: { color: '#1677ff' },
  cellRenderer: (p: { data?: JournalTmp; value?: string }) => (
    <>
      <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
      {p.value}
    </>
  ),
});

/** 구분 이름 → 차대 코드. 이름이 비면 가진 코드 (콤보를 바꿔도 코드가 따라가게) */
const typeOf = (r: JournalTmp) => (r.drcrTypeName === DR ? 'D' : r.drcrTypeName === CR ? 'C' : r.drcrType);

export type CreateJournalTarget = { mode: 'NEW' } | { mode: 'MODI'; journalId: number };

interface Props {
  /** 값이 있으면 열림 */
  target: CreateJournalTarget | null;
  /** 저장이 끝났다 (callback.execute(jnlModel) 뒤 hide) — 저장한 전표 ID */
  onSaved: (journalId: number) => void;
  onClose: () => void;
}

export const Act02_Lookup_CreateJournal: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const isNew = target?.mode === 'NEW';
  const modiId = target?.mode === 'MODI' ? target.journalId : null;
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [journalNo, setJournalNo] = useState<number | null>(null);
  const [fixYn, setFixYn] = useState(false);
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [accountTarget, setAccountTarget] = useState<{ row: JournalTmp; searchText?: string } | null>(null);
  const [depositRow, setDepositRow] = useState<JournalTmp | null>(null);
  const headLoaded = useRef(false);

  // retrieveJnl() L458-468: act.Act06_JournalTmp.selectByJournalId — 열 때(MODI)와 ⟳를 누를 때. 머리는 처음 한 번만 채운다(⟳는 그리드만 다시 읽는다). NEW는 읽을 전표가 없다
  const search = async () => {
    if (modiId == null) return [];
    const e = await actApi.getJournalEdit(modiId);
    if (!headLoaded.current) {
      headLoaded.current = true;
      setDate(dayjs(e.date)); setJournalNo(e.journalNo); setFixYn(e.fixYn);
      setCorpId(e.corpId); setCorpName(e.corpName); setNote(e.note);
    }
    return e.lines;
  };

  const crud = useGridCrud<JournalTmp>({
    idField: 'journalTmpId',
    search,
    save: async r => r,
    remove: async () => 0,
    newRow: () => ({ seq: null, drcrType: null, drcrTypeName: null, realAccountCode: null, realAccountName: null, reprAccountCode: null, accountMap: null, amt: 0, forAmt: 0, depositId: null, depositName: null, note: null }),
    firstEditField: 'realAccountCode',
  });

  // [E0] 화면 열림 (생성자 L104-120, open L139-158) → editDriver.edit(jnlModel), retrieveJnl()
  // openNew() L122-137: 새 전표 = 오늘 일자 · 통화 KRW
  useEffect(() => {
    if (!target) return;
    headLoaded.current = false;
    setDate(dayjs()); setJournalNo(null); setFixYn(false); setCorpId(null); setCorpName(null); setNote(null);
    crud.clear();
    if (modiId != null) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.mode, modiId, target != null]);

  // [E9] jnlGrid.getStore().StoreRecordChange (L259) → setDiffAmt() L393-419: 대차차액 = 대변 합계 − 차변 합계
  const diffAmt = crud.rows.reduce((sum, r) => sum + (typeOf(r) === 'C' ? (r.amt ?? 0) : typeOf(r) === 'D' ? -(r.amt ?? 0) : 0), 0);

  /** setAccount() L432-436 */
  const setAccount = (row: JournalTmp, code: string | null, name: string | null) => crud.updateRow(row.journalTmpId, { realAccountCode: code, realAccountName: name });

  // [E11] lookupAccountCode.ValueChange (L322): 글자를 지우면 비우고, 글자로 계정을 찾아(전표생성·사용 계정만) 반영, 없으면 조회창 (lookupAccount(searchText) L421-430)
  const accountTyped = useRef<(row: JournalTmp, text: string) => void>(() => undefined);
  accountTyped.current = async (row, text) => {
    if (text === '') { setAccount(row, null, null); return; }
    try {
      const list = await actApi.searchAccountCodes(ALL, text);
      if (list.length > 0) setAccount(row, list[0].accountCode, list[0].accountName);
      else setAccountTarget({ row, searchText: text });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  /** checkClose() L586-608: 처리일(전표일자)이 마감이면 AS-IS 메시지로 막는다 */
  const checkClose = async (): Promise<boolean> => {
    try {
      await actApi.checkLedgerClose(date.format(FORMAT));
      return true;
    } catch (err) {
      message.error(errorMessage(err, '마감 확인 실패'));
      return false;
    }
  };

  // [E4] insertDrRowButton[차변 행추가].Select (L218) · [E5] insertCrRowButton[대변 행추가].Select (L225) → insertRow(drcrType) L470-488: 마감 검사 뒤 맨 아래에 구분이 찬 빈 행
  const insertRow = async (type: 'D' | 'C') => {
    if (!(await checkClose())) return;
    crud.addRows([{ drcrType: type, drcrTypeName: type === 'D' ? DR : CR }], false);
  };

  // [E6] deleteRowButton[행 삭제].Select (L232) → deleteRow() L490-505: 선택이 없으면 안내 → 마감 검사 → 그리드에서 뺀다(저장까지 서버는 그대로)
  const deleteRow = async () => {
    const checked = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('선택된 행이 없습니다. 삭제할 전표를 선택해주세요.'); return; }
    if (!(await checkClose())) return;
    crud.removeRows(checked.map(r => r.journalTmpId));
  };

  // [E3] copyButton[불러오기].Select (L211) → journalCopy() L629-670: Act02_Lookup_JournalList에서 고른 전표의 거래처·적요와 임시분개 줄을 가져온다(줄이 있을 때만 그리드를 비우고 채운다)
  const journalCopy = async (journalId: number, corp: { id: number | null; name: string | null }, copyNote: string | null) => {
    setCorpId(corp.id); setCorpName(corp.name); setNote(copyNote);
    try {
      const e = await actApi.getJournalEdit(journalId);
      if (e.lines.length > 0) {
        crud.clear();
        crud.addRows(e.lines.map(l => ({
          seq: null, drcrType: l.drcrType, drcrTypeName: l.drcrTypeName, realAccountCode: l.realAccountCode, realAccountName: l.realAccountName,
          reprAccountCode: null, accountMap: null, amt: l.amt, forAmt: l.forAmt, depositId: l.depositId, depositName: l.depositName, note: null,
        })), false);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E7] updateButton[저장].Select (L238) → preUpdate() L507-553 → update() L555-584
  const preUpdate = async () => {
    if (fixYn) { message.warning('승인완료 전표입니다.'); return; }
    crud.gridRef.current?.api.stopEditing();
    if (!date) { message.warning('일자는 필수입력 항목입니다'); return; }
    for (const r of crud.rows) {
      if (!typeOf(r)) { message.warning('차/대 구분은 필수선택 항목입니다.'); return; }
      if (!r.realAccountCode) { message.warning('계정코드는 필수선택 항목입니다'); return; }
      if (!r.amt) { message.warning('금액은 필수입력 항목입니다'); return; }
    }
    if (diffAmt !== 0) { message.warning('차/대 금액이 다릅니다.'); return; }
    setSaving(true);
    try {
      // 마감 검사(act.Act04_GenLedger.checkClose)와 저장(act.Act02_Journal.updateAll)은 서버가 한 트랜잭션으로 한다. 줄 순서가 순번(10, 20, …)이 된다 (setSeq L610-618)
      const lines = crud.rows.map(r => ({
        drcrType: typeOf(r), realAccountCode: r.realAccountCode, reprAccountCode: r.reprAccountCode, accountMap: r.accountMap,
        amt: r.amt, forAmt: r.forAmt, depositId: r.depositId, note: r.note,
      }));
      let journalId: number;
      if (modiId != null) {
        await actApi.saveJournal(modiId, { corpId, note, lines });
        journalId = modiId;
      } else {
        journalId = await actApi.createJournalNew({ date: date.format(FORMAT), corpId, note, lines });
      }
      message.success('저장이 완료되었습니다.');
      onSaved(journalId);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // journalGrid() L310-391
  const columnDefs = [
    // [E12] comboDrCrType[DrcrType].Collapse (L351): 고른 이름의 차대 코드를 행에 넣고 대차차액을 다시 계산
    gb.textCenter('drcrTypeName', 55, '구분', {
      editor: 'select', values: [DR, CR],
      valueSetter: p => { p.data.drcrTypeName = p.newValue; p.data.drcrType = p.newValue === DR ? 'D' : p.newValue === CR ? 'C' : null; return true; },
    }),
    // [E10] lookupAccountCode.TriggerClick (L316) → lookupAccount(null)
    gb.textCenter('realAccountCode', 95, '계정코드', {
      editor: 'text',
      ...triggerCell(row => setAccountTarget({ row })),
      valueSetter: p => { p.data.realAccountCode = p.newValue; accountTyped.current(p.data, p.newValue ?? ''); return true; },
    }),
    gb.textArea('realAccountName', 250, '계정과목'),
    gb.long('amt', 100, '금액', { editor: 'number' }),
    // [E13] lookupDeposit.TriggerClick (L374) → lookupDeposit() L438-456: Ast01_Lookup_CorpAccount.open(전표일자, "NOT") — 고르지 않으면(선택안함) 비운다
    gb.text('depositName', 140, '관리계좌', triggerCell(row => setDepositRow(row))),
    gb.text('note', 145, '적요', { editor: 'text' }),
  ];

  if (!target) return null;

  return (
    <>
      <Modal
        open
        title={isNew ? '전표등록' : '전표변경'}
        width={1040}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
              {/* [E8] closeButton[닫기].Select ["NEW".equals(actionName)] (L244) → callback(null), hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <FieldRow label="전표일자" labelWidth={LABEL} width={300}>
              <DatePicker style={{ width: '100%' }} allowClear={false} disabled={!isNew} value={date} format={FORMAT} onChange={d => d && setDate(d)} />
            </FieldRow>
            <FieldRow label="전표번호" labelWidth={LABEL} width={300}><Input disabled value={journalNo ?? ''} /></FieldRow>
            {isNew && (
              <Button type="register" onClick={() => setListOpen(true)}>불러오기</Button>
            )}
          </div>
          <FieldRow label="거래처" labelWidth={LABEL} width={500}>
            {/* [E1] corpName[거래처].TriggerClick (L168) → Sys15_Lookup_Corp.open(true, true, …): 고르면 거래처를 넣고, [선택안함]이면 비운다 */}
            <Input readOnly value={corpName ?? ''} onClick={() => setCorpOpen(true)} style={{ cursor: 'pointer' }}
              suffix={<SearchOutlined onClick={() => setCorpOpen(true)} style={{ cursor: 'pointer' }} />} />
          </FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}>
            <Input.TextArea rows={3} maxLength={500} value={note ?? ''} onChange={e => setNote(e.target.value === '' ? null : e.target.value)} />
          </FieldRow>
          <FieldRow label="전표" labelWidth={LABEL}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button type="addRow" onClick={() => insertRow('D')}>차변 행추가</Button>
                <Button type="addRow" onClick={() => insertRow('C')}>대변 행추가</Button>
                <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
                {/* [E2] anchor.MouseDown (L192) → retrieveJnl() */}
                <AntButton type="text" size="small" title="다시 읽기" icon={<ReloadOutlined />} onClick={() => void crud.retrieve()} />
                <span style={{ flex: 1 }} />
                <span style={{ lineHeight: '32px' }}>대차차액</span>
                <Input readOnly style={{ width: 140, textAlign: 'right' }} value={diffAmt.toLocaleString('ko-KR')} />
              </div>
              <div style={{ height: 250 }}>
                <CellEditGrid<JournalTmp> crud={crud} columnDefs={columnDefs} />
              </div>
            </div>
          </FieldRow>
        </div>
      </Modal>
      <Sys15_Lookup_Corp open={corpOpen} regYn empYn
        onResult={corp => { setCorpId(corp?.corpId ?? null); setCorpName(corp?.corpName ?? null); setCorpOpen(false); }}
        onClose={() => setCorpOpen(false)} />
      <Act02_Lookup_JournalList open={listOpen}
        onResult={row => { setListOpen(false); void journalCopy(row.journalId, { id: row.corpId, name: row.corpName }, row.note); }}
        onClose={() => setListOpen(false)} />
      <Act01_Lookup_AccountCode open={accountTarget != null} searchText={accountTarget?.searchText}
        onResult={acc => { if (accountTarget) setAccount(accountTarget.row, acc.accountCode, acc.accountName); setAccountTarget(null); }}
        onClose={() => setAccountTarget(null)} />
      <Ast01_Lookup_CorpAccount open={depositRow != null} stdDate={date} mode="NOT"
        onResult={acc => { if (depositRow) crud.updateRow(depositRow.journalTmpId, { depositId: acc?.classTreeId ?? null, depositName: acc?.classTreeName ?? null }); setDepositRow(null); }}
        onClose={() => setDepositRow(null)} />
    </>
  );
};
