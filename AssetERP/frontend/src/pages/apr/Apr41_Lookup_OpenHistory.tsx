/**
 * 열람기록 창 (V04) — 전자결재 문서창 머리의 [열람기록]이 연다.
 * AS-IS: myApp/client/vi/apr/Apr41_Lookup_OpenHistory.java (122줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L39-86: 650×840 모달 "열람기록", 위 오른쪽 새로고침 아이콘 + 그리드(열람일시 200 · 부서명 200 · 사원명 100 · 구분 100) + 페이징 툴바(20) + [닫기]
 * 12-화면우선원칙: 스크롤이 생기지 않도록 폭을 열 합계(행번호 30 포함)에 안쪽 여백을 더해 700으로 둔다.
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { aprCommentApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprOpenHistory } from '@/types/apr';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprOpenHistory>();
const LIMIT = 20;  // gridToolBar.setToolBar(20)

interface Props {
  /** AS-IS open(apprId) — 값이 있으면 열린다 */
  apprId: number | null;
  onClose: () => void;
}

export const Apr41_Lookup_OpenHistory: React.FC<Props> = ({ apprId, onClose }) => {
  const [rows, setRows] = useState<AprOpenHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // GridPagingLoader.getPaging(): apprId + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (apprId == null) return;
    setLoading(true);
    try {
      const res = await aprCommentApi.searchOpenHistories(apprId, (p - 1) * LIMIT, LIMIT);
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E1] anchor.MouseDown (L49) → retrieve() L99-117: 1페이지부터 다시 읽는다
  const retrieve = () => getPaging(1);

  // open() L39-86: 열리면 바로 조회
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    if (apprId != null) void retrieveRef.current();
    else { setRows([]); setTotal(0); setPage(1); }
  }, [apprId]);

  // buildGrid() L88-97
  const columnDefs = useMemo(() => [
    gb.textCenter('openDateStr', 200, '열람일시'),  // L90
    gb.text('orgName', 200, '부서명'),  // L91
    gb.textCenter('personName', 100, '사원명'),  // L92
    gb.textCenter('loginModeName', 100, '구분'),  // L93
  ], []);

  return (
    <LookupModal
      open={apprId != null}
      title="열람기록"
      width={700}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] closeButton[닫기].Select (L75) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'right' }}>
          {/* [E1] anchor.MouseDown (L49) — 새로고침 이미지 링크 */}
          <a role="button" title="새로고침" onClick={retrieve} style={{ fontSize: 15, color: '#595959', cursor: 'pointer' }}><ReloadOutlined spin={loading} /></a>
        </div>
        <div style={{ height: 'min(560px, calc(100vh - 300px))' }}>
          <SingleGrid<AprOpenHistory>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.openHistoryId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
    </LookupModal>
  );
};
