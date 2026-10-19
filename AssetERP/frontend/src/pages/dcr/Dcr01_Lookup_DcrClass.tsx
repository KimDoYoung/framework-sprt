/**
 * 문서분류 조회창 (F05) — 통합 문서검색(Dcr00_Tab_DocList)의 문서분류 칸에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_DcrClass.java (343줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L101-169: 500×700 모달 "문서분류", 툴바 "문서분류 [검색 200] [찾기]" + 트리(typeCode %) + [선택][전체][닫기]
 * Dcr30_Move_DcrClass와 달리 최하위가 아니어도 고른 노드를 그대로 돌려준다(confirm L284-296). 권한 있는 조직만 보는 open(…, orgId)는 이 화면에서 쓰지 않아 옮기지 않았다
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
import { ancestorKeys, toTree } from './dcr01Tree';

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
  const treeRef = useRef<GetRef<typeof Tree>>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // open() L101-169 → retrieve() L241-260: dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode %)
  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setExpanded([]);
    setDocSearch('');
    dcrApi.searchClassTree('%')
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] docSearch.KeyPress [Enter] (L111), [E2] searchButton[찾기].Select (L119) → search() L262-282
  const search = () => {
    setSelected(null);
    setExpanded([]);
    const findText = docSearch;
    if (findText == null || findText === '') return;
    const lower = findText.toLowerCase();
    const matches = rows.filter(r => r.classTreeName.toLowerCase().indexOf(lower) > -1);
    if (matches.length === 0) return;
    // 찾은 분류의 부모를 모두 펼치고, 마지막으로 찾은 것이 선택으로 남는다(GXT Tree 단일 선택)
    const keys = new Set<React.Key>();
    matches.forEach(m => ancestorKeys(rows, m.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    setSelected(matches[matches.length - 1]);
    setTimeout(() => treeRef.current?.scrollTo({ key: matches[0].classTreeId, align: 'auto' }));
  };

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
      <SearchBar onSearch={search} searchText="찾기">
        <SearchBar.Field label="문서분류">
          <SearchBar.Input style={{ width: 200 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      {/* getMenuTree() L171-208: 한 번 눌러도 노드가 열리고 닫힌다(onClick → onDoubleClick) */}
      <div style={{ height: 560, overflow: 'auto', marginTop: 8 }}>
        {treeData.length > 0 && (
          <Tree
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
