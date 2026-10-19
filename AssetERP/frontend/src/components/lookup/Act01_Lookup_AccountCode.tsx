/**
 * 계정코드 조회창 (E25) — Emp55_Tab_benefitInfoManager 계정코드 칸에서 연다 (다른 도메인에서도 쓰는 조회창).
 * AS-IS: myApp/client/vi/act/Act01_Lookup_AccountCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L73-111과 open(searchText, callback) L53-56(E31, `searchText` prop)을 옮겼다(SINGLE: 선택 1건). openMulti·openCompanyId는 쓰는 화면이 생기면 더한다(`companyId`는 prop으로 이미 받는다).
 * 모달 800×500, 툴바(계정속성 콤보 · 계정코드/명 · 조회) + 체크박스 단일 그리드(속성 80 · 계정코드 100 · 계정과목 500) + [확인] [취소]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04). 조건이 둘뿐이라 초기화(UX-02)는 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AccountCode } from '@/types/act';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<AccountCode>();

/** AS-IS buildGrid() L164-179: setChecked(SINGLE) */
const buildGrid = () => [
  gb.textCenter('attributeName', 80, '속성'),  // L174
  gb.textCenter('accountCode', 100, '계정코드'),  // L175
  gb.textArea('accountName', 500, '계정과목'),  // L176
];

interface Props {
  open: boolean;
  /** AS-IS openCompanyId(companyId): 없으면 로그인 회사 */
  companyId?: number;
  /** AS-IS open(searchText, callback) L53-56: 검색칸에 미리 넣고 그 글자로 조회한다 */
  searchText?: string;
  /** callback.execute(result): 확인이면 고른 계정 */
  onResult: (row: AccountCode) => void;
  /** 취소: hide()만 */
  onClose: () => void;
}

export const Act01_Lookup_AccountCode: React.FC<Props> = ({ open, companyId, searchText: initialText, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AccountCode>>(null);
  const [attributeCode, setAttributeCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AccountCode[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L181-216: attributeCode(없으면 "%"), searchText(없으면 "%", 있으면 "%검색어%" — 서버가 만든다), companyId(없으면 로그인 회사) → act.Act01_AccountCode.selectBySlipYn
  const retrieve = useCallback(async (attribute: string, text: string) => {
    try {
      setRows(await actApi.searchAccountCodes(attribute, text, companyId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyId]);

  // open() L73-111: 열 때 입력을 비우고(새 창) 속성 콤보 로딩이 끝나면 retrieve()
  useEffect(() => {
    if (!open) return;
    setAttributeCode('%');
    setSearchText(initialText ?? '');
    setRows([]);
    retrieve('%', initialText ?? '');
  }, [open, retrieve, initialText]);

  // [E1] grid.CellDoubleClick (L104) / [E5] oKButton[확인].Select (L150) → confirm() L218-232
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('계정과목을 선택하세요');
      return;
    }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="계정코드" width={800} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E6] cancelButton[취소].Select (L156) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L144) → retrieve() */}
        <SearchBar onSearch={() => retrieve(attributeCode, searchText)}>
          <SearchBar.Field label="계정속성">
            {/* [E2] attributeComboBox[AccountAttributeCode].Collapse (L127) → retrieve() */}
            <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }}
              value={attributeCode}
              onChange={code => { const v = code ?? '%'; setAttributeCode(v); retrieve(v, searchText); }} />
          </SearchBar.Field>
          <SearchBar.Field label="계정코드/명">
            {/* [E3] searchText.KeyPress [Enter] (L135) → retrieve() */}
            <SearchBar.Input autoFocus style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AccountCode>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.accountCodeId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
