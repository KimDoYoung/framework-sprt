/**
 * 경영·회계 탭 (A15-3) — Sys01_Tab_Company 아래 탭 4번째.
 * AS-IS: myApp/client/vi/sys/Sys01_TabPage_Info04.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 회사 1행을 셀 편집 그리드로 보여 주고 저장한다(행번호 숨김, 정렬 없음, 체크박스 없음).
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { sysApi } from '@/api/sys';
import { Code, CompanyAccount } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, GbOpts } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import type { CompanyTabProps } from './Sys01_Tab_Company';

type Row = CompanyAccount;
const gb = gbFor<Row>();

/** AS-IS setHtmlIconGridStyle(header, "0069B4"): 헤더 글자색 */
const blueHeader = { headerStyle: { color: '#0069B4' } };

/** AS-IS ComboBoxField Collapse → addChange(코드, getCode()) + addChange(이름, getName()): 이름 목록에서 고르면 코드도 같이 바꾼다 */
const combo = (codes: Code[], cd: keyof Row, nm: keyof Row): GbOpts<Row> => ({
  editor: 'select',
  values: codes.map(c => c.name),
  valueSetter: p => {
    const r = p.data as unknown as Record<string, unknown>;
    r[nm] = p.newValue;
    r[cd] = codes.find(c => c.name === p.newValue)?.code ?? null;
    return true;
  },
});

interface Combos { months: Code[]; tax: Code[]; incomeTaxFiling: Code[]; ownerCapitalApply: Code[]; astEvalCycle: Code[]; empEvalCycle: Code[] }
const NO_COMBOS: Combos = { months: [], tax: [], incomeTaxFiling: [], ownerCapitalApply: [], astEvalCycle: [], empEvalCycle: [] };

/** AS-IS buildGrid() L57-156 */
const buildGrid = (c: Combos) => [
  // [E2] monthComboBox[MonthsCode].Collapse (L62-69)
  gb.textCenter('leaveMonthNm', 120, '휴가결산(월)', { ...combo(c.months, 'leaveMonthCd', 'leaveMonthNm'), ...blueHeader }),  // L141
  gb.boolean('leaveYn', 120, '휴가<br>초과사용허용', { editable: true }),  // L142
  gb.longCenter('leaveCompulsionRt', 140, '휴가<br> 의무사용율(%)', { editor: 'number' }),  // L143
  // [E3] taxComboBox[TaxType].Collapse (L71-78)
  gb.textCenter('taxTypeNm', 100, '과세구분', { ...combo(c.tax, 'taxType', 'taxTypeNm'), ...blueHeader }),  // L144
  gb.boolean('cardRealUserYn', 120, '법인카드<br>실사용자관리', { editable: true }),  // L145
  // [E4] incomeTaxFilingComboBox[IncomeTaxFilingCode].Collapse (L80-87)
  gb.textCenter('incomeTaxFilingNm', 100, '소득세신고<br>주기구분', { ...combo(c.incomeTaxFiling, 'incomeTaxFilingCd', 'incomeTaxFilingNm'), ...blueHeader }),  // L146
  // [E5] accountCloseMonthComboBox[MonthsCode].Collapse (L89-96)
  gb.textCenter('accountCloseMonthNm', 120, '회계결산(월)', { ...combo(c.months, 'accountCloseMonth', 'accountCloseMonthNm'), ...blueHeader }),  // L148
  // [E6] ownerCapitalApplyComboBox[OwnerCapitalApplyDateType].Collapse (L98-105)
  gb.textCenter('ownerCapitalApplyNm', 140, '자기자본 적용일', combo(c.ownerCapitalApply, 'ownerCapitalApplyCd', 'ownerCapitalApplyNm')),  // L149
  gb.boolean('astManagerAutoYn', 150, '고유자산담당자<br>자동설정', { editable: true }),  // L150
  // [E7] astEvalCycleComboBox[AssetEvalCycleCode].Collapse (L107-114)
  gb.textCenter('astEvalCycleNm', 140, '고유자산 평가주기', combo(c.astEvalCycle, 'astEvalCycleCd', 'astEvalCycleNm')),  // L151
  // [E8] empEvalCycleComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L121-128)
  gb.textCenter('empEvalCycleNm', 100, '인사평가<br>평가기간', combo(c.empEvalCycle, 'empEvalCycleCd', 'empEvalCycleNm')),  // L153
  // [E9] empEvalMonthComboBox[MonthsCode].Collapse (L130-137)
  gb.textCenter('empEvalMonthNm', 100, '인사평가<br>시작월', combo(c.months, 'empEvalMonthCd', 'empEvalMonthNm')),  // L154
];

export const Sys01_TabPage_Info04: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [combos, setCombos] = useState<Combos>(NO_COMBOS);

  const crud = useGridCrud<Row>({
    idField: 'companyId',
    // retrieve() L163-167: 서비스 sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => (companyId != null ? [await sysApi.getCompanyAccount(companyId)] : []), [companyId]),
    // update() L169-172: GridUpdate → sys.Sys01_Company.update
    save: useCallback((rows: Row[]) => Promise.all(rows.map(sysApi.updateCompanyAccount)), []),
    remove: async () => undefined, // 이 탭에는 삭제가 없다
    newRow: () => ({}), // 이 탭에는 행추가가 없다
  });

  const columnDefs = useMemo(() => buildGrid(combos), [combos]);

  // 콤보 목록: ComboBoxField(종류) ×5 + CommonComboBoxField(로그인 회사, kindGroupCode 'CycleCode002', 오늘) L116-120
  useEffect(() => {
    Promise.all([
      sysApi.searchCodes('MonthsCode'),
      sysApi.searchCodes('TaxType'),
      sysApi.searchCodes('IncomeTaxFilingCode'),
      sysApi.searchCodes('OwnerCapitalApplyDateType'),
      sysApi.searchCodes('AssetEvalCycleCode'),
      sysApi.searchCodesByKindGroup('CycleCode002'),
    ])
      .then(([months, tax, incomeTaxFiling, ownerCapitalApply, astEvalCycle, empEvalCycle]) =>
        setCombos({ months, tax, incomeTaxFiling, ownerCapitalApply, astEvalCycle, empEvalCycle }))
      .catch(() => setCombos(NO_COMBOS));
  }, []);

  // [E0] 화면 열림 (생성자 L38-55) / retrieve(param) L174-177 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId != null) crud.retrieve(); else crud.clear(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] updateButton[저장].Select (L41) → update() */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Row>
          crud={crud}
          columnDefs={columnDefs}
          rowNumber={false}
          sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
        />
      </div>
    </div>
  );
};
