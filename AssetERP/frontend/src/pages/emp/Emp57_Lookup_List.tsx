/**
 * 그룹선택 창 (Z02) — Bbs02_Edit_Notice의 [그룹]이 연다 (문자발송 Sms03 등 다른 화면도 쓴다)
 * AS-IS: myApp/client/vi/emp/Emp57_Lookup_List.java (224줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(actionCode, callback) L54-80: 모달 "그룹선택" 320×600, 위 오른쪽 [전체공개 포함](기본 해제), 그룹 그리드(체크박스 단일, 그룹명 200 · 보기 아이콘 35), 아래 가운데 [확인][닫기]
 * actionCode: "email"(이메일 `이름 <주소>;` 문자열) · "phone"(핸드폰 번호 있는 담당자) · "emp03model"(사내 담당자만 — 사원 ID·조직·직책·사번·이름)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empAddrBookApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EmpAddrBookGroup, EmpAddrBookSelect } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp57_Lookup_DetailList } from './Emp57_Lookup_DetailList';

const gb = gbFor<EmpAddrBookGroup>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export type Emp57ListAction = 'email' | 'phone' | 'emp03model';

interface Props {
  open: boolean;
  actionCode: Emp57ListAction;
  /** AS-IS callback.execute(result): email → 문자열, phone·emp03model → 담당자 목록 */
  onSelect: (result: string | EmpAddrBookSelect[]) => void;
  onClose: () => void;
}

export const Emp57_Lookup_List: React.FC<Props> = ({ open, actionCode, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<EmpAddrBookGroup>>(null);
  const [rows, setRows] = useState<EmpAddrBookGroup[]>([]);
  const [publicYn, setPublicYn] = useState(false);   // settings() L82-112: 기본 해제
  const [detailId, setDetailId] = useState<number | null>(null);

  // retrieve() L204-215: 서비스 emp.Emp57_AddrBookGroup.getList(companyId, personId, publicYn)
  const retrieve = useCallback(async (yn: boolean) => {
    try {
      setRows(await empAddrBookApi.searchGroupList(yn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 열림 open() L54-80 → show() 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    setPublicYn(false);
    void retrieve(false);
  }, [open, retrieve]);

  // selectItem(parentId) L114-184: 서비스 emp.Emp57_AddrBookGroup.selectByParentId → actionCode별로 callback 후 hide()
  const selectItem = async (group: EmpAddrBookGroup) => {
    try {
      const list = await empAddrBookApi.searchGroupSelectItems(group.addrBookGroupId);
      if (actionCode === 'email') {
        onSelect(list.filter(m => m.emailAddress != null).map(m => `${m.contacterName} <${m.emailAddress}>;`).join(''));
      } else if (actionCode === 'phone') {
        onSelect(list.filter(m => m.mobileTelNo != null));
      } else {
        onSelect(list.filter(m => m.parentGubun === '사내'));
      }
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] confirmButton[확인].Select (L92): 한 줄을 골랐을 때만 selectItem
  const confirm = () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 1) void selectItem(selected[0]);
  };

  // buildGrid() L186-202 (체크박스 단일)
  const columnDefs = useMemo(() => [
    gb.text('groupName', 200, '그룹명'),  // L199
    // L200 addCell(actionCell, 35, " ", ImageCell("View")) → Emp57_Lookup_DetailList.open(addrBookGroupId)
    iconCell<EmpAddrBookGroup>('view', 'actionCell', 35, ' ', row => setDetailId(row.addrBookGroupId)),
  ], []);

  return (
    <LookupModal
      open={open}
      title="그룹선택"
      width={320}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E3] cancelButton[닫기].Select (L100) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 460, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'right' }}>
          {/* [E1] publicYn[전체공개 포함].ValueChange (L85) → retrieve() */}
          <Checkbox checked={publicYn} onChange={e => { setPublicYn(e.target.checked); void retrieve(e.target.checked); }}>전체공개 포함</Checkbox>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<EmpAddrBookGroup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.addrBookGroupId)}
            rowSelection={SINGLE_SELECTION}
            // [E4] grid.RowDoubleClick (L106) → selectItem()
            onRowDoubleClicked={e => { if (e.data) void selectItem(e.data); }}
          />
        </div>
      </div>
      <Emp57_Lookup_DetailList parentId={detailId} onClose={() => setDetailId(null)} />
    </LookupModal>
  );
};
