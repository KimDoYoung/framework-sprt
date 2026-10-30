/**
 * 거래등록/거래변경 편집창 — 4대보험 납부(5052) (U04) — Ast06_Tab_TrTax의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_Tr4Insure.java (809줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L144-163 / open() L165-218: 모달 870×750 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L408-515: 라벨 폭 130, 박스 6개
 *   (거래일자 · 거래유형 / 국민연금 · 건강보험 · 고용보험 · 산재보험(예수금·회사부담금·납부금액, 기타금액·기타 적요) / 결제구분 · 적요) + 분개 안내(MODI만), 아래 가운데 [저장][분개재생성](MODI만)[닫기] — 결재 상태가 있으면 [닫기]만
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
const LABEL = 130;
const NOTE_HINT = '기타금액의 상세내역 기입(연체료,자동납부할인 등)';

export type AstTr4InsureTarget = { mode: 'NEW'; trCode: string; trName: string | null; astClassTreeId: number | null } | { mode: 'MODI'; tr: AstTr };

type Ins = 'np' | 'hi' | 'ei' | 'oh';

interface Form {
  date: Dayjs | null;
  trCode: string;
  trName: string | null;
  note: string | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  npWithholding: number | null; npCompany: number | null; npEtc: number | null; npEtcNote: string | null; npSettleAmt: number | null;
  hiWithholding: number | null; hiCompany: number | null; hiEtc: number | null; hiEtcNote: string | null; hiSettleAmt: number | null;
  eiWithholding: number | null; eiCompany: number | null; eiEtc: number | null; eiEtcNote: string | null; eiSettleAmt: number | null;
  ohCompany: number | null; ohEtc: number | null; ohEtcNote: string | null; ohSettleAmt: number | null;
}

/** openNew() L144-163: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (t: { trCode: string; trName: string | null }): Form => ({
  date: dayjs(), trCode: t.trCode, trName: t.trName, note: null, settleMngYn: true, depositId: null, depositName: null,
  npWithholding: null, npCompany: null, npEtc: null, npEtcNote: null, npSettleAmt: null,
  hiWithholding: null, hiCompany: null, hiEtc: null, hiEtcNote: null, hiSettleAmt: null,
  eiWithholding: null, eiCompany: null, eiEtc: null, eiEtcNote: null, eiSettleAmt: null,
  ohCompany: null, ohEtc: null, ohEtcNote: null, ohSettleAmt: null,
});

const fromTr = (tr: AstTr): Form => ({
  date: dayjs(tr.date), trCode: tr.trCode, trName: tr.trName, note: tr.note, settleMngYn: tr.settleMngYn ?? true,
  depositId: tr.depositId, depositName: tr.depositName,
  npWithholding: tr.npWithholding, npCompany: tr.npCompany, npEtc: tr.npEtc, npEtcNote: tr.npEtcNote, npSettleAmt: tr.npSettleAmt,
  hiWithholding: tr.hiWithholding, hiCompany: tr.hiCompany, hiEtc: tr.hiEtc, hiEtcNote: tr.hiEtcNote, hiSettleAmt: tr.hiSettleAmt,
  eiWithholding: tr.eiWithholding, eiCompany: tr.eiCompany, eiEtc: tr.eiEtc, eiEtcNote: tr.eiEtcNote, eiSettleAmt: tr.eiSettleAmt,
  ohCompany: tr.ohCompany, ohEtc: tr.ohEtc, ohEtcNote: tr.ohEtcNote, ohSettleAmt: tr.ohSettleAmt,
});

/** setSettleAmt(type) L580-678: 예수금 + 회사부담금 + 기타금액 (산재보험은 예수금이 없다), 빈 칸은 0 */
const withSettle = (f: Form, t: Ins): Form => {
  switch (t) {
    case 'np': return { ...f, npSettleAmt: (f.npWithholding ?? 0) + (f.npCompany ?? 0) + (f.npEtc ?? 0) };
    case 'hi': return { ...f, hiSettleAmt: (f.hiWithholding ?? 0) + (f.hiCompany ?? 0) + (f.hiEtc ?? 0) };
    case 'ei': return { ...f, eiSettleAmt: (f.eiWithholding ?? 0) + (f.eiCompany ?? 0) + (f.eiEtc ?? 0) };
    default: return { ...f, ohSettleAmt: (f.ohCompany ?? 0) + (f.ohEtc ?? 0) };
  }
};

