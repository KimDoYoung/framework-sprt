/**
 * 첨부파일 추가/삭제 창 (V05) — 반려(40) 문서의 [첨부파일 추가/삭제]가 연다. 왼쪽에서 파일을 더하고 사유를 남기고 지우며, 오른쪽에 삭제된 내역이 보인다.
 * AS-IS: myApp/client/vi/sys/Sys61_Lookup_FileList.java (317줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L88-160: 1220×450 모달 "첨부파일 추가/삭제", 왼쪽 450(등록된 첨부파일 + [추가][삭제][옵션설정] + 단일 체크 그리드 첨부파일 270·보기 50·받기 50) | 오른쪽 삭제 내역(Sys61_TabPage_DelList), 푸터 [닫기]
 * [E0] 화면 열림 (생성자 L88-160) → settings(), show() · [E1] tabPage (Sys61_TabPage_DelList).callbackOnCreate (L62) → retrieve()
 * 지운 파일은 실제로 지우지 않고 삭제 내역으로 옮긴다(파일의 부모를 삭제 내역 ID로).
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { AprEditFile } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Lookup_ApprFileList } from '@/pages/apr/Apr01_Lookup_ApprFileList';
import { Sys10_Lookup_FileViewer } from './Sys10_Lookup_FileViewer';
import { Sys61_TabPage_DelList } from './Sys61_TabPage_DelList';

const gb = gbFor<AprEditFile>();

interface Props {
  /** open(parentId, callback) — 값이 있으면 열린다 */
  parentId: number | null;
  /** [닫기]·창을 닫을 때 (AS-IS callback.execute()) — 부른 쪽이 첨부 목록을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

export const Sys61_Lookup_FileList: React.FC<Props> = ({ parentId, onClosed, onClose }) => {
  const [rows, setRows] = useState<AprEditFile[]>([]);
  const [selected, setSelected] = useState<AprEditFile | undefined>(undefined);
  const [viewFile, setViewFile] = useState<AprEditFile | null>(null);
  const [nonce, setNonce] = useState(0);
  const [askReason, setAskReason] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const upload = useRef<FileUpdownFormHandle>(null);

  // retrieve() L264-273: sys.Sys10_File.selectByParentId(parentId) → 삭제 내역 탭도 다시 읽는다
  const retrieve = useCallback(async () => {
    if (parentId == null) { setRows([]); return; }
    try {
      setRows(await aprAttachApi.getEditFiles(parentId));
      setNonce(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);
  useEffect(() => {
    if (parentId == null) { setRows([]); setSelected(undefined); return; }
    void retrieve();
  }, [parentId, retrieve]);

  // [E2] fileUpload.Change (L108) → FileUpload?parentId={parentId}, [E3] fileUploadForm.SubmitComplete (L117) → retrieve()
  const onFilesChange = async (files: File[]) => {
    if (parentId == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // [E5] deleteButton[삭제].Select (L169) → deleteChk01() L209-227 (원본 문구 그대로 "헤당") → [E8] [YES] (L212) → deleteChk02() L229-242 AreaMessage "삭제사유" → deleteRow(reason) L244-262
  const deleteChk01 = () => {
    if (!selected) return;
    Modal.confirm({ title: '삭제', content: '헤당 파일을 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 350, onOk: () => setAskReason(true) });
  };
  const deleteRow = async (reason: string | null) => {
    setAskReason(false);
    if (reason == null) {
      Modal.info({ title: '확인', content: '삭제가 취소되었습니다 (사유 미입력)', okText: '확인' });
      return;
    }
    if (parentId == null || !selected) return;
    try {
      await aprAttachApi.deleteFiles(parentId, [selected.fileId], reason);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L275-304 (단일 체크)
  const columnDefs = useMemo(() => [
    gb.text('fileName', 270, '첨부파일'),  // L296
    iconCell<AprEditFile>('view', 'viewCell', 50, '보기', setViewFile),  // L297
    iconCell<AprEditFile>('down', 'downloadCell', 50, '받기', row => {  // L298
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  // [E7] closeButton[닫기].Select (L200) → callback(), hide() (setHideCallback L92도 callback.execute())
  const close = () => { onClosed(); onClose(); };

  return (
    <>
      <LookupModal
        open={parentId != null}
        title="첨부파일 추가/삭제"
        width={1280}
        style={{ top: 20, maxWidth: 'calc(100vw - 40px)' }}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={close}>닫기</Button></div>}
      >
        <div style={{ display: 'flex', gap: 10, height: 'min(300px, calc(100vh - 250px))' }}>
          <div style={{ width: 450, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 'bold', marginRight: 4 }}>등록된 첨부파일</span>
              {/* [E4] insertButton[추가].Select (L163) → fileUpload.click() */}
              <Button type="addRow" onClick={() => upload.current?.click()}>추가</Button>
              <Button type="removeRow" onClick={deleteChk01}>삭제</Button>
              {/* [E6] optionsButton[옵션설정].Select (L175) → apr.Apr01_Appr.selectById(parentId) → Apr01_Lookup_ApprFileList.open */}
              <Button type="register" onClick={() => setOptionsOpen(true)}>옵션설정</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<AprEditFile>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.fileId)}
                rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                onSelect={setSelected}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Sys61_TabPage_DelList parentId={parentId} nonce={nonce} />
          </div>
        </div>
      </LookupModal>
      <FileUpdownForm ref={upload} onChange={() => undefined} onChangeFiles={onFilesChange} />
      <Sys10_Lookup_FileViewer file={viewFile ? { fileId: viewFile.fileId, parentId: viewFile.parentId, fileNm: viewFile.fileName } : null} onClose={() => setViewFile(null)} />
      <AreaMessage open={askReason} title="삭제사유" required onResult={t => void deleteRow(t)} onClose={() => setAskReason(false)} />
      <Apr01_Lookup_ApprFileList apprId={optionsOpen ? parentId : null} onClosed={() => void retrieve()} onClose={() => setOptionsOpen(false)} />
    </>
  );
};
