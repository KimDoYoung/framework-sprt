/**
 * 결재선 설정 창 (V07) — 조직도·사원 조회에서 결재/합의/참조를 골라 결재선을 만든다. 저장은 하지 않는다: [확인]을 누르면 부른 쪽(Apr03_Page_Relate)의 결재선만 바뀌고, 문서 저장 때 같이 간다.
 * AS-IS: myApp/client/vi/apr/Apr04_Edit_ApprStep.java (729줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L107-304: 960×600 모달 "결재선 설정", 왼쪽 240 조직 트리 + 아래 검색(사원명/조직명/사원번호) / 가운데 "결재자 조회" 그리드(부서명 200·직책 80·성명 80·결재·합의·참조 80) 220 +
 *   "결재선 등록" 줄([최근결재선 불러오기] 135·[참조등록] 105) + 결재선 그리드(구분 40·부서명 200·직책 80·성명 80·위로·아래로·삭제 70) 220, 푸터 가운데 [확인][닫기]
 * 12 원칙: 머리 아래 선·푸터 위 선(LookupModal), 스크롤은 그리드·트리 하나씩. 03 원칙 17: 추가는 항상 맨 아래(원본 GridInsertRow는 선택 행 아래).
 * 아이콘 열은 행을 선택하지 않으므로(11 §1) AS-IS가 "선택한 행"으로 처리하던 결재/합의/참조·위로/아래로/삭제는 누른 행으로 처리한다.
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ColDef } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { aprStepEditApi } from '@/api/apr';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { AprApprStep, AprNewStep, AprStepEmp } from '@/types/apr';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Apr01_Lookup_ApprList } from './Apr01_Lookup_ApprList';

const gbEmp = gbFor<AprStepEmp>();
const gbStep = gbFor<AprApprStep>();

/** getSeq L709-716: 위에서부터 001, 002 … */
export const renumber = (rows: AprApprStep[]): AprApprStep[] => rows.map((r, i) => ({ ...r, seq: String(i + 1).padStart(3, '0') }));

