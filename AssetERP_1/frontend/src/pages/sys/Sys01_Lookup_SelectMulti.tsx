/**
 * 고객사 다중 선택 조회창 (A14) — Sys08_Tab_CodeKindClient 코드복사에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys01_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<Company>();

/** AS-IS buildGrid() (setChecked MULTI) */
const buildGrid = () => [
  gb.text('locNm', 100, '고객코드'),
  gb.text('companyNm', 300, '고객명'),
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(companyList): 확인이면 고른 회사 목록 */
  onResult: (companies: Company[]) => void;
  /** 취소: hide()만 (callback 없음) */
  onClose: () => void;
}

export const Sys01_Lookup_SelectMulti: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<Company[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L122-131: 서비스 sys.Sys01_Company.selectByName(companyName, useYn = true)
  const retrieve = useCallback(async (companyName: string) => {
    try {
      setRows(await sysApi.searchCompanies(companyName, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L46-74: 원본은 열 때마다 새 창 → 입력을 비우고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setKorName('');
    setRows([]);
    retrieve('');
  }, [open, retrieve]);

  // confirm() L133-145: 선택이 없으면 메시지(닫지 않음), 있으면 callback(목록) + 닫기
  const confirm = () => {
    const companyList = gridRef.current?.api.getSelectedRows() ?? [];
    if (companyList.length === 0) {
      message.warning('선택된 고객이 없습니다');
      return;
    }
    onResult(companyList);
  };

  return (
    <Modal
      open={open}
      title="고객사"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] oKButton[확인].Select (L97) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L103) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Typography.Text strong style={{ display: 'inline-block', width: 50 }}>고객명</Typography.Text>
          {/* [E1] korName.KeyPress [Enter] (L77) → retrieve() */}
          <Input autoFocus style={{ width: 120 }} value={korName} onChange={e => setKorName(e.target.value)}
            onPressEnter={() => retrieve(korName)} />
          {/* [E3] retrieveButton[조회].Select (L91) → retrieve() */}
          <Button type="search" onClick={() => retrieve(korName)}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.RowDoubleClick (L85) → confirm() */}
          <MultiGrid<Company>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.companyId)}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </Modal>
  );
};
