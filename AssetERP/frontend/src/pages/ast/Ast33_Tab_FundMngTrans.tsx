/**
 * [1252] 관리회계 > 30. 펀드운용보수관리 > 이관펀드 등록 (X34)
 * AS-IS: myApp/client/vi/ast/Ast33_Tab_FundMngTrans.java (293줄) + Ast33_Lookup_FundMngTrans.java (352줄, 등록/수정) + Ast30_Lookup_HoldFee.java (224줄, 보수원장) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-103: BorderLayout 위 툴바 50(여백 20,20,0,20: 조회기간 100 ~ 100 · 구분 100 · 검색 223 "펀드/비고" · [조회][등록][삭제]) + 가운데 0.7 그리드(체크 단일) + 아래 0.3 Act02_Grid_JournalFix(분개) — 열 때 조회
 * 스타일: GG (견본 — docs/page-style.md). 아래 크기는 원본 0.3에 맞춰 30%
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 원본에 없어 넣지 않는다
 * X28(사무보수 이관펀드 등록 `Ast33_Tab_OfficeMngFundTrans`)의 짝 — 같은 API(`ast/fund-trans`)를 쓰고 운용사 칸·열이 없다(운용사 = 로그인 회사)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { FundTrans } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act02_Grid_JournalFix } from '@/pages/act/Act02_Grid_JournalFix';
import { Ast33_Lookup_FundMngTrans } from './Ast33_Lookup_FundMngTrans';

const gb = gbFor<FundTrans>();
const FORMAT = 'YYYY-MM-DD';

export const Ast33_Tab_FundMngTrans: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundTrans>>(null);
  // settings() L106-: 조회기간 = 지난달 1일 ~ 지난달 말일, 구분 "전체"(%), 검색 223 "펀드/비고"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').endOf('month'));
  const [fundTransCode, setFundTransCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FundTrans[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<FundTrans | null>(null);
  const [nonce, setNonce] = useState(0);
  /** 편집창 — NEW: 등록, MODI: 수정 아이콘의 행 */
  const [editor, setEditor] = useState<{ actionName: 'NEW' | 'MODI'; model: FundTrans | null } | null>(null);

  /** 행을 고르고 아래 분개를 다시 읽는다 — retrievePage() L239-245: 분개ID가 없으면 비운다(journal=null) */
  const pick = useCallback((row: FundTrans | null) => {
    setSelected(row);
    setNonce(n => n + 1);
    if (row) setTimeout(() => gridRef.current?.api?.getRowNode(String(row.fundTransId))?.setSelected(true), 0);
  }, []);

  // [E2] retrieveButton[조회].Select (L134) → retrieve() L216-237: ast.Ast33_FundTrans.selectByDate → 행이 있으면 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await astApi.searchFundTrans({ startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), fundTransCode, searchText });
      setRows(list);
      pick(list[0] ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, fundTransCode, searchText, pick]);

  // [E0] 화면 열림 (생성자 L64-104) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] deleteButton[삭제].Select (L146) → 선택이 없으면 안내, 있으면 확인창(HtmlMessageBox) → [E5] msgBox.DialogHide[YES] (L156) → delete() L260-269
  const askDelete = () => {
    if (!selected) { message.warning('선택한 내역이 없습니다.'); return; }
    const target = selected;
    Modal.confirm({
      title: '확인',
      content: <>선택한 내역을 삭제하시겠습니까?<br />(미수결제등 관련거래가 모두 삭제됩니다)</>,
      width: 440,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          // checkClose(선택 행 일자) L271-288 → GridDeleteData.delete("ast.Ast33_FundTrans.delete") — 회계마감 검사는 서버가 먼저 한다
          await astApi.deleteFundTrans(target.fundTransId as number);
          setRows(prev => prev.filter(r => r.fundTransId !== target.fundTransId));
          pick(null);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L182-214 (setChecked SINGLE) — 수정 아이콘 actionCell L184-199
  const columnDefs = useMemo(() => [
    gb.date('date', 120, '이관일자'),  // L205
    gb.textCenter('fundTransName', 120, '구분'),  // L206
    gb.textCenter('fundCode', 80, '펀드코드'),  // L207
    gb.textArea('fundName', 350, '펀드명'),  // L208
    gb.double('forFee', 120, '미수보수'),  // L209
    gb.textArea('note', 250, '비고'),  // L210
    iconCell<FundTrans>('edit', 'editAction', 50, '수정', row => setEditor({ actionName: 'MODI', model: row })),  // L211 actionCell → Ast33_Lookup_FundMngTrans.open(model, "MODI")
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="70%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L134) → retrieve(), [E1] searchText.KeyPress [Enter] (L122) → retrieve() */}
              <SearchBar
                onSearch={retrieve}
                loading={loading}
                extra={
                  <>
                    {/* [E3] insertButton[등록].Select (L140) → insertRow() L247-258: 편집창(NEW) → 저장하면 그 행을 선택하고 retrievePage() */}
                    <Button type="register" onClick={() => setEditor({ actionName: 'NEW', model: null })}>등록</Button>
                    <Button type="delete" onClick={askDelete}>삭제</Button>
                  </>
                }
              >
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span style={{ margin: '0 6px' }}>~</span>
                  <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="구분">
                  <SystemCodeComboBox kindCd="FundTransCode" altCode={['%', '전체']} style={{ width: 100 }} value={fundTransCode} onChange={code => setFundTransCode(code ?? '%')} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 223 }} placeholder="펀드/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E6] grid.RowClick (L174) → retrievePage() L239 — 같은 행을 다시 눌러도 다시 읽는다 */}
                <SingleGrid<FundTrans>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.fundTransId)}
                  onRowClicked={e => { if (e.data) { setSelected(e.data); setNonce(n => n + 1); } }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="30%" min={200}>
          <div style={{ height: '100%', padding: 10, boxSizing: 'border-box' }}>
            <Act02_Grid_JournalFix journal={selected?.journalId != null ? { journalId: selected.journalId, curCode: selected.curCode } : null} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
      {editor && (
        <Ast33_Lookup_FundMngTrans
          actionName={editor.actionName}
          model={editor.model}
          onClose={() => setEditor(null)}
          onDone={saved => {
            // NEW: 저장한 행을 선택하고 retrievePage() (조회 기간 밖일 수 있어 목록에 없으면 더한다) / MODI: grid.getStore().update(model) → 그 행을 선택하고 retrievePage()
            setRows(prev => (prev.some(r => r.fundTransId === saved.fundTransId) ? prev.map(r => (r.fundTransId === saved.fundTransId ? saved : r)) : [...prev, saved]));
            pick(saved);
          }}
        />
      )}
    </div>
  );
};
