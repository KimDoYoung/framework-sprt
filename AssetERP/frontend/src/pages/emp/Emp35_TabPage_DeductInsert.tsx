/**
 * 급여공제 편집 폼 (C01-3 → S28에서 파일 분리) — AS-IS: myApp/client/vi/emp/Emp35_TabPage_DeductInsert.java (282줄)
 * 날짜 목록 오른쪽 85%. C01 하위 탭 `Emp35_TabPage_DeductDate`·급여공제정보 화면 `Emp35_Tab_DeductPerson`의 아래 `Emp35_Page_DeductDate`가 같이 쓴다
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, InputNumber, message, Modal, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Deduct } from '@/types/emp';
import { Button } from '@/components/button';
import { Emp36_Popup_AddDeduct } from './Emp36_Popup_AddDeduct';

export interface DeductFormProps {
  deduct: Deduct | null;
  onSaved: (saved: Deduct) => void;
  onDeleted: () => void;
}

export const Emp35_TabPage_DeductInsert: React.FC<DeductFormProps> = ({ deduct, onSaved, onDeleted }) => {
  // [E0] 화면 열림 (생성자 L73-102) → getEditor()
  const [form, setForm] = useState<Partial<Deduct>>({});
  const [saving, setSaving] = useState(false);
  const [addDeductOpen, setAddDeductOpen] = useState(false);

  useEffect(() => { setForm(deduct ?? {}); }, [deduct]);

  const setField = (field: keyof Deduct, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // [E1] updateButton[저장].Select (L83) → update() L217-235
  const update = async () => {
    if (form.withHoldRate == null) {
      message.warning('원천징수비율은 필수입력 항목입니다');
      return;
    }
    if (!deduct?.deductId) return;
    setSaving(true);
    try {
      const saved = await empApi.updateDeduct(deduct.deductId, {
        deductId: deduct.deductId,
        basicDeductCnt: form.basicDeductCnt ?? null,
        addDeductYn: form.addDeductYn ?? null,
        insureYn: form.insureYn ?? null,
        reprYn: form.reprYn ?? null,
        withHoldRate: form.withHoldRate ?? null,
        note: form.note ?? null,
        childDeductCnt: form.childDeductCnt ?? null,
      });
      onSaved(saved);
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '확인'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] deleteButton[삭제].Select (L89) → deleteChk() L237-249
  const deleteChk = () => {
    if (!deduct?.deductId) return;
    Modal.confirm({
      title: '삭제',
      content: '선택한 급여공제를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      // [E5] messageBox.DialogHide [YES] (L240) → delete() L251-265
      onOk: async () => {
        try {
          await empApi.deleteDeduct(deduct.deductId);
          onDeleted();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E3] anchor.MouseDown (L108): addDeductYn 미체크면 메시지, 체크면 추가인적공제 팝업
  const openAddDeduct = () => {
    if (form.addDeductYn !== 'true') {
      message.info('추가인적공제 체크후 등록가능합니다');
      return;
    }
    setAddDeductOpen(true);
  };

  const isActive = !!deduct;
  const toNum = (v: unknown) => (v == null ? undefined : Number(v));
  const checked = (v: string | null | undefined) => v === 'true';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '8px 12px', gap: 8, boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] */}
        <Button type="save" onClick={update} loading={saving} disabled={!isActive}>저장</Button>
        {/* [E2] */}
        <Button type="delete" onClick={deleteChk} disabled={!isActive}>삭제</Button>
      </Space>

      {!isActive ? (
        <div style={{ padding: 24, color: '#888' }}>급여공제 항목을 선택하세요.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          {/* Row01: 적용시작일 | — | 4대보험가입여부 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 110, textAlign: 'right' }}>적용시작일</Typography.Text>
              <Typography.Text style={{ flex: 1 }}>{form.startDate ?? ''}</Typography.Text>
            </div>
            <div style={{ width: 350 }} />
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                checked={checked(form.insureYn)}
                onChange={e => setField('insureYn', e.target.checked ? 'true' : 'false')}
              >4대보험가입여부</Checkbox>
            </div>
          </div>

          {/* Row02: 공제대상 가족수 | [추가인적공제여부+아이콘] | 대표자여부 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 190, textAlign: 'right' }}>공제대상 가족수(본인포함)</Typography.Text>
              <InputNumber
                style={{ width: 140 }}
                value={toNum(form.basicDeductCnt)}
                min={0}
                onChange={v => setField('basicDeductCnt', v)}
              />
            </div>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Checkbox
                checked={checked(form.addDeductYn)}
                onChange={e => setField('addDeductYn', e.target.checked ? 'true' : 'false')}
              >추가인적공제여부</Checkbox>
              {/* [E3] anchor: 추가인적공제 팝업 */}
              <EditOutlined style={{ cursor: 'pointer', color: '#1677ff' }} onClick={openAddDeduct} />
            </div>
            <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={checked(form.reprYn)}
                onChange={e => setField('reprYn', e.target.checked ? 'true' : 'false')}
              >대표자여부</Checkbox>
            </div>
          </div>

          {/* Row03: 자녀 수 | — | 4대보험 신고정보 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 190, textAlign: 'right' }}>공제대상 8세이상 20세이하 자녀 수</Typography.Text>
              <InputNumber
                style={{ width: 140 }}
                value={toNum(form.childDeductCnt)}
                min={0}
                onChange={v => setField('childDeductCnt', v)}
              />
            </div>
            <div style={{ width: 350 }} />
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography.Text>4대보험 신고정보</Typography.Text>
              {/* [E4 생략] anchor2.MouseDown (L139) → Pay31_Popup_InsureApply — 급여 도메인(Pay31) 범위 밖 */}
              <EditOutlined
                style={{ cursor: 'pointer', color: '#aaa' }}
                onClick={() => message.info('4대보험 신고정보는 급여 도메인에서 구현 예정입니다.')}
              />
            </div>
          </div>

          {/* Row04: 원천징수비율 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 110, textAlign: 'right' }}>원천징수비율(%)</Typography.Text>
              <InputNumber
                style={{ width: 220 }}
                value={toNum(form.withHoldRate)}
                min={0}
                onChange={v => setField('withHoldRate', v)}
              />
            </div>
            <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
              <Typography.Text type="secondary">(80%, 100%, 120%)</Typography.Text>
            </div>
          </div>
        </div>
      )}

      <Emp36_Popup_AddDeduct
        open={addDeductOpen}
        deductId={deduct?.deductId}
        onClose={() => setAddDeductOpen(false)}
      />
    </div>
  );
};
