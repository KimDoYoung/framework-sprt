/**
 * 게시판 분류 권한관리 조회창 (Z13) — Bbs30_Lookup_ClassTree 세부항목의 "권한" 아이콘이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs33_Lookup_Role.java (274줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-100: 모달 "권한관리" 500×550, 툴바 [조회][저장][직원추가][부서추가][삭제] + 그리드(buildFileGrid L142-150: 체크 다중, 구분 100(가운데) · 사원명 110(가운데) · 부서명 200), 아래 가운데 [닫기]
 * 연결: Emp00_Lookup_SelectMulti([직원추가]) · Org00_Lookup_SelectMulti([부서추가])
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsClassRole, BbsClassTree } from '@/types/bbs';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';

const gb = gbFor<BbsClassRole>();

interface Props {
  /** 권한을 설정할 세부항목 — 있으면 열린다 (AS-IS open(classTreeModel, callback)) */
  target: BbsClassTree | null;
  /** [닫기] (callback.execute()) — 부르는 쪽이 목록을 다시 읽는다 */
  onClose: () => void;
}

export const Bbs33_Lookup_Role: React.FC<Props> = ({ target, onClose }) => {
  const gridRef = useRef<AgGridReact<BbsClassRole>>(null);
  const tempSeq = useRef(0);
  const [rows, setRows] = useState<BbsClassRole[]>([]);
  const [checked, setChecked] = useState<BbsClassRole[]>([]);
  const [empOpen, setEmpOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const classTreeId = target?.classTreeId;

  // retrieve() L152-161: 서비스 bbs.Bbs33_Role.selectByClassTreeId(classTreeId)
  const retrieve = useCallback(async () => {
    if (classTreeId == null) return;
    try {
      setRows(await bbsBoardApi.searchRoles(classTreeId));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId]);

  // [E0] 열림 (open L64-69) → retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] retrieveButton[조회].Select (L103) → retrieve()
  // [E2] updateButton[저장].Select (L109) → update() L163-173: bbs.Bbs33_Role.update(새 행) 뒤 그리드에 행이 있으면 updatePublicYn(false)
  const update = async () => {
    if (classTreeId == null) return;
    const added = rows.filter(r => r.roleId <= 0);
    if (added.length === 0) return;  // GridUpdate: 바뀐 행이 없으면 보낼 것이 없다
    try {
      await bbsBoardApi.saveRoles(classTreeId, added);
      await bbsBoardApi.updatePublicYn(classTreeId, false);  // L175-187
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // insertRow(roleCode) L189-243 — GridInsertRow: 맨 아래에 넣고(03 원칙 17) 보여 준다
  const addRows = (added: BbsClassRole[]) => {
    if (added.length === 0) return;
    setRows(prev => [...prev, ...added]);
    setTimeout(() => {
      const api = gridRef.current?.api;
      const last = added[added.length - 1];
      const node = api?.getRowNode(String(last.roleId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };
  // [E3] insertButton01[직원추가].Select (L115) → Emp00_Lookup_SelectMulti.open(오늘) → 고른 사원마다 (구분 "사원", 사원 ID·사원명)
  const onEmployees = (list: TransInfo[]) => {
    setEmpOpen(false);
    addRows(list.map(t => ({
      roleId: --tempSeq.current, classTreeId: classTreeId!, roleCd: 'P', roleName: '사원',
      personId: t.personId, personName: t.korNm ?? null, orgCodeId: null, orgName: null,
    })));
  };
  // [E4] insertButton02[부서추가].Select (L121) → Org00_Lookup_SelectMulti.open(오늘) → 고른 조직마다 (구분 "부서", 조직 ID·조직 전체경로)
  const onOrgs = (list: OrgInfo[]) => {
    setOrgOpen(false);
    addRows(list.map(o => ({
      roleId: --tempSeq.current, classTreeId: classTreeId!, roleCd: 'O', roleName: '부서',
      personId: null, personName: null, orgCodeId: o.orgCodeId, orgName: o.parentFullNm ?? null,
    })));
  };

  // [E5] deleteButton[삭제].Select (L127) → deleteChk() L245-263: "n건의 권한을 삭제하시겠습니까?" → [E7] msgBox.DialogHide [YES] (L248) → deleteRow() L265-269: bbs.Bbs33_Role.delete
  const deleteChk = () => {
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 권한을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        if (classTreeId == null || checked.length === 0) return;
        try {
          const saved = checked.filter(r => r.roleId > 0).map(r => r.roleId);
          if (saved.length > 0) await bbsBoardApi.deleteRoles(classTreeId, saved);
          const gone = new Set(checked.map(r => r.roleId));
          setRows(prev => prev.filter(r => !gone.has(r.roleId)));
          setChecked([]);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo(() => [
    gb.textCenter('roleName', 100, '구분'),  // L145
    gb.textCenter('personName', 110, '사원명'),  // L146
    gb.text('orgName', 200, '부서명'),  // L147
  ], []);

  return (
    <LookupModal
      open={target != null}
      title={<b>권한관리</b>}
      width={560}
      style={{ top: 20 }}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E6] closeButton[닫기].Select (L133) → callback.execute(), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 'min(430px, calc(100vh - 250px))' }}>
        <Space wrap>
          <Button type="search" onClick={() => void retrieve()}>조회</Button>
          <Button type="save" onClick={update}>저장</Button>
          <Button type="addRow" onClick={() => setEmpOpen(true)}>직원추가</Button>
          <Button type="addRow" onClick={() => setOrgOpen(true)}>부서추가</Button>
          <Button type="delete" onClick={deleteChk}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BbsClassRole>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.roleId)}
            onCheckedChange={setChecked}
          />
        </div>
      </div>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onEmployees} onClose={() => setEmpOpen(false)} />
      {orgOpen && <Org00_Lookup_SelectMulti baseDate={dayjs().format('YYYY-MM-DD')} onSelect={onOrgs} onClose={() => setOrgOpen(false)} />}
    </LookupModal>
  );
};
