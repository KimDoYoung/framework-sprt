/**
 * 서식파일등록 창 (E02) — Ics01_Tab_IcsFileUpload의 [파일업로드]에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_IcsFileMultiUpload.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L46-124: 모달 320×210 "서식파일등록", 법령구분 콤보(빈칸 "선택") · 내용(빈칸 "내용작성"), 아래 가운데 [업로드][닫기]
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  /** open(callback) L41-44 — 값이 true면 열린다 */
  open: boolean;
  /** callBack.execute() — 올린 뒤(SubmitComplete) 부른다 */
  onUploaded: () => void;
  onClose: () => void;
}

export const Ics01_Lookup_IcsFileMultiUpload: React.FC<Props> = ({ open, onUploaded, onClose }) => {
  const [lawType, setLawType] = useState<string | undefined>();
  const [content, setContent] = useState('');
  const fileForm = useRef<FileUpdownFormHandle>(null);

  // [E0] 화면 열림 (생성자 L46-104) → show()
  useEffect(() => { if (open) { setLawType(undefined); setContent(''); } }, [open]);

  // [E1] fileUpload.Change (L59-72): lawName=콤보 코드 · content · parentId=0 으로 FileUpload?mode=ics01 제출 → [E2] fileUploadForm.SubmitComplete (L77) → callBack.execute(); hide()
  const upload = async (files: File[]) => {
    if (!lawType || files.length === 0) return;
    try {
      for (const file of files) await icsApi.uploadFormFileAdmin(lawType, content, file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    onUploaded();
    onClose();
  };

  // [E3] updateButton[업로드].Select (L86) → uploadChk() L126-137
  const uploadChk = () => {
    if (!lawType) {
      message.warning('법령구분을 선택해주세요');
      return;
    }
    fileForm.current?.click();
  };

  return (
    <Modal
      open={open}
      title="서식파일등록"
      width={320}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="upload" onClick={uploadChk}>업로드</Button>
            {/* [E4] closeButton[닫기].Select (L92) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0 12px' }}>
        <Space>
          <span style={{ width: 60, display: 'inline-block', fontWeight: 600 }}>법령구분</span>
          <SystemCodeComboBox kindCd="LawType" value={lawType} placeholder="선택" style={{ width: 200 }}
            onChange={code => setLawType(code)} />
        </Space>
        <Space>
          <span style={{ width: 60, display: 'inline-block', fontWeight: 600 }}>내용</span>
          <Input style={{ width: 200 }} placeholder="내용작성" value={content} onChange={e => setContent(e.target.value)} />
        </Space>
      </div>
      <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={files => { void upload(files); }} />
    </Modal>
  );
};
