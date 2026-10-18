/**
 * 율관리 탭 (E22) — Pay20_Tab_DeductAdmin 하위 3번째 탭
 * AS-IS: myApp/client/vi/pay/Pay21_TabPage_Rate.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-75: 툴바(율 구분 콤보 120 · 조회 · [관리자만] 등록·저장·삭제) + 체크박스 다중 셀 편집 그리드
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 초기화 버튼이 없어 onReset(UX-02)은 넣지 않는다
 * 부모(Pay20_Tab_DeductAdmin)가 forwardRef 핸들로 retrieve()를 부른다(탭을 고를 때 retrieveTabpage)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { PayRate } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PayTabPageHandle } from './Pay20_TabPage_Item';

const gb = gbFor<PayRate>();

/**
 * AS-IS buildGrid() L123-143: setChecked(MULTI).
 * [E6] RateTypeComboBox[RateCode].Collapse (L127) → 고른 이름에 맞춰 코드(rateCode)도 바꾼다
 */
const buildGrid = (rateCodes: Code[]) => [
  gb.text('rateName', 150, '율 구분', {  // L137
    editor: 'select',
    values: rateCodes.map(c => c.name),
    valueSetter: p => {
      p.data.rateName = p.newValue;
      p.data.rateCode = rateCodes.find(c => c.name === p.newValue)?.code ?? p.data.rateCode;
      return true;
    },
  }),
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L138
  gb.double('applyRate', 80, '율(%)', { editor: 'number' }),  // L139
  gb.text('note', 600, '비고', { editor: 'text' }),  // L140
];

// [E0] 화면 열림 (생성자 L57-75) → settings() L77-121: 율 구분 "전체"(%), 마지막에 retrieve()
export const Pay21_TabPage_Rate = forwardRef<PayTabPageHandle>((_props, ref) => {
  const user = useLoginUser();
  const isAdminCompany = user.companyId === 0;  // L66 LoginUser.getCompanyId() == 0일 때만 등록·저장·삭제
  const [rateCodes, setRateCodes] = useState<Code[]>([]);
  const [rateCode, setRateCode] = useState('%');
  const columnDefs = useMemo(() => buildGrid(rateCodes), [rateCodes]);

  const crud = useGridCrud<PayRate>({
    idField: 'rateId',
    // retrieve() L155-169: rateCode(콤보 코드, 없으면 "%") → pay.Pay21_Rate.selectByCode
    search: useCallback(() => payApi.searchRates(rateCode), [rateCode]),
    save: payApi.saveRates,
    remove: payApi.deleteRates,
    // insertRow() L186-190: 빈 모델
    newRow: useCallback(() => ({}), []),
    firstEditField: 'rateName',
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',  // deleteRow() L192-207
  });

  useImperativeHandle(ref, () => ({ retrieve: crud.retrieve }));

  useEffect(() => {
    sysApi.searchCodes('RateCode').then(setRateCodes).catch(() => {});
  }, []);

  // [E0] 열 때 조회 + [E1] RateComboBox[RateCode].Collapse (L88) → retrieve(): 율 구분을 고르면 바로 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [rateCode]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] retrieveButton[조회].Select (L95) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={isAdminCompany && <>
        {/* [E3] insertButton[등록].Select (L101) → insertRow() L186-190 */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E4] updateButton[저장].Select (L107) → update() L171-184. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E5] deleteButton[삭제].Select (L113) → deleteRow() L192-207 → [E7] messageBox.DialogHide [YES] (L195) → pay.Pay21_Rate.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>}>
        <SearchBar.Field label="율 구분">
          <SystemCodeComboBox kindCd="RateCode" altCode={['%', '전체']} style={{ width: 120 }} value={rateCode} onChange={v => setRateCode(v ?? '%')} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayRate> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
});
