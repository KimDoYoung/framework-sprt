/**
 * 계약사 이력관리 파일 창 (EE20) — Biz11_TabPage_ContHistory의 [첨부파일관리]가 연다 (parentId = 고른 계약사 ID)
 * AS-IS: myApp/client/vi/biz/Biz11_Lookup_FileList.java (295줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-144: 1500×800 모달 "계약사 이력관리 파일", 왼쪽(450) [파일업로드] + 그리드(파일명 300 · 받기 50 · 삭제 50), 가운데 PDF 미리보기(Biz11_PDFViewer), [닫기]
 * 올리기·받기·삭제는 첨부 목록(Apr42_Lookup_FileList)과 같은 파일 API를 쓴다 — 세 번째 사용이라 부품 후보(작업기록 "부품 제안")
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Biz11_PDFViewer } from './Biz11_PDFViewer';

const gb = gbFor<FileInfo>();
/** 기본 단일 선택(체크박스 없음) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const ROW_SELECT = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  /** open(parentId) — 값이 있으면 열린다 (계약사 ID) */
  parentId: number | null;
  onClose: () => void;
}

export const Biz11_Lookup_FileList: React.FC<Props> = ({ parentId, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  /** 미리보기 대상 — 고른 행이 pdf면 그 파일 */
  const [selected, setSelected] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);
  const isPdf = (f: FileInfo | null) => f != null && (f.fileExt ?? '').toLowerCase() === 'pdf';

  // retrieve(parentId) L219-246: 서비스 sys.Sys10_File.selectByParentId(parentId) → 첫 행을 고르고 pdf면 미리보기, 아니면 "none", 행이 없으면 "empty"
  const retrieve = useCallback(async () => {
    if (parentId == null) { setRows([]); setSelected(null); return; }
    try {
      const list = await fileApi.searchByParentId(parentId);
      setRows(list);
      setSelected(list[0] ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);
  // [E0] 화면 열림 (생성자 L64-144) → settings(), show() · open(parentId) → retrieve(parentId)
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] uploadButton[파일업로드].Select (L73) → fileUpload.click() · [E2] fileUpload.Change (L85) → FileUpload?parentId={parentId}
  //   · [E3] fileUploadForm.SubmitComplete (L95) → resetFileUpload(), retrieve() · [E8] fileUpload.Change (L255) (resetFileUpload 뒤 새 입력칸의 같은 동작)
  const onFilesChange = async (files: File[]) => {
    if (parentId == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L265-290: 1 연결만 지움 → retrieve(), 2 안내 문구, 3 FileDelete?fileId= → [E4] fileDeleteForm.SubmitComplete (L112) → retrieve()
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

  // buildGrid() L174-217: 파일명 300 · 받기 50(downloadCell → FileDownload?fileType=file&fileId=) · 삭제 50(deleteCell → [E7] msgBox "해당 파일을 삭제하시겠습니까?" [YES] (L191) → checkFileDelete())
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 300, '파일명'),  // L212
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L213
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L214
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 450,
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <>
      <LookupModal
        open={parentId != null}
        title="계약사 이력관리 파일"
        width={1500}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] closeButton[닫기].Select (L147) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 'calc(100vh - 260px)', minHeight: 400 }}>
          <Splitter style={{ height: '100%' }}>
            <Splitter.Panel defaultSize={450} min={300}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box', paddingRight: 8 }}>
                <div>
                  <Button type="upload" onClick={() => fileUpload.current?.click()}>파일업로드</Button>
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  {/* [E6] grid.CellClick (L154) → 고른 행이 pdf면 미리보기(viewer.open(PDF)), 아니면 viewer.open("none") */}
                  <SingleGrid<FileInfo>
                    rowData={rows}
                    columnDefs={columnDefs}
                    getRowId={p => String(p.data.fileId)}
                    rowSelection={ROW_SELECT}
                    onRowClicked={e => { if (e.data) setSelected(e.data); }}
                  />
                </div>
              </div>
            </Splitter.Panel>
            <Splitter.Panel>
              <div style={{ height: '100%', boxSizing: 'border-box' }}>
                {rows.length === 0
                  ? <Biz11_PDFViewer mode="empty" />
                  : isPdf(selected) ? <Biz11_PDFViewer fileId={selected!.fileId} /> : <Biz11_PDFViewer mode="none" />}
              </div>
            </Splitter.Panel>
          </Splitter>
        </div>
      </LookupModal>
      <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={onFilesChange} />
    </>
  );
};
