/**
 * 거래등록/거래변경 편집창 — 원천세 납부(5050)·부가세 납부(5051) (U04) — Ast06_Tab_TrTax의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrTax.java (645줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L104-122 / open() L124-181: 모달 680×540 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L348-418: 라벨 폭 145, 박스 3개
 *   (거래일자 · 거래유형 / 소득세예수금 · 선급부가세 · 지방세예수금 · 예수부가세 · 기타원천징수예수금 / 납부(환급)금액 · 결제구분(미수/미지급·예금 + 계좌) · 적요) + 분개 안내(MODI만), 아래 가운데 [저장][분개재생성](MODI만)[닫기] — 결재 상태가 있으면 [닫기]만
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstTr } from '@/types/ast';
import { Button } from '@/components/button';
import { Box, FieldRow, JournalNotice, LongInput, SettleMngField } from './Ast06_EditParts';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 145;

/** 열 때 받는 값: NEW는 고른 거래유형, MODI는 고른 거래 행 */
export type AstTrTaxTarget = { mode: 'NEW'; trCode: string; trName: string | null } | { mode: 'MODI'; tr: AstTr };

interface Form {
  date: Dayjs | null;
  trCode: string;
  trName: string | null;
  incomeTax: number | null;
  localTax: number | null;
  etcTax: number | null;
  prePayVat: number | null;
  preRcvVat: number | null;
  amt: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
}

