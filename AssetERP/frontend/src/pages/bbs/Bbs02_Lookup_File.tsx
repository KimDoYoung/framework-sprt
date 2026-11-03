/**
 * 공지사항 첨부파일 조회창 (H01) — Bbs02_Popup_NoticeAdmin의 [첨부파일 확인(n)]에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs02_Lookup_File.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openUser() L58-64: 사용자용 — [파일업로드]를 감추고 삭제 열(4)을 감추며 첨부파일명 폭 720. 그래서 올리기·삭제(E1·E3~E6)는 이 화면에서 쓰이지 않는다.
 * open() L70-150: 모달 "첨부파일" 950×400, 그리드(buildApprFileGrid L153-190: 체크박스 단일 선택, 첨부파일명 · 다운로드 80 · 삭제 80 · 미리보기 80), 아래 가운데 [닫기]
 * `admin`(EE14, Mrb01_Popup_MeetingRoomReg): open(parentId, callback)로 여는 쪽 — [파일업로드] + 삭제 열이 있고 첨부파일명 폭 640. 올리기·삭제는 Bbs15_Lookup_File(E10)과 같다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** 공지사항 ID (EE14: 회의실 예약 ID) */
  parentId: number | null | undefined;
  /** true = open()(올리기·삭제 가능), 기본 false = openUser()(보기만) */
  admin?: boolean;
  /** [닫기] (AS-IS confirm() L206-211: callback.execute(), hide()) — admin이면 부르는 쪽이 첨부파일 건수를 다시 센다 */
  onClose: () => void;
}

export const Bbs02_Lookup_File: React.FC<Props> = ({ open, parentId, admin = false, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve() L192-204: 서비스 sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (!open || parentId == null) return;
    try {
      setRows(await fileApi.searchByParentId(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [open, parentId]);

  // [E0] 열림 (openUser L58-64 → open L70-150) → retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E3]·[E6] fileUpload.Change (L102·L220) → FileUpload?parentId= (여러 파일) → [E4] fileUploadForm.SubmitComplete (L112) → resetFileUpload(), retrieve()
  const onFiles = async (files: File[]) => {
    if (parentId == null) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L230-255: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → [E5] fileDeleteForm.SubmitComplete (L139) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', admin ? 640 : 720, '첨부파일명'),  // L184 (openUser: 폭 720)
    iconCell<FileInfo>('down', 'downloadCell', 80, '다운로드', row => {  // downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // 삭제 열 L185 — openUser()가 getColumnModel().setHidden(4, true)로 감춘다(사용자용 창에는 없다)
    ...(admin ? [iconCell<FileInfo>('delete', 'deleteCell', 80, '삭제', row => { void checkFileDelete(row); })] : []),
    iconCell<FileInfo>('view', 'viewCell', 80, '미리보기', setViewFile),  // viewCell → Sys10_Lookup_FileViewer.open(fileId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [admin, retrieve]);

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 260 }}>
        {/* [E1] updateButton[파일업로드].Select (L79) → fileUpload.click() — openUser()가 setVisible(false)라 admin일 때만 */}
        {admin && (
          <>
            <div><Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button></div>
            <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={onFiles} />
          </>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FileInfo>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fileId)}
            rowSelection={SINGLE_SELECTION}
          />
        </div>
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </LookupModal>
  );
};
