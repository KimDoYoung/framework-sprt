/**
 * [1373] 기초자료 > 30. 자산&경영 > 복리후생비 코드관리 (E25)
 * AS-IS: myApp/client/vi/emp/Emp55_Tab_benefitInfoManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L75-125: 가운데(왼쪽) = 툴바(검색 200 · 조회 · 등록 · 저장 · 삭제 · 기초데이터생성) + 로그인 회사 복리후생비 셀 편집 그리드(행번호, 체크박스 다중),
 *   동쪽(오른쪽, 분할) = 툴바(고객사 150 · 검색 200 · 조회 · 등록 · 저장 · 삭제) + 고른 고객사 복리후생비 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 원본에 없는 동작이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { empBenefitInfoApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { BenefitInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';

const gb = gbFor<BenefitInfo>();

/**
 * AS-IS buildGrid() L269-301 / tgtBuildGrid() L303-335 (둘 다 setChecked(MULTI), 열이 같다)
 * 계정코드 칸은 LookupTriggerField(편집 불가, 돋보기만) — [E15]·[E16] lookupAccount.TriggerClick → Act01_Lookup_AccountCode.open()
 */
const buildGrid = (openAccount: (row: BenefitInfo) => void) => [
  gb.text('benefitName', 120, '복리후생비명'),  // L292
  gb.text('benefitCode', 120, '복리후생비 코드', { editor: 'text' }),  // L293
  gb.text('issueLinkCode', 100, '신청코드', { editor: 'text' }),  // L294
  gb.text('expenseLinkCode', 100, '지출결의코드', { editor: 'text' }),  // L295
  gb.text('accountCode', 100, '계정코드', {  // L296 LookupTriggerField
    cellStyle: { color: '#1677ff' },
    cellRenderer: (p: { data?: BenefitInfo; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openAccount(p.data); }} />
        {p.value}
      </>
    ),
  }),
  gb.text('accountName', 120, '계정과목'),  // L297
  gb.boolean('unUseYn', 80, '미사용', { editable: true }),  // L298
];

const deleteConfirm = (n: number) => `${n}건의 정보를 삭제하시겠습니까?`;

/** 계정코드 조회창을 연 칸: 어느 그리드(left/right)의 어느 행인지 */
interface AccountTarget { side: 'left' | 'right'; row: BenefitInfo }

