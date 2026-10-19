/**
 * 상위계정 조회창 (E27) — Act01_Edit_AccountCode의 상위계정 칸에서 연다
 * AS-IS: myApp/client/vi/act/Act01_Lookup_Parent.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L53-92: 모달 800×500 "상위계정", 툴바(계정코드/명 · 계정속성 · 사용여부 · 조회) + 체크박스 단일 그리드(계정코드 100 · 계정과목 310 · 계정과목(보고서용) 310), [확인] [취소]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·02·04)
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { message, Modal, Select, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AccountCodeAdmin } from '@/types/act';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<AccountCodeAdmin>();
const ALL = '%';
const USE_OPTIONS = [{ value: ALL, label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];  // useYnName 전체·사용·미사용

/** AS-IS buildGrid() L137-147: setChecked(SINGLE) */
const buildGrid = () => [
  gb.textCenter('accountCode', 100, '계정코드'),  // L142
  gb.textArea('accountName', 310, '계정과목'),  // L143
  gb.textArea('accountName2', 310, '계정과목(보고서용)'),  // L144
];

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(result): 확인이면 고른 계정 */
  onResult: (row: AccountCodeAdmin) => void;
  /** 취소: hide()만 */
  onClose: () => void;
}

export const Act01_Lookup_Parent: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AccountCodeAdmin>>(null);
  const sp = useSearchParams(() => ({ searchText: '', attributeCode: ALL, useYn: ALL }));
  const [rows, setRows] = React.useState<AccountCodeAdmin[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L149-189: useYn(전체 %·사용 true·미사용 false), attributeCode(없으면 "%"), searchText(없으면 "%", 있으면 "%검색어%" — 서버가 만든다) → act.Act01_AccountCode.selectByCompanyId(로그인 회사)
  const retrieve = useCallback(async (v = sp.current.current) => {
    try {
      setRows(await actApi.searchAccountCodeList(v.searchText, v.useYn, v.attributeCode));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp.current]);

  // open() L53-92: 새 창이라 입력을 처음 값으로 되돌리고 열 때 retrieve()
  useEffect(() => {
    if (!open) return;
    sp.reset();
    setRows([]);
    void retrieve({ searchText: '', attributeCode: ALL, useYn: ALL });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick (L84) / [E4] oKButton[확인].Select (L123) → confirm() L191-199: 고른 행이 없으면 아무 것도 안 한다
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (row) onResult(row);
  };

  return (
    <Modal open={open} title="상위계정" width={800} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L129) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L116) → retrieve(), [E2] searchText.KeyPress [Enter] (L107) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} onReset={sp.reset}>
          <SearchBar.Field label="계정코드/명">
            <SearchBar.Input style={{ width: 150 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="계정속성">
            <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }}
              value={sp.values.attributeCode} onChange={code => sp.set('attributeCode', code ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="사용여부">
            <Select style={{ width: 100 }} value={sp.values.useYn} onChange={v => sp.set('useYn', v)} options={USE_OPTIONS} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AccountCodeAdmin>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.accountCodeId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </Modal>
  );
};
