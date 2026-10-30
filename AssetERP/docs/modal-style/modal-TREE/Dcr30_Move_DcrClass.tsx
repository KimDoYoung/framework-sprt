/**
 * 문서분류 선택 (E17) — Dcr30_Tab_LinkAdmin·Dcr30_TabPage_Company의 문서분류명 셀에서 연다. 다른 도메인(act·apr·ast·biz·car·emp·flt·ics·pay)도 쓰는 공통 조회창.
 * AS-IS: myApp/client/vi/dcr/Dcr30_Move_DcrClass.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNull() L71-86: 관리자(admin) 열기 — 500×700 모달, 툴바 "문서분류 [검색 250] [찾기]" + 트리(typeCode %) + [확인][선택안함][닫기].
 *   companyId·companyName을 주면 그 회사의 트리, 제목 "문서분류 - 회사명"
 * open(defaultModel, callback) L88-93 (L06 Apr01_Tab_BizPriorApproval): 일반 사용자 열기 — `authCheck`. [선택안함] 없음(버튼 [확인][닫기]),
 *   [확인] update() L168-209: 관리자(userId<0·회사 0)는 검사 없이, 그 밖에는 dcr.Dcr03_OrgAuth.selectByDcrOrgId(내 조직·고른 분류)로 수정권한을 확인한다.
 *   권한이 없으면 `defaultClassTreeId`(open의 defaultModel)와 같은 분류일 때만 통과, 아니면 "권한이 없는 문서분류입니다. 관리자에게 문의하세요"
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Tree } from 'antd';
import type { GetRef } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { FileTextOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { ExpandCollapseButtons } from '@/components/button/ExpandCollapseButtons';
import { TreeListToggle } from '@/components/button/TreeListToggle';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupModal } from './LookupModal';
import { ancestorKeys, toTree } from '@/pages/dcr/dcr01Tree';

const gb = gbFor<{ classTreeId: number; fullName: string }>();

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
  /** open(defaultModel, callback) — 일반 사용자 열기: [선택안함]을 감추고 [확인]에서 조직 권한을 검사한다(관리자는 검사 없음) */
  authCheck?: boolean;
  /** open(callback) L93-112 (S18 Pay10_Tab_List) — [선택안함]만 감추고 권한 검사는 하지 않는다(admin 열기 그대로) */
  hideNull?: boolean;
  /** open(defaultModel, …)의 defaultModel — 권한이 없어도 이 분류는 고를 수 있다 */
  defaultClassTreeId?: number | null;
  /** [확인]·[선택안함]의 callback.execute(classTreeModel) — 선택안함은 둘 다 null */
  onResult: (result: Dcr30ClassResult) => void;
  onClose: () => void;
}

/** f_class_tree_nm_allpath: 루트부터 이름을 '/'로 이은 전체 이름 (callback 값은 이대로, 리스트 보기 표시만 sep ' ➡︎ ') */
const fullName = (rows: DcrClassTree[], id: number, sep = '/'): string => {
  const byId = new Map(rows.map(r => [r.classTreeId, r]));
  const names: string[] = [];
  let cur = byId.get(id);
  while (cur) {
    names.unshift(cur.classTreeName);
    cur = byId.get(cur.parentTreeId);
  }
  return names.join(sep);
};