export const Emp55_Tab_benefitInfoManager: React.FC = () => {
  const user = useLoginUser();
  const [searchText, setSearchText] = useState('');
  const [searchText2, setSearchText2] = useState('');
  // 오른쪽: 고른 고객사 (AS-IS companyField·companyId)
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyLookup, setCompanyLookup] = useState<'single' | 'multi' | null>(null);
  const [accountTarget, setAccountTarget] = useState<AccountTarget | null>(null);
  // initData() L337-382: 체크한 행을 조회창이 열려 있는 동안 들고 있는다
  const [initIds, setInitIds] = useState<number[]>([]);

  const columnDefs = useMemo(() => buildGrid(row => setAccountTarget({ side: 'left', row })), []);
  const tgtColumnDefs = useMemo(() => buildGrid(row => setAccountTarget({ side: 'right', row })), []);

  const crud = useGridCrud<BenefitInfo>({
    idField: 'benefitInfoId',
    // retrieve() L384-398: 로그인 회사, searchText = "%검색어%" → emp.Emp55_BenefitInfo.selectBySearchText
    search: useCallback(() => empBenefitInfoApi.searchBenefitInfos(searchText), [searchText]),
    // update() L424-427: GridUpdate → emp.Emp55_BenefitInfo.update
    save: useCallback((rows: BenefitInfo[]) => empBenefitInfoApi.updateBenefitInfos(rows), []),
    remove: useCallback((ids: number[]) => empBenefitInfoApi.deleteBenefitInfos(ids), []),
    // insert() L439-446: 회사 = 로그인 회사, 미사용 = false
    newRow: useCallback(() => ({ companyId: user.companyId, unUseYn: 'false' }), [user.companyId]),
    firstEditField: 'benefitCode',
    deleteConfirm,
  });

  const tgtCrud = useGridCrud<BenefitInfo>({
    idField: 'benefitInfoId',
    // retrieveCompany() L399-418: 고른 고객사, searchText = "%검색어%"
    search: useCallback(() => empBenefitInfoApi.searchBenefitInfos(searchText2, companyId ?? undefined), [searchText2, companyId]),
    save: useCallback((rows: BenefitInfo[]) => empBenefitInfoApi.updateBenefitInfos(rows, companyId ?? undefined), [companyId]),
    remove: useCallback((ids: number[]) => empBenefitInfoApi.deleteBenefitInfos(ids, companyId ?? undefined), [companyId]),
    // insert2() L448-460: 회사 = 고른 고객사, 미사용 = false
    newRow: useCallback(() => ({ companyId: companyId ?? undefined, unUseYn: 'false' }), [companyId]),
    firstEditField: 'benefitCode',
    deleteConfirm,
  });

  // [E0] 화면 열림 (생성자 L75-125) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  // [E3] companyField.TriggerClick [result != null] (L150) → Sys01_Lookup_Company.open(): 고른 고객사로 retrieveCompany(), 선택안함이면 칸을 비우고 오른쪽 그리드를 비운다
  useEffect(() => {
    if (companyId == null) tgtCrud.clear();
    else tgtCrud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  /** 고객사를 안 골랐으면 알리고 막는다 (AS-IS retrieveCompany·update2·insert2 L400·L430·L449) */
  const needCompany = () => {
    if (companyId == null) {
      message.warning('고객사를 선택해주세요');
      return false;
    }
    return true;
  };

  // AS-IS retrieveCompany() L399-418
  const retrieveCompany = () => { if (needCompany()) tgtCrud.retrieve(); };

  // AS-IS update2() L429-437 / insert2() L448-460
  const updateCompany = () => { if (needCompany()) tgtCrud.saveRows(); };
  const insertCompany = () => { if (needCompany()) tgtCrud.addRow(); };

  /** 삭제 전에 선택이 없으면 알린다 (AS-IS deleteButton·deleteButton2 핸들러 L190-195·L235-240) */
  const deleteWithCheck = (c: typeof crud) => () => {
    if ((c.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    c.deleteChecked();
  };

  // [E14] dataButton[기초데이터생성].Select (L261) → initData() L337-382: 왼쪽에서 체크한 행이 없으면 알리고, 있으면 고객사 다중 선택창
  const initData = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length <= 0) {
      message.warning('복리후생비 코드를 선택해주세요');
      return;
    }
    setInitIds(selected.map(r => r.benefitInfoId));
    setCompanyLookup('multi');
  };

  // initData() L350-376: 고른 고객사마다 insertInitData(companyId, 체크한 행) → "생성이 완료되었습니다." (조회창에서 선택안함이면 아무것도 안 한다)
  const copyToCompanies = async (companies: { companyId: number }[]) => {
    setCompanyLookup(null);
    try {
      await empBenefitInfoApi.copyBenefitInfos(companies.map(c => c.companyId), initIds);
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  // [E15]·[E16] lookupAccount.TriggerClick (L275·L309): 고른 계정의 코드·이름을 그 행에 반영(변경으로 친다)
  const onAccountResult = (acc: { accountCode: string; accountName: string }) => {
    if (!accountTarget) return;
    (accountTarget.side === 'left' ? crud : tgtCrud).updateRow(accountTarget.row.benefitInfoId, { accountCode: acc.accountCode, accountName: acc.accountName });
    setAccountTarget(null);
  };

  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="50%" min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 12px 12px', boxSizing: 'border-box' }}>
            {/* [E4] retrieveButton[조회].Select (L172) → retrieve(), [E1] searchText.KeyPress [Enter] (L129) → retrieve() */}
            <div style={{ overflowX: 'auto' }}>
              <SearchBar onSearch={crud.retrieve} loading={crud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
                {/* [E5] insertButton[등록].Select (L178) → insert() */}
                <Button type="register" onClick={crud.addRow}>등록</Button>
                {/* [E6] updateButton[저장].Select (L184) → update(). 저장(n)은 UX-03 */}
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                {/* [E7] deleteButton[삭제].Select [YES] (L190) → [E8] msgBox.DialogHide [YES] (L199) → delete() L462-466 */}
                <Button type="delete" onClick={deleteWithCheck(crud)}>삭제</Button>
                <Button type="generate" onClick={initData}>기초데이터생성</Button>
              </>}>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<BenefitInfo> crud={crud} columnDefs={columnDefs} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 12px 4px', boxSizing: 'border-box' }}>
            {/* [E9] retrieveButton2[조회].Select (L217) → retrieveCompany(), [E2] searchText2.KeyPress [Enter] (L139) → retrieveCompany() */}
            <div style={{ overflowX: 'auto' }}>
              <SearchBar onSearch={retrieveCompany} loading={tgtCrud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
                {/* [E10] insertButton2[등록].Select (L223) → insert2() */}
                <Button type="register" onClick={insertCompany}>등록</Button>
                {/* [E11] updateButton2[저장].Select (L229) → update2() */}
                <Button type="save" count={tgtCrud.changes} onClick={updateCompany}>저장</Button>
                {/* [E12] deleteButton2[삭제].Select [YES] (L235) → [E13] msgBox.DialogHide [YES] (L244) → delete2() L468-472 */}
                <Button type="delete" onClick={deleteWithCheck(tgtCrud)}>삭제</Button>
              </>}>
                <SearchBar.Field label="고객사">
                  <LookupInput width={150} value={companyName} onOpen={() => setCompanyLookup('single')}
                    onClear={() => { setCompanyId(null); setCompanyName(''); }} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} value={searchText2} onChange={e => setSearchText2(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<BenefitInfo> crud={tgtCrud} columnDefs={tgtColumnDefs} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys01_Lookup_Company open={companyLookup !== null} multi={companyLookup === 'multi'}
        onResult={c => {
          // 단일: 고른 고객사(선택안함은 null). 다중에서 선택안함이면 companyList = null → 아무것도 안 한다 (L343-346)
          if (companyLookup === 'single') {
            setCompanyId(c ? c.companyId : null);
            setCompanyName(c ? c.companyNm : '');
          }
          setCompanyLookup(null);
        }}
        onMultiResult={copyToCompanies}
        onClose={() => setCompanyLookup(null)} />
      <Act01_Lookup_AccountCode open={accountTarget !== null} onResult={onAccountResult} onClose={() => setAccountTarget(null)} />
    </>
  );
};