/** openNew() L104-122: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (t: { trCode: string; trName: string | null }): Form => ({
  date: dayjs(), trCode: t.trCode, trName: t.trName, incomeTax: null, localTax: null, etcTax: null, prePayVat: null, preRcvVat: null,
  amt: null, settleMngYn: true, depositId: null, depositName: null, note: null,
});

const fromTr = (tr: AstTr): Form => ({
  date: dayjs(tr.date), trCode: tr.trCode, trName: tr.trName, incomeTax: tr.incomeTax, localTax: tr.localTax, etcTax: tr.etcTax,
  prePayVat: tr.prePayVat, preRcvVat: tr.preRcvVat, amt: tr.amt, settleMngYn: tr.settleMngYn ?? true, depositId: tr.depositId,
  depositName: tr.depositName, note: tr.note,
});

/** setAmt() L467-518: 5050 = 소득세 + 지방세 + 기타원천징수, 5051 = 예수부가세 − 선급부가세, 그 밖의 거래유형은 0 (거래유형이 없으면 그대로) */
const withAmt = (f: Form): Form => {
  if (!f.trCode) return f;
  if (f.trCode === '5050') return { ...f, amt: (f.incomeTax ?? 0) + (f.localTax ?? 0) + (f.etcTax ?? 0) };
  if (f.trCode === '5051') return { ...f, amt: (f.preRcvVat ?? 0) - (f.prePayVat ?? 0) };
  return { ...f, amt: 0 };
};

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrTaxTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTr, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrTax: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // getGenLedger() L420-465: NEW만. 일자·거래유형이 있으면 총계정원장 잔액으로 세금 칸을 채우고 setAmt()
  const getGenLedger = useCallback(async (date: Dayjs | null, trCode: string) => {
    if (!date || !trCode) return;
    try {
      const l = await astApi.getTaxGenLedger(date.format(FORMAT), trCode);
      if (!l) return;
      setF(prev => {
        if (!prev) return prev;
        if (trCode === '5050') return withAmt({ ...prev, incomeTax: l.incomeTax, localTax: l.localTax, etcTax: l.etcTax, prePayVat: 0, preRcvVat: 0 });
        if (trCode === '5051') return withAmt({ ...prev, incomeTax: 0, localTax: 0, etcTax: 0, prePayVat: l.prePayVat, preRcvVat: l.preRcvVat });
        return prev;
      });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (open L124-181) → editDriver.edit(trModel), setting() — NEW면 곧바로 getGenLedger() L264
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    const init = target.mode === 'NEW' ? newForm(target) : fromTr(target.tr);
    setF(init);
    if (target.mode === 'NEW') void getGenLedger(init.date, init.trCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });
  /** [E4]~[E8] incomeTax·localTax·etcTax·prePayVat·preRcvVat[…].ValueChange (L273-302) → setAmt() */
  const setTax = (patch: Partial<Form>) => setF(prev => prev && withAmt({ ...prev, ...patch }));
  const enableIncome = f.trCode !== '5051';
  const enableVat = f.trCode !== '5050';

  // success() L599-621: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
  const success = async (trId: number) => {
    if (f.date) void astApi.cleanDepositBook(f.date.format(FORMAT)).catch(() => undefined);
    const saved = await astApi.getTr(trId);
    if (!modi) {
      message.success('저장이 완료되었습니다.');
      onChanged(saved, true);
      onClose();
    } else {
      onChanged(saved, false);
      message.success('분개생성이 완료되었습니다.');
    }
  };

  // createJournal() L567-597: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E9] updateButton[저장].Select (L304) → preUpdate() L520-544 → update() L546-565
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    setSaving(true);
    try {
      const trId = await astApi.saveTaxTr({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: f.trCode, amt: f.amt, settleMngYn: f.settleMngYn,
        note: f.note, depositId: f.depositId, incomeTax: f.incomeTax, localTax: f.localTax, etcTax: f.etcTax, prePayVat: f.prePayVat, preRcvVat: f.preRcvVat,
      });
      savedId.current = trId;
      if (!modi) {
        await createJournal(trId);  // 최초 등록인 경우 분개 자동생성
      } else {
        message.success('저장이 완료되었습니다.');
        onChanged(await astApi.getTr(trId), false);
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const noButtons = modi && tr?.apprStatusCode != null;  // 결재 상태가 있으면 [닫기]만 (open L206-214)

  return (
    <Modal
      open
      title={modi ? '거래변경' : '거래등록'}
      width={700}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!noButtons && <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>}
            {/* [E10] journalButton[분개재생성].Select (L310) → createJournal() — 거래변경에서만 보인다 */}
            {!noButtons && modi && <Button type="generate" onClick={() => createJournal(savedId.current ?? tr!.trId)}>분개재생성</Button>}
            {/* [E11] closeButton[닫기].Select ["NEW".equals(actionName)] (L316) → callback(null)·callback(trModel), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Box>
          <div style={{ display: 'flex' }}>
            {/* [E3] date[거래일자].ValueChange (L266) → getGenLedger() */}
            <FieldRow label="거래일자" labelWidth={LABEL} width="50%">
              <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.date} disabled={modi}
                onChange={d => { set({ date: d }); void getGenLedger(d, f.trCode); }} />
            </FieldRow>
          </div>
          <FieldRow label="거래유형" labelWidth={LABEL} width="50%"><Input disabled value={f.trName ?? ''} /></FieldRow>
        </Box>
        <Box>
          <div style={{ display: 'flex' }}>
            <FieldRow label="소득세예수금" labelWidth={LABEL} width="50%"><LongInput value={f.incomeTax} disabled={!enableIncome} onChange={v => setTax({ incomeTax: v })} /></FieldRow>
            <FieldRow label="선급부가세" labelWidth={LABEL} width="50%"><LongInput value={f.prePayVat} disabled={!enableVat} onChange={v => setTax({ prePayVat: v })} /></FieldRow>
          </div>
          <div style={{ display: 'flex' }}>
            <FieldRow label="지방세예수금" labelWidth={LABEL} width="50%"><LongInput value={f.localTax} disabled={!enableIncome} onChange={v => setTax({ localTax: v })} /></FieldRow>
            <FieldRow label="예수부가세" labelWidth={LABEL} width="50%"><LongInput value={f.preRcvVat} disabled={!enableVat} onChange={v => setTax({ preRcvVat: v })} /></FieldRow>
          </div>
          <div style={{ display: 'flex' }}>
            <FieldRow label="기타원천징수예수금" labelWidth={LABEL} width="50%"><LongInput value={f.etcTax} disabled={!enableIncome} onChange={v => setTax({ etcTax: v })} /></FieldRow>
          </div>
        </Box>
        <Box>
          <div style={{ display: 'flex' }}>
            <FieldRow label="납부(환급)금액" labelWidth={LABEL} width="50%"><LongInput value={f.amt} onChange={v => set({ amt: v })} /></FieldRow>
          </div>
          {/* [E1] settleMngToggleGroup.ValueChange (L199), [E2] depositName.TriggerClick [result == null] (L226) → Ast01_Lookup_CorpAccount.open(일자, "NOT") */}
          <FieldRow label="결제구분" labelWidth={LABEL}>
            <SettleMngField date={f.date} settleMngYn={f.settleMngYn} depositName={f.depositName} onChange={v => set(v)} />
          </FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} /></FieldRow>
        </Box>
        {modi && <JournalNotice />}
      </div>
    </Modal>
  );
};
