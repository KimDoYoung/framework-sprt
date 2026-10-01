import React, { useMemo, useState } from 'react';
import { Modal, Tree, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { OrgCode } from '../../../types/org';

/** 깊이 우선 평평한 조직 목록 → antd Tree 데이터 */
export const toOrgTree = (orgs: OrgCode[], title: (o: OrgCode) => React.ReactNode = o => o.korNm, excludeId?: number): DataNode[] => {
  const byParent = new Map<number, OrgCode[]>();
  orgs.forEach(o => byParent.set(o.parentCodeId, [...(byParent.get(o.parentCodeId) ?? []), o]));
  const ids = new Set(orgs.map(o => o.codeId));
  const build = (parentId: number): DataNode[] =>
    (byParent.get(parentId) ?? [])
      .filter(o => o.codeId !== excludeId)
      .map(o => ({ key: o.codeId, title: title(o), children: build(o.codeId) }));
  // 최상위: 상위가 목록에 없는 조직
  return orgs.filter(o => !ids.has(o.parentCodeId) && o.codeId !== excludeId)
    .map(o => ({ key: o.codeId, title: title(o), children: build(o.codeId) }));
};

interface OrgParentModalProps {
  open: boolean;
  orgs: OrgCode[];
  /** 옮길 조직 (자기 자신 아래는 고를 수 없다) */
  excludeId?: number;
  onCancel: () => void;
  onOk: (parent: OrgCode) => void;
}

/** 상위조직 선택 (AS-IS Org01_Move_OrgCode) */
export const OrgParentModal: React.FC<OrgParentModalProps> = ({ open, orgs, excludeId, onCancel, onOk }) => {
  const [selected, setSelected] = useState<number>();
  const treeData = useMemo(() => toOrgTree(orgs, undefined, excludeId), [orgs, excludeId]);

  const ok = () => {
    const parent = orgs.find(o => o.codeId === selected);
    if (!parent) {
      message.warning('먼저 이동할 상위부서를 선택해주세요');
      return;
    }
    onOk(parent);
  };

  return (
    <Modal open={open} title="이동시킬 상위조직을 선택하세요." width={420} onOk={ok} onCancel={onCancel} okText="확인" cancelText="취소" destroyOnClose
      afterOpenChange={o => !o && setSelected(undefined)}>
      <div style={{ height: 450, overflow: 'auto' }}>
        <Tree treeData={treeData} defaultExpandAll onSelect={keys => setSelected(keys[0] as number | undefined)} />
      </div>
    </Modal>
  );
};
