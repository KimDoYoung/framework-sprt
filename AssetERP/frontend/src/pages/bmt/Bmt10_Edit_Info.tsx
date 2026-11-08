/**
 * 전산장비(신규등록/수정) 편집창 (W18) — Bmt10_Tab_Info의 [등록] 버튼·수정 칸에서 연다
 * AS-IS: myApp/client/vi/bmt/Bmt10_Edit_Info.java (251줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L93-164: 모달 600×530, 라벨 폭 100, 장비명(조회창 칸) · 매입일자 / 폐기일자(빨간 라벨) · 취득금액(###,###,###) · 취득정보(높이 100) · 세부사양(150) · 비고(100), 아래 가운데 [저장][삭제][닫기]
 * insert() L68-79 = "전산장비(신규등록)" + [삭제] 숨김 / open() L81-91 = "전산장비(수정)" + [삭제] 보임
 * 편집창 규격: 11 §4a (머리 아래 선·푸터 위 선·라벨 오른쪽 정렬), 스크롤을 피하려 폭 640·위에서 20만 띄운다(12 원칙)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { bmtInfoApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtInfo } from '@/types/bmt';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast01_Lookup_ClassTree } from '../ast/Ast01_Lookup_ClassTree';

const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값: 새로 만들면 { row: null }, 고치면 그 행 */
export interface BmtInfoEditTarget {
  row: BmtInfo | null;
}

interface Props {
  /** null이면 닫힘 */
  target: BmtInfoEditTarget | null;
  onClose: () => void;
  /** AS-IS callback.execute() — 저장하면 'save'(새 행이면 isNew), 삭제하면 'delete' */
  onDone: (infoId: number, kind: 'save' | 'delete', isNew: boolean) => void;
}

/** 라벨 폭 100 (form.setLabelWidth(100)) */
const Field: React.FC<{ label: string; color?: string; width?: number | string; children: React.ReactNode }> = ({ label, color, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10, color }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Form {
  astClassTreeId: number | null;
  astClassTreeName: string;
  applyDate: Dayjs | null;
  retireDate: Dayjs | null;
  acqAmount: number | null;
  acqInfo: string;
  spec: string;
  note: string;
}

const EMPTY: Form = { astClassTreeId: null, astClassTreeName: '', applyDate: null, retireDate: null, acqAmount: null, acqInfo: '', spec: '', note: '' };

const fromRow = (r: BmtInfo): Form => ({
  astClassTreeId: r.astClassTreeId,
  astClassTreeName: r.astClassTreeName ?? '',
  applyDate: r.applyDate ? dayjs(r.applyDate) : null,
  retireDate: r.retireDate ? dayjs(r.retireDate) : null,
  acqAmount: r.acqAmount,
  acqInfo: r.acqInfo ?? '',
  spec: r.spec ?? '',
  note: r.note ?? '',
});

/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string) => (s === '' ? null : s);

export const Bmt10_Edit_Info: React.FC<Props> = ({ target, onClose, onDone }) => {
  const [f, setF] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  // [E0] 화면 열림 (생성자 L93-164) → show() — insert()/open()이 모델을 채운다
  useEffect(() => { if (target) setF(target.row ? fromRow(target.row) : EMPTY); }, [target]);
  if (!target) return null;
  const isNew = target.row == null;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => ({ ...prev, [k]: v }));

  // [E1] updateButton[저장].Select (L100) → update() L188-203: bmt.Bmt10_Info.modelUpdate(companyId는 서버) → callback.execute(), hide()
  const update = async () => {
    setSaving(true);
    try {
      const req = {
        astClassTreeId: f.astClassTreeId,
        applyDate: f.applyDate ? f.applyDate.format(DATE) : null,
        retireDate: f.retireDate ? f.retireDate.format(DATE) : null,
        acqAmount: f.acqAmount,
        acqInfo: n(f.acqInfo),
        spec: n(f.spec),
        note: n(f.note),
      };
      const infoId = isNew ? await bmtInfoApi.create(req) : await bmtInfoApi.update(target.row!.infoId, req);
      onClose();
      onDone(infoId, 'save', isNew);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] deleteButton[삭제].Select (L112) → deleteCheck() L205-224: 확인(350) "해당 전산장비 정보를 삭제하시겠습니까?"
  //   → [E5] msgBox.DialogHide [YES] (L208) → delete() L226-238: bmt.Bmt10_Info.modelDelete → callback.execute(), hide()
  const deleteCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 전산장비 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          const infoId = target.row!.infoId;
          await bmtInfoApi.remove(infoId);
          onClose();
          onDone(infoId, 'delete', false);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <Modal
      open
      title={isNew ? '전산장비(신규등록)' : '전산장비(수정)'}
      width={640}
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
            {!isNew && <Button type="delete" onClick={deleteCheck}>삭제</Button>}
            {/* [E2] closeButton[닫기].Select (L106) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="장비명">
          {/* [E4] astClassTreeName[장비명].TriggerClick (L168) → openLookupAst() L176-186: Ast01_Lookup_ClassTree → 고른 분류의 ID·이름 */}
          <LookupInput width={470} value={f.astClassTreeName} onOpen={() => setLookupOpen(true)} />
        </Field>
        <div style={{ display: 'flex', gap: 16 }}>
          <Field label="매입일자" width={300}>
            <DatePicker style={{ width: '100%' }} value={f.applyDate} onChange={d => set('applyDate', d)} />
          </Field>
          <Field label="폐기일자" color="#CE4242" width={300}>
            <DatePicker style={{ width: '100%' }} value={f.retireDate} onChange={d => set('retireDate', d)} />
          </Field>
        </div>
        <Field label="취득금액" width={400}>
          <InputNumber<number> style={{ width: '100%' }} precision={0} value={f.acqAmount}
            formatter={v => (v == null ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            parser={v => Number((v ?? '').replace(/,/g, ''))}
            onChange={v => set('acqAmount', v == null ? null : Number(v))} />
        </Field>
        <Field label="취득정보"><Input.TextArea rows={4} value={f.acqInfo} onChange={e => set('acqInfo', e.target.value)} /></Field>
        <Field label="세부사양"><Input.TextArea rows={6} value={f.spec} onChange={e => set('spec', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={4} value={f.note} onChange={e => set('note', e.target.value)} /></Field>
      </div>
      <Ast01_Lookup_ClassTree
        open={lookupOpen}
        onResult={node => { setF(prev => ({ ...prev, astClassTreeId: node.classTreeId, astClassTreeName: node.classTreeName })); setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)}
      />
    </Modal>
  );
};
