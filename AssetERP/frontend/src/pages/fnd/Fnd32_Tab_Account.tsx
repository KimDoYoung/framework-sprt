/**
 * [1290] 펀드관리 > 04. 공모주청약 > 공모주 참여계좌 관리 (Q07)
 * AS-IS: myApp/client/vi/fnd/Fnd32_Tab_Account.java (456줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-119: 가운데(여백 20, 테두리) = 툴바 50(검색 350 "증권사/운용대상/구분/계좌번호/은행연계계좌/비고" · 계좌상태 [콤보 100 "활성"] · [조회][등록(복사)][등록][저장][삭제] · [템플릿][엑셀업로드]) + 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 편집 가능 날짜 열 120(UX-08). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * 원본 그대로 둔 것: 운용대상 콤보(accountCode1ComboBox.Collapse L253)는 고른 이름을 운용대상이 아니라 구분(accountName2) 이름에 넣는다 — 저장되는 코드(accountCode1)는 맞고 조회하면 제대로 보인다(작업기록 제안)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fndApi } from '@/api/fnd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { IpoAccount } from '@/types/fnd';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';

const gb = gbFor<IpoAccount>();
/** 활성 (AccountStateCode 1:활성/2:계좌폐쇄/3:미사용) */
const STATE_ACTIVE = '1';

type CorpKind = 'corp' | 'bank';

