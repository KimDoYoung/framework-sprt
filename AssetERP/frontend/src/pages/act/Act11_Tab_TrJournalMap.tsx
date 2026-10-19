/**
 * [1168] 기초자료 > 40. 관리회계 > 거래유형별 분개맵핑 (E30) — 같은 화면: 관리자 > 05. 관리회계 > 거래유형별 분개맵핑 [1162]
 * AS-IS: myApp/client/vi/act/Act11_Tab_TrJournalMap.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L85-126: 위(0.5) = 툴바(거래코드/명 200 · 분개그룹 120 · [조회][등록][저장][삭제] + 관리자 회사만 고객사 200(다중 선택) · [기초데이터생성]) + 거래맵핑 셀 편집 그리드(행번호, 체크박스 다중)
 *   / 아래(0.5) = 분개맵핑 그리드(Act11_Grid_TrJournalMap) — 위에서 행을 누르면 그 분개그룹을 읽는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 툴바가 두 줄로 넘어가 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { TrMap } from '@/types/act';
import { Code, Company } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Act10_Lookup_ReprAccount } from '@/components/lookup/Act10_Lookup_ReprAccount';
import { Ast05_Lookup_TrCode } from '@/components/lookup/Ast05_Lookup_TrCode';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Act11_Grid_TrJournalMap } from './Act11_Grid_TrJournalMap';

const gb = gbFor<TrMap>();
const ALL = '%';

/** 조회창을 연 행과 미리 넣을 검색어 (lookupTrCode(searchText) L310-319, lookupPlReprAccount(searchText) L327-336) */
interface Target { row: TrMap; searchText?: string }

/**
 * buildGrid() L215-308
 * - 거래코드: LookupTriggerField — [E10] TriggerClick (L220) → 조회창, [E11] ValueChange (L226) → 글자를 지우면 비우고, 있으면 그 글자로 조회창
 *   (원본은 먼저 ast.Ast05_TrCode.selectBySearchText를 부르지만 자산구분(assetType)을 안 보내 항상 결과가 없다 → 항상 조회창)
 * - 입출고구분: 콤보 셀 — [E12] bookIoTypeComboBox[BookInOutType].Collapse (L256) → 고른 코드를 그 행의 bookIoType에 반영
 * - 손익대표계정: LookupTriggerField — [E13] TriggerClick (L265) → 조회창, [E14] ValueChange (L271) → 글자로 찾아 반영(없으면 조회창)
 */
const buildGrid = (bookIo: Code[], openTr: (t: Target) => void, openPl: (t: Target) => void,
  onTrTyped: (row: TrMap, text: string) => void, onPlTyped: (row: TrMap, text: string) => void) => [
  gb.textCenter('trCode', 120, '거래코드', {  // L300
    editor: 'text',
    cellStyle: { color: '#1677ff' },
    valueSetter: p => {
      p.data.trCode = p.newValue;
      onTrTyped(p.data, p.newValue ?? '');
      return true;
    },
    cellRenderer: (p: { data?: TrMap; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openTr({ row: p.data }); }} />
        {p.value}
      </>
    ),
  }),
  gb.text('trName', 250, '거래명'),  // L301
  gb.textCenter('journalGroup', 120, '분개그룹', { editor: 'text' }),  // L302
  gb.textCenter('bookIoTypeName', 120, '입출고구분', {  // L303
    editor: 'select',
    values: bookIo.map(c => c.name),
    valueSetter: p => {
      p.data.bookIoTypeName = p.newValue;
      p.data.bookIoType = bookIo.find(c => c.name === p.newValue)?.code ?? p.data.bookIoType;
      return true;
    },
  }),
  gb.textCenter('plReprAccountName', 120, '손익대표계정', {  // L304
    editor: 'text',
    cellStyle: { color: '#1677ff' },
    valueSetter: p => {
      p.data.plReprAccountName = p.newValue;
      onPlTyped(p.data, p.newValue ?? '');
      return true;
    },
    cellRenderer: (p: { data?: TrMap; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openPl({ row: p.data }); }} />
        {p.value}
      </>
    ),
  }),
  gb.boolean('useYn', 80, '사용', { editable: true }),  // L305
];

