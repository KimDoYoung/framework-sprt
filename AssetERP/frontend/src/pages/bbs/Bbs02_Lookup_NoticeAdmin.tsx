/**
 * 공지사항 목록 창 (EE83) — 로그인 직후 읽지 않은 공지가 둘 이상이면 AS-IS Calendar가 연다(TOBE는 연결 안 함)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Lookup_NoticeAdmin.java (195줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L43-105: 모달 920×400, 머리말 "공지사항 목록", 단일 그리드, 아래 가운데 [오늘 하루 이 창을 열지 않음] 체크 · [닫기]
 * buildGrid() L107-142: 핀 35 · 새 글 40 · 공지사항(HTML 제목) 630 · 등록일 90 · 보기 아이콘 50
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { bbsNoticeApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsNoticeCompany } from '@/types/bbs';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs02_Popup_NoticeAdmin, NoticePopupInfo } from './Bbs02_Popup_NoticeAdmin';

const gb = gbFor<BbsNoticeCompany>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Bbs02_Lookup_NoticeAdmin: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<BbsNoticeCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<NoticePopupInfo | null>(null);
  const [checked, setChecked] = useState(false);

  // retrieve() L144-156 — bbs.Bbs02_Notice.selectByTargetCompany
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await bbsNoticeApi.searchByTargetCompany());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 열림 (open L43-105) → checkBox false, show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setChecked(false);
    void retrieve();
  }, [open, retrieve]);

  // update() L158-172 — bbs.Bbs05_History.updatePersonId(noticeId 0, 오늘) → hide()
  const update = async () => {
    try {
      await bbsNoticeApi.updateNoticeHistory(0);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    }
  };

  // [E1] checkBox[오늘 하루 이 창을 열지 않음].ValueChange [YES] (L51) → 시스템공지가 있으면 확인창(L63), 없으면 update()
  const onCheck = (value: boolean) => {
    setChecked(value);
    if (!value) return;
    const alert = rows.some(r => r.noticeTypeName === '시스템공지');
    if (!alert) { void update(); return; }
    // [E2] msgBox.DialogHide (L65): YES → 체크 해제, NO → update()
    Modal.confirm({
      title: '확인',
      content: <span><b style={{ color: '#E33E31' }}>[시스템공지]</b>가 존재합니다. 확인해주세요</span>,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => setChecked(false),
      onCancel: () => { void update(); },
    });
  };

  // [E4][E5] 보기 아이콘 (actionCell L111-132): commentYn이면 openWithComment, 아니면 open → Bbs02_Popup_NoticeAdmin, 닫은 뒤 retrieve()
  const view = (row: BbsNoticeCompany) => {
    setNotice({ noticeId: row.noticeId, title: row.title, notice: row.notice ?? null, commentYn: row.commentYn ?? false, title2: row.title2 });
  };

  const isNew = (d?: string | null) => {
    if (!d) return false;
    const n = Number(dayjs(d).format('YYYYMMDD'));
    const today = Number(dayjs().format('YYYYMMDD'));
    return n === today || n === today - 1; // addNew() (오늘·어제)
  };

  const columns = [
    gb.pin('topYn', 35, ''),  // L135
    gb.text('fromDate', 40, '', {   // L136 addNew(fromDate)
      cellRenderer: (p: { value?: string | null }) => isNew(p.value) ? <img src="./img/icon/new.gif" alt="new" /> : null,
    }),
    gb.textHtml('title2', 630, '공지사항'),  // L137
    gb.date('fromDate', 90, '등록일'),  // L138
    iconCell<BbsNoticeCompany>('view', 'actionCell', 50, ' ', view),  // L139
  ];

  return (
    <>
      <LookupModal
        open={open}
        title="공지사항 목록"
        width={920}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Checkbox checked={checked} onChange={e => onCheck(e.target.checked)}>오늘 하루 이 창을 열지 않음</Checkbox>
              {/* [E3] closeButton[닫기].Select (L90) → confirm() → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 300 }}>
          <SingleGrid<BbsNoticeCompany> rowData={rows} columnDefs={columns} loading={loading} getRowId={p => String(p.data.noticeId)} />
        </div>
      </LookupModal>
      <Bbs02_Popup_NoticeAdmin notice={notice} onClose={() => { setNotice(null); void retrieve(); }} />
    </>
  );
};
