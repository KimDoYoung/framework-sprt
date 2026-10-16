/**
 * 상벌내역 탭 (C01-5) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp11_TabPage_Reward.java
 * CellEditGrid(체크박스): 상벌구분·상벌일자·상벌단체·수상(징계)사유·수상(징계)처분·비고
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { empRewardApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { Reward } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Reward>();

// [E5] rewardComboBox[EmpRewardCode].Collapse → rewardCd 동기화 (valueSetter)
const buildGrid = (rewardCodes: Code[]) => [
  gb.text('rewardCdNm', 80, '상벌구분', {
    editor: 'select',
    values: rewardCodes.map(c => c.name),
    valueSetter: p => {
      p.data.rewardCdNm = p.newValue;
      p.data.rewardCd = rewardCodes.find(c => c.name === p.newValue)?.code ?? p.data.rewardCd;
      return true;
    },
  }),
  gb.textCenter('rewardDt', 100, '상벌일자', { editor: 'date' }),
  gb.text('rewardGroup', 160, '상벌단체', { editor: 'text' }),
  gb.text('rewardNm', 320, '수상(징계)사유', { editor: 'text' }),
  gb.text('rewardDesc', 320, '수상(징계)처분', { editor: 'text' }),
  gb.text('note', 240, '비고', { editor: 'text' }),
];

export const Emp11_TabPage_Reward: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [rewardCodes, setRewardCodes] = React.useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(rewardCodes), [rewardCodes]);

  const search = useCallback(async () => {
    if (!personId) return [];
    return empRewardApi.getRewards(personId);
  }, [personId]);

  const save = useCallback((changed: Reward[]) => empRewardApi.updateRewards(changed), []);

  const remove = useCallback((ids: number[]) => empRewardApi.deleteRewards(ids), []);

  const newRow = useCallback((): Partial<Reward> => ({ personId }), [personId]);

  const crud = useGridCrud<Reward>({
    idField: 'rewardId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'rewardCdNm',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });

  const { retrieve } = crud;

  // [E0] 코드 로드
  useEffect(() => {
    sysApi.searchCodes('EmpRewardCode').then(setRewardCodes).catch(() => {});
  }, []);

  // [E1] searchBarBuilder[조회].Retrieve → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else crud.clear(); }, [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', boxSizing: 'border-box' }}>
      <Space>
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="register" onClick={crud.addRow} disabled={!row}>등록</Button>
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Reward>
          crud={crud}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
};
