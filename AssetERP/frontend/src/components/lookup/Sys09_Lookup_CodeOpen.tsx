/**
 * 코드찾기 창 (EE90) — Sys09_Lookup_Code의 open(codeKind, callback) 선택 모드. 편집 모드 edit()는 `Sys09_Lookup_Code.tsx`
 * AS-IS: myApp/client/vi/sys/Sys09_Lookup_Code.java — open() L114-128 / setting() L130-184 / retrieve() L198-215 — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 500×500 모달 "코드찾기", 읽기 전용 그리드(코드 70·코드명 350, 뒤 세 열은 숨김), 행 더블클릭·[확인]·[취소]
 * retrieve(): 서비스 sys.Sys09_Code.selectByCodeKind(회사, 코드구분, 오늘)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CodeAdmin } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<CodeAdmin>();
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(codeKind, …)의 codeKind (예: 'SectorTypeCode') */
  codeKind: string;
  /** 행 더블클릭 또는 [확인](고른 행이 있을 때만) → callback.execute(codeModel) 뒤 hide() */
  onResult: (row: CodeAdmin) => void;
  onClose: () => void;
}

export const Sys09_Lookup_CodeOpen: React.FC<Props> = ({ open, codeKind, onResult, onClose }) => {
  const [rows, setRows] = useState<CodeAdmin[]>([]);
  const [selected, setSelected] = useState<CodeAdmin | null>(null);
  const [loading, setLoading] = useState(false);

  // [E0] 열림 → retrieve()
  useEffect(() => {
    if (!open) return;
    setSelected(null); setRows([]);
    setLoading(true);
    sysApi.searchCodesByKindCode(codeKind)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setLoading(false));
  }, [open, codeKind]);

  const pick = (row: CodeAdmin) => { onResult(row); onClose(); };

  // okButton[확인].Select (L162): 고른 것이 있으면 callback, 없어도 hide()
  const ok = () => { if (selected) onResult(selected); onClose(); };

  const columns = useMemo(() => [
    gb.text('code', 70, '코드'),  // L189
    gb.text('name', 350, '코드명'),  // L190
  ], []);

  return (
    <LookupModal
      open={open}
      title="코드찾기"
      width={620}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={ok}>확인</Button>
            {/* cancelButton[취소].Select (L172) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380 }}>
        <SingleGrid<CodeAdmin>
          rowData={rows}
          columnDefs={columns}
          getRowId={p => String(p.data.codeId)}
          loading={loading}
          rowSelection={SINGLE_CHECKED}
          onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0] ?? null)}
          onRowDoubleClicked={e => e.data && pick(e.data)}
        />
      </div>
    </LookupModal>
  );
};
