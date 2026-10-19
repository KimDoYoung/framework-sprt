/**
 * 최근 사용한 문서분류 조회창 (F01) — 문서작성(Dcr01_Tab_DcrWrite)의 세부분류 옆 [불러오기]에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr08_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L40-65: 모달 850×400 "최근사용한 문서분류 List", 위 툴바 [새로고침] + 체크박스 단일 선택 그리드(문서분류 400 · 세부분류 250 · 사용횟수 80), 아래 가운데 [확인][닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrOftenUse } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<DcrOftenUse>();

interface Props {
  /** open(callback) L40 — 값이 true면 열린다 */
  open: boolean;
  /** callback.execute(selectModel); hide() */
  onResult: (row: DcrOftenUse) => void;
  onClose: () => void;
}

export const Dcr08_Lookup_SelectSingle: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [rows, setRows] = useState<DcrOftenUse[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<DcrOftenUse>>(null);

  // [E1] retrieveButton[새로고침].Select (L68) → retrieve() L107-118: dcr.Dcr08_OftenUse.selectByPersonId(personId) (personId는 서버가 세션에서)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await dcrApi.searchOftenUses());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // open() L40-65 → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setRows([]);
    void retrieve();
  }, [open]);

  // buildGrid() L94-105
  const columnDefs = useMemo(() => [
    gb.text('classTreeFullName', 400, '문서분류'),  // L100
    gb.text('classDetailName', 250, '세부분류'),  // L101
    gb.long('count', 80, '사용횟수'),  // L102
  ], []);

  // [E2] oKButton[확인].Select (L74)·[E4] grid.CellDoubleClick (L86) → confirm() L120-129: 고른 행이 없으면 "선택된 문서분류가 없습니다"
  const confirm = () => {
    const selectModel = gridRef.current?.api?.getSelectedRows()[0];
    if (!selectModel) {
      message.warning('선택된 문서분류가 없습니다');
      return;
    }
    onResult(selectModel);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="최근사용한 문서분류 List"
      width={850}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E3] cancelButton[닫기].Select (L80) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 280 }}>
        <div>
          <Button type="reset" onClick={retrieve}>새로고침</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<DcrOftenUse>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.oftenUseId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
