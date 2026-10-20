/**
 * 공지사항 상세보기 창 (H01) — Bbs02_Tab_NoticeViewLaw의 "상세보기" 아이콘이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs02_Popup_NoticeAdmin.java (287줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * viewNotice() (Bbs02_Tab_NoticeViewLaw L134-152): 댓글 허용(commentYn)이면 openWithComment() L49-94 — 1165×700, 본문 760 | 회색 줄 5 | 댓글 탭 400
 *   아니면 open() L96-130 — 760×700, 본문만. 제목은 머리글(setHtmlHeaderStyle), 본문은 HTML(setHtmlText).
 *   아래 가운데: [해당 공지사항 그만보기] 체크 · [닫기] · [첨부파일 확인(n)]
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Space, message } from 'antd';
import { bbsNoticeApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { BbsNotice } from '@/types/bbs';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlView } from '@/components/form/HtmlView';
import { Bbs02_Lookup_File } from './Bbs02_Lookup_File';
import { Bbs07_TapPage_Comment } from './Bbs07_TapPage_Comment';

interface Props {
  /** 있으면 열린다 (AS-IS open/openWithComment(title, notice, noticeId, callback)) */
  notice: BbsNotice | null;
  /** callback.execute() 뒤 hide() — [닫기]와 그만보기 둘 다 */
  onClose: () => void;
}

export const Bbs02_Popup_NoticeAdmin: React.FC<Props> = ({ notice, onClose }) => {
  const [fileCount, setFileCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const noticeId = notice?.noticeId;

  // setFileButtonText() L258-269: 서비스 sys.Sys10_File.selectByParentId → "첨부파일 확인(n)"
  useEffect(() => {
    if (noticeId == null) return;
    fileApi.searchByParentId(noticeId).then(list => setFileCount(list.length)).catch(() => setFileCount(0));
  }, [noticeId]);

  // [E1] checkBox[해당 공지사항 그만보기].ValueChange [event.getValue()] (L199) → bbs.Bbs05_History.updatePersonId(…) → callback.execute(), hide()
  const onHide = async (checked: boolean) => {
    if (!checked || noticeId == null) return;
    try {
      await bbsNoticeApi.updateNoticeHistory(noticeId);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    }
  };

  const withComment = notice?.commentYn === true;

  return (
    <LookupModal
      open={notice != null}
      title={<b>{notice?.title}</b>}
      width={withComment ? 1165 : 760}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] 위 onHide */}
            <Checkbox checked={false} onChange={e => void onHide(e.target.checked)}>해당 공지사항 그만보기</Checkbox>
            {/* [E2] closeButton[닫기].Select [callback != null] (L220) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E3] fileButton[첨부파일 확인].Select (L229) → Bbs02_Lookup_File.openUser(parentId) */}
            <Button type="view" onClick={() => setShowFiles(true)}>{`첨부파일 확인(${fileCount})`}</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 열림 (생성자 L192-194) → settings() */}
      <div style={{ display: 'flex', height: 560 }}>
        <div style={{ width: withComment ? 760 : '100%', flex: withComment ? '0 0 auto' : 1 }}>
          <HtmlView html={notice?.notice} height="100%" />
        </div>
        {withComment && notice && (
          <>
            <div style={{ width: 5, background: '#e8e8e8', flex: '0 0 auto' }} />
            <div style={{ width: 400, flex: '0 0 auto' }}>
              <Bbs07_TapPage_Comment noticeId={notice.noticeId} />
            </div>
          </>
        )}
      </div>
      <Bbs02_Lookup_File open={showFiles} parentId={noticeId} onClose={() => setShowFiles(false)} />
    </LookupModal>
  );
};
