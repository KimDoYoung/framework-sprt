/**
 * 공지사항 창 (EE55) — Frm01_Lookup_CheckList(알림)의 [공지사항]이 연다. 나에게 온 읽지 않은 알림 공지 목록
 * AS-IS: myApp/client/vi/frm/Frm01_Lookup_NoticeList.java (102줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L32-46: 750×400, 머리말 "공지사항", 단일 그리드. open(callback) L27-30 → retrieve()
 * buildGrid() L48-83: 새 글 표시(오늘·어제 등록이면 NEW) 40 · 공지번호 100 · 공지사항(HTML 제목) 420 · 등록일 90 · 보기 아이콘 50
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { bbsNoticeApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsNoticeTarget } from '@/types/bbs';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs02_Popup_NoticeAdmin, NoticePopupInfo } from '../bbs/Bbs02_Popup_NoticeAdmin';

const gb = gbFor<BbsNoticeTarget>();

interface Props {
  open: boolean;
  /** AS-IS callback.execute() — 공지를 열었을 때(L72)·닫았을 때. 부르는 쪽이 건수를 다시 읽는다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Frm01_Lookup_NoticeList: React.FC<Props> = ({ open, onChanged, onClose }) => {
  const [rows, setRows] = useState<BbsNoticeTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<NoticePopupInfo | null>(null);

  // retrieve() L85-97 — bbs.Bbs02_Notice.selectByTargetPerson
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await bbsNoticeApi.searchByTargetPerson());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L32-46, open L27-30) → show(), retrieve()
  useEffect(() => { if (open) void retrieve(); }, [open, retrieve]);

  // [E2] 보기 아이콘 (actionCell L52-74): commentYn이면 openWithComment, 아니면 open → Bbs02_Popup_NoticeAdmin 뒤 callback.execute()
  const view = (row: BbsNoticeTarget) => {
    setNotice({ noticeId: row.noticeId, title: row.title, notice: row.notice ?? null, commentYn: row.commentYn ?? false, title2: row.title2 });
    onChanged?.();
  };

  const isNew = (d?: string | null) => {
    if (!d) return false;
    const n = Number(dayjs(d).format('YYYYMMDD'));
    const today = Number(dayjs().format('YYYYMMDD'));
    return n === today || n === today - 1; // addNew() GridBuilder L2101-2111 (오늘·어제)
  };

  const columns = [
    gb.text('fromDate', 40, '', {   // [E1] addNew(fromDate)
      cellRenderer: (p: { value?: string | null }) => isNew(p.value) ? <img src="./img/icon/new.gif" alt="new" /> : null,
    }),
    gb.textCenter('noticeNo', 100, '공지번호'),
    gb.textHtml('title2', 420, '공지사항'),
    gb.date('fromDate', 90, '등록일'),
    iconCell<BbsNoticeTarget>('view', 'actionCell', 50, ' ', view),
  ];

  return (
    <>
      <LookupModal
        open={open}
        title="공지사항"
        width={820}
        maskClosable={false}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ height: 300 }}>
          <SingleGrid<BbsNoticeTarget> rowData={rows} columnDefs={columns} loading={loading} getRowId={p => String(p.data.noticeId)} />
        </div>
      </LookupModal>
      <Bbs02_Popup_NoticeAdmin notice={notice} onClose={() => { setNotice(null); void retrieve(); onChanged?.(); }} />
    </>
  );
};
