/**
 * 종목유형설정 (J09) — Flt01_Tab_CompanyStd의 [종목유형설정]에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt05_Lookup_ItemType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L64-94: 모달 1100×550 "종목유형설정", 툴바(검색 150 · 조회 · 등록 · 저장 · 삭제) + 셀 편집 그리드(체크박스 다중) + 하단 [닫기]. 열릴 때 조회.
 * API는 종목유형관리(E08, Flt05_Tab_ItemTypeAdmin)의 `flt/item-types`를 그대로 쓴다. 이 창만 저장 전 검사와 삭제 전 사용 검사(selectUseCount)가 있다.
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 조회창 UX-05
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { fltApi } from '@/api/flt';
import { FltItemType } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltItemType>();

const START_DATE = '2000-01-01';

/** AS-IS buildGrid() L158-175 */
const buildGrid = () => [
  gb.textCenter('itemTypeCode', 80, '유형코드', { editor: 'text' }),  // L165
  gb.text('itemTypeName', 250, '유형명', { editor: 'text' }),  // L166
  gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L167
  gb.date('startDate', 120, '적용시작일', { editor: 'date' }),  // L168 (편집 날짜 120 — UX-08)
  gb.boolean('targetYn', 100, '신고대상여부', { editable: true }),  // L169
  gb.boolean('sellPreApprYn', 100, '매도사전승인', { editable: true }),  // L170
  gb.boolean('lockUpCheckYn', 100, '의무보유기간<br>체크여부', { editable: true }),  // L171
  gb.boolean('stkPriceYn', 100, '주식시세적용', { editable: true }),  // L172
  gb.boolean('listStkYn', 100, '상장지분증권', { editable: true }),  // L173
];

/** update() L201-239: 바뀐 행마다 차례로 검사해 첫 문제를 알린다 */
const validate = (changed: FltItemType[]): string | undefined => {
  for (const m of changed) {
    if (!m.itemTypeCode) return '종목유형코드를 입력해주세요';
    if (m.itemTypeCode.length !== 2) return '종목유형코드는 2자리로 입력해주세요';
    if (!m.itemTypeName) return '종목유형명을 입력해주세요';
    if (m.seq == null) return '조회순서를 입력해주세요';
    if (!m.startDate) return '적용시작일을 입력해주세요';
  }
  return undefined;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Flt05_Lookup_ItemType: React.FC<Props> = ({ open, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');

  const crud = useGridCrud<FltItemType>({
    idField: 'itemTypeId',
    // retrieve() L177-189: 로그인 회사, searchText = "%검색어%" → flt.Flt05_ItemType.selectBySearchText
    search: useCallback(() => fltApi.searchItemTypes(searchText), [searchText]),
    // update() L201-239: GridUpdate → flt.Flt05_ItemType.update
    save: useCallback((rows: FltItemType[]) => fltApi.updateItemTypes(rows), []),
    // delete() L241-269: 먼저 flt.Flt05_ItemType.selectUseCount — 쓰는 곳이 있으면 이름을 알리고 삭제하지 않는다 → flt.Flt05_ItemType.delete
    remove: useCallback(async (ids: number[]) => {
      const used = await fltApi.checkItemTypeUse(ids);
      if (used) throw new Error(`사용중인 종목유형은 삭제가 불가합니다. - ${used}`);
      return fltApi.deleteItemTypes(ids);
    }, []),
    // insertRow() L191-199: 회사 = 로그인 회사(서버가 채움), 신고대상 = true, 적용시작일 2000-01-01
    newRow: useCallback(() => ({ targetYn: 'true', startDate: START_DATE }), []),
    firstEditField: 'itemTypeCode',
    validate,
    deleteConfirm: (n: number) => `${n}건의 정보를 삭제하시겠습니까?`,
  });

  // 화면 열림 (open() L64-94) → settings(), show(), retrieve() — 원본 이벤트 목록에 E0 없음
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E5] deleteButton[삭제].Select [YES] (L124): 선택이 없으면 알린다 → [E6] msgBox.DialogHide [YES] (L133) → delete()
  const deleteRows = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <LookupModal
      open={open}
      title="종목유형설정"
      width={1100}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E7] cancelButton[닫기].Select (L150) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L106) → retrieve(), [E1] searchText.KeyPress [Enter] (L98) → retrieve() */}
        <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
          {/* [E3] insertButton[등록].Select (L112) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L118) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={deleteRows}>삭제</Button>
        </>}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<FltItemType> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
