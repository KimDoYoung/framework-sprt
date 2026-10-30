/**
 * 거래유형(화면별) 조회창 (U04) — Ast06_Tab_TrTax의 거래유형 칸에서 연다
 * AS-IS: myApp/client/vi/ast/Ast05_Lookup_TrCodeWindow.java (195줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(windowClassName, searchText, callback) L53-59 / 생성자 L61-79: 모달 600×400 "거래유형(화면별)", 툴바(검색 라벨 · 거래코드/명 200 · 수령/지급 100 · 조회) + 단일 선택 그리드(행번호, 거래코드 80 · 거래명 200 · 수령/지급 100 · 비고 150), [확인] [전체] [닫기]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeByWindow } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<AstTrCodeByWindow>();
const ALL = '%';

/** buildGrid() L143-153 */
const columnDefs = [
  gb.textCenter('trCode', 80, '거래코드'),  // L147
  gb.text('trName', 200, '거래명'),  // L148
  gb.text('rcvPayName', 100, '수령/지급'),  // L149
  gb.text('note', 150, '비고'),  // L150
];

interface Props {
  open: boolean;
  /** open(windowClassName, …): 거래유형을 지정한 화면 (예: "Ast06_Tab_TrTax") */
  windowClassName: string;
  /** open(…, searchText, …): 검색칸에 미리 넣을 글자 */
  searchText?: string | null;
  /** callback.execute(result): [확인]·더블클릭이면 고른 거래유형(고른 게 없으면 null), [전체]면 null — 부르는 쪽이 닫는다 */
  onResult: (row: AstTrCodeByWindow | null) => void;
  /** [닫기]: hide()만 */
  onClose: () => void;
}

export const Ast05_Lookup_TrCodeWindow: React.FC<Props> = ({ open, windowClassName, searchText, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AstTrCodeByWindow>>(null);
  const [text, setText] = useState('');
  const [rcvPayCode, setRcvPayCode] = useState(ALL);
  const [rows, setRows] = useState<AstTrCodeByWindow[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L155-186: "%검색어%", 수령/지급(전체면 "%") → ast.Ast05_TrCode.selectByWindowClassName
  const retrieve = useCallback(async (t: string, rcvPay: string) => {
    setLoading(true);
    try {
      setRows(await astApi.lookupTrCodesByWindow(windowClassName, t, rcvPay));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [windowClassName]);

  // [E0] 화면 열림 (생성자 L61-79, open L53-59) → show(), 검색어를 넣고 곧바로 retrieve()
  useEffect(() => {
    if (!open) return;
    const init = searchText ?? '';
    setText(init);
    setRcvPayCode(ALL);
    void retrieve(init, ALL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick (L82) / [E2] confirmButton[확인].Select (L92) → callback(trCodeModel), hide() — 고른 행이 없으면 null(= 전체)
  const confirm = () => onResult(gridRef.current?.api.getSelectedRows()[0] ?? null);

  return (
    <LookupModal open={open} title="거래유형(화면별)" width={720} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E3] selectAllButton[전체].Select (L102) → callback(null), hide() */}
            <Button type="select" onClick={() => onResult(null)}>전체</Button>
            {/* [E4] cancleButton[닫기].Select (L109) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L115) → retrieve(), [E6] searchText.KeyPress [Enter] (L128) → retrieve() */}
        <SearchBar onSearch={() => retrieve(text, rcvPayCode)} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input autoFocus style={{ width: 200 }} placeholder="거래코드/명" value={text} onChange={e => setText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="수령/지급">
            <SystemCodeComboBox kindCd="RcvPayCode" altCode={[ALL, '전체']} style={{ width: 100 }}
              value={rcvPayCode} onChange={code => setRcvPayCode(code ?? ALL)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstTrCodeByWindow> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trCodeId)}
            onRowDoubleClicked={confirm} />
        </div>
      </div>
    </LookupModal>
  );
};
