/**
 * [1410] 관리자 > 01. 고객관리 > 고객별 특정화면 관리 (A28)
 * AS-IS: myApp/client/vi/sys/Sys53_Tab_SpecificMenuRequestAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L56-75: 툴바(고객사·구분·특정업무구분 콤보·조회·저장) + 셀 편집 그리드(행번호, 체크박스 단일)
 * UX보강(10) 시범(B11): 툴바 = SearchBar(UX-01 조회 로딩·UX-02 초기화), 저장 = 저장(n)(UX-03)
 * 문서보기 아이콘이 여는 전자결재(Apr01_Edit_ApprDoc)는 다른 도메인이라 이 단계에서 제외 — 작업기록 "의존"
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Select } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, SpecificMenuRequestAdmin } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

type Row = SpecificMenuRequestAdmin;
const gb = gbFor<Row>();
const ALL = '%';  // companyName: "전체" 또는 "%"이면 모든 고객사

/** AS-IS buildGrid() L119-173 */
const buildGrid = (states: Code[], viewDocument: (r: Row) => void) => [
  gb.text('companyNm', 240, '회사명'),
  gb.date('regDate', 100, '신청일'),
  gb.text('personNm', 200, '신청자'),
  gb.text('specificWorkNm', 120, '특정업무'),
  iconCell<Row>('edit', 'actionCell', 80, '문서보기', viewDocument),  // L121-148 actionCell
  gb.textStatus('aprStatusNm', 100, '문서상태'),
  gb.text('confirmNm', 200, '처리자', { editor: 'text' }),
  gb.date('confirmDate', 100, '처리일', { editor: 'date' }),
  // [E4] stateComboBox[SpecificStateCode].Collapse (L153-160) → addChange(stateCode, getCode()) + addChange(stateName, getName())
  gb.textStatus('stateNm', 100, '처리상태', {
    editor: 'select',
    values: states.map(c => c.name),
    valueSetter: p => {
      p.data.stateNm = p.newValue;
      p.data.stateCd = states.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
];

export const Sys53_Tab_SpecificMenuRequestAdmin: React.FC = () => {
  const [companies, setCompanies] = useState<Code[]>([]);
  const [states, setStates] = useState<Code[]>([]);
  // companyName 콤보, specificStateComboBoxField ("SpecificStateCode", 전체), specificWorkComboBoxField ("SpecificWorkCode", 전체)
  const sp = useSearchParams(() => ({ companyCd: ALL, stateCd: ALL, specificWorkCd: ALL }));
  const { companyCd, stateCd, specificWorkCd } = sp.values;

  const crud = useGridCrud<Row>({
    idField: 'specificMenuRequestId',
    // retrieve() L175-196: companyId, stateCode, specificWorkCode → sys.Sys53_SpecificMenuRequest.selectByTextAdmin
    search: useCallback(() => sysApi.searchSpecificMenuRequestsAdmin(companyCd, stateCd, specificWorkCd), [companyCd, stateCd, specificWorkCd]),
    // update() L198-201: GridUpdate → sys.Sys53_SpecificMenuRequest.update
    save: sysApi.updateSpecificMenuRequestsAdmin,
    remove: async () => 0,   // 원본에 삭제·등록 단추가 없다
    newRow: () => ({}),
  });

  // 문서보기 아이콘 (buildGrid L121-148): apr.Apr01_Appr.selectById(apprId) → 없으면 '연관문서가 존재하지않습니다',
  // 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false). 전자결재는 다른 도메인이라 아직 없음
  const viewDocument = useCallback((r: Row) => {
    if (r.apprId == null) {
      message.warning('연관문서가 존재하지않습니다');
      return;
    }
    message.info('전자결재 화면(Apr01_Edit_ApprDoc)은 아직 변환 전입니다');
  }, []);

  const columnDefs = useMemo(() => buildGrid(states, viewDocument), [states, viewDocument]);

  // [E0] 화면 열림 (생성자 L56-75) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCompanyNames().then(setCompanies).catch(err => message.error(errorMessage(err, '조회 실패')));
    sysApi.searchCodes('SpecificStateCode').then(setStates).catch(() => setStates([]));
    void crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L99) → retrieve()
  // 콤보를 바꾸면 바뀐 값으로 조회해야 하므로 값이 바뀐 다음 조회한다
  const [pending, setPending] = useState(false);
  useEffect(() => { if (pending) { setPending(false); void crud.retrieve(); } }, [pending]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box' }}>
      {/* [E2] retrieveButton[조회].Select (L105) → retrieve(). 초기화는 UX-02(원본 없음, 자동 조회 안 함) */}
      <SearchBar onSearch={crud.retrieve} onReset={sp.reset} loading={crud.loading}
        // [E3] updateButton[저장].Select (L111) → update(). 저장(n)은 UX-03
        extra={<Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>}>
        <SearchBar.Field label="고객사">
          <Select style={{ width: 200 }} value={companyCd}
            options={[{ value: ALL, label: '전체' }, ...companies.map(c => ({ value: c.code, label: c.name }))]}
            onChange={v => { sp.set('companyCd', v); setPending(true); }} />
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          <SystemCodeComboBox kindCd="SpecificStateCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={stateCd}
            onChange={v => sp.set('stateCd', v ?? ALL)} />
        </SearchBar.Field>
        <SearchBar.Field label="특정업무구분">
          <SystemCodeComboBox kindCd="SpecificWorkCode" altCode={[ALL, '전체']} style={{ width: 120 }} value={specificWorkCd}
            onChange={v => sp.set('specificWorkCd', v ?? ALL)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* setChecked(SINGLE) = 체크박스 단일 선택 */}
        <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
      </div>
    </div>
  );
};
