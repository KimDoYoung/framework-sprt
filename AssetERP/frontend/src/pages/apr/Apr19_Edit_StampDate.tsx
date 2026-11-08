/**
 * 날인일자 설정 창 (U2-03) — Apr19_Tab_StampList·Apr19_Tab_OrgStampList의 수정 아이콘(actionCell2)에서 연다
 * AS-IS: myApp/client/vi/apr/Apr19_Edit_StampDate.java (112줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-73: 모달 260×160 "날인일자 설정", getEditor() L75-87: 라벨 폭 75 · 날인일자 칸 200, 아래 가운데 [저장][닫기]
 * 열 때 apr.Apr19_RelateStamp.selectById로 읽은 행을 편집하고, [저장]은 updateStampDate 뒤 callback.execute(=목록 다시 조회)·hide()
 * UX보강(10): 편집창 규격(11 §4a)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprRelateStampApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

const DATE = 'YYYY-MM-DD';

interface Props {
  /** 날인일자를 바꿀 신청(realRelateStampId) — null이면 닫힘 */
  relateStampId: number | null;
  /** callback.execute() — 저장 뒤 */
  onDone: () => void;
  onClose: () => void;
}

export const Apr19_Edit_StampDate: React.FC<Props> = ({ relateStampId, onDone, onClose }) => {
  const [stampDate, setStampDate] = useState<Dayjs | null>(null);
  const [saving, setSaving] = useState(false);

  // open(resultModel, callback) L41-47: selectById로 읽은 행을 editDriver에 올린다
  useEffect(() => {
    if (relateStampId == null) return;
    setStampDate(null);
    void (async () => {
      try {
        const d = await aprRelateStampApi.getStampDate(relateStampId);
        setStampDate(d ? dayjs(d) : null);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  }, [relateStampId]);

  // [E1] updateButton[저장].Select (L56) → update() L89-103: apr.Apr19_RelateStamp.modelUpdate(stampDate) → callback.execute(); hide()
  const update = async () => {
    if (relateStampId == null) return;
    setSaving(true);
    try {
      await aprRelateStampApi.updateStampDate(relateStampId, stampDate ? stampDate.format(DATE) : null);
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  if (relateStampId == null) return null;
  return (
    <Modal
      open
      title="날인일자 설정"
      width={320}
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
            {/* [E2] closeButton[닫기].Select (L62) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        {/* [E0] 화면 열림 (생성자 L49-73) → getEditor() */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text style={{ width: 75, flex: 'none', textAlign: 'right', paddingRight: 10 }}>날인일자</Typography.Text>
          <DatePicker style={{ width: 160 }} value={stampDate} format={DATE} onChange={d => setStampDate(d)} />
        </div>
      </div>
    </Modal>
  );
};
