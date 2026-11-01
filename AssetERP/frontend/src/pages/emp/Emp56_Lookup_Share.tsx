/**
 * 공유지정 창 (Y05) — Emp53_Lookup_BizTrip·Emp53_Lookup_BizTripShare의 공유 칸에서 연다
 * AS-IS: myApp/client/vi/emp/Emp56_Lookup_Share.java (339줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-112: 모달 580×450 "공유지정", 위 툴바(◉직원 ◉부서(기본) · [행 추가][행 삭제] · 새로고침 아이콘) + 체크 다중 그리드(구분 70 · 부서 250 · 성명 100),
 *   아래 가운데 [저장][닫기]. open(parentId, callback) L84-93 편집 모드만 만든다(view 모드 L78-82는 이 화면에서 쓰지 않아 다음에).
 * insertRow() L247-255: 직원이면 Emp00_Lookup_SelectMulti(오늘), 부서면 Org00_Lookup_SelectMulti(오늘) → 고른 만큼 행 추가.
 * deleteRow() L319-325: 체크한 행을 목록에서 빼고 deleteList에 모아 [저장] 때 지운다. update() L257-292: 지운 것 → 새 행 순서로 저장, updateEnd() L294-317: 공유명을 callback으로 돌려주고 닫는다.
 * 변경이 하나도 없으면 [저장]은 아무 일도 하지 않는다(AS-IS chk1=0 → updateEnd 호출 안 됨).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Radio, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empShareApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { MultiGrid, gbFor } from '@/components/grid';

/** 그리드 행: 저장된 행은 shareId(양수), 새 행은 음수 임시 ID */
interface ShareRow {
  shareId: number;
  shareCode: string;
  shareName: string;
  personId: number | null;
  personName: string | null;
  orgId: number | null;
  orgName: string | null;
}
const gb = gbFor<ShareRow>();

interface Props {
  /** 부모(출장) ID — 값이 있으면 열린다 */
  parentId: number | null;
  /** updateEnd() L294-317: 저장이 끝나면 공유명(없으면 '')을 돌려주고 닫는다 */
  onResult: (shareInfo: string) => void;
  onClose: () => void;
}

export const Emp56_Lookup_Share: React.FC<Props> = ({ parentId, onResult, onClose }) => {
  const [rows, setRows] = useState<ShareRow[]>([]);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [kind, setKind] = useState<'emp' | 'org'>('org');  // radio01 직원(false) · radio02 부서(true)
  const [empOpen, setEmpOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const tempId = useRef(0);
  const gridRef = useRef<AgGridReact<ShareRow> | null>(null);
  const today = dayjs().format('YYYY-MM-DD');

  // retrieve() L327-333: deleteList.clear() → emp.Emp56_Share.selectByParentId
  const retrieve = useCallback(async () => {
    if (parentId == null) return;
    setDeleteIds([]);
    try {
      const list = await empShareApi.search(parentId);
      setRows(list.map(s => ({ shareId: s.shareId, shareCode: s.shareCode, shareName: s.shareName ?? '', personId: s.personId, personName: s.personName, orgId: s.orgId, orgName: s.orgName })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  // [E0] 화면 열림 (생성자 L95-112) → show(), open(parentId, …) L89-93: settings("insert"), retrieve()
  useEffect(() => {
    if (parentId != null) { setKind('org'); setRows([]); void retrieve(); }
  }, [parentId, retrieve]);

  // [E2] insertButton[행 추가].Select (L139) → insertRow() L247-255
  const insertRow = () => { if (kind === 'emp') setEmpOpen(true); else setOrgOpen(true); };

  // openLookupEmpInfo() L217-245: 구분 "1" 직원, 부서 = 그 사원의 조직
  const addEmps = (list: TransInfo[]) => {
    setEmpOpen(false);
    setRows(prev => [...prev, ...list.map<ShareRow>(t => ({
      shareId: --tempId.current, shareCode: '1', shareName: '직원', personId: t.personId, personName: t.korNm ?? null,
      orgId: t.orgCodeId ?? null, orgName: t.parentFullNm ?? null,
    }))]);
  };

  // openLookupOrgInfo() L189-215: 구분 "2" 부서, 부서명 = 전체 경로(parentFullName)
  const addOrgs = (list: OrgInfo[]) => {
    setOrgOpen(false);
    setRows(prev => [...prev, ...list.map<ShareRow>(o => ({
      shareId: --tempId.current, shareCode: '2', shareName: '부서', personId: null, personName: null,
      orgId: o.orgCodeId, orgName: o.parentFullNm ?? null,
    }))]);
  };

  // [E3] deleteButton[행 삭제].Select (L145) → deleteRow() L319-325: 체크한 행을 빼고 deleteList에 모은다
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return;
    const ids = new Set(checked.map(r => r.shareId));
    setDeleteIds(prev => [...prev, ...checked.filter(r => r.shareId > 0).map(r => r.shareId)]);
    setRows(prev => prev.filter(r => !ids.has(r.shareId)));
  };

  // [E5] updateButton[저장].Select (L157) → update() L257-292
  const update = async () => {
    if (parentId == null) return;
    const adds = rows.filter(r => r.shareId <= 0);
    if (deleteIds.length === 0 && adds.length === 0) return;  // chk1 == 0 → updateEnd() 호출 안 됨
    setSaving(true);
    try {
      const info = await empShareApi.save(parentId, deleteIds, adds.map(r => ({ shareCode: r.shareCode, personId: r.personId, orgId: r.orgId as number })));
      onResult(info);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // grid() L178-187
  const columnDefs = useMemo(() => [
    gb.textCenter('shareName', 70, '구분'),  // L182
    gb.text('orgName', 250, '부서'),  // L183
    gb.textCenter('personName', 100, '성명'),  // L184
  ], []);

  return (
    <>
      <LookupModal
        open={parentId != null}
        title="공유지정"
        width={580}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" loading={saving} onClick={update}>저장</Button>
              {/* [E6] closeButton[닫기].Select (L163) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio.Group value={kind} onChange={e => setKind(e.target.value)}>
              <Radio value="emp">직원</Radio>
              <Radio value="org">부서</Radio>
            </Radio.Group>
            <Button type="addRow" onClick={insertRow}>행 추가</Button>
            <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            {/* [E1] anchor.MouseDown (L117) → retrieve() / [E4] retrieveButton[새로고침] (L151) → retrieve() */}
            <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<ShareRow> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.shareId)} />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={today} onResult={addEmps} onClose={() => setEmpOpen(false)} />
      <Org00_Lookup_SelectMulti baseDate={orgOpen ? today : undefined} onSelect={addOrgs} onClose={() => setOrgOpen(false)} />
    </>
  );
};
