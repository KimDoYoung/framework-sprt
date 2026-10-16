/**
 * 연관파일 탭 (C01-7) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp18_TabPage_RelateFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * CellEditGrid(체크박스 단일): 등록일·파일명·용량(KB)·상세설명(편집)·업로드·다운로드. 파일은 파일 공통(B10) `fileApi`·`FileUpdownForm`
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Typography } from 'antd';
import { empApi } from '@/api/emp';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { RelateFile } from '@/types/emp';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

type Row = RelateFile;
const gb = gbFor<Row>();

export const Emp18_TabPage_RelateFile: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const fileUpdownForm = useRef<FileUpdownFormHandle>(null);
  // 파일을 올릴 연관파일 ID (업로드 아이콘을 누른 행 — 원본 grid.getSelectionModel().getSelectedItem().getRelateFileId())
  const fileParentId = useRef<number | undefined>(undefined);
  // 삭제 확인 뒤 remove()가 쓰는 체크 행 (원본 grid.getSelectionModel().getSelectedItem())
  const checkedRows = useRef<() => Row[]>(() => []);
  const [saveAfterInsert, setSaveAfterInsert] = useState(false);

  // [E1] searchBarBuilder[조회].Retrieve (L65) → retrieve() L155-160: emp.Emp18_RelateFile.selectByPersonId(personId)
  const search = useCallback(async () => {
    if (!personId) return [];
    return empApi.getRelateFiles(personId);
  }, [personId]);

  // [E4] searchBarBuilder[저장].Update (L68) → update() L185-198: GridUpdate → emp.Emp18_RelateFile.update
  const save = useCallback((changed: Row[]) => empApi.updateRelateFiles(changed), []);

  // [E8] messageBox.DialogHide [YES] (L204): 고른 행에 파일이 있으면 checkFileDelete() L242-267, 그리고 체크 행을 emp.Emp18_RelateFile.delete
  //   원본은 두 호출을 동시에 비동기로 부른다 — TOBE는 파일 판정 → 행 삭제 순서(결과 같음)
  const remove = useCallback(async (ids: number[]) => {
    const selectModel = checkedRows.current()[0];
    if (selectModel?.fileId != null) await checkFileDelete(selectModel);
    return empApi.deleteRelateFiles(ids);
  }, []);

  // [E2] 새 행: personId (insertRow L171-172)
  const newRow = useCallback((): Partial<Row> => ({ personId }), [personId]);

  const crud = useGridCrud<Row>({
    idField: 'relateFileId',
    search,
    save,
    remove,
    newRow,
    // deleteRow() L201-223: HtmlMessageBox("삭제", …)
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });
  checkedRows.current = () => crud.gridRef.current?.api?.getSelectedRows() ?? [];

  const { retrieve } = crud;

  // checkFileDelete() L242-267: sys.Sys11_RelateFile.checkFileDelete(fileId, parentId=relateFileId)
  //   1 → retrieve() / 2 → 서버 문구 / 3 → FileDelete?fileId= ([E5] fileDeleteForm.SubmitComplete (L78) → retrieve())
  //   1·3의 retrieve()는 이어지는 행 삭제가 목록에서 행을 빼는 것으로 결과가 같다
  const checkFileDelete = async (deleteModel: Row) => {
    try {
      const status = await fileApi.checkFileDelete(deleteModel.fileId!, deleteModel.relateFileId);
      if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(deleteModel.fileId!);
      }
    } catch (err) {
      message.error(errorMessage(err, '파일 삭제 실패'));
    }
  };

  // buildGrid() L93-142
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L134
    gb.text('fileName', 350, '파일명'),  // L135
    gb.double('size', 100, '용량(KB)'),  // L136
    gb.text('note', 450, '상세설명', { editor: 'text' }),  // L137 new TextField()
    // [E7] uploadCell ImageCell("Upload") L97-114 → fileUpload.click()
    iconCell<Row>('upload', 'actionCell01', 80, '업로드', r => {
      fileParentId.current = r.relateFileId;
      fileUpdownForm.current?.click();
    }),
    // downloadCell ImageCell("Down") L115-131: 파일이 없으면 "등록된 파일이 없습니다", 있으면 FileDownload?fileType=file&fileId=
    iconCell<Row>('down', 'actionCell02', 80, '다운로드', r => {
      if (r.fileId == null) {
        message.warning('등록된 파일이 없습니다');
        return;
      }
      fileApi.download(r.fileId).catch(err => message.error(errorMessage(err, '파일 받기 실패')));
    }),
  ], []);

  // [E0] 화면 열림 (생성자 L60-91) — 사원이 바뀌면 다시 조회 (다른 탭과 같음)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  // [E7]·[E9] fileUpload.Change (L104, L232) → FileUpload?parentId=relateFileId → [E6] fileUploadForm.SubmitComplete (L84) → resetFileUpload(), retrieve()
  //   원본은 업로드 결과 문구를 보이지 않는다. TOBE는 거부(형식 검사 등) 때만 오류를 띄운다
  const onFileChange = async (file: File | undefined) => {
    if (!file || fileParentId.current == null || fileParentId.current <= 0) return;
    try {
      await fileApi.upload(fileParentId.current, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 등록 실패'));
    }
    retrieve();
  };

  // [E2] searchBarBuilder[등록].Insert (L66) → insertRow() L163-182: 사원 미선택 경고 → 새 행 + addChange(note, "내용을 입력해주세요") → update()
  const insertRow = () => {
    if (!row) {
      message.warning('사원을 먼저 선택해주세요');
      return;
    }
    crud.gridRef.current?.api?.deselectAll();
    crud.addRows([{ note: '내용을 입력해주세요' }], true);
    setSaveAfterInsert(true);
  };
  // 새 행이 목록에 들어간 다음 렌더에서 저장 (원본 GridInsertRow 콜백의 update())
  useEffect(() => {
    if (!saveAfterInsert) return;
    setSaveAfterInsert(false);
    void crud.saveRows();
  }, [saveAfterInsert, crud.saveRows]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', boxSizing: 'border-box' }}>
      <Space>
        {/* LabelToolItem(setHtmlBarStyle("연관파일")) L64 */}
        <Typography.Text strong>연관파일</Typography.Text>
        {/* [E1] */}
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E3] searchBarBuilder[삭제].Delete (L67) → deleteRow() L201-223 */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* 숨은 fileDownloadForm·fileDeleteForm·fileUploadForm (L72-77) — 받기·지우기는 fileApi, 올리기는 FileUpdownForm */}
        <FileUpdownForm ref={fileUpdownForm} onChange={onFileChange} />
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* setChecked(SelectionMode.SINGLE): 체크박스 단일 선택 */}
        <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
      </div>
    </div>
  );
};
