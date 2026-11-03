/**
 * 관리자 > 02. 문서권한관리 > 문서분류별 조직 맵핑 — 왼쪽 문서분류 트리 + 오른쪽 조직 권한 트리 (EE06, #1073)
 * 스타일: TG
 * AS-IS: myApp/client/vi/dcr/Dcr03_Tab_DcrAuth.java (221줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-116: west(400, 분할선, 최대 1000, 여백 20/0/20/20) = 테두리 박스(툴바 50: 문서분류 · 찾기 입력 100 · [찾기] / 트리 흰 배경),
 *   center = 테두리 박스(Dcr03_TabPage_DcrAuth, 여백 20/20/20/0). 한 번 눌러도 노드가 열리고 닫힌다. 트리 모양은 Dcr01_Tab_DcrManager(F02)·Dcr01_Tab_DcrClassModify(EE05)와 같다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Splitter, Tree, Typography } from 'antd';
import { FolderOpenOutlined, FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { Dcr03_TabPage_DcrAuth } from './Dcr03_TabPage_DcrAuth';
import { ancestorKeys, toTree } from './dcr01Tree';

export const Dcr03_Tab_DcrAuth: React.FC = () => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // [E0] 화면 열림 (생성자 L49-116) → retrieve() L156-166: dcr.Dcr01_ClassTree.selectByCompanyId (companyId는 서버가 세션에서, typeCode %)
  // [E1 생략] retrieveButton[조회].Select (L54) → retrieve(): 원본도 이 버튼을 툴바에 달지 않는다(buttonBar에는 라벨·docSearch·[찾기]뿐)
  const retrieve = async () => {
    setLoading(true);  // tree.mask("Loading")
    try {
      setRows(await dcrApi.searchClassTree('%'));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));  // getServiceResult L201-216
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] docSearch.KeyPress [Enter] (L63)·[E3] searchButton[찾기].Select (L73) → search() L178-198
  //   선택을 풀고 모두 접은 뒤, 이름에 검색어가 든 노드를 찾아 부모를 펼치고 선택한다. 화면 이동은 처음 찾은 노드로
  const search = () => {
    setSelected(null);
    setExpanded([]);
    if (docSearch === '') return;
    const matches = rows.filter(r => r.classTreeName.indexOf(docSearch) > -1);
    if (matches.length === 0) return;
    const keys = new Set<React.Key>();
    matches.forEach(m => ancestorKeys(rows, m.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    setSelected(matches[matches.length - 1]);  // 마지막으로 고른 것이 선택으로 남는다
    setTimeout(() => boxRef.current?.querySelector(`[data-ckey="${matches[0].classTreeId}"]`)?.scrollIntoView({ block: 'nearest' }), 0);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={400} min={200} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography.Text strong style={{ flex: 'none' }}>문서분류</Typography.Text>
              <Input style={{ width: 100, flex: 'none' }} allowClear value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
              <Button type="search" onClick={search}>찾기</Button>
            </div>
            <div ref={boxRef} style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#fff' }}>
              {/* [E4] tree.Selection (L90) → dcrList.retrieve(classTreeModel) */}
              {!loading && treeData.length > 0 && (
                <Tree
                  treeData={treeData}
                  showIcon
                  blockNode
                  titleRender={n => <span data-ckey={String(n.key)}>{n.title as React.ReactNode}</span>}
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
            <Dcr03_TabPage_DcrAuth classTreeId={selected?.classTreeId ?? null} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
