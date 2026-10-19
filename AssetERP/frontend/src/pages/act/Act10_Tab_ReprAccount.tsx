/**
 * [1156] 기초자료 > 40. 관리회계 > 대표계정관리 (E28) — 같은 화면: 관리자 > 05. 관리회계 > 대표계정 관리 [1147]
 * AS-IS: myApp/client/vi/act/Act10_Tab_ReprAccount.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-113: 가운데 = 툴바(코드/명 200 · 계정속성 100 · [조회][등록][저장][삭제] + 관리자 회사만 고객사 200(다중 선택) · [기초데이터생성]) + 대표계정 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04, 조건 2개: 코드/명·계정속성 → 초기화는 ''·전체), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { ReprAccount } from '@/types/act';
import { Code, Company } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act10_Lookup_ReprAccount } from '@/components/lookup/Act10_Lookup_ReprAccount';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<ReprAccount>();
const ALL = '%';

/** 상대 대표계정 조회창을 연 행과 미리 넣을 검색어 (lookupTgtReprAccount(searchText) L246-255) */
interface TgtTarget { row: ReprAccount; searchText?: string }

/**
 * buildGrid() L188-244
 * - 계정속성: 콤보 셀 — [E8] comboBoxAttribute[AccountAttributeCode].Collapse (L193) → 고른 코드를 그 행의 attributeCode에 반영
 * - 상대대표계정코드: LookupTriggerField — [E9] TriggerClick (L202) → 조회창, [E10] ValueChange (L208) → 글자로 찾아 반영(없으면 조회창)
 */
const buildGrid = (attrCodes: Code[], openTgt: (t: TgtTarget) => void, onTgtTyped: (row: ReprAccount, text: string) => void) => [
  gb.textCenter('reprAccountCode', 120, '대표계정코드', { editor: 'text' }),  // L233
  gb.text('reprAccountName', 250, '대표계정명', { editor: 'text' }),  // L234
  gb.text('attributeName', 120, '계정속성', {  // L235
    editor: 'select',
    values: attrCodes.map(c => c.name),
    valueSetter: p => {
      p.data.attributeName = p.newValue;
      p.data.attributeCode = attrCodes.find(c => c.name === p.newValue)?.code ?? p.data.attributeCode;
      return true;
    },
  }),
  gb.text('tgtReprAccountName', 250, '상대대표계정코드', {  // L236
    editor: 'text',
    cellStyle: { color: '#1677ff' },
    valueSetter: p => {
      p.data.tgtReprAccountName = p.newValue;
      onTgtTyped(p.data, p.newValue ?? '');
      return true;
    },
    cellRenderer: (p: { data?: ReprAccount; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openTgt({ row: p.data }); }} />
        {p.value}
      </>
    ),
  }),
  gb.text('note', 450, '비고', { editor: 'text' }),  // L237
];

