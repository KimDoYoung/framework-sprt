/**
 * PC 이력 편집창 (W18) — Bmt10_Lookup_History의 [등록]·수정 칸에서 연다 (W19 Bmt12_Tab_PcList도 같은 창을 쓴다)
 * AS-IS: myApp/client/vi/bmt/Bmt12_Edit_PcHistory.java (225줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L116-175: 모달 590×490, 라벨 폭 105, 시작일자 · 장비명(조회창 칸) / 설치일자 · 호스트명 / 내부IP · MAC주소 / 기타사항(높이 200) / 비고(100), 아래 가운데 [저장][닫기]
 * insert(infoId, name) L72-89 = "신규등록"(시작일자 오늘) / add(row) L91-102 = "추가등록"(행을 복사, ID 비움, 장비명 못 바꿈) / edit(row) L104-114 = "정보수정"(장비명 못 바꿈)
 * 편집창 규격: 11 §4a. 스크롤을 피하려 폭 680·위에서 20만 띄운다(12 원칙)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { bmtPcHistoryApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtInfo, BmtPcHistory } from '@/types/bmt';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Bmt10_Lookup_InfoList } from './Bmt10_Lookup_InfoList';

const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값 */
export type BmtPcHistoryEditTarget =
  | { mode: 'insert'; infoId: number | null; astClassTreeName: string | null }
  | { mode: 'add' | 'edit'; row: BmtPcHistory };

interface Props {
  /** null이면 닫힘 */
  target: BmtPcHistoryEditTarget | null;
  onClose: () => void;
  /** AS-IS callback.execute() — 저장한 행 */
  onDone: (saved: BmtPcHistory) => void;
}

/** 라벨 폭 105 (form.setLabelWidth(105)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 105, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Form {
  infoId: number | null;
  astClassTreeName: string;
  startDate: Dayjs | null;
  settingDate: Dayjs | null;
  hostName: string;
  internalIp: string;
  macAddress: string;
  etc: string;
  note: string;
}

const build = (t: BmtPcHistoryEditTarget): Form => {
  if (t.mode === 'insert') {
    return { infoId: t.infoId, astClassTreeName: t.astClassTreeName ?? '', startDate: dayjs(), settingDate: null, hostName: '', internalIp: '', macAddress: '', etc: '', note: '' };
  }
  const r = t.row;
  return {
    infoId: r.infoId, astClassTreeName: r.astClassTreeName ?? '',
    startDate: r.startDate ? dayjs(r.startDate) : null, settingDate: r.settingDate ? dayjs(r.settingDate) : null,
    hostName: r.hostName ?? '', internalIp: r.internalIp ?? '', macAddress: r.macAddress ?? '', etc: r.etc ?? '', note: r.note ?? '',
  };
};

/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string) => (s === '' ? null : s);

export const Bmt12_Edit_PcHistory: React.FC<Props> = ({ target, onClose, onDone }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  // [E0] 화면 열림 (생성자 L116-175) → add(), show() — insert()/add()/edit()가 모델을 채운다
  useEffect(() => { setF(target ? build(target) : null); }, [target]);
  if (!target || !f) return null;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => prev && { ...prev, [k]: v });
  const heading = target.mode === 'insert' ? '신규등록' : target.mode === 'add' ? '추가등록' : '정보수정';
  const nameLocked = target.mode !== 'insert';  // add·edit: astClassTreeName.setEnabled(false)

  // [E1] updateButton[저장].Select (L122) → update() L201-216: bmt.Bmt12_PcHistory.modelUpdate(companyId는 서버) → callback.execute(), hide()
  const update = async () => {
    setSaving(true);
    try {
      const req = {
        infoId: f.infoId, startDate: f.startDate ? f.startDate.format(DATE) : null,
        hostName: n(f.hostName), settingDate: f.settingDate ? f.settingDate.format(DATE) : null,
        internalIp: n(f.internalIp), macAddress: n(f.macAddress), etc: n(f.etc), note: n(f.note),
      };
      const saved = target.mode === 'edit' ? await bmtPcHistoryApi.update(target.row.pcHistoryId, req) : await bmtPcHistoryApi.create(req);
      onClose();
      onDone(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] astClassTreeName[장비명].TriggerClick (L179) → openLookupBmt() L187-199: Bmt10_Lookup_InfoList → 고른 장비의 ID·이름 (null이면 그대로)
  const onPick = (row: BmtInfo | null) => {
    if (row) setF(prev => prev && { ...prev, infoId: row.infoId, astClassTreeName: row.astClassTreeName ?? '' });
  };

  return (
    <Modal
      open
      title={heading}
      width={680}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L128) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Field label="시작일자" width={260}><DatePicker style={{ width: '100%' }} value={f.startDate} onChange={d => set('startDate', d)} /></Field>
          <Field label="장비명" width={360}>
            <LookupInput width={250} value={f.astClassTreeName} disabled={nameLocked} onOpen={() => setLookupOpen(true)} />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Field label="설치일자" width={260}><DatePicker style={{ width: '100%' }} value={f.settingDate} onChange={d => set('settingDate', d)} /></Field>
          <Field label="호스트명" width={360}><Input value={f.hostName} onChange={e => set('hostName', e.target.value)} /></Field>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Field label="내부IP" width={260}><Input value={f.internalIp} onChange={e => set('internalIp', e.target.value)} /></Field>
          <Field label="MAC주소" width={360}><Input value={f.macAddress} onChange={e => set('macAddress', e.target.value)} /></Field>
        </div>
        <Field label="기타사항"><Input.TextArea rows={8} value={f.etc} onChange={e => set('etc', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={4} value={f.note} onChange={e => set('note', e.target.value)} /></Field>
      </div>
      <Bmt10_Lookup_InfoList open={lookupOpen} onResult={onPick} onClose={() => setLookupOpen(false)} />
    </Modal>
  );
};
