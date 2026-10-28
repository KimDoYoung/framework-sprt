/**
 * 증명서 신청내역 조회창 (S05) — Emp15_Tab_Cert의 [신청내역 가져오기]가 연다
 * AS-IS: myApp/client/vi/emp/Emp15_Lookup_GetCert.java (134줄) — 모달 400×450 "신청내역"(닫기 X 없음), 위 툴바 [조회] + 체크 단일 선택 그리드, 아래 가운데 [확인][닫기]
 * open(callback) L42-47, retrieve() L111-124, update() L126-129
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bbsApplicationApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsApplication } from '@/types/bbs';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BbsApplication>();

/** buildGrid() L100-109 */
const columnDefs = [
  gb.date('appDate', 90, '신청일'), // L102 (읽기 전용 날짜 UX-08)
  gb.textCenter('appEmpName', 80, '신청자'), // L103
  gb.textCenter('appTypeName', 130, '신청구분'), // L104
];

interface Props {
  open: boolean;
  /** [확인]·더블클릭: callback.execute(고른 신청내역) 뒤 hide() */
  onResult: (row: BbsApplication) => void;
  onClose: () => void;
}

export const Emp15_Lookup_GetCert: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BbsApplication>>(null);
  const [rows, setRows] = useState<BbsApplication[]>([]);

  // [E0] 화면 열림 (생성자 L49-70) → settings() / [E1] retrieveButton[조회].Select (L73) → retrieve() L111-124: 서비스 bbs.Bbs11_Application.selectByAppStatus(companyId, "10")
  const retrieve = async () => {
    try {
      setRows(await bbsApplicationApi.searchByAppStatus('10'));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  useEffect(() => { if (open) retrieve(); }, [open]);

  // [E2] updateButton[확인].Select (L79) / [E4] grid.CellDoubleClick (L92) → update() L126-129
  const update = (row?: BbsApplication) => {
    const sel = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) return message.warning('선택된 신청내역이 없습니다'); // 원본은 선택이 없으면 아무 일 없음 — 안내만 더한다
    onResult(sel);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="신청내역"
      width={450}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => update()}>확인</Button>
            {/* [E3] cancleButton[닫기].Select (L85) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 350, display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        {/* 툴바 L57-59: {빈칸} [조회] */}
        <div style={{ padding: '8px 10px' }}>
          <Button type="search" onClick={retrieve}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BbsApplication>
          gridRef={gridRef}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.applicationId)}
          onRowDoubleClicked={e => e.data && update(e.data)}
        />
        </div>
      </div>
    </LookupModal>
  );
};
