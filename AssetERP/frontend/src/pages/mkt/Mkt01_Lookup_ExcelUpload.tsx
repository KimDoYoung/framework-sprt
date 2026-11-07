/**
 * 데이터 업로드 창 (Z05) — Mkt01_Grid_TargetCompany의 [데이터업로드]에서 연다 (선택한 구분으로 활동처·담당자를 엑셀로 올린다)
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_ExcelUpload.java (143줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L46-65: 모달 "데이터 업로드" 270×150, X 없음, [템플릿][엑셀업로드], 아래 가운데 [닫기]
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useRef } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktTargetCompanyApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';

interface Props {
  /** open(itemTypeCode, callback) L40-44 — 올릴 구분 코드. 값이 있으면 열린다 */
  itemTypeCode: string | null;
  /** [닫기]·업로드 성공 뒤 callback.execute() */
  onDone: () => void;
  onClose: () => void;
}

export const Mkt01_Lookup_ExcelUpload: React.FC<Props> = ({ itemTypeCode, onDone, onClose }) => {
  // [E0] 화면 열림 (생성자 L46-65) → settings(), show()
  const fileForm = useRef<FileUpdownFormHandle>(null);

  // [E1] tempDownloadButton[템플릿].Select (L70) → ./excelTemplete/Template_업무활동등록.xlsx
  const template = async () => {
    try {
      await mktTargetCompanyApi.downloadTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E2] excelUploadButton[엑셀업로드].Select (L76) → excelUpload() L109-138 → [E5] fileUploadField.Change (L130) 파일을 고르면 곧바로 올린다
  // [E4] uploadExcelForm.SubmitComplete (L93): "Y"면 "데이터 업로드가 완료 되었습니다." 뒤 callback + hide, 아니면 오류 글을 보이고 hide
  const onFile = async (file: File | undefined) => {
    if (!file || itemTypeCode == null) return;
    try {
      await mktTargetCompanyApi.uploadExcel(itemTypeCode, file);
      message.info('데이터 업로드가 완료 되었습니다.');
      onDone();
    } catch (err) {
      message.warning(errorMessage(err, '업로드 실패'));
    }
    onClose();
  };

  return (
    <LookupModal
      open={itemTypeCode != null}
      title="데이터 업로드"
      width={300}
      closable={false}
      maskClosable={false}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] cancleButton[닫기].Select (L82) → callback.execute() + hide() */}
          <Button type="close" onClick={() => { onDone(); onClose(); }}>닫기</Button>
        </div>
      }
    >
      <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
        <Space>
          <Button type="download" onClick={template}>템플릿</Button>
          <Button type="upload" onClick={() => fileForm.current?.click()}>엑셀업로드</Button>
        </Space>
      </div>
      <FileUpdownForm ref={fileForm} accept=".xls,.xlsx" onChange={file => void onFile(file)} />
    </LookupModal>
  );
};
