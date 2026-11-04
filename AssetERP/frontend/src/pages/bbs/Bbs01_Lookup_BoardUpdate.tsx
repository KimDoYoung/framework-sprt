/**
 * 게시판 수정 창 (EE82) — AS-IS는 자유게시판(Bbs01_Tab_Board·Bbs01_Tab_BoardManager)의 수정(더블클릭·[수정])이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs01_Lookup_BoardUpdate.java (183줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L62-81: 1100×720 모달(머리말은 등록과 같은 "게시판 등록"), 등록 창과 같은 본문(파일 칸 이름만 "첨부파일") + [저장][닫기][삭제]. 글은 호출처가 고른 행(boardModel)
 * [E2] [저장] → update() L144: bbs.Bbs01_Board.update 뒤 닫기
 * [E4] [삭제] → delete() L154: 확인 "삭제"/"선택한 내용을 삭제하시겠습니까?"(폭 300) → [E5] [예] (L157) bbs.Bbs01_Board.delete 뒤 닫기
 * 호출처 자유게시판(Bbs01_Tab_Board)은 메뉴가 없고 어디서도 열리지 않는다(AS-IS 사장 화면) — TOBE에서 여는 곳이 없다(작업기록)
 */
import React, { useEffect, useState } from 'react';
import { Modal, message, Space } from 'antd';
import { bbsFreeBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs01_BoardForm, BoardFormValue } from './Bbs01_BoardForm';

interface Props {
  /** 수정할 글 번호. 값이 있으면 열린다 */
  boardId: number | null;
  /** 저장·삭제 뒤 — 부른 쪽이 목록을 다시 읽는다 */
  onChanged: () => void;
  onClose: () => void;
}

export const Bbs01_Lookup_BoardUpdate: React.FC<Props> = ({ boardId, onChanged, onClose }) => {
  const [form, setForm] = useState<BoardFormValue | null>(null);
  const [initialContent, setInitialContent] = useState<string | null>(null);

  // [E0] 화면 열림 (생성자 L62-81, editDriver.edit(boardModel)): 글을 읽어 채움
  useEffect(() => {
    setForm(null);
    if (boardId == null) return;
    bbsFreeBoardApi.get(boardId)
      .then(b => {
        setInitialContent(b.content ?? null);
        setForm({ boardId: b.boardId, typeCode: b.typeCode ?? null, title: b.title ?? '', content: b.content ?? '', writeUserName: b.writeUserName ?? '', writeDate: b.writeDate ?? '' });
      })
      .catch(err => { message.error(errorMessage(err, '조회 실패')); onClose(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // [E2] updateButton[저장].Select (L92) → update() L144-152
  const update = async () => {
    if (!form) return;
    try {
      await bbsFreeBoardApi.save({ boardId: form.boardId, typeCode: form.typeCode, title: form.title || null, content: form.content || null, writeDate: form.writeDate });
      onChanged();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] deleteButton[삭제].Select (L104) → delete() L154-178
  const remove = () => {
    if (!form) return;
    Modal.confirm({
      title: '삭제', content: '선택한 내용을 삭제하시겠습니까?', width: 300, okText: '예', cancelText: '아니오',
      onOk: async () => {  // [E5] msgBox.DialogHide [YES] (L157) → delete 뒤 hide()
        try {
          await bbsFreeBoardApi.delete([form.boardId]);
          onChanged();
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={boardId != null && form != null}
      title="게시판 등록"
      width={1100}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L98) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            <Button type="delete" onClick={remove}>삭제</Button>
          </Space>
        </div>
      }
    >
      {form && <Bbs01_BoardForm value={form} onChange={p => setForm(f => (f ? { ...f, ...p } : f))} fileLabel="첨부파일" editorKey={`upd-${form.boardId}`} initialContent={initialContent} />}
    </LookupModal>
  );
};
