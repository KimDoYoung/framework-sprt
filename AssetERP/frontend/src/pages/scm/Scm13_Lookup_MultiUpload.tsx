/**
 * 변경프로그램 파일일괄등록 창 (EE17) — 파일 여러 개를 골라 프로그램·개발 프로그램·첨부파일을 한꺼번에 만든다
 * AS-IS: myApp/client/vi/scm/Scm13_Lookup_MultiUpload.java (152줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L112-134 (380×210, 라벨 80): 시스템(진행단계의 시스템, 수정 불가) / 구분(ProgramType 콤보, 빈 문구 "선택") · 배포대상 □ / [업로드] [닫기]
 * insert(devStepModel, callback) L46-52 · [E3] updateButton[업로드].Select (L98) → uploadChk() L136-143: 구분이 없으면 "구분을 선택해주세요", 있으면 파일 선택창을 연다
 * [E1] fileUpload.Change (L65) → FileUpload?mode=scm13&devId&deployTgtYn&systemCode&programType&personId (FileUploadMulti, 여러 파일)
 * [E2] fileUploadForm.SubmitComplete (L81) → hide() 뒤 callback.execute() (개발 프로그램 그리드 다시 조회)
 * [E4] closeButton[닫기].Select (L104) → hide()
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevStep } from '@/types/scm';
import { Button } from '@/components/button';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

const LABEL: React.CSSProperties = { width: 80, textAlign: 'right', paddingRight: 10, flex: 'none', fontSize: 12 };

interface Props {
  open: boolean;
  /** insert(devStepModel, callback) */
  devStep: DevStep | null;
  /** callback.execute() — 올리기가 끝난 뒤 */
  onUploaded: () => void;
  onClose: () => void;
}

export const Scm13_Lookup_MultiUpload: React.FC<Props> = ({ open, devStep, onUploaded, onClose }) => {
  // [E0] 화면 열림 (생성자 L54-95) → settings(), show() + insert(devStepModel, callback) L46-52
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [programType, setProgramType] = useState<string | null>(null);
  const [deployTgtYn, setDeployTgtYn] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (open) { setProgramType(null); setDeployTgtYn(false); } }, [open]);

  // [E3] uploadChk()
  const uploadChk = () => {
    if (programType == null) { message.warning('구분을 선택해주세요'); return; }
    fileForm.current?.click();
  };

  // [E1] fileUpload.Change → [E2] SubmitComplete → hide(), callBack.execute()
  const upload = async (files: File[]) => {
    if (!files.length || !devStep || devStep.devId == null || programType == null) return;
    setUploading(true);
    try {
      await scmApi.multiUploadDevPrograms({ devId: devStep.devId, deployTgtYn, systemCd: devStep.systemCd ?? '', programType }, files);
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
      title="변경프로그램 파일일괄등록"
      width={440}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="upload" loading={uploading} onClick={uploadChk}>업로드</Button>
            {/* [E4] closeButton[닫기].Select (L104) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
          <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={files => void upload(files)} />
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', margin: '15px 10px 25px 0' }}>
        <span style={LABEL}>시스템</span>
        <SystemCodeComboBox kindCd="SystemCode" disabled style={{ width: 240 }} value={devStep?.systemCd ?? undefined} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 10px 25px 0' }}>
        <span style={LABEL}>구분</span>
        <SystemCodeComboBox kindCd="ProgramType" placeholder="선택" style={{ width: 240 }} value={programType ?? undefined} onChange={c => setProgramType(c ?? null)} />
        <span style={{ ...LABEL, width: 70, paddingRight: 6 }}>배포대상</span>
        <Checkbox checked={deployTgtYn} onChange={e => setDeployTgtYn(e.target.checked)} />
      </div>
    </LookupModal>
  );
};
