/**
 * 공지사항 보기 창 — MyPage 일정 박스 알림 탭의 공지사항(10010) [상세보기]가 연다 (EE110)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Popup_Notice.java (179줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openWithComment(title, notice, parentId, callback) L44-88: 1165×700, 본문(HTML) 760 | 회색 줄 5 | 댓글 탭(Bbs07_TapPage_Comment) 400
 * open(title, notice, parentId, callback) L90-123: 760×700, 본문만 — MyPage는 openWithComment만 쓴다
 * 머리글은 제목(78자 넘으면 "…", setHtmlHeaderStyle L163-173), 아래 가운데 [닫기][첨부파일 확인(n)], 닫기 X 없음(setClosable(false))
 * Bbs02_Popup_NoticeAdmin과 같은 모양에서 [해당 공지사항 그만보기]가 없는 창이다
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Space } from 'antd';
import { fileApi } from '@/api/file';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlView } from '@/components/form/HtmlView';
import { Bbs02_Lookup_File } from './Bbs02_Lookup_File';
import { Bbs07_TapPage_Comment } from './Bbs07_TapPage_Comment';

export interface NoticeViewInfo {
  noticeId: number;
  title: string;
  notice: string | null;
  /** true = openWithComment(댓글 탭 있음), false = open() */
  withComment: boolean;
}

interface Props {
  /** 있으면 열린다 */
  notice: NoticeViewInfo | null;
  onClose: () => void;
}

/** setHtmlHeaderStyle L163-173: 78자 넘으면 자르고 " ..." */
const headerText = (t: string) => (t.length > 78 ? `${t.substring(0, 78)} ...` : t);

export const Bbs02_Popup_Notice: React.FC<Props> = ({ notice, onClose }) => {
  const [fileCount, setFileCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const noticeId = notice?.noticeId;

  // [E0] 화면 열림 (생성자 L125-127) → settings() · setFileButtonText() L145-156: sys.Sys10_File.selectByParentId → "첨부파일 확인(n)"
  useEffect(() => {
    if (noticeId == null) return;
    fileApi.searchByParentId(noticeId).then(list => setFileCount(list.length)).catch(() => setFileCount(0));
  }, [noticeId]);

  const withComment = notice?.withComment === true;

  return (
    <LookupModal
      open={notice != null}
      title={<b>{headerText(notice?.title ?? '')}</b>}
      width={withComment ? 1165 : 760}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select (L130) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E2] fileButton[첨부파일 확인].Select (L136) → Bbs02_Lookup_File.openUser(parentId) */}
            <Button type="view" onClick={() => setShowFiles(true)}>{`첨부파일 확인(${fileCount})`}</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', height: 560 }}>
        {/* htmlReceiver.jsp iframe + setHtmlText(notice) */}
        <div style={{ width: withComment ? 760 : '100%', flex: withComment ? '0 0 auto' : 1 }}>
          <HtmlView html={notice?.notice} height="100%" />
        </div>
        {withComment && notice && (
          <>
            <div style={{ width: 5, background: '#e8e8e8', flex: '0 0 auto' }} />
            <div style={{ width: 400, flex: '0 0 auto' }}>
              {/* tabPage.retrieve(parentId) L86 */}
              <Bbs07_TapPage_Comment noticeId={notice.noticeId} />
            </div>
          </>
        )}
      </div>
      <Bbs02_Lookup_File open={showFiles} parentId={noticeId} onClose={() => setShowFiles(false)} />
    </LookupModal>
  );
};
