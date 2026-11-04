/**
 * 실시간 접속현황 창 (EE58) — 내 접속 기록 중 현재 시각 ±10분
 * AS-IS: myApp/client/vi/sys/Sys28_Lookup_LoginRealTime.java (94줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L33-58: 450×400, 머리말 "실시간 접속현황", 오른쪽 정렬 [새로고침] + 체크 다중 그리드 + [닫기]
 * buildGrid() L75-84: 접속시간 160 · IP정보 200
 * ※ AS-IS 호출처 Frm01_Lookup_CheckList L168·L182의 열기는 `//` 주석 처리라 AS-IS도 열 수 없다(도달 불가) — 화면 연결은 하지 않았다
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { frmApi } from '@/api/frm';
import { errorMessage } from '@/api/client';
import { FrmLoginRealTime } from '@/types/frm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FrmLoginRealTime>();

const columns = [
  gb.text('loginTimeStr', 160, '접속시간'), // L80
  gb.text('ipAddress', 200, 'IP정보'),       // L81
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sys28_Lookup_LoginRealTime: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<FrmLoginRealTime[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L86-90 — sys.Sys28_LoginRealTime.selectByDate
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await frmApi.searchLoginRealTimes());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (open L33-58) → retrieve(), show()
  useEffect(() => { if (open) void retrieve(); }, [open, retrieve]);

  return (
    <LookupModal
      open={open}
      title="실시간 접속현황"
      width={550}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancelButton[닫기].Select (L67) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* [E1] retrieveButton[새로고침].Select (L61) → retrieve() */}
          <Button type="search" onClick={() => void retrieve()}>새로고침</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FrmLoginRealTime> rowClick rowData={rows} columnDefs={columns} loading={loading} getRowId={p => String(p.data.loginRealTimeId)} />
        </div>
      </div>
    </LookupModal>
  );
};
