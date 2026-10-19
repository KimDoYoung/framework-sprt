/**
 * 문서양식 조회창 (E16) — Dcr06_Lookup_Form의 [행 추가]에서 연다 (연결할 문서양식을 고른다)
 * AS-IS: myApp/client/vi/dcr/Dcr05_Lookup_DocType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L52-128: 모달 760×600 "문서양식", 위 툴바(구분 콤보 150 "전체" · 검색 200 "양식제목을 입력해주세요" · [조회]) + 체크박스 다중 그리드(구분 150 · 양식 제목 450 · 수정 80), 아래 가운데 [확인][취소]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrDocType } from '@/types/dcr';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Dcr05_Edit_Update } from './Dcr05_Edit_Update';

const gb = gbFor<DcrDocType>();

interface Props {
  /** open(callback) L52 — 값이 true면 열린다 */
  open: boolean;
  /** callback.execute(selectList) — confirm() L170-174 */
  onResult: (list: DcrDocType[]) => void;
  onClose: () => void;
}

export const Dcr05_Lookup_DocType: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [formClassCode, setFormClassCode] = useState('%');
  const [titleName, setTitleName] = useState('');
  const [rows, setRows] = useState<DcrDocType[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewRow, setViewRow] = useState<DcrDocType | null>(null);
  const gridRef = useRef<AgGridReact<DcrDocType>>(null);

  // retrieve() L156-168: 서비스 dcr.Dcr05_DocType.selectByName(searchText, companyId, formClassCode)
  const retrieve = async (text: string, formClass: string) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await dcrApi.searchDocTypes(text, formClass));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E0] open() → retrieve()
  useEffect(() => {
    if (!open) return;
    setFormClassCode('%');
    setTitleName('');
    setRows([]);
    void retrieve('', '%');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L130-154: setChecked(SINGLE)이지만 open()이 MULTI로 바꾼다
  const columnDefs = useMemo(() => [
    gb.text('docFormClassName', 150, '구분'),  // L149
    gb.text('title', 450, '양식 제목'),  // L150
    // L151 actionCell(Edit) → Dcr05_Edit_Update.retrieveReadOnly(docTypeModel)
    iconCell<DcrDocType>('edit', 'actionCell', 80, '수정', row => setViewRow(row)),
  ], []);

  // [E4] oKButton[확인].Select (L88) · [E6] grid.CellDoubleClick (L100) → confirm() L170-174: callback.execute(고른 목록); hide()
  const confirm = (clicked?: DcrDocType) => {
    const list = clicked ? [clicked] : gridRef.current?.api?.getSelectedRows() ?? [];
    onResult(list);
    onClose();
  };

  return (
    <>
      <LookupModal
        open={open}
        title="문서양식"
        width={760}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={() => confirm()}>확인</Button>
              {/* [E5] cancelButton[취소].Select (L94) → hide() */}
              <Button type="cancel" onClick={onClose}>취소</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 460, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E3] retrieveButton[조회].Select (L82) · [E2] titleName.KeyPress [Enter] (L74) → retrieve() */}
          <SearchBar searchText="조회" onSearch={() => retrieve(titleName, formClassCode)} loading={loading}>
            <SearchBar.Field label="구분">
              {/* [E1] docFormClassComboBox[DocFormClassCode].Collapse (L65) → retrieve() */}
              <SystemCodeComboBox kindCd="DocFormClassCode" altCode={['%', '전체']} style={{ width: 150 }} value={formClassCode}
                onChange={code => { const next = code ?? '%'; setFormClassCode(next); void retrieve(titleName, next); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="양식제목을 입력해주세요" value={titleName} onChange={e => setTitleName(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<DcrDocType> rowClick gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading}
              getRowId={p => String(p.data.docTypeId)} onRowDoubleClicked={e => { if (e.data) confirm(e.data); }} />
          </div>
        </div>
      </LookupModal>
      <Dcr05_Edit_Update model={viewRow} readOnly onClose={() => setViewRow(null)} />
    </>
  );
};
