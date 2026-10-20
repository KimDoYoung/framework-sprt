/**
 * 법규내용 조회창 (E09) — Ics17_Edit_UserRequestAdmin의 "법규내용 :"을 눌러 연다
 * AS-IS: myApp/client/vi/ics/Ics17_Lookup_LawContent.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L39-80: 모달 1000×500 "법규내용", 본문 = 법규내용 텍스트 영역, 하단 가운데 [저장](userType "user"만)·[닫기]. "admin"이면 읽기 전용
 */
import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsUserRequest } from '@/types/ics';
import { Button } from '@/components/button';

interface Props {
  /** AS-IS open(userRequestModel, …) — 값이 있으면 열린다 */
  model: IcsUserRequest | null;
  userType: 'user' | 'admin';
  /** 저장한 행 (AS-IS callback.execute(userRequestModel)) */
  onSaved?: (row: IcsUserRequest) => void;
  onClose: () => void;
}

export const Ics17_Lookup_LawContent: React.FC<Props> = ({ model, userType, onSaved, onClose }) => {
  const [lawContent, setLawContent] = useState('');
  useEffect(() => { setLawContent(model?.lawContent ?? ''); }, [model]);

  // [E1] updateButton[저장].Select (L58) → update() L82-96: ics.Ics17_UserRequest.updateLawContent → 결과를 부른 쪽에 알리고 닫는다
  const update = async () => {
    if (!model) return;
    try {
      // 아직 저장하지 않은 새 신청(임시 ID ≤ 0, 신청자 화면)은 서버에 보내지 않고 입력한 내용만 돌려준다 (AS-IS 서버는 ID가 없어 갱신 0건)
      onSaved?.(model.userRequestId > 0 ? await icsApi.updateUserRequestLawContent(model.userRequestId, lawContent) : { ...model, lawContent });
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={!!model}
      title="법규내용"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {userType === 'user' && <Button type="save" onClick={update}>저장</Button>}
          {/* [E2] closeButton[닫기].Select (L64) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <Input.TextArea style={{ height: 400, resize: 'none' }} readOnly={userType === 'admin'} value={lawContent}
        onChange={e => setLawContent(e.target.value)} />
    </LookupModal>
  );
};
