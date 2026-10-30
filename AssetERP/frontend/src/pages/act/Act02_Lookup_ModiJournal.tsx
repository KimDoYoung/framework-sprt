/**
 * 전표변경 편집창 (W05 2단계) — Ast06_Grid_Journal·Act02_Tab_CreateJournalBiz 분개 그리드의 [변경]이 연다
 * AS-IS: myApp/client/vi/act/Act02_Lookup_ModiJournal.java (623줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L115-135 / open() L137-160: 모달 1000×620 "전표변경", getEditor() L260-296: 라벨 폭 85, 전표일자·전표번호(막힘) / 거래유형(막힘) / 거래처(막힘) / 적요(TextArea 70)
 *   / 전표 = 툴바([차변 행추가][대변 행추가][행 삭제] ⟳ … 대차차액) + 셀 편집 그리드 250(구분·계정코드·계정과목·금액·관리계좌·적요), 아래 가운데 [저장][닫기]
 * 편집창 규격(11 §4a, modal 원칙): antd Modal + 머리말 아래 선·푸터 위 선, 라벨 오른쪽 정렬
 * [E1 생략] corpName[거래처].TriggerClick (L174-187) → Sys15_Lookup_Corp — AS-IS는 corpName.setEnabled(false)라 누를 수 없다(죽은 코드). 칸을 막아 둔다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import dayjs from 'dayjs';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalEdit, JournalTmp } from '@/types/act';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';
import { Ast01_Lookup_CorpAccount } from '../ast/Ast01_Lookup_CorpAccount';
import { FieldRow } from '../ast/Ast06_EditParts';

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

interface Props {
  /** 값이 있으면 열림 */
  journalId: number | null;
  /** 저장이 끝났다 (callback.execute(jnlModel) 뒤 hide) */
  onSaved: () => void;
  onClose: () => void;
}

