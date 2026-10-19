/**
 * 대표계정코드 조회창 (E28) — Act10_Tab_ReprAccount의 상대 대표계정코드 칸에서 연다 (act 도메인 다른 화면에서도 쓸 수 있는 조회창)
 * AS-IS: myApp/client/vi/act/Act10_Lookup_ReprAccount.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(searchText, callback) L48-89: 모달 600×500 "대표계정코드", 툴바(대표계정코드/명 150 · 계정속성 100 · 조회) + 체크박스 단일 그리드(속성 80 · 대표계정코드 100 · 대표계정명 300), [확인] [취소]. searchText가 있으면 검색칸에 미리 넣는다
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04). 초기화(UX-02)는 모달 폭 600에서 줄바꿈이 생겨 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { ReprAccount } from '@/types/act';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<ReprAccount>();
const ALL = '%';

/** AS-IS buildGrid() L126-136: setChecked(SINGLE) */
const buildGrid = () => [
  gb.textCenter('attributeName', 80, '속성'),  // L131
  gb.textCenter('reprAccountCode', 100, '대표계정코드'),  // L132
  gb.text('reprAccountName', 300, '대표계정명'),  // L133
];

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(searchText, callback): 검색칸에 미리 넣을 글자 */
  searchText?: string;
  /** callback.execute(result): 확인이면 고른 대표계정 */
  onResult: (row: ReprAccount) => void;
  /** 취소: hide()만 */
  onClose: () => void;
}

export const Act10_Lookup_ReprAccount: React.FC<Props> = ({ open, searchText, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<ReprAccount>>(null);
  const sp = useSearchParams(() => ({ searchText: '', attributeCode: ALL }));
  const [rows, setRows] = React.useState<ReprAccount[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L138-159: 로그인 회사, attributeCode(없으면 "%"), searchText(없으면 "%", 있으면 "%검색어%" — 서버가 만든다) → act.Act10_ReprAccount.selectByCompanyId
  const retrieve = useCallback(async (v = sp.current.current) => {
    try {
      setRows(await actApi.searchReprAccounts(v.attributeCode, v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp.current]);

  // open() L53-89: 새 창이라 입력을 처음 값(검색어는 넘겨받은 글자)으로 하고 열 때 retrieve()
  useEffect(() => {
    if (!open) return;
    const init = { searchText: searchText ?? '', attributeCode: ALL };
    sp.setValues(init);
    setRows([]);
    void retrieve(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick (L81) / [E4] oKButton[확인].Select (L112) → confirm() L161-172
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 대표계정코드가 없습니다.');
      return;
    }
    onResult(row);
  };

  return (
    <Modal open={open} title="대표계정코드" width={600} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L118) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L106) → retrieve(), [E2] searchText.KeyPress [Enter] (L97) → retrieve(). 초기화(UX-02)는 600폭에서 줄바꿈이 생겨(툴바 높이 72) 넣지 않는다 */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="대표계정코드/명">
            <SearchBar.Input autoFocus style={{ width: 150 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="계정속성">
            <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }}
              value={sp.values.attributeCode} onChange={code => sp.set('attributeCode', code ?? ALL)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<ReprAccount>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.reprAccountId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </Modal>
  );
};
