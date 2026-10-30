/**
 * 계정코드 창 (U05) — Emp17_Tab_BenefitManager의 [복리후생비 설정]이 연다
 * AS-IS: myApp/client/vi/emp/Emp55_Lookup_account.java (144줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L41-63: 모달 800×500 "계정코드", 위 툴바 50([조회][저장]) + 그리드(행번호, 복리후생비명 130 · 미사용 80 편집 · 계정코드 100 돋보기 · 계정과목 420), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { empBenefitInfoApi } from '@/api/emp';
import { BenefitInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';

const gb = gbFor<BenefitInfo>();

interface Props {
  open: boolean;
  /** [닫기]의 callback.execute() — 부르는 쪽이 신청구분 콤보를 다시 읽는다. 창은 부르는 쪽이 닫는다 */
  onClose: () => void;
}

export const Emp55_Lookup_account: React.FC<Props> = ({ open, onClose }) => {
  const [accountTarget, setAccountTarget] = useState<BenefitInfo | null>(null);

  const crud = useGridCrud<BenefitInfo>({
    idField: 'benefitInfoId',
    // retrieve() L117-128: 로그인 회사 → emp.Emp55_BenefitInfo.selectByCompanyId
    search: useCallback(() => empBenefitInfoApi.searchBenefitInfosByCompany(), []),
    // update() L130-138: GridUpdate → emp.Emp55_BenefitInfo.update 뒤 retrieve()
    save: useCallback((rows: BenefitInfo[]) => empBenefitInfoApi.updateBenefitInfos(rows), []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({ unUseYn: 'false' }), []),
    reloadAfterSave: true,
  });

  // [E0] open() L41-63 → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) crud.retrieve(); }, [open]);

  // buildGrid() L87-115 (GridBuilder.getGrid — 편집은 미사용 체크와 계정코드 돋보기뿐)
  const columnDefs = useMemo(() => [
    gb.textCenter('benefitName', 130, '복리후생비명'),  // L109
    gb.boolean('unUseYn', 80, '미사용', { editable: true }),  // L110
    gb.textCenter('accountCode', 100, '계정코드', {  // L111 lookupAccount (LookupTriggerField, 편집 불가)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: BenefitInfo; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setAccountTarget(p.data); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('accountName', 420, '계정과목'),  // L112
  ], []);

  return (
    <LookupModal open={open} title="계정코드" width={920} maskClosable={false} onCancel={onClose} footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E3] closeButton[닫기].Select (L78) → callback.execute(), hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
        <Space style={{ marginBottom: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L66) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          {/* [E2] updateButton[저장].Select (L72) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<BenefitInfo> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      {/* [E4] lookupAccount.TriggerClick (L93-107) → Act01_Lookup_AccountCode.open(): 고른 계정의 코드·이름을 그 행에 반영(변경으로 친다) */}
      <Act01_Lookup_AccountCode open={accountTarget !== null}
        onResult={acc => { if (accountTarget) crud.updateRow(accountTarget.benefitInfoId, { accountCode: acc.accountCode, accountName: acc.accountName }); setAccountTarget(null); }}
        onClose={() => setAccountTarget(null)} />
    </LookupModal>
  );
};
