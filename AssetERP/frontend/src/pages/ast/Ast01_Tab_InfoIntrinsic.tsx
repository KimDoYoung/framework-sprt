/**
 * [1088] 고유자산 > 10. 고유자산 등록 > 고유자산 상세등록 ② (W02)
 * AS-IS: myApp/client/vi/ast/Ast01_Tab_InfoIntrinsic.java (217줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L48-101): west(폭 500) = 검색줄 + 자산분류 Tree(트리 위젯, 그리드 아님), center = Ast02_Grid_Detail, 여백 20
 * 운용자산 쪽 Ast01_Tab_InfoManagement(R09)와 달리 assetType '1'(고유자산), 버튼 문구 [찾기], 고른 항목이 1건·종목(IT)일 때만 상세를 연다.
 * 스타일: TG (견본 — docs/page-style.md). 원본 왼쪽이 TreeGrid가 아니라 Tree 위젯이라 useTreeGrid 대신 antd Tree를 쓴다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Spin, Splitter, Tree, Typography } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { AstClassTree } from '@/types/ast';
import { Ast02_Grid_Detail, Ast02GridDetailHandle } from './Ast02_Grid_Detail';

/** AS-IS 자산구분 (1:고유자산/2:운용자산) */
const ASSET_TYPE = '1';

export const Ast01_Tab_InfoIntrinsic: React.FC = () => {
  const [docSearch, setDocSearch] = useState('');
  const [treeList, setTreeList] = useState<AstClassTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const detailRef = useRef<Ast02GridDetailHandle>(null);

  // retrieve() L113-138: ast.Ast01_ClassTree.selectByCompanyId (typeCode %, assetType 1)
  // [E1] retrieveButton[찾기].Select (L50) → retrieve()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const data = await astApi.searchClassTree({ typeCode: '%', assetType: ASSET_TYPE });
      setTreeList(data);
      setSelectedKeys([]);
      setExpandedKeys(data.filter((d) => d.parentTreeId === 0).map((d) => String(d.classTreeId)));
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L48-101) → retrieve()
  useEffect(() => { retrieve(); }, [retrieve]);

  // [E3] tree.Selection (L68) → retrieveTabpage() L140-148: 고른 것이 1건이고 종목(IT)이면 상세 조회, 아니면 상세를 비활성
  const retrieveTabpage = (selected: AstClassTree[]) => {
    if (selected.length === 1 && selected[0].typeCode === 'IT') {
      detailRef.current?.loadNode(selected[0]);
    } else {
      detailRef.current?.visible();
    }
  };

  // [E2] docSearch.KeyPress [Enter] (L57) → search()
  // 선택 해제·모두 접기 → 이름이 맞는 노드의 조상을 펼치고 맞는 노드를 고른다(마지막으로 고른 노드가 선택으로 남는다)
  const search = () => {
    setSelectedKeys([]);
    setExpandedKeys([]);
    detailRef.current?.clear();
    const findText = docSearch.trim().toLowerCase();
    if (!findText) return;

    const byId = new Map(treeList.map((i) => [i.classTreeId, i]));
    const matched = treeList.filter((i) => (i.classTreeName ?? '').toLowerCase().includes(findText));
    const expand = new Set<string>();
    matched.forEach((m) => {
      let parent = byId.get(m.parentTreeId);
      while (parent) {
        expand.add(String(parent.classTreeId));
        parent = byId.get(parent.parentTreeId);
      }
    });
    setExpandedKeys([...expand]);
    const last = matched[matched.length - 1];
    if (last) {
      setSelectedKeys([String(last.classTreeId)]);
      retrieveTabpage([last]);
    }
  };

  const treeData = useMemo(() => {
    const map = new Map<number, DataNode & { raw: AstClassTree; children: DataNode[] }>();
    treeList.forEach((item) => {
      map.set(item.classTreeId, { key: String(item.classTreeId), title: item.classTreeName, raw: item, children: [] });
    });
    const roots: DataNode[] = [];
    treeList.forEach((item) => {
      const n = map.get(item.classTreeId);
      if (!n) return;
      const parent = item.parentTreeId === 0 ? undefined : map.get(item.parentTreeId);
      if (parent) parent.children.push(n);
      else roots.push(n);
    });
    return roots;
  }, [treeList]);

  const handleSelectNode = (keys: React.Key[], info: { node: DataNode }) => {
    setSelectedKeys(keys);
    retrieveTabpage(keys.length > 0 ? [(info.node as unknown as { raw: AstClassTree }).raw] : []);
  };

  // 트리 아이콘: 하위가 없으면 목록, 있으면 폴더(AS-IS leafIcon·nodeCloseIcon)
  const renderIcon = (props: { isLeaf?: boolean }) => (props.isLeaf ? <UnorderedListOutlined /> : <FolderOutlined />);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={500} min={300} max={1000}>
          {/* border-box: 테두리가 높이 100%에 더해져 패널보다 커지면 스크롤바가 2개 생긴다 */}
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ minHeight: 50, display: 'flex', alignItems: 'center', gap: 8, padding: 8, flex: 'none', boxSizing: 'border-box' }}>
              <Typography.Text strong style={{ flex: 'none' }}>검색</Typography.Text>
              {/* [E2] docSearch.KeyPress [Enter] */}
              <Input style={{ width: 150, flex: 'none' }} allowClear value={docSearch} onChange={(e) => setDocSearch(e.target.value)} onPressEnter={search} />
              {/* [E1] retrieveButton[찾기].Select */}
              <Button type="search" onClick={retrieve}>찾기</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 8px 8px' }}>
              <Spin spinning={loading}>
                <Tree
                  treeData={treeData}
                  showIcon
                  icon={renderIcon}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  onSelect={handleSelectNode}
                />
              </Spin>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', paddingLeft: 8 }}>
            <Ast02_Grid_Detail
              ref={detailRef}
              onNodeSaved={(saved) => setTreeList((prev) => prev.map((t) => (t.classTreeId === saved.classTreeId ? { ...t, ...saved } : t)))}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default Ast01_Tab_InfoIntrinsic;
