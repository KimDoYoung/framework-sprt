/**
 * 기관찾기 창 (EE91) — AS-IS는 Pln03_Lookup_ResrchDetail(리서치 일정등록)의 조사대상 [찾기]가 연다
 * AS-IS: myApp/client/vi/fnd/Fnd07_Lookup_IssuingEntity.java (147줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L46-114: 500×500 모달 "기관찾기", 툴바 [검색 250, 빈칸 "기관명을 입력하여 주십시오"][조회], 단일 선택 그리드(기관코드 70·기관명 350), 아래 가운데 [확인][취소]
 * 열 때는 조회하지 않는다(L113 주석). 검색어가 비면 "검색어를 입력해주세요"
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { IssuingEntity } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<IssuingEntity>();
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** [확인]·행 더블클릭의 callback.execute(issuingEntityModel) — 고른 기관(고른 것이 없으면 null, AS-IS도 그대로 callback) */
  onResult: (row: IssuingEntity | null) => void;
  onClose: () => void;
}

export const Fnd07_Lookup_IssuingEntity: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IssuingEntity[]>([]);
  const [selected, setSelected] = useState<IssuingEntity | null>(null);
  const [busy, setBusy] = useState(false);

  // [E0] 열림 (open L46-114) — 조회는 하지 않는다
  useEffect(() => {
    if (!open) return;
    setSearchText(''); setRows([]); setSelected(null);
  }, [open]);

  // [E1] searchText.KeyPress [Enter] (L62), [E2] retrieveButton[조회].Select (L71) → retrieve() L126-141
  const retrieve = async () => {
    if (!searchText) { message.warning('검색어를 입력해주세요'); return; }
    setBusy(true);
    try {
      setRows(await fndApi.searchIssuingEntitiesBySearchText(searchText));
      setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E3] grid.CellDoubleClick (L82), [E4] okButton[확인].Select (L93) → callback(issuingEntityModel), hide()
  const confirm = (row: IssuingEntity | null = selected) => {
    onResult(row);
    onClose();
  };

  // buildGrid() L116-124 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.text('issuingEntityCode', 70, '기관코드'),  // L120
    gb.text('issuingEntityName', 350, '기관명'),  // L121
  ], []);

  return (
    <LookupModal
      open={open}
      title="기관찾기"
      width={620}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L103) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 220 }} placeholder="기관명을 입력하여 주십시오" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<IssuingEntity>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.issuingEntityId)}
            loading={busy}
            rowSelection={SINGLE_CHECKED}
            onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0] ?? null)}
            onRowDoubleClicked={e => e.data && confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
