/**
 * 고객사 선택 조회창 (A07) — Sys07_Tab_CompanyRoleMenu 회사명 트리거, LoginPage(admin 서브도메인) 회사 칸 트리거(AS-IS L222-241)에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys01_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * UX보강(10) B12-2: 검색 줄 = SearchBar(UX-01·04)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<Company>();

/** AS-IS buildGrid() L109-117 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('locNm', 100, '고객코드'),  // L113
  gb.text('companyNm', 220, '고객명'),  // L114
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(result): 확인이면 고른 회사, 취소면 null */
  onResult: (company: Company | null) => void;
  /** 조회 대신 쓸 함수 — 로그인 전(LoginPage)에는 로그인이 필요한 sysApi 대신 공개 회사 목록으로 찾는다 */
  search?: (companyName: string) => Promise<Company[]>;
}

export const Sys01_Lookup_SelectSingle: React.FC<Props> = ({ open, onResult, search }) => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<Company[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L119-129: 서비스 sys.Sys01_Company.selectByName(companyName, useYn = true) — 서버가 '%' + 이름 + '%'
  const retrieve = useCallback(async (companyName: string) => {
    try {
      setRows(await (search ? search(companyName) : sysApi.searchCompanies(companyName, true)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [search]);

  // open() L45-70: 원본은 열 때마다 새 창 → 입력을 비우고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setKorName('');
    setRows([]);
    retrieve('');
  }, [open, retrieve]);

  // confirm() L131-142: 선택이 없으면 메시지, 있으면 callback(선택) + 닫기
  const confirm = () => {
    const selectModel = gridRef.current?.api.getSelectedRows()[0];
    if (!selectModel) {
      message.warning('선택된 고객이 없습니다');
      return;
    }
    onResult(selectModel);
  };

  // [E5] cancelButton[취소].Select (L100) → callback.execute(null), hide()
  const cancel = () => onResult(null);

  return (
    <LookupModal
      open={open}
      title="고객사"
      width={480}
      maskClosable={false}
      onCancel={cancel}
      footer={
        <div style={{ textAlign: 'center'  }}>
          <Space>
            {/* [E4] oKButton[확인].Select (L94) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            <Button type="cancel" onClick={cancel}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L88) → retrieve(). 초기화(UX-02)는 조건이 1개라 없음 */}
        <SearchBar onSearch={() => retrieve(korName)}>
          <SearchBar.Field label="고객명">
            {/* [E1] korName.KeyPress [Enter] (L74) → retrieve() */}
            <SearchBar.Input autoFocus style={{ width: 150 }} value={korName} onChange={e => setKorName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.RowDoubleClick (L82) → confirm() */}
          <SingleGrid<Company>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.companyId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
