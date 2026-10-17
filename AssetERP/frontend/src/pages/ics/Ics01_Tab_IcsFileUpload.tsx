/**
 * 법규보고 서식파일 등록 (E02) — 기초자료 > 00. 내부통제 > 법규보고 서식파일 등록 #1107.
 * AS-IS: myApp/client/vi/ics/Ics01_Tab_IcsFileUpload.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L61-108: 위 툴바(법령구분 콤보 120 "전체" · 검색칸 300 "내용/서식파일" · [조회][저장][파일업로드]) + 그리드
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { icsApi } from '@/api/ics';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { IcsFormFileAdmin } from '@/types/ics';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ics01_Lookup_IcsFileMultiUpload } from './Ics01_Lookup_IcsFileMultiUpload';

const gb = gbFor<IcsFormFileAdmin>();

export const Ics01_Tab_IcsFileUpload: React.FC = () => {
  const sp = useSearchParams(() => ({ lawType: '%', searchText: '' }));
  const { lawType, searchText } = sp.values;
  const [lawCodes, setLawCodes] = useState<Code[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const crud = useGridCrud<IcsFormFileAdmin>({
    idField: 'fileId',
    // retrieve() L197-219: parentId 0 · lawType(전체면 %) · searchText %…% → sys.Sys10_File.getIcsFile
    search: useCallback(() => icsApi.searchFormFileAdmin(lawType, searchText), [lawType, searchText]),
    // update() L221-229: GridUpdate → sys.Sys10_File.update → 끝나면 retrieve()
    save: icsApi.saveFormFileAdmin,
    reloadAfterSave: true,
    // 행 추가·체크 삭제는 원본에 없다 — 삭제는 행의 아이콘(checkFileDelete)
    remove: async () => 0,
    newRow: useCallback(() => ({}), []),
  });

  // [E0] 화면 열림 (생성자 L61-108) → settings(), show(), retrieve()
  const retrieveRef = useRef(crud.retrieve);
  retrieveRef.current = crud.retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);
  useEffect(() => { sysApi.searchCodes('LawType').then(setLawCodes).catch(() => undefined); }, []);

  // checkFileDelete() L231-256: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → [E1] fileDeleteForm.SubmitComplete (L66) → retrieve()
  const checkFileDelete = async (row: IcsFormFileAdmin) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, 0);
      if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
        return;
      }
      if (status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildApprFileGrid() L140-195
  const columnDefs = useMemo(() => [
    // [E6] lawTypeComboBox[LawType].Collapse (L145-152): 고른 코드·이름을 행에 반영 (lawType·lawName addChange)
    gb.text('lawName', 150, '법령구분', {
      editor: 'select',
      values: lawCodes.map(c => c.name),
      valueSetter: p => {
        p.data.lawName = p.newValue;
        p.data.lawType = lawCodes.find(c => c.name === p.newValue)?.code ?? p.data.lawType;
        return true;
      },
    }),  // L188
    gb.text('note', 150, '내용', { editor: 'text' }),  // L189
    gb.date('regDate', 100, '등록일'),  // L190
    gb.text('fileName', 700, '서식파일'),  // L191
    // L153 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<IcsFormFileAdmin>('down', 'actionCellDown', 50, '받기', row => {  // L192
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // L163 deleteCell → [E7] msgBox.DialogHide [YES] (L168) → checkFileDelete()
    iconCell<IcsFormFileAdmin>('delete', 'actionCellDelete', 50, '삭제', row => {  // L193
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시곘습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 450,
        onOk: () => checkFileDelete(row),
      });
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [lawCodes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
      {/* [E3] searchText.KeyPress [Enter] (L116) → retrieve(), [E4] retrieveButton[조회].Select (L125) → retrieve() */}
      <SearchBar
        onSearch={crud.retrieve}
        onReset={sp.reset}
        extra={
          <>
            {/* [E5] updateButton[저장].Select (L131) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E2] fileUploadButton[파일업로드].Select (L72) → fileMultiUpload() */}
            <Button type="upload" onClick={() => setUploadOpen(true)}>파일업로드</Button>
          </>
        }
      >
        <SearchBar.Field label="법령구분">
          <SystemCodeComboBox kindCd="LawType" altCode={['%', '전체']} value={lawType} style={{ width: 120 }}
            onChange={code => sp.set('lawType', code ?? '%')} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="내용/서식파일" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<IcsFormFileAdmin> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: true }} />
      </div>
      <Ics01_Lookup_IcsFileMultiUpload open={uploadOpen} onUploaded={() => { void crud.retrieve(); }} onClose={() => setUploadOpen(false)} />
    </div>
  );
};
