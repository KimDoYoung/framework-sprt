/**
 * 요청이력 조회창 (A15-4) — Sys50_TabPage_SpecificMenu의 [요청이력]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys54_Lookup_SpecificMenuHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(companyId) L73-77 / 생성자 L79-105: 제목 "요청이력", 960×500, 모달, 크기 고정. 툴바 조회·저장·등록·삭제 + 체크(단일) 셀 편집 그리드
 * 파일 첨부(등록·받기·재등록 삭제, E6·E7·E9, fileDeleteForm/fileDownloadForm/fileUpdownForm)는 B10(sys10_file 공통) 뒤 — 대조표 "다음 단계"
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { sysApi } from '@/api/sys';
import { SpecificMenuHistory } from '@/types/sys';
import { Button } from '@/components/button';
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
    // actionCell01 ImageCell("Upload") L168-179 → fileUploadChk() L297-324 (파일 첨부는 B10 뒤)
    iconCell<Row>('upload', 'actionCell01', 30, '등록', () => {
      if (!requireSaved()) return;
      message.info('파일 첨부는 B10(파일 공통) 변환 뒤에 됩니다');
    }),
    // actionCell02 ImageCell("Down") L180-186 → 파일명이 있으면 fileDownload() L276-295 (B10 뒤)
    iconCell<Row>('down', 'actionCell02', 30, '받기', row => {
      if (row.fileNm) message.info('파일 받기는 B10(파일 공통) 변환 뒤에 됩니다');
    }),
    gb.textCenter('noteYnStr', 100, '참고내용'),  // L213
    // actionCell03 ImageCell("Edit") L187-203: 저장 후 이용 → 참고내용 팝업 Sys54_Edit_Note
    iconCell<Row>('edit', 'actionCell03', 30, '등록', row => {
      if (requireSaved()) setNoteRow(row);
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [crud.hasChanges]);

  // [E0] 화면 열림 (생성자 L79-105 → settings()) / open() L73-77: this.retrieve()
  // [E6 생략] fileDeleteForm.SubmitComplete (L139) → retrieve(): 파일 삭제 폼(deleteFile)은 B10(파일 공통) 뒤
  // [E7 생략] fileUpdownForm.Change (L146) → retrieve(): 파일 선택·업로드(FileUpload)는 B10 뒤
  // [E9 생략] msgBox.DialogHide [YES] (L307) → deleteFile(): 재등록 시 기존 파일 삭제는 B10 뒤
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); else crud.clear(); }, [open, companyId]);

  // [E3] insertButton[등록].Select (L120) → insert() L235-246: companyId + 요청일 = 오늘(addChange → 변경 행)
  const insert = () => crud.addRows([{ regDate: dayjs().format('YYYY-MM-DD') }], true);

  return (
    <>
      <Modal
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
            <Button type="save" onClick={crud.saveRows}>저장</Button>
            <Button type="register" onClick={insert}>등록</Button>
            {/* [E4] deleteButton[삭제].Select (L126) → delete() */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* setChecked(SINGLE): 체크박스 단일 선택 */}
            <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
          </div>
        </div>
      </Modal>
      {/* 참고내용 [Edit]: lookup.open(selectModel, callback → retrieve()) */}
      {companyId && <Sys54_Edit_Note companyId={companyId} history={noteRow} onClose={() => setNoteRow(undefined)} onSaved={retrieve} />}
    </>
  );
};
