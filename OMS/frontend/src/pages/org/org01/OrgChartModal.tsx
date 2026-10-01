import React, { useMemo } from 'react';
import { Modal, Tree, Typography } from 'antd';
import { OrgCode } from '../../../types/org';
import { toOrgTree } from './OrgParentModal';

/** 조직도보기 (AS-IS Org02_View_Chart 대체: 기준일 조직 트리 + 조직 장) */
export const OrgChartModal: React.FC<{ open: boolean; orgs: OrgCode[]; baseDate: string; onClose: () => void }> = ({ open, orgs, baseDate, onClose }) => {
  const treeData = useMemo(() => toOrgTree(orgs, o => (
    <span>{o.korNm} {o.orgHeadList && <Typography.Text type="secondary">({o.orgHeadList})</Typography.Text>}</span>
  )), [orgs]);

  return (
    <Modal open={open} title={`조직도 (${baseDate})`} width={600} onCancel={onClose} footer={null}>
      <div style={{ height: 520, overflow: 'auto' }}>
        <Tree treeData={treeData} defaultExpandAll showLine selectable={false} />
      </div>
    </Modal>
  );
};
