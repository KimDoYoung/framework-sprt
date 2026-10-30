/**
 * 자산분류/종목 상위분류 이동 팝업 (R08)
 * AS-IS: myApp/client/vi/ast/Ast01_Move_ClassTree.java (231줄)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Spin, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  classTreeId: number | null;
  /** 보여 줄 트리의 자산구분 (1:고유자산/2:운용자산) */
  assetType?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const Ast01_Move_ClassTree: React.FC<Props> = ({ open, classTreeId, assetType = '2', onClose, onSuccess }) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // [E0] 화면 열림 (생성자 L95-116) → show()
  useEffect(() => {
    if (open) {
      loadTree();
      setSelectedParentId(null);
      setSearchText('');
    }
  }, [open]);

  const loadTree = async () => {
    setLoading(true);
    try {
      const list = await astApi.searchClassTree({ typeCode: 'IC', assetType });
      const nodes = buildTreeNodes(list);
      setTreeData(nodes);
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const buildTreeNodes = (items: AstClassTree[]): DataNode[] => {
    const map = new Map<number, DataNode>();
    const roots: DataNode[] = [];

    items.forEach((item) => {
      map.set(item.classTreeId, {
        key: String(item.classTreeId),
        title: item.classTreeName,
        children: [],
      });
    });

    items.forEach((item) => {
      const node = map.get(item.classTreeId);
      if (!node) return;
      if (item.parentTreeId && map.has(item.parentTreeId)) {
        map.get(item.parentTreeId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // [E1] docSearch.KeyPress [Enter] (L62) → search()
  // [E2] searchButton[찾기].Select (L70) → search()
  const search = () => {
    // 트리 검색 (검색어에 따른 필터 또는 포커스)
  };

  // [E3] updateButton[확인].Select (L81) → update()
  const update = async () => {
    if (!classTreeId || selectedParentId == null) {
      message.warning('이동할 상위분류를 선택하세요.');
      return;
    }
    try {
      await astApi.moveClassTree(classTreeId, selectedParentId);
      message.success('상위분류가 변경되었습니다.');
      onSuccess();
      onClose();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E4] cancleButton[닫기].Select (L87) → hide()
  const hide = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      title="상위분류 이동"
      onCancel={hide}
      width={480}
      footer={[
        <Button key="confirm" type="save" onClick={update}>
          확인
        </Button>,
        <Button key="close" type="close" onClick={hide}>
          닫기
        </Button>,
      ]}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {/* [E1] docSearch.KeyPress [Enter] */}
        <Input
          placeholder="검색어 입력"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={search}
          style={{ width: 200 }}
        />
        {/* [E2] searchButton[찾기].Select */}
        <Button type="search" onClick={search}>
          찾기
        </Button>
      </div>

      <div style={{ height: 320, overflow: 'auto', border: '1px solid #d9d9d9', padding: 8 }}>
        <Spin spinning={loading}>
          <Tree
            treeData={treeData}
            onSelect={(keys) => {
              if (keys.length > 0) {
                setSelectedParentId(Number(keys[0]));
              } else {
                setSelectedParentId(null);
              }
            }}
          />
        </Spin>
      </div>
    </Modal>
  );
};