export const Dcr30_Move_DcrClass: React.FC<Props> = ({ open, companyId, companyName, authCheck, hideNull, defaultClassTreeId, onResult, onClose }) => {
  const user = useLoginUser();
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  // 보기 방식: 트리(AS-IS) / 리스트(UX보강 — 선택할 수 있는 최하위 분류만 전체 경로로, 검색어가 든 것만)
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const treeRef = useRef<GetRef<typeof Tree>>(null);
  // 최하위 분류(typeCode 'T', 선택할 수 있는 것)에 문서 아이콘 — 폴더와 구분. toTree는 말단에도 children: []를 넣어 antd의 isLeaf를 쓸 수 없다
  const treeData = useMemo(() => {
    const typeById = new Map(rows.map(x => [x.classTreeId, x.typeCode]));
    const decorate = (nodes: DataNode[]): DataNode[] => nodes.map(n => ({
      ...n,
      icon: typeById.get(Number(n.key)) === 'T' ? <FileTextOutlined style={{ color: '#8c8c8c' }} /> : undefined,
      children: n.children ? decorate(n.children) : undefined,
    }));
    return decorate(toTree(rows));
  }, [rows]);
  // AS-IS 500×700 안의 트리(560). 화면이 작으면 줄여 모달이 화면 밖으로 나가 바깥 스크롤이 생기지 않게 한다 (머리·검색·푸터·여백 약 250)
  const treeHeight = Math.max(200, Math.min(560, window.innerHeight - 250));

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

  const listRows = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    return rows
      .filter(x => x.typeCode === 'T')
      .map(x => ({ classTreeId: x.classTreeId, fullName: fullName(rows, x.classTreeId, ' ➡︎ ') }))
      .filter(x => q === '' || x.fullName.toLowerCase().includes(q));
  }, [rows, docSearch]);

  // 자식이 있는 분류(부모로 쓰인 분류)를 모두 펼친다
  const expandAll = () => setExpanded([...new Set(rows.map(x => x.parentTreeId).filter(id => rows.some(x => x.classTreeId === id)))]);

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
  const update = async () => {
    if (selected == null || selected.typeCode !== 'T') {
      message.warning('최하위 문서분류를 선택해주세요');
      return;
    }
    const done = () => {
      onResult({ classTreeId: selected.classTreeId, classTreeFullName: fullName(rows, selected.classTreeId) });
      onClose();
    };
    // LoginUser.getIsManager()(회사관리자 userId<0) || this.admin — authCheck 아닌 열기(openNull)는 admin
    if (!authCheck || user.userId < 0) {
      done();
      return;
    }
    try {
      if (await dcrApi.hasClassTreeUpdateAuth(selected.classTreeId)) {
        done();
      } else if (defaultClassTreeId != null && selected.classTreeId === defaultClassTreeId) {
        done();
      } else {
        message.warning('권한이 없는 문서분류입니다. 관리자에게 문의하세요');
      }
    } catch (err) {
      message.error(errorMessage(err, '권한 확인 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title={companyName ? `문서분류 - ${companyName}` : '문서분류'}
      width={580}
      style={{ top: 20 }}
      // 조회창 원칙: 머리 아래 선(푸터 위 선은 LookupModal이 둔다)
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E4] nullButton[선택안함].Select (L142) → 전체이름·ID를 null로 callback·hide */}
            {!authCheck && !hideNull && <Button type="select" style={{ background: '#a6a6a6' }} onClick={() => { onResult({ classTreeId: null, classTreeFullName: null }); onClose(); }}>선택안함</Button>}
            {/* [E5] cancleButton[닫기].Select (L151) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* 검색 줄은 연한 회색 바탕으로 트리와 구분한다(선을 늘리지 않는다). [입력 200] [찾기] 는 왼쪽, 모두 펼치기·접기(UX-09)는 맨 오른쪽 — 폭은 모달에 맞춰 늘고 준다 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#f5f5f5', borderRadius: 4 }}>
        <div style={{ flex: 1, minWidth: 0}}>
          <SearchBar onSearch={search} searchText="찾기">
            <SearchBar.Field label={null}>
              <SearchBar.Input style={{ width: 200 }} value={docSearch} placeholder='분류명의 일부로 검색..' onChange={e => setDocSearch(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        <TreeListToggle value={view} onChange={setView} />
        <ExpandCollapseButtons onExpandAll={expandAll} onCollapseAll={() => setExpanded([])} disabled={view === 'list' || treeData.length === 0} />
      </div>
      {/* getMenuTree() L211-247: 한 번 눌러도 노드가 열리고 닫힌다(onClick → onDoubleClick). [E6] tree.Selection (L158) → classTreeModel = 선택 항목 */}
      <div style={{ height: treeHeight, overflow: 'hidden', marginTop: 8}}>
        {view === 'list' ? (
          <SingleGrid<{ classTreeId: number; fullName: string }>
            rowData={listRows}
            columnDefs={[gb.text('fullName', 440, '문서분류')]}
            getRowId={p => String(p.data.classTreeId)}
            onSelect={row => setSelected(row ? rows.find(x => x.classTreeId === row.classTreeId) ?? null : null)}
            onRowDoubleClicked={() => void update()}
          />
        ) : treeData.length > 0 && (
          <Tree
            ref={treeRef}
            height={treeHeight}
            treeData={treeData}
            showIcon
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
