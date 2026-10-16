/**
 * PDF 보기 (A33) — Sys95_Tab_Manual 오른쪽 미리보기. 매뉴얼용이라 PDF만 보여 준다(그림 미리보기는 Sys10 FilePreview)
 * AS-IS: myApp/client/vi/sys/Sys95_PDFViewer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(param) L34-68: "none" = "미리보기는 PDF 파일만 지원합니다. 기타파일은 다운로드하여 확인부탁드립니다." 안내,
 *   "empty" = 파일업로드 안내(A34 Sys95_Tab_ManualAdmin에서 쓴다), 그 밖 = PDFLoader 화면(PDF 파일). 원본 PDFLoader 대신 브라우저 PDF 뷰어로 연다.
 */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';

interface Props {
  /** PDF 파일 id. 없으면 안내 문구 */
  fileId?: number | null;
  /** 파일이 없을 때 문구: none(기본) = PDF만 지원, empty = 업로드 안내 */
  mode?: 'none' | 'empty';
}

const guide: React.CSSProperties = { padding: '60px 48px', lineHeight: '24px', fontWeight: 'bold', color: '#1F4D83', fontSize: 14 };

export const Sys95_PDFViewer: React.FC<Props> = ({ fileId, mode = 'none' }) => {
  const [url, setUrl] = useState<string>();

  // [E0] 화면 열림 (생성자 L24-28) → show() — fileId가 바뀔 때마다 view(param) → open(param) L34-68
  useEffect(() => {
    setUrl(undefined);
    if (fileId == null) return;
    let alive = true;
    let objectUrl: string | undefined;
    fileApi.fetchBlob(fileId).then(blob => {
      if (!alive) return;
      objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      setUrl(objectUrl);
    }).catch(err => message.error(errorMessage(err, '파일을 열 수 없습니다')));
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [fileId]);

  const box: React.CSSProperties = { height: '100%', background: '#fff', border: '1px solid #d9d9d9', boxSizing: 'border-box' };
  if (fileId == null) {
    return mode === 'empty'
      ? <div style={{ ...box, ...guide }}>좌측 상단의 [파일업로드]를 통해 첨부파일을 등록 및 관리가 가능합니다.<br />첨부파일 중 PDF는 해당화면에서 미리보기를 지원합니다.</div>
      : <div style={{ ...box, ...guide }}>미리보기는 PDF 파일만 지원합니다.<br />기타파일은 다운로드하여 확인부탁드립니다.</div>;
  }
  if (!url) return <div style={box} />;
  return <iframe title="manual-pdf" src={url} style={{ ...box, width: '100%', display: 'block', border: 0 }} />;
};
