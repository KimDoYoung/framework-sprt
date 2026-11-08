/**
 * 프로그램 파일일괄등록 창 (EE19) — Scm30_Tab_Program의 [파일일괄등록]이 연다. 파일 여러 개를 골라 프로그램·첨부파일을 한꺼번에 만든다
 * AS-IS: myApp/client/vi/scm/Scm30_Lookup_MultiUpload.java (148줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L106-124 (280×210, 라벨 110): 시스템(ComboBoxField SystemCode, 빈 문구 "선택") / 구분(ProgramType, 빈 문구 "선택") / [업로드] [닫기]
 * open(callback) L41-44 · [E3] updateButton[업로드].Select (L86) → uploadChk() L126-137: 시스템·구분이 없으면 "시스템을 선택해주세요"·"구분을 선택해주세요", 있으면 파일 선택창을 연다
 * [E1] fileUpload.Change (L59) → FileUpload?mode=scm30&systemCode&programType&personId (FileUploadMulti, 여러 파일)
 * [E2] fileUploadForm.SubmitComplete (L77) → hide() 뒤 callBack.execute() (프로그램 목록 다시 조회)
 * [E4] closeButton[닫기].Select (L92) → hide()
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

const LABEL: React.CSSProperties = { width: 80, textAlign: 'right', paddingRight: 10, flex: 'none', fontSize: 12 };

interface Props {
  open: boolean;
  /** callBack.execute() — 올리기가 끝난 뒤 */
  onUploaded: () => void;
  onClose: () => void;
}

export const Scm30_Lookup_MultiUpload: React.FC<Props> = ({ open, onUploaded, onClose }) => {
  // [E0] 화면 열림 (생성자 L46-104) → show()
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [systemCd, setSystemCd] = useState<string | null>(null);
  const [programType, setProgramType] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (open) { setSystemCd(null); setProgramType(null); } }, [open]);

  // [E3] uploadChk() L126-137
  const uploadChk = () => {
    if (systemCd == null) { message.warning('시스템을 선택해주세요'); return; }
    if (programType == null) { message.warning('구분을 선택해주세요'); return; }
    fileForm.current?.click();
  };

  // [E1] fileUpload.Change → [E2] SubmitComplete → hide(), callBack.execute()
  const upload = async (files: File[]) => {
    if (!files.length || systemCd == null || programType == null) return;
    setUploading(true);
    try {
      await scmApi.multiUploadPrograms({ systemCd, programType }, files);
      onClose();
      onUploaded();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="파일일괄등록"
      width={380}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="upload" loading={uploading} onClick={uploadChk}>업로드</Button>
            {/* [E4] closeButton[닫기].Select (L92) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
          <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={files => void upload(files)} />
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', margin: '15px 10px 25px 0' }}>
        <span style={LABEL}>시스템</span>
        <SystemCodeComboBox kindCd="SystemCode" placeholder="선택" style={{ width: 240 }} value={systemCd ?? undefined} onChange={c => setSystemCd(c ?? null)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 10px 25px 0' }}>
        <span style={LABEL}>구분</span>
        <SystemCodeComboBox kindCd="ProgramType" placeholder="선택" style={{ width: 240 }} value={programType ?? undefined} onChange={c => setProgramType(c ?? null)} />
      </div>
    </LookupModal>
  );
};
