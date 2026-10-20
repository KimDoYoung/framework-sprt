/**
 * 내규 상세내용 창 (E13-3, H09) — Icr01_Lookup_SelectMulti 그리드·내규조회(H03)의 상세 아이콘은 읽기 전용(view),
 * 내규관리(H09 Icr01_Grid_IcrType)의 상세내용 [수정] 아이콘은 편집(open)으로 연다.
 * AS-IS: myApp/client/vi/icr/Icr01_Lookup_Content.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L81-90: 모달 650×680, 상세내용 입력(640×590), 아래 가운데 [저장][닫기]. view() L38-45는 읽기 전용 "내규 상세내용"에 저장 버튼 없음,
 * open() L47-52는 "내규 상세내용 수정"
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcrClassTreeLookup, IcrRule } from '@/types/icr';
import { Button } from '@/components/button';

interface Props {
  /** view(selectModel, callback) L38 / open(selectModel, callback) L47 — 값이 있으면 열린다. 편집(editable)이면 그리드에서 고치던 값까지 든 내규 행 */
  row: Pick<IcrClassTreeLookup, 'content'> | IcrRule | null;
  /** open() 편집 모드: [저장]이 있고 "내규 상세내용 수정". 없으면 view() */
  editable?: boolean;
  /** closeButton[닫기]의 callback.execute() — 부른 쪽이 그 행을 다시 읽는다 */
  onClosed?: () => void;
  /** 창의 닫기(X) */
  onClose: () => void;
}

export const Icr01_Lookup_Content: React.FC<Props> = ({ row, editable, onClosed, onClose }) => {
  const [content, setContent] = useState('');

  // [E0] 화면 열림 (생성자 L54-79) → getEditor(), show(): 폼에 상세내용을 채운다
  useEffect(() => { if (row) setContent(row.content ?? ''); }, [row]);

  // [E1] updateButton[저장].Select (L60) → update() L92-108: 서비스 icr.Icr01_ClassTree.modelUpdate(classTreeModel) → "저장이 완료되었습니다."
  const update = async () => {
    if (!row) return;
    try {
      await icrApi.updateRuleContent(row as IcrRule, content);
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] closeButton[닫기].Select (L66) → callback.execute(); hide()
  const close = () => { onClosed?.(); onClose(); };

  return (
    <LookupModal
      open={!!row}
      title={editable ? '내규 상세내용 수정' : '내규 상세내용'}
      width={690}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {editable && <Button type="save" onClick={update}>저장</Button>}
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 590, resize: 'none' }} value={content} readOnly={!editable} onChange={e => setContent(e.target.value)} />
    </LookupModal>
  );
};
