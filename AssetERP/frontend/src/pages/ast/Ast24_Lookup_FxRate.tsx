/**
 * 환율입력 조회창 (X12) — Ast06_Tab_FxEvalDeposit [환율입력]이 연다 (평가환율 fxRateType 01).
 * AS-IS: myApp/client/vi/ast/Ast24_Lookup_FxRate.java (239줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate) L69-72 → setting() L91-144: 모달 750×500 "환율입력", 툴바(기준일자 100 · 통화코드 80 `CurCode` "전체"(KRW 뺌) · [조회][등록][저장][삭제]) + 체크박스 셀 편집 그리드
 * (기준일자 100 날짜 · 통화 80 콤보 · 적용환율 120 실수 · 비고 350 글자 — 모두 편집), 아래 [닫기]. 조회창이므로 모달은 LookupModal
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), [저장(n)] UX-03, 조회창 UX-05·06
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { AstFxRate } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstFxRate>();
const FORMAT = 'YYYY-MM-DD';
const FX_RATE_TYPE = '01';  // 평가환율

interface Props {
  /** open(stdDate)의 기준일자 — 값이 있으면 열린다 */
  stdDate: Dayjs | null;
  onClose: () => void;
}

export const Ast24_Lookup_FxRate: React.FC<Props> = ({ stdDate, onClose }) => {
  const open = stdDate !== null;
  const [date, setDate] = useState<Dayjs>(() => stdDate ?? dayjs());
  const [curCode, setCurCode] = useState('%');
  const dateRef = useRef(date);
  dateRef.current = date;
  const curRef = useRef('%');
  const [curCodes, setCurCodes] = useState<Code[]>([]);

  useEffect(() => { sysApi.searchCodes('CurCode').then(setCurCodes).catch(() => {}); }, []);

  // retrieve() L168-183: ast.Ast24_FxRate.selectByStdDate(companyId, stdDate, curCode, fxRateType "01")
  const search = useCallback(() => astApi.searchFxRates(dateRef.current.format(FORMAT), curRef.current), []);
  // update() L185-192: 변경이 없으면 "변동내역이 없습니다."(TOBE는 [저장(0)] 비활성) → ast.Ast24_FxRate.update
  const save = useCallback((changed: AstFxRate[]) => astApi.saveFxRates(changed), []);
  const remove = useCallback((ids: number[]) => astApi.deleteFxRates(ids), []);
  // insertRow() L194-202: 기준일자 = 툴바의 기준일자, 구분 "01"
  const newRow = useCallback((): Partial<AstFxRate> => ({ stdDate: dateRef.current.format(FORMAT), fxRateType: FX_RATE_TYPE }), []);

  const crud = useGridCrud<AstFxRate>({
    idField: 'fxRateId', search, save, remove, newRow, firstEditField: 'curCode',
    deleteConfirm: n => `${n}건의 환율정보를 삭제하시겠습니까?`,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 → show() / [E1] 콤보 만들어지면 retrieve() — 열 때마다 새 창이라 조건을 처음으로 되돌리고 조회한다
  useEffect(() => {
    if (!open) return;
    const d = stdDate ?? dayjs();
    setDate(d);
    dateRef.current = d;
    curRef.current = '%';
    setCurCode('%');
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L146-166: CellEditGrid(체크박스). [E8] comboCurCode[CurCode].Expand (L150) → 펼칠 때 KRW를 뺀다(선택지에서 처음부터 뺀다)
  const columnDefs = useMemo(() => [
    gb.date('stdDate', 100, '기준일자', { editor: 'date' }),                                        // L160
    gb.textCenter('curCode', 80, '통화', { editor: 'select', values: curCodes.map(c => c.code).filter(c => c !== 'KRW') }),  // L161
    gb.double('applyFxRate', 120, '적용환율', { editor: 'number' }),                                 // L162
    gb.text('note', 350, '비고', { editor: 'text' }),                                                // L163
  ], [curCodes]);

  return (
    <LookupModal open={open} title="환율입력" width={810} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] cancleButton[닫기].Select (L103) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L109) → retrieve(), [E5] [등록] (L115) → insertRow(), [E6] [저장] (L121) → update(), [E7] [삭제] (L127) → deleteRow() → [E9] YES → ast.Ast24_FxRate.delete */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={<>
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" disabled={!crud.hasChecked} onClick={crud.deleteChecked}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={date} format={FORMAT} onChange={d => d && setDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="통화코드">
            {/* [E2] curCodeCombo[CurCode].Collapse (L96) → retrieve() */}
            <SystemCodeComboBox kindCd="CurCode" altCode={['%', '전체']} removeNames={['KRW']} style={{ width: 100 }} value={curCode}
              onChange={code => { curRef.current = code ?? '%'; setCurCode(code ?? '%'); void retrieve(); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AstFxRate> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
