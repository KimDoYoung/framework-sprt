/**
 * 문서분류 조회창 (F05) — 통합 문서검색(Dcr00_Tab_DocList)의 문서분류 칸에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_DcrClass.java (343줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L101-169: 500×700 모달 "문서분류", 툴바 "문서분류 [검색 200] [찾기]" + 트리(typeCode %) + [선택][전체][닫기]
 * Dcr30_Move_DcrClass와 달리 최하위가 아니어도 고른 노드를 그대로 돌려준다(confirm L284-296). 권한 있는 조직만 보는 open(…, orgId)는 이 화면에서 쓰지 않아 옮기지 않았다
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Tree } from 'antd';
import type { GetRef } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { toTree, dcrTreeIcon, DcrTree } from './dcr01Tree';
import { DcrClassSearchList } from './DcrClassSearchList';
import { TreeListControlButtons } from '@/components/button/TreeListControlButtons';

export interface DcrClassResult {
  classTreeId: number;
  classTreeFullName: string;
}

interface Props {
  /** 값이 true인 동안 열려 있다 — 열릴 때마다 다시 조회한다 */
  open: boolean;
  /** [선택]의 callback.execute(classTreeModel) */
  onResult: (result: DcrClassResult) => void;
  /** [전체]의 callback.execute(null) */
  onAll: () => void;
  onClose: () => void;
}

/** f_class_tree_nm_allpath: 루트부터 이름을 '/'로 이은 전체 이름 (getClassTreeFullName) */
const fullName = (rows: DcrClassTree[], id: number): string => {
  const byId = new Map(rows.map(r => [r.classTreeId, r]));
  const names: string[] = [];
  let cur = byId.get(id);
  while (cur) {
    names.unshift(cur.classTreeName);
    cur = byId.get(cur.parentTreeId);
  }
  return names.join('/');
};

export const Dcr01_Lookup_DcrClass: React.FC<Props> = ({ open, onResult, onAll, onClose }) => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  // 보기 방식: 트리(열 때) / 리스트([찾기] 결과 — UX보강)
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const treeRef = useRef<GetRef<typeof Tree>>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // open() L101-169 → retrieve() L241-260: dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode %)
  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setExpanded([]);
    setDocSearch('');
    setView('tree');
    dcrApi.searchClassTree('%')
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
  }, [open]);

  // [E1] docSearch.KeyPress [Enter] (L111), [E2] searchButton[찾기].Select (L119) → search() L262-282
  const search = () => {
    // UX보강: 이름에 검색어가 든 분류를 리스트로 보인다(AS-IS는 트리를 펼쳐 고름)
    setSelected(null);
    if (docSearch === '') return;
    setView('list');
  };

  // 자식이 있는 분류(부모로 쓰인 분류)를 모두 펼친다
  const expandAll = () => setExpanded([...new Set(rows.map(x => x.parentTreeId).filter(id => rows.some(x => x.classTreeId === id)))]);

  // [E3] okButton[선택].Select (L125) → confirm() L284-296: 고른 것이 없으면 "분류를 선택해주세요"
  const confirm = () => {
    if (selected == null) {
      message.warning('분류를 선택해주세요');
      return;
    }
    onResult({ classTreeId: selected.classTreeId, classTreeFullName: fullName(rows, selected.classTreeId) });
    onClose();
  };

  // [E4] selectAllButton[전체].Select (L131) → confirmAll() L298-301: callback.execute(null) 뒤 닫는다
  const confirmAll = () => {
    onAll();
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="문서분류"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>선택</Button>
            <Button type="select" onClick={confirmAll}>전체</Button>
            {/* [E5] cancleButton[닫기].Select (L137) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SearchBar onSearch={search} searchText="찾기">
            <SearchBar.Field label="문서분류">
              <SearchBar.Input style={{ width: 130 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        <TreeListControlButtons value={view} onChange={setView} onExpandAll={expandAll} onCollapseAll={() => setExpanded([])} expandDisabled={treeData.length === 0} />
      </div>
      {/* getMenuTree() L171-208: 한 번 눌러도 노드가 열리고 닫힌다(onClick → onDoubleClick) */}
      <div style={{ height: 560, overflow: view === 'list' ? 'hidden' : 'auto', marginTop: 8 }}>
        {view === 'list' ? (
          <DcrClassSearchList rows={rows} query={docSearch} onSelect={setSelected} />
        ) : treeData.length > 0 && (
          <DcrTree
            showIcon
            icon={dcrTreeIcon}
            ref={treeRef}
            height={560}
            treeData={treeData}
            expandedKeys={expanded}
            onExpand={keys => setExpanded(keys)}
            selectedKeys={selected == null ? [] : [selected.classTreeId]}
            onSelect={(keys, info) => {
              const id = keys.length ? Number(keys[0]) : Number(info.node.key);
              setSelected(rows.find(r => r.classTreeId === id) ?? null);
              setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
            }}
          />
        )}
      </div>
    </LookupModal>
  );
};
