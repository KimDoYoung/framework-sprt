/**
 * 계약사 조회창 (EE21) — Biz20_Tab_FeeCharge의 [계약사별자료생성]이 연다
 * AS-IS: myApp/client/vi/biz/Biz10_Lookup_ContCorp.java (165줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L92-113: 모달 850×400 "계약사", 검색 줄 = 검색 [200] [조회] / 그리드(체크 단일 8열) / [확인][닫기]
 * 열 때 retrieve() L139-155: biz.Biz10_ContCorp.selectByText(companyId, 검색어, check false, stdYear "none", statusCode "%", statusCheck false) — EE20 계약사 조회 API 그대로
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창 UX-05
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContCorp } from '@/types/bizCont';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizContCorp>();
/** setChecked(SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(contCorpId) — [확인] (고른 계약사 ID). 닫는 것은 부르는 쪽 */
  onResult: (contCorpId: number) => void;
  /** [닫기] — AS-IS callback.execute(null) 뒤 hide() */
  onClose: () => void;
}

export const Biz10_Lookup_ContCorp: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BizContCorp>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizContCorp[]>([]);
  const [loading, setLoading] = useState(false);

  // buildGrid() L115-137 (8열, 최저보수·병행보수 등은 원본도 주석 처리)
  const columnDefs = useMemo(() => [
    gb.date('contDate', 100, '(재)계약일자'),  // L120
    gb.text('contCorpNm', 150, '계약사명'),  // L121
    gb.text('contStatusNm', 100, '계약상태'),  // L122
    gb.text('corpStatusNm', 100, '거래유무'),  // L123
    gb.text('trType', 100, '거래형태'),  // L124
    gb.textCenter('contPeriodNm', 80, '계약기간'),  // L125
    gb.date('startDate', 100, '거래개시일'),  // L126
    gb.date('closeDate', 100, '거래종료일'),  // L127
  ], []);

  // [E1] searchText.KeyPress [Enter] (L56) · [E2] retrieveButton[조회].Select (L64) → retrieve() L139-155
  const retrieve = async (text = searchText) => {
    setLoading(true);
    try {
      setRows(await bizContCorpApi.search({ searchText: text, check: false, stdYear: 'none', statusCode: '%', statusCheck: false, endMonth: '' }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L92-113) → show() · open() → retrieve()
  useEffect(() => {
    if (open) { setSearchText(''); void retrieve(''); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] confirmButton[확인].Select (L71): 한 건을 골랐으면 계약사 ID를 돌려주고 닫는다, 아니면 "계약사 정보를 선택해주세요"
  const confirm = () => {
    const picked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (picked.length !== 1) { message.warning('계약사 정보를 선택해주세요'); return; }
    onResult(picked[0].contCorpId);
  };

  return (
    <LookupModal
      open={open}
      title="계약사"
      width={1020}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L83) → callback(null), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BizContCorp>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.contCorpId)}
            loading={loading}
            rowSelection={SINGLE_CHECK}
          />
        </div>
      </div>
    </LookupModal>
  );
};
