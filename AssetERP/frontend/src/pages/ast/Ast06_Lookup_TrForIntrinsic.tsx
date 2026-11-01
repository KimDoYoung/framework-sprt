/**
 * 외화거래등록/외화거래변경 편집창 — 고유자산 외화 거래 (X08) — Ast06_Tab_TrForIntrinsic의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrForIntrinsic.java (576줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L102-116 / open() L118-171: 모달 600×550 "외화거래등록"(NEW)·"외화거래변경"(MODI), getEditor() L323-385: 라벨 폭 120, 줄 10개
 *   (거래일자 230 · 거래유형 450 · 거래처 450 · 종목(자산구분) 450 · 적용통화/환율(통화 콤보 70 + 환율 103) · 외화금액 300 · 원화금액 300 · 결제구분(미수/미지급·예금+예금계좌 콤보) · 적요 500 · 분개 안내(MODI만)),
 *   아래 가운데 [저장][분개재생성](MODI만)[닫기]. 국내 판(Ast06_Lookup_TrIntrinsic, X03)과 달리 [거래 불러오기]·세금·보유자산·감가상각(원장 반영 거래 잠금)이 없다
 * MODI는 거래일자·거래유형·거래처·종목을 막는다(open() L150-163)
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬. 줄 사이 간격은 규격(gap 10)을 따른다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Radio, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstForeignDeposit, AstTrCodeByWindow, AstTrCodeTreeNode, AstTrIntrinsic } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { DoubleInput, FieldRow, JournalNotice, LongInput } from './Ast06_EditParts';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import type { AstTrIntrinsicTarget } from './Ast06_Lookup_TrIntrinsic';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 120;
const WINDOW_CLASS = 'Ast06_Tab_TrForIntrinsic';

interface Form {
  date: Dayjs | null;
  trCode: string | null;
  trName: string | null;
  corpId: number | null;
  corpName: string | null;
  astClassTreeId: number | null;
  classTreeFullName: string | null;
  curCode: string | null;
  fxRate: number | null;
  forAmt: number | null;
  amt: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
}

/** openNew() L102-116: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (): Form => ({
  date: dayjs(), trCode: null, trName: null, corpId: null, corpName: null, astClassTreeId: null, classTreeFullName: null,
  curCode: null, fxRate: null, forAmt: null, amt: null, settleMngYn: true, depositId: null, depositName: null, note: null,
});

/** open() L118-171 MODI */
const fromTr = (t: AstTrIntrinsic): Form => ({
  date: dayjs(t.date), trCode: t.trCode, trName: t.trName, corpId: t.corpId, corpName: t.corpName, astClassTreeId: t.astClassTreeId,
  classTreeFullName: t.classTreeFullName, curCode: t.curCode, fxRate: t.fxRate, forAmt: t.forAmt, amt: t.amt,
  settleMngYn: t.settleMngYn, depositId: t.depositId, depositName: t.depositName, note: t.note,
});

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrIntrinsicTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrIntrinsic, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrForIntrinsic: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [deposits, setDeposits] = useState<AstForeignDeposit[]>([]);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // [E0] 화면 열림 (생성자 L98-100, open L118-171) → editDriver.edit(trModel), setting() — setting() L173-305: depositName = CommonComboBoxField("sys.Sys00_Common.selectForDeposit")
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm() : fromTr(target.tr));
    astApi.getForeignDeposits().then(setDeposits).catch(() => setDeposits([]));
  }, [target]);

  /** 콤보 목록에 현재 값이 없으면(예: 사용 중지된 계좌) 이름으로라도 보이게 끼워 넣는다 */
  const depositOptions = useMemo(() => {
    const opts = deposits.map(d => ({ value: d.codeId, label: d.name ?? '' }));
    if (f?.depositId != null && !opts.some(o => o.value === f.depositId)) opts.unshift({ value: f.depositId, label: f.depositName ?? String(f.depositId) });
    return opts;
  }, [deposits, f?.depositId, f?.depositName]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // setKorAmt() L307-321: 원화금액 = (long)(외화금액 × 적용환율), 비어 있으면 0
  const withKorAmt = (p: Form): Form => ({ ...p, amt: Math.trunc((p.forAmt ?? 0) * (p.fxRate ?? 0)) });

  // [E5] trName[거래유형].TriggerClick (L225) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrForIntrinsic", null, …): 거래유형·종목(거래유형에 묶인 종목)을 넣는다
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    if (!row) return;
    set({ trCode: row.trCode, trName: row.trName, astClassTreeId: row.astClassTreeId ?? null, classTreeFullName: row.astClassTreeName ?? null });
  };

  // [E6] corpName[거래처].TriggerClick [result != null] (L243) → Sys15_Lookup_Corp.open(true, …): 거래처 없으면(선택안함) 비운다
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    set(c ? { corpId: c.corpId, corpName: c.corpName } : { corpId: null, corpName: null });
  };

  // [E7] classTreeFullName.TriggerClick [result != null] (L264) → Ast01_Lookup_Info.gridInsert("1", …)
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    if (!node) return;
    set({ astClassTreeId: node.classTreeId, classTreeFullName: node.classTreeFullName });
  };

  // success() L530-552: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
  const success = async (trId: number) => {
    if (f.date) void astApi.cleanDepositBook(f.date.format(FORMAT)).catch(() => undefined);
    const saved = await astApi.getTrIntrinsic(trId);
    if (!modi) {
      message.success('저장이 완료되었습니다.');
      onChanged(saved, true);
      onClose();
    } else {
      onChanged(saved, false);
      message.success('분개생성이 완료되었습니다.');
    }
  };

  // [E9] journalButton[분개재생성].Select (L287) → createJournal() L463-528: 거래유형이 없으면 NEW는 곧바로 success(), MODI는 안내
  const createJournal = async (trId: number) => {
    if (f.trCode == null) {
      if (!modi) await success(trId); else message.warning('거래유형이 없으면 자동분개 생성이 불가합니다.');
      return;
    }
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E8] updateButton[저장].Select (L281) → preUpdate() L387-440 → update() L442-461
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (!f.curCode) return message.warning('적용통화는 필수선택 항목입니다');
    if (!f.fxRate) return message.warning('적용환율은 필수입력 항목입니다');
    if (!f.forAmt) return message.warning('외화금액은 필수입력 항목입니다');
    if (!f.amt) return message.warning('원화금액은 필수입력 항목입니다');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    setSaving(true);
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 저장(ast.Ast06_Tr.update)은 서버가 한 트랜잭션으로 한다. 거래금액(forContAmt·contAmt) = 외화금액·원화금액(L389-390)
      const trId = await astApi.saveTrIntrinsic({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: f.trCode, corpId: f.corpId, astClassTreeId: f.astClassTreeId,
        contAmt: f.amt, tax: null, amt: f.amt, settleMngYn: f.settleMngYn, depositId: f.depositId, note: f.note, curCode: f.curCode,
        purTrId: tr?.purTrId ?? null, bookAmt: tr?.bookAmt ?? null, itemLClassCode: null, itemSClassCode: null, selfPur: false,
        foreign: true, fxRate: f.fxRate, forAmt: f.forAmt,
      });
      savedId.current = trId;
      if (!modi) {
        await createJournal(trId);  // 최초 등록인 경우 분개 자동생성
      } else {
        message.success('저장이 완료되었습니다.');
        onChanged(await astApi.getTrIntrinsic(trId), false);
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
        title={modi ? '외화거래변경' : '외화거래등록'}
        width={640}
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
              {/* [E10] closeButton[닫기].Select ["NEW".equals(actionName)] (L293) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <FieldRow label="거래일자" labelWidth={LABEL} width={230}>
            <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} value={f.date} disabled={modi} onChange={d => d && set({ date: d })} />
          </FieldRow>
          <FieldRow label="거래유형" labelWidth={LABEL} width={450}>
            <LookupInput value={f.trName ?? ''} width={320} disabled={modi} onOpen={() => setTrCodeOpen(true)} />
          </FieldRow>
          <FieldRow label="거래처" labelWidth={LABEL} width={450}>
            <LookupInput value={f.corpName ?? ''} width={320} disabled={modi} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
          </FieldRow>
          <FieldRow label="종목(자산구분)" labelWidth={LABEL} width={450}>
            <LookupInput value={f.classTreeFullName ?? ''} width={320} disabled={modi} onOpen={() => setInfoOpen(true)} />
          </FieldRow>
          {/* [E1] fxRate.ValueChange (L178) → setKorAmt() */}
          <FieldRow label="적용통화/환율" labelWidth={LABEL} width={300}>
            <div style={{ display: 'flex', gap: 8 }}>
              <SystemCodeComboBox kindCd="CurCode" style={{ width: 90 }} allowClear={false} value={f.curCode ?? undefined} onChange={c => set({ curCode: c ?? null })} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <DoubleInput value={f.fxRate} dec={6} onChange={v => setF(p => p && withKorAmt({ ...p, fxRate: v }))} />
              </div>
            </div>
          </FieldRow>
          {/* [E2] forAmt[외화금액].ValueChange (L184) → setKorAmt() */}
          <FieldRow label="외화금액" labelWidth={LABEL} width={300}>
            <DoubleInput value={f.forAmt} dec={6} onChange={v => setF(p => p && withKorAmt({ ...p, forAmt: v }))} />
          </FieldRow>
          <FieldRow label="원화금액" labelWidth={LABEL} width={300}>
            <LongInput value={f.amt} onChange={v => set({ amt: v })} />
          </FieldRow>
          {/* [E3] settleMngToggleGroup.ValueChange (L197) → 예금계좌를 비우고 미수/미지급이면 막는다, [E4] depositName[sys.Sys00_Common.selectForDeposit].Collapse (L216) → depositId = 고른 코드 ID */}
          <FieldRow label="결제구분" labelWidth={LABEL}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio.Group value={f.settleMngYn ? 'true' : 'false'}
                onChange={e => set({ settleMngYn: e.target.value === 'true', depositId: null, depositName: null })}>
                <Radio value="true">미수/미지급</Radio>
                <Radio value="false">예금</Radio>
              </Radio.Group>
              <Select<number> style={{ width: 218 }} disabled={f.settleMngYn} options={depositOptions} value={f.depositId ?? undefined}
                onChange={(id, opt) => set({ depositId: id, depositName: (opt as { label?: string }).label ?? null })} />
            </div>
          </FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}>
            <Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} />
          </FieldRow>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} regYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
    </>
  );
};
