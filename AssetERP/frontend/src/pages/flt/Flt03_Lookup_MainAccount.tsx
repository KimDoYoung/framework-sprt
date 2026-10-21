/**
 * 주계좌 설정 창 (I02) — Flt03_Tab_AccountReport [주계좌 설정]에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt03_Lookup_MainAccount.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L37-57: 650×400 모달, 행번호 없는 그리드(개설기관·계좌번호·계좌명의·주 계좌 체크) + [저장][닫기]. 열 때 retrieve()
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Space } from 'antd';
import { fltApi } from '@/api/flt';
import { FltAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<FltAccount>();

interface Props {
  open: boolean;
  /** [닫기]의 callback.execute() (L69) — 부른 쪽이 목록을 다시 읽는다 */
  onClose: () => void;
}

export const Flt03_Lookup_MainAccount: React.FC<Props> = ({ open, onClose }) => {
  const crud = useGridCrud<FltAccount>({
    idField: 'accountId',
    // retrieve() L89-100: 서비스 flt.Flt03_Account.selectByPersonId(companyId, personId)
    search: useCallback(() => fltApi.searchAccounts(), []),
    // update() L102-127: GridUpdate → flt.Flt03_Account.update
    save: rows => fltApi.updateAccounts(rows),
    remove: async () => 0,
    newRow: () => ({}),
    // update() L112-123: 주 계좌가 둘 이상이면 저장하지 않는다
    validate: (_changed, all) => (all.filter(r => r.mainAccountYn).length > 1 ? '주 계좌는 하나만 가능합니다.' : undefined),
  });

  // buildGrid() L75-87: setChecked 주석 처리, setRowNumHidden(true)
  const columnDefs = useMemo(() => [
    gb.text('corpName', 200, '개설기관'),  // L80
    gb.text('accountNoDec', 200, '계좌번호'),  // L81
    gb.text('accountName', 150, '계좌명의'),  // L82
    gb.boolean('mainAccountYn', 70, '주 계좌', { editable: true }),  // L83
  ], []);

  useEffect(() => {
    if (open) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <LookupModal
      open={open}
      title="주계좌 설정"
      width={750}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] updateButton[저장].Select (L60) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L66) → callback.execute() + hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300 }}>
        <CellEditGrid<FltAccount> crud={crud} columnDefs={columnDefs} rowNumber={false} />
      </div>
    </LookupModal>
  );
};
