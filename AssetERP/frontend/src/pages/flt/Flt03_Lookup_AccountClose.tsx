/**
 * 계좌폐쇄 창 (I02) — Flt03_Tab_AccountReport [계좌폐쇄]에서 확인 뒤 연다.
 * AS-IS: myApp/client/vi/flt/Flt03_Lookup_AccountClose.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L37-58: 260×160 모달, 폐쇄일(라벨 폭 70, 칸 220) + [저장][닫기]. open(list, callback) L60: 폐쇄할 계좌 목록
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  open: boolean;
  /** open(list, callback)의 list — 폐쇄할 계좌 ID들 */
  accountIds: number[];
  /** callback.execute(null) L100 — 폐쇄한 뒤 부른 쪽이 다시 읽는다 */
  onDone: () => void;
  onClose: () => void;
}

export const Flt03_Lookup_AccountClose: React.FC<Props> = ({ open, accountIds, onDone, onClose }) => {
  const [closeDate, setCloseDate] = useState<Dayjs | null>(null);

  // [E0] 화면 열림 (생성자 L37-58) → settings(), show(): 폐쇄일 비움
  useEffect(() => {
    if (open) setCloseDate(null);
  }, [open]);

  // [E1] updateButton[저장].Select (L66) → insert() L80-106
  const insert = async () => {
    if (closeDate == null) {
      message.warning('폐쇄일을 입력하세요');
      return;
    }
    try {
      await fltApi.createAccountCloses(closeDate.format(DATE_FORMAT), accountIds);  // flt.Flt06_AccountClose.insert
      message.info('처리가 완료되었습니다.');
      onDone();
    } catch (err) {
      message.warning(errorMessage(err, '처리 실패'));  // result.getStatus() < 0 → SimpleMessage(result.getMessage())
    }
  };

  return (
    <LookupModal
      open={open}
      title="계좌폐쇄"
      width={290}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={insert}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L72) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 15px 5px' }}>
        <span style={{ width: 70 }}>폐쇄일</span>
        <DatePicker style={{ width: 150 }} value={closeDate} format={DATE_FORMAT} onChange={d => setCloseDate(d)} />
      </div>
    </LookupModal>
  );
};
