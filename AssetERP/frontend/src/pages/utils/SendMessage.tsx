/**
 * 메세지 작성 조회창 (A24, utils 도메인) — Sys86_Tab_Websocket의 "개별전송"·"전체전송"에서 연다
 * AS-IS: myApp/client/utils/SendMessage.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L48-68: 모달 450×250 "메세지 작성"(닫기 X 없음), 내용 입력칸 하나, 하단 전송·전송 및 로그아웃·닫기
 * open(msg, list, callback) L34-39 = 고른 사원(list)에게, open(msg, callback) L41-46 = 전체(list 없음)에게.
 * 전송(L71-80)은 이 창에서 바로 보낸다 — 성공하면 닫고, 오프라인 사원이 있으면 이름을 알리고 창을 둔다.
 * 전송 및 로그아웃(L81-106)은 확인 후 입력한 내용을 부른 쪽(onResult)에 돌려주고 닫는다 — 부른 쪽이 보내고 5분 표시를 시작한다.
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { WebsocketPerson } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  /** open(msg, …): 처음 내용(이전에 쓴 것) */
  msg: string;
  /** 고른 사원. null이면 전체에게 (open(msg, callback)) */
  list: WebsocketPerson[] | null;
  /** callbackResult.execute(내용): "전송 및 로그아웃"을 확인하면. 내용이 비었으면 null (원본 getCurrentValue()) */
  onResult: (text: string | null) => void;
  /** 닫기 (closeButton L107-112) */
  onClose: () => void;
}

export const SendMessage: React.FC<Props> = ({ open, msg, list, onResult, onClose }) => {
  const [text, setText] = useState(msg);

  // open(): 열 때 처음 내용을 채운다
  useEffect(() => {
    if (open) setText(msg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // sendButton L71-80 → list가 없으면 sendMessageAll() L163-180, 있으면 sendMessage() L119-161
  const send = async () => {
    if (!text.trim()) {
      message.warning('알림내용을 입력해주세요');
      return;
    }
    try {
      if (!list || list.length === 0) {
        await sysApi.sendWebsocketAlarmAll(text);
        message.success('전체알림이 발송되었습니다');
        onClose();
        return;
      }
      const res = await sysApi.sendWebsocketAlarm(list.map(p => p.personId), text);
      if (res.offlineNames.length > 0) {
        message.warning(`[ ${res.offlineNames.join(' ')} ] 해당 사용자는 오프라인 상태입니다`);
      } else {
        message.success('알림이 발송되었습니다');
        onClose();
      }
    } catch (err) {
      message.error(errorMessage(err, '알림 발송 실패'));
    }
  };

  // sendLogoutButton L81-106: 확인 "알림발송 후, 5분뒤 자동 로그아웃됩니다. 진행하시겠습니까?" → YES: callback(내용) + hide()
  const sendLogout = () => {
    Modal.confirm({
      title: '확인',
      content: '알림발송 후, 5분뒤 자동 로그아웃됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 460,
      onOk: () => {
        onResult(text.trim() ? text : null);
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      title="메세지 작성"
      width={450}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="send" onClick={send}>전송</Button>{' '}
            <Button type="send" onClick={sendLogout}>전송 및 로그아웃</Button>{' '}
            {/* closeButton[닫기].Select (L107) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 130, resize: 'none' }} value={text} onChange={e => setText(e.target.value)} />
    </Modal>
  );
};
