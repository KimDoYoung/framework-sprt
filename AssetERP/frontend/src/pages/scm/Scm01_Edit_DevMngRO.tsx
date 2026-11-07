/**
 * 의뢰 요청내용 읽기 폼 + 첨부파일 (EE16). Scm01_Tab_DevMng 가운데
 * AS-IS: myApp/client/vi/scm/Scm01_Edit_DevMngRO.java (228줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L132-169: "요청내용 :" 링크(110) + 요청내용 보기(HTML, 490×105) + 첨부파일 라벨 · 첨부 그리드(600×105, 삭제 열 있음) + [파일업로드](120)
 * [E1]·[E5] fileUpload.Change (L88·L201) → FileUpload?parentId=srId&fileYn=false → [E2] SubmitComplete (L100) → 첨부 그리드 다시 조회
 * [E3] updateButton[파일업로드].Select (L124) → fileUpload.click() · [E4] anchor.MouseDown (L135) → Scm01_Lookup_SrContent.open(srContent) (보기 전용)
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useRef, useState } from 'react';
import { message } from 'antd';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Sr } from '@/types/scm';
import { Button } from '@/components/button';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { HtmlView } from '@/components/form/HtmlView';
import { Scm01_Grid_ApprFile, type ScmApprFileHandle } from './Scm01_Grid_ApprFile';
import { Scm01_Lookup_SrContent } from './Scm01_Lookup_SrContent';

const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 8, flex: 'none', fontSize: 12 };

interface Props {
  /** retrieve(param) — 고른 의뢰. null이면 init() */
  sr: Sr | null;
}

// [E0] 화면 열림 (생성자 L67-116) → settings(), getEditor(), show()
export const Scm01_Edit_DevMngRO: React.FC<Props> = ({ sr }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const fileList = useRef<ScmApprFileHandle>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  const upload = async (file: File | undefined) => {
    if (!file || !sr) return;
    try {
      await fileApi.upload(sr.srId, file, { fileYn: false });
      await fileList.current?.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', overflow: 'auto', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      {/* [E4] anchor.MouseDown (L135) → Scm01_Lookup_SrContent.open(srModel.getSrContent()) */}
      <a style={{ ...LABEL, width: 110, cursor: 'pointer', textDecoration: 'none', color: 'inherit', paddingTop: 4, marginLeft: 20 }}
         onClick={() => { if (sr) setLookupOpen(true); }}>요청내용 :</a>
      <div style={{ width: 490, flex: 'none' }}><HtmlView html={sr?.srContent ?? ''} height={95} /></div>
      <span style={{ ...LABEL, paddingTop: 4 }}>첨부파일</span>
      <div style={{ width: 480, height: 95, flex: 'none' }}>
        <Scm01_Grid_ApprFile ref={fileList} parentId={sr?.srId ?? null} editable />
      </div>
      {/* [E3] updateButton[파일업로드].Select (L124) → fileUpload.click() */}
      <Button type="upload" disabled={!sr} onClick={() => fileForm.current?.click()}>파일업로드</Button>
      <FileUpdownForm ref={fileForm} onChange={upload} />
      <Scm01_Lookup_SrContent open={lookupOpen} srContent={sr?.srContent ?? ''} enabledYn={false} srId={sr?.srId ?? null} onResult={() => undefined} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
