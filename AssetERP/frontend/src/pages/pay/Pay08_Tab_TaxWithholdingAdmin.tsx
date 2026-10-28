/**
 * 원천징수영수증 업로드 (S25) — 경영관리 > 04. 급여관리 > 원천징수영수증 업로드 #1220
 * AS-IS: myApp/client/vi/pay/Pay08_Tab_TaxWithholdingAdmin.java (363줄) + Pay08_PDFViewer(69줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 Pay08_Tab_TaxWithholdingAdmin() L76-148: 왼쪽 860 = 툴바 50(사원명 · [조회][저장][파일업로드]) + 파일 그리드(셀 편집, 단일 선택), 가운데 = PDF 뷰어(분할), 바깥 여백 20.
 * 로그인 회사의 영수증 파일 전체(사원을 고르면 그 사원 것만). 올리면 파일마다 영수증 행이 새로 생긴다. PDF 뷰어는 매뉴얼용 Sys95_PDFViewer(A33)를 그대로 쓴다.
 * 스타일: CG
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Modal, Splitter, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { PayTaxReceipt } from '@/types/pay';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys95_PDFViewer } from '../sys/Sys95_PDFViewer';

const gb = gbFor<PayTaxReceipt>();

// 단일 선택(체크박스 없음) — AS-IS 그리드는 setChecked가 없다. 렌더마다 새 객체를 넘기면 선택이 풀려 상수로 둔다
const ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Pay08_Tab_TaxWithholdingAdmin: React.FC = () => {
  // personName / personId (LookupTriggerField / LongField) — 조회 때 ref로 읽는다
  const [personName, setPersonName] = useState('');
  const personIdRef = useRef<number | null>(null);
  const [lookupToolbar, setLookupToolbar] = useState(false);
  const [lookupRow, setLookupRow] = useState<PayTaxReceipt | null>(null);
  const [selected, setSelected] = useState<PayTaxReceipt>();
  const selectedIdRef = useRef<number | undefined>(undefined);
  selectedIdRef.current = selected?.fileId;
  // 다시 조회한 뒤 첫 행을 고를지(retrieve() L320) — 저장한 뒤에는 고르던 행을 그대로 둔다
  const selectFirst = useRef(false);
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [uploading, setUploading] = useState(false);

  const crud = useGridCrud<PayTaxReceipt>({
    idField: 'fileId',
    // retrieve() L302-336: 사원을 골랐으면 selectByPersonId, 아니면 selectByCompanyId(로그인 회사)
    search: useCallback(async () => {
      const list = await payApi.searchTaxReceipts(personIdRef.current);
      selectFirst.current = true;
      return list;
    }, []),
    // update() L355-358: pay.Pay08_TaxWithholding.update(바뀐 행의 사원·비고)
    save: useCallback(async (rows: PayTaxReceipt[]) => {
      await payApi.saveTaxReceipts(rows);
      return rows;
    }, []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
  });
  const { retrieve: retrieveRows, gridRef, rows } = crud;
  const gridApiRef = gridRef as React.RefObject<AgGridReact<PayTaxReceipt> | null>;

  // [E0] 화면 열림 (생성자 L76-148) → settings(), retrieve()
  useEffect(() => { void retrieveRows(); }, [retrieveRows]);

  // retrieve() L320-333: 조회 뒤 첫 행을 고르고 pdf면 뷰어에 연다(없으면 "none"). 저장 뒤에는 고르던 행을 되살린다
  useEffect(() => {
    const api = gridApiRef.current?.api;
    if (!api) return;
    const prevId = selectedIdRef.current;
    setTimeout(() => {
      const keep = !selectFirst.current && prevId != null ? api.getRowNode(String(prevId)) : undefined;
      selectFirst.current = false;
      const node = keep ?? api.getDisplayedRowAtIndex(0);
      if (node) node.setSelected(true);
      else setSelected(undefined);
    });
  }, [rows, gridApiRef]);

  // [E4] personName.TriggerClick [result == null] (L153) → 인라인 L153-172: 고른 사원의 이름·ID를 칸에 넣고, 선택안함이면 비운다
  const onToolbarPersonPicked = (row: TransInfo | null) => {
    setLookupToolbar(false);
    personIdRef.current = row?.personId ?? null;
    setPersonName(row?.korNm ?? '');
  };

  // [E9] personName.TriggerClick (L212) → 인라인 L212-227: 고른 사원의 ID·이름을 그 행에 넣는다
  const onRowPersonPicked = (row: TransInfo | null) => {
    const target = lookupRow;
    setLookupRow(null);
    if (!row || !target) return;
    crud.updateRow(target.fileId, { personId: row.personId, personName: row.korNm ?? '' });
  };

  // [E2] fileUploadForm.SubmitComplete (L94) → resetFileUpload(), retrieve() — 파일마다 영수증 행을 만들어 올린다(FileUpload?mode=pay08)
  const upload = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) await payApi.uploadTaxReceipt(file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    } finally {
      setUploading(false);
      void retrieveRows();
    }
  };

  // [E10] msgBox.DialogHide [YES] (L243) → checkFileDelete() L271-300
  const checkFileDelete = async (row: PayTaxReceipt) => {
    try {
      const result = await fileApi.checkFileDeleteResult(row.fileId, row.taxWithholdingId);
      if (result.status === FILE_DELETE_STATUS.RELATE_DELETED) {
        void retrieveRows();
      } else if (result.status === FILE_DELETE_STATUS.IN_USE) {
        Modal.info({ title: '알림', content: result.message ?? '' });
      } else if (result.status === FILE_DELETE_STATUS.DELETABLE) {
        // FileDelete?fileId= → 파일, GridDeleteData → pay.Pay08_TaxWithholding.delete → 영수증 행
        await fileApi.deleteFile(row.fileId);
        await payApi.deleteTaxReceipt(row.taxWithholdingId);
        // [E3] fileDeleteForm.SubmitComplete (L105) → retrieve()
        void retrieveRows();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L207-269: 파일명 350 · 사원명 100(조회창 트리거, 편집) · 비고 300(편집) · 내려받기 아이콘 30 · 삭제 아이콘 30
  const columnDefs = useMemo(() => [
    gb.text('fileName', 350, '파일명'),
    gb.textCenter('personName', 100, '사원명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: PayTaxReceipt; value?: string }) => (
        <><AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setLookupRow(p.data); }} />{p.value}</>
      ),
    }),
    gb.text('note', 300, '비고', { editor: 'text' }),
    // downloadCell (ImageCell "Down") L228: FileDownload?fileType=file&fileId=
    iconCell<PayTaxReceipt>('down', 'actionCell', 30, '', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // deleteCell (ImageCell "Delete") L238: 확인(450) → checkFileDelete()
    iconCell<PayTaxReceipt>('delete', 'actionCell2', 30, '', row => {
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        width: 450,
        okText: '예',
        cancelText: '아니오',
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const isPdf = selected?.fileExt?.toLowerCase() === 'pdf';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <Splitter style={{ height: '100%', border: '1px solid #d9d9d9' }}>
        <Splitter.Panel defaultSize={860} min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
            {/* [E5] retrieveButton[조회].Select (L173) → retrieve() · [E6] updateButton[저장].Select (L179) → update() · [E7] uploadButton[파일업로드].Select (L185) → fileUpload.click() */}
            <SearchBar
              onSearch={() => retrieveRows()}
              loading={crud.loading}
              extra={<>
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                <Button type="upload" disabled={uploading} onClick={() => fileForm.current?.click()}>파일업로드</Button>
              </>}
            >
              <SearchBar.Field label="사원명">
                <LookupInput
                  value={personName}
                  width={100}
                  onOpen={() => setLookupToolbar(true)}
                  onClear={() => { personIdRef.current = null; setPersonName(''); }}
                />
              </SearchBar.Field>
            </SearchBar>
            {/* [E1] fileUpload.Change (L84) → 인라인 L84-91 · [E11] fileUpload.Change (L345) → resetFileUpload 뒤 같은 핸들러: 고른 파일을 FileUpload?mode=pay08로 올린다 */}
            <FileUpdownForm ref={fileForm} onChange={() => {}} onChangeFiles={upload} />
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E8] grid.CellClick (L192) → 인라인 L192-204: 고른 파일이 pdf면 viewer.open(PDF) 아니면 viewer.open("none") */}
              <CellEditGrid<PayTaxReceipt>
                crud={crud}
                columnDefs={columnDefs}
                rowSelection={ROW_SELECTION}
                onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0])}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={300}>
          <Sys95_PDFViewer fileId={isPdf ? selected?.fileId : undefined} />
        </Splitter.Panel>
      </Splitter>
      {/* settings() L157: lookupEmpTransInfo.open(true, new Date(), true, cb) — [선택안함]이 있고 겸직 포함 */}
      <Emp00_Lookup_SelectSingle
        open={lookupToolbar}
        transDate={dayjs().format('YYYY-MM-DD')}
        separateAddTitle
        noneLabel="선택안함"
        onResult={onToolbarPersonPicked}
        onClose={() => setLookupToolbar(false)}
      />
      {/* buildGrid() L216: lookupEmpTransInfo.open(today, true, cb) — 단추 없음, 겸직 포함 */}
      <Emp00_Lookup_SelectSingle
        open={lookupRow != null}
        transDate={dayjs().format('YYYY-MM-DD')}
        separateAddTitle
        noneLabel={null}
        onResult={onRowPersonPicked}
        onClose={() => setLookupRow(null)}
      />
    </div>
  );
};
