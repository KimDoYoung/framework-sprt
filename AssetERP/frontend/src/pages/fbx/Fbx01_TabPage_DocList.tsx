/**
 * 파일등록의 파일 목록 (F11) — Fbx01_Tab_Document 가운데 오른쪽
 * AS-IS: myApp/client/vi/fbx/Fbx01_TabPage_DocList.java (254줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-119: 파일 그리드(체크박스 단일) + 아래 가운데 [파일업로드] 버튼줄(높이 60, 흰 바탕)
 * 미리보기는 파일 공통 Sys10_Lookup_FileViewer (다른 도메인 부품, 이미 변환됨)
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { fbxApi } from '@/api/fbx';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { FbxFile } from '@/types/fbx';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FbxFile>();

export interface Fbx01_TabPage_DocListHandle {
  /** AS-IS retrieve(dcrClassId, boxId) + setDcrTypeCode(dcrTypeCode) — 트리에서 문서분류를 고르면 부른다 */
  retrieve: (dcrClassId: number, boxId: number, dcrTypeCode: string) => void;
}

export const Fbx01_TabPage_DocList = forwardRef<Fbx01_TabPage_DocListHandle>((_props, ref) => {
  const user = useLoginUser();
  // [E0] 화면 열림 (생성자 L55-119) → 초기화: 숨은 다운로드·삭제·업로드 폼과 [파일업로드] 버튼줄(높이 60, 가운데) — 아래 FileUpdownForm·버튼줄. 자동 조회는 없다
  const [rows, setRows] = useState<FbxFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileForm = useRef<FileUpdownFormHandle>(null);
  // AS-IS 필드 dcrClassId·boxId·dcrTypeCode — 마지막으로 조회한 값을 기억한다
  const target = useRef<{ dcrClassId: number | null; boxId: number | null; dcrTypeCode: string | null }>({ dcrClassId: null, boxId: null, dcrTypeCode: null });
  const seq = useRef(0);

  // retrieve() L204-221: fbx.Fbx03_File.selectByOrgAuth(dcrClassId, boxId, orgId, empId, companyId) — 조직·사원·회사는 서버가 세션에서
  const retrieve = async (dcrClassId: number | null = target.current.dcrClassId, boxId: number | null = target.current.boxId) => {
    target.current.dcrClassId = dcrClassId;
    target.current.boxId = boxId;
    if (dcrClassId == null || boxId == null) return;
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await fbxApi.searchFiles(boxId, dcrClassId);
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    retrieve: (dcrClassId, boxId, dcrTypeCode) => {
      target.current.dcrTypeCode = dcrTypeCode;
      void retrieve(dcrClassId, boxId);
    },
  }));

  // [E2] uploadFileButton[파일업로드].Select (L70-79)
  const uploadFile = () => {
    const { dcrClassId, boxId, dcrTypeCode } = target.current;
    if (dcrClassId == null || boxId == null || dcrTypeCode === 'C') {
      message.warning('좌측 문서분류를 재선택해주세요 (최하위 문서분류만 가능)');
    } else {
      fileForm.current?.click();
    }
  };

  // [E3] fileUpload.Change (L81-94) → FileUpload?mode=filebox&boxId&classId&orgCodeId&empId → [E4] fileUploadForm.SubmitComplete (L99) → resetFileUpload(), retrieve()
  const onFiles = async (files: File[]) => {
    const { dcrClassId, boxId } = target.current;
    if (files.length === 0 || dcrClassId == null || boxId == null) return;
    try {
      await fbxApi.uploadFiles(boxId, dcrClassId, files);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await retrieve();
  };

  // viewCell("View") L135-157: sys.Sys10_File.selectByParentId(parentId = 파일 ID) → 첫 행으로 Sys10_Lookup_FileViewer.open
  const viewRow = async (row: FbxFile) => {
    try {
      const list = await fileApi.searchByParentId(row.fileId);
      if (list.length > 0) setViewFile(list[0]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // downloadCell("Down") L122-134: FileDownload?fileType=fbxFile&fileId&boxId&empId&orgId (서버가 기록 04를 남김)
  const downRow = async (row: FbxFile) => {
    try {
      await fbxApi.downloadFile(row.boxId, row.fileId);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E6] fileUpload.Change (L230-244) = resetFileUpload()가 새로 만든 파일 선택의 Change — [E3]과 같은 처리(onFiles)
  // deleteCell("Delete") L159-187: 등록자만 → 확인창 '삭제' → [E5] messageBox.DialogHide [YES] (L169-184) FileDelete?mode=filebox → [E1] fileDeleteForm.SubmitComplete (L64) → retrieve()
  const deleteRow = (row: FbxFile) => {
    if (row.empId !== user.userId) {
      message.warning('등록자만 파일삭제가 가능합니다');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '선택한 첨부파일을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 320,
      onOk: async () => {
        try {
          await fbxApi.deleteFile(row.boxId, row.fileId);
        } catch (err) {
          message.error(errorMessage(err, '파일 삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L121-202 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('crtDate', 100, '등록일'),  // L193
    gb.text('dcrClassName', 500, '문서분류'),  // L194
    gb.text('fileName', 300, '파일명'),  // L195
    gb.textCenter('empName', 100, '등록자'),  // L196
    iconCell<FbxFile>('view', 'actionCell01', 80, '미리보기', row => void viewRow(row)),  // L197
    iconCell<FbxFile>('down', 'actionCell02', 80, '파일받기', row => void downRow(row)),  // L198
    iconCell<FbxFile>('delete', 'actionCell03', 80, '파일삭제', row => deleteRow(row)),  // L199
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user.userId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FbxFile>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          loading={loading}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      {/* getButtonBar() 높이 60, 가운데 정렬 */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #f0f0f0' }}>
        <Button type="upload" onClick={uploadFile}>파일업로드</Button>
      </div>
      <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={files => void onFiles(files)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
});
Fbx01_TabPage_DocList.displayName = 'Fbx01_TabPage_DocList';
