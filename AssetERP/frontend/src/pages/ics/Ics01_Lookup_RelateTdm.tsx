/**
 * 연결 책무이행점검 조회창 (E01) — Ics01_Grid_IcsType 그리드의 연결책무 [수정] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_RelateTdm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L70-96: 모달 1500×800 "법규명 - 연결 책무이행점검(기준회사:KFS)", 위 툴바(검색 · 검색칸 350 · [조회] · [점검항목연결] · [연결제거]) + 그리드(체크박스 다중), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { tdmApi } from '@/api/tdm';
import { errorMessage } from '@/api/client';
import { Manl, ManlRelateIcs } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ics01_Lookup_SelectTdm } from './Ics01_Lookup_SelectTdm';

const gb = gbFor<ManlRelateIcs>();

interface Props {
  /** open(icsId, icsName, callback) L61-68 — icsId가 있으면 열린다 */
  icsId: number | null;
  icsName: string;
  /** callback.execute(): 연결을 바꾼 뒤(연결·제거) 부른 쪽이 그 법규 행을 다시 읽는다 */
  onChanged: () => void;
  onClose: () => void;
}

export const Ics01_Lookup_RelateTdm: React.FC<Props> = ({ icsId, icsName, onChanged, onClose }) => {
  const [rows, setRows] = useState<ManlRelateIcs[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const gridRef = useRef<AgGridReact<ManlRelateIcs>>(null);

  // retrieve() L163-176: 서비스 tdm.Tdm45_ManlRelateIcs.selectByIcsId(companyId, icsId, "%검색어%")
  const retrieve = useCallback(async () => {
    if (icsId == null) return;
    setLoading(true);
    try {
      setRows(await tdmApi.searchManlRelateIcs(icsId, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [icsId, searchText]);

  // [E0] 화면 열림 (생성자 L70-96) → settings(), show(); open() L61-68 → retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { if (icsId != null) { setSearchText(''); setRows([]); } }, [icsId]);
  useEffect(() => { if (icsId != null) void retrieveRef.current(); }, [icsId]);

  // buildGrid() L150-161 (책무·책무세부내용 열은 원본에서 주석 처리)
  const columnDefs = useMemo(() => [
    gb.text('roleName', 120, '직책'),  // L153
    gb.textArea('taskDutyName', 350, '주요관리의무'),  // L156
    gb.textArea('taskCheckItem', 450, '점검항목'),  // L157
    gb.textArea('taskCheckHow', 450, '점검방법'),  // L158
  ], []);

  // [E3] insertButton[점검항목연결].Select (L115) → lookupSelectTdm() L178-209: Ics01_Lookup_SelectTdm → 고른 점검항목을 tdm.Tdm45_ManlRelateIcs.insertList → retrieve(), callback.execute()
  const lookupSelectTdm = async (selected: Manl[]) => {
    if (icsId == null) return;
    try {
      await tdmApi.addManlRelateIcs(icsId, selected.map(m => m.manlId));
      await retrieve();
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '연결 실패'));
    }
  };

  // delete() L211-222: GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크한 행) → callback.execute()
  const doDelete = async (checked: ManlRelateIcs[]) => {
    if (icsId == null) return;
    try {
      await tdmApi.deleteManlRelateIcs(icsId, checked.map(r => r.manlRelateIcsId));
      setRows(prev => prev.filter(r => !checked.includes(r)));
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E4] deleteButton[연결제거].Select (L121): 고른 게 없으면 알림 → 확인 창 → [E5] messageBox.DialogHide (L130) YES → delete()
  const removeLinks = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('선택한 점검항목이 없습니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '선택한 점검항목을 제거하시겠니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => doDelete(checked),
    });
  };

  return (
    <Modal
      open={icsId != null}
      title={`${icsName} - 연결 책무이행점검(기준회사:KFS)`}
      width="min(1540px, 96vw)"
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E6] closeButton[닫기].Select (L142) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 620 }}>
        {/* [E1] searchText.KeyPress [Enter] (L101) → retrieve(), [E2] retrieveButton[조회].Select (L109) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<>
            <Button type="register" onClick={() => setSelectOpen(true)}>점검항목연결</Button>
            <Button type="delete" onClick={removeLinks}>연결제거</Button>
          </>}
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 350 }} placeholder="직책/책무/책무세부/주요관리의무/점검항목" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<ManlRelateIcs> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.manlRelateIcsId)} loading={loading} />
        </div>
      </div>
      <Ics01_Lookup_SelectTdm icsId={selectOpen ? icsId : null} onSelect={lookupSelectTdm} onClose={() => setSelectOpen(false)} />
    </Modal>
  );
};
