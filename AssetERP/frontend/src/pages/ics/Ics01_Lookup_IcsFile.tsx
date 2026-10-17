/**
 * 법규 서식파일 창 (E01) — Ics01_Grid_IcsType 그리드의 서식파일 [추가] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_IcsFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L88-158: 모달 900×400 "서식파일", 그리드(서식파일 580·등록일 100·다운로드 80·삭제 80, 체크박스 단일), 아래 가운데 [불러오기][닫기].
 * 파일 올리기 입력은 원본에서 보이지 않는 폼(setVisible(false))에 있어 화면에서 실행되지 않는다 — 같은 모양으로 숨은 입력만 둔다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { IcsFormFile, IcsLaw, IcsRelateFile } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Ics01_Lookup_IcsFileAdmin } from './Ics01_Lookup_IcsFileAdmin';

const gb = gbFor<IcsRelateFile>();

interface Props {
  /** open(classTreeModel, callback) L80-86 — 값이 있으면 열린다 */
  law: IcsLaw | null;
  /** confirm() L229-234: callback.execute() — 부른 쪽이 그 법규 행을 다시 읽는다 */
  onClosed: () => void;
  /** 창의 닫기(X) */
  onClose: () => void;
}

export const Ics01_Lookup_IcsFile: React.FC<Props> = ({ law, onClosed, onClose }) => {
  const [rows, setRows] = useState<IcsRelateFile[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const parentId = law?.classTreeId ?? null;
  const uploadRef = useRef<FileUpdownFormHandle>(null);

  // retrieve() L192-203: 서비스 sys.Sys11_RelateFile.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) return;
    try {
      setRows(await icsApi.searchLawFiles(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  // [E0] 화면 열림 → setting() L88-158: ... retrieve()
  useEffect(() => { setRows([]); void retrieve(); }, [retrieve]);

  // buildApprFileGrid() L160-190
  const columnDefs = useMemo(() => [
    gb.text('fileName', 580, '서식파일'),  // L184
    gb.date('regDate', 100, '등록일'),  // L185
    // L186 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<IcsRelateFile>('down', 'actionCellDown', 80, '다운로드', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // L187 deleteCell: GridDeleteData sys.Sys11_RelateFile.delete(고른 행) — 확인 창 없이 연결을 지운다
    iconCell<IcsRelateFile>('delete', 'actionCellDelete', 80, '삭제', async row => {
      if (parentId == null) return;
      try {
        await icsApi.deleteLawFiles(parentId, [row.relateFileId]);
        setRows(prev => prev.filter(r => r.relateFileId !== row.relateFileId));
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    }),
  ], [parentId]);

  // [E2] listButton[불러오기].Select (L100) → listLookup() L205-227: Ics01_Lookup_IcsFileAdmin → sys.Sys11_RelateFile.insert(relateId, tableName ics01_class_tree) → retrieve()
  const listLookup = async (selected: IcsFormFile[]) => {
    if (parentId == null) return;
    try {
      await icsApi.addLawFiles(parentId, selected.map(f => f.fileId));
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '불러오기 실패'));
    }
  };

  // [E3] fileUpload.Change (L115) → FileUpload?parentId&fileYn=true&adminYn=true [E4] fileUploadForm.SubmitComplete (L125) → resetFileUpload(), retrieve()
  // [E6] fileUpload.Change (L243): resetFileUpload() 뒤 다시 건 같은 핸들러 (다중 선택 입력)
  const uploadFiles = async (files: File[]) => {
    if (parentId == null) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file, { fileYn: true });
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await retrieve();
  };

  // [E5 생략] fileDeleteForm.SubmitComplete (L146) → retrieve(): fileDeleteForm은 어디서도 submit하지 않는다(삭제는 서식파일 행의 삭제 아이콘이 GridDeleteData로 한다)

  // [E1] okButton[닫기].Select (L94) → confirm() L229-234: callback.execute(); hide()
  const confirm = () => { onClosed(); onClose(); };

  return (
    <Modal
      open={!!law}
      title="서식파일"
      width={940}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="register" onClick={() => setListOpen(true)}>불러오기</Button>
            <Button type="close" onClick={confirm}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 260 }}>
        <SingleGrid<IcsRelateFile>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.relateFileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <FileUpdownForm ref={uploadRef} onChange={file => { if (file) void uploadFiles([file]); }} onChangeFiles={uploadFiles} />
      <Ics01_Lookup_IcsFileAdmin open={listOpen} onSelect={listLookup} onClose={() => setListOpen(false)} />
    </Modal>
  );
};
