/**
 * 월간회의자료 파일목록 조회창 (Z10) — Rpt02_Tab_MonthWrite의 업로드 아이콘(" " 열)에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt02_Lookup_FileList.java (248줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L57-116: 모달 "파일목록" 700×300, 툴바 [파일업로드] + 그리드(buildApprFileGrid L133-163: 체크박스 단일 선택, 첨부파일 520 · 받기 50 · 삭제 50), 아래 가운데 [닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
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

const gb = gbFor<FileInfo>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** 월간회의자료 ID */
  parentId: number | null | undefined;
  /** [닫기] (AS-IS confirm() → callback.execute() 뒤 hide()) — 부르는 쪽이 첨부파일 건수를 다시 센다 */
  onClose: () => void;
}

export const Rpt02_Lookup_FileList: React.FC<Props> = ({ open, parentId, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);

  // retrieve() L165-183: 서비스 sys.Sys10_File.selectByFileYn(parentId) → 대표(titleYn=true) 파일은 목록에서 뺀다
  const retrieve = useCallback(async () => {
    if (!open || parentId == null) return;
    try {
      setRows((await fileApi.searchByFileYn(parentId)).filter(r => r.titleYn !== 'true'));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [open, parentId]);

  // 열림 (open L57-116) → settings(), show(), retrieve(parentId)
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E4] updateButton[파일업로드].Select (L119) → fileUpload.click()
  // [E1]·[E6] fileUpload.Change (L72·L235) → FileUpload?parentId=&fileYn=true (여러 파일) → [E2] fileUploadForm.SubmitComplete (L81) → resetFileUpload(), retrieve()
  const onFiles = async (files: File[]) => {
    if (parentId == null) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file, { fileYn: true });
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L185-210: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → [E3] fileDeleteForm.SubmitComplete (L93) → retrieve()
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
    gb.text('fileNm', 520, '첨부파일'),  // L158 addTextNotSort
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L159 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L160 deleteCell L146-156 (확인 창 없음)
      if (row.fileYn === 'true') void checkFileDelete(row);
      else message.warning('해당 파일은 삭제할 수 없습니다');
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <LookupModal
      open={open}
      title="파일목록"
      width={810}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] okButton[닫기].Select (L125) → confirm() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 260 }}>
        <div><Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button></div>
        <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={onFiles} />
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FileInfo>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fileId)}
            rowSelection={SINGLE_SELECTION}
          />
        </div>
      </div>
    </LookupModal>
  );
};
