/**
 * 차량 찾기 조회창 (T11) — 전용차량 운행등록·운행변경·공용차량 화면의 차량번호 칸에서 연다 (car 도메인 다른 화면에서도 쓰는 조회창)
 * AS-IS: myApp/client/vi/car/Car01_Lookup_Info.java (241줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(carType, stdMonth, cb) L53-67 / openAdmin(carType, cb) L69-82 / openAll(carType, cb) L84-96: 모달 800×500, 툴바(검색 200 · 조회) + 단일 선택 그리드(차량번호 100 · 차량명 200 · 비고 350),
 *   [전체](공용차량 open·openAdmin에서만) [확인] [닫기]. 제목은 전용차량(1)이면 "전용차량 정보", 공용차량(2)이면 "공용차량 정보"
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarInfo } from '@/types/car';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<CarInfo>();

/** buildGrid() L167-177: setChecked(SINGLE) */
const buildGrid = () => [
  gb.text('carNo', 100, '차량번호'),  // L172
  gb.text('carNm', 200, '차량명'),  // L173
  gb.text('note', 350, '비고'),  // L174
];

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open의 carType: '1' 전용차량 / '2' 공용차량 */
  carType: '1' | '2';
  /** open(carType, stdMonth, cb)의 기준년월('YYYY.MM', 내 사용·예약 차량 조건). admin이면 쓰지 않는다 */
  stdMonth?: string;
  /** openAdmin·openAll: 사용자 조건 없이 그 구분의 차량 전부 */
  admin?: boolean;
  /** 공용차량 open·openAdmin의 [전체] 단추 (openAll에는 없다) → onResult(null) */
  allButton?: boolean;
  /** callback.execute(result): 확인이면 고른 차량, [전체]면 null */
  onResult: (row: CarInfo | null) => void;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Car01_Lookup_Info: React.FC<Props> = ({ open, carType, stdMonth, admin = false, allButton = false, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<CarInfo>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<CarInfo[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L179-206: searchText 없으면 "%", 있으면 "%검색어%" → car.Car01_Info.selectByCarType (admin이면 selectByCarTypeAdmin)
  const retrieve = useCallback(async (text = searchText) => {
    try {
      setRows(await carApi.searchLookupInfos({ carType, stdMonth, searchText: text, admin }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [carType, stdMonth, admin, searchText]);

  // open*() 끝: 새 창이라 검색어를 비우고 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick (L121) / [E5] oKButton[확인].Select (L153) → confirm() L213-221: 고른 행이 없으면 아무 일도 없다
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (row) onResult(row);
  };

  return (
    <LookupModal open={open} title={carType === '1' ? '전용차량 정보' : '공용차량 정보'} width={800} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] allButton[전체].Select (L147) → confirmAll() L208-211: callback.execute(null) 뒤 닫는다 */}
            {allButton && <Button type="select" onClick={() => onResult(null)}>전체</Button>}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E6] cancelButton[닫기].Select (L159) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L98-128) → settings(), show() */}
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L140) → retrieve(), [E2] searchText.KeyPress [Enter] (L132) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<CarInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.infoId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