export const Fnd32_Tab_Account: React.FC = () => {
  const excelForm = useRef<FileUpdownFormHandle>(null);
  // settings() L121-195: 검색칸 350, 계좌상태 콤보 100("전체" 포함, 처음 "활성")
  const [searchText, setSearchText] = useState('');
  const [stateCode, setStateCode] = useState(STATE_ACTIVE);
  const [codes1, setCodes1] = useState<Code[]>([]);
  const [codes2, setCodes2] = useState<Code[]>([]);
  const [stateCodes, setStateCodes] = useState<Code[]>([]);
  const [ipoOutCodes, setIpoOutCodes] = useState<Code[]>([]);
  const [lookup, setLookup] = useState<{ row: IpoAccount; kind: CorpKind } | null>(null);
  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;
  const stateCodeRef = useRef(stateCode);
  stateCodeRef.current = stateCode;

  const crud = useGridCrud<IpoAccount>({
    idField: 'accountId',
    // retrieve() L299-311: fnd.Fnd32_Account.selectByText(searchText "%…%", companyId, accountStateCode)
    search: useCallback(() => fndApi.searchIpoAccounts({ searchText: searchTextRef.current, accountStateCode: stateCodeRef.current }), []),
    // update() L314-340: GridUpdate이 아니라 직접 getModifiedRecords → fnd.Fnd32_Account.updateList, 성공하면 retrieve()
    save: fndApi.saveIpoAccounts,
    reloadAfterSave: true,
    // deleteChk() L426-444: "n건을의 삭제하시겠습니까?"(제목 삭제, 300폭) → [E17] YES → deleteRow() L447-451 → fnd.Fnd32_Account.delete
    remove: fndApi.deleteIpoAccounts,
    deleteConfirm: count => `${count}건을의 삭제하시겠습니까?`,
    // insertRow() L343-351: 회사 = 로그인 회사(서버가 채움), 계좌상태 "1"(활성)
    newRow: useCallback(() => ({ accountStateCode: STATE_ACTIVE, accountStateName: '활성' }), []),
    firstEditField: 'setupDate',
  });

  // [E0] 화면 열림 (생성자 L84-119) → settings(): 계좌상태 콤보를 읽어 "활성"으로 두고 retrieve()
  useEffect(() => {
    void (async () => {
      try {
        const [c1, c2, st, out] = await Promise.all([sysApi.searchCodes('Fnd32Code1'), sysApi.searchCodes('Fnd32Code2'), sysApi.searchCodes('AccountStateCode'), sysApi.searchCodes('IpoOutCode')]);
        setCodes1(c1); setCodes2(c2); setStateCodes(st); setIpoOutCodes(out);
      } catch (err) {
        message.error(errorMessage(err, '코드 조회 실패'));
      }
      void crud.retrieve();
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] copyButton[등록(복사)].Select (L153) → copyInsertRow() L353-391: 고른 행(첫 번째)의 값을 가진 새 행을 넣고 곧바로 fnd.Fnd32_Account.copyUpdate로 저장한다
  const copyInsertRow = async () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('복사할 대상을 선택해주세요.'); return; }
    const s = selected[0];
    const { setupDate, corpId, corpName, branch, accountCode1, accountName1, accountCode2, accountName2, accountName, decAccountNo, bankCorpId, bankCorpName,
      decBankLinkNo, accountStateCode, accountStateName, ipoOutCode, ipoOutName, managerTel, note } = s;
    try {
      const saved = await fndApi.copyIpoAccount({ accountId: null as never, setupDate, corpId, branch, accountCode1, accountCode2, accountName, decAccountNo,
        bankCorpId, decBankLinkNo, accountStateCode, ipoOutCode, managerTel, note });
      // 원본은 새 행을 넣고 변경이 아닌 채로 DB에 저장한다 → 저장된 행으로 바꿔 둔다(다시 [저장]해도 중복으로 쌓이지 않게)
      crud.addRows([{ ...saved, corpName, accountName1, accountName2, bankCorpName, accountStateName, ipoOutName }], false);
      setTimeout(() => {
        const api = crud.gridRef.current?.api;
        const last = api?.getDisplayedRowAtIndex((api?.getDisplayedRowCount() ?? 1) - 1)?.data;
        if (last && last.accountId < 0) crud.replaceRow(last.accountId, saved);
      }, 100);
    } catch (err) {
      message.error(errorMessage(err, '복사 실패'));
    }
  };

  // [E7] tempDownloadButton[템플릿].Select (L171) → downloadForm.submit(): ./excelTemplete/Template_공모주참여계좌.xlsx
  const downloadTemplate = async () => {
    try {
      await fndApi.downloadIpoAccountTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E8] excelUploadButton[엑셀업로드].Select (L177) → excelUpload() L406-424: 파일을 고르면 ExcelUpload?uploadType=accountUpload
  // [E16] fileUploadField.Change (L416) → uploadExcelForm.submit() · [E9] uploadExcelForm.SubmitComplete (L189) → retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await fndApi.uploadIpoAccountsExcel(file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    void crud.retrieve();
  };

  /** 이름으로 고른 코드 목록 → 코드와 이름을 함께 바꾸는 select 열 (콤보 Collapse의 addChange 쌍) */
  const codeCol = (field: keyof IpoAccount, width: number, title: string, codes: Code[], codeField: keyof IpoAccount, sideEffect?: (data: IpoAccount, name: string) => void) =>
    gb.text(field, width, title, {
      editor: 'select',
      values: codes.map(c => c.name),
      valueSetter: p => {
        const name = (p.newValue ?? '') as string;
        const data = p.data as unknown as Record<string, unknown>;
        data[field] = name;
        data[codeField] = codes.find(c => c.name === name)?.code ?? null;
        sideEffect?.(p.data, name);
        return true;
      },
    });

  /** 조회창 트리거 열(AS-IS LookupTriggerField, 글자 입력 불가): 돋보기를 누르면 그 행에 대해 거래처 조회창을 연다 */
  const triggerCol = (field: keyof IpoAccount, width: number, title: string, kind: CorpKind) =>
    gb.text(field, width, title, {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: IpoAccount; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setLookup({ row: p.data, kind }); }} />
          {p.value}
        </>
      ),
    });

  // buildGrid() L197-296
  const columnDefs = useMemo(() => [
    gb.date('setupDate', 120, '개설일자', { editor: 'date' }),                                       // L281 (UX-08: 편집 가능 날짜는 120)
    triggerCol('corpName', 120, '증권사', 'corp'),                                                  // L282 corpLookup — Sys15_Lookup_Corp.open("증권회사", true, …) (E10)
    gb.text('branch', 120, '관리점', { editor: 'text' }),                                            // L283
    // [E13] accountCode1ComboBox[Fnd32Code1].Collapse (L253): accountCode1 = 고른 코드, accountName2 = 고른 이름(원본 그대로 — 구분 이름 칸에 들어간다)
    codeCol('accountName1', 100, '운용대상', codes1, 'accountCode1', (data, name) => { data.accountName2 = name; }),  // L284
    // [E14] accountCode2ComboBox[Fnd32Code2].Collapse (L262)
    codeCol('accountName2', 100, '구분', codes2, 'accountCode2'),                                     // L285
    gb.text('accountName', 150, '계좌명', { editor: 'text' }),                                        // L286
    gb.text('decAccountNo', 150, '계좌번호', { editor: 'text' }),                                      // L287
    triggerCol('bankCorpName', 100, '연계은행', 'bank'),                                             // L288 bankCorpLookup — Sys15_Lookup_Corp.open("국내은행", true, …) (E11)
    gb.text('decBankLinkNo', 150, '은행연계계좌', { editor: 'text' }),                                 // L289
    // [E12] accountStateComboBox[AccountStateCode].Collapse (L243)
    codeCol('accountStateName', 80, '상태', stateCodes, 'accountStateCode'),                         // L290
    // [E15] ipoOutComboBox[IpoOutCode].Collapse (L271)
    codeCol('ipoOutName', 120, '상장일출고', ipoOutCodes, 'ipoOutCode'),                              // L291
    gb.text('managerTel', 120, '담당자연락처', { editor: 'text' }),                                    // L292
    gb.text('note', 280, '비고', { editor: 'text' }),                                                 // L293
  ], [codes1, codes2, stateCodes, ipoOutCodes]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
        {/* [E2] retrieveButton[조회].Select (L141) → retrieve(), [E1] searchTextField.KeyPress [Enter] (L124) → retrieve() */}
        <SearchBar
          onSearch={crud.retrieve}
          loading={crud.loading}
          extra={<>
            <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
            {/* [E3] insertButton[등록].Select (L147) → insertRow() L343-351 */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E5] updateButton[저장].Select (L159) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E6] deleteButton[삭제].Select (L165) → deleteChk() L426 */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            <Button type="download" onClick={downloadTemplate}>템플릿</Button>
            <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
            <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
          </>}
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 350 }} placeholder="증권사/운용대상/구분/계좌번호/은행연계계좌/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="계좌상태">
            <SystemCodeComboBox kindCd="AccountStateCode" altCode={['%', '전체']} style={{ width: 100 }} value={stateCode} onChange={code => setStateCode(code ?? '%')} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<IpoAccount> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      {/* [E10]·[E11] corpLookup·bankCorpLookup.TriggerClick (L200·L222): Sys15_Lookup_Corp.open("증권회사"|"국내은행", true, …) — 선택안함이면 ID·이름을 비운다 */}
      <Sys15_Lookup_Corp
        open={lookup != null}
        regYn
        corpTypeName={lookup?.kind === 'bank' ? '국내은행' : '증권회사'}
        onResult={corp => {
          if (!lookup) return;
          const patch = lookup.kind === 'bank'
            ? { bankCorpId: corp?.corpId ?? null, bankCorpName: corp?.corpName ?? null }
            : { corpId: corp?.corpId ?? null, corpName: corp?.corpName ?? null };
          crud.updateRow(lookup.row.accountId, patch);
        }}
        onClose={() => setLookup(null)}
      />
    </div>
  );
};
