/**
 * 댓글 첨부파일 창 (V04) — 댓글 창 그리드의 "파일(n)" 칸이 연다.
 * AS-IS: myApp/client/vi/apr/Apr42_Lookup_FileList.java (255줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-128: 650×350 모달 "첨부파일"(닫기 X 없음), 위 [파일업로드](내가 쓴 댓글일 때만 보임 — open L63-74) + 그리드(첨부파일 440 · 보기 50 · 받기 50 · 삭제 50) + [닫기](callback 뒤 hide)
 * 올리기·보기·받기·삭제는 첨부 목록(Ics35_Grid_FileList)과 같은 파일 API를 쓴다 — 두 번째 사용이라 복사했다(세 번째면 부품 후보).
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { AprComment } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<FileInfo>();

interface Props {
  /** AS-IS open(commentModel, callback) — 값이 있으면 열린다 */
  comment: AprComment | null;
  /** [닫기] — AS-IS callback.execute() 뒤 hide() */
  onClose: () => void;
}

export const Apr42_Lookup_FileList: React.FC<Props> = ({ comment, onClose }) => {
  const user = useLoginUser();
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);
  const mine = comment != null && comment.personId === user?.userId;

  // retrieve() L210-219: 서비스 sys.Sys10_File.selectByParentId(commentId)
  const retrieve = useCallback(async () => {
    if (comment == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentId(comment.commentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [comment]);
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] fileUpload.Change (L91) → FileUpload?parentId={commentId}, [E2] fileUploadForm.SubmitComplete (L101) → retrieve()
  const onFilesChange = async (files: File[]) => {
    if (comment == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(comment.commentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L221-246: 1 연결만 지움 → retrieve(), 2 안내 문구, 3 FileDelete?fileId= → [E4] fileDeleteForm.SubmitComplete (L139) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const { status, message: text } = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        Modal.info({ title: '확인', content: text ?? '해당 파일은 삭제할 수 없습니다', okText: '확인' });
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildFileGrid() L154-208
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 440, '첨부파일'),  // L202
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L203 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L204 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L205 deleteCell → 작성자 확인 L170 → [E6] msgBox "해당 파일을 삭제하시겠습니까?" [YES] (L173) → checkFileDelete()
      if (!mine) {
        message.warning('작성자만 파일을 삭제할 수 있습니다');
        return;
      }
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 350,
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [mine, retrieve]);

  return (
    <>
      <LookupModal
        open={comment != null}
        title="첨부파일"
        width={700}
        style={{ top: 20 }}
        maskClosable={false}
        closable={false}
        onCancel={onClose}
        destroyOnClose
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] closeButton[닫기].Select (L145) → callback(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            {/* [E3] uploadFileButton[파일업로드].Select (L131) → fileUpload.click() — 내가 쓴 댓글일 때만 보인다 (L66-70) */}
            {mine && <Button type="upload" onClick={() => fileUpload.current?.click()}>파일업로드</Button>}
          </div>
          <div style={{ height: 200 }}>
            <SingleGrid<FileInfo>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fileId)}
              rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            />
          </div>
        </div>
      </LookupModal>
      <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={onFilesChange} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
};
