/**
 * 종목코드 매칭 창 (E20) — Sch10_Tab_IpoAdmin의 [종목코드매칭]에서 연다
 * AS-IS: myApp/client/vi/sch/Sch15_Lookup_IpoItemMatching.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L57-123: 모달 600×500 "종목코드 매칭", 위 = 툴바(검색 200 "검색어(종목코드/종목명) 입력" · [조회][등록][저장][삭제]), 아래 = 셀 편집 그리드(행번호, 체크박스 다중:
 *   종목코드 100 · 유효한 종목코드 100 · 종목명 300), 아래 가운데 [닫기]
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { schApi } from '@/api/sch';
import { Sch15IpoItemMatching } from '@/types/sch';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch15IpoItemMatching>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sch15_Lookup_IpoItemMatching: React.FC<Props> = ({ open, onClose }) => {
  const [searchText, setSearchText] = useState('');

  const crud = useGridCrud<Sch15IpoItemMatching>({
    idField: 'ipoItemMatchingId',
    // retrieve() L138-150: 검색어 "%검색어%" → sch.Sch15_IpoItemMatching.selectByText
    search: useCallback(() => schApi.searchIpoItemMatchings(searchText), [searchText]),
    // update() L151-154: GridUpdate → sch.Sch15_IpoItemMatching.update
    save: schApi.updateIpoItemMatchings,
    // deleteRow() L162-183: "확인"/"선택한 정보를 삭제하시겠습니까?" → [E7] msgBox.DialogHide [YES] (L165) → sch.Sch15_IpoItemMatching.delete
    remove: schApi.deleteIpoItemMatchings,
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L156-160
    newRow: useCallback(() => ({}), []),
    firstEditField: 'itemCode',
  });

  // [E0] 화면 열림 (생성자 L57-123) → open() L53-55: retrieve(), show()
  useEffect(() => {
    if (open) {
      setSearchText('');
      void crud.retrieve();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L125-136
  const columnDefs = useMemo(() => [
    gb.textCenter('itemCode', 100, '종목코드', { editor: 'text' }),                   // L131
    gb.textCenter('validItemCode', 100, '유효한<br>종목코드', { editor: 'text' }),    // L132
    gb.text('itemName', 300, '종목명', { editor: 'text' }),                           // L133
  ], []);

  return (
    <LookupModal
      open={open}
      title="종목코드 매칭"
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
          <SearchBar.Input style={{ width: 200 }} placeholder="검색어(종목코드/종목명) 입력" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch15IpoItemMatching> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
