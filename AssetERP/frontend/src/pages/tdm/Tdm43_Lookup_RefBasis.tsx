/**
 * 관련조문 수정창 (N27) — Tdm45_TabPage_Relate의 관련조문 그리드 [수정] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_RefBasis.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L33-56: 모달 500×400, 닫기(X) 없음, 가운데 TextArea + 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlList } from '@/types/tdm';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** AS-IS new Tdm43_Lookup_RefBasis(manlModel, callback) — 값이 있으면 열린다 */
  target: TdmManlList | null;
  /** callback.execute(manlModel) — 저장한 뒤(창은 안 닫힌다), refBasis를 바꾼 행 */
  onSaved: (row: TdmManlList) => void;
  onClose: () => void;
}

export const Tdm43_Lookup_RefBasis: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [refBasis, setRefBasis] = useState('');

  // [E0] 화면 열림 (생성자 L33-56) → settings() L58-73: refBasis.setText(manlModel.getRefBasis())
  useEffect(() => { setRefBasis(target?.refBasis ?? ''); }, [target]);

  // [E1] updateButton[저장].Select (L61) → update() L75-97: tdm.Tdm43_Manl.updateRefBasis(manlId, refBasis)
  const update = async () => {
    if (!target) return;
    try {
      await tdmApi.updateManlRefBasis(target.manlId, refBasis);
      message.success('저장이 완료되었습니다');
      onSaved({ ...target, refBasis });
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={!!target}
      title={<b>관련조문</b>}
      width={500}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L67) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 300, resize: 'none' }} value={refBasis} onChange={e => setRefBasis(e.target.value)} />
    </LookupModal>
  );
};
