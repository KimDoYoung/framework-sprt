/**
 * 보수입금계좌 창 (EE21) — Biz20_Tab_FeeCharge의 [보수입금계좌]가 연다
 * AS-IS: myApp/client/vi/biz/Biz29_Lookup_Account.java (305줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L74-144: 모달 1200×450 "보수입금계좌", 위 검색 [250 "운용사/예금주명/연결계좌/비고"] [조회][등록][저장][삭제] / 셀 편집 그리드(체크 단일) / [닫기]
 * buildGrid() L146-184: 운용사 150(조회창 트리거) · 입금시작일 100(날짜 편집) · 은행명 120(콤보 BankCode — 고르면 은행코드도 바뀜) · 계좌번호 180 · 예금주명 120 · 연결계좌 150(조회창 트리거) · 비고 250
 * 저장 update() L228-259: 바뀐 행마다 운용사·은행명·계좌번호·예금주명이 비었으면 안내 후 중단. 삭제 deleteRow() L269-290: "선택한 정보를 삭제하시겠습니까?"(폭 400)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 저장(n) UX-03, 변경 표시 UX-07, 날짜 컬럼 폭 UX-08, 조회창 UX-05
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { bizFeeAccountApi } from '@/api/bizFee';
import { sysApi } from '@/api/sys';
import { BizFeeAccount } from '@/types/bizFee';
import { Code, Corp } from '@/types/sys';
import { AstTrCodeTreeNode } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ast01_Lookup_Info } from '../ast/Ast01_Lookup_Info';

const gb = gbFor<BizFeeAccount>();
/** setChecked(SINGLE) — 저장·삭제용 체크라 행 클릭이 선택을 바꾸지 않게 한다(03 원칙 16 예외). 상수로 넘긴다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true } as const;
/** 조회창 트리거 열의 글씨 색 (AS-IS LookupTriggerField) */
const TRIGGER_STYLE = { color: '#1677ff' } as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Biz29_Lookup_Account: React.FC<Props> = ({ open, onClose }) => {
  const user = useLoginUser();
  const [searchText, setSearchText] = useState('');
  const [banks, setBanks] = useState<Code[]>([]);
  const [corpTarget, setCorpTarget] = useState<BizFeeAccount | null>(null);
  const [astTarget, setAstTarget] = useState<BizFeeAccount | null>(null);

  useEffect(() => { sysApi.searchCodes('BankCode').then(setBanks).catch(() => setBanks([])); }, []);

  const crud = useGridCrud<BizFeeAccount>({
    idField: 'accountId',
    // retrieve() L214-226: biz.Biz29_Account.selectBySearchText(companyId, "%검색어%")
    search: useCallback(() => bizFeeAccountApi.search(searchText), [searchText]),
    // update() L257-258: biz.Biz29_Account.update — 번호가 없는 새 행은 getSeq 로 번호를 받아 보낸다
    save: useCallback(async (changed: BizFeeAccount[]) => {
      const req = [];
      for (const r of changed) {
        req.push({
          accountId: r.accountId > 0 ? r.accountId : await bizFeeAccountApi.nextId(),
          corpId: r.corpId, startDate: r.startDate, bankCd: r.bankCd, accountNo: r.accountNo, accountNm: r.accountNm,
          astClassTreeId: r.astClassTreeId, note: r.note,
        });
      }
      return bizFeeAccountApi.save(req);
    }, []),
    // GridDeleteData → biz.Biz29_Account.delete
    remove: useCallback((ids: number[]) => bizFeeAccountApi.delete(ids), []),
    // insertRow() L262-267: GridInsertRow, insertModel.setCompanyId(companyId)
    newRow: useCallback(() => ({ companyId: user.companyId }), [user.companyId]),
    // update() L230-255: 바뀐 행마다 필수값 검사
    validate: useCallback((changed: BizFeeAccount[]) => {
      for (const r of changed) {
        if (r.corpNm == null) return '운용사는 필수선택 항목입니다';
        if (r.bankNm == null) return '은행명는 필수선택 항목입니다';
        if (r.accountNo == null) return '계좌번호는 필수입력 항목입니다';
        if (r.accountNm == null) return '예금주명은 필수입력 항목입니다';
      }
      return undefined;
    }, []),
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });
  // 오래 사는 콜백이 최신 crud 를 부르게 한다 (crud 는 rows 가 바뀔 때마다 새 객체)
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // [E0] 화면 열림 (생성자 L74-144) → show() · open() L70-72 → retrieve()
  useEffect(() => {
    if (open) { setSearchText(''); void crudRef.current.retrieve(); }
  }, [open]);

  // 조회창 트리거 열: [E7] lookupCorp.TriggerClick (L151) → lookupCorp() L186-197 · [E8] lookupAst.TriggerClick (L158) → lookupAst() L199-212
  const trigger = (open_: (row: BizFeeAccount) => void) => ({
    cellStyle: TRIGGER_STYLE,
    cellRenderer: (p: { data?: BizFeeAccount; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) open_(p.data); }} />
        {p.value}
      </>
    ),
  });

  const columnDefs = useMemo(() => [
    gb.text('corpNm', 150, '운용사', trigger(setCorpTarget)),  // L175
    gb.date('startDate', 120, '입금시작일', { editor: 'date' }),  // L176 (UX-08: 편집 날짜는 120)
    gb.text('bankNm', 120, '은행명', {  // L177 [E9] bankComboBox.Collapse (L165) → bankCode·bankName 을 함께 바꾼다
      editor: 'select',
      values: banks.map(c => c.name),
      valueSetter: p => {
        p.data.bankNm = p.newValue;
        p.data.bankCd = banks.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.text('accountNo', 180, '계좌번호', { editor: 'text' }),  // L178
    gb.text('accountNm', 120, '예금주명', { editor: 'text' }),  // L179
    gb.text('astClassTreeNm', 150, '연결계좌', trigger(setAstTarget)),  // L180
    gb.text('note', 250, '비고', { editor: 'text' }),  // L181
  ], [banks]);

  // lookupCorp() L186-197: Sys15_Lookup_Corp.open(true) → corpId·corpName 을 그 행의 변경으로
  const onCorpResult = (corp: Corp | null) => {
    if (corp && corpTarget) crud.updateRow(corpTarget.accountId, { corpId: corp.corpId, corpNm: corp.corpName });
    setCorpTarget(null);
  };
  // lookupAst() L199-212: Ast01_Lookup_Info.gridInsert("1", …) → 결과가 있으면 astClassTreeId·astClassTreeName 을 그 행의 변경으로
  const onAstResult = (node: AstTrCodeTreeNode | null) => {
    if (node && astTarget) crud.updateRow(astTarget.accountId, { astClassTreeId: node.classTreeId, astClassTreeNm: node.classTreeName });
    setAstTarget(null);
  };

  return (
    <>
      <LookupModal
        open={open}
        title="보수입금계좌"
        width={1200}
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
            {/* [E5] cancleButton[닫기].Select (L109) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 'calc(100vh - 250px)', minHeight: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L85) · [E6] searchTextField.KeyPress [Enter] (L116) → retrieve() */}
          <SearchBar
            onSearch={() => crud.retrieve()}
            extra={
              <>
                {/* [E2] insertButton[등록].Select (L91) → insertRow() */}
                <Button type="register" onClick={() => crud.addRow()}>등록</Button>
                {/* [E4] updateButton[저장].Select (L103) → update() */}
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                {/* [E3] deleteButton[삭제].Select (L97) → deleteRow() → [E10] msgBox.DialogHide [YES] (L273) → biz.Biz29_Account.delete */}
                <Button type="delete" disabled={!crud.hasChecked} onClick={crud.deleteChecked}>삭제</Button>
              </>
            }
          >
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 250 }} placeholder="운용사/예금주명/연결계좌/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<BizFeeAccount> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
          </div>
        </div>
      </LookupModal>
      {/* regYn true: [거래처추가]를 보이고 [전체]를 [선택안함]으로 (open(true, cb)) */}
      <Sys15_Lookup_Corp open={corpTarget !== null} regYn onResult={onCorpResult} onClose={() => setCorpTarget(null)} />
      <Ast01_Lookup_Info open={astTarget !== null} assetType="1" onResult={onAstResult} onClose={() => setAstTarget(null)} />
    </>
  );
};
