/**
 * 거래등록/거래변경 편집창 — 계좌이체(9005) (X06) — Ast06_Tab_TrDeposit의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrDeposit.java (436줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L85-100 / open() L102-136: 모달 550×400 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L264-304:
 *   한 줄에 칸 하나(거래일자 · 출금 계좌 · 입금 계좌 · 이체금액 · 수수료 · 적요) + 분개 안내(MODI만), 아래 가운데 [저장][분개재생성](MODI만)[닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬. 원본은 칸마다 테두리가 없어 박스를 두지 않는다(12 원칙 2)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstTrDeposit } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { FieldRow, JournalNotice, LongInput } from './Ast06_EditParts';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 120;
const TR_CODE = '9005';  // 계좌이체

/** 열 때 받는 값: NEW는 새 거래, MODI는 고른 거래 행 */
export type AstTrDepositTarget = { mode: 'NEW' } | { mode: 'MODI'; tr: AstTrDeposit };

interface Form {
  date: Dayjs | null;
  astClassTreeId: number | null;
  classTreeName: string | null;
  corpId: number | null;
  depositId: number | null;
  depositName: string | null;
  amt: number | null;
  fee: number | null;
  note: string | null;
}

/** openNew() L85-100: 일자 = 오늘, 거래유형 9005, 미수/미지급 아님 */
const newForm = (): Form => ({ date: dayjs(), astClassTreeId: null, classTreeName: null, corpId: null, depositId: null, depositName: null, amt: null, fee: null, note: null });

const fromTr = (tr: AstTrDeposit): Form => ({
  date: dayjs(tr.date), astClassTreeId: tr.astClassTreeId, classTreeName: tr.classTreeName, corpId: tr.corpId,
  depositId: tr.depositId, depositName: tr.depositName, amt: tr.amt, fee: tr.fee, note: tr.note,
});

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrDepositTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrDeposit, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrDeposit: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // [E0] 화면 열림 (생성자 L83-85, open L106-140) → editDriver.edit(trModel)
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm() : fromTr(target.tr));
  }, [target]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // [E1] classTreeName[출금 계좌].TriggerClick [result == null] (L168) → Ast01_Lookup_CorpAccount.open(일자, "NOT"): 고르면 계좌·ID·보관처(corpId), 안 고르면 비운다
  // 통화(curCode)는 서버가 출금 계좌의 통화(비면 KRW)로 정한다(ast.Ast01_ClassTree.selectById)
  const onAccountResult = (acc: { classTreeId: number; classTreeName: string | null; corpId: number | null } | null) => {
    setAccountOpen(false);
    set(acc ? { astClassTreeId: acc.classTreeId, classTreeName: acc.classTreeName, corpId: acc.corpId } : { astClassTreeId: null, classTreeName: null, corpId: null });
  };

  // [E2] depositName[입금 계좌].TriggerClick [result == null] (L215): 고르면 입금 계좌·ID, 안 고르면 비운다
  const onDepositResult = (acc: { classTreeId: number; classTreeName: string | null } | null) => {
    setDepositOpen(false);
    set(acc ? { depositId: acc.classTreeId, depositName: acc.classTreeName } : { depositId: null, depositName: null });
  };

  // success() L392-426: 예금원장정리(ast.Ast06_Tr.updateDeposit — 실패하면 메시지) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
  const success = async (trId: number) => {
    if (f.date) await astApi.cleanDepositBook(f.date.format(FORMAT));
    const saved = await astApi.getTrDeposit(trId);
    if (!modi) {
      message.success('저장이 완료되었습니다.');
      onChanged(saved, true);
      onClose();
    } else {
      onChanged(saved, false);
      message.success('분개생성이 완료되었습니다.');
    }
  };

  // [E4] journalButton[분개재생성].Select (L244) → createJournal() L369-390: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, TR_CODE);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E3] updateButton[저장].Select (L238) → preUpdate() L306-346 → update() L348-367
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (f.astClassTreeId == null) return message.warning('출금계좌는 필수선택 항목입니다.');
    if (f.depositId == null) return message.warning('입금계좌는 필수선택 항목입니다.');
    setSaving(true);
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 저장(ast.Ast06_Tr.update)은 서버가 한 트랜잭션으로 한다. 외화금액·환율 1·장부금액(금액+수수료)도 서버가 정한다
      const trId = await astApi.saveTrDeposit({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), astClassTreeId: f.astClassTreeId,
        corpId: f.corpId, depositId: f.depositId, amt: f.amt, fee: f.fee, note: f.note,
      });
      savedId.current = trId;
      if (!modi) {
        await createJournal(trId);  // 최초 등록인 경우 분개 자동생성
      } else {
        message.success('저장이 완료되었습니다.');
        onChanged(await astApi.getTrDeposit(trId), false);
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open
        title={modi ? '거래변경' : '거래등록'}
        width={580}
        maskClosable={false}
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
              {modi && <Button type="generate" onClick={() => createJournal(savedId.current ?? tr!.trId)}>분개재생성</Button>}
              {/* [E5] closeButton[닫기].Select ["NEW".equals(actionName)] (L250) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <FieldRow label="거래일자" labelWidth={LABEL} width="50%">
            <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} value={f.date} disabled={modi} onChange={d => d && set({ date: d })} />
          </FieldRow>
          <FieldRow label="출금 계좌" labelWidth={LABEL} width="75%">
            <LookupInput value={f.classTreeName ?? ''} width={300} onOpen={() => setAccountOpen(true)} />
          </FieldRow>
          <FieldRow label="입금 계좌" labelWidth={LABEL} width="75%">
            <LookupInput value={f.depositName ?? ''} width={300} onOpen={() => setDepositOpen(true)} />
          </FieldRow>
          <FieldRow label="이체금액" labelWidth={LABEL} width="55%"><LongInput value={f.amt} onChange={v => set({ amt: v })} /></FieldRow>
          <FieldRow label="수수료" labelWidth={LABEL} width="55%"><LongInput value={f.fee} onChange={v => set({ fee: v })} /></FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} /></FieldRow>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast01_Lookup_CorpAccount open={accountOpen} stdDate={f.date ?? dayjs()} mode="NOT" onResult={onAccountResult} onClose={() => setAccountOpen(false)} />
      <Ast01_Lookup_CorpAccount open={depositOpen} stdDate={f.date ?? dayjs()} mode="NOT" onResult={onDepositResult} onClose={() => setDepositOpen(false)} />
    </>
  );
};
