/**
 * 연관 양식 불러오기 (E13-2) — Tdm43_Page_Relate의 연관양식 탭 [추가]에서 연다. 아직 이 점검항목에 연결 안 된 책무점검 양식을 고른다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L71-97: 모달 1200×650 "불러오기", 툴바(구분 200 · 검색 300 "파일명/비고" · [조회]) + 체크박스 다중 그리드 + 아래 가운데 [확인][닫기]
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { tdmApi } from '@/api/tdm';
import { TdmManlFormFile } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmManlFormFile>();

interface Props {
  /** AS-IS open(relateId, callback) — 점검항목 ID, 있으면 열린다 */
  relateId: number | null;
  /** callback.execute(selectList) */
  onResult: (list: TdmManlFormFile[]) => void;
  onClose: () => void;
}

export const Tdm43_Lookup_RelateFormFileList: React.FC<Props> = ({ relateId, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmManlFormFile>>(null);
  const [formType, setFormType] = useState('%');                // typeComboBox "TdmCheckFormType" 전체('%')
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmManlFormFile[]>([]);

  // [E3] retrieveButton[조회].Select (L121) → retrieve() L166-180: 서비스 sys.Sys10_File.selectUnConnTdmFormFile(companyId, tdmCheckFormType, "%검색어%", relateId)
  const retrieve = async (over?: { formType?: string }) => {
    if (relateId == null) return;
    try {
      setRows(await tdmApi.searchManlFormFiles(over?.formType ?? formType, searchText, relateId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L64-69) → open() 뒤 콤보 로딩이 끝나면 typeComboBox "전체" → retrieve() (execute() L47-50)
  useEffect(() => {
    setFormType('%');
    setSearchText('');
    setRows([]);
    if (relateId != null) void retrieve({ formType: '%' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relateId]);

  // [E4] confirmButton[확인].Select (L127) → confirm() L182-194: 선택이 없으면 "선택한 파일이 없습니다", 있으면 callback.execute(selectList); hide()
  const confirm = () => {
    const list = gridRef.current?.api?.getSelectedRows() ?? [];
    if (list.length === 0) return void message.warning('선택한 파일이 없습니다');
    onResult(list);
    onClose();
  };

  // buildGrid() L141-164 (setChecked MULTI) — 다운로드 아이콘: FileDownload?fileType=file&fileId=…
  const columnDefs = useMemo(() => [
    gb.text('tdmCheckFormTypeName', 200, '구분'),  // L157
    gb.text('fileName', 500, '파일명'),  // L158
    gb.text('note', 200, '비고'),  // L159
    gb.date('regDate', 100, '등록일'),  // L160
    iconCell<TdmManlFormFile>('down', 'actionCell', 70, '다운로드', row => { void fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패'))); }),  // L161
  ], []);

  return (
    <Modal
      open={relateId != null}
      title={<b>불러오기</b>}
      width="min(1200px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] closeButton[닫기].Select (L133) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 260px)', minHeight: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="구분">
            {/* [E1] typeComboBox[TdmCheckFormType].Collapse (L101) → retrieve() */}
            <SystemCodeComboBox kindCd="TdmCheckFormType" altCode={['%', '전체']} style={{ width: 200 }} allowClear={false} value={formType}
              onChange={code => { const v = code ?? '%'; setFormType(v); void retrieve({ formType: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L110) → retrieve() */}
            <SearchBar.Input style={{ width: 300 }} placeholder="파일명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TdmManlFormFile> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} />
        </div>
      </div>
    </Modal>
  );
};
