/**
 * 코드 목록 조회창 (A13 — Sys13_TabPage_Code 등록에서 연다)
 * AS-IS: myApp/client/vi/sys/Sys09_Lookup_CodeKind.java — open(codeKindId, companyId, callback)과 tdmLawOpen(taskId, callback)(EE43, kindCode 'TdmLawCode'·taskId) 을 옮김
 * tdmLawOpen L61-65 → open(kindCode) L67-81: 코드구분을 코드로 찾고, 제목 "법규목록" 800×600, 열 코드 70·코드명 650, 그 직무에 이미 연결된 법규는 뺀다(retrieve L175-177)
 * UX보강(10) B12-2: 검색 줄 = SearchBar(UX-01·04). 조건이 1개라 초기화(UX-02) 없음
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CodeAdmin } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<CodeAdmin>();

/** AS-IS buildGrid() L157-167 (setChecked MULTI) */
const buildGrid = () => [
  gb.textCenter('code', 100, '코드'),  // L163
  gb.text('name', 200, '코드명'),  // L164
];

interface Props {
  open: boolean;
  /** open(codeKindId, …). kindCode를 주면 필요 없다 */
  codeKindId?: number;
  /** 없으면 로그인 회사 */
  companyId?: number;
  /** open(kindCode, …) L67-81: 코드구분 코드(예 'TdmLawCode')로 코드구분을 찾는다 */
  kindCode?: string;
  /** tdmLawOpen(taskId, …): kindCode 'TdmLawCode'일 때 그 직무에 이미 연결된 법규(연결구분 '1')는 뺀다 */
  taskId?: number | null;
  /** callback.execute(list) — 고른 코드들. 닫기는 onClose */
  onResult: (codes: CodeAdmin[]) => void;
  onClose: () => void;
}

export const Sys09_Lookup_CodeKind: React.FC<Props> = ({ open, codeKindId: kindIdProp, companyId, kindCode, taskId, onResult, onClose }) => {
  const [codeKindId, setCodeKindId] = useState<number | null>(kindIdProp ?? null);
  const tdmLaw = kindCode === 'TdmLawCode';
  const gridRef = useRef<AgGridReact<CodeAdmin>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<CodeAdmin[]>([]);
  const columnDefs = useMemo(() => tdmLaw
    ? [gb.textCenter('code', 70, '코드'), gb.text('name', 650, '코드명')]  // L100-101 setColumnWidth(2, 70) · (3, 650)
    : buildGrid(), [tdmLaw]);

  // open(kindCode, callback) L67-81: sys.Sys08_CodeKind.selectByKindCode(kindCode) → codeKindId
  useEffect(() => {
    if (!open) return;
    if (kindIdProp != null) { setCodeKindId(kindIdProp); return; }
    if (!kindCode) return;
    let alive = true;
    sysApi.getCodeKindByCode(kindCode)
      .then(k => { if (alive && k) setCodeKindId(k.codeKindId); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [open, kindIdProp, kindCode]);

  // retrieve() L169-185: codeKindId·companyId·searchText
  const retrieve = useCallback(async (text: string) => {
    if (codeKindId == null) return;
    try {
      setRows(await sysApi.searchCodesByKind(codeKindId, companyId, text, tdmLaw ? taskId : undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [codeKindId, companyId, tdmLaw, taskId]);

  // open() L83-124: 열 때마다 새 창 → 검색어를 비우고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    retrieve('');
  }, [open, retrieve]);

  // confirm() L187-197: 선택이 없으면 메시지, 있으면 callback(목록) + 닫기
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('코드를 선택해주세요');
      return;
    }
    onResult(list);
  };

  return (
    <LookupModal
      open={open}
      title={tdmLaw ? '법규목록' : '코드목록'}
      width={tdmLaw ? 900 : 400}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* confirmButton[확인].Select (L143) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* cancelButton[닫기].Select (L149) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'min(450px, calc(100vh - 260px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* retrieveButton[조회].Select (L136) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            {/* searchText.KeyPress [Enter] (L127) → retrieve() */}
            <SearchBar.Input autoFocus style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<CodeAdmin> rowClick gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.codeId)} />
        </div>
      </div>
    </LookupModal>
  );
};
