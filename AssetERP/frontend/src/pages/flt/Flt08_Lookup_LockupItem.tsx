/**
 * 매수제한종목 (J09) — Flt01_Tab_CompanyStd의 [매수제한종목]에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt08_Lookup_LockupItem.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L74-106: 모달 910×550 "매수제한종목", 툴바(제한구분 콤보 100 · 검색 150 · 조회 · 등록 · 저장 · 삭제) + 셀 편집 그리드(체크박스 다중) + 하단 [닫기].
 * 종목코드 칸은 조회창 트리거(LookupTriggerField) — 누르면 상장주식 종목 찾기(Com50_Lookup_StkItem VIEW)가 열린다.
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 조회창 UX-05, 날짜 편집 열 120(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fltApi } from '@/api/flt';
import { sysApi } from '@/api/sys';
import { FltBuyLockupItem } from '@/types/flt';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Com50_Lookup_StkItem } from '@/components/lookup/Com50_Lookup_StkItem';

const gb = gbFor<FltBuyLockupItem>();

const ALL: [string, string] = ['%', '전체'];  // ComboBoxField("BuyLockupType", "%", "전체", "전체")

/** update() L256-278: 바뀐 행마다 제한시작일을 검사한다 */
const validate = (changed: FltBuyLockupItem[]): string | undefined =>
  changed.some(m => !m.startDate) ? '제한시작일을 입력하세요' : undefined;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Flt08_Lookup_LockupItem: React.FC<Props> = ({ open, onClose }) => {
  const [lockupType, setLockupType] = useState<string | undefined>('%');
  const [searchText, setSearchText] = useState('');
  const [typeCodes, setTypeCodes] = useState<Code[]>([]);
  // lookupItem() L211-223: 종목을 채울 행 (AS-IS는 선택된 행)
  const [itemRowId, setItemRowId] = useState<number | null>(null);

  // 콤보를 고르면 바뀐 값으로 바로 조회해야 해서(E1) 조회 조건은 ref로 읽는다
  const paramRef = useRef({ lockupType: '%', searchText: '' });
  paramRef.current = { lockupType: lockupType ?? '%', searchText };

  const crud = useGridCrud<FltBuyLockupItem>({
    idField: 'buyLockupId',
    // retrieve() L225-239: 로그인 회사, lockupType(콤보 코드), searchText = "%검색어%" → flt.Flt08_BuyLockup.selectByText
    search: useCallback(() => fltApi.searchBuyLockups(paramRef.current.lockupType, paramRef.current.searchText), []),
    // update() L256-278: GridUpdate → flt.Flt08_BuyLockup.update
    save: useCallback((rows: FltBuyLockupItem[]) => fltApi.updateBuyLockups(rows), []),
    // delete() L280-284: GridDeleteData → flt.Flt08_BuyLockup.delete
    remove: useCallback((ids: number[]) => fltApi.deleteBuyLockups(ids), []),
    // insertRow() L241-254: 회사 = 로그인 회사(서버가 채움), 제한구분 2(매수제한)
    newRow: useCallback(() => ({ lockupType: '2', lockupTypeName: '매수제한' }), []),
    validate,
    deleteConfirm: (n: number) => `${n}건의 종목을 삭제하시겠습니까?`,
  });

  useEffect(() => {
    sysApi.searchCodes('BuyLockupType').then(setTypeCodes).catch(() => undefined);
  }, []);

  // 화면 열림 (open() L74-106) → settings(), show() — 열 때는 조회하지 않는다(원본은 조회 버튼·콤보·Enter로만 조회, 이벤트 목록에 E0 없음)
  useEffect(() => {
    if (!open) return;
    setLockupType('%');
    setSearchText('');
    crud.clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L179-209
  const columnDefs = useMemo(() => [
    // 종목코드: 조회창 트리거(LookupTriggerField, 읽기 전용) — 누르면 lookupItem()
    gb.textCenter('itemCode', 120, '종목코드', {
      cellRenderer: (p: { data?: FltBuyLockupItem; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setItemRowId(p.data.buyLockupId); }} />
          {p.value}
        </>
      ),
      cellStyle: { color: '#1677ff' },
    }),  // L202
    gb.text('itemName', 350, '종목명'),  // L203
    gb.date('startDate', 120, '제한시작일', { editor: 'date' }),  // L204
    gb.date('closeDate', 120, '제한종료일', { editor: 'date' }),  // L205
    // [E10] comboLockupType[BuyLockupType].Collapse (L191) → 이름을 고르면 코드(lockupType)도 바뀐다 (addChange)
    gb.textCenter('lockupTypeName', 120, '제한구분', {
      editor: 'select',
      values: typeCodes.map(c => c.name),
      valueSetter: p => {
        p.data.lockupTypeName = p.newValue;
        p.data.lockupType = typeCodes.find(c => c.name === p.newValue)?.code ?? p.data.lockupType;
        return true;
      },
    }),  // L206
  ], [typeCodes]);

  // [E4] insertButton[등록].Select (L133) → insertRow() L241-254: 빈 행을 넣고 곧바로 lookupItem()으로 종목을 고른다
  const insertRow = () => {
    crud.addRow();
    setTimeout(() => {
      const api = crud.gridRef.current?.api;
      const last = api?.getDisplayedRowAtIndex((api?.getDisplayedRowCount() ?? 1) - 1)?.data;
      if (last) setItemRowId(last.buyLockupId);
    }, 100);
  };

  // [E6] deleteButton[삭제].Select [YES] (L145): 선택이 없으면 알린다 → [E7] msgBox.DialogHide [YES] (L154) → delete()
  const deleteRows = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <>
      <LookupModal
        open={open}
        title="매수제한종목"
        width={910}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E8] cancelButton[닫기].Select (L171) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E3] retrieveButton[조회].Select (L127) → retrieve(), [E2] searchText.KeyPress [Enter] (L119) → retrieve() */}
          <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
            <Button type="register" onClick={insertRow}>등록</Button>
            {/* [E5] updateButton[저장].Select (L139) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRows}>삭제</Button>
          </>}>
            <SearchBar.Field label="제한구분">
              {/* [E1] lockupTypeCombo[BuyLockupType].Collapse (L110) → retrieve() */}
              <SystemCodeComboBox kindCd="BuyLockupType" altCode={ALL} style={{ width: 100 }} value={lockupType}
                onChange={v => { setLockupType(v); paramRef.current = { ...paramRef.current, lockupType: v ?? '%' }; void crud.retrieve(); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 150 }} placeholder="종목코드/종목명" value={searchText}
                onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<FltBuyLockupItem> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </LookupModal>
      {/* [E9] lookupItemInfo.TriggerClick (L183) → lookupItem() L211-223: Com50_Lookup_StkItem.view → 고른 행에 종목코드·종목명(addChange) */}
      <Com50_Lookup_StkItem
        mode={open && itemRowId != null ? 'VIEW' : null}
        onResult={item => {
          if (itemRowId != null) crud.updateRow(itemRowId, { itemCode: item.itemCode, itemName: item.itemName });
          setItemRowId(null);
        }}
        onClose={() => setItemRowId(null)}
      />
    </>
  );
};
