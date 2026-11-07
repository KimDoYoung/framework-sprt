/**
 * 게시물 내용 조회창 (Z13) — Bbs31_Grid_Content의 "상세보기" 아이콘이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs31_Lookup_Content.java (225줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L54-105: 모달 1465×700, 머리글 = 게시물 제목, 왼쪽 = 본문(HTML), 오른쪽 400 = 댓글 탭(Bbs32_TapPage_Comment),
 *   아래 가운데 [수정][삭제](작성자 본인만) [닫기] [첨부파일 확인(n)]
 * 연결: Bbs31_Edit_Content(수정) · Bbs02_Lookup_File.openUser(첨부파일 확인 — 사용자용 = Bbs15 조회창과 같은 읽기 창)
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Space, message } from 'antd';
import { bbsBoardApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { BbsContent } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs02_Lookup_File } from './Bbs02_Lookup_File';
import { Bbs31_Edit_Content, BbsContentEdit } from './Bbs31_Edit_Content';
import { Bbs32_TapPage_Comment } from './Bbs32_TapPage_Comment';

interface Props {
  /** 있으면 열린다 (AS-IS open(contentModel, callback)) — 목록 행. 내용은 열 때 selectById로 읽는다 */
  row: BbsContent | null;
  /** [닫기]·삭제 뒤 (callback.execute() → 목록 다시 조회) */
  onClose: () => void;
}

export const Bbs31_Lookup_Content: React.FC<Props> = ({ row, onClose }) => {
  const user = useLoginUser();
  const [content, setContent] = useState<BbsContent | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const [editTarget, setEditTarget] = useState<BbsContentEdit | null>(null);
  const contentId = row?.contentId;

  // setFileButtonText() L196-207: 서비스 sys.Sys10_File.selectByParentId → "첨부파일 확인(n)"
  const setFileButtonText = useCallback(async () => {
    if (contentId == null) return;
    try {
      setFileCount((await fileApi.searchByParentId(contentId)).length);
    } catch {
      setFileCount(0);
    }
  }, [contentId]);

  // [E0] 열림 (생성자 L107-109, open L54-105) → 내용 읽기·댓글 탭 retrieve(parentId)·파일 수
  useEffect(() => {
    if (contentId == null) { setContent(null); return; }
    setContent(row);
    bbsBoardApi.getContent(contentId).then(setContent).catch(err => message.error(errorMessage(err, '조회 실패')));
    void setFileButtonText();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, setFileButtonText]);

  if (!row || contentId == null) return null;
  const isWriter = row.personId === user.userId;  // open L95: 작성자 본인에게만 [수정][삭제]

  // [E2] deleteButton[삭제].Select (L134) → deleteChk() L156-174 → [E5] msgBox.DialogHide [YES] (L159) → delete() L176-188: bbs.Bbs31_Content.modelDelete → callback, hide
  const deleteChk = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 게시물을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await bbsBoardApi.deleteContent(contentId);
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E1] updateButton[수정].Select (L112) → Bbs31_Edit_Content.edit(contentModel, callback → selectById 뒤 refresh(resultModel) L190-194)
  const refresh = async () => {
    try {
      setContent(await bbsBoardApi.getContent(contentId));
      void setFileButtonText();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  const view = content ?? row;
  return (
    <LookupModal
      open
      title={<b>{view.title}</b>}
      width={1465}
      style={{ top: 20 }}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {isWriter && <Button type="change" onClick={() => setEditTarget({ contentId, classTreeId: view.classTreeId, title: view.title, content: view.content, hideYn: view.hideYn })}>수정</Button>}
            {isWriter && <Button type="delete" onClick={deleteChk}>삭제</Button>}
            {/* [E3] closeButton[닫기].Select (L140) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E4] fileButton[첨부파일 확인].Select (L147) → Bbs02_Lookup_File.openUser(parentId) */}
            <Button type="view" onClick={() => setShowFiles(true)}>{`첨부파일 확인(${fileCount})`}</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 10, height: 'min(580px, calc(100vh - 230px))' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* key: 수정 뒤 본문이 바뀌면 HtmlView를 새로 그린다 (AS-IS setHtmlText) */}
          <HtmlView key={view.content ?? ''} html={view.content ?? ''} height="100%" />
        </div>
        <div style={{ width: 400, flex: 'none', background: '#f5f5f5', padding: 8, boxSizing: 'border-box' }}>
          <Bbs32_TapPage_Comment contentId={contentId} />
        </div>
      </div>
      <Bbs02_Lookup_File open={showFiles} parentId={contentId} onClose={() => setShowFiles(false)} />
      <Bbs31_Edit_Content model={editTarget} onClose={() => setEditTarget(null)} onDone={() => void refresh()} />
    </LookupModal>
  );
};
