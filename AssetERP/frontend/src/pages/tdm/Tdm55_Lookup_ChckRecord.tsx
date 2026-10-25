/**
 * 점검(승인) 이력 창 (N20·N21) — 부서 점검현황 그리드의 승인이력 아이콘(N20·N21)과 점검항목 그리드의 점검이력 아이콘(N21)이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm55_Lookup_ChckRecord.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1110×400(원본): 이력 그리드(행번호 숨김, 첫 열 번호 50) + 안내 글 "* 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요" + [닫기]
 * exceptionTable: TDM51(점검부서별 승인이력 — `chckOrgId`), NONE(연결 대상별 이력 selectByRelateId — `relateId`, N21), TDM54(미흡/개선 내역 이력 selectByInsuffId — `insuffId`, N23)
 * UX보강(10): 조회창(UX-05·06)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmChckRecord } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<TdmChckRecord>();

interface Props {
  /** 값이 있으면 열림 — AS-IS open(relateId, "TDM51") 의 relateId (점검부서 ID) */
  chckOrgId?: number | null;
  /** 값이 있으면 열림 — AS-IS open(relateId) (exceptionTable NONE, 점검항목 ID 등 연결 대상 ID) */
  relateId?: number | null;
  /** 값이 있으면 열림 — AS-IS open(relateId, "TDM54") 의 relateId (미흡/개선 내역 ID — 그 발생 점검항목의 이력도 함께) */
  insuffId?: number | null;
  onClose: () => void;
}

export const Tdm55_Lookup_ChckRecord: React.FC<Props> = ({ chckOrgId = null, relateId = null, insuffId = null, onClose }) => {
  const [rows, setRows] = useState<TdmChckRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [opinion, setOpinion] = useState<string | null>(null);

  // buildGrid() L93-105: setRowNumHidden(true) + addLongCenter(rowNum, 50, " ")
  const columnDefs = useMemo(() => [
    gb.longCenter('rowNum', 50, ' '),  // L97
    gb.textCenter('updDateStr', 150, '처리일시'),  // L98
    gb.text('procType', 100, '구분'),  // L99
    gb.text('personInfo', 200, '처리자'),  // L100
    gb.textCenter('procResult', 80, '결과'),  // L101
    gb.text('resultCmnt', 500, '의견'),  // L102
  ], []);

  // [E0] 화면 열림 (생성자 L48-69) → settings(), show() / open(relateId, "TDM51") L42-46 · open(relateId) L37-40 → retrieve() L107-132:
  // TDM51이면 tdm.Tdm55_ChckRecord.selectByChckOrgId, TDM54이면 selectByInsuffId, 그 밖(NONE)이면 selectByRelateId
  useEffect(() => {
    if (chckOrgId == null && relateId == null && insuffId == null) return;
    setLoading(true);
    (chckOrgId != null ? tdmApi.searchChckRecords(chckOrgId)
      : insuffId != null ? tdmApi.searchChckRecordsByInsuff(insuffId)
      : tdmApi.searchChckRecordsByRelate(relateId as number))
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setLoading(false));
  }, [chckOrgId, relateId, insuffId]);

  return (
    <LookupModal
      open={chckOrgId != null || relateId != null || insuffId != null}
      title="점검(승인) 이력"
      width={1210}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] closeButton[닫기].Select (L85) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E1] grid.CellDoubleClick [cellIndex == 6] (L72) → 의견 칸이면 NoticeMessage "의견" */}
          <SingleGrid<TdmChckRecord>
            rowData={rows}
            columnDefs={columnDefs}
            rowNumber={false}
            loading={loading}
            onCellDoubleClicked={e => {
              if (e.column.getColId() === 'resultCmnt') setOpinion(e.data?.resultCmnt ?? '');
            }}
          />
        </div>
        <div style={{ flex: 'none', height: 30, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
          <b style={{ fontSize: 12 }}>* 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요</b>
        </div>
      </div>
      <AreaMessage open={opinion !== null} title="의견" value={opinion ?? ''} readOnly width={450} height={250} onClose={() => setOpinion(null)} />
    </LookupModal>
  );
};
