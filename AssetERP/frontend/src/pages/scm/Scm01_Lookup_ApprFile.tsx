/**
 * 개발 첨부파일 조회창 (EE16) — Scm10_Grid_Dev의 첨부파일 [보기] 아이콘이 연다
 * AS-IS: myApp/client/vi/scm/Scm01_Lookup_ApprFile.java (234줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(devId) L58-61: 모달 500×400 "첨부파일", 위 [파일업로드] / 그리드(체크 단일: 첨부파일 270 · 보기 50 · 받기 50 · 삭제 50) / [닫기]
 * retrieve() L147-156: sys.Sys10_File.selectByDevId(devId) — 개발에 올린 파일 + 진행단계에 올린 파일
 * [E1]·[E7] fileUpload.Change → FileUpload?parentId=devId → [E2] SubmitComplete → retrieve() / [E4] [파일업로드] → fileUpload.click()
 * [E6] messageBox("삭제", "선택한 파일을 삭제하시겠습니까?") YES → FileDelete?fileId= → [E3] SubmitComplete → retrieve()
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi } from '@/api/file';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';
import { MODAL_HEADER_STYLE } from './scmGridCells';

const gb = gbFor<FileInfo>();
/** setChecked(SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  devId: number | null;
  onClose: () => void;
}

export const Scm01_Lookup_ApprFile: React.FC<Props> = ({ open, devId, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  const retrieve = useCallback(async () => {
    if (devId == null) return;
    try {
      setRows(await scmApi.searchDevFiles(devId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [devId]);

  // [E0] 화면 열림 (생성자 L63-129) → settings(), show() + open(devId): retrieve()
  useEffect(() => { if (open) void retrieve(); else setRows([]); }, [open, retrieve]);

  const upload = async (file: File | undefined) => {
    if (!file || devId == null) return;
    try {
      await fileApi.upload(devId, file);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  const deleteFile = (row: FileInfo) => {
    Modal.confirm({
      title: '삭제', content: '선택한 파일을 삭제하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await fileApi.deleteFile(row.fileId);
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildApprFileGrid() L158-208
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 270, '첨부파일'),
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', deleteFile),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <>
      <LookupModal
        open={open}
        title="첨부파일"
        width={620}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        focusFirst={false}
        styles={{ header: MODAL_HEADER_STYLE }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] closeButton[닫기].Select (L139) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 290, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            {/* [E4] updateButton[파일업로드].Select (L132) → fileUpload.click() */}
            <Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<FileInfo> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} rowSelection={SINGLE_CHECK} />
          </div>
        </div>
        <FileUpdownForm ref={fileForm} onChange={upload} />
      </LookupModal>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
};
