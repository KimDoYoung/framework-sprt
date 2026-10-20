/**
 * 부서 선택 팝업 (G07) — Apr10_Tab_Stamp의 부서 칸 돋보기에서 연다.
 * AS-IS: myApp/client/vi/apr/Apr10_Move_OrgCode.java (157줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * Org01_Move_OrgCode와 같은 틀: 모달 400×550 "부서 선택", 조직 트리(조직명) + [확인][취소]. 제목·미선택 메시지만 다르다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space, Tree } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { DataNode } from 'antd/es/tree';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';

interface Props {
  /** open(baseDate, callback) L45-76 — 값이 있으면 열린다 */
  baseDate?: string | null;
  /** callback.execute(parentCodeModel) */
  onSelect: (org: OrgCode) => void;
  onClose: () => void;
}

/** getServiceResult L111-126 + addChild L99-108: 서버의 전위 순서 목록을 깊이(TreeUtil.makeOrgTree)로 트리로 */
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

export const Apr10_Move_OrgCode: React.FC<Props> = ({ baseDate, onSelect, onClose }) => {
  const [rows, setRows] = useState<OrgCode[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // retrieve() L79-85: 서비스 org.Org01_Code.selectByCompanyId(기준일) → orgCodeTree.expandAll()
  useEffect(() => {
    if (!baseDate) return;
    setSelected(null);
    orgCodeApi.searchOrgCodes(baseDate)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
  }, [baseDate]);

  // [E1] oKButton[확인].Select (L58) → update() L87-97
  const update = () => {
    const parentCodeModel = rows.find(r => r.codeId === selected);
    if (!parentCodeModel) {
      message.warning('이동할 상위부서를 선택해주세요');
      return;
    }
    onSelect(parentCodeModel);
    onClose();
  };

  return (
    <LookupModal
      open={!!baseDate}
      title="부서 선택"
      width={400}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E2] cancelButton[취소].Select (L66) → hide() */}
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
    </LookupModal>
  );
};
