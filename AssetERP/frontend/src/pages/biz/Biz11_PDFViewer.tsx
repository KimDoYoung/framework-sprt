/**
 * PDF 보기 (EE20) — Biz11_Lookup_FileList 오른쪽 미리보기
 * AS-IS: myApp/client/vi/biz/Biz11_PDFViewer.java (69줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(param) L34-68: "none" = "미리보기는 PDF 파일만 지원합니다. 기타파일은 다운로드하여 확인부탁드립니다.", "empty" = 파일업로드 안내, 그 밖 = PDFLoader.
 * Sys95_PDFViewer(A33)와 문구·동작이 같아 그것을 그대로 쓴다 (원본 PDFLoader 대신 브라우저 PDF 뷰어).
 */
import React from 'react';
import { Sys95_PDFViewer } from '../sys/Sys95_PDFViewer';

interface Props {
  /** PDF 파일 id. 없으면 안내 문구 */
  fileId?: number | null;
  /** 파일이 없을 때 문구: none(기본) = PDF만 지원, empty = 업로드 안내 */
  mode?: 'none' | 'empty';
}

// [E0] 화면 열림 (생성자 L24-28) → show() — fileId가 바뀔 때마다 view(param) → open(param)
export const Biz11_PDFViewer: React.FC<Props> = ({ fileId, mode }) => <Sys95_PDFViewer fileId={fileId} mode={mode} />;
