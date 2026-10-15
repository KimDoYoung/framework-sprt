/**
 * 전자결재·내부통제 탭 (A15-3) — Sys01_Tab_Company 아래 탭 3번째.
 * AS-IS: myApp/client/vi/sys/Sys01_TabPage_Info03.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 회사 1행을 셀 편집 그리드로 보여 주고 저장한다(행번호 숨김, 정렬 없음, 체크박스 없음).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { sysApi } from '@/api/sys';
import { Code, CompanyApproval } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, GbOpts } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import type { CompanyTabProps } from './Sys01_Tab_Company';

type Row = CompanyApproval;
const gb = gbFor<Row>();

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

interface Combos { dcrNumbering: Code[]; icsCycle: Code[] }

/** AS-IS buildGrid() L53-99 */
const buildGrid = (c: Combos) => [
  gb.boolean('apprStepLockYn', 120, '결재선 잠금', { editable: true }),  // L87
  gb.textCenter('companyRepNm', 140, '대외문서(대표이사)', { editor: 'text' }),  // L88
  gb.boolean('aprManagerInfoYn', 240, '대외문서(담당자정보포함)', { editable: true }),  // L89
  // [E2] dcrNumberingComboBox[DcrNumberingCode].Collapse (L58-65)
  gb.textCenter('dcrNumberingNm', 140, '문서번호(채번방식)', combo(c.dcrNumbering, 'dcrNumberingCd', 'dcrNumberingNm')),  // L90
  gb.boolean('dcrDetailUseYn', 140, '문서세부(분류사용)', { editable: true }),  // L91
  // [E3] icsCheckCycleComboBox[IcsCheckListCycleType].Collapse (L67-74)
  gb.textCenter('icsCheckCycleNm', 140, '내부통제 체크주기', combo(c.icsCycle, 'icsCheckCycleType', 'icsCheckCycleNm')),  // L92
  // [E4] icsComplyCycleComboBox[IcsCheckListCycleType].Collapse (L76-83)
  gb.textCenter('icsComplyCycleNm', 240, '임직원준수점검 체크주기', combo(c.icsCycle, 'icsComplyCycleType', 'icsComplyCycleNm')),  // L93
  gb.boolean('icsNonStayYn', 240, '내부통제 비상근인력 체크', { editable: true }),  // L94
  gb.boolean('fltOnlyCurrYn', 160, '사전신고 소급 미사용', { editable: true }),  // L95
  gb.boolean('icsGuideYn', 140, '법규 연결가이드', { editable: true }),  // L96
];

export const Sys01_TabPage_Info03: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [combos, setCombos] = useState<Combos>({ dcrNumbering: [], icsCycle: [] });

  const crud = useGridCrud<Row>({
    idField: 'companyId',
    // retrieve() L106-110: 서비스 sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => (companyId ? [await sysApi.getCompanyApproval(companyId)] : []), [companyId]),
    // update() L112-115: GridUpdate → sys.Sys01_Company.update
    save: useCallback((rows: Row[]) => Promise.all(rows.map(sysApi.updateCompanyApproval)), []),
    remove: async () => undefined, // 이 탭에는 삭제가 없다
    newRow: () => ({}), // 이 탭에는 행추가가 없다
  });

  const columnDefs = useMemo(() => buildGrid(combos), [combos]);

  useEffect(() => {
    Promise.all([sysApi.searchCodes('DcrNumberingCode'), sysApi.searchCodes('IcsCheckListCycleType')])
      .then(([dcrNumbering, icsCycle]) => setCombos({ dcrNumbering, icsCycle }))
      .catch(() => setCombos({ dcrNumbering: [], icsCycle: [] }));
  }, []);

  // [E0] 화면 열림 (생성자 L34-51) / retrieve(param) L117-120 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) crud.retrieve(); else crud.clear(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] updateButton[저장].Select (L37) → update() */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
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
