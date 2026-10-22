/**
 * 체크리스트 데이터 업로드 창 (K04) — Ics10_Tab_Checklist의 [기본설정] → [데이터업로드]에서 연다
 * AS-IS: myApp/client/vi/ics/Ics10_Lookup_ExcelUpload.java (127줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L43-62: 모달 270×150 "데이터 업로드"(닫기 X 없음), [템플릿][엑셀업로드], 아래 가운데 [닫기]
 */
import React, { useRef } from 'react';
import { message, Modal } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';

interface Props {
  open: boolean;
  /** 업로드가 끝났거나 [닫기] — callback.execute() 뒤 hide(). 부른 쪽이 다시 조회한다 */
  onClosed: () => void;
  /** 오류가 났을 때 hide()만 (callback 없음) */
  onClose: () => void;
}

export const Ics10_Lookup_ExcelUpload: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);

  // [E0] 화면 열림 (생성자 L43-62, open() L38-41) → settings(), show(): 제목 "데이터 업로드", 열 때 하는 조회는 없다

  // [E1] tempDownloadButton[템플릿].Select (L67) → downloadForm.submit() (./excelTemplete/Template_내부통제 체크리스트.xlsx)
  const downloadTemplate = async () => {
    try {
      await icsApi.downloadChecklistTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E5] fileUploadField.Change (L114) → uploadExcelForm.submit() → [E4] uploadExcelForm.SubmitComplete (L90): 결과 "Y"면 "데이터 업로드가 완료 되었습니다." 뒤 callback.execute(); hide(), 아니면 메시지 뒤 hide()
  const onFile = async (file?: File) => {
    if (!file) return;
    try {
      await icsApi.uploadChecklistExcel(file);
    } catch (err) {
      message.warning(errorMessage(err, '업로드 실패'));
      onClose();
      return;
    }
    message.success('데이터 업로드가 완료 되었습니다.');
    onClosed();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="데이터 업로드"
      width={320}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] cancleButton[닫기].Select (L79) → callback.execute(); hide() */}
          <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '10px 0' }}>
        <Button type="download" onClick={downloadTemplate}>템플릿</Button>
        {/* [E2] excelUploadButton[엑셀업로드].Select (L73) → excelUpload() L106-122: 파일 선택창 */}
        <Button type="upload" onClick={() => fileForm.current?.click()}>엑셀업로드</Button>
      </div>
      <FileUpdownForm ref={fileForm} accept=".xlsx,.xls" onChange={onFile} />
    </Modal>
  );
};