export const Act11_Tab_TrJournalMap: React.FC = () => {
  const user = useLoginUser();
  // settings() L128-213: 거래코드/명 빈칸 · 분개그룹 빈칸
  const sp = useSearchParams(() => ({ searchText: '', journalGroup: '' }));
  const [bookIo, setBookIo] = useState<Code[]>([]);
  const [trTarget, setTrTarget] = useState<Target | null>(null);
  const [plTarget, setPlTarget] = useState<Target | null>(null);
  // companyField·companyList (L176-198): 관리자 회사만. 다중 선택, 칸에는 "첫 고객사 외 N"
  const [companyList, setCompanyList] = useState<Company[] | null>(null);
  const [companyOpen, setCompanyOpen] = useState(false);
  // 아래 분개맵핑 그리드가 읽을 분개그룹 — 위에서 행을 누르거나(E9) 조회 뒤 첫 행을 고를 때 바뀐다
  const [journal, setJournal] = useState<{ group: string | null; nonce: number }>({ group: null, nonce: 0 });
  const selectFirst = useRef(false);
  const plTyped = useRef<(row: TrMap, text: string) => void>(() => undefined);

  const columnDefs = useMemo(
    () => buildGrid(bookIo, setTrTarget, setPlTarget,
      (row, text) => trTyped(row, text),
      (row, text) => plTyped.current(row, text)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookIo],
  );

  const crud = useGridCrud<TrMap>({
    idField: 'trMapId',
    // retrieve() L385-419: 로그인 회사, 거래코드/명·분개그룹은 "%검색어%"(없으면 "%" — 서버가 만든다) → act.Act11_TrMap.selectByCompanyId
    search: useCallback(() => actApi.searchTrMaps(sp.current.current.searchText, sp.current.current.journalGroup), [sp.current]),
    // update() L422-437: GridUpdate → act.Act11_TrMap.update
    save: useCallback((rows: TrMap[]) => actApi.updateTrMaps(rows), []),
    remove: useCallback((ids: number[]) => actApi.deleteTrMaps(ids), []),
    // insertRow() L440-446: 회사 = 로그인 회사, 사용 켬
    newRow: useCallback(() => ({ companyId: user.companyId, useYn: 'true' }), [user.companyId]),
    firstEditField: 'trCode',
    // update() L422-437: 바뀐 행마다 거래코드 필수 검사
    validate: (changed: TrMap[]) => {
      for (const r of changed) {
        if (r.trCode == null || r.trCode === '') return '거래코드는 필수입력 항목입니다.';
      }
      return undefined;
    },
    // deleteRow() L449-475: "확인"/"n건의 거래맵핑 정보를 삭제하시겠습니까?" → [E15] msgBox.DialogHide [YES] (L457)
    deleteConfirm: (n: number) => `${n}건의 거래맵핑 정보를 삭제하시겠습니까?`,
  });

  // retrieve() 끝: 첫 행을 고르고 그 분개그룹을 아래에서 읽는다 (grid.getSelectionModel().select(0, false) → journalGrid.retrieve)
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L85-126) → settings(), retrieve(): 입출고구분 콤보 코드
  useEffect(() => {
    sysApi.searchCodes('BookInOutType').then(setBookIo).catch(() => undefined);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 거래코드·거래명을 그 행에 반영한다 — setTrCode() L321-325 (변경으로 친다) */
  const setTrCode = (row: TrMap, code: string | null, name: string | null) =>
    crud.updateRow(row.trMapId, { trCode: code, trName: name });

  /** 손익대표계정을 그 행에 반영한다 — setPlReprAccount() L338-342 (변경으로 친다) */
  const setPlReprAccount = (row: TrMap, code: string | null, name: string | null) =>
    crud.updateRow(row.trMapId, { plReprAccountCode: code, plReprAccountName: name });

  // [E11] lookupTrCode.ValueChange (L226): 비우면 지우고, 글자가 있으면 그 글자로 조회창(원본의 선검색은 항상 빈 결과)
  const trTyped = (row: TrMap, text: string) => {
    if (text === '') setTrCode(row, null, null);
    else setTrTarget({ row, searchText: text });
  };

  // [E14] lookupPlReprAccount.ValueChange (L271): 비우면 지우고, 글자가 있으면 "%글자%"로 찾아 첫 행을 반영, 없으면 그 글자로 조회창
  plTyped.current = async (row, text) => {
    if (text === '') {
      setPlReprAccount(row, null, null);
      return;
    }
    try {
      const list = await actApi.searchReprAccounts(ALL, text);
      if (list.length > 0) setPlReprAccount(row, list[0].reprAccountCode, list[0].reprAccountName);
      else setPlTarget({ row, searchText: text });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E6] deleteButton[삭제].Select (L167) → deleteRow() L449-475: 선택이 없으면 "삭제할 거래 맵핑정보를 선택해주세요"
  const deleteRow = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 거래 맵핑정보를 선택해주세요');
      return;
    }
    crud.deleteChecked();
  };

  // [E8] dataButton[기초데이터생성].Select (L199) → initData() L344-383: 고객사를 안 골랐으면 "선택한 고객사가 없습니다.", 있으면 체크한 거래맵핑(과 그 분개맵핑)을 고객사마다 복사 → "생성이 완료되었습니다."
  const initData = async () => {
    if (companyList == null) {
      message.warning('선택한 고객사가 없습니다.');
      return;
    }
    const items = (crud.gridRef.current?.api.getSelectedRows() ?? []).map(r => ({ trCode: r.trCode ?? '', journalGroup: r.journalGroup }));
    try {
      await actApi.initTrMaps(companyList.map(c => c.companyId), items);
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  // [E7] companyField.TriggerClick [result == null] (L176): 고객사 다중 선택 — 선택안함이면 비운다
  const onCompanies = (list: Company[]) => {
    setCompanyList(list.length > 0 ? list : null);
    setCompanyOpen(false);
  };
  const companyText = companyList == null ? '' : companyList[0].companyNm + (companyList.length > 1 ? ` 외 ${companyList.length - 1}` : '');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L149) → retrieve(), [E1]·[E2] 거래코드/명·분개그룹 KeyPress [Enter] (L130·L140) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={crud.loading}
          extra={
            <>
              {/* [E4] insertButton[등록].Select (L155) → insertRow() */}
              <Button type="register" onClick={crud.addRow}>등록</Button>
              {/* [E5] updateButton[저장].Select (L161) → update(). 저장(n)은 UX-03 */}
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
          <SearchBar.Field label="거래코드/명">
            <SearchBar.Input style={{ width: 200 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="분개그룹">
            <SearchBar.Input style={{ width: 120 }} value={sp.values.journalGroup} onChange={e => sp.set('journalGroup', e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TrMap>
            crud={crud}
            columnDefs={columnDefs}
            // [E9] grid.RowClick (L206) → journalGrid.retrieve(선택한 행의 분개그룹)
            onRowClicked={e => { if (e.data) setJournal(j => ({ group: e.data?.journalGroup ?? null, nonce: j.nonce + 1 })); }}
            onRowDataUpdated={e => {
              // 처음 그릴 때의 빈 데이터 갱신은 건너뛴다 — 조회 결과가 들어온 뒤에 첫 행을 고르고 분개맵핑을 읽는다
              if (!selectFirst.current || e.api.getDisplayedRowCount() === 0) return;
              selectFirst.current = false;
              const first = e.api.getDisplayedRowAtIndex(0);
              first?.setSelected(true);
              setJournal(j => ({ group: first?.data?.journalGroup ?? null, nonce: j.nonce + 1 }));
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Act11_Grid_TrJournalMap journalGroup={journal.group} nonce={journal.nonce} />
      </div>
      {/* [E10] lookupTrCode.TriggerClick (L220) → lookupTrCode() L310-319: open("view", "1", null, searchText) — 고른 거래코드·거래명을 그 행에. [전체]는 원본이 null에서 오류 → 닫기만 */}
      <Ast05_Lookup_TrCode
        open={trTarget !== null}
        mode="view"
        assetType="1"
        financeYn={null}
        searchText={trTarget?.searchText}
        onResult={r => { if (trTarget && r) setTrCode(trTarget.row, r.trCode ?? null, r.trName ?? null); setTrTarget(null); }}
        onClose={() => setTrTarget(null)}
      />
      {/* [E13] lookupPlReprAccount.TriggerClick (L265) → lookupPlReprAccount() L327-336: 고른 대표계정의 코드·이름을 그 행에 */}
      <Act10_Lookup_ReprAccount
        open={plTarget !== null}
        searchText={plTarget?.searchText}
        onResult={r => { if (plTarget) setPlReprAccount(plTarget.row, r.reprAccountCode, r.reprAccountName); setPlTarget(null); }}
        onClose={() => setPlTarget(null)}
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
