/**
 * 급여항목 다중 선택 조회창 (S16) — Pay11_TabPage_MonthItem의 [행 추가]가 항목구분(1 지급 / 2 공제)을 정해 연다.
 * AS-IS: myApp/client/vi/pay/Pay20_Lookup_SelectMulti.java (122줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L45-80: 체크 다중 그리드(지급구분 150 가운데 · 항목명 300) + 아래 가운데 [확인][취소]. open(itemType, callback) L38-43이 바로 조회한다.
 * Pay20_Lookup_ItemList(항목명 검색·구분 140)와는 다른 창이다(항목구분으로 거르고 검색칸이 없다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayItem } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PayItem>();

interface Props {
  /** 항목구분("1" 지급 / "2" 공제), 값이 있으면 열림 */
  itemType: string | null;
  /** AS-IS callback.execute(list): [확인]·더블클릭이면 고른 급여항목 목록 (뒤이어 창이 닫힌다) */
  onResult: (items: PayItem[]) => void;
  onClose: () => void;
}

export const Pay20_Lookup_SelectMulti: React.FC<Props> = ({ itemType, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PayItem>>(null);
  // [E0] 화면 열림 (생성자 L45-80) → show() — 항목구분이 정해지면 열면서 retrieve()
  const [rows, setRows] = useState<PayItem[]>([]);

  // buildGrid() L82-92 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.textCenter('itemTypeName', 150, '지급구분'),
    gb.text('itemName', 300, '항목명'),
  ], []);

  // retrieve() L94-106 → pay.Pay20_Item.selectByItemType
  const retrieve = useCallback(async (type: string) => {
    try {
      setRows(await payApi.searchItemsByType(type));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  useEffect(() => {
    if (itemType == null) return;
    setRows([]);
    void retrieve(itemType);
  }, [itemType, retrieve]);

  // confirm() L108-117: 고른 것이 없으면 안내, 있으면 callback(목록) 뒤 닫기
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('선택된 항목이 없습니다');
      return;
    }
    onResult(list);
  };

  return (
    <LookupModal
      open={itemType != null}
      title="급여항목"
      width={540}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] confirmButton[확인].Select (L52) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E2] cancelButton[취소].Select (L58) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 360 }}>
        {/* [E3] grid.CellDoubleClick (L68) → confirm() */}
        <MultiGrid<PayItem> rowClick
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.itemId)}
          onRowDoubleClicked={confirm}
        />
      </div>
    </LookupModal>
  );
};
