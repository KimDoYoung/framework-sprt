/**
 * [1165] 기초자료 > 40. 관리회계 > 거래유형 등록(관리자) (E29)
 * AS-IS: myApp/client/vi/ast/Ast05_Tab_TrCodeAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L78-190: 가운데 = 툴바(거래코드/명 200 · 사용항목만 보기 · [조회][저장][등록][삭제][화면별 거래유형 등록] · 고객사 200(다중 선택) · [기초데이터생성]) + 거래코드 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 툴바가 두 줄로 넘어가(높이 72) 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { TrCode } from '@/types/ast';
import { Code, Company } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Ast15_Lookup_TrCodeWindow } from '@/components/lookup/Ast15_Lookup_TrCodeWindow';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<TrCode>();

/**
 * buildGrid() L192-227
 * - 수령/지급·거래발생구분: 콤보 셀 — [E9]·[E10] Collapse (L196·L206) → 고른 코드·이름을 그 행에 반영 (이름을 보이고 valueSetter로 코드를 저장)
 */
const buildGrid = (rcvPay: Code[], trOcc: Code[]) => [
  gb.textCenter('trCode', 100, '거래코드', { editor: 'text' }),  // L216
  gb.text('trName', 300, '거래명', { editor: 'text' }),  // L217
  gb.textCenter('rcvPayName', 100, '수령/지급', {  // L218
    editor: 'select',
    values: rcvPay.map(c => c.name),
    valueSetter: p => {
      p.data.rcvPayName = p.newValue;
      p.data.rcvPayCode = rcvPay.find(c => c.name === p.newValue)?.code ?? p.data.rcvPayCode;
      return true;
    },
  }),
  gb.textCenter('trOccTypeName', 100, '거래발생구분', {  // L219
    editor: 'select',
    values: trOcc.map(c => c.name),
    valueSetter: p => {
      p.data.trOccTypeName = p.newValue;
      p.data.trOccType = trOcc.find(c => c.name === p.newValue)?.code ?? p.data.trOccType;
      return true;
    },
  }),
  gb.text('itemClassGroupCode', 150, '종목그룹코드', { editor: 'text' }),  // L220
  gb.boolean('financeYn', 100, '금융상품거래', { editable: true }),  // L221
  gb.boolean('lockYn', 100, '잠금', { editable: true }),  // L222
  gb.boolean('useYn', 70, '사용여부', { editable: true }),  // L223
  gb.text('note', 300, '비고', { editor: 'text' }),  // L224
];

