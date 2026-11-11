/**
 * [1090] 관리자 > 05. 관리회계 > 거래유형 등록 (EE11)
 * AS-IS: myApp/client/vi/ast/Ast05_Tab_TrCodeIntrinsic.java (365줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L115-141: 툴바(거래코드/명 250 · 사용항목만 보기 · [조회][저장][등록][삭제][화면별 거래유형 등록]) + 거래코드 셀 편집 그리드(행번호, 체크박스 다중, 10열:
 *   거래코드 100 · 거래명 300 · 수령/지급 100(콤보) · 거래발생구분 100(콤보) · 연결종목 150(조회창 트리거) · 종목그룹코드 150 · 연결문서분류 300(조회창 트리거) · 금융상품거래 100 · 사용여부 70 · 비고 300)
 * 짝 화면 Ast05_Tab_TrCodeAdmin(E29)과 같은 서버·콤보를 쓰되, 연결종목·연결문서분류 열이 있고 잠금(시스템영역) 행은 그 두 열만 고칠 수 있다
 * 스타일: CG (견본 — docs/page-style.md. 조건 입력이 있어 SearchBar 사용)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { AstTrCodeTreeNode, TrCodeIntrinsic } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Ast15_Lookup_TrCodeWindow } from '@/components/lookup/Ast15_Lookup_TrCodeWindow';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';

const gb = gbFor<TrCodeIntrinsic>();

/** update() L267-313: 잠금 행에서 이 열 말고 다른 열을 고쳤는지 볼 때 비교하는 열 */
const GUARDED: (keyof TrCodeIntrinsic)[] = ['trCode', 'trName', 'rcvPayCode', 'rcvPayName', 'trOccType', 'trOccTypeName', 'itemClassGroupCode', 'financeYn', 'useYn', 'note'];

type Pick = { rowId: number; kind: 'ast' | 'dcr' } | null;

