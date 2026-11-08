/**
 * 환율 및 펀드보수 변경 조회창 (X13) — Ast30_Tab_OfficeMngFeeClose의 [변경] 아이콘이 연다.
 * AS-IS: myApp/client/vi/ast/Ast30_Lookup_FeeClose.java (323줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(feeModel) L75-109: 모달 1100×540 "환율 및 펀드보수 변경", 툴바 50(통화/적용환율: 통화 50(읽기 전용) · 적용환율 70 `#,###.######` · [환율적용] · 검색 250 "펀드코드/펀드명" · [조회])
 *   + 그리드(행번호 · 펀드코드 80 · 펀드명 300 · 누적보수(통화)·누적보수·당기보수(통화)·당기보수·전기보수(통화)·전기보수, 맨 아래 합계 행 getSumGrid("계",1,3,8)), 아래 [저장][닫기]
 *   KRW면 통화 보수 3열을 숨기고 펀드명 400 · 원화 보수 3열 120, 적용환율·[환율적용]은 비활성(setting() L111-145)
 * 누적보수 두 열만 편집(파란 글씨). 조회창이므로 모달은 LookupModal, 편집 그리드는 CellEditGrid + useGridCrud
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), [저장(n)] UX-03, 조회창 UX-05·06
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, InputNumber, Space } from 'antd';
import { astApi } from '@/api/ast';
import { AstFundFeeClose, AstFundFeeFund } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstFundFeeFund>();

/** 저장 뒤 메인 행에 되돌려 주는 합계 — updateAfter() L290-313 */
export interface FeeCloseSaved {
  fee: number;
  forFee: number;
  fxRate: number | null;
}

interface Props {
  /** open(feeModel)의 메인 그리드 행 — 값이 있으면 열린다 */
  feeRow: AstFundFeeClose | null;
  onClose: () => void;
  onSaved: (keyId: number, sum: FeeCloseSaved) => void;
}

export const Ast30_Lookup_FeeClose: React.FC<Props> = ({ feeRow, onClose, onSaved }) => {
  const open = feeRow !== null;
  const curCode = feeRow?.curCode ?? '';
  const isKrw = curCode === 'KRW';
  const [fxRate, setFxRate] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef('');
  const rowRef = useRef<AstFundFeeClose | null>(null);
  rowRef.current = feeRow;
  const [savedTick, setSavedTick] = useState(0);

  // retrieve() L203-222: ast.Ast30_BookFundFee.selectByCorpId(companyId, holdDate, corpId, curCode, "%검색어%")
  const search = useCallback(() => {
    const r = rowRef.current;
    if (!r || r.corpId == null) return Promise.resolve([] as AstFundFeeFund[]);
    return astApi.searchFundFeeFunds({ holdDate: r.holdDate, corpId: r.corpId, curCode: r.curCode ?? '', searchText: searchRef.current });
  }, []);
  // update() L269-288: 결산된 행이면 "결산처리가 완료되었습니다. 취소 후 저장하세요" (변경 없음은 [저장(0)] 비활성)
  const save = useCallback(async (changed: AstFundFeeFund[]) => {
    await astApi.saveFundFeeFunds(rowRef.current?.curCode ?? '', changed.map(r => ({ bookFundFeeId: r.bookFundFeeId, fee: r.fee, forFee: r.forFee, fxRate: r.fxRate })));
    return changed;
  }, []);
  const validate = useCallback(() => (rowRef.current?.closeYnName === '결산' ? '결산처리가 완료되었습니다. 취소 후 저장하세요' : undefined), []);
  const onChanged = useCallback(() => setSavedTick(t => t + 1), []);

  const crud = useGridCrud<AstFundFeeFund>({
    idField: 'bookFundFeeId', search, save, remove: async () => 0, newRow: () => ({}), validate, reloadAfterSave: true, onChanged,
  });
  const { retrieve, rows } = crud;

  // [E0] 화면 열림 → editDriver.edit(feeModel), setting(), retrieve() — 열 때마다 새 창이라 조건을 처음으로 되돌린다
  useEffect(() => {
    if (!open) return;
    setFxRate(feeRow?.fxRate ?? null);
    setSearchText('');
    searchRef.current = '';
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // updateAfter() L290-313: 저장 뒤 다시 읽은 목록의 보수 합계를 메인 행에 넣는다(KRW는 외화 보수 = 보수 합계)
  useEffect(() => {
    if (savedTick === 0 || !feeRow) return;
    const sumFee = rows.reduce((s, r) => s + (r.fee ?? 0), 0);
    const sumForFee = rows.reduce((s, r) => s + (r.forFee ?? 0), 0);
    onSaved(feeRow.keyId, { fee: sumFee, forFee: isKrw ? sumFee : sumForFee, fxRate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTick]);

  // [E2] fxRateButton[환율적용].Select (L158) → calcFee() L224-267: 모든 행의 보수 = (long)(누적보수(통화) × 적용환율), 적용환율을 넣는다 (모든 행이 변경이 된다)
  const calcFee = () => {
    const rate = fxRate ?? 0;
    for (const r of rows) {
      crud.updateRow(r.bookFundFeeId, { fxRate: fxRate, fee: Math.trunc((r.forFee ?? 0) * rate) });
    }
  };

  // buildGrid() L184-197 + setting() L111-145 (analysis grid): 누적보수 두 열만 편집
  const columnDefs = useMemo(() => [
    gb.textCenter('fundCode', 80, '펀드코드'),                                                                             // L187
    gb.text('fundName', isKrw ? 400 : 300, '펀드명'),                                                                      // L188 (KRW 400)
    gb.double('forFee', 110, `누적보수(${curCode})`, { editor: 'number', hide: isKrw }),                                  // L189 (KRW 숨김)
    gb.long('fee', isKrw ? 120 : 110, '누적보수', { editor: 'number' }),                                                  // L190
    gb.double('forTyFee', 100, `당기보수(${curCode})`, { hide: isKrw }),                                                  // L191
    gb.long('tyFee', isKrw ? 120 : 100, '당기보수'),                                                                       // L192
    gb.double('forFixFee', 100, `전기보수(${curCode})`, { hide: isKrw }),                                                 // L193
    gb.long('fixFee', isKrw ? 120 : 100, '전기보수'),                                                                      // L194
  ], [curCode, isKrw]);

  return (
    <LookupModal open={open} title="환율 및 펀드보수 변경" width={1120} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[저장].Select (L170) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L176) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L149) / [E3] retrieveButton[조회].Select (L164) → retrieve() */}
        <SearchBar onSearch={() => { searchRef.current = searchText; void retrieve(); }}>
          <SearchBar.Field label="통화/적용환율">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Input style={{ width: 60 }} value={curCode} disabled />
              <InputNumber style={{ width: 110 }} value={fxRate} disabled={isKrw} stringMode={false}
                formatter={v => (v == null ? '' : Number(v).toLocaleString('en-US', { maximumFractionDigits: 6 }))}
                parser={v => Number(String(v ?? '').replace(/,/g, ''))}
                onChange={v => setFxRate(v == null ? null : Number(v))} />
              {/* [E2] fxRateButton[환율적용].Select (L158) → calcFee() */}
              <Button type="save" disabled={isKrw} onClick={calcFee}>환율적용</Button>
            </div>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="펀드코드/펀드명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AstFundFeeFund> crud={crud} columnDefs={columnDefs}
            sumRow={{ labelField: 'fundCode', label: '계', sum: ['forFee', 'fee', 'forTyFee', 'tyFee', 'forFixFee', 'fixFee'] }} />
        </div>
      </div>
    </LookupModal>
  );
};
