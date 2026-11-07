/**
 * 결재선 수정 창 (V08) — 결재중인 문서에서 내 차례인 결재자가 뒤쪽 결재선에 사람을 더하거나(내가 넣은 줄은 지우거나) 순서를 바꾼다. [저장]하면 바로 문서에 반영된다.
 * AS-IS: myApp/client/vi/apr/Apr04_Edit_RetouchApprStep.java (429줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-149: 960×600 모달 "결재선 수정", 왼쪽 240 조직 트리(검색 없음) / 가운데 "결재자 조회" 220 + "결재선 등록" 220, 푸터 [저장][닫기]
 *   결재선 그리드 buildApprStepGrid L186-219: 구분 100(가운데)·결재일 100·직책 100·성명 100(가운데)·위로·아래로·삭제 70
 * changeRow L363-411: 상신자는 수정 불가("상신자는 수정할 수 없습니다"), 결재일이 있는 줄은 수정 불가("이미 결재한 사원은 수정할 수 없습니다"), 삭제는 잠금(lockYn)이거나 내가 넣은 줄이 아니면 불가("해당 결재선은 삭제불가능합니다")
 * update() L221-251: "결재선 수정완료 후 변경된 문서상세 팝업창이 다시 실행됩니다" → apr.Apr04_ApprStep.updateList → 성공이면 callback + 닫기(문서상세를 다시 연다), 실패는 "저장에 실패했습니다. 관리자에게 문의하세요"
 * ApprStep 창과 겹치는 부분(조직 트리·사원 조회·줄 만들기)이 두 번째로 쓰인 것 — 세 번째가 되면 공통 부품으로 뽑을 후보. 03 원칙 17: 사원은 항상 맨 아래에 넣는다. 아이콘은 누른 줄로 처리(이상한점 #21).
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ColDef } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { aprStepEditApi } from '@/api/apr';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { AprApprStep, AprStepEmp } from '@/types/apr';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { renumber } from './Apr04_Edit_ApprStep';

const gbEmp = gbFor<AprStepEmp>();
const gbStep = gbFor<AprApprStep>();

interface Props {
  open: boolean;
  apprId: number;
  /** 문서의 지금 결재선(원본: paramApprStepGrid) */
  steps: AprApprStep[];
  /** 저장이 끝난 뒤 (AS-IS callback.execute() → 문서상세를 닫고 다시 연다) */
  onSaved: () => void;
  onClose: () => void;
}

const toTree = (list: OrgCode[]): DataNode[] => {
  const roots: DataNode[] = [];
  const stack: { depth: number; node: DataNode }[] = [];
  for (const o of list) {
    const node: DataNode = { key: o.codeId, title: o.korNm ?? '', children: [] };
    const depth = o.depth ?? 1;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (stack.length) stack[stack.length - 1].node.children!.push(node); else roots.push(node);
    stack.push({ depth, node });
  }
  return roots;
};

