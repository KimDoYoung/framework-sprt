/**
 * 공모주 알람설정 6칸 (Q04) — Sch06_Lookup_AlarmSetup의 `targetCode == "IPO"`일 때 아래에 붙는 그리드
 * AS-IS: myApp/client/vi/sch/Sch11_Edit_IpoAlarmSetup.java (71줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 grid() L27-40: 행번호 없음(setRowNumHidden), 정렬 없음, 체크 6칸(수요예측시작일 130 · 수요예측종료일 120 · 청약시작일 100 · 청약종료일 100 · 납입일 90 · 상장일 90)
 * 위쪽 알람 그리드와 [조회]·[저장]을 같이 쓴다 — 훅 `useIpoAlarmSetup`을 알람 창이 들고 retrieve()/update()/getModiCnt()를 부른다
 */
import React, { useCallback } from 'react';
import { schApi } from '@/api/sch';
import { Sch11IpoCompany } from '@/types/sch';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch11IpoCompany>();

const COLUMNS = [
  gb.boolean('demandSdateAlarmYn', 130, '수요예측시작일', { editable: true }),        // L31
  gb.boolean('demandCdateAlarmYn', 120, '수요예측종료일', { editable: true }),        // L32
  gb.boolean('subscriptionSdateAlarmYn', 100, '청약시작일', { editable: true }),      // L33
  gb.boolean('subscriptionCdateAlarmYn', 100, '청약종료일', { editable: true }),      // L34
  gb.boolean('payDateAlarmYn', 90, '납입일', { editable: true }),                     // L35
  gb.boolean('listDateAlarmYn', 90, '상장일', { editable: true }),                    // L36
];

/**
 * retrieve(ipoId) L42-60: sch.Sch11_IpoCompany.selectByIpoId — 내 회사 행이 없으면 빈 행 한 줄(GridInsertRow, 변경 아님)
 * update() L62-65: sch.Sch11_IpoCompany.update. `changes` = getModiCnt() L67-69
 */
export const useIpoAlarmSetup = (ipoId: number | null) =>
  useGridCrud<Sch11IpoCompany>({
    idField: 'ipoCompanyId',
    search: useCallback(async () => {
      if (ipoId == null) return [];
      const row = await schApi.getIpoCompany(ipoId);
      return [row ?? { ipoCompanyId: -1, ipoId }];
    }, [ipoId]),
    save: useCallback(async (rows: Sch11IpoCompany[]) => (ipoId == null ? [] : [await schApi.saveIpoCompany(ipoId, rows[0])]), [ipoId]),
    remove: useCallback(async () => 0, []),
    newRow: () => ({}),
  });

interface Props {
  crud: ReturnType<typeof useIpoAlarmSetup>;
}

export const Sch11_Edit_IpoAlarmSetup: React.FC<Props> = ({ crud }) => (
  <CellEditGrid<Sch11IpoCompany> crud={crud} columnDefs={COLUMNS} rowNumber={false} rowSelection={undefined} />
);