export const Act02_Lookup_ModiJournal: React.FC<Props> = ({ journalId, onSaved, onClose }) => {
  const [head, setHead] = useState<JournalEdit | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [accountTarget, setAccountTarget] = useState<{ row: JournalTmp; searchText?: string } | null>(null);
  const [depositRow, setDepositRow] = useState<JournalTmp | null>(null);
  const headLoaded = useRef(false);

  // retrieveJnl() L448-458: act.Act06_JournalTmp.selectByJournalId — 열 때와 ⟳를 누를 때. 머리는 처음 한 번만 채운다(⟳는 그리드만 다시 읽는다)
  const search = useCallback(async () => {
    if (journalId == null) return [];
    const e = await actApi.getJournalEdit(journalId);
    if (!headLoaded.current) { headLoaded.current = true; setHead(e); setNote(e.note); }
    return e.lines;
  }, [journalId]);

  const crud = useGridCrud<JournalTmp>({
    idField: 'journalTmpId',
    search,
    save: async r => r,
    remove: async () => 0,
    newRow: () => ({ seq: null, drcrType: null, drcrTypeName: null, realAccountCode: null, realAccountName: null, reprAccountCode: null, accountMap: null, amt: 0, forAmt: 0, depositId: null, depositName: null, note: null }),
    firstEditField: 'realAccountCode',
  });

  // [E0] 화면 열림 (생성자 L115-135, open L150-160) → editDriver.edit(jnlModel), retrieveJnl()
  useEffect(() => {
    headLoaded.current = false;
    setHead(null);
    if (journalId != null) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journalId]);

  // setDiffAmt() L387-409: 대차차액 = 대변 합계 − 차변 합계
  const diffAmt = crud.rows.reduce((sum, r) => sum + (typeOf(r) === 'C' ? (r.amt ?? 0) : typeOf(r) === 'D' ? -(r.amt ?? 0) : 0), 0);

  /** setAccount() L422-426 */
  const setAccount = (row: JournalTmp, code: string | null, name: string | null) => crud.updateRow(row.journalTmpId, { realAccountCode: code, realAccountName: name });

  // [E10] lookupAccountCode.ValueChange (L310): 글자를 지우면 비우고, 글자로 계정을 찾아(전표생성·사용 계정만) 반영, 없으면 조회창 (lookupAccount(searchText) L411-420)
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

  /** checkClose() L576-595: 처리일(전표일자)이 마감이면 AS-IS 메시지로 막는다 */
  const checkClose = async (): Promise<boolean> => {
    try {
      await actApi.checkLedgerClose(head!.date);
      return true;
    } catch (err) {
      message.error(errorMessage(err, '마감 확인 실패'));
      return false;
    }
  };

  // [E3] insertDrRowButton[차변 행추가].Select (L212) · [E4] insertCrRowButton[대변 행추가].Select (L219) → insertRow(drcrType) L460-478: 마감 검사 뒤 맨 아래에 구분이 찬 빈 행
  const insertRow = async (type: 'D' | 'C') => {
    if (!(await checkClose())) return;
    crud.addRows([{ drcrType: type, drcrTypeName: type === 'D' ? DR : CR }], false);
  };

  // [E5] deleteRowButton[행 삭제].Select (L226) → deleteRow() L480-495: 선택이 없으면 안내 → 마감 검사 → 그리드에서 뺀다(저장까지 서버는 그대로)
  const deleteRow = async () => {
    const checked = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('선택된 행이 없습니다. 삭제할 전표를 선택해주세요.'); return; }
    if (!(await checkClose())) return;
    crud.removeRows(checked.map(r => r.journalTmpId));
  };

  // [E6] updateButton[저장].Select (L232) → preUpdate() L497-550 → update() L552-574
  const preUpdate = async () => {
    if (!head) return;
    if (head.fixYn) { message.warning('승인완료 전표입니다.'); return; }
    crud.gridRef.current?.api.stopEditing();
    for (const r of crud.rows) {
      if (!typeOf(r)) { message.warning('차/대 구분은 필수선택 항목입니다.'); return; }
      if (!r.realAccountCode) { message.warning('계정코드는 필수선택 항목입니다'); return; }
      if (!r.amt) { message.warning('금액은 필수입력 항목입니다'); return; }
    }
    if (diffAmt !== 0) { message.warning('차/대 원화 금액이 다릅니다.'); return; }
    setSaving(true);
    try {
      // 마감 검사(act.Act04_GenLedger.checkClose)와 저장(act.Act02_Journal.updateAll)은 서버가 한 트랜잭션으로 한다. 줄 순서가 순번(10, 20, …)이 된다 (setSeq L597-605)
      await actApi.saveJournal(head.journalId, {
        corpId: head.corpId, note,
        lines: crud.rows.map(r => ({
          drcrType: typeOf(r), realAccountCode: r.realAccountCode, reprAccountCode: r.reprAccountCode, accountMap: r.accountMap,
          amt: r.amt, forAmt: r.forAmt, depositId: r.depositId, note: r.note,
        })),
      });
      message.success('저장이 완료되었습니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // journalGrid() L298-379
  const columnDefs = [
    // [E11] comboDrCrType[DrcrType].Collapse (L339): 고른 이름의 차대 코드를 행에 넣고 대차차액을 다시 계산
    gb.textCenter('drcrTypeName', 55, '구분', {  // L371
      editor: 'select', values: [DR, CR],
      valueSetter: p => { p.data.drcrTypeName = p.newValue; p.data.drcrType = p.newValue === DR ? 'D' : p.newValue === CR ? 'C' : null; return true; },
    }),
    // [E9] lookupAccountCode.TriggerClick (L304) → lookupAccount(null)
    gb.textCenter('realAccountCode', 95, '계정코드', {  // L372
      editor: 'text',
      ...triggerCell(row => setAccountTarget({ row })),
      valueSetter: p => { p.data.realAccountCode = p.newValue; accountTyped.current(p.data, p.newValue ?? ''); return true; },
    }),
    gb.textArea('realAccountName', 250, '계정과목'),  // L373
    gb.long('amt', 100, '금액', { editor: 'number' }),  // L374
    // [E12] lookupDeposit.TriggerClick (L362) → lookupDeposit() L428-446: Ast01_Lookup_CorpAccount.open(전표일자, "NOT") — 고르지 않으면(선택안함) 비운다
    gb.text('depositName', 140, '관리계좌', triggerCell(row => setDepositRow(row))),  // L375
    gb.text('note', 145, '적요', { editor: 'text' }),  // L376
  ];

  if (journalId == null) return null;

  return (
    <>
      <Modal
        open
        title="전표변경"
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
              {/* [E7] closeButton[닫기].Select (L238) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <FieldRow label="전표일자" labelWidth={LABEL} width={300}><Input disabled value={head ? dayjs(head.date).format(FORMAT) : ''} /></FieldRow>
            <FieldRow label="전표번호" labelWidth={LABEL} width={300}><Input disabled value={head?.journalNo ?? ''} /></FieldRow>
          </div>
          <FieldRow label="거래유형" labelWidth={LABEL} width={500}><Input disabled value={head?.trName ?? ''} /></FieldRow>
          <FieldRow label="거래처" labelWidth={LABEL} width={500}><Input disabled value={head?.corpName ?? ''} /></FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}>
            <Input.TextArea rows={3} maxLength={500} value={note ?? ''} onChange={e => setNote(e.target.value === '' ? null : e.target.value)} />
          </FieldRow>
          <FieldRow label="전표" labelWidth={LABEL}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button type="addRow" onClick={() => insertRow('D')}>차변 행추가</Button>
                <Button type="addRow" onClick={() => insertRow('C')}>대변 행추가</Button>
                <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
                {/* [E2] anchor.MouseDown (L193) → retrieveJnl() */}
                <AntButton type="text" size="small" title="다시 읽기" icon={<ReloadOutlined />} onClick={() => void crud.retrieve()} />
                <span style={{ flex: 1 }} />
                <span style={{ lineHeight: '32px' }}>대차차액</span>
                {/* [E8] jnlGrid.getStore().StoreRecordChange (L245) → setDiffAmt() — 렌더마다 합계를 다시 계산 */}
                <Input readOnly style={{ width: 140, textAlign: 'right' }} value={diffAmt.toLocaleString('ko-KR')} />
              </div>
              <div style={{ height: 250 }}>
                <CellEditGrid<JournalTmp> crud={crud} columnDefs={columnDefs} />
              </div>
            </div>
          </FieldRow>
        </div>
      </Modal>
      <Act01_Lookup_AccountCode open={accountTarget != null} searchText={accountTarget?.searchText}
        onResult={acc => { if (accountTarget) setAccount(accountTarget.row, acc.accountCode, acc.accountName); setAccountTarget(null); }}
        onClose={() => setAccountTarget(null)} />
      <Ast01_Lookup_CorpAccount open={depositRow != null} stdDate={head ? dayjs(head.date) : dayjs()} mode="NOT"
        onResult={acc => { if (depositRow) crud.updateRow(depositRow.journalTmpId, { depositId: acc?.classTreeId ?? null, depositName: acc?.classTreeName ?? null }); setDepositRow(null); }}
        onClose={() => setDepositRow(null)} />
    </>
  );
};
