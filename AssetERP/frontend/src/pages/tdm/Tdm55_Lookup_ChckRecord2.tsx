/**
 * 승인이력 창 (N23) — 책무이행점검 승인(Tdm59_Tab_CheckAppr) 그리드의 승인이력 아이콘이 연다. 종합의견(tdm59) 기준 이력.
 * AS-IS: myApp/client/vi/tdm/Tdm55_Lookup_ChckRecord2.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1300×500(원본, 열 합계 1245+여백 130이 1120을 넘어 원본 폭 그대로 두고 가로 스크롤): 점검부서 선택칸 + [조회] / 이력 그리드(행번호 숨김, 첫 열 번호 50) / 안내 글 / [닫기]
 * UX보강(10): 검색 줄 = 점검부서 칸(LookupInput)·[조회], 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprCmnt, TdmCheckApprRecord } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm23_Lookup_SelectOrg } from './Tdm23_Lookup_SelectOrg';

const gb = gbFor<TdmCheckApprRecord>();

interface Props {
  /** 값이 있으면 열림 — AS-IS open(tdm59Model, stdDate). 승인 행(점검부서·직책을 쓴다) */
  cmnt: TdmCheckApprCmnt | null;
  onClose: () => void;
}

export const Tdm55_Lookup_ChckRecord2: React.FC<Props> = ({ cmnt, onClose }) => {
  const [rows, setRows] = useState<TdmCheckApprRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<{ id: number; name: string } | null>(null);          // orgId · orgLookup 값
  const [orgLookup, setOrgLookup] = useState(false);
  const [opinion, setOpinion] = useState<{ title: string; text: string } | null>(null);

  // buildGrid() L152-166: setRowNumHidden(true) + addLongCenter(rowNum, 50, " ")
  const columnDefs = useMemo(() => [
    gb.longCenter('rowNum', 50, ' '),  // L156
    gb.textCenter('updDateStr', 135, '처리일시'),  // L157
    gb.text('procType', 100, '구분'),  // L158
    gb.text('checkOrgName', 150, '검토대상부서'),  // L159
    gb.text('personInfo', 150, '처리자'),  // L160
    gb.textCenter('procResult', 60, '처리결과'),  // L161
    gb.text('resultCmnt', 300, '승인(반려) 의견'),  // L162
    gb.text('reportCmnt', 300, '보고 의견'),  // L163
  ], []);

  // retrieve() L168-182: tdm.Tdm55_ChckRecord.selectByChckApprCmntId (companyId는 서버, stdDate = 점검년월 첫날은 서버, chckApprCmntId, orgId)
  const retrieve = useCallback(async (orgId: number) => {
    if (!cmnt) return;
    setLoading(true);
    try {
      setRows(await tdmApi.searchCheckApprRecords(cmnt.chckApprCmntId, orgId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [cmnt]);

  // [E0] 화면 열림 (생성자 L65-95, open L53-63): 처음 점검부서 = 승인 행의 점검부서 → retrieve()
  useEffect(() => {
    if (!cmnt) return;
    setRows([]);
    setOrg({ id: cmnt.checkOrgId, name: cmnt.checkOrgName ?? '' });
    void retrieve(cmnt.checkOrgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmnt?.chckApprCmntId]);

  return (
    <LookupModal
      open={!!cmnt}
      title="승인이력"
      width={1300}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E4] closeButton[닫기].Select (L144) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <b>점검부서</b>
          {/* [E1] orgLookup.TriggerClick [result != null] (L100) → Tdm23_Lookup_SelectOrg.open("SINGLE", roleId, true, cb) → retrieve() */}
          <LookupInput value={org?.name ?? ''} width={250} onOpen={() => setOrgLookup(true)} />
          {/* [E3] retrieveButton[조회].Select (L138) → retrieve() */}
          <Button type="search" onClick={() => (org ? retrieve(org.id) : undefined)} disabled={loading}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick [cellIndex == 7] (L121) → 승인(반려) 의견, [cellIndex == 8] → 보고 의견 (NoticeMessage) */}
          <SingleGrid<TdmCheckApprRecord>
            rowData={rows}
            columnDefs={columnDefs}
            rowNumber={false}
            loading={loading}
            onCellDoubleClicked={e => {
              if (e.column.getColId() === 'resultCmnt') setOpinion({ title: '승인(반려) 의견', text: e.data?.resultCmnt ?? '' });
              else if (e.column.getColId() === 'reportCmnt') setOpinion({ title: '보고 의견', text: e.data?.reportCmnt ?? '' });
            }}
          />
        </div>
        <div style={{ flex: 'none', height: 30, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
          <b style={{ fontSize: 12 }}>* 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요</b>
        </div>
      </div>
      <Tdm23_Lookup_SelectOrg
        roleId={orgLookup && cmnt ? cmnt.roleId : null}
        nullButton
        onSelect={r => {
          // 선택안함이면 처음 점검부서로 되돌린다 (L111-114)
          const next = r ? { id: r.orgId, name: r.orgName ?? '' } : cmnt ? { id: cmnt.checkOrgId, name: cmnt.checkOrgName ?? '' } : null;
          setOrg(next);
          if (next) void retrieve(next.id);
        }}
        onClose={() => setOrgLookup(false)}
      />
      <AreaMessage open={opinion !== null} title={opinion?.title ?? ''} value={opinion?.text ?? ''} readOnly width={450} height={250} onClose={() => setOpinion(null)} />
    </LookupModal>
  );
};
