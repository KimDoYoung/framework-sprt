import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from './LookupModal';

/**
 * 글 입력·보기 창 — AS-IS myApp/client/utils/AreaMessage(입력 `edit`, 보기 `open`)와 NoticeMessage(보기 `show`).
 *
 *   // 변경사유 입력 (AS-IS AreaMessage.edit("변경사유", null, true, cb))
 *   <AreaMessage open={askReason} title="변경사유" required onResult={text => …} onClose={() => setAskReason(false)} />
 *   // 긴 글 보기 (AS-IS NoticeMessage.show("사유", text))
 *   <AreaMessage open title="사유" value={reason} readOnly width={450} height={250} onClose={…} />
 *
 * - 입력(`readOnly` 아님): [저장] = `onResult(글)`(`required`인데 비었으면 "{title}가 입력되지 않았습니다."), [닫기] = `required`면 `onResult(null)`. 둘 다 끝에 `onClose`.
 * - 보기(`readOnly`): [닫기]만 있다.
 * - 열릴 때마다 `value`로 다시 채운다. 500×400(AS-IS 기본), 크기는 `width`·`height`로.
 */
interface Props {
  open: boolean;
  title: string;
  value?: string | null;
  readOnly?: boolean;
  required?: boolean;
  width?: number;
  height?: number;
  onResult?: (text: string | null) => void;
  onClose: () => void;
}

export const AreaMessage: React.FC<Props> = ({ open, title, value, readOnly, required, width = 500, height = 400, onResult, onClose }) => {
  const [text, setText] = useState('');

  useEffect(() => { if (open) setText(value ?? ''); }, [open, value]);

  const save = () => {
    if (required && !text) {
      message.warning(`${title}가 입력되지 않았습니다.`);
      return;
    }
    onResult?.(text);
    onClose();
  };

  const close = () => {
    if (!readOnly && required) onResult?.(null);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title={title}
      width={width}
      closable={false}
      maskClosable={false}
      onCancel={close}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!readOnly && <Button type="save" onClick={save}>저장</Button>}
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea
        value={text}
        readOnly={readOnly}
        onChange={e => setText(e.target.value)}
        style={{ height: height - 130, resize: 'none' }}
      />
    </LookupModal>
  );
};
