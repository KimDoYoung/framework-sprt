/**
 * 코드 목록 조회창 (A13 — Sys13_TabPage_Code 등록에서 연다)
 * AS-IS: myApp/client/vi/sys/Sys09_Lookup_CodeKind.java — open(codeKindId, companyId, callback) 만 옮김
 * (open(kindCode, …)·tdmLawOpen(taskId, …)의 TdmLawCode 법규목록은 이 화면에서 안 쓴다 — 쓰는 화면에서 더한다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CodeAdmin } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<CodeAdmin>();

/** AS-IS buildGrid() L157-167 (setChecked MULTI) */
const buildGrid = () => [
  gb.textCenter('code', 100, '코드'),  // L163
  gb.text('name', 200, '코드명'),  // L164
];

interface Props {
  open: boolean;
  codeKindId: number;
  companyId: number;
  /** callback.execute(list) — 고른 코드들. 닫기는 onClose */
  onResult: (codes: CodeAdmin[]) => void;
  onClose: () => void;
}

export const Sys09_Lookup_CodeKind: React.FC<Props> = ({ open, codeKindId, companyId, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<CodeAdmin>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<CodeAdmin[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L169-185: codeKindId·companyId·searchText
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await sysApi.searchCodesByKind(codeKindId, companyId, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [codeKindId, companyId]);

  // open() L83-124: 열 때마다 새 창 → 검색어를 비우고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    retrieve('');
  }, [open, retrieve]);

  // confirm() L187-197: 선택이 없으면 메시지, 있으면 callback(목록) + 닫기
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('코드를 선택해주세요');
      return;
    }
    onResult(list);
  };

  return (
    <Modal
      open={open}
      title="코드목록"
      width={400}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* confirmButton[확인].Select (L143) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* cancelButton[닫기].Select (L149) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 450, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Typography.Text strong>검색</Typography.Text>
          {/* searchText.KeyPress [Enter] (L127) → retrieve() */}
          <Input autoFocus style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)}
            onPressEnter={() => retrieve(searchText)} />
          {/* retrieveButton[조회].Select (L136) → retrieve() */}
          <Button type="search" onClick={() => retrieve(searchText)}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<CodeAdmin> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.codeId)} />
        </div>
      </div>
    </Modal>
  );
};
