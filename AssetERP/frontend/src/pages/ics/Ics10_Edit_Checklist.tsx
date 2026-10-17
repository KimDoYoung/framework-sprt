/**
 * 내부통제 체크리스트 생성/수정 창 (E04) — Ics10_Tab_ChecklistAdmin의 수정 아이콘·[등록]에서 연다. `readOnly`면 AS-IS open(model, callback)의 "내부통제 체크리스트" 보기 창
 * (Ics10_Tab_Checklist가 씀 — 입력은 모두 읽기 전용, 조회순서·사용여부 줄과 [저장]·행 추가/삭제 없음)
 * AS-IS: myApp/client/vi/ics/Ics10_Edit_Checklist.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L125-182: 모달 730×700, 라벨 폭 105, 체크대상(210)·대분류·중분류·근거(80)·내부통제(행 추가/행 삭제 + 연관 내부통제 그리드 210)·조회순서(210)·사용여부, 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Input, InputNumber, message, Modal, Select, Space, Typography } from 'antd';
import { icsApi } from '@/api/ics';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { IcsChecklist, IcsChecklistClassCode, IcsLawDeadline } from '@/types/ics';
import { Button } from '@/components/button';
import { Sch05_Page_RelateIcs, Sch05_Page_RelateIcsHandle } from '@/components/lookup/Sch05_Page_RelateIcs';
import { Ics01_Lookup_SelectMulti } from './Ics01_Lookup_SelectMulti';

const LABEL_W = 105;
const Row: React.FC<{ label: React.ReactNode; children: React.ReactNode; align?: 'center' | 'flex-start' }> = ({ label, children, align = 'center' }) => (
  <div style={{ display: 'flex', alignItems: align, marginBottom: 16 }}>
    <Typography.Text strong style={{ width: LABEL_W, flex: 'none' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export interface ChecklistEditTarget {
  /** edit(checklistModel, callback) L80-89 — 고칠 체크리스트. 새로 만들 때는 미리 받은 id(next-id)와 회사·사용 true만 있다 */
  model: IcsChecklist;
  /** 새 체크리스트인지 (AS-IS GridInsertRow가 만든 행) */
  isNew?: boolean;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: ChecklistEditTarget | null;
  /** open(model, callback) L91-123: 보기 전용 창 */
  readOnly?: boolean;
  /** 저장하면 저장된 행 (AS-IS callbackResult.execute(updateModel)) */
  onSaved?: (row: IcsChecklist) => void;
  /** closeButton[닫기] — 저장 없이 닫음 (보기 창은 callback.execute()) */
  onClosed?: () => void;
  onClose: () => void;
}

