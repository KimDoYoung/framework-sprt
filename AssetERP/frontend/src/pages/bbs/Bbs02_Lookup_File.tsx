/**
 * 공지사항 첨부파일 조회창 (H01) — Bbs02_Popup_NoticeAdmin의 [첨부파일 확인(n)]에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs02_Lookup_File.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openUser() L58-64: 사용자용 — [파일업로드]를 감추고 삭제 열(4)을 감추며 첨부파일명 폭 720. 그래서 올리기·삭제(E1·E3~E6)는 이 화면에서 쓰이지 않는다.
 * open() L70-150: 모달 "첨부파일" 950×400, 그리드(buildApprFileGrid L153-190: 체크박스 단일 선택, 첨부파일명 · 다운로드 80 · 삭제 80 · 미리보기 80), 아래 가운데 [닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** 공지사항 ID */
  parentId: number | null | undefined;
  /** [닫기] (AS-IS confirm() L206-211) */
  onClose: () => void;
}

export const Bbs02_Lookup_File: React.FC<Props> = ({ open, parentId, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // [E0] 열림 (openUser L58-64 → open L70-150) → retrieve() L192-204: 서비스 sys.Sys10_File.selectByParentId(parentId)
  useEffect(() => {
    if (!open || parentId == null) return;
    fileApi.searchByParentId(parentId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, parentId]);

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 720, '첨부파일명'),  // L183 (openUser: 폭 720)
    iconCell<FileInfo>('down', 'downloadCell', 80, '다운로드', row => {  // downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // [삭제 열 L185 생략] openUser()가 getColumnModel().setHidden(4, true)로 감춘다 — 사용자용 창에는 없다
    iconCell<FileInfo>('view', 'viewCell', 80, '미리보기', setViewFile),  // viewCell → Sys10_Lookup_FileViewer.open(fileId)
  ], []);

  return (
    <LookupModal
      open={open}
      title="첨부파일"
      width={950}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] okButton[닫기].Select (L87) → confirm() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E1 생략] updateButton[파일업로드] (L79) — openUser()가 setVisible(false). [E3~E6 생략] 올리기·삭제는 감춘 버튼·열에서만 일어난다 */}
      <div style={{ height: 260 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={SINGLE_SELECTION}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </LookupModal>
  );
};
