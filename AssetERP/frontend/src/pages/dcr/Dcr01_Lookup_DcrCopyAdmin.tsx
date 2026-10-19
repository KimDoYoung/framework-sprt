/**
 * 운용사별 문서분류 반영 창 (E16) — Dcr01_Tab_ClassTree의 [문서분류복사]에서 연다 (관리자 회사만)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_DcrCopyAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * Dcr01_Lookup_DcrCopyAdmin() L61-67·open() L69-114: 모달 900×700 "운용사별 문서분류 반영", 왼쪽 55% (문서분류 + 검색 250 + [찾기] / 트리), 오른쪽 45% ([문서분류복사] / 체크 그리드 운용사 200 · " " 100), 아래 가운데 [닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Tree } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree, DcrCopyCompany } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { ancestorKeys, toTree } from './dcr01Tree';

const gb = gbFor<DcrCopyCompany>();

interface Props {
  /** open() L69 — 값이 true면 열린다 */
  open: boolean;
  onClose: () => void;
}

export const Dcr01_Lookup_DcrCopyAdmin: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [companies, setCompanies] = useState<DcrCopyCompany[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loadingTree, setLoadingTree] = useState(false);
  const gridRef = useRef<AgGridReact<DcrCopyCompany>>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // buildGrid() L151-158: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.text('companyName', 200, '운용사'),  // L155
    gb.text('locationName', 100, ' '),  // L156
  ], []);

  // [E0] 화면 열림 (생성자 L61-67, open() L69-114) → retrieveCompany() L270-273 · retrieve() L237-268
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setSelected(null);
    setExpanded([]);
    setLoadingTree(true);
    dcrApi.searchClassTree('%')
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')))
      .finally(() => setLoadingTree(false));
    dcrApi.searchCopyCompanies()
      .then(setCompanies)
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open]);

  // [E1] searchText.KeyPress [Enter] (L122) · [E2] searchButton[찾기].Select (L131) → search() L285-303: 닫고(collapseAll) 이름에 검색어가 든 분류의 부모를 펼치고 고른다
  const search = () => {
    setSelected(null);
    setExpanded([]);
    if (!searchText) return;
    const found = rows.filter(r => r.classTreeName.indexOf(searchText) > -1);
    if (found.length === 0) return;
    setExpanded([...new Set(found.flatMap(r => ancestorKeys(rows, r.classTreeId)))]);
    setSelected(found[found.length - 1]);
  };

  // [E3] updateButton[문서분류복사].Select (L137) → update() L160-196: 분류를 안 골랐으면 "문서분류를 선택해주세요", 최하위(T)가 아니면 "최하위 문서분류를 선택해주세요",
  //   운용사를 안 골랐으면 "운용사를 선택해주세요" → dcr.Dcr01_ClassTree.insertAdminCopy(dcrClassTreeId, 고른 운용사) → "문서분류 반영이 완료되었습니다."
  const update = async () => {
    if (!selected) return message.warning('문서분류를 선택해주세요');
    if (selected.typeCode !== 'T') return message.warning('최하위 문서분류를 선택해주세요');
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return message.warning('운용사를 선택해주세요');
    try {
      await dcrApi.adminCopy(selected.classTreeId, checked.map(c => c.companyId));
      message.success('문서분류 반영이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '반영 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="운용사별 문서분류 반영"
      width={900}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E4] closeButton[닫기].Select (L143) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', gap: 0 }}>
        <div style={{ width: '55%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <Space style={{ height: 50, padding: '0 8px', flex: 'none' }}>
            <span>문서분류</span>
            <Input style={{ width: 250 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={search} />
            <Button type="search" onClick={search}>찾기</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', borderTop: '1px solid #d9d9d9', padding: 4 }}>
            {!loadingTree && treeData.length > 0 && (
              <Tree
                treeData={treeData}
                expandedKeys={expanded}
                onExpand={keys => setExpanded(keys)}
                selectedKeys={selected ? [selected.classTreeId] : []}
                onSelect={(keys, info) => {
                  const id = Number(info.node.key);
                  setSelected(keys.length ? rows.find(r => r.classTreeId === id) ?? null : null);
                  setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
                }}
              />
            )}
          </div>
        </div>
        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', borderLeft: 0, boxSizing: 'border-box' }}>
          <Space style={{ height: 50, padding: '0 8px', flex: 'none' }}>
            <Button type="change" onClick={update}>문서분류복사</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0, borderTop: '1px solid #d9d9d9' }}>
            <MultiGrid<DcrCopyCompany> rowClick gridRef={gridRef} rowData={companies} columnDefs={columnDefs} getRowId={p => String(p.data.companyId)} />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
