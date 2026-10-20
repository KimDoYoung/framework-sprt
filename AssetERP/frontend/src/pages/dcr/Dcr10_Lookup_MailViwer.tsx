/**
 * 발신메일 상세보기창 (G14) — 발신메일목록(Dcr10_Tab_MailHistory)의 [내용] 아이콘이 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr10_Lookup_MailViwer.java (186줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L61-121: 850×780 모달 "상세보기"(닫기 X 없음), 라벨 85 + 발신 · 수신 · 참조 · 제목(각 32) · 내용(HTML, 350) · 첨부파일 그리드(180, 체크박스 단일: 첨부파일 570 · 받기 70), 아래 가운데 [닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { dcrMailHistoryApi } from '@/api/dcr';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { DcrMailFile, DcrMailHistory } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<DcrMailFile>();

interface Props {
  /** open(selectModel) L152 — 볼 메일. null이면 닫힘 */
  mail: DcrMailHistory | null;
  onClose: () => void;
}

const LABEL_WIDTH = 85;

export const Dcr10_Lookup_MailViwer: React.FC<Props> = ({ mail, onClose }) => {
  const [files, setFiles] = useState<DcrMailFile[]>([]);

  // [E0] 화면 열림 (생성자 L61-121) → settings()
  // open() L152-172: 서비스 sys.Sys10_File.selectMailFileHistory(mailFileHistoryId = 메일 ID)로 첨부파일 조회
  useEffect(() => {
    if (!mail) return;
    setFiles([]);
    dcrMailHistoryApi.searchMailFiles(mail.mailHistoryId)
      .then(setFiles)
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [mail]);

  // buildGrid() L123-141 (체크박스 단일)
  const columnDefs = useMemo(() => [
    gb.text('fileName', 570, '첨부파일'),  // L137
    // L138 actionCell(Down) → FileDownload?fileType=file&fileId=선택한 행
    iconCell<DcrMailFile>('down', 'actionCell', 70, '받기', row => fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')))),
  ], []);

  const row = (label: string, value?: string | null) => (
    <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
      <span style={{ width: LABEL_WIDTH, flex: 'none' }}>{label}</span>
      <Input value={value ?? ''} readOnly style={{ flex: 1 }} />
    </div>
  );

  return (
    <LookupModal
      open={mail != null}
      title="상세보기"
      width={850}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] closeButton[닫기].Select (L144) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ padding: '15px 15px 0' }}>
        {/* open() L152-172: 제목·발신·수신·참조는 메일의 값, 내용은 setHtmlText(본문) */}
        {row('발  신 :', mail?.senderEmail)}
        {row('수  신 :', mail?.receiverEmail)}
        {row('참  조 :', mail?.referencerEmail)}
        {row('제  목 :', mail?.titleText)}
        <div style={{ display: 'flex', marginBottom: 5 }}>
          <span style={{ width: LABEL_WIDTH, flex: 'none', paddingTop: 2 }}>내  용 :</span>
          <div style={{ flex: 1 }}><HtmlView html={mail?.bodyText} height={350} /></div>
        </div>
        <div style={{ display: 'flex', margin: '5px 0' }}>
          <span style={{ width: LABEL_WIDTH, flex: 'none', paddingTop: 2 }}>첨부파일 :</span>
          <div style={{ flex: 1, height: 180 }}>
            <SingleGrid<DcrMailFile>
              rowData={files}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fileId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
