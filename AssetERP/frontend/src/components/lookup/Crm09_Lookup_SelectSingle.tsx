/**
 * 영업 거래처 조회창 (L12) — Biz01_Tab_PriorApprovalSimple의 거래상대방 칸에서 연다 (open("keyInCompany"))
 * AS-IS: myApp/client/vi/crm/Crm09_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-120: 모달 450×500 "영업 거래처", 위 = 툴바(검색 200 · [조회]), 아래 = 단일 체크 그리드, 아래 가운데 [확인][취소]
 *   code가 "keyInCompany"(또는 "company")면 회사명 350 한 열만 보인다 (setting() L122-140). 다른 code(emp·그 밖)는 이 화면에서 부르지 않아 만들지 않았다
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { crmContactApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { CrmContact } from '@/types/crm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<CrmContact>();
/** setChecked(SINGLE) — 체크박스 한 행. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** confirm() L199-208: 고른 행 (callback.execute(list)) */
  onResult: (row: CrmContact) => void;
  onClose: () => void;
}

export const Crm09_Lookup_SelectSingle: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<CrmContact>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<CrmContact[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L158-197: 검색어 "%…%" → crm.Crm09_Contact.selectKeyInCompanyName. 읽은 뒤 선택은 바꾸지 않는다(원본에 첫 행 선택 없음)
  const load = async (text: string) => {
    setBusy(true);
    try {
      setRows(await crmContactApi.searchKeyInCompanies(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 화면 열림 → open() L49-120: setting(code), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] oKButton[확인].Select (L83) · [E5] grid.CellDoubleClick (L107) → confirm() L199-208
  const confirm = (row?: CrmContact) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(target);
    onClose();
  };

  // buildGrid() L142-156 + setting() L122-140: keyInCompany는 회사명 350 한 열
  const columnDefs = useMemo(() => [
    gb.text('contactName', 350, '회사명'),  // L148 (setColumnWidth(2, 350))
  ], []);

  return (
    <LookupModal
      open={open}
      title="영업 거래처"
      width={540}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L89) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] findTextField.KeyPress [Enter] (L68), [E2] retrieveButton[조회].Select (L77) → retrieve() */}
        <SearchBar onSearch={() => load(searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<CrmContact>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.contactId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
      </div>
    </LookupModal>
  );
};
