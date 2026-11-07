/**
 * 문서구분 찾기 창 (EE88) — AS-IS는 Pln03_Lookup_ResrchDetail(기획 리서치 상세, 미변환 41번)이 연다
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_ClassTree.java (157줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L39-83: 500×500 모달 "문서구분찾기", 위 [조회], 문서분류 트리, 아래 가운데 [확인][취소]. 열 때 retrieve() L131-140
 * 트리는 리서치용(selectByParentIdResrchYn): 조직·사원 조회권한이 있는 분류 중 아래에 리서치사용 분류가 남은 것
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space, Tree } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrResearchTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { toTree } from './dcr01Tree';

interface Props {
  open: boolean;
  /** [확인]의 callback.execute(classTreeModel) — 고른 분류(고른 것이 없으면 null, AS-IS도 그대로 callback) */
  onResult: (row: DcrResearchTree | null) => void;
  onClose: () => void;
}

export const Dcr01_Lookup_ClassTree: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [rows, setRows] = useState<DcrResearchTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // retrieve() L131-151 — dcr.Dcr01_ClassTree.selectByParentIdResrchYn
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await dcrApi.searchResearchTree());
      setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 열림 (open L39-83) → show(), retrieve()
  useEffect(() => { if (open) void retrieve(); }, [open]);

  // [E2] okButton[확인].Select (L62) → callback(classTreeModel), hide()
  const ok = () => {
    onResult(rows.find(r => r.classTreeId === selected) ?? null);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="문서구분찾기"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={ok}>확인</Button>
            {/* [E3] cancelButton[취소].Select (L72) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 380 }}>
        {/* [E1] retrieveButton[조회].Select (L48) → retrieve() */}
        <div><Button type="search" loading={loading} onClick={() => void retrieve()}>조회</Button></div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9' }}>
          <Tree
            treeData={treeData}
            selectedKeys={selected == null ? [] : [selected]}
            onSelect={(keys, info) => setSelected(keys.length ? Number(keys[0]) : Number(info.node.key))}
          />
        </div>
      </div>
    </LookupModal>
  );
};
