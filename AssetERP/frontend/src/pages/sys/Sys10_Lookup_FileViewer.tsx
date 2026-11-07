/**
 * 파일보기 조회창 (A30) — Sys90_Grid_ApprFile 그리드의 보기 아이콘에서 연다. 다른 도메인에서도 쓰는 공통 클래스(B13에서 components/lookup으로)
 * AS-IS: myApp/client/vi/sys/Sys10_Lookup_FileViewer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L42-49·L137-149: 모달 1200×785 "파일보기"(닫기 X 없음), 본문 미리보기 650, 하단 닫기
 * PDF·그림은 브라우저가 직접 보여 주고, 그 밖의 문서는 원본 openOther()처럼 A-View 변환 서버의 미리보기 화면을 iframe으로 연다
 * (GET /api/v1/sys/files/{id}/aview, AS-IS template/fileViewer_AView.jsp). A-View 주소가 설정되지 않은 로컬 환경은 서버 안내 문구를 보여 준다
 * (AS-IS L77-83 "로컬환경에서는 미리보기를 지원하지 않습니다"). open(fileId)의 selectByFileId(확장자)는 행의 fileExt로 대신한다.
 * `FilePreview`는 Sys10_Lookup_ListFileViewer도 쓴다.
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';

const IMAGE_TYPES: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', webp: 'image/webp',
};

/** 미리보기 본문: PDF·그림은 브라우저가 보여 주고, 그 밖의 형식은 A-View 미리보기(안 되면 AS-IS JsonFileView_AView L105-115 안내 문구) */
export const FilePreview: React.FC<{ file?: FileInfo | null; height: number | string }> = ({ file, height }) => {
  const [url, setUrl] = useState<string>();
  const [aviewUrl, setAviewUrl] = useState<string>();
  const [aviewError, setAviewError] = useState<string>();
  const ext = (file?.fileExt ?? file?.fileNm?.split('.').pop() ?? '').toLowerCase();
  const supported = ext === 'pdf' || ext in IMAGE_TYPES;

  // 그 밖의 형식: A-View
  useEffect(() => {
    setAviewUrl(undefined);
    setAviewError(undefined);
    if (!file || supported) return;
    let alive = true;
    fileApi.getAViewUrl(file.fileId)
      .then(u => { if (alive) setAviewUrl(u); })
      .catch(err => { if (alive) setAviewError(errorMessage(err, '미리보기를 지원하지 않는 파일입니다.')); });
    return () => { alive = false; };
  }, [file, supported]);

  useEffect(() => {
    setUrl(undefined);
    if (!file || !supported) return;
    let alive = true;
    let objectUrl: string | undefined;
    fileApi.fetchBlob(file.fileId).then(blob => {
      if (!alive) return;
      objectUrl = URL.createObjectURL(new Blob([blob], { type: ext === 'pdf' ? 'application/pdf' : IMAGE_TYPES[ext] }));
      setUrl(objectUrl);
    }).catch(err => message.error(errorMessage(err, '파일을 열 수 없습니다')));
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [file, ext, supported]);

  const box: React.CSSProperties = { height, background: '#fff', border: '1px solid #d9d9d9', boxSizing: 'border-box' };
  if (!file) return <div style={box} />;
  if (!supported) {
    if (aviewUrl) return <iframe title="file-preview-aview" src={aviewUrl} style={{ ...box, width: '100%', display: 'block' }} />;
    if (!aviewError) return <div style={box} />;
    return (
      <div style={{ ...box, padding: '60px 48px', lineHeight: '24px', fontWeight: 'bold', color: '#1F4D83' }}>
        {aviewError}<br />다운로드하여 확인해주세요
      </div>
    );
  }
  if (!url) return <div style={box} />;
  return ext === 'pdf'
    ? <iframe title="file-preview" src={url} style={{ ...box, width: '100%', display: 'block' }} />
    : <div style={{ ...box, overflow: 'auto', textAlign: 'center' }}><img src={url} alt={file.fileNm} style={{ maxWidth: '100%' }} /></div>;
};

interface Props {
  /** AS-IS open(fileId) — 있으면 열린다 */
  file?: FileInfo | null;
  onClose: () => void;
}

export const Sys10_Lookup_FileViewer: React.FC<Props> = ({ file, onClose }) => (
  <LookupModal
    open={!!file}
    title="파일보기"
    width={1200}
    closable={false}
    maskClosable={false}
    onCancel={onClose}
    destroyOnClose
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1] closeButton[닫기].Select (L138) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <FilePreview file={file} height={650} />
  </LookupModal>
);
