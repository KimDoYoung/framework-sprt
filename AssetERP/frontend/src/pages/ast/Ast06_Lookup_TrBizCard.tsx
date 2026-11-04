/**
 * 비품대장 등록 편집창 — 법인카드 내역관리(Biz01_Tab_CardManagement #1141)의 오른쪽 폼(Biz01_Edit_Account) "비품대장등록" 칸이 연다 (다른 도메인에서도 쓰는 편집창).
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrBizCard.java (331줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-85 · getEditor() L162-193: 모달 600×350 "비품대장 등록", 라벨 폭 120, 줄 5개(거래일자 230(읽기 전용) · 거래유형 450(콤보) · 거래처 450 · 종목(자산구분) 450 · 적요 450), 아래 가운데 [저장][닫기]
 * open(promoModel, note, callback) L87-93 → retrieve() L195-212: 카드 승인번호로 거래를 찾아 있으면 그 값, 없으면 새 거래(일자 = 승인일, 적요 = 폼의 적요)
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬, 줄 사이 간격 gap 10
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Select, Space } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCodeName, AstTrBizCard, AstTrCodeTreeNode } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { FieldRow } from './Ast06_EditParts';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';

const LABEL = 120;
/** setting() L99-101: 거래유형 콤보 = sys.Sys00_Common.selectWindowUseTrCode(className = 호출 화면) */
const WINDOW_CLASS = 'Biz01_Tab_CardManagement';

interface Props {
  /** AS-IS open(promoModel, …) — 값이 있으면 열린다 */
  promoId: number | null;
  /** AS-IS open(…, note, …): 폼의 적요 — 새 거래의 적요 기본값 */
  note: string;
  /** 저장 성공 — AS-IS callback.execute("등록완료") */
  onSaved: () => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrBizCard: React.FC<Props> = ({ promoId, note, onSaved, onClose }) => {
  const [f, setF] = useState<AstTrBizCard | null>(null);
  const [trCodes, setTrCodes] = useState<AstCodeName[]>([]);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L71-85) → setting(), getEditor(), show() · open() L87-93 → retrieve() L195-212
  useEffect(() => {
    if (promoId == null) { setF(null); return; }
    let alive = true;
    void (async () => {
      try {
        const [codes, tr] = await Promise.all([astApi.searchWindowTrCodes(WINDOW_CLASS), astApi.getTrBizCard(promoId, note)]);
        if (!alive) return;
        setTrCodes(codes);
        setF(tr);
      } catch (err) {
        if (alive) { message.error(errorMessage(err, '조회 실패')); onClose(); }
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoId]);

  const set = (patch: Partial<AstTrBizCard>) => setF(prev => prev && { ...prev, ...patch });

  // [E1] trName[거래유형].Collapse (L102) → trCode.setValue(trName.getCode())
  const onTrChange = (code?: string) => {
    const hit = trCodes.find(c => c.code === code);
    set({ trCode: code ?? null, trName: hit?.name ?? null });
  };

  // [E2] corpName[거래처].TriggerClick (L110) → Sys15_Lookup_Corp.open(callback): corpId·corpName
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    if (c) set({ corpId: c.corpId, corpName: c.corpName });
  };

  // [E3] classTreeFullName.TriggerClick (L126) → 거래유형이 없으면 "거래유형을 선택하세요", 있으면 Ast01_Lookup_Info.gridInsert("1", trCode, "1", callback)
  const openClass = () => {
    if (f?.trCode == null) { message.warning('거래유형을 선택하세요'); return; }
    setInfoOpen(true);
  };
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    if (node) set({ astClassTreeId: node.classTreeId, classTreeFullName: node.classTreeFullName });
  };

  // [E4] updateButton[저장].Select (L148) → preUpdate() L243-276: 필수 검사 → act.Act04_GenLedger.checkClose → update() L278-302 (ast.Ast06_Tr.updateDepn)
  const preUpdate = async () => {
    if (!f || promoId == null) return;
    if (f.trCode == null) { message.warning('거래유형은 필수선택 항목입니다'); return; }
    if (f.astClassTreeId == null) { message.warning('종목(자산구분)은 필수선택 항목입니다'); return; }
    setSaving(true);
    try {
      await astApi.saveTrBizCard({ promoId, trCode: f.trCode, corpId: f.corpId, astClassTreeId: f.astClassTreeId, note: f.note });
      message.success('저장이 완료되었습니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={promoId != null}
        title="비품대장 등록"
        width={600}
        style={{ top: 20 }}
        maskClosable={false}
        destroyOnHidden
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
              {/* [E5] closeButton[닫기].Select (L154) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        {f && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
            <FieldRow label="거래일자" labelWidth={LABEL} width={230}>
              <Input readOnly value={f.date ?? ''} />
            </FieldRow>
            <FieldRow label="거래유형" labelWidth={LABEL} width={450}>
              <Select<string> style={{ width: 320 }} placeholder="선택" allowClear value={f.trCode ?? undefined} onChange={onTrChange}
                options={trCodes.map(c => ({ value: c.code, label: c.name }))} />
            </FieldRow>
            <FieldRow label="거래처" labelWidth={LABEL} width={450}>
              <LookupInput value={f.corpName ?? ''} width={320} onOpen={() => setCorpOpen(true)} />
            </FieldRow>
            <FieldRow label="종목(자산구분)" labelWidth={LABEL} width={450}>
              <LookupInput value={f.classTreeFullName ?? ''} width={320} onOpen={openClass} />
            </FieldRow>
            <FieldRow label="적요" labelWidth={LABEL} width={450}>
              <Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} />
            </FieldRow>
          </div>
        )}
      </Modal>
      <Sys15_Lookup_Corp open={corpOpen} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" trCode={f?.trCode} abroType="1" onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
    </>
  );
};
