/**
 * 경영·회계 탭 (A15-3) — Sys01_Tab_Company 아래 탭 4번째.
 * AS-IS: myApp/client/vi/sys/Sys01_TabPage_Info04.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 새 원본 IDMS-IC, 2026-11-10 그리드를 15열로 다시 맞춤)
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

/** AS-IS gridBuilder 제목 색 인자 "0069B4"(파랑)·"107C41"(초록) → 헤더 글자색 */
const blueHeader = { headerStyle: { color: '#0069B4' } };
const greenHeader = { headerStyle: { color: '#107C41' } };

/** AS-IS ComboBoxField ValueChange → addChange(코드, getCode()) + addChange(이름, getName()): 이름 목록에서 고르면 코드도 같이 바꾼다 */
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

/**
 * AS-IS buildGrid() L61-242 (IDMS-IC, 15열). 묶음 헤더 L158-160은 열 번호 그대로다:
 * "휴가" = 0~4열(근태 잠금사용까지), "고유자산" = 10~13열(인사평가 시작월까지), "인사평가"(초록) = 14열부터 2칸(남은 열은 평가기간 하나)
 */
const buildGrid = (c: Combos) => [
  gb.group('휴가', [  // L158 HeaderGroupConfig("휴가", 1, 5)
    // [E2] monthComboBox[MonthsCode].ValueChange (L74-81)
    gb.textCenter('leaveMonthNm', 120, '휴가결산(월)', { ...combo(c.months, 'leaveMonthCd', 'leaveMonthNm'), ...blueHeader }),
    gb.boolean('leaveYn', 120, '초과사용허용', { editable: true }),
    gb.boolean('leaveConfirmYn', 140, '초과사용<br>상신전 승인요청', { editable: true }),
    gb.longCenter('leaveCompulsionRt', 140, '의무사용율(%)', { editor: 'number' }),
    gb.boolean('commuteLockYn', 120, '근태<br>잠금사용', { editable: true }),
  ]),
  gb.boolean('commutePopupYn', 120, '근태<br>팝업사용', { editable: true }),
  // [E3] taxComboBox[TaxType].ValueChange (L92-99)
  gb.textCenter('taxTypeNm', 100, '과세구분', { ...combo(c.tax, 'taxType', 'taxTypeNm'), ...blueHeader }),
  gb.boolean('cardRealUserYn', 120, '법인카드<br>실사용자관리', { editable: true }),
  // [E4] incomeTaxFilingComboBox[IncomeTaxFilingCode].ValueChange (L110-117)
  gb.textCenter('incomeTaxFilingNm', 100, '소득세신고<br>주기구분', { ...combo(c.incomeTaxFiling, 'incomeTaxFilingCd', 'incomeTaxFilingNm'), ...blueHeader }),
  // [E5] accountCloseMonthComboBox[MonthsCode].ValueChange (L128-135)
  gb.textCenter('accountCloseMonthNm', 120, '회계결산(월)', { ...combo(c.months, 'accountCloseMonth', 'accountCloseMonthNm'), ...blueHeader }),
  gb.group('고유자산', [  // L159 HeaderGroupConfig("고유자산", 1, 4)
    // [E6] ownerCapitalApplyComboBox[OwnerCapitalApplyDateType].ValueChange (L146-153)
    gb.textCenter('ownerCapitalApplyNm', 120, '자기자본<br>적용일', combo(c.ownerCapitalApply, 'ownerCapitalApplyCd', 'ownerCapitalApplyNm')),
    gb.boolean('astManagerAutoYn', 150, '종목별 담당자<br>자동설정', { editable: true }),
    // [E7] astEvalCycleComboBox[AssetEvalCycleCode].ValueChange (L164-171)
    gb.textCenter('astEvalCycleNm', 120, '평가주기', combo(c.astEvalCycle, 'astEvalCycleCd', 'astEvalCycleNm')),
    // [E9] empEvalMonthComboBox[MonthsCode].ValueChange (L205-212)
    gb.textCenter('empEvalMonthNm', 120, '시작월', { ...combo(c.months, 'empEvalMonthCd', 'empEvalMonthNm'), ...greenHeader }),
  ]),
  { ...gb.group('인사평가', [  // L160 HeaderGroupConfig(setHtmlGridStyle("인사평가","107C41"), 1, 2)
    // [E8] empEvalCycleComboBox[sys.Sys00_Common.selectByKindGroupCode].ValueChange (L187-194)
    gb.textCenter('empEvalCycleNm', 120, '평가기간', { ...combo(c.empEvalCycle, 'empEvalCycleCd', 'empEvalCycleNm'), ...greenHeader }),
  ]), ...greenHeader },
];

export const Sys01_TabPage_Info04: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [combos, setCombos] = useState<Combos>(NO_COMBOS);

  const crud = useGridCrud<Row>({
    idField: 'companyId',
    // retrieve() L260-263: 서비스 sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => (companyId != null ? [await sysApi.getCompanyAccount(companyId)] : []), [companyId]),
    // update() L255-258: GridUpdate → sys.Sys01_Company.update
    save: useCallback((rows: Row[]) => Promise.all(rows.map(sysApi.updateCompanyAccount)), []),
    remove: async () => undefined, // 이 탭에는 삭제가 없다
    newRow: () => ({}), // 이 탭에는 행추가가 없다
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve, clear: crudClear } = crud;

  const columnDefs = useMemo(() => buildGrid(combos), [combos]);

  // 콤보 목록: ComboBoxField(종류) ×5 + CommonComboBoxField(로그인 회사, kindGroupCode 'CycleCode002', 오늘) L173-178
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

  // [E0] 화면 열림 (생성자 L42-59) / retrieve(param) L249-253 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  useEffect(() => { if (companyId != null) crudRetrieve(); else crudClear(); }, [companyId, crudRetrieve, crudClear]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] updateButton[저장].Select (L45) → update() */}
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
