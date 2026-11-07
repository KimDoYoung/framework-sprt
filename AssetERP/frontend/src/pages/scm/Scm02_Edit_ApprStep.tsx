/**
 * 결재선 설정 창 (EE15) — Scm02_Grid_ApprStep.open()이 연다. 저장은 하지 않는다: [확인]을 누르면 부른 쪽 결재선만 바뀌고, 의뢰 [저장]·[결재요청] 때 같이 간다.
 * AS-IS: myApp/client/vi/scm/Scm02_Edit_ApprStep.java (322줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-141: 모달 960×600 "결재선 설정", 왼쪽 240 조직 트리 / 가운데 "결재자 조회" 그리드(부서명 200·직책 80·성명 80·결재·합의·참조 80) 220 +
 *   "결재선 등록" 그리드(구분 40·부서명 200·직책 80·성명 80·위로·아래로·삭제 70) 220, 아래 가운데 [확인][닫기]
 * 03 원칙 17: 추가는 항상 맨 아래. 아이콘 열은 행을 선택하지 않으므로(11 §1) 누른 행으로 처리한다.
 * Apr04_Edit_ApprStep(전자결재 결재선 창)과 같은 모양이지만 검색칸·[최근결재선 불러오기]·[참조등록]·인감·잠금이 없다 — 그쪽을 쓰지 않고 따로 둔다.
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
import { AprStepEmp } from '@/types/apr';
import { OrgCode } from '@/types/org';
import { SrApprStep } from '@/types/scm';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';

const gbEmp = gbFor<AprStepEmp>();
const gbStep = gbFor<SrApprStep>();

/** 새 줄의 임시 번호(음수) — 서버가 저장 때 받는다 */
let tempId = 0;
export const newStepId = () => --tempId;

/** getSeq L307-313: 10, 20, 30 … (문자열) */
export const renumber = (rows: SrApprStep[]): SrApprStep[] => rows.map((r, i) => ({ ...r, seq: String((i + 1) * 10) }));

/** insertApprovalEmp(stepTypeCode, emp) L219-273의 줄 만들기. 상신 '00' 결재 '10' 합의 '20' 참조 '30' */
export const makeStep = (stepTypeCode: string, srId: number | null, emp: AprStepEmp): SrApprStep => {
  const base = {
    srApprStepId: newStepId(),
    srId,
    stepEmpId: emp.personId,
    stepTypeCd: stepTypeCode,
    stepApprName: `${emp.titleName ?? ''} ${emp.empKorName ?? ''}(${emp.orgKorName ?? ''})`,
    orgKorNm: emp.orgKorName,
    titleNm: emp.titleName,
    empKorNm: emp.empKorName,
  };
  switch (stepTypeCode) {
    case '00': return { ...base, stepTypeNm: '상신', stepStatusCd: '10', stepStatusNm: '대기' };
    case '10': return { ...base, stepTypeNm: '결재', stepStatusCd: '10', stepStatusNm: '대기' };
    case '20': return { ...base, stepTypeNm: '합의', stepStatusCd: '10', stepStatusNm: '대기' };
    case '30': return { ...base, stepTypeNm: '참조', stepStatusCd: '30', stepStatusNm: '' };
    default: return { ...base, stepTypeNm: '????' };
  }
};

interface Props {
  open: boolean;
  srId: number | null;
  /** 부른 화면의 결재선(원본: paramApprStepGrid) */
  steps: SrApprStep[];
  /** [확인] — 바뀐 결재선 (AS-IS: paramApprStepGrid를 비우고 이 창의 줄로 채운다) */
  onConfirm: (steps: SrApprStep[]) => void;
  onClose: () => void;
}

/** 전위 순서 + depth(1 = 최상위) 목록 → 트리 */
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

