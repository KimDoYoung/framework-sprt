/**
 * 간이세액표 적용일 생성 창 (E22-2) — Pay23_TabPage_SimpleTaxTable [등록]에서 연다.
 * AS-IS: myApp/client/vi/pay/Pay23_Popup_SimpleTaxTableCreate.java (108줄, 새 원본 IDMS-IC)
 * show() L42-71: 모달 250×150 "생성", 적용일 날짜칸(라벨 폭 60), 아래 가운데 [생성][닫기]
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message, Modal, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  /** AS-IS callback.execute(): 생성이 끝났을 때 — 부른 쪽이 적용일 목록을 다시 읽는다 */
  onCreated: () => void;
  onClose: () => void;
}

// [E0] 화면 열림 (생성자 L42-71) → show()
export const Pay23_Popup_SimpleTaxTableCreate: React.FC<Props> = ({ open, onCreated, onClose }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  // show(): 원본은 열 때마다 새 창이라 날짜칸이 비어 있다
  useEffect(() => { if (open) setStartDate(null); }, [open]);

  // [E1] updateButton[생성].Select (L54) → update() L78-96: 적용일 필수 → pay.Pay23_SimpleTaxTableOther.insert (L88)
  const update = async () => {
    if (startDate == null) {
      message.warning('적용일은 필수입력 항목입니다');
      return;
    }
    try {
      await payApi.createSimpleTaxDate(startDate.format('YYYY-MM-DD'));
      onCreated();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <Modal
      open={open}
      title="생성"
      width={250}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={update}>생성</Button>
            {/* [E2] closeButton[닫기].Select (L60) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
        <span style={{ width: 60 }}>적용일</span>
        <DatePicker style={{ flex: 1 }} format="YYYY-MM-DD" value={startDate} onChange={setStartDate} />
      </div>
    </Modal>
  );
};
