/**
 * [1169] 기초자료 > 40. 관리회계 > 실계정맵핑 (E31) — 같은 화면: 관리자 > 05. 관리회계 > 실계정맵핑 [1163]
 * AS-IS: myApp/client/vi/act/Act13_Tab_RealAccountMap.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-109: 가운데 = 툴바(검색 250 · [조회][등록][저장][삭제] + 관리자 회사만 고객사 200(다중 선택) · [기초데이터생성]) + 실계정맵핑 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 조건 1개라 초기화(UX-02) 없음), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { RealAccountMap } from '@/types/act';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';
import { Act10_Lookup_ReprAccount } from '@/components/lookup/Act10_Lookup_ReprAccount';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<RealAccountMap>();
const ALL = '%';

/** 조회창을 연 행과 미리 넣을 검색어 (lookupReprAccount(searchText) L265-274, lookupRealAccount(searchText) L282-291) */
interface Target { row: RealAccountMap; searchText?: string }

/** 조회창 트리거 셀: 돋보기 + 값(LookupTriggerField) */
const triggerCell = (open: (row: RealAccountMap) => void) => ({
  cellStyle: { color: '#1677ff' },
  cellRenderer: (p: { data?: RealAccountMap; value?: string }) => (
    <>
      <AntButton type="text" size="small" icon={<SearchOutlined />}
        onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
      {p.value}
    </>
  ),
});

/**
 * buildGrid() L181-263
 * - 대표계정코드: LookupTriggerField — [E8] TriggerClick (L186) → 조회창, [E9] ValueChange (L192) → 글자로 찾아 반영(없으면 조회창)
 * - 실계정코드: LookupTriggerField — [E10] TriggerClick (L221) → 조회창, [E11] ValueChange (L227) → 글자로 찾아 반영(없으면 조회창)
 */
const buildGrid = (
  openRepr: (t: Target) => void,
  openReal: (t: Target) => void,
  onReprTyped: (row: RealAccountMap, text: string) => void,
  onRealTyped: (row: RealAccountMap, text: string) => void,
) => [
  gb.textCenter('reprAccountCode', 120, '대표계정코드', {  // L255
    editor: 'text',
    ...triggerCell(row => openRepr({ row })),
    valueSetter: p => {
      p.data.reprAccountCode = p.newValue;
      onReprTyped(p.data, p.newValue ?? '');
      return true;
    },
  }),
  gb.text('reprAccountName', 200, '대표계정명'),  // L256
  gb.textCenter('accountMap', 120, '계정맵핑ID', { editor: 'text' }),  // L257
  gb.textCenter('realAccountCode', 150, '실계정코드', {  // L258
    editor: 'text',
    ...triggerCell(row => openReal({ row })),
    valueSetter: p => {
      p.data.realAccountCode = p.newValue;
      onRealTyped(p.data, p.newValue ?? '');
      return true;
    },
  }),
  gb.textArea('realAccountName', 300, '실계정과목'),  // L259
  gb.text('note', 400, '비고', { editor: 'text' }),  // L260
];

