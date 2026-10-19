/**
 * 주간사 등록 창 (E20) — Sch10_Tab_IpoAdmin의 [홈페이지 등록]에서 연다
 * AS-IS: myApp/client/vi/sch/Sch12_Lookup_IpoCorp.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-123: 모달 600×500 "주간사 등록", 위 = 툴바(검색 200 "주간사/홈페이지" · [조회][등록][저장][삭제]), 아래 = 셀 편집 그리드(행번호, 체크박스 단일:
 *   주간사명 200 · 홈페이지주소 300), 아래 가운데 [닫기]
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { schApi } from '@/api/sch';
import { Sch12IpoCorp } from '@/types/sch';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch12IpoCorp>();
/** 체크박스 단일 선택(setChecked SINGLE). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sch12_Lookup_IpoCorp: React.FC<Props> = ({ open, onClose }) => {
  const [searchText, setSearchText] = useState('');

  const crud = useGridCrud<Sch12IpoCorp>({
    idField: 'ipoCorpId',
    // retrieve() L136-154: 검색어 "%검색어%" → sch.Sch12_IpoCorp.selectBySearchText
    search: useCallback(() => schApi.searchIpoCorps(searchText), [searchText]),
    // update() L156-159: GridUpdate → sch.Sch12_IpoCorp.update
    save: schApi.updateIpoCorps,
    // deleteRow() L167-188: "확인"/"선택한 정보를 삭제하시겠습니까?" → [E7] msgBox.DialogHide [YES] (L170) → sch.Sch12_IpoCorp.delete
    remove: schApi.deleteIpoCorps,
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L161-165
    newRow: useCallback(() => ({}), []),
    firstEditField: 'corpName',
  });

  // [E0] 화면 열림 (생성자 L57-123) → open() L53-55: retrieve(), show()
  useEffect(() => {
    if (open) {
      setSearchText('');
      void crud.retrieve();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L125-134
  const columnDefs = useMemo(() => [
    gb.text('corpName', 200, '주간사명', { editor: 'text' }),      // L130
    gb.text('homepage', 300, '홈페이지주소', { editor: 'text' }),  // L131
  ], []);

  return (
    <LookupModal
      open={open}
      title="주간사 등록"
      width={720}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E6] cancleButton[닫기].Select (L99) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L75) → retrieve(), [E1] searchText.KeyPress [Enter] (L67) → retrieve() */}
        <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
          {/* [E3] insertButton[등록].Select (L81) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E5] updateButton[저장].Select (L93) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L87) → deleteRow() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </>}>
          <SearchBar.Input style={{ width: 200 }} placeholder="주간사/홈페이지" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch12IpoCorp> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
