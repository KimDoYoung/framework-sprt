/**
 * [1481] 책무 > 90. 책무관리현황 > 이행점검 연관양식 등록 (N28)
 * AS-IS: myApp/client/vi/tdm/Tdm43_Tab_RelateFormFileUpload.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-116: 테두리 박스(여백 20) = 툴바 높이 50(구분 200 · 검색 300 "파일명/비고" · [조회][저장][파일업로드]) + 양식 파일 CellEditGrid(체크박스 단일)
 * 함께: Tdm43_Lookup_RelateFormFileMultiUpload(양식 등록 창, 신규) / Sys10_Lookup_FileViewer(보기, 기존)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { errorMessage } from '@/api/client';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { sysApi } from '@/api/sys';
import { tdmApi } from '@/api/tdm';
import { Code, FileInfo } from '@/types/sys';
import { TdmFormFile } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Tdm43_Lookup_RelateFormFileMultiUpload } from './Tdm43_Lookup_RelateFormFileMultiUpload';

const gb = gbFor<TdmFormFile>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;   // setChecked(SelectionMode.SINGLE)

export const Tdm43_Tab_RelateFormFileUpload: React.FC = () => {
  // typeComboBox "TdmCheckFormType" 전체('%') · searchText (emptyText "파일명/비고")
  const [formType, setFormType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [formTypes, setFormTypes] = useState<Code[]>([]);        // formTypeComboBox[TdmCheckFormType] (그리드 구분 편집기)
  const [uploadOpen, setUploadOpen] = useState(false);           // Tdm43_Lookup_RelateFormFileMultiUpload
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);   // Sys10_Lookup_FileViewer

  useEffect(() => {
    sysApi.searchCodes('TdmCheckFormType').then(setFormTypes).catch(() => {});
  }, []);

  // retrieve() L215-229: 서비스 sys.Sys10_File.getTdmCheckFormFile(companyId, tdmCheckFormType, "%검색어%")
  const latest = useRef({ formType, searchText });
  latest.current = { formType, searchText };
  const override = useRef<string | undefined>(undefined);   // 콤보를 바꾼 직후 상태가 반영되기 전 값
  const search = useCallback(async () => {
    const type = override.current ?? latest.current.formType;
    override.current = undefined;
    return tdmApi.searchFormFiles(type, latest.current.searchText);
  }, []);

  const crud = useGridCrud<TdmFormFile>({
    idField: 'fileId',
    search,
    // update() L231-244: 변경이 없으면 "변경된 내역이 없습니다"(저장(0) 비활성) → GridUpdate → sys.Sys10_File.update → retrieve()
    save: useCallback(async (changed: TdmFormFile[]) => { await tdmApi.saveFormFiles(changed); return changed; }, []),
    remove: useCallback(async () => undefined, []),   // 행 삭제 단추 없음 — 삭제는 [삭제] 아이콘(파일째)
    newRow: useCallback(() => ({}), []),              // 행 추가 단추 없음 — 올리기는 [파일업로드]
    reloadAfterSave: true,
  });

  // [E0] 화면 열림 (생성자 L71-116) → settings(), retrieve() / [E1] typeComboBox.callbackOnCreate (L58) → "전체" 뒤 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  // checkFileDelete() L246-271: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 서버 문구 / 지워도 됨(3) → FileDelete
  // [E2] fileDeleteForm.SubmitComplete (L76) → retrieve()
  const checkFileDelete = async (row: TdmFormFile) => {
    try {
      const { status, message: text } = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await crud.retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning(text ?? '해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await crud.retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildApprFileGrid() L150-213
  const columnDefs = useMemo(() => [
    gb.text('tdmCheckFormTypeName', 200, '구분', {  // L204 formTypeComboBox — [E8] formTypeComboBox.ValueChange (L154) → 고른 행의 구분 코드와 이름을 같이 바꾼다
      editor: 'select',
      values: formTypes.map(c => c.name),
      valueSetter: p => {
        p.data.tdmCheckFormTypeName = p.newValue;
        p.data.tdmCheckFormType = formTypes.find(c => c.name === p.newValue)?.code ?? p.data.tdmCheckFormType;
        return true;
      },
    }),
    gb.text('fileName', 500, '파일명'),  // L205
    gb.text('note', 200, '비고', { editor: 'text' }),  // L206
    gb.date('regDate', 90, '등록일'),  // L207 (AS-IS 100 — 읽기 전용 날짜는 90, UX-08)
    iconCell<TdmFormFile>('down', 'downloadCell', 50, '받기', row => {  // L208 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // L209 deleteCell → [E9] msgBox.DialogHide [YES] (L177) → checkFileDelete()
    iconCell<TdmFormFile>('delete', 'deleteCell', 50, '삭제', row => {
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시곘습니까?',
        width: 450,
        okText: '예',
        cancelText: '아니오',
        onOk: () => checkFileDelete(row),
      });
    }),
    iconCell<TdmFormFile>('view', 'viewCell', 50, '보기', row => {  // L210 viewCell → Sys10_Lookup_FileViewer.open(fileId)
      setViewFile({ fileId: row.fileId, parentId: row.parentId, fileNm: row.fileName, fileExt: row.fileExt });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [formTypes]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L136) → retrieve() */}
        <SearchBar
          onSearch={() => crud.retrieve()}
          extra={
            <>
              {/* [E7] updateButton[저장].Select (L142) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E3] fileUploadButton[파일업로드].Select (L82) → fileMultiUpload() */}
              <Button type="upload" onClick={() => setUploadOpen(true)}>파일업로드</Button>
            </>
          }
        >
          <SearchBar.Field label="구분">
            {/* [E4] typeComboBox[TdmCheckFormType].Collapse (L120) → retrieve() */}
            <SystemCodeComboBox kindCd="TdmCheckFormType" altCode={['%', '전체']} style={{ width: 200 }} allowClear={false} value={formType}
              onChange={code => { const v = code ?? '%'; setFormType(v); override.current = v; void crud.retrieve(); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E5] searchText.KeyPress [Enter] (L128) → retrieve() */}
            <SearchBar.Input style={{ width: 300 }} placeholder="파일명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmFormFile> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
      {/* fileMultiUpload() L273-280: 올린 뒤 retrieve() */}
      <Tdm43_Lookup_RelateFormFileMultiUpload open={uploadOpen} onUploaded={() => { void crud.retrieve(); }} onClose={() => setUploadOpen(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
