/**
 * 부서변경(점검항목 일괄지정) 창 (N16) — 매뉴얼 부서지정(Tdm41_Tab_ManlDutyOrg)의 [점검항목 부서변경]이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm41_Lookup_ChangeOrg_Tmp.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 950×500(원본): 열 합계 700+행번호·선택 60+여백 130 = 890이라 원본 폭 950. 툴바 [조회] + 체크 다중 그리드 + [부서변경][닫기]
 * (원본은 updateButton을 툴바에 넣은 뒤 하단 버튼으로 다시 넣어 하단에만 남는다)
 * 부서변경 = 새 부서 고르기(Tdm23_Lookup_SelectOrg, "SINGLE") → 확인(350) → 서버. 서버가 잠긴 매뉴얼이면 거부
 * UX보강(10): 툴바 = SearchBar(UX-01), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlDutyTaskOrg, TdmRoleOrgLookup } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { Tdm23_Lookup_SelectOrg } from './Tdm23_Lookup_SelectOrg';

const gb = gbFor<TdmManlDutyTaskOrg>();

/** buildGrid() L107-116 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('taskName', 350, '책무'),  // L111
  gb.longCenter('taskRelateDutyCnt', 100, '관리의무 건수'),  // L112
  gb.text('orgName', 250, '담당부서'),  // L113
];

interface Props {
  /** AS-IS open(manlJobId, roleId, callback) — 값이 있으면 열림 */
  target: { manlJobId: number; roleId: number } | null;
  /** [닫기] 버튼 — AS-IS callback.execute()(부르는 쪽이 다시 조회). X로 닫을 때는 부르지 않는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Tdm41_Lookup_ChangeOrg_Tmp: React.FC<Props> = ({ target, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmManlDutyTaskOrg>>(null);
  const [rows, setRows] = useState<TdmManlDutyTaskOrg[]>([]);
  const [orgLookup, setOrgLookup] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L118-130: tdm.Tdm41_ManlDuty.selectTaskAndOrg (manlJobId, roleId)
  const retrieve = useCallback(async () => {
    if (!target) return;
    try {
      setRows(await tdmApi.searchManlDutyTaskOrgs(target.manlJobId, target.roleId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [target]);

  // [E0] 화면 열림 (생성자 L59-81) → settings(), show() / open() L51-57 → retrieve()
  useEffect(() => {
    if (!target) return;
    setRows([]);
    void retrieve();
  }, [target, retrieve]);

  // [E2] updateButton[부서변경].Select (L90) → changeOrg() L132-183
  const changeOrg = () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('변경대상을 선택하세요');
      return;
    }
    setOrgLookup(true);   // Tdm23_Lookup_SelectOrg.open("SINGLE", roleId, callback)
  };
  const onOrgResult = (org: TdmRoleOrgLookup | null) => {
    if (!org || !target) return;
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    // [E4] msgBox.DialogHide [YES] (L147) → changeOrgId2 → 끝나면 retrieve()
    Modal.confirm({
      title: '확인',
      content: '선택한 부서를 일괄변경하시겠습니까?',
      width: 350,
      onOk: async () => {
        try {
          await tdmApi.changeManlDutyOrg({
            manlJobId: target.manlJobId, roleId: target.roleId, orgId: org.orgId,
            items: selected.map(r => ({ taskId: r.taskId, orgId: r.orgId })),
          });
          message.success('저장이 완료되었습니다');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
        }
      },
    });
  };

  return (
    <>
      <LookupModal
        open={!!target}
        title="부서변경(점검항목 일괄지정)"
        width={950}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="change" onClick={changeOrg}>부서변경</Button>
              {/* [E3] closeButton[닫기].Select [callback != null] (L96) → callback.execute(), hide() */}
              <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L84) → retrieve() */}
          <SearchBar onSearch={() => retrieve()} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<TdmManlDutyTaskOrg>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => `${p.data.taskId}-${p.data.orgId}`}
              rowClick
            />
          </div>
        </div>
      </LookupModal>
      <Tdm23_Lookup_SelectOrg roleId={orgLookup && target ? target.roleId : null} onSelect={onOrgResult} onClose={() => setOrgLookup(false)} />
    </>
  );
};
