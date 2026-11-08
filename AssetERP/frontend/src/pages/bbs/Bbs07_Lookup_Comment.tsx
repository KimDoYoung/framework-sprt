/**
 * 댓글확인 창 (Z02) — Bbs02_Tab_NoticeManager 그리드의 "댓글 보기" 아이콘이 연다 (관리자용: 어느 댓글이든 ✕로 지운다)
 * AS-IS: myApp/client/vi/bbs/Bbs07_Lookup_Comment.java (181줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-77: 모달 "댓글확인" 405×700, 위 "총 댓글 : n개", 그리드(buildGrid L104-110: 행번호 숨김, 285 · 파일(n) 50 · ✕ 25, 모든 행을 펼쳐 댓글 내용을 보인다), 아래 가운데 [닫기]
 * 댓글 탭(Bbs07_TapPage_Comment)과 달리 삭제 칸이 항상 ✕(deleteMasterStr)이고 작성자 검사가 없다
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { bbsNoticeApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsComment } from '@/types/bbs';
import { Button } from '@/components/button';
import { SingleGrid } from '@/components/grid';
import { sanitizeHtml } from '@/components/grid/renderers';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs07_Lookup_FileList } from './Bbs07_Lookup_FileList';

interface Props {
  /** 공지사항 ID — 값이 있으면 열린다 (AS-IS open(noticeId)) */
  noticeId: number | null;
  /** [닫기]·창 닫기 — 부르는 쪽이 댓글 수를 다시 읽는다 */
  onClose: () => void;
}

export const Bbs07_Lookup_Comment: React.FC<Props> = ({ noticeId, onClose }) => {
  const [rows, setRows] = useState<BbsComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileComment, setFileComment] = useState<BbsComment | null>(null);

  // retrieve(noticeId) L133-148: 서비스 bbs.Bbs07_Comment.selectByNoticeId(companyId, personId, noticeId) → getSize() L150-166 (총 댓글 수 = 행 수, 펼치기는 첫 열 렌더로 대신)
  const retrieve = useCallback(async () => {
    if (noticeId == null) return;
    setLoading(true);
    try {
      setRows(await bbsNoticeApi.searchComments(noticeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  // [E0] 열림 (생성자 L55-77) → settings(), show() / open(noticeId) → retrieve(noticeId)
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E2] grid.CellClick [event.getCellIndex() == 4] (L97) → deleteChk() L112-131 → [E3] msgBox.DialogHide [YES] (L115) → delete() L172-176: bbs.Bbs07_Comment.delete
  const deleteChk = (row: BbsComment) => {
    Modal.confirm({
      title: '확인',
      content: '해당 댓글을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await bbsNoticeApi.deleteComment(row.commentId);
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo<ColDef<BbsComment>[]>(() => [
    {
      field: 'commentFullStr', headerName: ' ', width: 285, wrapText: true, autoHeight: true,  // L106 addTextHtml + 펼친 줄(내용)
      cellRenderer: (p: { data?: BbsComment }) => p.data ? (
        <div style={{ lineHeight: 1.4, padding: '2px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.data.commentFullStr) }} />
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, margin: '5px 5px 10px' }}>{p.data.comment}</div>
        </div>
      ) : null,
    },
    {
      field: 'fileStr', headerName: ' ', width: 50,  // L107 addTextSmall("0084D4") — [E2] grid.CellClick [event.getCellIndex() == 3] (L86) → Bbs07_Lookup_FileList.open(댓글, callback → retrieve(noticeId))
      cellStyle: { fontSize: 11, color: '#0084D4', cursor: 'pointer' },
      onCellClicked: (p: { data?: BbsComment }) => { if (p.data) setFileComment(p.data); },
    },
    {
      field: 'deleteMasterStr', headerName: ' ', width: 25,  // L108 addTextSmall("000000")
      cellStyle: { fontSize: 11, color: '#000000', cursor: 'pointer' },
      onCellClicked: (p: { data?: BbsComment }) => { if (p.data) deleteChk(p.data); },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <LookupModal
      open={noticeId != null}
      title="댓글확인"
      width={405}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] closeButton[닫기].Select (L80) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>{`총 댓글 : ${rows.length}개`}</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BbsComment> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.commentId)} loading={loading} rowNumber={false} />
        </div>
      </div>
      <Bbs07_Lookup_FileList comment={fileComment} onClose={() => { setFileComment(null); void retrieve(); }} />
    </LookupModal>
  );
};
