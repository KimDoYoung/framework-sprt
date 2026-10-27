/**
 * 펀드자산 종목상세 (R09) — 펀드관리 > 80. 펀드자산 > 펀드자산 종목상세 #1118
 * AS-IS: myApp/client/vi/ast/Ast01_Tab_InfoManagement.java (217줄)
 * 페이지 스타일: TG (Tree + Grid 좌우 분할)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Spin, Splitter, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { AstClassTree } from '@/types/ast';
import {
  Ast02_Grid_DetailManagement,
  Ast02GridDetailManagementHandle,
} from './Ast02_Grid_DetailManagement';

export const Ast01_Tab_InfoManagement: React.FC = () => {
  const [docSearch, setDocSearch] = useState('');
  const [treeList, setTreeList] = useState<AstClassTree[]>([]);
  const [selectedNode, setSelectedNode] = useState<AstClassTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const detailRef = useRef<Ast02GridDetailManagementHandle>(null);

  // [E1] retrieveButton[조회].Select (L50) → retrieve()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const data = await astApi.searchClassTree({ typeCode: '%', assetType: '2' });
      setTreeList(data);
      const rootKeys = data
        .filter((d: AstClassTree) => d.parentTreeId === 0)
        .map((d: AstClassTree) => String(d.classTreeId));
      setExpandedKeys(rootKeys);
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L48-101) → retrieve()
  useEffect(() => {
    retrieve();
  }, [retrieve]);

  // [E2] docSearch.KeyPress [Enter] (L57) → search()
  const search = () => {
    const findText = docSearch.trim();
    if (!findText) {
      setExpandedKeys([]);
      setAutoExpandParent(false);
      return;
    }
    const matched = treeList.filter((item) =>
      item.classTreeName.toLowerCase().includes(findText.toLowerCase())
    );
    const keys = matched.map((m) => String(m.classTreeId));
    setExpandedKeys(keys);
    setAutoExpandParent(true);
  };

  // 트리 데이터 구성
  const treeData = useMemo(() => {
    const map = new Map<number, DataNode & { raw: AstClassTree; children: DataNode[] }>();
    treeList.forEach((item) => {
      map.set(item.classTreeId, {
        key: String(item.classTreeId),
        title: item.classTreeName,
        raw: item,
        children: [],
      });
    });

    const roots: DataNode[] = [];
    treeList.forEach((item) => {
      const node = map.get(item.classTreeId);
      if (!node) return;
      if (item.parentTreeId === 0 || !map.has(item.parentTreeId)) {
        roots.push(node);
      } else {
        const parent = map.get(item.parentTreeId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return roots;
  }, [treeList]);

  // [E3] tree.Selection (L68) → retrieveTabpage()
  const handleSelectNode = (selectedKeys: React.Key[], info: { node: DataNode }) => {
    if (selectedKeys.length > 0) {
      const rawNode = (info.node as unknown as { raw: AstClassTree }).raw;
      setSelectedNode(rawNode);
      if (rawNode.typeCode === 'IT') {
        detailRef.current?.loadNode(rawNode);
      } else {
        detailRef.current?.visible();
      }
    } else {
      setSelectedNode(null);
      detailRef.current?.clear();
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: 20,
      }}
    >
      <Splitter style={{ height: '100%' }}>
        {/* 좌측 Tree 영역 (west=vlc) */}
        <Splitter.Panel
          defaultSize={550}
          max={1000}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 10,
            gap: 8,
            border: '1px solid #d9d9d9',
            boxSizing: 'border-box',
          }}
        >
          {/* 툴바 buttonBar: {docSearch} {retrieveButton} */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>검색</span>
            {/* [E2] docSearch.KeyPress [Enter] */}
            <Input
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              onPressEnter={search}
              allowClear
              style={{ width: 150 }}
            />
            {/* [E1] retrieveButton[조회].Select */}
            <Button type="search" onClick={retrieve}>
              조회
            </Button>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Spin spinning={loading}>
              <Tree
                treeData={treeData}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onExpand={(keys) => {
                  setExpandedKeys(keys);
                  setAutoExpandParent(false);
                }}
                onSelect={handleSelectNode}
              />
            </Spin>
          </div>
        </Splitter.Panel>

        {/* 우측 상세 영역 (center=gridDetail) */}
        <Splitter.Panel style={{ paddingLeft: 8, boxSizing: 'border-box' }}>
          <Ast02_Grid_DetailManagement ref={detailRef} currentNode={selectedNode} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default Ast01_Tab_InfoManagement;
