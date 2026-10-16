/**
 * 기본정보 탭 (A15-3) — Sys01_Tab_Company 아래 탭 2번째.
 * AS-IS: myApp/client/vi/sys/Sys01_TabPage_Info02.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 회사 1행을 셀 편집 그리드로 보여 주고 저장한다(행번호 숨김, 정렬 없음, 체크박스 없음).
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { sysApi } from '@/api/sys';
import { CompanyBasic } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import type { CompanyTabProps } from './Sys01_Tab_Company';

const gb = gbFor<CompanyBasic>();

/** AS-IS setHtmlIconGridStyle(header, "0069B4"): 헤더 글자색 */
const blueHeader = { headerStyle: { color: '#0069B4' } };

/** AS-IS buildGrid() L57-75 */
const buildGrid = () => [
  gb.date('startDate', 100, '설립일', { editor: 'date', ...blueHeader }),  // L62
  gb.textCenter('bizNo', 120, '사업자등록번호', { editor: 'text', ...blueHeader }),  // L63
  gb.textCenter('decCorpRegNo', 120, '법인등록번호', { editor: 'text', ...blueHeader }),  // L64 selectById: to_decrypts(sys01_corp_reg_no)
  gb.textCenter('empInfo', 200, '담당자(이름/부서/직책)', { editor: 'text' }),  // L65
  gb.textCenter('mobileTelNo', 120, '비상전화', { editor: 'text' }),  // L66
  gb.textCenter('officeTelNo', 120, '대표전화', { editor: 'text' }),  // L67
  gb.textCenter('officeFaxNo', 120, 'FAX번호', { editor: 'text' }),  // L68
  gb.text('emailAddr', 150, '이메일주소', { editor: 'text' }),  // L69
  gb.textCenter('zipCd', 80, '우편번호', { editor: 'text' }),  // L70
  gb.text('zipAddr', 350, '주소', { editor: 'text' }),  // L71
  gb.text('zipDetail', 150, '상세주소', { editor: 'text' }),  // L72
];

export const Sys01_TabPage_Info02: React.FC<CompanyTabProps> = ({ companyId }) => {
  const crud = useGridCrud<CompanyBasic>({
    idField: 'companyId',
    // retrieve() L82-86: 서비스 sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => (companyId ? [await sysApi.getCompanyBasic(companyId)] : []), [companyId]),
    // updateCorpRegNo() L88-115 → update() L117-120: 변경 행만. 법인등록번호가 있으면 getCorpRegNo(to_encrypts)로
    // 암호값을 넣고 저장 — TOBE는 서버가 한 번에 한다(값이 없으면 암호값 그대로)
    save: useCallback((rows: CompanyBasic[]) => Promise.all(rows.map(sysApi.updateCompanyBasic)), []),
    remove: async () => undefined, // 이 탭에는 삭제가 없다
    newRow: () => ({}), // 이 탭에는 행추가가 없다
  });

  const columnDefs = useMemo(() => buildGrid(), []);

  // [E0] 화면 열림 (생성자 L38-55) / retrieve(param) L122-125 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) crud.retrieve(); else crud.clear(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, boxSizing: 'border-box' }}>
      <Space>
        {/* [E1] updateButton[저장].Select (L41) → updateCorpRegNo() */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CompanyBasic>
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