export const Ast05_Tab_TrCodeIntrinsic: React.FC = () => {
  const user = useLoginUser();
  // 생성자 L112-120: 거래코드/명 빈칸 · 사용항목만 보기 켬
  const sp = useSearchParams(() => ({ searchText: '', useYn: true }));
  const [rcvPay, setRcvPay] = useState<Code[]>([]);
  const [trOcc, setTrOcc] = useState<Code[]>([]);
  const [windowOpen, setWindowOpen] = useState(false);
  const [pick, setPick] = useState<Pick>(null);
  const selectFirst = useRef(false);
  /** 조회 직후 값 — update()의 "시스템영역은 연결종목·연결문서분류만 수정" 검사가 무엇이 바뀌었는지 비교한다 */
  const originals = useRef(new Map<number, TrCodeIntrinsic>());

  const crud = useGridCrud<TrCodeIntrinsic>({
    idField: 'trCodeId',
    // retrieve() L247-264: 로그인 회사, "%검색어%", 사용항목만 보기, 자산구분 "1" → ast.Ast05_TrCode.selectByCompanyId
    search: useCallback(async () => {
      const list = await astApi.searchTrCodesIntrinsic(sp.current.current.searchText, sp.current.current.useYn);
      originals.current = new Map(list.map(r => [r.trCodeId, { ...r }]));
      return list;
    }, [sp.current]),  // eslint-disable-line react-hooks/exhaustive-deps
    // update() L267-313: GridUpdate → ast.Ast05_TrCode.update 뒤 "저장이 완료되었습니다."
    save: useCallback(async (rows: TrCodeIntrinsic[]) => {
      const saved = await astApi.updateTrCodesIntrinsic(rows);
      saved.forEach(r => originals.current.set(r.trCodeId, { ...r }));
      return saved;
    }, []),
    remove: useCallback((ids: number[]) => astApi.deleteTrCodes(ids), []),
    // insertRow() L316-325: 회사 = 로그인 회사, 사용 켬, 자산구분 "1"(서버), 금융상품거래·잠금 끔
    newRow: useCallback(() => ({ companyId: user.companyId, useYn: 'true', financeYn: 'false', lockYn: 'false' }), [user.companyId]),
    firstEditField: 'trCode',
    // update() L267-313: 바뀐 행마다 잠금(시스템영역) → 거래코드 → 거래명 → 수령/지급 순으로 검사
    validate: (changed: TrCodeIntrinsic[]) => {
      for (const r of changed) {
        const org = originals.current.get(r.trCodeId);
        if (org && r.lockYn === 'true' && GUARDED.some(k => (r[k] ?? null) !== (org[k] ?? null))) {
          return '(시스템영역) 정보는 연결종목 및 연결문서분류만 수정가능합니다.';
        }
        if (r.trCode == null || r.trCode === '') return '거래코드는 필수입력 항목입니다.';
        if (r.trName == null || r.trName === '') return '거래명은 필수입력 항목입니다.';
        if (r.rcvPayName == null || r.rcvPayName === '') return '수령/지급은 필수입력 항목입니다.';
      }
      return undefined;
    },
    // deleteRow() L328-356: "삭제"/"n건의 거래를 삭제하시겠습니까?"(폭 300) → [E13] msgBox.DialogHide [YES] (L341) → ast.Ast05_TrCode.delete
    deleteConfirm: (n: number) => `${n}건의 거래를 삭제하시겠습니까?`,
  });

  // retrieve() 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L69-144) → retrieve()
  useEffect(() => {
    sysApi.searchCodes('RcvPayCode').then(setRcvPay).catch(() => undefined);
    sysApi.searchCodes('TrOccType').then(setTrOcc).catch(() => undefined);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 조회창 트리거 열 (AS-IS LookupTriggerField). 칸 글자를 지우면 [E10]·[E12] ValueChange처럼 id·이름을 비운다 */
  const trigger = useCallback((field: 'astClassTreeName' | 'dcrClassTreeName', idField: 'astClassTreeId' | 'dcrClassTreeId', width: number, title: string, kind: 'ast' | 'dcr') =>
    gb.text(field, width, title, {
      editor: 'text',
      valueSetter: p => {
        if (p.newValue != null && p.newValue !== '') return false;
        p.data[field] = null;
        p.data[idField] = null;
        return true;
      },
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: TrCodeIntrinsic; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setPick({ rowId: p.data.trCodeId, kind }); }} />
          {p.value}
        </>
      ),
    }), []);

  // buildGrid() L146-239
  const columnDefs = useMemo(() => [
    gb.textCenter('trCode', 100, '거래코드', { editor: 'text' }),  // L227
    gb.text('trName', 300, '거래명', { editor: 'text' }),  // L228
    // [E7] rcvPayComboBox.Collapse (L150): 고른 코드·이름을 그 행에 반영 (이름을 보이고 valueSetter로 코드를 저장)
    gb.textCenter('rcvPayName', 100, '수령/지급', {  // L229
      editor: 'select',
      values: rcvPay.map(c => c.name),
      valueSetter: p => {
        p.data.rcvPayName = p.newValue;
        p.data.rcvPayCode = rcvPay.find(c => c.name === p.newValue)?.code ?? p.data.rcvPayCode;
        return true;
      },
    }),
    // [E8] TrOccTypecomboBox.Collapse (L160)
    gb.textCenter('trOccTypeName', 100, '거래발생구분', {  // L230
      editor: 'select',
      values: trOcc.map(c => c.name),
      valueSetter: p => {
        p.data.trOccTypeName = p.newValue;
        p.data.trOccType = trOcc.find(c => c.name === p.newValue)?.code ?? p.data.trOccType;
        return true;
      },
    }),
    // [E9] lookupAst.TriggerClick (L170) → Ast01_Lookup_Info.gridInsert("1") / [E10] lookupAst.ValueChange (L188)
    trigger('astClassTreeName', 'astClassTreeId', 150, '연결종목', 'ast'),  // L231
    gb.text('itemClassGroupCode', 150, '종목그룹코드', { editor: 'text' }),  // L232
    // [E11] lookupDcr.TriggerClick (L200) → Dcr30_Move_DcrClass.open(callback) / [E12] lookupDcr.ValueChange (L215)
    trigger('dcrClassTreeName', 'dcrClassTreeId', 300, '연결문서분류', 'dcr'),  // L233
    gb.boolean('financeYn', 100, '금융상품거래', { editable: true }),  // L234
    gb.boolean('useYn', 70, '사용여부', { editable: true }),  // L235
    gb.text('note', 300, '비고', { editor: 'text' }),  // L236
  ], [rcvPay, trOcc, trigger]);

  // [E9] 콜백 L176-183: 고른 종목의 id·이름을 그 행에 넣는다 (취소하면 변화 없음)
  const onPickAst = (node: AstTrCodeTreeNode | null) => {
    const target = pick;
    setPick(null);
    if (!node || !target) return;
    crud.updateRow(target.rowId, { astClassTreeId: node.classTreeId, astClassTreeName: node.classTreeName });
  };

  // [E11] 콜백 L206-211: 고른 문서분류의 id·전체 이름을 그 행에 넣는다
  const onPickDcr = (r: Dcr30ClassResult) => {
    const target = pick;
    setPick(null);
    if (!r.classTreeId || !target) return;
    crud.updateRow(target.rowId, { dcrClassTreeId: r.classTreeId, dcrClassTreeName: r.classTreeFullName });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L81) → retrieve(), [E1] searchText.KeyPress [Enter] (L72) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={crud.loading}
        extra={
          <>
            {/* [E3] updateButton[저장].Select (L87) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] addRowButton[등록].Select (L93) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E5] deleteRowButton[삭제].Select (L99) → deleteRow() */}
            <Button type="delete" disabled={!crud.hasChecked} onClick={crud.deleteChecked}>삭제</Button>
            {/* [E6] windowUseButton[화면별 거래유형 등록].Select (L105) → lookupWindowUse() L241-244 */}
            <Button type="register" onClick={() => setWindowOpen(true)}>화면별 거래유형 등록</Button>
          </>
        }
      >
        <SearchBar.Field label="거래코드/명">
          <SearchBar.Input style={{ width: 250 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={sp.values.useYn} onChange={e => sp.set('useYn', e.target.checked)}>사용항목만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<TrCodeIntrinsic>
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
      <Ast01_Lookup_Info open={pick?.kind === 'ast'} assetType="1" onResult={onPickAst} onClose={() => setPick(null)} />
      <Dcr30_Move_DcrClass open={pick?.kind === 'dcr'} hideNull onResult={onPickDcr} onClose={() => setPick(null)} />
    </div>
  );
};
