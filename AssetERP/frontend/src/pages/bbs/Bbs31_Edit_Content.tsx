/**
 * 게시물 등록/수정 창 (Z13) — Bbs31_Grid_Content의 [게시물 작성], Bbs31_Lookup_Content의 [수정]에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs31_Edit_Content.java (253줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L68-91: "게시물 등록", 새 글 ID를 미리 받는다(첨부파일을 붙이려고) / edit() L93-113: "게시물 수정", 버튼 [저장]
 * 생성자 L115-142: 모달 1080×800, 라벨 60. 제목(920) + 비공개 체크 / 내용(HTML 편집기), 아래 가운데 [등록|저장][닫기][첨부파일 등록(n)]
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 * 연결: Bbs15_Lookup_File(첨부파일 등록 — 관리자용 = Bbs02_Lookup_File.open과 같은 창)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Input, Modal, Space, Typography, message } from 'antd';
import { bbsBoardApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { BbsContent } from '@/types/bbs';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { Bbs15_Lookup_File } from './Bbs15_Lookup_File';

/** 열 때 받는 값: isNew면 DB에 아직 없는 새 글(contentId는 미리 받은 새 ID, classTreeId는 올릴 세부항목) */
export type BbsContentEdit = Pick<BbsContent, 'contentId' | 'classTreeId' | 'title' | 'content' | 'hideYn'> & { isNew?: boolean };

interface Props {
  /** 편집할 글 — null이면 닫힘 */
  model: BbsContentEdit | null;
  onClose: () => void;
  /** AS-IS callback.execute() → retrieve() (저장한 뒤) */
  onDone?: () => void;
}

/** 라벨 폭 60 (form.setLabelWidth(60)) */
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text style={{ width: 60, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{children}</Typography.Text>
);

export const Bbs31_Edit_Content: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [title, setTitle] = useState('');
  const [hideYn, setHideYn] = useState(false);
  const [html, setHtml] = useState('');
  const [fileCount, setFileCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const contentId = model?.contentId;

  // 열릴 때마다 값을 채운다 (editDriver.edit(contentModel))
  useEffect(() => {
    if (!model) return;
    setTitle(model.title ?? '');
    setHideYn(model.hideYn);
    setHtml(model.content ?? '');
    setFileCount(0);
  }, [model]);

  // setFileButtonText() L171-182: 서비스 sys.Sys10_File.selectByParentId → "첨부파일 등록(n)"
  const setFileButtonText = useCallback(async () => {
    if (contentId == null) return;
    try {
      setFileCount((await fileApi.searchByParentId(contentId)).length);
    } catch {
      setFileCount(0);
    }
  }, [contentId]);
  useEffect(() => { void setFileButtonText(); }, [setFileButtonText]);

  if (!model) return null;
  const isNew = !!model.isNew;

  // [E1] updateButton[등록|저장].Select (L145) → update() L184-207: 제목 필수 → bbs.Bbs31_Content.modelUpdate(editchk) → callback, hide
  const update = async () => {
    if (!title.trim()) return message.warning('제목은 필수입력 항목입니다');
    setSaving(true);
    try {
      await bbsBoardApi.saveContent({ contentId: model.contentId, classTreeId: model.classTreeId, title, content: html, hideYn, editChk: !isNew });
      onClose();
      onDone?.();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={<b>{isNew ? '게시물 등록' : '게시물 수정'}</b>}
      width={1080}
      style={{ top: 20 }}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 규격: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type={isNew ? 'register' : 'save'} onClick={update} loading={saving}>{isNew ? '등록' : '저장'}</Button>
            {/* [E2] closeButton[닫기].Select (L151) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E3] addFileButton[첨부파일 등록(0)].Select (L157) → Bbs02_Lookup_File.open(contentId, callback → setFileButtonText()) */}
            <Button type="attach" onClick={() => setFileOpen(true)}>{`첨부파일 등록(${fileCount})`}</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L115-142) → settings(), getEditor() */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Label>제목</Label>
          <Input style={{ flex: 1 }} value={title} onChange={e => setTitle(e.target.value)} />
          <Label>비공개</Label>
          <Checkbox style={{ lineHeight: '32px' }} checked={hideYn} onChange={e => setHideYn(e.target.checked)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Label>내용</Label>
          <div style={{ flex: 1, minWidth: 0 }}>
            <HtmlEditor key={model.contentId} value={model.content} onChange={setHtml} height={480} />
          </div>
        </div>
      </div>
      <Bbs15_Lookup_File open={fileOpen} parentId={contentId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
    </Modal>
  );
};
