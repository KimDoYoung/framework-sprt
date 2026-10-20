/**
 * 법규 중분류 조회창 (H04) — 월별 법규조회의 중분류 칸에서 연다. 다른 도메인(sch)도 쓰는 공통 조회창
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_CheckList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L52-116: 모달 680×600 "법규", 툴바(중분류명 400 · [조회]) + 그리드(체크박스 단일: 대분류 250 · 중분류 350), 아래 가운데 [확인][전체][닫기]
 * 모달 폭: 열 합계 600 + 행번호·선택 약 60 + 여백 130 = 790 (03 원칙 21, AS-IS 680보다 작지 않다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsClassTreeItem } from '@/types/ics';
import { LookupModal } from './LookupModal';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<IcsClassTreeItem>();
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(icsClassTreeId, callback) L45: 대분류 id. 없으면 최상위를 뺀 모든 분류(selectByAll) */
  parentTreeId: number | null;
  /** select() L129-133: 고른 분류(고른 것이 없으면 null) — selectAll() L135-138도 null. 부른 쪽이 null이면 "전체"로 둔다 */
  onResult: (item: IcsClassTreeItem | null) => void;
  onClose: () => void;
}

export const Ics01_Lookup_CheckList: React.FC<Props> = ({ open, parentTreeId, onResult, onClose }) => {
  const [rows, setRows] = useState<IcsClassTreeItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const selectedRef = useRef<IcsClassTreeItem | null>(null);

  // retrieve() L140-161: parentTreeId가 있으면 selectByParentTreeId, 없으면 selectByAll. 검색어는 %…%
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await icsApi.searchClassTreeItems(parentTreeId, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentTreeId]);

  // [E0] 화면 열림 (생성자 L52-116) → show(), open() L45-50: retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    selectedRef.current = null;
    void retrieve('');
  }, [open, retrieve]);

  // [E3] selectButton[확인].Select (L73) → select() L129-133: 고른 행으로 callback, hide(). 고른 행이 없으면 null(= 전체)
  // [E6] grid.CellDoubleClick (L91) → select()
  const select = (item: IcsClassTreeItem | null) => { onResult(item); onClose(); };

  // buildGrid() L118-127 (체크박스 단일)
  const columnDefs = useMemo(() => [
    gb.textArea('parentTreeName', 250, '대분류'),  // L123
    gb.textArea('classTreeName', 350, '중분류'),  // L124
  ], []);

  return (
    <LookupModal
      open={open}
      title="법규"
      width={790}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="save" onClick={() => select(selectedRef.current)}>확인</Button>
          {/* [E4] selectAllButton[전체].Select (L79) → selectAll() L135-138: callback(null), hide() */}
          <Button onClick={() => select(null)}>전체</Button>
          {/* [E5] cancleButton[닫기].Select (L85) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 440 }}>
        {/* [E1] searchText.KeyPress [Enter] (L59)·[E2] retrieveButton[조회].Select (L67) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="중분류명">
            <SearchBar.Input style={{ width: 400 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsClassTreeItem>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.classTreeId)}
            rowSelection={SELECTION}
            onSelect={row => { selectedRef.current = row ?? null; }}
            onRowDoubleClicked={e => { if (e.data) select(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
