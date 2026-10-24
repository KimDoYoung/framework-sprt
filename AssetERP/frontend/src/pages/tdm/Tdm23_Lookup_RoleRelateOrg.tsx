/**
 * 연결부서 창 (N08) — 직책 그리드의 연결부서 아이콘·직책 편집창의 [연결부서(n건)]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm23_Lookup_RoleRelateOrg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 380×400(원본) → 열(250+행번호·선택 60+여백 130) 기준 440: 툴바([행 추가][행 삭제] + 새로고침) + CellEditGrid(체크, 편집 열 없음) + [저장][닫기]
 * 조직은 기준일(부르는 쪽의 기준일)의 조직이다 (retrieve() L160-175, getOrg(companyId, stdDate)). [행 추가]는 Org00_Lookup_SelectTdm(오늘, 이 직책에 연결 안 된 조직, 다중)
 * UX보강(10): 조회창(UX-05·06은 Org00 안에서), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { tdmApi } from '@/api/tdm';
import { OrgTdm } from '@/types/emp';
import { TdmRoleOrg } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { useDeferredCrud } from './useDeferredCrud';

const gb = gbFor<TdmRoleOrg>();

/** buildGrid() L152-158 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('orgName', 250, '부서'),  // L155
];

interface Props {
  /** 값이 있으면 열림 — AS-IS open(roleModel, baseDate, callback) */
  roleId: number | null;
  /** AS-IS baseDate — 'yyyy-MM-dd', 없으면 오늘 */
  baseDate?: string | null;
  /** [닫기] — AS-IS callback.execute(그리드 행 수) 뒤 hide(): 부르는 쪽이 건수를 바꾼다 */
  onClose: (count: number) => void;
}

export const Tdm23_Lookup_RoleRelateOrg: React.FC<Props> = ({ roleId, baseDate, onClose }) => {
  const stdDate = baseDate || dayjs().format('YYYY-MM-DD');
  const [orgLookup, setOrgLookup] = useState(false);
  const columnDefs = useMemo(buildGrid, []);
  const { crud, retrieve, reset, deleteRow, commit, close, saveCount } = useDeferredCrud<TdmRoleOrg>({
    idField: 'roleRelateOrgId',
    search: useCallback(async () => (roleId ? tdmApi.searchRoleOrgs(roleId, stdDate) : []), [roleId, stdDate]),
    newRow: useCallback((): Partial<TdmRoleOrg> => ({ roleId: roleId ?? undefined }), [roleId]),
  });

  // [E0] open() L64-87 → setting(), retrieve() / [E1] anchor.MouseDown (L92) → retrieve()
  useEffect(() => {
    if (roleId) void retrieve(); else reset();
  }, [roleId]);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] insertButton[행 추가].Select (L103) → insertRow() L177-200: Org00_Lookup_SelectTdm.open(오늘, roleId, 다중) → 고른 조직마다 새 행
  const insertRows = (orgs: OrgTdm[]) => {
    crud.addRows(orgs.map(o => ({ roleId: roleId ?? undefined, orgId: o.orgCodeId, orgName: o.korNm })), true);
  };

  // [E6] msgBox.DialogHide [YES] (L127) → callback.execute(행 수) + hide() — useDeferredCrud.close의 확인
  // [E4] updateButton[저장].Select (L115) → update() L215-252: tdm.Tdm23_RoleRelateOrg.update → delete
  const update = () => commit({
    save: changed => tdmApi.saveRoleOrgs(roleId!, stdDate, changed),
    remove: ids => tdmApi.deleteRoleOrgs(roleId!, ids),
  });

  return (
    <LookupModal
      open={!!roleId}
      title="부서연결"
      width={440}
      closable={false}
      maskClosable={false}
      onCancel={() => close(onClose)}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" count={saveCount} onClick={update}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L121) → 변경이 있으면 확인(E6, L127) 뒤 callback.execute(행 수) + hide() */}
            <Button type="close" onClick={() => close(onClose)}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Button type="addRow" onClick={() => setOrgLookup(true)}>행 추가</Button>
          {/* [E3] deleteButton[행 삭제].Select (L109) → deleteRow() L202-213 */}
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmRoleOrg> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Org00_Lookup_SelectTdm
        stdDate={orgLookup ? dayjs().format('YYYY-MM-DD') : undefined}
        roleId={roleId}
        single={false}
        onSelectMulti={insertRows}
        onClose={() => setOrgLookup(false)}
      />
    </LookupModal>
  );
};
