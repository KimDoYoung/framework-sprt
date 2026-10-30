/**
 * 전자결재 문서 상세 (V01 문서 읽기) — 결재선·연관 그리드·첨부를 보는 읽기 창. 승인·반려·상신취소(V02)·상신·저장(V03)·오타수정·공람·폐기(V04)는 다음 ID.
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_ApprDoc.java (5864줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L339-507: 1600×870 모달 "문서상세"(닫기 X 없음), 머리 오른쪽 [열람기록][댓글(n)], 위 150 = 왼쪽 문서구분·상신제목(getApprovalForm01 L4648-4704) + 오른쪽 시행일자·상신일자·인감종류·대표회사·대표서명·수신·참조·비고(getApprovalForm02 L4706-4794),
 *   가운데 = 왼쪽 상신내용(getHtmlForm L4796-4817) + 오른쪽 Apr03_Page_Relate(탭 7개 + 결재선), 푸터 가운데 [미리보기][닫기] + 북마크 별
 * 열기: retrieveApproval(apprId | apprModel, adminFlag, callback) L510-525 → getApprModel L535-560(selectById, 임시저장·관리자가 아니면 열람기록, 북마크 조회) → retrieveApproval L643-728
 * 조회창 규격(11a)·12 원칙: LookupModal, 머리 아래 선·푸터 위 선, 안쪽 스크롤은 그리드·상신내용 하나씩. 상신내용은 읽기 전용 HtmlView(AS-IS는 CKEditor — 수정은 V04 오타수정)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Radio, Space } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { aprDetailApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprDetail } from '@/types/apr';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlView } from '@/components/form/HtmlView';
import { Apr03_Page_Relate } from './Apr03_Page_Relate';

const day = (v?: string | null) => (v ? v.slice(0, 10) : '');
const LABEL_W = 90;

interface Props {
  /** 값이 있으면 열림 — AS-IS retrieveApproval(apprId, …) */
  apprId: number | null;
  /** 목록 행의 상태 코드(있으면) — '99'(임시저장)이면 열람기록을 남기지 않는다. 없으면 문서의 상태로 서버가 정한다 */
  statusCode?: string | null;
  /** [닫기] 단추 (AS-IS callback.execute() 뒤 hide) — 상세 창이 바꾼 것이 있을 때 목록을 다시 읽는 용. V01은 읽기라 바뀐 것은 없다 */
  onClosed?: () => void;
  onClose: () => void;
}

/** 한 줄: 라벨(오른쪽 정렬) + 칸 */
const Row: React.FC<{ label: string; children: React.ReactNode; grow?: boolean }> = ({ label, children, grow }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: grow ? 1 : undefined, minWidth: 0 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>{label}</span>
    {children}
  </div>
);