interface Props {
  open: boolean;
  /** 부른 화면의 결재선(원본: paramApprStepGrid) */
  steps: AprApprStep[];
  /** [확인] — 바뀐 결재선 (AS-IS: paramApprStepGrid를 비우고 이 창의 줄로 채운다) */
  onConfirm: (steps: AprApprStep[]) => void;
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

export const Apr04_Edit_ApprStep: React.FC<Props> = ({ open, steps: paramSteps, onConfirm, onClose }) => {
  const [steps, setSteps] = useState<AprApprStep[]>([]);
  const [emps, setEmps] = useState<AprStepEmp[]>([]);
  const [orgs, setOrgs] = useState<OrgCode[]>([]);
  const [org, setOrg] = useState<OrgCode | null>(null);
  const [searchText, setSearchText] = useState('');
  const [locked, setLocked] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const includeRef = useRef(false);
  const stepGridRef = useRef<AgGridReact<AprApprStep>>(null);

  // [E0] 화면 열림 (생성자 L107-304) → buildTree.retrieve(오늘), apprStepLockYnChk() L306-320 (selectObseverOfficer는 값을 쓰지 않는다)
  useEffect(() => {
    if (!open) return;
    setSteps(paramSteps.map(s => ({ ...s })));
    setEmps([]);
    setOrg(null);
    setSearchText('');
    void (async () => {
      try {
        const [list, lock] = await Promise.all([orgCodeApi.searchOrgCodes(dayjs().format('YYYY-MM-DD')), aprStepEditApi.locked()]);
        setOrgs(list);
        setLocked(lock);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const treeData = useMemo(() => toTree(orgs), [orgs]);

  // [E1] orgTree.SelectionChanged (L120) → emp.Emp00_TransInfo.selectByOrgCodeId(orgCodeId, companyId)
  const selectOrg = async (codeId: number) => {
    const o = orgs.find(x => x.codeId === codeId) ?? null;
    setOrg(o);
    if (!o) return;
    try {
      setEmps(await aprStepEditApi.emps('org', { orgCodeId: o.codeId }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] searchField.KeyPress [Enter] (L134) · [E9] searchButton[검색].Select (L283) → retrieveTransInfo() L395-404: 재직(100) 사원, 검색어 '%…%'
  const retrieveTransInfo = async () => {
    try {
      setEmps(await aprStepEditApi.emps('text', { searchText }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  /** 줄 만들기(insertApprovalEmp L419-514) 뒤 맨 아래에 붙이고 번호를 다시 매긴다. 이미 있는 사원이면 "결재선 입력이 완료된 사원입니다" */
  const insertApprovalEmp = async (stepTypeCode: string, rows: AprStepEmp[]) => {
    let current = steps;
    const add: AprStepEmp[] = [];
    for (const e of rows) {
      if (current.some(s => s.stepEmpId === e.personId && s.stepTypeCode !== '40') || add.some(a => a.personId === e.personId)) {
        message.warning('결재선 입력이 완료된 사원입니다');
        break;
      }
      add.push(e);
    }
    if (!add.length) return;
    try {
      const lines = await aprStepEditApi.lines(stepTypeCode, add.map(e => ({ personId: e.personId, orgCodeId: e.orgCodeId })));
      current = renumber([...current, ...lines]);
      setSteps(current);
    } catch (err) {
      message.error(errorMessage(err, '결재선 만들기 실패'));
    }
  };

  // changeRow L516-562
  const changeRow = (action: 'up' | 'down' | 'delete', row: AprApprStep) => {
    if (row.stepTypeCode === '00') {
      message.warning('상신자는 수정할 수 없습니다');
      return;
    }
    const idx = steps.findIndex(s => s.apprStepId === row.apprStepId);
    const next = [...steps];
    let sel = idx;
    if (action === 'down') {
      if (idx + 1 < next.length) { next.splice(idx, 1); next.splice(idx + 1, 0, row); sel = idx + 1; }
    } else if (action === 'up') {
      if (idx > 1) { next.splice(idx, 1); next.splice(idx - 1, 0, row); sel = idx - 1; }
    } else {
      if (row.lockYn) {
        message.warning('해당 결재선은 삭제불가능합니다');
        return;
      }
      next.splice(idx, 1);
    }
    setSteps(renumber(next));
    setTimeout(() => stepGridRef.current?.api?.getRowNode(String(row.apprStepId))?.setSelected(action !== 'delete' && sel >= 0), 0);
  };

  /** 결재선에 없는 사원만 참조로 넣는다 (allReference L627-665 · orgReference L667-707) */
  const addReferences = async (rows: AprStepEmp[]) => {
    const targets = rows.filter(e => !steps.some(s => s.stepEmpId === e.personId));
    if (!targets.length) return;
    try {
      const lines = await aprStepEditApi.lines('30', targets.map(e => ({ personId: e.personId, orgCodeId: e.orgCodeId })));
      setSteps(prev => renumber([...prev, ...lines.filter(l => !prev.some(s => s.stepEmpId === l.stepEmpId))]));
    } catch (err) {
      message.error(errorMessage(err, '참조 등록 실패'));
    }
  };

  // [E4] reference.Click (L187): 조직을 안 골랐거나 최상위면 전 사원, 아니면 그 조직(하위부서 포함 선택)
  const reference = () => {
    if (!org || (org.depth ?? 1) === 1) {
      Modal.confirm({
        title: '확인', content: '전 사원을 참조로 등록하시겠습니까? (결재선에 존재하는 사원제외)', width: 500, okText: '예', cancelText: '아니오',
        onOk: async () => addReferences(await aprStepEditApi.emps('all')),
      });
      return;
    }
    includeRef.current = false;
    Modal.confirm({
      title: '확인', width: 620, okText: '예', cancelText: '아니오',
      content: (
        <div>
          <div>{org.korNm}의 전 사원을 참조로 등록하시겠습니까? (결재선에 존재하는 사원제외)</div>
          <Checkbox style={{ marginTop: 12 }} onChange={e => { includeRef.current = e.target.checked; }}>하위부서 포함</Checkbox>
        </div>
      ),
      onOk: async () => addReferences(await aprStepEditApi.emps('orgDown', { orgCodeId: org.codeId, includeYn: includeRef.current })),
    });
  };

  // [E3] recentLoad.Click (L165): 인감(40)이 있으면 쓸 수 없다. 아니면 최근 결재선 조회창(Apr01_Lookup_ApprList, V08)
  const recentLoad = () => {
    if (steps.some(s => s.stepTypeCode === '40')) {
      message.warning('인감이 설정된 결재선은 불러오기 기능을 사용할 수 없습니다');
      return;
    }
    setRecentOpen(true);
  };

  // recentLoad(list) L582-595 · processNextApprovalEmp L598-625: 상신자 줄만 남기고 고른 문서의 줄을 차례로 넣는다(이미 있는 사원은 건너뛴다)
  const applyRecent = (lines: AprNewStep[]) => {
    setRecentOpen(false);
    setSteps(prev => {
      const out: AprApprStep[] = prev.filter(s => s.stepTypeCode === '00').slice(-1);
      for (const l of lines) {
        if (out.some(s => s.stepEmpId === l.stepEmpId && s.stepTypeCode !== '40')) continue;
        out.push(l);
      }
      return renumber(out);
    });
  };

  const empCols = useMemo<ColDef<AprStepEmp>[]>(() => [
    gbEmp.text('orgKorName', 200, '부서명'),
    gbEmp.text('titleName2', 80, '직책'),
    gbEmp.text('empKorName', 80, '성명'),
    iconCell<AprStepEmp>('add', 'approveAction', 80, '결재', row => void insertApprovalEmp('10', [row])),
    iconCell<AprStepEmp>('add', 'consentAction', 80, '합의', row => void insertApprovalEmp('20', [row])),
    iconCell<AprStepEmp>('add', 'referenceAction', 80, '참조', row => void insertApprovalEmp('30', [row])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [steps]);

  const stepCols = useMemo<ColDef<AprApprStep>[]>(() => [
    gbStep.textCenter('stepTypeName', 40, '구분'),
    gbStep.text('orgKorName', 200, '부서명'),
    gbStep.text('titleName', 80, '직책'),
    gbStep.text('empKorName', 80, '성명'),
    { colId: 'upAction', headerName: '위로', width: 70, cellRenderer: () => '▲', onCellClicked: p => p.data && changeRow('up', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    { colId: 'downAction', headerName: '아래로', width: 70, cellRenderer: () => '▼', onCellClicked: p => p.data && changeRow('down', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    iconCell<AprApprStep>('delete', 'deleteAction', 70, '삭제', row => changeRow('delete', row)),
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
        <Space>
          {/* [E7] confirmButton[확인].Select (L267): 부른 결재선을 비우고 이 창의 줄로 채운 뒤 닫는다 */}
          <Button type="save" onClick={() => { onConfirm(steps); onClose(); }}>확인</Button>
          {/* [E8] closeButton[닫기].Select (L277) */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      }
    >
      <div style={{ height: 'min(500px, calc(100vh - 220px))', display: 'flex', gap: 12 }}>
        {/* west 240: 조직 트리 + 검색 */}
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 4, padding: 4, boxSizing: 'border-box' }}>
            <Tree
              treeData={treeData}
              defaultExpandAll
              key={orgs.length}
              selectedKeys={org ? [org.codeId] : []}
              onSelect={keys => { if (keys.length) void selectOrg(Number(keys[0])); }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Input
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onPressEnter={() => void retrieveTransInfo()}
              placeholder="사원명/조직명/사원번호"
              allowClear
              style={{ width: 150 }}
            />
            <Button type="search" onClick={retrieveTransInfo}>검색</Button>
          </div>
        </div>
        {/* center: 결재자 조회 / 결재선 등록 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div style={labelStyle}>결재자 조회</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<AprStepEmp> rowData={emps} columnDefs={empCols} getRowId={p => String(p.data.personId)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ ...labelStyle, flex: 1 }}>결재선 등록</span>
            {!locked && <Button type="select" onClick={recentLoad}>최근결재선 불러오기</Button>}
            <Button type="register" onClick={reference}>참조등록</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<AprApprStep>
              gridRef={stepGridRef}
              rowData={steps}
              columnDefs={stepCols}
              getRowId={p => String(p.data.apprStepId)}
            />
          </div>
        </div>
      </div>
      <Apr01_Lookup_ApprList open={recentOpen} onResult={applyRecent} onClose={() => setRecentOpen(false)} />
    </LookupModal>
  );
};
