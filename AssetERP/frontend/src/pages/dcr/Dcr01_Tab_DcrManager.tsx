/**
 * 문서작성 > 01. 문서작성 > 업무별 문서작성 — 왼쪽 분류 트리 + 오른쪽 문서 목록 (F02, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Tab_DcrManager.java (277줄) — Dcr01_Tab_DcrUser(#1002)와 관리자판(#1003)이 같이 쓰는 부모 클래스.
 *   함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L68-147: west(350, 분할선, 최대 1000, 여백 20/0/20/20) = 테두리 박스(툴바 50: 문서분류 · 찾기 입력 150 · [찾기] / 트리 흰 배경),
 *   center = 테두리 박스(Apr01_Grid_DocList). 한 번 눌러도 노드가 열리고 닫힌다(Tree.onClick → super.onDoubleClick)
 * 트리를 어디서 읽는지만 자식 클래스가 바꾼다(DcrUser.retrieve() L36-51) → loadTree 로 받는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Splitter, Tree, Typography } from 'antd';
import { FolderOpenOutlined, FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { errorMessage } from '@/api/client';
import { DcrWriteTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { Apr01_Grid_DocList } from '../apr/Apr01_Grid_DocList';
import { ancestorKeys, toTree } from './dcr01Tree';

interface Props {
  /** AS-IS retrieve(): 트리를 읽는 서비스 (DcrUser = dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite) */
  loadTree: () => Promise<DcrWriteTree[]>;
  /** managerYn: 관리자판만 true */
  admin?: boolean;
  /** S1 고객사는 문서작성 금지 → [신규문서 작성]을 숨긴다 (DcrUser 생성자 L29-31) */
  showInsert: boolean;
  /** 문서 목록 영역에 안쪽 여백(padding 10·gap 8, Dcr01_Tab_DcrWrite와 같은 값) — #1002만 켠다 */
  padded?: boolean;
}

export const Dcr01_Tab_DcrManager: React.FC<Props> = ({ loadTree, admin = false, showInsert, padded }) => {
  const [rows, setRows] = useState<DcrWriteTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrWriteTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // [E1 생략] retrieveButton[조회].Select (L74) → retrieve(): 원본도 이 버튼을 툴바에 달지 않는다(buttonBar에는 라벨·docSearch·[찾기]뿐)
  // [E0] 화면 열림 (생성자 L68-147) → retrieve() L197-208 (서비스는 자식 클래스가 정한다)
  const retrieve = async () => {
    setLoading(true);  // tree.mask("Loading")
    try {
      setRows(await loadTree());
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));  // getServiceResult L261-264
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] docSearch.KeyPress [Enter] (L82)·[E3] searchButton[찾기].Select (L92) → search() L210-254
  //   선택을 풀고 모두 접은 뒤, 이름에 검색어(대소문자 무시)가 든 노드를 찾아 부모를 펼치고 선택한다. 화면 이동은 처음 찾은 노드로
  //   (GXT는 직접 부모만 펼치지만 접힌 조상 밑에 숨으면 보이지 않으므로 조상을 모두 펼친다)
  const search = () => {
    setSelected(null);
    setExpanded([]);
    const text = docSearch.toLowerCase();
    if (text === '') return;
    const matches = rows.filter(r => r.classTreeName.toLowerCase().indexOf(text) > -1);
    if (matches.length === 0) return;
    const keys = new Set<React.Key>();
    matches.forEach(m => ancestorKeys(rows, m.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    setSelected(matches[matches.length - 1]);  // 마지막으로 고른 것이 선택으로 남는다
    // 펼친 뒤 처음 찾은 노드가 보이도록 스크롤 (AS-IS는 nodeTop·scrollTop을 직접 계산)
    setTimeout(() => boxRef.current?.querySelector(`[data-ckey="${matches[0].classTreeId}"]`)?.scrollIntoView({ block: 'nearest' }), 0);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={350} min={200} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography.Text strong style={{ flex: 'none' }}>문서분류</Typography.Text>
              <Input style={{ width: 150, flex: 'none' }} allowClear value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
              <Button type="search" onClick={search}>찾기</Button>
            </div>
            <div ref={boxRef} style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#fff' }}>
              {/* [E4] tree.Selection (L108) → docList.retrieve(classTreeModel, managerYn) */}
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
            <Apr01_Grid_DocList node={selected} admin={admin} showInsert={showInsert} padded={padded} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