export const Apr01_Edit_ApprDoc: React.FC<Props> = ({ apprId, statusCode, onClosed, onClose }) => {
  const [doc, setDoc] = useState<AprApprDetail | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentSize, setCommentSize] = useState(0);

  // [E0] 화면 열림 (생성자 L339-507) → getCommentSize(), getApprovalForm01(), getApprovalForm02(), getHtmlForm()
  // getApprModel() L535-560: apr.Apr01_Appr.selectById → (임시저장이 아니고 관리자가 아니면) insertHistory() L582-596 → retrieveApproval() L643-728 / getApprBookmark() L562-580 / getCommentSize() L5808-5820
  useEffect(() => {
    setDoc(null);
    setBookmarked(false);
    setCommentSize(0);
    if (apprId == null) return;
    let alive = true;
    void (async () => {
      try {
        const d = await aprDetailApi.getDetail(apprId);
        if (!alive) return;
        setDoc(d);
        if ((statusCode ?? d.statusCode) !== '99') void aprDetailApi.recordOpen(apprId);
        const [bm, cs] = await Promise.all([aprDetailApi.isBookmarked(apprId), aprDetailApi.getCommentSize(apprId)]);
        if (alive) { setBookmarked(bm); setCommentSize(cs); }
      } catch (err) {
        if (alive) { message.error(errorMessage(err, '문서를 열 수 없습니다')); onClose(); }
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apprId]);

  const next = (text: string) => message.info(text);

  // [E3] header.Dom 클릭 (L380) — 원본도 빈 핸들러
  // header tool: [E1] historyButton[열람기록].Select (L348) → Apr41_Lookup_OpenHistory.open(apprId) — V04
  //              [E2] commentButton[댓글].Select (L355) → Apr42_Lookup_Comment.open(apprModel, cb) — V02
  const title = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span>{doc?.classTreeFullName ?? '문서상세'}</span>
      <Space size={4}>
        <Button type="view" onClick={() => next('열람기록 창은 V04에서 연결합니다.')}>열람기록</Button>
        <Button type="view" onClick={() => next('댓글 창은 V02에서 연결합니다.')}>댓글 {commentSize}</Button>
      </Space>
    </div>
  );

  return (
    <LookupModal
      open={apprId != null}
      title={title}
      width={1600}
      style={{ top: 20 }}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* [E6] bookMarkAnchor.MouseDown (L493) → Apr50_Lookup_PersonList.open(apprId, cb) — 공람자·북마크 설정 창은 V04 */}
          <span
            role="button"
            aria-label="북마크"
            style={{ cursor: 'pointer', fontSize: 24, color: bookmarked ? '#faad14' : '#bfbfbf' }}
            onMouseDown={() => next('북마크 설정 창은 V04에서 연결합니다.')}
          >
            {bookmarked ? <StarFilled /> : <StarOutlined />}
          </span>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Space>
              {/* [E4] pdfButton[미리보기].Select (L461) → 대외문서면 makePreviewPDF(null), 사내문서(품의·보고)면 "시스템에서 제공하는 기본 양식을 적용하여 보시겠습니까?" 확인 [E5] 뒤 PDF — PDFViewer는 V04 */}
              <Button type="view" onClick={() => next('PDF 미리보기는 V04에서 연결합니다.')}>미리보기</Button>
              {/* [E11] closeButton[닫기].Select [callback != null] (L1121) → callback.execute(), hide() */}
              <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
            </Space>
          </div>
          <span style={{ width: 24 }} />
        </div>
      }
    >
      {doc && (
        <div style={{ height: 'min(740px, calc(100vh - 190px))', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* north 150: 왼쪽 문서구분·상신제목, 오른쪽 시행일자~비고 */}
          <div style={{ display: 'flex', gap: 24, background: '#f5f5f5', borderRadius: 4, padding: '10px 14px' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* 문서구분 라디오: setRadio(inOutTypeCode) L4825-4834 — 읽기에서는 바꿀 수 없다 */}
              <Row label="문서구분">
                <Radio.Group value={doc.inOutTypeCode === '10' ? '10' : '20'} disabled>
                  <Radio value="10">대외문서(공문)</Radio>
                  <Radio value="20">사내문서(품의·보고)</Radio>
                </Radio.Group>
              </Row>
              <Row label="상신제목" grow><Input value={doc.title ?? ''} readOnly style={{ flex: 1 }} /></Row>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Row label="시행일자"><Input value={day(doc.effectDate)} readOnly style={{ width: 110 }} /></Row>
                <Row label="상신일자"><Input value={day(doc.regDate)} readOnly style={{ width: 110 }} /></Row>
                <Row label="인감종류" grow>
                  <Input value={doc.stampName ?? ''} readOnly style={{ flex: 1 }} />
                  <Input value={doc.stampPositionName ?? ''} readOnly style={{ width: 90 }} />
                </Row>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Row label="대표회사" grow><Input value={doc.signCompany ?? ''} placeholder="대외문서 하단표기" readOnly style={{ flex: 1 }} /></Row>
                <Row label="대표서명" grow><Input value={doc.signCeo ?? ''} placeholder="대외문서 하단표기" readOnly style={{ flex: 1 }} /></Row>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Row label="수    신" grow><Input value={doc.receiveName ?? ''} readOnly style={{ flex: 1 }} /></Row>
                <Row label="참    조" grow><Input value={doc.referenceName ?? ''} readOnly style={{ flex: 1 }} /></Row>
              </div>
              <Row label="비    고" grow><Input value={doc.note ?? ''} readOnly style={{ flex: 1 }} /></Row>
            </div>
          </div>
          {/* center: 왼쪽 상신내용 / 오른쪽 탭 + 결재선 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 'bold', fontSize: 12 }}>상신내용</div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <HtmlView html={doc.content} height="100%" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Apr03_Page_Relate doc={doc} />
            </div>
          </div>
        </div>
      )}
    </LookupModal>
  );
};
