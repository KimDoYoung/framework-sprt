/**
 * 인사평가 대상등록 — 사원 여러 명 + 비중(%) 초기설정값 (T01) — Emp43_Tab_EvalTarget의 [등록]에서 연다
 * AS-IS: myApp/client/vi/emp/Emp43_Lookup_SelectMulti.java (206줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L54-92: 모달 800×500 "인사평가 대상등록", 위 툴바(L69-73) 검색 [조직/직책/성명/구분] [조회], 그리드(체크박스 다중: 조직 200 · 직책 120 · 성명 100 · 구분 100 · 입사일 100 · 발령일 100),
 *   아래 툴바(L75-81) "* 비중(%) 초기설정값 1차 평가자 [50] / 2차 평가자 [50]", 아래 가운데 [생성][닫기]. 열면 곧바로 조회(L91)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InputNumber, message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalCandidate } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<EvalCandidate>();

/** buildGrid() L141-153 */
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L145
  gb.textCenter('titleNm', 120, '직책'),  // L146
  gb.textCenter('korNm', 100, '성명'),  // L147
  gb.textCenter('orgHeadNm', 100, '구분'),  // L148
  gb.date('hireDate', 100, '입사일'),  // L149
  gb.date('transDate', 100, '발령일'),  // L150
];

/** [생성]이 돌려주는 값: 고른 사원 + TempData.setFirstWeight/setSecondWeight(L186-187) */
export interface EvalCandidateResult {
  rows: EvalCandidate[];
  firstWeight: number;
  secondWeight: number;
}

interface Props {
  open: boolean;
  /** callback.execute(list) L193 — [생성] 뒤 부르고 창은 이 컴포넌트가 onClose로 닫는다(hide) */
  onResult: (result: EvalCandidateResult) => void;
  onClose: () => void;
}

export const Emp43_Lookup_SelectMulti: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<EvalCandidate>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<EvalCandidate[]>([]);
  // settings() L94-139: firstWeight = 50, secondWeight = 50, 한쪽을 바꾸면 다른 쪽이 100 - 값 (E1·E2)
  const [firstWeight, setFirstWeight] = useState<number | null>(50);
  const [secondWeight, setSecondWeight] = useState<number | null>(50);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L155-168: emp.Emp00_TransInfo.selectByEvalText(companyId(서버), "%검색어%", 기준일은 서버가 오늘로)
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await empEvalApi.searchEvalCandidates(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setFirstWeight(50);
    setSecondWeight(50);
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // [E5] insertButton[생성].Select (L127) → confirm() L170-197
  const confirm = () => {
    if (firstWeight == null) { message.warning('1차 평가자 비중(%)을 입력해주세요'); return; }
    if (secondWeight == null) { message.warning('2차 평가자 비중(%)을 입력해주세요'); return; }
    if (firstWeight + secondWeight !== 100) { message.warning('초기설정값의 합은 100(%)이어야 합니다'); return; }
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) { message.warning('선택된 사원이 없습니다'); return; }
    onResult({ rows: list, firstWeight, secondWeight });
    onClose();
  };

  return (
    <LookupModal open={open} title="인사평가 대상등록" width={910} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={confirm}>생성</Button>
            {/* [E6] closeButton[닫기].Select (L133) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L121) → retrieve(), [E3] searchTextField.KeyPress [Enter] (L113) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="조직/직책/성명/구분" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<EvalCandidate>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.personId)}
            rowClick
          />
        </div>
        {/* buttonBarBottom L75-81 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, paddingLeft: 10 }}>
          <b style={{ color: '#0069B4' }}>* 비중(%) 초기설정값</b>
          <b style={{ color: '#0069B4', marginLeft: 6 }}>1차 평가자</b>
          {/* [E1] firstWeight.ValueChange (L97) → secondWeight = 100 - firstWeight */}
          <InputNumber style={{ width: 80 }} precision={0} value={firstWeight}
            onChange={v => { const n = v == null ? null : Number(v); setFirstWeight(n); setSecondWeight(n == null ? null : 100 - n); }} />
          <span>/</span>
          <b style={{ color: '#0069B4' }}>2차 평가자</b>
          {/* [E2] secondWeight.ValueChange (L105) → firstWeight = 100 - secondWeight */}
          <InputNumber style={{ width: 80 }} precision={0} value={secondWeight}
            onChange={v => { const n = v == null ? null : Number(v); setSecondWeight(n); setFirstWeight(n == null ? null : 100 - n); }} />
        </div>
      </div>
    </LookupModal>
  );
};