export const Act13_Tab_RealAccountMap: React.FC = () => {
  const user = useLoginUser();
  // settings() L111-179: 검색칸 250, 빈칸 "대표계정/맵핑ID/실계정과목/비고"
  const sp = useSearchParams(() => ({ searchText: '' }));
  const [reprTarget, setReprTarget] = useState<Target | null>(null);
  const [realTarget, setRealTarget] = useState<Target | null>(null);
  // companyField·companyList (L146-171): 관리자 회사만. 다중 선택, 칸에는 "첫 고객사 외 N"
  const [companyList, setCompanyList] = useState<Company[] | null>(null);
  const [companyOpen, setCompanyOpen] = useState(false);
  const selectFirst = useRef(false);
  const reprTyped = useRef<(row: RealAccountMap, text: string) => void>(() => undefined);
  const realTyped = useRef<(row: RealAccountMap, text: string) => void>(() => undefined);

  const columnDefs = useMemo(
    () => buildGrid(setReprTarget, setRealTarget, (r, t) => reprTyped.current(r, t), (r, t) => realTyped.current(r, t)),
    [],
  );

  const crud = useGridCrud<RealAccountMap>({
    idField: 'realAccountMapId',
    // retrieve() L340-364: 로그인 회사, searchText "%검색어%"(없으면 "%" — 서버가 만든다) → act.Act13_RealAccountMap.selectByCompanyId
    search: useCallback(() => actApi.searchRealAccountMaps(sp.current.current.searchText), [sp.current]),
    // update() L367-382: 바뀐 행마다 대표계정코드 필수 검사 → GridUpdate → act.Act13_RealAccountMap.update
    save: useCallback((rows: RealAccountMap[]) => actApi.updateRealAccountMaps(rows), []),
    remove: useCallback((ids: number[]) => actApi.deleteRealAccountMaps(ids), []),
    // insertRow() L385-390: 회사 = 로그인 회사
    newRow: useCallback(() => ({ companyId: user.companyId }), [user.companyId]),
    firstEditField: 'reprAccountCode',
    validate: changed => (changed.some(r => !r.reprAccountCode) ? '대표계정코드는 필수입력 항목입니다.' : undefined),
    deleteConfirm: (n: number) => `${n}건의 실계정코드 맵핑정보를 삭제하시겠습니까?`,
  });

  // retrieve() 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L76-109) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** setReprAccount() L276-280 — 그 행에 반영한다(변경으로 친다) */
  const setReprAccount = (row: RealAccountMap, code: string | null, name: string | null) =>
    crud.updateRow(row.realAccountMapId, { reprAccountCode: code, reprAccountName: name });
  /** setRealAccount() L293-297 */
  const setRealAccount = (row: RealAccountMap, code: string | null, name: string | null) =>
    crud.updateRow(row.realAccountMapId, { realAccountCode: code, realAccountName: name });

  // [E9] lookupReprAccount.ValueChange (L192): 비우면 지우고, 글자가 있으면 "%글자%"로 찾아 첫 행을 반영, 없으면 그 글자로 조회창
  reprTyped.current = async (row, text) => {
    if (text === '') {
      setReprAccount(row, null, null);
      return;
    }
    try {
      const list = await actApi.searchReprAccounts(ALL, text);
      if (list.length > 0) setReprAccount(row, list[0].reprAccountCode, list[0].reprAccountName);
      else setReprTarget({ row, searchText: text });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E11] lookupRealAccount.ValueChange (L227): 위와 같다(계정코드 조회, 전표생성·사용 계정만)
  realTyped.current = async (row, text) => {
    if (text === '') {
      setRealAccount(row, null, null);
      return;
    }
    try {
      const list = await actApi.searchAccountCodes(ALL, text);
      if (list.length > 0) setRealAccount(row, list[0].accountCode, list[0].accountName);
      else setRealTarget({ row, searchText: text });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E5] deleteButton[삭제].Select (L141) → deleteRow() L393-419: 선택이 없으면 "삭제할 실계정코드 맵핑정보를 선택해주세요" → "확인"/"n건의 실계정코드 맵핑정보를 삭제하시겠습니까?" → [E12] msgBox.DialogHide [YES] (L401)
  const deleteRow = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 실계정코드 맵핑정보를 선택해주세요');
      return;
    }
    crud.deleteChecked();
  };

  // [E7] dataButton[기초데이터생성].Select (L173) → initData() L299-338: 고객사를 안 골랐으면 "선택한 고객사가 없습니다.", 있으면 체크한 (대표계정, 맵핑ID)를 고객사마다 복사 → "생성이 완료되었습니다."
  const initData = async () => {
    if (companyList == null) {
      message.warning('선택한 고객사가 없습니다.');
      return;
    }
    const items = (crud.gridRef.current?.api.getSelectedRows() ?? []).map(r => ({ reprAccountCode: r.reprAccountCode ?? '', accountMap: r.accountMap }));
    try {
      await actApi.initRealAccountMaps(companyList.map(c => c.companyId), items);
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  // [E6] companyField.TriggerClick [result == null] (L150): 고객사 다중 선택 — 선택안함이면 비운다
  const onCompanies = (list: Company[]) => {
    setCompanyList(list.length > 0 ? list : null);
    setCompanyOpen(false);
  };
  const companyText = companyList == null ? '' : companyList[0].companyNm + (companyList.length > 1 ? ` 외 ${companyList.length - 1}` : '');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L123) → retrieve(), [E1] searchText.KeyPress [Enter] (L114) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={crud.loading}
        extra={
          <>
            {/* [E3] insertButton[등록].Select (L129) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E4] updateButton[저장].Select (L135) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            {/* 생성자 L96-100: 관리자 회사(0)만 고객사 칸과 [기초데이터생성] */}
            {user.companyId === 0 && (
              <>
                <Input readOnly style={{ width: 200, cursor: 'pointer' }} value={companyText} suffix={<SearchOutlined />} onClick={() => setCompanyOpen(true)} />
                <Button type="generate" onClick={initData}>기초데이터생성</Button>
              </>
            )}
          </>
        }
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="대표계정/맵핑ID/실계정과목/비고"
            value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<RealAccountMap>
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
      {/* [E8] lookupReprAccount.TriggerClick (L186) → lookupReprAccount() L265-274: 고른 대표계정의 코드·이름을 그 행에 */}
      <Act10_Lookup_ReprAccount
        open={reprTarget !== null}
        searchText={reprTarget?.searchText}
        onResult={r => { if (reprTarget) setReprAccount(reprTarget.row, r.reprAccountCode, r.reprAccountName); setReprTarget(null); }}
        onClose={() => setReprTarget(null)}
      />
      {/* [E10] lookupRealAccount.TriggerClick (L221) → lookupRealAccount() L282-291: 고른 계정의 코드·이름을 그 행에 */}
      <Act01_Lookup_AccountCode
        open={realTarget !== null}
        searchText={realTarget?.searchText}
        onResult={r => { if (realTarget) setRealAccount(realTarget.row, r.accountCode, r.accountName); setRealTarget(null); }}
        onClose={() => setRealTarget(null)}
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
