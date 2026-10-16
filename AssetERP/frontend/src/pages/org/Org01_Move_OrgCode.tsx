/**
 * 상위조직 선택 팝업 (C02) — Org01_Edit_OrgCode·Org02_Edit_Info의 [상위조직변경]에서 연다.
 * AS-IS: myApp/client/vi/org/Org01_Move_OrgCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 원본은 그리드가 아닌 GXT Tree(조직명) → antd Tree
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Modal, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';

interface Props {
  /** open(baseDate, callback) L46-78 — 값이 있으면 열린다 */
  baseDate?: string | null;
  /** callback.execute(parentCodeModel) */
  onSelect: (org: OrgCode) => void;
  onClose: () => void;
}

/** getServiceResult L113-128 + addChild L101-110: 서버의 전위 순서 목록을 깊이(TreeUtil.makeOrgTree)로 트리로 */
const toTree = (list: OrgCode[]): DataNode[] => {
  const roots: DataNode[] = [];
  const stack: { depth: number; node: DataNode }[] = [];
  list.forEach(r => {
    const node: DataNode = { key: r.codeId, title: r.korNm ?? '', children: [] };
    const depth = r.depth ?? 1;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (stack.length) stack[stack.length - 1].node.children!.push(node);
    else roots.push(node);
    stack.push({ depth, node });
  });
  return roots;
};

export const Org01_Move_OrgCode: React.FC<Props> = ({ baseDate, onSelect, onClose }) => {
  const [rows, setRows] = useState<OrgCode[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // retrieve() L81-87: 서비스 org.Org01_Code.selectByCompanyId(기준일) → orgCodeTree.expandAll()
  useEffect(() => {
    if (!baseDate) return;
    setSelected(null);
    orgCodeApi.searchOrgCodes(baseDate)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
  }, [baseDate]);

  // [E1] oKButton[확인].Select (L59) → update() L89-99
  const update = () => {
    const parentCodeModel = rows.find(r => r.codeId === selected);
    if (!parentCodeModel) {
      message.warning('먼저 이동할 상위부서를 선택해주세요');
      return;
    }
    onSelect(parentCodeModel);
    onClose();
  };

  return (
    <Modal
      open={!!baseDate}
      title="이동시킬 상위조직을 선택하세요."
      width={400}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E2] cancelButton[취소].Select (L67) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 450, overflow: 'auto' }}>
        {treeData.length > 0 && (
          <Tree
            treeData={treeData}
            defaultExpandAll
            selectedKeys={selected == null ? [] : [selected]}
            onSelect={keys => setSelected(keys.length ? Number(keys[0]) : null)}
          />
        )}
      </div>
    </Modal>
  );
};
