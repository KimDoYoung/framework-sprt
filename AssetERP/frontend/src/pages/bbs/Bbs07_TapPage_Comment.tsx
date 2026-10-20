/**
 * 공지사항 댓글 탭 (H01) — Bbs02_Popup_NoticeAdmin 오른쪽 400폭 탭 (댓글 허용 공지만)
 * AS-IS: myApp/client/vi/bbs/Bbs07_TapPage_Comment.java (194줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 툴바 "댓글등록: {commentField 200 "내용을 입력하세요"} [등 록]" + 그리드(buildGrid L101-107: 행번호 숨김, 285 · 파일(n) 50 · ✕ 25, 모든 행을 펼쳐 댓글 내용을 보인다 — GridExpandBuilder)
 * 펼친 줄(RowExpander)은 AG Grid 커뮤니티에 없어 첫 열 안에 "머리글 + 내용"을 자동 높이로 그린다.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Modal, message } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { bbsNoticeApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsComment } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid } from '@/components/grid';
import { sanitizeHtml } from '@/components/grid/renderers';
import { Bbs07_Lookup_FileList } from './Bbs07_Lookup_FileList';

interface Props {
  /** 공지사항 ID — AS-IS retrieve(noticeId) */
  noticeId: number;
}

export const Bbs07_TapPage_Comment: React.FC<Props> = ({ noticeId }) => {
  const user = useLoginUser();
  const [rows, setRows] = useState<BbsComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [fileComment, setFileComment] = useState<BbsComment | null>(null);

  // retrieve() L135-150: 서비스 bbs.Bbs07_Comment.selectByNoticeId(companyId, personId, noticeId) — getSize()의 행 펼치기는 첫 열 렌더로 대신
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await bbsNoticeApi.searchComments(noticeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  // [E0] 열림 (생성자 L51-66) → settings(), 부르는 쪽 tabPage.retrieve(parentId)
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] insertButton[등 록].Select (L71): 내용이 없으면 "내용을 입력해주세요", 있으면 update() L168-183 → 목록 다시 읽고 입력칸 비움
  const update = async () => {
    if (!text) {
      message.warning('내용을 입력해주세요');
      return;
    }
    try {
      await bbsNoticeApi.createComment(noticeId, text);
      await retrieve();
      setText('');
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // [E2] grid.CellClick [event.getCellIndex() == 3] (L81) → "파일(n)" 칸: Bbs07_Lookup_FileList.open(댓글, callback → retrieve(noticeId))
  //      [event.getCellIndex() == 4] → ✕ 칸(내 댓글만 ✕): deleteChk() L109-133
  const deleteChk = (row: BbsComment) => {
    if (row.personId !== user.userId) {
      message.warning('작성자만 댓글을 삭제할 수 있습니다');
      return;
    }
    // [E3] msgBox.DialogHide [YES] (L113) → delete() L185-189: bbs.Bbs07_Comment.delete
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
      field: 'commentFullStr', headerName: ' ', width: 285, wrapText: true, autoHeight: true,  // L103 addTextHtml + 펼친 줄(내용)
      cellRenderer: (p: { data?: BbsComment }) => p.data ? (
        <div style={{ lineHeight: 1.4, padding: '2px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.data.commentFullStr) }} />
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, margin: '5px 5px 10px' }}>{p.data.comment}</div>
        </div>
      ) : null,
    },
    {
      field: 'fileStr', headerName: ' ', width: 50,  // L104 addTextSmall("0084D4")
      cellStyle: { fontSize: 11, color: '#0084D4', cursor: 'pointer' },
      onCellClicked: (p: { data?: BbsComment }) => { if (p.data) setFileComment(p.data); },
    },
    {
      field: 'deleteStr', headerName: ' ', width: 25,  // L105 addTextSmall("000000")
      cellStyle: { fontSize: 11, color: '#000000', cursor: 'pointer' },
      onCellClicked: (p: { data?: BbsComment }) => { if (p.data?.deleteStr === '✕') deleteChk(p.data); },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.userId, retrieve]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <span style={{ paddingTop: 4 }}>댓글등록</span>
        <Input.TextArea
          style={{ width: 200 }}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="내용을 입력하세요"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button type="register" onClick={update}>등 록</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BbsComment>
          rowNumber={false}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.commentId)}
          loading={loading}
        />
      </div>
      {/* [E2] 파일 칸 → Bbs07_Lookup_FileList.open(…, callback → retrieve(noticeId)) */}
      <Bbs07_Lookup_FileList comment={fileComment} onClose={() => { setFileComment(null); void retrieve(); }} />
    </div>
  );
};
