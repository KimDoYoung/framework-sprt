/**
 * 댓글 첨부파일 조회창 (H01) — Bbs07_TapPage_Comment의 "파일(n)" 칸에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs07_Lookup_FileList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-128: 모달 "첨부파일" 650×350, 툴바 [파일업로드] + 그리드(buildFileGrid L154-208: 첨부파일 440 · 보기 50 · 받기 50 · 삭제 50), 아래 가운데 [닫기]
 * open() L63-74: 댓글 작성자 본인에게만 [파일업로드]가 보인다. 파일의 parentId는 댓글 ID.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { BbsComment } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** 있으면 열린다 (AS-IS open(commentModel, callback)) */
  comment: BbsComment | null;
  /** [닫기] (E5 callback.execute() 뒤 hide()) — 부르는 쪽이 댓글 목록을 다시 읽어 "파일(n)"을 갱신한다 */
  onClose: () => void;
}

export const Bbs07_Lookup_FileList: React.FC<Props> = ({ comment, onClose }) => {
  const user = useLoginUser();
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const isWriter = comment != null && comment.personId === user?.userId;

  // retrieve() L210-219: 서비스 sys.Sys10_File.selectByParentId(commentId)
  const retrieve = useCallback(async () => {
    if (!comment) return;
    try {
      setRows(await fileApi.searchByParentId(comment.commentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [comment]);

  // [E0] 열림 (open L63-74) → retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] fileUpload.Change (L91) → FileUpload?parentId=commentId → [E2] fileUploadForm.SubmitComplete (L101) → retrieve()
  const onFiles = async (files: File[]) => {
    if (!comment) return;
    try {
      for (const file of files) await fileApi.upload(comment.commentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L221-246: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 서버 메시지 / 지워도 됨(3) → FileDelete → [E4] fileDeleteForm.SubmitComplete (L139) → retrieve()
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

  // deleteCell L168-190: 작성자가 아니면 "작성자만 파일을 삭제할 수 있습니다", 맞으면 확인 "해당 파일을 삭제하시겠습니까?" → [E6] msgBox.DialogHide [YES] (L173) → checkFileDelete()
  const deleteCell = (row: FileInfo) => {
    if (!isWriter) {
      message.warning('작성자만 파일을 삭제할 수 있습니다');
      return;
    }
    Modal.confirm({ title: '확인', content: '해당 파일을 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 300, onOk: () => checkFileDelete(row) });
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 440, '첨부파일'),  // L194
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', deleteCell),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [isWriter, retrieve]);

  return (
    <LookupModal
      open={comment != null}
      title="첨부파일"
      width={650}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] closeButton[닫기].Select (L145) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 230 }}>
        {/* [E3] uploadFileButton[파일업로드].Select (L131) → fileUpload.click() — 작성자 본인에게만 보인다 */}
        {isWriter && <div><Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button></div>}
        <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={onFiles} />
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FileInfo>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fileId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </LookupModal>
  );
};