export const Ics10_Edit_Checklist: React.FC<Props> = ({ target, readOnly, onSaved, onClosed, onClose }) => {
  const relateRef = useRef<Sch05_Page_RelateIcsHandle>(null);
  const [content, setContent] = useState('');
  const [criterion, setCriterion] = useState('');
  const [useYn, setUseYn] = useState(true);
  const [seq, setSeq] = useState<number | null>(null);
  const [lClassId, setLClassId] = useState<string | undefined>(undefined);
  const [mClassId, setMClassId] = useState<string | undefined>(undefined);
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L125-182, edit() L80-89) → settings(), show(): 폼에 모델 값을 채우고(editDriver.edit), 대분류 콤보를 읽고, 연관 내부통제를 조회한다
  useEffect(() => {
    if (!target) return;
    const m = target.model;
    setContent(m.content ?? '');
    setCriterion(m.criterion ?? '');
    setUseYn(m.useYn !== 'false');
    setSeq(m.seq ?? null);
    setLClassId(m.checkLClassId != null ? String(m.checkLClassId) : undefined);
    setMClassId(m.checklistMClassId != null ? String(m.checklistMClassId) : undefined);
    setMCodes([]);
    icsApi.searchChecklistLCodes().then(setLCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
    if (m.checkLClassId != null) {
      icsApi.searchChecklistMCodes(m.checkLClassId).then(setMCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
    }
    void relateRef.current?.retrieve(m.checklistId);
  }, [target]);

  // [E1] checkLClassName[대분류].Collapse (L206) → 중분류를 "선택하세요"로 되돌리고 refreshCode() L296-306: 고른 대분류의 중분류 콤보를 다시 읽는다
  const onLClass = (code?: string) => {
    setLClassId(code);
    setMClassId(undefined);
    setMCodes([]);
    icsApi.searchChecklistMCodes(code == null ? null : Number(code)).then(setMCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
  };

  // [E2] checkMClassName[중분류].Collapse (L226) → checklistMClassId.setValue(code)
  const onMClass = (code?: string) => setMClassId(code);

  // [E3] insertIcsButton[행 추가].Select (L233): Ics01_Lookup_SelectMulti("deadline") → 고른 (법규, 기한)마다 서비스 sch.Sch05_RelateIcs.modelUpdate → relateIcsPage.retrieve(checklistId)
  // 기한이 없는 법규는 원본에서 오류로 건너뛰어지므로(getDeadlineModel() null) 여기서는 빼고 안내한다
  const addLaws = async (list: IcsLawDeadline[]) => {
    if (!target) return;
    const withDeadline = list.filter(r => r.deadlineId != null);
    if (withDeadline.length < list.length) message.warning('기한이 설정되지 않은 법규는 추가하지 않았습니다.');
    if (withDeadline.length === 0) return;
    try {
      await schApi.addRelateIcs(target.model.checklistId, withDeadline.map(r => ({ icsClassTreeId: r.classTreeId, deadlineId: r.deadlineId as number })));
      await relateRef.current?.retrieve(target.model.checklistId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // update() L308-336: 중분류가 없으면 "중분류는 필수선택 항목입니다", 체크대상이 없으면 "체크대상은 필수입력 항목입니다" → 서비스 ics.Ics10_Checklist.modelUpdate → callbackResult.execute(updateModel); hide()
  // [E5] updateButton[저장].Select (L276) → update()
  const update = async () => {
    if (!target) return;
    if (mClassId == null) {
      message.warning('중분류는 필수선택 항목입니다');
      return;
    }
    if (!content) {
      message.warning('체크대상은 필수입력 항목입니다');
      return;
    }
    try {
      const saved = await icsApi.saveChecklist({
        checklistId: target.model.checklistId,
        content, criterion, useYn: useYn ? 'true' : 'false', checklistMClassId: Number(mClassId), seq,
      });
      onSaved?.(saved);
      onClose();
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
  };

  // [E6] closeButton[닫기].Select [callback == null] (L282) → callbackResult.execute(checklistModel); hide() (callback이 있으면 callback.execute(); hide())
  const close = () => { onClosed?.(); onClose(); };

  const ro = !!readOnly;
  return (
    <Modal
      open={!!target}
      title={ro ? '내부통제 체크리스트' : '내부통제 체크리스트 생성/수정'}
      width={770}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!ro && <Button type="save" onClick={update}>저장</Button>}
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '10px 10px 0 10px', maxHeight: 600, overflowY: 'auto' }}>
        <Row label="체크대상" align="flex-start">
          <Input.TextArea style={{ height: 170, resize: 'none' }} readOnly={ro} value={content} onChange={e => setContent(e.target.value)} />
        </Row>
        <Row label="대분류">
          <Select style={{ width: 300 }} placeholder="선택하세요" disabled={ro} value={lClassId} onChange={onLClass}
            options={lCodes.map(c => ({ value: c.code, label: c.name }))} />
        </Row>
        <Row label="중분류">
          <Select style={{ width: 300 }} placeholder="선택하세요" disabled={ro} value={mClassId} onChange={onMClass}
            options={mCodes.map(c => ({ value: c.code, label: c.name }))} />
        </Row>
        <Row label="근거" align="flex-start">
          <Input.TextArea style={{ height: 60, resize: 'none' }} readOnly={ro} value={criterion} onChange={e => setCriterion(e.target.value)} />
        </Row>
        <Row label="내부통제" align="flex-start">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Space>
              <Button type="addRow" disabled={ro} onClick={() => setLookupOpen(true)}>행 추가</Button>
              {/* [E4] deleteIcsButton[행 삭제].Select (L270) → relateIcsPage.delete() */}
              <Button type="removeRow" disabled={ro} onClick={() => void relateRef.current?.delete()}>행 삭제</Button>
            </Space>
            <div style={{ height: 200 }}><Sch05_Page_RelateIcs ref={relateRef} /></div>
          </div>
        </Row>
        {!ro && (
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <Row label="조회순서">
              <InputNumber style={{ width: 100 }} controls={false} precision={0} value={seq} onChange={v => setSeq(v == null ? null : Number(v))} />
            </Row>
            <Row label="사용여부">
              <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)} />
            </Row>
          </div>
        )}
      </div>
      <Ics01_Lookup_SelectMulti open={lookupOpen} actionCode="deadline" onResultDeadlines={list => void addLaws(list)} onClose={() => setLookupOpen(false)} />
    </Modal>
  );
};
