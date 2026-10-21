/**
 * 기준관리 (J09) — 준법감시 > 11. 임직원매매(준감인) > 기준관리 #1145
 * AS-IS: myApp/client/vi/flt/Flt01_Tab_CompanyStd.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-133: center = vlc = 툴바(조회 · 등록 · 등록(복사) · 저장 · 삭제 · 종목유형설정 · 매수제한종목 · 예외사원) / 회사 기준 셀 편집 그리드(체크박스 다중).
 * 의무보유기간 열의 편집 아이콘이 조회창 Flt01_Lookup_LockUpCheckType을, [종목유형설정]·[매수제한종목]이 조회창 Flt05_Lookup_ItemType·Flt08_Lookup_LockupItem을 연다.
 * [예외사원](Flt16_Lookup_ExceptPerson)은 asseterpdb에 flt16_except_person 테이블이 없어 변환하지 못했다(03 원칙 1) — 누르면 안내만 한다.
 * UX보강(10): 툴바 = SearchBar(UX-01, 조건 없음), 저장 = 저장(n)(UX-03), 편집 날짜 열 120(UX-08), 변경 표시(UX-07)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { sysApi } from '@/api/sys';
import { FltCompanyStd } from '@/types/flt';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Flt01_Lookup_LockUpCheckType } from './Flt01_Lookup_LockUpCheckType';
import { Flt05_Lookup_ItemType } from './Flt05_Lookup_ItemType';
import { Flt08_Lookup_LockupItem } from './Flt08_Lookup_LockupItem';

const gb = gbFor<FltCompanyStd>();

/** 코드 이름을 고르면 코드 열도 바꾸는 select 편집기 (E9·E10 investAmtCalcTargetComboBox·stdDateTypeComboBox.Collapse → addChange) */
const codeSelect = (codes: Code[], nameField: 'investAmtCalcTargetName' | 'stdDateTypeName', codeField: 'investAmtCalcTargetCode' | 'stdDateType') => ({
  editor: 'select' as const,
  values: codes.map(c => c.name),
  valueSetter: (p: { data: FltCompanyStd; newValue: string }) => {
    p.data[nameField] = p.newValue;
    p.data[codeField] = codes.find(c => c.name === p.newValue)?.code ?? p.data[codeField];
    return true;
  },
});

