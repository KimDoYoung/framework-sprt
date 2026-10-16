/**
 * 단체문자 편집 폼 (C06) — Sms03_Tab_SendAdmin 왼쪽 아래
 * AS-IS: myApp/client/vi/sms/Sms03_Edit_GroupSend.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L70-103: 제목(410) · 내용(410×220) · 빨간 안내문 · 비고(410), 하단 가운데 저장. 부모가 선택 행이 바뀔 때 key를 바꿔 retrieve(model)를 대신한다
 */
import React, { useState } from 'react';
import { Input, message } from 'antd';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { GroupSend } from '@/types/sms';
import { Button } from '@/components/button';

interface Props {
  /** AS-IS retrieve(infoModel) L105-111 — 없으면 빈 폼(editDriver.initialize) */
  model?: GroupSend;
  /** update() 콜백: 저장된 행으로 그리드 행을 바꾼다(임시 ID 행이면 새로 저장된 것) */
  onSaved: (saved: GroupSend, previousId?: number) => void;
}

export const Sms03_Edit_GroupSend: React.FC<Props> = ({ model, onSaved }) => {
  // [E0] 화면 열림 (생성자 L48-68) → getEditor(): editDriver.edit(model)
  const [title, setTitle] = useState(model?.title ?? '');
  const [content, setContent] = useState(model?.content ?? '');
  const [note, setNote] = useState(model?.note ?? '');

  // [E1] updateButton[저장].Select (L62) → update() L113-144
  const update = async () => {
    // flush(): 빈 칸은 null로 본다
    const flushed = { groupSendId: model?.groupSendId ?? null, title: title || null, content: content || null, note: note || null };
    if (flushed.title == null) {
      message.warning('제목은 필수입력 항목입니다.');
      return;
    }
    if (flushed.content == null) {
      message.warning('내용은 필수입력 항목입니다.');
      return;
    }
    // 고객사(회사 ID ≥ 2)는 90자 이하 — 서버가 로그인 회사로 검사해 문구를 돌려준다(admin 회사는 해당 없음)
    try {
      const saved = await smsApi.updateGroupSend(flushed);
      onSaved(saved, model?.groupSendId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #d9d9d9' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '30px 0 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: 470 }}>
          <label style={{ width: 60 }}>제목 </label>
          <Input style={{ width: 410 }} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div style={{ display: 'flex', width: 470, marginTop: 20 }}>
          <label style={{ width: 60 }}>내용 </label>
          <Input.TextArea style={{ width: 410, height: 220, resize: 'none' }} value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div style={{ margin: '10px 0 10px 60px', width: 410, color: '#DD5E5E' }}>
          ※ 내용은 띄어쓰기 포함 90자 이하로 작성하셔야합니다.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: 470, marginTop: 20 }}>
          <label style={{ width: 60 }}>비고 </label>
          <Input style={{ width: 410 }} value={note} onChange={e => setNote(e.target.value)} />
        </div>
      </div>
      <div style={{ flex: 'none', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" onClick={update}>저장</Button>
      </div>
    </div>
  );
};
