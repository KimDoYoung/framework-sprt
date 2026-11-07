/**
 * 댓글 보기(읽기 전용) — 통합 문서검색(Dcr00_Tab_DocList, #1006) 그리드의 "댓글" 열 아이콘이 연다 (다른 도메인에서도 쓰는 조회창).
 * AS-IS: myApp/client/vi/apr/Apr42_Lookup_CommentView.java (121줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(apprId) L33-49: 510×600 모달 "댓글 보기", 그리드(댓글 420 · 파일 50, 머리·행번호 없음, 행 펼침 — 글이 모든 줄 아래에 펼쳐져 있다) 하나. 버튼·입력·삭제 없음(읽기 전용)
 * 댓글을 쓰고 지우는 창은 `Apr42_Lookup_Comment`(V04)이고 같은 조회·파일 창(`Apr42_Lookup_FileList`)을 쓴다.
 * 다른 점(12-화면우선원칙·Apr42_Lookup_Comment와 같게): 행 펼침 단추 칸(GridExpandBuilder)은 두지 않고 글은 처음부터 펼친 채 머리 아래 줄에 보인다.
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { aprCommentApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprComment } from '@/types/apr';
import { SingleGrid, gbFor } from '@/components/grid';
import { sanitizeHtml } from '@/components/grid/renderers';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr42_Lookup_FileList } from './Apr42_Lookup_FileList';

const gb = gbFor<AprComment>();

interface Props {
  /** AS-IS open(apprId) — 값이 있으면 열린다 */
  apprId: number | null;
  onClose: () => void;
}

export const Apr42_Lookup_CommentView: React.FC<Props> = ({ apprId, onClose }) => {
  const [rows, setRows] = useState<AprComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileTarget, setFileTarget] = useState<AprComment | null>(null);

  // retrieve(apprId) L84-100 · getSize() L102-116(모든 행 펼침): 서비스 apr.Apr42_Comment.selectByApprId(companyId, personId, apprId)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      setRows(await aprCommentApi.searchComments(apprId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);

  // [E0] 화면 열림 (생성자 L51-58) → settings()
  // open() L33-49: 열리면 바로 조회
  useEffect(() => {
    if (apprId == null) { setRows([]); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // buildGrid() L77-82: 행번호 숨김(setRowNumHidden), addTextHtml(commentFullStr 420) · addTextSmall(fileStr 50, 0084D4)
  const columnDefs = useMemo(() => [
    {
      ...gb.text('commentFullStr', 420, ' '),  // L79 addTextHtml + 행 펼침(글 = comment)
      autoHeight: true,
      wrapText: true,
      cellRenderer: (p: { data?: AprComment }) => p.data && (
        <div style={{ lineHeight: 1.6, padding: '4px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.data.commentFullStr) }} />
          <div style={{ whiteSpace: 'pre-wrap', color: '#434343', paddingLeft: 8 }}>{p.data.comment}</div>
        </div>
      ),
    },
    // [E1] grid.CellClick [event.getCellIndex() == 3] (L61) → Apr42_Lookup_FileList.open(선택 행, → retrieve(apprId))
    { ...gb.textCenter('fileStr', 50, ' '), cellStyle: { color: '#0084D4', cursor: 'pointer' }, onCellClicked: (e: { data?: AprComment }) => e.data && setFileTarget(e.data) },  // L80
  ], []);

  return (
    <>
      {/* 열 폭 합계 420+50 = 470 + 여백·스크롤바 약 90(행번호 없음) = 560 — AS-IS 510보다 작지 않게 (03 원칙 21) */}
      <LookupModal
        open={apprId != null}
        title="댓글 보기"
        width={560}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        footer={null}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      >
        <div style={{ height: 'min(500px, calc(100vh - 200px))' }}>
          <SingleGrid<AprComment>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.commentId)}
            loading={loading}
            rowNumber={false}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          />
        </div>
      </LookupModal>
      <Apr42_Lookup_FileList comment={fileTarget} onClose={() => { setFileTarget(null); void retrieve(); }} />
    </>
  );
};
