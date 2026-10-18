/**
 * 문서분류 선택 (E17) — Dcr30_Tab_LinkAdmin·Dcr30_TabPage_Company의 문서분류명 셀에서 연다. 다른 도메인(act·apr·ast·biz·car·emp·flt·ics·pay)도 쓰는 공통 조회창.
 * AS-IS: myApp/client/vi/dcr/Dcr30_Move_DcrClass.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNull() L71-86: 관리자(admin) 열기 — 500×700 모달, 툴바 "문서분류 [검색 250] [찾기]" + 트리(typeCode %) + [확인][선택안함][닫기].
 *   companyId·companyName을 주면 그 회사의 트리, 제목 "문서분류 - 회사명"
 * 일반 사용자 열기(open(defaultModel, callback) L88-93: dcr.Dcr03_OrgAuth.selectByDcrOrgId 권한 검사)는 이 화면에서 쓰지 않아 옮기지 않았다 — 쓰는 도메인 변환 때 더한다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space, Tree } from 'antd';
import type { GetRef } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { ancestorKeys, toTree } from '@/pages/dcr/dcr01Tree';

export interface Dcr30ClassResult {
  classTreeId: number | null;
  classTreeFullName: string | null;
}

interface Props {
  /** 값이 true인 동안 열려 있다 — 열릴 때마다 다시 조회한다 */
  open: boolean;
  /** openNull(companyId, companyName, callback) L71 — 없으면 로그인 회사 */
  companyId?: number;
  companyName?: string;
  /** [확인]·[선택안함]의 callback.execute(classTreeModel) — 선택안함은 둘 다 null */
  onResult: (result: Dcr30ClassResult) => void;
  onClose: () => void;
}

/** f_class_tree_nm_allpath: 루트부터 이름을 '/'로 이은 전체 이름 */
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

export const Dcr30_Move_DcrClass: React.FC<Props> = ({ open, companyId, companyName, onResult, onClose }) => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const treeRef = useRef<GetRef<typeof Tree>>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // [E0] 화면 열림 (생성자 L63-69, open L93-112) → retrieve() L260-270: dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode %)
  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setExpanded([]);
    setDocSearch('');
    dcrApi.searchClassTree('%', companyId)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] docSearch.KeyPress [Enter] (L117), [E2] searchButton[찾기].Select (L125) → search() L272-315
  const search = () => {
    setSelected(null);
    setExpanded([]);
    const findText = docSearch;
    if (findText == null || findText === '') return;
    const lower = findText.toLowerCase();
    const matches = rows.filter(r => r.classTreeName.toLowerCase().indexOf(lower) > -1);
    if (matches.length === 0) return;
    // 찾은 분류의 부모를 모두 펼치고, 마지막으로 찾은 것이 선택으로 남는다(GXT Tree 단일 선택). 화면 이동은 처음 찾은 것으로
    const keys = new Set<React.Key>();
    matches.forEach(m => ancestorKeys(rows, m.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    setSelected(matches[matches.length - 1]);
    setTimeout(() => treeRef.current?.scrollTo({ key: matches[0].classTreeId, align: 'auto' }));
  };

  // [E3] updateButton[확인].Select (L136) → update() L168-209 (admin 열기: 권한 검사 없이 callback·hide)
  const update = () => {
    if (selected == null || selected.typeCode !== 'T') {
      message.warning('최하위 문서분류를 선택해주세요');
      return;
    }
    onResult({ classTreeId: selected.classTreeId, classTreeFullName: fullName(rows, selected.classTreeId) });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={companyName ? `문서분류 - ${companyName}` : '문서분류'}
      width={500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E4] nullButton[선택안함].Select (L142) → 전체이름·ID를 null로 callback·hide */}
            <Button type="select" onClick={() => { onResult({ classTreeId: null, classTreeFullName: null }); onClose(); }}>선택안함</Button>
            {/* [E5] cancleButton[닫기].Select (L151) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <SearchBar onSearch={search} searchText="찾기">
        <SearchBar.Field label="문서분류">
          <SearchBar.Input style={{ width: 250 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      {/* getMenuTree() L211-247: 한 번 눌러도 노드가 열리고 닫힌다(onClick → onDoubleClick). [E6] tree.Selection (L158) → classTreeModel = 선택 항목 */}
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
    </Modal>
  );
};
