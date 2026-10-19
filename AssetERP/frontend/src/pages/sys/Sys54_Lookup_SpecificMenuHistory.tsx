/**
 * 요청이력 조회창 (A15-4) — Sys50_TabPage_SpecificMenu의 [요청이력]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys54_Lookup_SpecificMenuHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(companyId) L73-77 / 생성자 L79-105: 제목 "요청이력", 960×500, 모달, 크기 고정. 툴바 조회·저장·등록·삭제 + 체크(단일) 셀 편집 그리드
 * 파일 첨부(등록·받기·재등록 삭제, E6·E7·E9)는 파일 공통(B10) `fileApi`·`FileUpdownForm`으로 한다
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import dayjs from 'dayjs';
import { sysApi } from '@/api/sys';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { SpecificMenuHistory } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys54_Edit_Note } from './Sys54_Edit_Note';

type Row = SpecificMenuHistory;
const gb = gbFor<Row>();

interface Props {
  /** open(companyId) — 값이 있으면 열린다 */
  companyId?: number;
  onClose: () => void;
}

export const Sys54_Lookup_SpecificMenuHistory: React.FC<Props> = ({ companyId, onClose }) => {
  const open = !!companyId;
  const [noteRow, setNoteRow] = useState<Row>();
  const fileUpdownForm = useRef<FileUpdownFormHandle>(null);
  // fileParentId: 파일을 올릴 이력 ID (fileUploadChk·deleteFile이 정하고 [E7]이 쓴다)
  const fileParentId = useRef<number | undefined>(undefined);

  const crud = useGridCrud<Row>({
    idField: 'specificMenuHistoryId',
    // retrieve() L222-233: companyId → sys.Sys54_SpecificMenuHistory.selectByCompanyId
    search: useCallback(() => (open ? sysApi.searchSpecificMenuHistories(companyId!) : Promise.resolve([])), [open, companyId]),
    // update() L248-251: GridUpdate → sys.Sys54_SpecificMenuHistory.update
    save: useCallback((rows: Row[]) => sysApi.updateSpecificMenuHistories(companyId!, rows), [companyId]),
    remove: useCallback((ids: number[]) => sysApi.deleteSpecificMenuHistories(companyId!, ids), [companyId]),
    newRow: useCallback(() => ({ companyId }), [companyId]),
    firstEditField: 'regDate',
    // delete() L253-274 → [E8] msgBox.DialogHide [YES] (L256) → sys.Sys54_SpecificMenuHistory.delete (useGridCrud 안)
    deleteConfirm: '해당 내용을 삭제하시겠습니까?',
  });

  const retrieve = crud.retrieve;

  // 저장하지 않은 변경이 있으면 막는다 (actionCell01·03 L170-176, L193-199)
  const requireSaved = () => {
    if (crud.hasChanges()) {
      message.warning('작업중인 내용을 저장 후 이용해주세요');
      return false;
    }
    return true;
  };

  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '요청일', { editor: 'date' }),  // L206
    gb.date('confirmDate', 100, '처리일', { editor: 'date' }),  // L207
    gb.text('confirmNm', 150, '처리(확인)자', { editor: 'text' }),  // L208
    gb.text('fileNm', 300, '파일명'),  // L209
    // actionCell01 ImageCell("Upload") L168-179: 저장 후 이용 → fileUploadChk() L297-324
    iconCell<Row>('upload', 'actionCell01', 30, '등록', row => {
      if (requireSaved()) fileUploadChk(row);
    }),
    // actionCell02 ImageCell("Down") L180-186 → 파일명이 있으면 fileDownload() L276-295
    iconCell<Row>('down', 'actionCell02', 30, '받기', row => {
      if (row.fileNm) fileDownload(row);
    }),
    gb.textCenter('noteYnStr', 100, '참고내용'),  // L213
    // actionCell03 ImageCell("Edit") L187-203: 저장 후 이용 → 참고내용 팝업 Sys54_Edit_Note
    iconCell<Row>('edit', 'actionCell03', 30, '등록', row => {
      if (requireSaved()) setNoteRow(row);
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [crud.hasChanges, companyId]);

  // [E0] 화면 열림 (생성자 L79-105 → settings()) / open() L73-77: this.retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); else crud.clear(); }, [open, companyId]);

  // fileDownload() L276-295: sys.Sys10_File.selectByParentId → 1건일 때만 FileDownload?fileType=file&fileId=
  const fileDownload = async (row: Row) => {
    try {
      const files = await fileApi.searchByParentId(row.specificMenuHistoryId);
      if (files.length === 1) await fileApi.download(files[0].fileId);
    } catch (err) {
      message.error(errorMessage(err, '파일 받기 실패'));
    }
  };

  // fileUploadChk() L297-324: 파일이 없으면 바로 파일 선택, 있으면 재등록 확인
  const fileUploadChk = (row: Row) => {
    if (row.fileNm == null) {
      fileParentId.current = row.specificMenuHistoryId;
      fileUpdownForm.current?.click();
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '등록된 파일이 존재합니다. 재등록하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 420,
      // [E9] msgBox.DialogHide [YES] (L307) → deleteFile()
      onOk: () => deleteFile(row),
    });
  };

  // deleteFile() L326-338: sys.Sys54_SpecificMenuHistory.deleteFile(parentId) → 파일 선택
  //   [E6] fileDeleteForm.SubmitComplete (L139) → retrieve(): 원본은 이 폼을 submit하는 곳이 없다(삭제는 서비스) — 지운 뒤 다시 조회는 [E7] 업로드 뒤 retrieve()로 된다
  const deleteFile = async (row: Row) => {
    try {
      await sysApi.deleteSpecificMenuHistoryFile(companyId!, row.specificMenuHistoryId);
    } catch (err) {
      message.error(errorMessage(err, '파일 삭제 실패'));
      return;
    }
    fileParentId.current = row.specificMenuHistoryId;
    fileUpdownForm.current?.click();
  };

  // [E7] fileUpdownForm.Change (L146): 파일 이름이 없거나 fileParentId가 없으면 그만 → FileUpload?fileType=file&parentId= → retrieve()
  //   원본은 업로드 결과 문구를 보이지 않는다. TOBE는 거부(형식 검사 등) 때만 오류를 띄운다
  const onFileChange = async (file: File | undefined) => {
    if (!file || fileParentId.current == null) return;
    try {
      await fileApi.upload(fileParentId.current, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 등록 실패'));
    }
    retrieve();
  };

  // [E3] insertButton[등록].Select (L120) → insert() L235-246: companyId + 요청일 = 오늘(addChange → 변경 행)
  const insert = () => crud.addRows([{ regDate: dayjs().format('YYYY-MM-DD') }], true);

  return (
    <>
      <LookupModal
        open={open}
        title="요청이력"
        width={960}
        maskClosable={false}
        closable={false}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] closeButton[닫기].Select (L132) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            {/* [E1] retrieveButton[조회].Select (L108) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {/* [E2] updateButton[저장].Select (L114) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="register" onClick={insert}>등록</Button>
            {/* [E4] deleteButton[삭제].Select (L126) → delete() */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            {/* 툴바의 fileDeleteForm·fileDownloadForm(보이지 않음) — 받기는 fileApi.download, 올리기는 FileUpdownForm */}
            <FileUpdownForm ref={fileUpdownForm} onChange={onFileChange} />
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* setChecked(SINGLE): 체크박스 단일 선택 */}
            <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
          </div>
        </div>
      </LookupModal>
      {/* 참고내용 [Edit]: lookup.open(selectModel, callback → retrieve()) */}
      {companyId && <Sys54_Edit_Note companyId={companyId} history={noteRow} onClose={() => setNoteRow(undefined)} onSaved={retrieve} />}
    </>
  );
};
