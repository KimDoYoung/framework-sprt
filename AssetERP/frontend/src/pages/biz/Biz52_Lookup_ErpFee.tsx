/**
 * AssetERP 계약사별 사용료 창 (EE22) — Biz51_Tab_ErpContCorp 행의 사용료 아이콘, Biz51_Edit_ErpContCorp의 사용료 칸이 연다
 * AS-IS: myApp/client/vi/biz/Biz52_Lookup_ErpFee.java (398줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-102: 모달 1500×340 "사용료", 위 [조회][등록][저장][삭제] / 셀 편집 그리드(체크 단일, 헤더 묶음 추가요금청구) / [닫기](callback 후 닫기)
 * buildGrid() L137-208: 적용시작일 100·적용종료일 100(날짜) · 시스템사용료 100 · DATA사용료 100 · 기본제공 월문자건수 90 · 추가 건당 문자사용료 90 · 기본제공 서버사용량(GB) 100
 *   · 서버사용량 추가단위(GB) 100 · 서버사용량 추가당 금액 100 · 기본제공 사용인원 90 · 추가 인당 사용료(원) 90(숫자) · 청구계산월 100(콤보 MonthType) · 인원산정기준월 100(콤보 UserCountStdMonthCode)
 *   · 월청구일 80·입금기한일 80(콤보 DateCode) · VAT 70(콤보 VatCode) · 추가요금청구 문자·서버·사용자 60(체크박스)
 * 개선(10, 사용자 승인 2026-11-03, 03 원칙 4 예외): [등록]이 직전 행의 적용종료일 객체를 직접 바꿔(addDaysToDate) 그리드의 직전 행 종료일이 하루 밀려 보이던 것을,
 *   새 행의 적용시작일만 종료일+1일로 계산하고 직전 행은 건드리지 않게 했다
 * UX보강(10): 저장(n) UX-03, 변경 표시 UX-07, 날짜 컬럼 폭 UX-08(편집 120), 조회창 UX-05
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import dayjs from 'dayjs';
import { bizErpFeeApi, bizErpSetupApi } from '@/api/bizErp';
import { sysApi } from '@/api/sys';
import { BizErpFee } from '@/types/bizErp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<BizErpFee>();
/** setChecked(SINGLE) — 저장·삭제용 체크라 행 클릭이 선택을 바꾸지 않게 한다(03 원칙 16 예외). 상수로 넘긴다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true } as const;

/** 콤보(이름 → 코드) 열: 고르면 코드와 이름을 함께 바꾼다 */
const comboCol = (codes: Code[], codeField: keyof BizErpFee, nameField: keyof BizErpFee) => ({
  editor: 'select' as const,
  values: codes.map(c => c.name),
  valueSetter: (p: { data: BizErpFee; newValue: string }) => {
    (p.data as unknown as Record<string, unknown>)[nameField] = p.newValue;
    (p.data as unknown as Record<string, unknown>)[codeField] = codes.find(c => c.name === p.newValue)?.code ?? null;
    return true;
  },
});

/** 직전 사용료를 복사하는 열 (insertRow L275-302) */
const COPY_FIELDS: (keyof BizErpFee)[] = [
  'dataFee', 'erpFee', 'smsBaseCount', 'smsAddPrice', 'serverBaseUsage', 'serverAddUnit', 'serverAddPrice', 'userBaseCount', 'userAddPrice',
  'chargeCalcMonthType', 'chargeCalcMonthTypeNm', 'userCountStdCd', 'userCountStdStr', 'chargeDay', 'depositDueDay', 'chargeDayStr', 'depositDueDayStr',
  'vatCd', 'vatNm', 'addFeeSmsYn', 'addFeeServerYn', 'addFeeUserYn',
];

interface Props {
  /** open(updateModel, callback) — 값이 있으면 열린다 (AssetERP 계약사 ID) */
  erpContCorpId: number | null;
  /** callback.execute() 후 hide() — 닫을 때 부른다 */
  onClose: () => void;
}

