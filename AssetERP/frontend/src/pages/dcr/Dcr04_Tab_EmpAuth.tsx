/**
 * 관리자 > 02. 문서권한관리 > 조회권한 예외사원 등록 — 왼쪽 문서분류 트리(+부서별 조회권한 필터링) + 오른쪽 예외사원 그리드 (EE08, #1491)
 * 스타일: TG
 * AS-IS: myApp/client/vi/dcr/Dcr04_Tab_EmpAuth.java (258줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L56-91: west(400, 분할선, 최대 1000, 여백 20/0/20/20) = 테두리 박스(위 툴바 50: 문서분류 · 찾기 입력 200 · [찾기] / 트리 / 아래 툴바 50: 부서별 조회권한 필터링 · 조직 조회창 칸 210 빈칸="전체"),
 *   center = 테두리 박스(Dcr04_TabPage_EmpAuth, 여백 20/20/20/0). 한 번 눌러도 노드가 열리고 닫힌다. 트리 모양은 Dcr03_Tab_DcrAuth(EE06)와 같다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message, Splitter, Tree, Typography } from 'antd';
import { FolderOpenOutlined, FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import { Dcr04_TabPage_EmpAuth } from './Dcr04_TabPage_EmpAuth';
import { toTree } from './dcr01Tree';
import { DcrClassSearchList } from './DcrClassSearchList';
import { TreeListControlButtons } from '@/components/button/TreeListControlButtons';

const BAR_STYLE: React.CSSProperties = { minHeight: 50, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px', padding: '4px 8px', flex: 'none' };

export const Dcr04_Tab_EmpAuth: React.FC = () => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [docSearch, setDocSearch] = useState('');
  // 보기 방식: 트리(열 때) / 리스트([찾기] 결과 — UX보강)
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const [orgCodeId, setOrgCodeId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');
  const [orgOpen, setOrgOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // 선택이 정확히 1건일 때만 오른쪽이 그 문서분류를 받는다 (tree.Selection L132-146: count == 1 → retrieve(model), 아니면 retrieve(null))
  const selected = selectedKeys.length === 1 ? rows.find(r => r.classTreeId === Number(selectedKeys[0])) ?? null : null;

  // [E0] 화면 열림 (생성자 L56-91) → retrieve() L182-205: orgCodeId가 있으면 dcr.Dcr01_ClassTree.selectByOrgCodeId(그 조직에 조회권한이 있는 분류만),
  //   없으면 selectByCompanyId (companyId는 서버가 세션에서, typeCode %)
  const retrieve = async (org: number | null = orgCodeId) => {
    setLoading(true);  // tree.mask("Loading")
    try {
      setRows(await dcrApi.searchClassTree('%', undefined, org ?? undefined));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));  // getServiceResult L239-253
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] docSearch.KeyPress [Enter] (L95)·[E3] searchButton01[찾기].Select (L126) → search() L217-236
  //   선택을 풀고 모두 접은 뒤, 이름에 검색어가 든 노드를 모두 찾아 부모를 펼치고 선택한다(여러 건이면 오른쪽은 비워진다). 화면 이동은 처음 찾은 노드로
  const search = () => {
    // UX보강: 이름에 검색어가 든 분류를 리스트로 보인다(AS-IS는 트리를 펼쳐 고름)
    setSelectedKeys([]);
    if (docSearch === '') return;
    setView('list');
  };

  // 자식이 있는 분류(부모로 쓰인 분류)를 모두 펼친다
  const expandAll = () => setExpanded([...new Set(rows.map(x => x.parentTreeId).filter(id => rows.some(x => x.classTreeId === id)))]);

  // [E2] orgSearch.TriggerClick [result != null] (L106) → Org00_Lookup_SelectSingle(오늘, [전체] 있음): 조직을 고르면 그 조직, [전체]면 비움 → retrieve()
  const onOrgPick = (org: OrgInfo | null) => {
    setOrgOpen(false);
    const id = org?.orgCodeId ?? null;
    setOrgCodeId(id);
    setOrgName(org?.korNm ?? '');
    setSelectedKeys([]);
    setExpanded([]);
    void retrieve(id);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={400} min={200} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={BAR_STYLE}>
              <Typography.Text strong style={{ flex: 'none' }}>문서분류</Typography.Text>
              <Input style={{ width: 120, flex: 'none' }} allowClear value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
              <Button type="search" onClick={search}>찾기</Button>
              <TreeListControlButtons value={view} onChange={setView} onExpandAll={expandAll} onCollapseAll={() => setExpanded([])} expandDisabled={treeData.length === 0} />
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: view === 'list' ? 'hidden' : 'auto', background: '#fff' }}>
              {/* [E4] tree.Selection (L132) → tabPage.retrieve(classTreeModel) */}
              {view === 'list' ? (
                <DcrClassSearchList rows={rows} query={docSearch} onSelect={r => setSelectedKeys(r ? [r.classTreeId] : [])} />
              ) : !loading && treeData.length > 0 && (
                <Tree
                  treeData={treeData}
                  multiple
                  showIcon
                  blockNode
                  icon={p => (p.isLeaf ? <UnorderedListOutlined /> : p.expanded ? <FolderOpenOutlined /> : <FolderOutlined />)}
                  expandedKeys={expanded}
                  onExpand={keys => setExpanded(keys)}
                  selectedKeys={selectedKeys}
                  onSelect={(keys, info) => {
                    setSelectedKeys(keys);
                    // tree.onClick → onDoubleClick: 한 번 눌러도 열리고 닫힌다
                    setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
                  }}
                />
              )}
            </div>
            <div style={{ ...BAR_STYLE, borderTop: '1px solid #d9d9d9' }}>
              <Typography.Text strong style={{ flex: 'none' }}>부서별 조회권한 필터링</Typography.Text>
              <LookupInput width={210} value={orgName} placeholder="전체" onOpen={() => setOrgOpen(true)} onClear={() => onOrgPick(null)} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <Dcr04_TabPage_EmpAuth classTree={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Org00_Lookup_SelectSingle
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        fixDate={false}
        allButton
        onAll={() => onOrgPick(null)}
        onSelect={org => onOrgPick(org)}
        onClose={() => setOrgOpen(false)}
      />
    </div>
  );
};
