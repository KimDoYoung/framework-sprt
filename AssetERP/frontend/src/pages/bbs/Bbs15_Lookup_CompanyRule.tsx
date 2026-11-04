/**
 * 내부규정 조회창 — 직무 연관규정 매핑 창(Tdm11_Lookup_TaskRelateRule)의 [행 추가]가 연다 (다른 도메인에서도 쓰는 조회창).
 * AS-IS: myApp/client/vi/bbs/Bbs15_Lookup_CompanyRule.java (158줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L44-49 · open() L56-78: 700×500 모달 "내부규정", 툴바(검색 · 입력 200 · [조회]) + 체크박스 다중 그리드(내규코드 100 · 내규 500) + [확인][닫기]
 * tdmOpen(taskId, callback) L51-54: 그 직무에 이미 연결된 내규(연결구분 '2')는 목록에서 뺀다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bbsApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsCompanyRule } from '@/types/bbs';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BbsCompanyRule>();

interface Props {
  open: boolean;
  /** tdmOpen(taskId, …): 값이 있으면 그 직무에 이미 연결된 내규는 뺀다 */
  taskId?: number | null;
  /** [확인] — AS-IS callback.execute(선택한 행들). 닫는 것은 부르는 쪽 */
  onResult: (rows: BbsCompanyRule[]) => void;
  /** [닫기]: hide()만 */
  onClose: () => void;
}

export const Bbs15_Lookup_CompanyRule: React.FC<Props> = ({ open, taskId, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BbsCompanyRule>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsCompanyRule[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L134-150: 서비스 bbs.Bbs15_CompanyRule.selectBySearchText(companyId, ruleType "%", stdDate 오늘, searchText "%글자%", taskId)
  const retrieve = useCallback(async (text: string) => {
    setLoading(true);
    try {
      setRows(await bbsApi.searchPublicCompanyRules('%', text, taskId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  // [E0] 화면 열림 (생성자 L44-49) · open() L56-78: 열면 바로 조회한다
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // [E3] selectButton[확인].Select (L97) → selectClose() L121-132: 선택이 없으면 "선택한 내역이 없습니다", 있으면 callback(선택 행들) 뒤 hide()
  const selectClose = () => {
    const picked = gridRef.current?.api.getSelectedRows() ?? [];
    if (picked.length === 0) { message.warning('선택한 내역이 없습니다'); return; }
    onResult(picked);
  };

  // buildGrid() — 체크박스(다중)
  const columnDefs = useMemo(() => [
    gb.textCenter('companyRuleCode', 100, '내규코드'),
    gb.text('title', 500, '내규'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="내부규정"
      width={800}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="select" onClick={selectClose}>확인</Button>
          {/* [E4] closeButton[닫기].Select (L103) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 'min(420px, calc(100vh - 260px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L82) · [E2] retrieveButton[조회].Select (L91) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input autoFocus style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BbsCompanyRule>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.companyRuleId)}
            loading={loading}
            rowClick
          />
        </div>
      </div>
    </LookupModal>
  );
};
