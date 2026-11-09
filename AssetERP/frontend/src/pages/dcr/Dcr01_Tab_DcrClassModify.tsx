/**
 * 관리자 > 03. 문서관리 > 문서이동 — 왼쪽 분류 트리 + 오른쪽 문서 목록 (EE05, 1단계)
 * 스타일: TG
 * AS-IS: myApp/client/vi/dcr/Dcr01_Tab_DcrClassModify.java (218줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-112: west(400, 분할선, 최대 1000, 여백 20/0/20/20) = 테두리 박스(툴바 50: 문서분류 · 찾기 입력 150 · [찾기] / 트리 흰 배경),
 *   center = 테두리 박스(Dcr01_Grid_DcrClassList, 여백 20/20/20/0). 한 번 눌러도 노드가 열리고 닫힌다. 트리 모양은 Dcr01_Tab_DcrManager(F02)와 같다
 * 1단계: 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message, Splitter, Tree, Typography } from 'antd';
import { FolderOpenOutlined, FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { Dcr01_Grid_DcrClassList } from './Dcr01_Grid_DcrClassList';
import { toTree } from './dcr01Tree';
import { DcrClassSearchList } from './DcrClassSearchList';
import { TreeListControlButtons } from '@/components/button/TreeListControlButtons';

export const Dcr01_Tab_DcrClassModify: React.FC = () => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  // 보기 방식: 트리(열 때) / 리스트([찾기] 결과 — UX보강)
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const [loading, setLoading] = useState(false);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // [E0] 화면 열림 (생성자 L49-112) → retrieve() L163-173: dcr.Dcr01_ClassTree.selectByCompanyId (companyId는 서버가 세션에서, typeCode %)
  // [E1 생략] retrieveButton[조회].Select (L54) → retrieve(): 원본도 이 버튼을 툴바에 달지 않는다(buttonBar에는 라벨·docSearch·[찾기]뿐)
  const retrieve = async () => {
    setLoading(true);  // tree.mask("Loading")
    try {
      setRows(await dcrApi.searchClassTree('%'));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));  // getServiceResult L198-213
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void retrieve(); }, []);

  // [E2] docSearch.KeyPress [Enter] (L62)·[E3] searchButton[찾기].Select (L72) → search() L175-195
  //   선택을 풀고 모두 접은 뒤, 이름에 검색어가 든 노드를 찾아 부모를 펼치고 선택한다. 화면 이동은 처음 찾은 노드로
  const search = () => {
    // UX보강: 이름에 검색어가 든 분류를 리스트로 보인다(AS-IS는 트리를 펼쳐 고름)
    setSelected(null);
    if (docSearch === '') return;
    setView('list');
  };

  // 자식이 있는 분류(부모로 쓰인 분류)를 모두 펼친다
  const expandAll = () => setExpanded([...new Set(rows.map(x => x.parentTreeId).filter(id => rows.some(x => x.classTreeId === id)))]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={400} min={200} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ minHeight: 50, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px', padding: '4px 8px', flex: 'none' }}>
              <Typography.Text strong style={{ flex: 'none' }}>문서분류</Typography.Text>
              <Input style={{ width: 110, flex: 'none' }} allowClear value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
              <Button type="search" onClick={search}>찾기</Button>
              <TreeListControlButtons value={view} onChange={setView} onExpandAll={expandAll} onCollapseAll={() => setExpanded([])} expandDisabled={treeData.length === 0} />
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: view === 'list' ? 'hidden' : 'auto', background: '#fff', marginTop: 8 }}>
              {/* [E4] tree.Selection (L96) → dcrClassList.retrieve(classTreeModel, managerYn = true) */}
              {view === 'list' ? (
                <DcrClassSearchList rows={rows} query={docSearch} onSelect={setSelected} />
              ) : !loading && treeData.length > 0 && (
                <Tree
                  treeData={treeData}
                  showIcon
                  blockNode
                  icon={p => (p.isLeaf ? <UnorderedListOutlined /> : p.expanded ? <FolderOpenOutlined /> : <FolderOutlined />)}
                  expandedKeys={expanded}
                  onExpand={keys => setExpanded(keys)}
                  selectedKeys={selected == null ? [] : [selected.classTreeId]}
                  onSelect={(_keys, info) => {
                    const id = Number(info.node.key);
                    setSelected(rows.find(r => r.classTreeId === id) ?? null);
                    setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
                  }}
                />
              )}
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <Dcr01_Grid_DcrClassList node={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
