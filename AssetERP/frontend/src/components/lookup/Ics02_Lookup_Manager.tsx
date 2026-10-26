/**
 * 법규 관리그룹 조회창 (H08) — 법규관리의 관리그룹 칸·관리그룹 설정 창(Ics01_Lookup_Share)이 연다
 * AS-IS: myApp/client/vi/ics/Ics02_Lookup_Manager.java (148줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L44-66: 모달 450×500 "관리그룹", 관리그룹명 320 단일 선택 그리드, 아래 가운데 [확인] ([전체]) [닫기]. [전체]는 allButton(AS-IS open(true, …))일 때만
 * 열릴 때마다 조회한다(L65 retrieve()).
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsManager } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from './LookupModal';

const gb = gbFor<IcsManager>();
const COLUMNS = [gb.text('managerGroupName', 320, '관리그룹명')];  // L103
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(Boolean allButtonYn, …) L39 — true면 [전체] 버튼 */
  allButton?: boolean;
  /** 확인·더블클릭 = 고른 관리그룹, [전체] = null */
  onResult: (manager: IcsManager | null) => void;
  onClose: () => void;
}

export const Ics02_Lookup_Manager: React.FC<Props> = ({ open, allButton, onResult, onClose }) => {
  const [rows, setRows] = useState<IcsManager[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IcsManager | undefined>();

  // retrieve() L109-118: ics.Ics02_Manager.selectByCompanyId
  useEffect(() => {
    if (!open) return;
    setSelected(undefined);
    setLoading(true);
    icsApi.searchManagers().then(setRows).catch(err => message.error(errorMessage(err, '조회 실패'))).finally(() => setLoading(false));
  }, [open]);

  // [E1] oKButton[확인].Select (L69)·[E4] grid.CellDoubleClick (L90) → confirm() L120-132
  const confirm = (row = selected) => {
    if (!row) {
      message.warning('관리그룹을 선택해주세요');
      return;
    }
    onResult(row);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="관리그룹"
      width={510}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E2] allButton[전체].Select [callback != null] (L75) → callback.execute(null), hide() */}
            {allButton && <Button type="close" onClick={() => { onResult(null); onClose(); }}>전체</Button>}
            {/* [E3] cancelButton[닫기].Select (L84) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380 }}>
        <SingleGrid<IcsManager>
          rowData={rows}
          columnDefs={COLUMNS}
          getRowId={p => String(p.data.managerId)}
          loading={loading}
          rowSelection={SELECTION}
          onSelect={row => setSelected(row)}
          onRowDoubleClicked={e => e.data && confirm(e.data)}
        />
      </div>
    </LookupModal>
  );
};