export const Apr04_Edit_RetouchApprStep: React.FC<Props> = ({ open, apprId, steps: paramSteps, onSaved, onClose }) => {
  const user = useLoginUser().userId; // 삭제는 내가 넣은 줄만
  const [steps, setSteps] = useState<AprApprStep[]>([]);
  const [deleted, setDeleted] = useState<AprApprStep[]>([]);
  const [emps, setEmps] = useState<AprStepEmp[]>([]);
  const [orgs, setOrgs] = useState<OrgCode[]>([]);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const stepGridRef = useRef<AgGridReact<AprApprStep>>(null);

  // [E0] 화면 열림 (생성자 L64-149): deleteList.clear(), 결재선 복사, buildTree.retrieve(오늘)
  useEffect(() => {
    if (!open) return;
    setSteps(paramSteps.map(s => ({ ...s })));
    setDeleted([]);
    setEmps([]);
    setOrgId(null);
    void (async () => {
      try { setOrgs(await orgCodeApi.searchOrgCodes(dayjs().format('YYYY-MM-DD'))); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const treeData = useMemo(() => toTree(orgs), [orgs]);

  // [E1] orgTree.SelectionChanged (L80) → emp.Emp00_TransInfo.selectByOrgCodeId
  const selectOrg = async (codeId: number) => {
    setOrgId(codeId);
    try { setEmps(await aprStepEditApi.emps('org', { orgCodeId: codeId })); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  };

  // insertApprovalEmp L266-361: 이미 있는 사원이면 "결재선 입력이 완료된 사원입니다". 새 줄은 내가 넣은 줄(addEmpId)
  const insertApprovalEmp = async (stepTypeCode: string, e: AprStepEmp) => {
    if (steps.some(s => s.stepEmpId === e.personId && s.stepTypeCode !== '40')) {
      message.warning('결재선 입력이 완료된 사원입니다');
      return;
    }
    try {
      const lines = await aprStepEditApi.lines(stepTypeCode, [{ personId: e.personId, orgCodeId: e.orgCodeId }]);
      setSteps(prev => renumber([...prev, ...lines.map(l => ({ ...l, addEmpId: user }))]));
    } catch (err) {
      message.error(errorMessage(err, '결재선 만들기 실패'));
    }
  };

  // changeRow L363-411
  const changeRow = (action: 'up' | 'down' | 'delete', row: AprApprStep) => {
    if (row.stepTypeCode === '00') { message.warning('상신자는 수정할 수 없습니다'); return; }
    if (row.apprDate) { message.warning('이미 결재한 사원은 수정할 수 없습니다'); return; }
    const idx = steps.findIndex(s => s.apprStepId === row.apprStepId);
    const next = [...steps];
    if (action === 'down') {
      if (idx + 1 < next.length) { next.splice(idx, 1); next.splice(idx + 1, 0, row); }
    } else if (action === 'up') {
      if (idx > 1) { next.splice(idx, 1); next.splice(idx - 1, 0, row); }
    } else {
      if (row.lockYn || user !== row.addEmpId) { message.warning('해당 결재선은 삭제불가능합니다'); return; }
      setDeleted(prev => [...prev, row]);
      next.splice(idx, 1);
    }
    setSteps(renumber(next));
    setTimeout(() => stepGridRef.current?.api?.getRowNode(String(row.apprStepId))?.setSelected(action !== 'delete'), 0);
  };

  // [E2] confirmButton[저장].Select (L125) → update() L221-251
  const update = async () => {
    setSaving(true);
    message.info('결재선 수정완료 후 변경된 문서상세 팝업창이 다시 실행됩니다', 5);
    try {
      const res = await aprStepEditApi.retouch(
        apprId,
        steps.map(s => ({ apprStepId: s.apprStepId, stepTypeCode: s.stepTypeCode, seq: s.seq ?? '001', stepStatusCode: s.stepStatusCode ?? null, stepEmpId: s.stepEmpId, lockYn: s.lockYn ? 'true' : 'false', addEmpId: null })),
        deleted.map(d => d.apprStepId),
      );
      if (res.ok) { onSaved(); onClose(); return; }
      message.warning(res.message || '저장에 실패했습니다. 관리자에게 문의하세요');
    } catch (err) {
      message.error(errorMessage(err, '저장에 실패했습니다. 관리자에게 문의하세요'));
    } finally {
      setSaving(false);
    }
  };

  const empCols = useMemo<ColDef<AprStepEmp>[]>(() => [
    gbEmp.text('orgKorName', 200, '부서명'),
    gbEmp.text('titleName2', 80, '직책'),
    gbEmp.text('empKorName', 80, '성명'),
    iconCell<AprStepEmp>('add', 'approveAction', 80, '결재', row => void insertApprovalEmp('10', row)),
    iconCell<AprStepEmp>('add', 'consentAction', 80, '합의', row => void insertApprovalEmp('20', row)),
    iconCell<AprStepEmp>('add', 'referenceAction', 80, '참조', row => void insertApprovalEmp('30', row)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [steps]);

  const stepCols = useMemo<ColDef<AprApprStep>[]>(() => [
    gbStep.textCenter('stepTypeName', 100, '구분'),
    gbStep.date('apprDate', 100, '결재일'),
    gbStep.text('titleName', 100, '직책'),
    gbStep.textCenter('empKorName', 100, '성명'),
    { colId: 'upAction', headerName: '위로', width: 70, cellRenderer: () => '▲', onCellClicked: p => p.data && changeRow('up', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    { colId: 'downAction', headerName: '아래로', width: 70, cellRenderer: () => '▼', onCellClicked: p => p.data && changeRow('down', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    iconCell<AprApprStep>('delete', 'deleteAction', 70, '삭제', row => changeRow('delete', row)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [steps]);

  const labelStyle: React.CSSProperties = { fontWeight: 'bold', fontSize: 12 };

  return (
    <LookupModal
      open={open}
      title="결재선 수정"
      width={960}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <Space>
          <Button type="save" loading={saving} onClick={update}>저장</Button>
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      }
    >
      <div style={{ height: 'min(500px, calc(100vh - 220px))', display: 'flex', gap: 12 }}>
        <div style={{ width: 240, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 4, padding: 4, boxSizing: 'border-box' }}>
          <Tree
            treeData={treeData}
            defaultExpandAll
            key={orgs.length}
            selectedKeys={orgId != null ? [orgId] : []}
            onSelect={keys => { if (keys.length) void selectOrg(Number(keys[0])); }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div style={labelStyle}>결재자 조회</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<AprStepEmp> rowData={emps} columnDefs={empCols} getRowId={p => String(p.data.personId)} />
          </div>
          <div style={labelStyle}>결재선 등록</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<AprApprStep> gridRef={stepGridRef} rowData={steps} columnDefs={stepCols} getRowId={p => String(p.data.apprStepId)} />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
