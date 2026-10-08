/**
 * 사원찾기 조회창 (A03에서 처음 씀) — 여러 명 선택(체크 다중)해 돌려준다.
 * AS-IS: myApp/client/vi/emp/Emp01_Lookup_PersonModel.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(callback): 로그인 회사, isSeparateAddTitle=false(겸직 포함·퇴직 제외)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransPerson } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<TransPerson>();

/** AS-IS buildGrid() L128-138 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('orgNm', 140, '조직'),  // L132
  gb.text('empNo', 80, '사번'),  // L133
  gb.text('korNm', 80, '성명'),  // L134
  gb.text('titleNm', 100, '직책'),  // L135
];

interface Props {
  open: boolean;
  onClose: () => void;
  /** AS-IS callback.execute(체크한 행 목록) */
  onSelect: (persons: TransPerson[]) => void;
}

export const Emp01_Lookup_PersonModel: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const gridRef = useRef<AgGridReact<TransPerson>>(null);
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<TransPerson[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L140-153: 서비스 emp.Emp03_Trans.selectByText(companyId, '%' + korName + '%', isSeparateAddTitle)
  const retrieve = useCallback(async () => {
    try {
      setRows(await empApi.searchTransPersons(korName));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [korName]);

  // [E5] cancelButton[취소].Select (L102) → hide()
  const hide = () => { setKorName(''); setRows([]); onClose(); };

  // [E2] grid.RowDoubleClick (L84) / [E4] oKButton[확인].Select (L96) → confirm() L155-164
  const confirm = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length < 1) {
      message.warning('사원을 선택해주세요');
      return;
    }
    onSelect(checked);
    hide();
  };

  // settings() 끝: show() → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); }, [open]);

  return (
    <Modal
      open={open}
      title="사원찾기(조직/직무/성명)"
      width={500}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            <Button type="cancel" onClick={hide}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Typography.Text strong>조직/직무/성명</Typography.Text>
          {/* [E1] korName.KeyPress [Enter] (L76) → retrieve() */}
          <Input style={{ width: 150 }} value={korName} onChange={e => setKorName(e.target.value)} onPressEnter={retrieve} />
          {/* [E3] retrieveButton[조회].Select (L90) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TransPerson>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.transId)}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </Modal>
  );
};
