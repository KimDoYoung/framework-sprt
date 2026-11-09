/**
 * PC 이력 편집창 (W18) — Bmt10_Lookup_History의 [등록]·수정 칸에서 연다 (W19 Bmt12_Tab_PcList도 같은 창을 쓴다)
 * AS-IS: myApp/client/vi/bmt/Bmt12_Edit_PcHistory.java (225줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L116-175: 모달 590×490, 라벨 폭 105, 시작일자 · 장비명(조회창 칸) / 설치일자 · 호스트명 / 내부IP · MAC주소 / 기타사항(높이 200) / 비고(100), 아래 가운데 [저장][닫기]
 * insert(callback) L60-70 = "신규등록"(빈 모델 — 장비는 조회창으로, W19) / insert(infoId, name) L72-89 = "신규등록"(시작일자 오늘) / add(row) L91-102 = "추가등록"(행을 복사, ID 비움, 장비명 못 바꿈) / edit(row) L104-114 = "정보수정"(장비명 못 바꿈)
 * 편집창 규격: 11 §4a. 스크롤을 피하려 폭 680·위에서 20만 띄운다(12 원칙)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { bmtPcHistoryApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtInfo, BmtPcHistory } from '@/types/bmt';
import { Button } from '@/components/button';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
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
    return { infoId: t.infoId, astClassTreeName: t.astClassTreeName ?? '', startDate: t.infoId != null ? dayjs() : null, settingDate: null, hostName: '', internalIp: '', macAddress: '', etc: '', note: '' };
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
    <EditModal
      open
      title={heading}
      width={680}
      style={{ top: 20 }}
      onCancel={onClose}
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
      <EditRow>
        <EditField label="시작일자" labelWidth={70} width={245}><DatePicker style={{ width: '100%' }} value={f.startDate} onChange={d => set('startDate', d)} /></EditField>
        <EditField label="장비명" labelWidth={70} width={387}>
          <LookupInput width={250} value={f.astClassTreeName} disabled={nameLocked} onOpen={() => setLookupOpen(true)} />
        </EditField>
      </EditRow>
      <EditRow>
        <EditField label="설치일자" labelWidth={70} width={245}><DatePicker style={{ width: '100%' }} value={f.settingDate} onChange={d => set('settingDate', d)} /></EditField>
        <EditField label="호스트명" labelWidth={70} width={387}><Input value={f.hostName} onChange={e => set('hostName', e.target.value)} /></EditField>
      </EditRow>
      <EditRow>
        <EditField label="내부IP" labelWidth={70} width={245}><Input value={f.internalIp} onChange={e => set('internalIp', e.target.value)} /></EditField>
        <EditField label="MAC주소" labelWidth={70} width={387}><Input value={f.macAddress} onChange={e => set('macAddress', e.target.value)} /></EditField>
      </EditRow>
      <EditField label="기타사항" labelWidth={70}><Input.TextArea rows={8} value={f.etc} onChange={e => set('etc', e.target.value)} /></EditField>
      <EditField label="비고" labelWidth={70}><Input.TextArea rows={4} value={f.note} onChange={e => set('note', e.target.value)} /></EditField>
      <Bmt10_Lookup_InfoList open={lookupOpen} onResult={onPick} onClose={() => setLookupOpen(false)} />
    </EditModal>
  );
};
