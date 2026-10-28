/**
 * 4대보험 연말정산 납부상세 창 (S16) — Pay11_TabPage_MonthItem의 [4대보험 연말정산 납부상세]가 연다.
 * AS-IS: myApp/client/vi/pay/Pay32_Lookup_Detail.java (267줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * settings() L82-170: 1150×480 모달 "납부상세", 위 툴바(기준년도 50 "YYYY" · 구분 콤보 120 = 코드그룹 InsureCode003 · [조회][저장][등록][삭제]) + 셀 편집 그리드
 *   (일자 100 · 정산보험료 150 · 납부방법 120(DivPayCode 콤보) · 분할납부회차 150 · 납부회차 150 · 납부금액 150 · 잔여금액 150). 체크 열이 없다 — 고른 한 행을 삭제
 * 열 때(open(monthModel) L69): 구분 = 건강보험, 기준년도 = 급여 지급일의 전년도, 그 뒤 바로 조회
 *   open(insurePayModel) L64 (S27 4대보험 정산내역의 [납부상세]): 구분·기준년도를 그 정산 행에서
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PayInsurePay } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<PayInsurePay>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  /** open(monthModel) — 급여의 사원과 지급일(`payDate`). open(insurePayModel)(S27) — 정산 행의 사원·기준년도(`year`)·구분 이름(`insureName`). null이면 닫힘 */
  target: { personId: number; payDate?: string; year?: string; insureName?: string } | null;
  onClose: () => void;
}

export const Pay32_Lookup_Detail: React.FC<Props> = ({ target, onClose }) => {
  // [E0] 화면 열림 (생성자 L74-80) → 초기화: 1150×480 모달 "납부상세"
  const [year, setYear] = useState('');
  const [insureCode, setInsureCode] = useState<string | undefined>(undefined);
  const [divPays, setDivPays] = useState<Code[]>([]);
  const queryRef = useRef({ year: '', insureCode: undefined as string | undefined });
  queryRef.current = { year, insureCode };
  const targetRef = useRef(target);
  targetRef.current = target;

  const crud = useGridCrud<PayInsurePay>({
    idField: 'insurePayId',
    // retrieve() L196-208: pay.Pay32_InsurePay.selectByPersonId(personId, insureCode, year)
    search: useCallback(() => (targetRef.current
      ? payApi.searchInsurePays(targetRef.current.personId, queryRef.current.insureCode ?? '', queryRef.current.year)
      : Promise.resolve([])), []),
    save: useCallback((rows: PayInsurePay[]) => payApi.saveInsurePays(rows), []),
    remove: useCallback((ids: number[]) => payApi.deleteInsurePays(ids), []),
    // insertRow() L215-232: 구분을 먼저 골라야 한다. 회사·년도·구분·사원을 채운 새 행
    newRow: () => ({
      personId: targetRef.current?.personId ?? 0,
      year: queryRef.current.year,
      insureCd: queryRef.current.insureCode,
    }),
    firstEditField: 'date',
    deleteConfirm: false,
  });
  const { retrieve } = crud;

  // [E1] insureName callbackOnCreate (L88): 구분 = 건강보험, 기준년도 = 지급일의 전년도, retrieve()
  useEffect(() => {
    if (!target) return;
    // open(Pay32_InsurePayModel) L97-99: 구분·기준년도를 정산 행에서 / open(Pay10_MonthModel) L92-95: 건강보험, 지급일의 전년도
    const y = target.year ?? String(Number((target.payDate ?? '').slice(0, 4)) - 1);
    setYear(y);
    sysApi.searchCodesByKindGroup('InsureCode003').then(list => {
      const code = list.find(c => c.name === (target.insureName ?? '건강보험'))?.code;
      queryRef.current = { year: y, insureCode: code };
      setInsureCode(code);
      void retrieve();
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
    sysApi.searchCodes('DivPayCode').then(setDivPays).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // buildGrid() L172-194
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자', { editor: 'date' }),
    gb.long('tgtAmt', 150, '정산보험료', { editor: 'number' }),
    gb.textCenter('payNm', 120, '납부방법', {
      editor: 'select',
      values: [...new Set(divPays.map(c => c.name))],
      // [E8] divPayComboBox.Collapse (L174): 고른 코드·이름을 행에 반영
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.payNm = p.newValue;
        d.payCd = divPays.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.longCenter('payDiv', 150, '분할납부회차', { editor: 'number' }),
    gb.longCenter('cnt', 150, '납부회차', { editor: 'number' }),
    gb.long('amt', 150, '납부금액', { editor: 'number' }),
    gb.long('remAmt', 150, '잔여금액', { editor: 'number' }),
  ], [divPays]);

  // [E5] insertButton[등록].Select (L131) → insertRow()
  const insertRow = () => {
    if (!insureCode) {
      message.warning('구분값을 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E7] deleteButton[삭제].Select (L143) → deleteChk() L234-252: "삭제하시겠습니까?"(200폭) YES → deleteRow() L254-258 (고른 한 행)
  const deleteChk = () => {
    Modal.confirm({
      title: '확인',
      content: '삭제하시겠습니까?',
      width: 320,
      okText: '예',
      cancelText: '아니오',
      // [E9] msgBox.DialogHide [YES] (L237) → deleteRow()
      onOk: async () => {
        const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
        if (selected.length === 0) return;
        const ids = selected.map(r => r.insurePayId);
        try {
          const persisted = ids.filter(id => id > 0);
          if (persisted.length > 0) await payApi.deleteInsurePays(persisted);
          crud.removeRows(ids);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={target != null}
      title="납부상세"
      width={1150}
      maskClosable={false}
      onCancel={onClose}
      footer={null}
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box' }}>
        {/* [E4] retrieveButton[조회].Select (L125) → retrieve(). [E3] yearText.KeyPress Enter (L116) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={<>
            {/* [E6] updateButton[저장].Select (L137) → update() L210-213: GridUpdate(pay.Pay32_InsurePay.update) */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="기준년도">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E2] insureName.Collapse (L108) → retrieve() — 고른 값이 반영된 뒤 조회한다 */}
            <SystemCodeComboBox kindGroupCd="InsureCode003" allowClear={false} style={{ width: 120 }} value={insureCode}
              onChange={c => { queryRef.current = { ...queryRef.current, insureCode: c }; setInsureCode(c); void retrieve(); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayInsurePay> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
