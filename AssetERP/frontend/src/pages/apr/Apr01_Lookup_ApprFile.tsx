/**
 * 파일목록 창 (V10) — 결재가 끝난 문서에 [결재완료후 첨부파일등록]으로 파일을 더 올리고, 인감날인본인지 표시한다.
 * AS-IS: myApp/client/vi/apr/Apr01_Lookup_ApprFile.java (276줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L60-137: 700×300 모달 "파일목록", 위 [저장][파일업로드] + 안내 글(파랑), 단일 체크 그리드(첨부파일 500 · 인감날인본 70 · 삭제 50), 푸터 [닫기]
 * 올린 파일은 `fileYn=true`(확정문서 여부)로 저장된다 — 이 창은 그 파일만 보여 준다(sys.Sys10_File.selectByFileYn).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { aprRelateEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { AprAfterFile } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprAfterFile>();
const TEXT = '※ 인감날인본을 사후에 첨부인 경우, 반드시 인감날인본 항목에 체크후 [저장]해주세요';

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** [닫기] — AS-IS callback.execute(apprModel): 문서창이 첨부파일 탭을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

export const Apr01_Lookup_ApprFile: React.FC<Props> = ({ apprId, onClosed, onClose }) => {
  const [rows, setRows] = useState<AprAfterFile[]>([]);
  const [changed, setChanged] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const upload = useRef<FileUpdownFormHandle>(null);

  // retrieve() L182-202: sys.Sys10_File.selectByFileYn(parentId)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      setRows(await aprRelateEditApi.getAfterFiles(apprId));
      setChanged(new Set());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);
  useEffect(() => {
    if (apprId == null) { setRows([]); setChanged(new Set()); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // [E4] updateButton[저장].Select (L140) → update() L264-267: sys.Sys10_File.update — 바뀐 줄만 (GridUpdate)
  const update = async () => {
    if (apprId == null || changed.size === 0) return;
    try {
      await aprRelateEditApi.saveAfterFiles(apprId, rows.filter(r => changed.has(r.fileId)).map(r => ({ fileId: r.fileId, stampYn: r.stampYn })));
      message.success('저장이 완료되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E7]·[E1] fileUpload.Change (L76·L227) → FileUpload?parentId={apprId}&fileYn=true (여러 파일), [E2] fileUploadForm.SubmitComplete (L85) → resetFileUpload(), retrieve()
  const onFilesChange = async (files: File[]) => {
    if (apprId == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(apprId, file, { fileYn: true });
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L237-262: 1 연결만 지움 → retrieve(), 2 안내 문구, 3 FileDelete?fileId= → [E3] fileDeleteForm.SubmitComplete (L108) → retrieve()
  const checkFileDelete = async (row: AprAfterFile) => {
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

  // buildApprFileGrid() L160-180
  const columnDefs = useMemo(() => [
    gb.text('fileName', 500, '첨부파일'),  // L174
    gb.boolean('stampYn', 70, '인감날인본', { editable: true }),  // L175
    iconCell<AprAfterFile>('delete', 'deleteCell', 50, '삭제', row => {  // L176 deleteCell → 확인 없이 checkFileDelete() (L166-170: fileYn가 true일 때)
      void checkFileDelete(row);
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  // [E6] okButton[닫기].Select (L152) → confirm() L204-207: callback.execute(apprModel), hide()
  const close = () => { onClosed(); onClose(); };

  return (
    <>
      <LookupModal
        open={apprId != null}
        title="파일목록"
        width={760}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={close}>닫기</Button></div>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="save" count={changed.size} onClick={update}>저장</Button>
            {/* [E5] uploadButton[파일업로드].Select (L146) → fileUpload.click() */}
            <Button type="upload" onClick={() => upload.current?.click()}>파일업로드</Button>
            <span style={{ fontSize: 12, color: '#4E81CE' }}>{TEXT}</span>
          </div>
          <div style={{ height: 200 }}>
            <SingleGrid<AprAfterFile>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fileId)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onCellValueChanged={e => {
                if (e.colDef.field !== 'stampYn' || !e.data) return;
                const id = e.data.fileId;
                const v = !!e.newValue;
                setRows(prev => prev.map(r => (r.fileId === id ? { ...r, stampYn: v } : r)));
                setChanged(prev => new Set(prev).add(id));
              }}
            />
          </div>
        </div>
      </LookupModal>
      <FileUpdownForm ref={upload} onChange={() => undefined} onChangeFiles={onFilesChange} />
    </>
  );
};
