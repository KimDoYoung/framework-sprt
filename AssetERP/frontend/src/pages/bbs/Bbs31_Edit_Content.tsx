/**
 * 게시물 등록/수정 창 (Z13) — Bbs31_Grid_Content의 [게시물 작성], Bbs31_Lookup_Content의 [수정]에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs31_Edit_Content.java (253줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L68-91: "게시물 등록", 새 글 ID를 미리 받는다(첨부파일을 붙이려고) / edit() L93-113: "게시물 수정", 버튼 [저장]
 * 생성자 L115-142: 모달 1080×800, 라벨 60. 제목(920) + 비공개 체크 / 내용(HTML 편집기), 아래 가운데 [등록|저장][닫기][첨부파일 등록(n)]
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 * 연결: Bbs15_Lookup_File(첨부파일 등록 — 관리자용 = Bbs02_Lookup_File.open과 같은 창)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Input, Space, message } from 'antd';
import { bbsBoardApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { BbsContent } from '@/types/bbs';
import { Button } from '@/components/button';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
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

/** 라벨 칸 폭: 가장 긴 라벨 '비공개' 3글자 39+18=57 → 60 (편집 폼 모달 원칙) */
const LW = 60;

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
    <EditModal
      open
      title={<b>{isNew ? '게시물 등록' : '게시물 수정'}</b>}
      width={1080}
      style={{ top: 20 }}
      closable={false}
      onCancel={onClose}
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
      {/* 안쪽 폭 1000(1080 − 40): 제목 902 + 칸 사이 8 + 비공개 90 */}
      <EditRow>
        <EditField label="제목" labelWidth={LW} width={902}><Input value={title} onChange={e => setTitle(e.target.value)} /></EditField>
        <EditField label="비공개" labelWidth={LW} width={90}><Checkbox style={{ lineHeight: '32px' }} checked={hideYn} onChange={e => setHideYn(e.target.checked)} /></EditField>
      </EditRow>
      <EditField label="내용" labelWidth={LW}>
        <HtmlEditor key={model.contentId} value={model.content} onChange={setHtml} height={480} />
      </EditField>
      <Bbs15_Lookup_File open={fileOpen} parentId={contentId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
    </EditModal>
  );
};
