/**
 * 전자결재·내부통제 탭 (A15-3) — Sys01_Tab_Company 아래 탭 3번째.
 * AS-IS: myApp/client/vi/sys/Sys01_TabPage_Info03.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 회사 1행을 셀 편집 그리드로 보여 주고 저장한다(행번호 숨김, 정렬 없음, 체크박스 없음).
 * 2026-11-11 변경반영(CH-0183): 원본 최종(IDMS-IC 2026-11-05) 16열로 맞춤 — 상신자 구분(11-04)·연결문서만(11-05)과 함께
 *   그 전부터 원본에 있던 심사필번호 즉시부여·체크리스트 확인자·협의승인 사용·책무이행점검 기산일도 넣고, 제목·폭·순서를 원본대로
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
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

interface Combos { dcrNumbering: Code[]; icsCycle: Code[]; confirmer: Code[]; apprRegEmp: Code[] }

/** AS-IS buildGrid() — 원본 최종 16열(순서·폭·제목 그대로) */
const buildGrid = (c: Combos) => [
  gb.boolean('apprStepLockYn', 100, '결재선 잠금', { editable: true }),
  gb.textCenter('companyRepNm', 200, '(대외문서)<br>대표이사', { editor: 'text' }),
  gb.boolean('aprManagerInfoYn', 130, '(대외문서)<br>담당자정보 포함', { editable: true }),
  // [E2] dcrNumberingComboBox[DcrNumberingCode].ValueChange (L65)
  gb.textCenter('dcrNumberingNm', 100, '문서번호<br>채번방식', combo(c.dcrNumbering, 'dcrNumberingCd', 'dcrNumberingNm')),
  gb.boolean('dcrDetailUseYn', 110, '세부문서분류<br>사용', { editable: true }),
  gb.boolean('icsGuideYn', 120, '문서-연관법규<br>자동반영 사용', { editable: true }),
  gb.boolean('dcrPreconfirmSkipYn', 100, '심사필번호<br>즉시부여', { editable: true }),
  // [E4] icsCheckConfirmerComboBox[IcsCheckListConfirmerType].ValueChange (L84)
  gb.textCenter('icsCheckConfirmerNm', 100, '체크리스트<br>확인자', combo(c.confirmer, 'icsCheckConfirmerType', 'icsCheckConfirmerNm')),
  // [E3] icsCheckCycleComboBox[IcsCheckListCycleType].ValueChange (L74)
  gb.textCenter('icsCheckCycleNm', 100, '체크리스트<br>체크주기', combo(c.icsCycle, 'icsCheckCycleType', 'icsCheckCycleNm')),
  // [E5] icsComplyCycleComboBox[IcsCheckListCycleType].ValueChange (L94)
  gb.textCenter('icsComplyCycleNm', 120, '임직원준수점검<br>체크주기', combo(c.icsCycle, 'icsComplyCycleType', 'icsComplyCycleNm')),
  // [E6] icsComplyApprRegEmpTypeComboBox[ApprRegEmpType].ValueChange (L104, 원본 2026-11-04) — 1 작성자면 #1310에서 작성자가 직접 결재요청
  gb.textCenter('complyApprRegEmpNm', 120, '임직원준수점검<br>상신자', combo(c.apprRegEmp, 'complyApprRegEmpType', 'complyApprRegEmpNm')),
  gb.boolean('icsNonStayYn', 120, '비상근인력 체크', { editable: true }),
  gb.boolean('fltOnlyCurrYn', 150, '임직원매매 사전신고<br>소급 미사용', { editable: true }),
  gb.boolean('fltAddConfirmYn', 150, '임직원매매 사전신고<br>협의승인 사용', { editable: true }),
  gb.date('tdmStartDate', 100, '책무이행점검<br>기산일', { editor: 'date' }),
  gb.boolean('tdmEvidOnlyRelateDcrYn', 100, '책무증빙자료<br>불러오기<br>연결문서만', { editable: true }),  // 원본 2026-11-05
];

export const Sys01_TabPage_Info03: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [combos, setCombos] = useState<Combos>({ dcrNumbering: [], icsCycle: [], confirmer: [], apprRegEmp: [] });

  const crud = useGridCrud<Row>({
    idField: 'companyId',
    // retrieve() L106-110: 서비스 sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => (companyId != null ? [await sysApi.getCompanyApproval(companyId)] : []), [companyId]),
    // update() L112-115: GridUpdate → sys.Sys01_Company.update
    save: useCallback((rows: Row[]) => Promise.all(rows.map(sysApi.updateCompanyApproval)), []),
    remove: async () => undefined, // 이 탭에는 삭제가 없다
    newRow: () => ({}), // 이 탭에는 행추가가 없다
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve, clear: crudClear } = crud;

  const columnDefs = useMemo(() => buildGrid(combos), [combos]);

  useEffect(() => {
    Promise.all([sysApi.searchCodes('DcrNumberingCode'), sysApi.searchCodes('IcsCheckListCycleType'),
      sysApi.searchCodes('IcsCheckListConfirmerType'), sysApi.searchCodes('ApprRegEmpType')])
      .then(([dcrNumbering, icsCycle, confirmer, apprRegEmp]) => setCombos({ dcrNumbering, icsCycle, confirmer, apprRegEmp }))
      .catch(() => setCombos({ dcrNumbering: [], icsCycle: [], confirmer: [], apprRegEmp: [] }));
  }, []);

  // [E0] 화면 열림 (생성자 L34-51) / retrieve(param) L117-120 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  useEffect(() => { if (companyId != null) crudRetrieve(); else crudClear(); }, [companyId, crudRetrieve, crudClear]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] updateButton[저장].Select (L37) → update() */}
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
