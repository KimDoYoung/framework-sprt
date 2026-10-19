/**
 * 책무이행점검항목 선택 창 (E01) — Ics01_Lookup_RelateTdm의 [점검항목연결]에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_SelectTdm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-81: 모달 1500×800 "책무이행점검항목(기준회사:KFS)", 위 툴바(검색 · 검색칸 350 · [조회]) + 그리드(체크박스 다중, 직책·주요관리의무·점검항목·점검방법), 아래 가운데 [확인][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { tdmApi } from '@/api/tdm';
import { errorMessage } from '@/api/client';
import { Manl } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<Manl>();

interface Props {
  /** open(icsId, callback) L49-53 — 값이 있으면 열린다 */
  icsId: number | null;
  /** callback.execute(selectList) */
  onSelect: (selected: Manl[]) => void;
  onClose: () => void;
}

export const Ics01_Lookup_SelectTdm: React.FC<Props> = ({ icsId, onSelect, onClose }) => {
  const [rows, setRows] = useState<Manl[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<Manl>>(null);

  // retrieve() L127-140: 서비스 tdm.Tdm43_Manl.selectByExceptIcsId(companyId, icsId, "%검색어%")
  const retrieve = useCallback(async () => {
    if (icsId == null) return;
    setLoading(true);
    try {
      setRows(await tdmApi.searchManlCandidates(icsId, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [icsId, searchText]);

  // [E0] 화면 열림 (생성자 L55-81) → settings(), show(); open() L49-53 → retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { if (icsId != null) { setSearchText(''); setRows([]); } }, [icsId]);
  useEffect(() => { if (icsId != null) void retrieveRef.current(); }, [icsId]);

  // buildGrid() L114-125
  const columnDefs = useMemo(() => [
    gb.text('roleName', 120, '직책'),  // L117
    gb.textArea('taskRelateDutyName', 350, '주요관리의무'),  // L120
    gb.textArea('checkItemAddCode', 450, '점검항목'),  // L121
    gb.textArea('checkHow', 450, '점검방법'),  // L122
  ], []);

  // [E3] selectButton[확인].Select (L100) → select() L142-154: 고른 게 없으면 알림, 있으면 callback.execute(selectList); hide()
  const select = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택된 점검항목이 없습니다.'); return; }
    onSelect(selected);
    onClose();
  };

  return (
    <LookupModal
      open={icsId != null}
      title="책무이행점검항목(기준회사:KFS)"
      width="min(1540px, 96vw)"
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={select}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L106) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 620 }}>
        {/* [E1] searchText.KeyPress [Enter] (L86) → retrieve(), [E2] retrieveButton[조회].Select (L94) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 350 }} placeholder="직책/책무/책무세부/주요관리의무/점검항목" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Manl> rowClick gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.manlId)} loading={loading} />
        </div>
      </div>
    </LookupModal>
  );
};
