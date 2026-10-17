/**
 * [1298] 관리자 > 09. 기타 > AssetERP 매뉴얼 등록 (A34)
 * AS-IS: myApp/client/vi/sys/Sys95_Tab_ManualAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L81-157: 왼쪽 860(분할) = 툴바(분류 콤보 · 검색어 · 조회 · 저장 · 파일업로드 · 분류추가) + 셀 편집 그리드(행번호, 단일 선택),
 *   가운데 = Sys95_PDFViewer. 매뉴얼은 파일 업로드로만 만든다(파일마다 매뉴얼 행 + 첨부). 분류추가 = Sys09_Lookup_Code("ManualType").
 * UX보강(10): 툴바 = SearchBar(UX-01, 검색어 Enter·지우기=UX-04), 저장 = 저장(n)(UX-03). 조건이 둘이라 초기화(UX-02)를 둔다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Splitter, message } from 'antd';
import { sysApi } from '@/api/sys';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Code, Manual } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys09_Lookup_Code } from '@/components/lookup/Sys09_Lookup_Code';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys95_PDFViewer } from './Sys95_PDFViewer';

const gb = gbFor<Manual>();

interface Query { manualType: string; searchText: string }

export const Sys95_Tab_ManualAdmin: React.FC = () => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  // typeComboBox ComboBoxField("ManualType", "%", "전체", "전체"), searchTextField 빈칸="검색어(파일명/비고) 입력"
  const sp = useSearchParams<Query>(() => ({ manualType: '%', searchText: '' }));
  const { manualType, searchText } = sp.values;
  const query = useRef<Query>(sp.current.current);
  const [selected, setSelected] = useState<Manual>();
  const [loaded, setLoaded] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  /** lookupType() 콜백 → typeComboBox.retrieve("ManualType", null): 툴바 콤보만 다시 불러온다 */
  const [comboKey, setComboKey] = useState(0);
  /** buildGrid() L222-278의 typeCombo = ComboBoxField("ManualType") — 만들 때 한 번 불러온다 */
  const [types, setTypes] = useState<Code[]>([]);
  const selectFirst = useRef(false);

  const crud = useGridCrud<Manual>({
    idField: 'manualId',
    // retrieve() L280-307: sys.Sys95_Manual.selectByText(manualType, "%검색어%", publicCheck=false)
    search: useCallback(() => sysApi.searchManualsAdmin(query.current), []),
    // update() L309-312: GridUpdate → sys.Sys95_Manual.update
    save: sysApi.updateManuals,
    remove: useCallback(async () => 0, []),  // 삭제는 파일 삭제 확인 뒤 deleteRowByFile()이 한다(deleteChecked를 쓰지 않음)
    // 매뉴얼은 파일 업로드로만 만들어진다 — 행 추가 버튼이 없다
    newRow: useCallback(() => ({}), []),
  });
  const gridApi = () => crud.gridRef.current?.api;

  // retrieve() L280-307: 조회 뒤 첫 행을 선택하고 PDF면 열고 아니면 "none"
  const retrieve = useCallback(async (p?: Query) => {
    query.current = p ?? sp.current.current;
    selectFirst.current = true;
    setSelected(undefined);
    await crud.retrieve();
    setLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crud.retrieve, sp.current]);

  // [E0] 화면 열림 (생성자 L81-157) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); sysApi.searchCodes('ManualType').then(setTypes).catch(() => setTypes([])); }, []);

  useEffect(() => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    if (crud.rows.length > 0) setTimeout(() => gridApi()?.getDisplayedRowAtIndex(0)?.setSelected(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crud.rows]);

  // [E11] msgBox.DialogHide [YES] (L240) → checkFileDelete() L333-362: sys.Sys11_RelateFile.checkFileDelete → 1이면 조회, 2면 안내, 3이면 파일 삭제 + sys.Sys95_Manual.delete
  const checkFileDelete = async (row: Manual) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, row.manualId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);  // [E3] fileDeleteForm.SubmitComplete (L112) → retrieve()
        await sysApi.deleteManuals([row.manualId]);
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const columnDefs = useMemo(() => {
    const names = types.map(t => t.name);
    return [
      gb.date('regDate', 90, '등록일'),  // L267
      // L268: addText(manualTypeName, "분류", typeCombo)
      // [E12] typeCombo[ManualType].Collapse (L260) → 고른 분류의 코드를 그 행의 manualType 변경으로 기록(addChange) = valueSetter
      gb.text('manualTypeNm', 100, '분류', {
        editor: 'select',
        values: names,
        valueSetter: p => {
          const code = types.find(t => t.name === p.newValue);
          if (!code || p.data.manualTypeNm === code.name) return false;
          p.data.manualType = code.code;
          p.data.manualTypeNm = code.name;
          return true;
        },
      }),
      gb.text('fileNm', 300, '파일명'),  // L269
      gb.boolean('publicYn', 50, '공개', { editable: true }),  // L270 addBoolean
      gb.text('note', 250, '비고', { editor: 'text' }),  // L271
      // L272-273: addCell(actionCell, 30, "", downloadCell / deleteCell)
      iconCell<Manual>('down', 'actionCell01', 30, ' ', row => {
        fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
      }),
      iconCell<Manual>('delete', 'actionCell02', 30, ' ', row => {
        Modal.confirm({
          title: '확인',
          content: '해당 파일을 삭제하시겠습니까?',
          okText: '예',
          cancelText: '아니오',
          onOk: () => checkFileDelete(row),
        });
      }),
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types]);

  // [E1] fileUpload.Change (L89) → FileUpload?mode=sys95&manualType= submit → [E2] fileUploadForm.SubmitComplete (L101) → resetFileUpload(), retrieve()
  // (resetFileUpload L314-331의 [E13] fileUpload.Change (L321)도 같은 일)
  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        await sysApi.uploadManual(manualType, file);
      } catch (err) {
        message.error(errorMessage(err, '파일 업로드 실패'));
        break;
      }
    }
    await retrieve();
  };

  const isPdf = selected?.fileExt?.toLowerCase() === 'pdf';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%', border: '1px solid #d9d9d9' }}>
        <Splitter.Panel defaultSize={860} min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
            {/* [E6] retrieveButton[조회].Select (L178) → retrieve(). [E5] searchTextField.KeyPress [Enter] (L170) → retrieve() = SearchBar.Input */}
            <SearchBar onSearch={() => retrieve()} loading={crud.loading}
              onReset={() => { sp.reset(); void retrieve({ manualType: '%', searchText: '' }); }}
              extra={<>
                {/* [E7] updateButton[저장].Select (L184) → update(). 저장(n)은 UX-03 */}
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                {/* [E8] uploadButton[파일업로드].Select (L190) → 분류가 '%'면 안내, 아니면 fileUpload.click() */}
                <Button type="upload" onClick={() => {
                  if (manualType === '%') {
                    message.warning('분류를 선택한 후, 파일을 업로드해 주세요.');
                    return;
                  }
                  fileForm.current?.click();
                }}>파일업로드</Button>
                {/* [E9] addTypeButton[분류추가].Select (L200) → lookupType() */}
                <Button type="addRow" onClick={() => setLookupOpen(true)}>분류추가</Button>
              </>}>
              <SearchBar.Field label="분류">
                {/* [E4] typeComboBox[ManualType].Collapse (L161) → retrieve() */}
                <SystemCodeComboBox key={comboKey} kindCd="ManualType" altCode={['%', '전체']} style={{ width: 130 }} value={manualType}
                  onChange={v => { const next = v ?? '%'; sp.set('manualType', next); void retrieve({ manualType: next, searchText: sp.current.current.searchText }); }} />
              </SearchBar.Field>
              <SearchBar.Input placeholder="검색어(파일명/비고) 입력" style={{ width: 200 }} value={searchText}
                onChange={e => sp.set('searchText', e.target.value)} />
            </SearchBar>
            <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={uploadFiles} />
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E10] grid.CellClick (L207) → 선택한 파일이 pdf면 viewer.open(PDF) 아니면 viewer.open("none") */}
              <CellEditGrid<Manual> crud={crud} columnDefs={columnDefs} sortable={false}
                rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
                onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0])} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={300}>
          <Sys95_PDFViewer fileId={isPdf ? selected?.fileId : undefined} mode={loaded ? 'none' : 'empty'} />
        </Splitter.Panel>
      </Splitter>
      {/* lookupType() L364-372: Sys09_Lookup_Code.edit("ManualType", 콜백 = typeComboBox.retrieve("ManualType", null)) */}
      <Sys09_Lookup_Code open={lookupOpen} codeKind="ManualType"
        onResult={() => setComboKey(k => k + 1)} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
