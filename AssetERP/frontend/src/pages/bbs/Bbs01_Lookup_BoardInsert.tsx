/**
 * 게시판 등록 창 (EE81) — AS-IS는 자유게시판(Bbs01_Tab_Board·Bbs01_Tab_BoardManager)의 [등록]이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs01_Lookup_BoardInsert.java (144줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-91: 1100×720 모달 "게시판 등록", 제목 · 구분(BoardTypeCode)·작성자(로그인 사원, 읽기 전용)·작성일(오늘) · 내용(편집기) · 파일("Sys10_Lookup_SelectMulti" 패널 120) + [저장][닫기]
 * 호출처(Bbs01_Tab_Board.insertRow L170)가 새 글 번호를 먼저 받아(DBUtil.setSeq) 모델을 만들어 넘긴다 — 파일을 글 저장 전에 그 번호로 올리려는 것. 이 창이 번호를 받는다
 * [E2] [저장] → update() L131: bbs.Bbs01_Board.update(UpdateDataModel — 새 글이면 INSERT) 뒤 닫기
 * 호출처 자유게시판(Bbs01_Tab_Board)은 메뉴가 없고 어디서도 열리지 않는다(AS-IS 사장 화면) — TOBE에서 여는 곳이 없다(작업기록)
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import dayjs from 'dayjs';
import { bbsFreeBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Bbs01_BoardForm, BoardFormValue } from './Bbs01_BoardForm';

interface Props {
  open: boolean;
  /** update() 뒤(저장 성공) — 부른 쪽이 목록을 다시 읽는다 */
  onSaved: () => void;
  onClose: () => void;
}

export const Bbs01_Lookup_BoardInsert: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const user = useLoginUser();
  const [form, setForm] = useState<BoardFormValue | null>(null);
  const [nonce, setNonce] = useState(0);

  // [E0] 화면 열림 (생성자 L54-91): 새 글 번호 + 작성자·작성일(오늘) 채움
  useEffect(() => {
    if (!open) { setForm(null); return; }
    bbsFreeBoardApi.nextId()
      .then(id => {
        setForm({ boardId: id, typeCode: null, title: '', content: '', writeUserName: user.name, writeDate: dayjs().format('YYYY-MM-DD') });
        setNonce(n => n + 1);
      })
      .catch(err => { message.error(errorMessage(err, '새 글 번호를 받지 못했습니다')); onClose(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] updateButton[저장].Select (L73) → update() L131-139
  const update = async () => {
    if (!form) return;
    try {
      await bbsFreeBoardApi.save({ boardId: form.boardId, typeCode: form.typeCode, title: form.title || null, content: form.content || null, writeDate: form.writeDate });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open && form != null}
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
            {/* [E3] closeButton[닫기].Select (L79) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {form && <Bbs01_BoardForm value={form} onChange={p => setForm(f => (f ? { ...f, ...p } : f))} fileLabel="파일:" editorKey={`ins-${nonce}`} />}
    </LookupModal>
  );
};