export const Flt01_Tab_CompanyStd: React.FC = () => {
  const [calcTargetCodes, setCalcTargetCodes] = useState<Code[]>([]);
  const [stdDateTypeCodes, setStdDateTypeCodes] = useState<Code[]>([]);
  const [itemTypeOpen, setItemTypeOpen] = useState(false);
  const [lockupItemOpen, setLockupItemOpen] = useState(false);
  const [lockupRow, setLockupRow] = useState<FltCompanyStd | null>(null);

  const crud = useGridCrud<FltCompanyStd>({
    idField: 'companyStdId',
    // retrieve() L197-207: 로그인 회사 → flt.Flt01_CompanyStd.selectByCompanyId
    search: useCallback(() => fltApi.searchCompanyStds(), []),
    // update() L210-213: GridUpdate → flt.Flt01_CompanyStd.update
    save: useCallback((rows: FltCompanyStd[]) => fltApi.updateCompanyStds(rows), []),
    // delete() L272-276: GridDeleteData → flt.Flt01_CompanyStd.delete
    remove: useCallback((ids: number[]) => fltApi.deleteCompanyStds(ids), []),
    // insertRow() L216-230: 회사 = 로그인 회사(서버가 채움), 적용시작일 = 오늘, 의무보유기간 체크 "1"(보유기간), 매매유효일 계산기준 "1"(신청일),
    //   투자금액 계산기준 "1"(매매금액), 의무보유기간 계산기준 "D"(영업일)
    newRow: useCallback(() => ({
      startDate: dayjs().format('YYYY-MM-DD'),
      lockUpCode: '1',
      stdDateType: '1', stdDateTypeName: '신청일',
      investAmtCalcTargetCode: '1', investAmtCalcTargetName: '매매금액',
      lockUpCalcStdCode: 'D',
      investAmtOverCheckYn: 'false', investLimitUnvisibleYn: 'false', fundHoldStkYn: 'false', trFileEvidYn: 'false', noAccountSkipYn: 'false',
    }), []),
    firstEditField: 'startDate',
    // deleteRow() L252-270: "n건의 정보를 삭제하시겠습니까?" → E11 delete()
    deleteConfirm: (n: number) => `${n}건의 정보를 삭제하시겠습니까?`,
  });
  const crudRef = useRef(crud);
  crudRef.current = crud;

  useEffect(() => {
    sysApi.searchCodes('FloorTrInvestCalcTargetCode').then(setCalcTargetCodes).catch(() => undefined);
    sysApi.searchCodes('FloorTrStdDateType').then(setStdDateTypeCodes).catch(() => undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L56-133) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  // buildGrid() L135-194
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용<br>시작일자', { editor: 'date' }),  // L176 (원본 90 → 편집 날짜 120, UX-08)
    gb.long('totalInvestAmt', 110, '총누적<br>투자금액(원)', { editor: 'number' }),  // L177
    // [E9] investAmtCalcTargetComboBox[FloorTrInvestCalcTargetCode].Collapse (L140) → 고른 코드를 그 행의 investAmtCalcTargetCode에 addChange
    gb.textCenter('investAmtCalcTargetName', 100, '투자금액<br>계산기준', codeSelect(calcTargetCodes, 'investAmtCalcTargetName', 'investAmtCalcTargetCode')),  // L178
    gb.boolean('investAmtOverCheckYn', 80, '투자금액<br>매수제한', { editable: true }),  // L179
    gb.boolean('investLimitUnvisibleYn', 80, '투자한도<br>표시제한', { editable: true }),  // L180
    gb.long('turnoverRate', 110, '월간<br>매매회전율(%)', { editor: 'number' }),  // L181
    gb.long('apprOverRate', 110, '사전승인금액<br>초과비율(%)', { editor: 'number' }),  // L182
    gb.long('apprQtyOverRate', 110, '사전승인수량<br>초과비율(%)', { editor: 'number' }),  // L183
    gb.long('apprValidDays', 100, '사전승인<br>유효기간<br>(영업일기준)', { editor: 'number' }),  // L184
    // [E10] stdDateTypeComboBox[FloorTrStdDateType].Collapse (L149) → 고른 코드를 그 행의 stdDateType에 addChange
    gb.textCenter('stdDateTypeName', 100, '매매유효일<br>계산기준', codeSelect(stdDateTypeCodes, 'stdDateTypeName', 'stdDateType')),  // L185
    gb.boolean('fundHoldStkYn', 100, '펀드(일임)<br>보유주식<br>매수제한', { editable: true }),  // L186
    gb.text('lockUpDetailName', 280, '의무보유기간 위반 체크 방식'),  // L187
    // L188 actionCell: 편집 아이콘 → 저장되지 않은 변경이 있으면 알리고, 없으면 Flt01_Lookup_LockUpCheckType (lockUpCell L152-171)
    iconCell<FltCompanyStd>('edit', 'actionCell', 40, ' ', row => {
      if (crudRef.current.hasChanges()) {
        Modal.info({
          title: '확인',
          width: 450,
          content: <>저장되지 않은 변경 데이터가 존재합니다.<br />저장 후 [의무보유기간 위반 체크 방식] 변경이 가능합니다.</>,
        });
        return;
      }
      setLockupRow(row);
    }),
    gb.date('rptStartDate', 120, '매매등록<br>시작일자', { editor: 'date' }),  // L189 (UX-08)
    gb.boolean('trFileEvidYn', 100, '정기보고시<br>거래없어도<br>거래증빙필수', { editable: true }),  // L190
    gb.boolean('noAccountSkipYn', 100, '계좌미존재시<br>정기보고<br>안함', { editable: true }),  // L191
  ], [calcTargetCodes, stdDateTypeCodes]);

  // [E3] copyButton[등록(복사)].Select (L71) → copyInsertRow() L232-249: 체크한 한 건을 복사해 적용시작일 = 오늘인 새 행으로 넣는다
  const copyInsertRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('복사할 대상을 선택하세요'); return; }
    if (selected.length !== 1) { message.warning('대상은 한개만 선택하세요'); return; }
    const { companyStdId: _id, ...rest } = selected[0];  // eslint-disable-line @typescript-eslint/no-unused-vars
    crud.addRows([{ ...rest, startDate: dayjs().format('YYYY-MM-DD') }], false);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L59) → retrieve() */}
        <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
          {/* [E2] insertButton[등록].Select (L65) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
          {/* [E4] updateButton[저장].Select (L77) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E5] deleteButton[삭제].Select (L83) → deleteRow() L252-270, [E11] msgBox.DialogHide [YES] (L255) → delete() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          {/* [E6] itemTypeButton[종목유형설정].Select (L89) → Flt05_Lookup_ItemType.open() */}
          <Button type="group" onClick={() => setItemTypeOpen(true)}>종목유형설정</Button>
          {/* [E7] lockupItemButton[매수제한종목].Select (L96) → Flt08_Lookup_LockupItem.open() */}
          <Button type="assign" onClick={() => setLockupItemOpen(true)}>매수제한종목</Button>
          {/* [E8 생략] exceptEmpButton[예외사원].Select (L103) → Flt16_Lookup_ExceptPerson.open() — flt16_except_person 테이블이 asseterpdb에 없다 */}
          <Button onClick={() => message.warning('예외사원 설정은 asseterpdb에 예외사원 테이블(flt16_except_person)이 없어 사용할 수 없습니다.')}>예외사원</Button>
        </>} />
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<FltCompanyStd> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Flt05_Lookup_ItemType open={itemTypeOpen} onClose={() => setItemTypeOpen(false)} />
      <Flt08_Lookup_LockupItem open={lockupItemOpen} onClose={() => setLockupItemOpen(false)} />
      <Flt01_Lookup_LockUpCheckType
        row={lockupRow}
        onResult={saved => crud.replaceRow(saved.companyStdId, saved)}
        onClose={() => setLockupRow(null)}
      />
    </div>
  );
};