export const Act10_Tab_ReprAccount: React.FC = () => {
  const user = useLoginUser();
  // settings() L115-186: 코드/명 빈칸 · 계정속성 "전체"
  const sp = useSearchParams(() => ({ searchText: '', attributeCode: ALL }));
  const [attrCodes, setAttrCodes] = useState<Code[]>([]);
  const [tgtTarget, setTgtTarget] = useState<TgtTarget | null>(null);
  // companyField·companyList (L132-154): 관리자 회사만. 다중 선택, 칸에는 "첫 고객사 외 N"
  const [companyList, setCompanyList] = useState<Company[] | null>(null);
  const [companyOpen, setCompanyOpen] = useState(false);
  const selectFirst = useRef(false);
  const tgtTyped = useRef<(row: ReprAccount, text: string) => void>(() => undefined);

  const columnDefs = useMemo(
    () => buildGrid(attrCodes, setTgtTarget, (row, text) => tgtTyped.current(row, text)),
    [attrCodes],
  );

  const crud = useGridCrud<ReprAccount>({
    idField: 'reprAccountId',
    // retrieve() L304-336: 로그인 회사, attributeCode(없으면 "%"), searchText "%검색어%"(없으면 "%" — 서버가 만든다) → act.Act10_ReprAccount.selectByCompanyId
    search: useCallback(() => actApi.searchReprAccounts(sp.current.current.attributeCode, sp.current.current.searchText), [sp.current]),
    // update() L343-346: GridUpdate → act.Act10_ReprAccount.update
    save: useCallback((rows: ReprAccount[]) => actApi.updateReprAccounts(rows), []),
    remove: useCallback((ids: number[]) => actApi.deleteReprAccounts(ids), []),
    // insertRow() L349-354: 회사 = 로그인 회사
    newRow: useCallback(() => ({ companyId: user.companyId }), [user.companyId]),
    firstEditField: 'reprAccountCode',
    deleteConfirm: (n: number) => `${n}건의 대표계정코드 정보를 삭제하시겠습니까?`,
  });

  // retrieve() 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L76-113) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCodes('AccountAttributeCode').then(setAttrCodes).catch(() => undefined);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 상대 대표계정을 그 행에 반영한다 — setTgtReprAccount() L257-261 (변경으로 친다) */
  const setTgtReprAccount = (row: ReprAccount, code: string | null, name: string | null) =>
    crud.updateRow(row.reprAccountId, { tgtReprAccountCode: code, tgtReprAccountName: name });

  // [E10] lookupTgtAccount.ValueChange (L208): 비우면 지우고, 글자가 있으면 "%글자%"로 찾아 첫 행을 반영, 없으면 그 글자로 조회창
  tgtTyped.current = async (row, text) => {
    if (text === '') {
      setTgtReprAccount(row, null, null);
      return;
    }
    try {
      const list = await actApi.searchReprAccounts(ALL, text);
      if (list.length > 0) setTgtReprAccount(row, list[0].reprAccountCode, list[0].reprAccountName);
      else setTgtTarget({ row, searchText: text });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E6] deleteButton[삭제].Select (L174) → deleteRow() L357-383: 선택이 없으면 "대표계정코드를 선택해주세요" → "확인"/"n건의 대표계정코드 정보를 삭제하시겠습니까?" → [E11] msgBox.DialogHide [YES] (L365)
  const deleteRow = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('대표계정코드를 선택해주세요');
      return;
    }
    crud.deleteChecked();
  };

  // [E7] dataButton[기초데이터생성].Select (L180) → initData() L263-302: 고객사를 안 골랐으면 "선택한 고객사가 없습니다.", 있으면 체크한 대표계정을 고객사마다 복사 → "생성이 완료되었습니다."
  const initData = async () => {
    if (companyList == null) {
      message.warning('선택한 고객사가 없습니다.');
      return;
    }
    const codes = (crud.gridRef.current?.api.getSelectedRows() ?? []).map(r => r.reprAccountCode);
    try {
      await actApi.initReprAccounts(companyList.map(c => c.companyId), codes);
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  // [E2] companyField.TriggerClick [result == null] (L132): 고객사 다중 선택 — 선택안함이면 비운다
  const onCompanies = (list: Company[]) => {
    setCompanyList(list.length > 0 ? list : null);
    setCompanyOpen(false);
  };
  const companyText = companyList == null ? '' : companyList[0].companyNm + (companyList.length > 1 ? ` 외 ${companyList.length - 1}` : '');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L156) → retrieve(), [E1] searchText.KeyPress [Enter] (L117) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        onReset={sp.reset}
        loading={crud.loading}
        extra={
          <>
            {/* [E4] insertButton[등록].Select (L162) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E5] updateButton[저장].Select (L168) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            {/* 생성자 L103-107: 관리자 회사(0)만 고객사 칸과 [기초데이터생성] */}
            {user.companyId === 0 && (
              <>
                <Input readOnly style={{ width: 200, cursor: 'pointer' }} value={companyText} suffix={<SearchOutlined />} onClick={() => setCompanyOpen(true)} />
                <Button type="generate" onClick={initData}>기초데이터생성</Button>
              </>
            )}
          </>
        }
      >
        <SearchBar.Field label="코드/명">
          <SearchBar.Input style={{ width: 200 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="계정속성">
          <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }}
            value={sp.values.attributeCode} onChange={code => sp.set('attributeCode', code ?? ALL)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<ReprAccount>
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
      {/* [E9] lookupTgtAccount.TriggerClick (L202) → lookupTgtReprAccount() L246-255: 고른 대표계정의 코드·이름을 그 행에 */}
      <Act10_Lookup_ReprAccount
        open={tgtTarget !== null}
        searchText={tgtTarget?.searchText}
        onResult={r => { if (tgtTarget) setTgtReprAccount(tgtTarget.row, r.reprAccountCode, r.reprAccountName); setTgtTarget(null); }}
        onClose={() => setTgtTarget(null)}
      />
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