export const Ast05_Tab_TrCodeAdmin: React.FC = () => {
  const user = useLoginUser();
  // 생성자 L78-190: 거래코드/명 빈칸 · 사용항목만 보기 켬
  const sp = useSearchParams(() => ({ searchText: '', useYn: true }));
  const [rcvPay, setRcvPay] = useState<Code[]>([]);
  const [trOcc, setTrOcc] = useState<Code[]>([]);
  // companyField·companyList (L120-148): 다중 선택, 칸에는 "첫 고객사 외 N"
  const [companyList, setCompanyList] = useState<Company[] | null>(null);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [windowOpen, setWindowOpen] = useState(false);
  const selectFirst = useRef(false);

  const columnDefs = useMemo(() => buildGrid(rcvPay, trOcc), [rcvPay, trOcc]);

  const crud = useGridCrud<TrCode>({
    idField: 'trCodeId',
    // retrieve() L276-293: 로그인 회사, "%검색어%", 사용항목만 보기, 자산구분 "1" → ast.Ast05_TrCode.selectByCompanyId
    search: useCallback(() => astApi.searchTrCodes(sp.current.current.searchText, sp.current.current.useYn), [sp.current]),
    // update() L296-330: GridUpdate → ast.Ast05_TrCode.update
    save: useCallback((rows: TrCode[]) => astApi.updateTrCodes(rows), []),
    remove: useCallback((ids: number[]) => astApi.deleteTrCodes(ids), []),
    // insertRow() L333-342: 회사 = 로그인 회사, 사용 켬, 자산구분 "1"(서버), 금융상품거래·잠금 끔
    newRow: useCallback(() => ({ companyId: user.companyId, useYn: 'true', financeYn: 'false', lockYn: 'false' }), [user.companyId]),
    firstEditField: 'trCode',
    // update() L296-330: 바뀐 행마다 거래코드 → 거래명 → 수령/지급 순으로 필수 검사
    validate: (changed: TrCode[]) => {
      for (const r of changed) {
        if (r.trCode == null || r.trCode === '') return '거래코드는 필수입력 항목입니다.';
        if (r.trName == null || r.trName === '') return '거래명은 필수입력 항목입니다.';
        if (r.rcvPayName == null || r.rcvPayName === '') return '수령/지급은 필수입력 항목입니다.';
      }
      return undefined;
    },
    // deleteChk() L344-362: "삭제"/"n건의 거래를 삭제하시겠습니까?" → [E11] msgBox.DialogHide [YES] (L347) → deleteRow() L365-369
    deleteConfirm: (n: number) => `${n}건의 거래를 삭제하시겠습니까?`,
  });

  // retrieve() 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L78-190) → retrieve()
  useEffect(() => {
    sysApi.searchCodes('RcvPayCode').then(setRcvPay).catch(() => undefined);
    sysApi.searchCodes('TrOccType').then(setTrOcc).catch(() => undefined);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E8] dataButton[기초데이터생성].Select (L149) → initData() L229-268: 고객사를 안 골랐으면 "선택한 고객사가 없습니다.", 있으면 체크한 거래코드를 고객사마다 복사 → "생성이 완료되었습니다."
  const initData = async () => {
    if (companyList == null) {
      message.warning('선택한 고객사가 없습니다.');
      return;
    }
    const codes = (crud.gridRef.current?.api.getSelectedRows() ?? []).map(r => r.trCode ?? '');
    try {
      await astApi.initTrCodes(companyList.map(c => c.companyId), codes);
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  // [E7] companyField.TriggerClick [result == null] (L126): 고객사 다중 선택 — 선택안함이면 비운다
  const onCompanies = (list: Company[]) => {
    setCompanyList(list.length > 0 ? list : null);
    setCompanyOpen(false);
  };
  const companyText = companyList == null ? '' : companyList[0].companyNm + (companyList.length > 1 ? ` 외 ${companyList.length - 1}` : '');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L90) → retrieve(), [E1] searchText.KeyPress [Enter] (L81) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={crud.loading}
        extra={
          <>
            {/* [E3] updateButton[저장].Select (L96) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] addRowButton[등록].Select (L102) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E5] deleteRowButton[삭제].Select (L108) → deleteChk() */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            {/* [E6] windowUseButton[화면별 거래유형 등록].Select (L114) → lookupWindowUse() L270-273 */}
            <Button type="register" onClick={() => setWindowOpen(true)}>화면별 거래유형 등록</Button>
            <LookupInput value={companyText} onOpen={() => setCompanyOpen(true)} onClear={() => setCompanyList(null)} />
            <Button type="generate" onClick={initData}>기초데이터생성</Button>
          </>
        }
      >
        <SearchBar.Field label="거래코드/명">
          <SearchBar.Input style={{ width: 200 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={sp.values.useYn} onChange={e => sp.set('useYn', e.target.checked)}>사용항목만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<TrCode>
          crud={crud}
          columnDefs={columnDefs}
          onRowDataUpdated={e => {
            // 처음 그릴 때의 빈 데이터 갱신은 건너뛴다 — 조회 결과가 들어온 뒤에 첫 행을 고른다
            if (!selectFirst.current || e.api.getDisplayedRowCount() === 0) return;
            selectFirst.current = false;
            e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
          }}
        />
      </div>
      <Ast15_Lookup_TrCodeWindow open={windowOpen} onClose={() => setWindowOpen(false)} />
      <Sys01_Lookup_Company
        open={companyOpen}
        multi
        onResult={() => { setCompanyList(null); setCompanyOpen(false); }}
        onMultiResult={onCompanies}
        onClose={() => setCompanyOpen(false)}
      />
    </div>
  );
};
