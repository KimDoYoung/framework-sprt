/**
 * 양식 등록 (N28) — Tdm43_Tab_RelateFormFileUpload의 [파일업로드]에서 연다. 구분·비고를 정하고 파일을 고르면 곧바로 올린다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_RelateFormFileMultiUpload.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L47-111: 모달 400×210 "양식 등록", 구분 콤보("선택하세요")·비고 + 아래 가운데 [업로드][닫기]
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  open: boolean;
  /** callBack.execute() — 올린 뒤 부른 쪽이 다시 조회한다 */
  onUploaded: () => void;
  onClose: () => void;
}

export const Tdm43_Lookup_RelateFormFileMultiUpload: React.FC<Props> = ({ open, onUploaded, onClose }) => {
  const [formType, setFormType] = useState<string>();   // typeComboBox "TdmCheckFormType" (emptyText "선택하세요")
  const [note, setNote] = useState('');
  const fileForm = useRef<FileUpdownFormHandle>(null);  // fileUpload (숨은 파일 선택)

  // [E0] 화면 열림 (생성자 L47-111) → show() — 열 때마다 구분("선택하세요")·비고를 비운다
  useEffect(() => {
    if (open) { setFormType(undefined); setNote(''); }
  }, [open]);

  // [E3] updateButton[업로드].Select (L93) → uploadChk() L133-139: 구분이 없으면 "구분을 선택하세요", 있으면 파일 선택창
  const uploadChk = () => {
    if (!formType) return void message.warning('구분을 선택하세요');
    fileForm.current?.click();
  };

  // [E1] fileUpload.Change (L59) → FileUpload?mode=tdmCheckForm&tdmFormType&note&parentId&personId (parentId·personId는 서버가 로그인 값으로)
  // [E2] fileUploadForm.SubmitComplete (L84) → callBack.execute(); hide()
  const onFilePicked = async (file: File | undefined) => {
    if (!file || !formType) return;
    try {
      await tdmApi.uploadFormFile(formType, note, file);
      message.success('파일을 성공적으로 등록하였습니다.');
      onUploaded();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title={<b>양식 등록</b>}
      width={400}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="upload" onClick={uploadChk}>업로드</Button>
            {/* [E4] closeButton[닫기].Select (L99) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '15px 0 10px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 70 }}>구분</span>
          <SystemCodeComboBox kindCd="TdmCheckFormType" placeholder="선택하세요" style={{ width: 250 }} value={formType} onChange={code => setFormType(code)} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 70 }}>비고</span>
          <Input style={{ width: 250 }} value={note} onChange={e => setNote(e.target.value)} />
        </label>
      </div>
      <FileUpdownForm ref={fileForm} onChange={file => { void onFilePicked(file); }} />
    </LookupModal>
  );
};
