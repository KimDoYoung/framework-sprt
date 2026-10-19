/**
 * 법규 상세내용 창 (E01) — Ics01_Grid_IcsType 그리드의 상세내용 [수정] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_Content.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L59-95: 모달 650×680, 상세내용 입력(640×590), 아래 가운데 [저장][닫기]. open()은 "법규 상세내용 수정", view()(sch 도메인이 씀)는 읽기 전용 "법규 상세내용"에 저장 버튼 없음
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsLaw } from '@/types/ics';
import { Button } from '@/components/button';

interface Props {
  /** open(selectModel, callback) L52-57 / view(selectModel, callback) L39-50 — 값이 있으면 열린다. 그리드에서 고치던 값까지 든 행 */
  law: IcsLaw | null;
  /** view(): 읽기 전용, 저장 버튼 없음 */
  readOnly?: boolean;
  /** closeButton[닫기]의 callback.execute() — 부른 쪽이 그 행을 다시 읽는다 */
  onClosed: () => void;
  /** 창의 닫기(X) — callback 없이 닫는다 */
  onClose: () => void;
}

export const Ics01_Lookup_Content: React.FC<Props> = ({ law, readOnly, onClosed, onClose }) => {
  const [content, setContent] = useState('');

  // [E0] 화면 열림 (생성자 L59-84) → getEditor(), show(): 폼에 상세내용을 채운다
  useEffect(() => { if (law) setContent(law.content ?? ''); }, [law]);

  // [E1] updateButton[저장].Select (L65) → update() L97-113: 서비스 ics.Ics01_ClassTree.modelUpdate(classTreeModel) → "저장이 완료되었습니다."
  const update = async () => {
    if (!law) return;
    try {
      await icsApi.updateLawContent(law, content);
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] closeButton[닫기].Select (L71) → callback.execute(); hide()
  const close = () => { onClosed(); onClose(); };

  return (
    <LookupModal
      open={!!law}
      title={readOnly ? '법규 상세내용' : '법규 상세내용 수정'}
      width={690}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!readOnly && <Button type="save" onClick={update}>저장</Button>}
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 590, resize: 'none' }} value={content} readOnly={readOnly} onChange={e => setContent(e.target.value)} />
    </LookupModal>
  );
};
