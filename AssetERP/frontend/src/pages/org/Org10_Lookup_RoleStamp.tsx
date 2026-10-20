/**
 * 부서별 사용권한 조회창 (G07) — Apr10_Tab_Stamp의 (전체사용이 아닌 경우) 사용가능 부서 칸 아이콘에서 연다.
 * AS-IS: myApp/client/vi/org/Org10_Lookup_RoleStamp.java (215줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * Org10_Lookup_RoleStamp() L65-103: 모달 450×500 "부서별 사용권한", 위 툴바([행 추가][행 삭제] + 새로고침 아이콘) + 체크박스 다중 그리드(부서 350), 아래 가운데 [저장][닫기]
 * 행 삭제는 화면에서만 빼 두었다가(deleteList) [저장]에서 서버에서 지운다(update() L177-195)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { orgRoleStampApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { AprStampManage } from '@/types/apr';
import { OrgRoleStamp } from '@/types/org';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';

const gb = gbFor<OrgRoleStamp>();

interface Props {
  /** open(stampModel, callback) L59-63 — 값이 있으면 열린다 */
  stamp: AprStampManage | null;
  /** [저장] callback.execute(msg) — "부서" / "부서 외 n건" / "없음" */
  onSaved: (stampId: number, msg: string) => void;
  onClose: () => void;
}

/** 임시 행 ID(저장 전)는 음수 */
let tempSeq = 0;

export const Org10_Lookup_RoleStamp: React.FC<Props> = ({ stamp, onSaved, onClose }) => {
  const [rows, setRows] = useState<OrgRoleStamp[]>([]);
  const [deleteList, setDeleteList] = useState<OrgRoleStamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const gridRef = useRef<AgGridReact<OrgRoleStamp>>(null);

  // buildGrid() grid() L143-149: setChecked(MULTI)
  const columnDefs = useMemo(() => [gb.text('orgName', 350, '부서')], []);  // L146

  // retrieve() L205-210: deleteList.clear(), 서비스 org.Org10_RoleStamp.selectByStampId(stampId)
  const retrieve = async () => {
    if (!stamp) return;
    setLoading(true);
    try {
      setDeleteList([]);
      setRows(await orgRoleStampApi.searchRoleStamps(stamp.stampId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L65-103) → settings(), show() / open() L59-63 → retrieve()
  useEffect(() => {
    if (!stamp) return;
    setRows([]);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp?.stampId]);

  // [E1] anchor.MouseDown (L76) → retrieve() — 새로고침 아이콘

  // [E2] insertButton[행 추가].Select (L106) → insertRow() L151-175: Org00_Lookup_SelectMulti(오늘) → 고른 조직마다 새 행 (조직코드·부서명·인감ID, useYn true)
  const insertRow = (orgs: OrgInfo[]) => {
    if (!stamp) return;
    setRows(prev => [
      ...prev,
      ...orgs.map(o => ({ roleStampId: --tempSeq, stampId: stamp.stampId, orgCodeId: o.orgCodeId, orgName: o.korNm, useYn: 'true' })),
    ]);
    setTimeout(() => { const api = gridRef.current?.api; if (api) api.ensureIndexVisible(api.getDisplayedRowCount() - 1); }, 50);
  };

  // [E3] deleteButton[행 삭제].Select (L112) → deleteRow() L197-203: 고른 행을 deleteList에 담고 화면에서 뺀다
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) return;
    setDeleteList(prev => [...prev, ...checked]);
    setRows(prev => prev.filter(r => !checked.includes(r)));
  };

  // [E4] updateButton[저장].Select (L118) → callback.execute(msg) 뒤 update() L177-195: 지운 행 delete → 새 행 update
  const update = async () => {
    if (!stamp) return;
    setLoading(true);
    try {
      const deleteIds = deleteList.filter(r => r.roleStampId > 0).map(r => r.roleStampId);
      if (deleteIds.length > 0) await orgRoleStampApi.deleteRoleStamps(deleteIds);
      const added = rows.filter(r => r.roleStampId <= 0);
      if (added.length > 0) await orgRoleStampApi.saveRoleStamps(added);
      const msg = rows.length === 1 ? rows[0].orgName ?? '' : rows.length > 0 ? `${rows[0].orgName} 외 ${rows.length - 1}건` : '없음';
      onSaved(stamp.stampId, msg);
      await retrieve();  // 새 행의 실제 ID를 받아 오기 위해 다시 읽는다(원본은 임시 행을 그대로 둠)
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LookupModal
        open={!!stamp}
        title="부서별 사용권한"
        width={450}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E5] closeButton[닫기].Select (L135) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            <Button type="addRow" onClick={() => setOrgOpen(true)}>행 추가</Button>
            <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            <ReloadOutlined style={{ fontSize: 15, cursor: 'pointer' }} onClick={() => void retrieve()} />
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<OrgRoleStamp> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading}
              getRowId={p => String(p.data.roleStampId)} />
          </div>
        </div>
      </LookupModal>
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        onSelect={insertRow}
        onClose={() => setOrgOpen(false)}
      />
    </>
  );
};