export const Scm02_Edit_ApprStep: React.FC<Props> = ({ open, srId, steps: paramSteps, onConfirm, onClose }) => {
  const [steps, setSteps] = useState<SrApprStep[]>([]);
  const [emps, setEmps] = useState<AprStepEmp[]>([]);
  const [orgs, setOrgs] = useState<OrgCode[]>([]);
  const [orgCodeId, setOrgCodeId] = useState<number | null>(null);
  const stepGridRef = useRef<AgGridReact<SrApprStep>>(null);

  // [E0] 화면 열림 (생성자 L59-141) → 부른 결재선을 이 창 그리드에 담고 buildTree.retrieve(오늘)
  useEffect(() => {
    if (!open) return;
    setSteps(paramSteps.map(s => ({ ...s })));
    setEmps([]);
    setOrgCodeId(null);
    void (async () => {
      try {
        setOrgs(await orgCodeApi.searchOrgCodes(dayjs().format('YYYY-MM-DD')));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const treeData = useMemo(() => toTree(orgs), [orgs]);

  // [E1] orgTree.SelectionChanged [orgCodeModel != null] (L71) → emp.Emp00_TransInfo.selectByOrgCodeId(orgCodeId)
  const selectOrg = async (codeId: number) => {
    setOrgCodeId(codeId);
    try {
      setEmps(await aprStepEditApi.emps('org', { orgCodeId: codeId }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  /** insertApprovalEmp L208-273: 이미 결재선에 있는 사원이면 "결재선 입력이 완료된 사원입니다". 추가 뒤 번호를 다시 매긴다(getSeq) */
  const insertApprovalEmp = (stepTypeCode: string, emp: AprStepEmp) => {
    if (steps.some(s => s.stepEmpId === emp.personId)) {
      message.warning('결재선 입력이 완료된 사원입니다');
      return;
    }
    setSteps(renumber([...steps, makeStep(stepTypeCode, srId, emp)]));
  };

  // changeRow L275-305
  const changeRow = (action: 'up' | 'down' | 'delete', row: SrApprStep) => {
    if (row.stepTypeCd === '00') {
      message.warning('상신자는 수정할 수 없습니다');
      return;
    }
    const idx = steps.findIndex(s => s.srApprStepId === row.srApprStepId);
    const next = [...steps];
    let sel = idx;
    if (action === 'down') {
      if (idx + 1 < next.length) { next.splice(idx, 1); next.splice(idx + 1, 0, row); sel = idx + 1; }
    } else if (action === 'up') {
      if (idx > 1) { next.splice(idx, 1); next.splice(idx - 1, 0, row); sel = idx - 1; }
    } else {
      next.splice(idx, 1);
    }
    setSteps(renumber(next));
    setTimeout(() => stepGridRef.current?.api?.getRowNode(String(row.srApprStepId))?.setSelected(action !== 'delete' && sel >= 0), 0);
  };

  const empCols = useMemo<ColDef<AprStepEmp>[]>(() => [
    gbEmp.text('orgKorName', 200, '부서명'),
    gbEmp.text('titleName', 80, '직책'),
    gbEmp.text('empKorName', 80, '성명'),
    iconCell<AprStepEmp>('add', 'approveAction', 80, '결재', row => insertApprovalEmp('10', row)),
    iconCell<AprStepEmp>('add', 'consentAction', 80, '합의', row => insertApprovalEmp('20', row)),
    iconCell<AprStepEmp>('add', 'referenceAction', 80, '참조', row => insertApprovalEmp('30', row)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [steps]);

  const stepCols = useMemo<ColDef<SrApprStep>[]>(() => [
    gbStep.textCenter('stepTypeNm', 40, '구분'),
    gbStep.text('orgKorNm', 200, '부서명'),
    gbStep.text('titleNm', 80, '직책'),
    gbStep.text('empKorNm', 80, '성명'),
    { colId: 'upAction', headerName: '위로', width: 70, cellRenderer: () => '▲', onCellClicked: p => p.data && changeRow('up', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    { colId: 'downAction', headerName: '아래로', width: 70, cellRenderer: () => '▼', onCellClicked: p => p.data && changeRow('down', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    iconCell<SrApprStep>('delete', 'deleteAction', 70, '삭제', row => changeRow('delete', row)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [steps]);

  const labelStyle: React.CSSProperties = { fontWeight: 'bold', fontSize: 12 };

  return (
    <LookupModal
      open={open}
      title="결재선 설정"
      width={960}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] confirmButton[확인].Select (L115): 부른 결재선을 비우고 이 창의 줄로 채운 뒤 닫는다 */}
            <Button type="save" onClick={() => { onConfirm(steps); onClose(); }}>확인</Button>
            {/* [E3] closeButton[닫기].Select (L125) */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'min(500px, calc(100vh - 220px))', display: 'flex', gap: 12 }}>
        {/* west 240: 조직 트리 */}
        <div style={{ width: 240, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 4, padding: 4, boxSizing: 'border-box' }}>
          <Tree
            treeData={treeData}
            defaultExpandAll
            key={orgs.length}
            selectedKeys={orgCodeId != null ? [orgCodeId] : []}
            onSelect={keys => { if (keys.length) void selectOrg(Number(keys[0])); }}
          />
        </div>
        {/* center: 결재자 조회 / 결재선 등록 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div style={labelStyle}>결재자 조회</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<AprStepEmp> rowData={emps} columnDefs={empCols} getRowId={p => String(p.data.personId)} />
          </div>
          <div style={labelStyle}>결재선 등록</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<SrApprStep>
              gridRef={stepGridRef}
              rowData={steps}
              columnDefs={stepCols}
              getRowId={p => String(p.data.srApprStepId)}
            />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
