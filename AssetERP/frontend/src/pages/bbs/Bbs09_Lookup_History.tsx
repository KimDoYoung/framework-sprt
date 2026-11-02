/**
 * 공지 기록 창 (Z04) — Bbs02_Edit_NoticeAdmin 머리글의 "[기록]"을 누르면 연다 (저장할 때마다 남은 상태·변경 전 본문)
 * AS-IS: myApp/client/vi/bbs/Bbs09_Lookup_History.java (129줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(noticeId) L38-80: 모달 "기록" 600×700, 위 오른쪽 새로고침 아이콘, 그리드(buildGrid L82-105: 수정일시 200 · 구분 80 · 사원명 100 · 내용변경 80 · 상세보기 70), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { bbsNoticeAdminApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsNoticeHistory } from '@/types/bbs';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs02_Popup_NoticeAdmin } from './Bbs02_Popup_NoticeAdmin';

const gb = gbFor<BbsNoticeHistory>();

interface Props {
  /** 공지사항 ID — 값이 있으면 열린다 (AS-IS open(noticeId)) */
  noticeId: number | null;
  onClose: () => void;
}

export const Bbs09_Lookup_History: React.FC<Props> = ({ noticeId, onClose }) => {
  const [rows, setRows] = useState<BbsNoticeHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [before, setBefore] = useState<string | null>(null);

  // retrieve() L113-124: 서비스 bbs.Bbs09_NoticeHistory.selectByNoticeId(noticeId)
  const retrieve = useCallback(async () => {
    if (noticeId == null) return;
    setLoading(true);
    try {
      setRows(await bbsNoticeAdminApi.searchHistories(noticeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  // 열림 open() L38-80 → show() 뒤 retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() L82-105
  const columnDefs = useMemo(() => [
    gb.textCenter('regDateStr', 200, '수정일시'),  // L98
    gb.textCenter('openYn', 80, '구분'),  // L99
    gb.textCenter('personName', 100, '사원명'),  // L100
    gb.booleanYn('contentYn', 80, '내용변경'),  // L101
    // L102 addCell(actionCell, 70, "상세보기", ImageCell("View")) → 내용이 바뀐 줄이면 viewNotice(변경 전 본문) L108-111, 아니면 "변경된 내용이 없습니다"
    iconCell<BbsNoticeHistory>('view', 'actionCell', 70, '상세보기', row => {
      if (row.contentYn) setBefore(row.notice ?? '');
      else message.warning('변경된 내용이 없습니다');
    }),
  ], []);

  return (
    <LookupModal
      open={noticeId != null}
      title="기록"
      width={600}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] closeButton[닫기].Select (L69) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          {/* [E1] anchor.MouseDown (L48) → retrieve() */}
          <a onMouseDown={() => void retrieve()} title="새로고침"><ReloadOutlined /></a>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BbsNoticeHistory> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.noticeHistoryId)} loading={loading} />
        </div>
      </div>
      <Bbs02_Popup_NoticeAdmin
        notice={before != null ? { noticeId: noticeId ?? 0, title: '', notice: before, commentYn: false, beforeChange: true } : null}
        onClose={() => setBefore(null)}
      />
    </LookupModal>
  );
};