interface Props {
  /** 값이 있으면 열림 */
  target: AstTr4InsureTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTr, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_Tr4Insure: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다 */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // getGenLedger() L517-578: NEW만. 일자가 있으면 전월말 총계정원장의 예수금 잔액(없으면 0)을 예수금·회사부담금에 넣고 기타금액 0, 산재보험은 0 → setSettleAmt
  const getGenLedger = useCallback(async (date: Dayjs | null) => {
    if (!date) return;
    try {
      const l = await astApi.getInsureGenLedger(date.format(FORMAT));
      if (!l) return;
      const np = l.npWithholding ?? 0;
      const hi = l.hiWithholding ?? 0;
      const ei = l.eiWithholding ?? 0;
      setF(prev => {
        if (!prev) return prev;
        let n: Form = { ...prev, npWithholding: np, npCompany: np, npEtc: 0, hiWithholding: hi, hiCompany: hi, hiEtc: 0, eiWithholding: ei, eiCompany: ei, eiEtc: 0, ohCompany: 0, ohEtc: 0 };
        (['np', 'hi', 'ei', 'oh'] as Ins[]).forEach(t => { n = withSettle(n, t); });
        return n;
      });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (open L165-218) → editDriver.edit(trModel), setting() — NEW면 곧바로 getGenLedger() L517
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm(target) : fromTr(target.tr));
    if (target.mode === 'NEW') void getGenLedger(dayjs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });
  /** [E4]~[E14] 예수금·회사부담금·기타금액[…].ValueChange (L312-380) → setSettleAmt(type) */
  const setAmt = (t: Ins, patch: Partial<Form>) => setF(prev => prev && withSettle({ ...prev, ...patch }, t));

  // success() L763-785: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
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

  // createJournal() L731-761: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E15] updateButton[저장].Select (L382) → preUpdate() L680-708 → update() L710-729
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    const settleAmt = (f.npSettleAmt ?? 0) + (f.hiSettleAmt ?? 0) + (f.eiSettleAmt ?? 0) + (f.ohSettleAmt ?? 0);  // 금액·약정금액·외화금액이 이 합계
    setSaving(true);
    try {
      const trId = await astApi.save4InsureTr({
        trId: savedId.current ?? tr?.trId ?? null, astClassTreeId: target.mode === 'NEW' ? target.astClassTreeId : null, date: f.date.format(FORMAT), trCode: f.trCode, settleMngYn: f.settleMngYn, note: f.note, depositId: f.depositId,
        npWithholding: f.npWithholding, npCompany: f.npCompany, npEtc: f.npEtc, npEtcNote: f.npEtcNote,
        hiWithholding: f.hiWithholding, hiCompany: f.hiCompany, hiEtc: f.hiEtc, hiEtcNote: f.hiEtcNote,
        eiWithholding: f.eiWithholding, eiCompany: f.eiCompany, eiEtc: f.eiEtc, eiEtcNote: f.eiEtcNote,
        ohCompany: f.ohCompany, ohEtc: f.ohEtc, ohEtcNote: f.ohEtcNote, settleAmt,
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
  const note = (v: string) => (v === '' ? null : v);

  /** 한 보험의 두 줄: 예수금 · 회사부담금 · 납부금액 / 기타금액 · 기타 적요 */
  const insBox = (t: Ins, withholding: boolean) => {
    const key = (s: string) => `${t}${s}` as keyof Form;
    return (
      <Box key={t}>
        <div style={{ display: 'flex' }}>
          {withholding
            ? <FieldRow label={{ np: '국민연금 예수금', hi: '건강보험 예수금', ei: '고용보험 예수금', oh: '' }[t]} labelWidth={LABEL} width="33.33%">
              <LongInput value={f[key('Withholding')] as number | null} onChange={v => setAmt(t, { [key('Withholding')]: v })} />
            </FieldRow>
            : <FieldRow label="산재보험 예수금" labelWidth={LABEL} width="33.33%"><LongInput value={null} disabled onChange={() => undefined} /></FieldRow>}
          <FieldRow label="회사부담금" labelWidth={LABEL} width="33.33%">
            <LongInput value={f[key('Company')] as number | null} onChange={v => setAmt(t, { [key('Company')]: v })} />
          </FieldRow>
          <FieldRow label="납부금액" labelWidth={LABEL} width="33.33%"><LongInput value={f[key('SettleAmt')] as number | null} disabled onChange={() => undefined} /></FieldRow>
        </div>
        <div style={{ display: 'flex' }}>
          <FieldRow label="기타금액" labelWidth={LABEL} width="33.33%">
            <LongInput value={f[key('Etc')] as number | null} onChange={v => setAmt(t, { [key('Etc')]: v })} />
          </FieldRow>
          <FieldRow label="기타 적요" labelWidth={LABEL} width="66.66%">
            <Input placeholder={NOTE_HINT} value={(f[key('EtcNote')] as string | null) ?? ''} onChange={e => set({ [key('EtcNote')]: note(e.target.value) })} />
          </FieldRow>
        </div>
      </Box>
    );
  };

  return (
    <Modal
      open
      title={modi ? '거래변경' : '거래등록'}
      width={890}
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
            {/* [E16] journalButton[분개재생성].Select (L388) → createJournal() — 거래변경에서만 보인다 */}
            {!noButtons && modi && <Button type="generate" onClick={() => createJournal(savedId.current ?? tr!.trId)}>분개재생성</Button>}
            {/* [E17] closeButton[닫기].Select ["NEW".equals(actionName)] (L394) → callback(null)·callback(trModel), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Box>
          <div style={{ display: 'flex' }}>
            {/* [E3] date[거래일자].ValueChange (L300) → getGenLedger() */}
            <FieldRow label="거래일자" labelWidth={LABEL} width="33.33%">
              <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.date} disabled={modi}
                onChange={d => { set({ date: d }); void getGenLedger(d); }} />
            </FieldRow>
            <FieldRow label="거래유형" labelWidth={LABEL} width="66.66%"><Input disabled value={f.trName ?? ''} /></FieldRow>
          </div>
        </Box>
        {insBox('np', true)}
        {insBox('hi', true)}
        {insBox('ei', true)}
        {insBox('oh', false)}
        <Box>
          {/* [E1] settleMngToggleGroup.ValueChange (L250), [E2] depositName.TriggerClick [result == null] (L280) → Ast01_Lookup_CorpAccount.open(일자, "NOT") */}
          <FieldRow label="결제구분" labelWidth={LABEL}>
            <SettleMngField date={f.date} settleMngYn={f.settleMngYn} depositName={f.depositName} onChange={v => set(v)} />
          </FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: note(e.target.value) })} /></FieldRow>
        </Box>
        {modi && <JournalNotice />}
      </div>
    </Modal>
  );
};