export const Biz52_Lookup_ErpFee: React.FC<Props> = ({ erpContCorpId, onClose }) => {
  const [dateCodes, setDateCodes] = useState<Code[]>([]);
  const [vatCodes, setVatCodes] = useState<Code[]>([]);
  const [monthTypes, setMonthTypes] = useState<Code[]>([]);
  const [userStdCodes, setUserStdCodes] = useState<Code[]>([]);

  useEffect(() => {
    sysApi.searchCodes('DateCode').then(setDateCodes).catch(() => setDateCodes([]));
    sysApi.searchCodes('VatCode').then(setVatCodes).catch(() => setVatCodes([]));
    sysApi.searchCodes('MonthType').then(setMonthTypes).catch(() => setMonthTypes([]));
    sysApi.searchCodes('UserCountStdMonthCode').then(setUserStdCodes).catch(() => setUserStdCodes([]));
  }, []);

  const crud = useGridCrud<BizErpFee>({
    idField: 'erpFeeId',
    // retrieve() L210-223: biz.Biz52_ErpFee.selectByErpContCorpId(companyId(서버), erpContCorpId)
    search: useCallback(() => (erpContCorpId != null ? bizErpFeeApi.search(erpContCorpId) : Promise.resolve([])), [erpContCorpId]),
    // update() L246-253: biz.Biz52_ErpFee.update → retrieve()
    save: useCallback((changed: BizErpFee[]) => bizErpFeeApi.save(changed), []),
    reloadAfterSave: true,
    // GridDeleteData → biz.Biz52_ErpFee.delete
    remove: useCallback((ids: number[]) => bizErpFeeApi.delete(ids), []),
    newRow: useCallback(() => ({ erpContCorpId: erpContCorpId ?? undefined }), [erpContCorpId]),
    // update() L226-244: 바뀐 행마다 차례로 적용시작일 → 시스템사용료 → DATA사용료 검사
    validate: useCallback((changed: BizErpFee[]) => {
      for (const r of changed) {
        if (r.startDate == null) return '적용시작일은 필수입력 항목입니다.';
        if (r.erpFee == null) return '시스템사용료는 필수입력 항목입니다.';
        if (r.dataFee == null) return 'DATA사용료는 필수입력 항목입니다.';
      }
      return undefined;
    }, []),
    deleteConfirm: (count: number) => `${count}건을 삭제하시겠습니까?`,
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L77-102) → settings(), show() · open() L71-75 → retrieve()
  useEffect(() => {
    if (erpContCorpId != null) void crudRetrieve();
  }, [erpContCorpId, crudRetrieve]);

  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용시작일', { editor: 'date' }),  // L187 (UX-08)
    gb.date('closeDate', 120, '적용종료일', { editor: 'date' }),  // L188
    gb.long('erpFee', 100, '시스템사용료', { editor: 'number' }),  // L189
    gb.long('dataFee', 100, 'DATA사용료', { editor: 'number' }),  // L190
    gb.long('smsBaseCount', 90, '기본제공<br>월문자건수', { editor: 'number' }),  // L191
    gb.long('smsAddPrice', 90, '추가 건당<br>문자사용료', { editor: 'number' }),  // L192
    gb.long('serverBaseUsage', 100, '기본제공<br>서버사용량(GB)', { editor: 'number' }),  // L193
    gb.long('serverAddUnit', 100, '서버사용량<br>추가단위(GB)', { editor: 'number' }),  // L194
    gb.long('serverAddPrice', 100, '서버사용량<br>추가당 금액', { editor: 'number' }),  // L195
    gb.long('userBaseCount', 90, '기본제공<br>사용인원', { editor: 'number' }),  // L196
    gb.long('userAddPrice', 90, '추가 인당<br>사용료(원)', { editor: 'number' }),  // L197
    gb.textCenter('chargeCalcMonthTypeNm', 100, '청구계산월', comboCol(monthTypes, 'chargeCalcMonthType', 'chargeCalcMonthTypeNm')),  // L198 [E10] chargeCalcMonthTypeCombo.Collapse (L177)
    gb.textCenter('userCountStdStr', 100, '인원산정기준월', comboCol(userStdCodes, 'userCountStdCd', 'userCountStdStr')),  // L199 [E9] userCountStdCombo.Collapse (L168)
    gb.textCenter('chargeDayStr', 80, '월청구일', comboCol(dateCodes, 'chargeDay', 'chargeDayStr')),  // L200 [E6] dateCombo01.Collapse (L141)
    gb.textCenter('depositDueDayStr', 80, '입금기한일', comboCol(dateCodes, 'depositDueDay', 'depositDueDayStr')),  // L201 [E7] dateCombo02.Collapse (L150)
    gb.textCenter('vatNm', 70, 'VAT', comboCol(vatCodes, 'vatCd', 'vatNm')),  // L202 [E8] vatCombo.Collapse (L159)
    gb.group('추가요금청구', [  // L185 HeaderGroupMap(0, 18) span 3
      gb.boolean('addFeeSmsYn', 60, '문자', { editable: true }),  // L203
      gb.boolean('addFeeServerYn', 60, '서버', { editable: true }),  // L204
      gb.boolean('addFeeUserYn', 60, '사용자', { editable: true }),  // L205
    ]),
  ], [dateCodes, vatCodes, monthTypes, userStdCodes]);

  // [E2] insertButton[등록].Select (L111) → insertRow() L255-360 (맨 아래에 넣는다, 03 원칙 17)
  const insertRow = async () => {
    if (erpContCorpId == null) return;
    const base: Partial<BizErpFee> = { erpContCorpId };
    // GridInsertRow 는 값이 든 새 행을 넣어도 변경으로 치지 않는다 → addRows(…, false)
    if (crud.rows.length > 0) {
      // 시작일이 있는 행 중 가장 늦은(같으면 먼저 나온) 행
      let last: BizErpFee | null = null;
      for (const r of crud.rows) {
        if (r.startDate != null && (last == null || dayjs(r.startDate).isAfter(dayjs(last.startDate)))) last = r;
      }
      if (last) {
        // 개선(승인): 직전 행의 종료일 객체를 바꾸지 않고 새 날짜를 계산한다
        const init: Record<string, unknown> = { ...base, startDate: last.closeDate ? dayjs(last.closeDate).add(1, 'day').format('YYYY-MM-DD') : null };
        for (const f of COPY_FIELDS) init[f] = last[f];
        crud.addRows([init as Partial<BizErpFee>], false);
      } else {
        crud.addRows([base], false);
      }
      return;
    }
    // 목록이 비었으면 biz.Biz50_ErpSetup.selectByStartDate(오늘) 기본설정으로 채운다 (없으면 빈 행)
    const setup = await bizErpSetupApi.current(dayjs().format('YYYY-MM-DD')).catch(() => null);
    if (!setup) { crud.addRows([base], false); return; }
    crud.addRows([{
      ...base,
      smsBaseCount: setup.smsBaseCount, smsAddPrice: setup.smsAddPrice, serverBaseUsage: setup.serverBaseUsage, serverAddUnit: setup.serverAddUnit,
      serverAddPrice: setup.serverAddPrice, userBaseCount: setup.userBaseCount, userAddPrice: setup.userAddPrice,
      chargeCalcMonthType: '1', chargeCalcMonthTypeNm: '당월', userCountStdCd: '1', userCountStdStr: '전월말',
      chargeDay: setup.chargeDay, depositDueDay: setup.depositDueDay, chargeDayStr: setup.chargeDayStr, depositDueDayStr: setup.depositDueDayStr,
      vatCd: setup.vatCd, vatNm: setup.vatNm, addFeeSmsYn: 'true', addFeeServerYn: 'true', addFeeUserYn: 'true',
    }], false);
  };

  return (
    <LookupModal
      open={erpContCorpId != null}
      title="사용료"
      width="min(1500px, 96vw)"
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] cancelButton[닫기].Select (L129) → close(): callback.execute(), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 250px)', minHeight: 260, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L105) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          <Button type="register" onClick={() => void insertRow()}>등록</Button>
          {/* [E3] updateButton[저장].Select (L117) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L123) → deleteChk() → [E11] msgBox.DialogHide [YES] (L367) → deleteRow() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<BizErpFee> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
        </div>
      </div>
    </LookupModal>
  );
};
