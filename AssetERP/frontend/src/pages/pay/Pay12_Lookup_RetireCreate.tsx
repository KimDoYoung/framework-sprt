/**
 * 퇴직정산서 생성 창 (S22) — Pay10_Tab_Retire [생성]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay12_Lookup_RetireCreate.java (113줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(personId, actionCode, callback) L37-83: 410×220 모달 "퇴직정산서 생성", 체크 두 개
 *   (전년도분 4대보험정산 전인 경우 / 전년도분 연말정산 전인 경우) + [생성][닫기](가운데). actionCode는 "insert"만 쓴다(삭제는 창 없이 Pay10_Tab_Retire.delete)
 * [E1] createButton[생성].Select (L66) → create() L85-104: pay.Pay12_RetireInsure.getInsureRetire(personId, actionCode, insureCheckYn, taxCheckYn) — 성공이면 callback + hide, 아니면 서버 문구
 * [E2] closeButton[닫기].Select (L72) → hide()
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** open(personId, …) — 값이 있으면 열린다 */
  personId: number | null;
  /** 생성에 성공한 뒤(AS-IS callback.execute()) */
  onCreated: () => void;
  onClose: () => void;
}

export const Pay12_Lookup_RetireCreate: React.FC<Props> = ({ personId, onCreated, onClose }) => {
  const [insureCheckYn, setInsureCheckYn] = useState(false);
  const [taxCheckYn, setTaxCheckYn] = useState(false);

  // [E0] 화면 열림 (open L37-83): 체크는 모두 꺼진 채로 열린다
  useEffect(() => {
    if (personId !== null) {
      setInsureCheckYn(false);
      setTaxCheckYn(false);
    }
  }, [personId]);

  // [E1] createButton[생성].Select (L66) → create() L85-104
  const create = async () => {
    if (personId === null) return;
    try {
      await payApi.createRetire(personId, insureCheckYn, taxCheckYn);
      onCreated();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <LookupModal open={personId !== null} title="퇴직정산서 생성" width={430} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={create}>생성</Button>
            {/* [E2] closeButton[닫기].Select (L72) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '30px 20px' }}>
        <Checkbox checked={insureCheckYn} onChange={e => setInsureCheckYn(e.target.checked)}>전년도분 4대보험정산 전인 경우 체크합니다</Checkbox>
        <Checkbox checked={taxCheckYn} onChange={e => setTaxCheckYn(e.target.checked)}>전년도분 연말정산 전인 경우 체크합니다</Checkbox>
      </div>
    </LookupModal>
  );
};
