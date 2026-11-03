/**
 * [1209] KFS > 10. ICAM 계약사관리 > ICAM 계약사 관리 (EE20)
 * AS-IS: myApp/client/vi/biz/Biz10_Tab_ContCorp.java (432줄) + 아래 탭 Biz13_TabPage_WithCorp·Biz11_TabPage_ContHistory·Biz16_TabPage_EachCont·Biz17_TabPage_DualManageFund
 *   + 팝업 Biz11_Edit_ContHistory·Biz12_Edit_FeeInfo·Biz14_Lookup_RelateAppr·Biz11_Lookup_FileList·Biz11_PDFViewer·Biz17_Lookup_HoldFee·Sys15_Lookup_Corp_OnlyKFS
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L213-287: 위(center, 여백 20·20·0·20) = 툴바 50 + 계약사 그리드 / 아래(south 450, 최대 900, 여백 20) = 탭 4개("운영정보" "이력관리" "개별계약서" "이중사무관리 펀드")
 * 스타일: SGTP (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조건이 많아 한 줄에 다 들어가지 않으므로 초기화(UX-02)는 두지 않는다
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, message, Modal, Radio, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContCorp, BizContSearch } from '@/types/bizCont';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PageTabs } from '@/components/tabs';
import { Biz10_Rd_ContCorp } from './Biz10_Rd_ContCorp';
import { Biz11_Edit_ContHistory, BizContHistoryEditTarget } from './Biz11_Edit_ContHistory';
import { Biz11_TabPage_ContHistory } from './Biz11_TabPage_ContHistory';
import { Biz13_TabPage_WithCorp } from './Biz13_TabPage_WithCorp';
import { Biz16_TabPage_EachCont } from './Biz16_TabPage_EachCont';
import { Biz17_TabPage_DualManageFund } from './Biz17_TabPage_DualManageFund';

const gb = gbFor<BizContCorp>();
const ALL = '%';
/** 콤보 "전체"(statusName = ComboBoxField("ContStatusCode", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** 기본 단일 선택(체크박스 없음) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const ROW_SELECT = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

type TabKey = 'withCorp' | 'history' | 'eachCont' | 'dualFund';

export const Biz10_Tab_ContCorp: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizContCorp>>(null);
  // [E0] 화면 열림 (생성자 L83-87) → init(), settings(), retrieve() — 열자마자 조회한다. radio1(전체) 선택, 계약년도 칸은 올해로 채우되 사용 못 함, 계약상태 "전체", "계약건만 보기" 선택
  const [yearEnabled, setYearEnabled] = useState(false);
  const [stdYear, setStdYear] = useState(String(dayjs().year()));
  const [statusCode, setStatusCode] = useState(ALL);
  const [statusCheck, setStatusCheck] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [rows, setRows] = useState<BizContCorp[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  /** 아래 탭을 다시 읽게 하는 신호 — 행을 누를 때마다 올린다(같은 계약사를 다시 눌러도 다시 조회) */
  const [nonce, setNonce] = useState(0);
  const [tab, setTab] = useState<TabKey>('withCorp');
  const [editTarget, setEditTarget] = useState<BizContHistoryEditTarget | null>(null);
  const [rdCond, setRdCond] = useState<BizContSearch | null>(null);
  /** 다음 rowData 갱신 때 첫 행을 고른다 */
  const pendingFirst = useRef(false);
  const retrieveSeq = useRef(0);

  const cond = (): BizContSearch => ({ searchText, check: yearEnabled, stdYear, statusCode, statusCheck, endMonth });
  const selected = rows.find(r => r.contCorpId === selectedId) ?? null;

  // [E1] yearText.KeyPress [Enter] (L102)·[E2] searchText.KeyPress [Enter] (L112)·[E3] monthText.KeyPress [Enter] (L123)·[E4] retrieveButton[조회].Select (L132) → retrieve() L324-356: biz.Biz10_ContCorp.selectByText
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading...")
    try {
      const list = await bizContCorpApi.search(cond());
      if (my !== retrieveSeq.current) return;
      pendingFirst.current = list.length > 0;
      setRows(list);  // 조회가 끝나면 첫 행을 고르고 retrieveTabpage(), 행이 없으면 활성 탭 init()
      if (list.length === 0) { setSelectedId(null); setNonce(n => n + 1); }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E9] grid.RowClick (L249) → retrieveTabpage() L312-322: 선택 계약사로 활성 탭 retrieve()
  const onRowClicked = (row: BizContCorp | undefined) => {
    if (!row) return;
    setSelectedId(row.contCorpId);
    setNonce(n => n + 1);
  };

  // updateTransInfoGrid() (탭 4개 L168-286): biz.Biz10_ContCorp.selectById 로 이 계약사 행을 다시 읽어 그리드에 반영한다 (행 위치·선택 유지)
  const updateTransInfoGrid = async () => {
    if (selectedId == null) return;
    try {
      const fresh = await bizContCorpApi.get(selectedId);
      setRows(prev => prev.map(r => (r.contCorpId === fresh.contCorpId ? fresh : r)));
    } catch {
      // result.getStatus() > 0 이 아니면 아무것도 하지 않는다
    }
  };

  // [E5] insertButton[등록].Select (L138) → insert() L358-365: Biz11_Edit_ContHistory(cb → retrieve())
  const insert = () => setEditTarget({ kind: 'newCorp' });

  // [E6] deleteButton[삭제].Select (L144) → deleteCheck() L367-393: 선택이 없으면 "계약사를 선택해주세요", 확인 "{계약사명} 해당 계약사 정보를 전부 삭제하시겠습니까?" → [E11] msgBox.DialogHide [YES] (L377) → delete() L395-414
  const deleteCheck = () => {
    if (selected == null) {
      message.warning('계약사를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${selected.contCorpNm ?? ''} 해당 계약사 정보를 전부 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: async () => {
        try {
          // biz.Biz11_ContHistory.deleteContCorpId → biz.Biz10_ContCorp.delete
          await bizContCorpApi.delete([selected.contCorpId]);
          message.success('삭제가 완료되었습니다');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E7] downLoadButton[출력/다운로드].Select (L150) → 인라인 L150-187: RDViewer.openBiz10(dns admin · CommonViewer.html · mrd Biz10_Rd_ContCorp · options "/rhtmlimportopt [2]", sys99Param = 조회 조건 + sortType "2")
  const downLoad = () => setRdCond(cond());

  // buildGrid() L289-310
  const columnDefs = React.useMemo(() => [
    gb.date('contDate', 100, '(재)계약일자'),  // L293
    gb.text('contCorpNm', 150, '계약사명'),  // L294
    gb.text('contStatusNm', 100, '계약상태'),  // L295
    gb.text('corpStatusNm', 100, '거래유무'),  // L296
    gb.text('trType', 100, '거래형태'),  // L297
    gb.textCenter('contPeriodNm', 80, '계약기간'),  // L298
    gb.date('startDate', 100, '거래개시일'),  // L299
    gb.date('closeDate', 100, '거래종료일'),  // L300
    gb.text('minFeeStr', 180, '최저보수'),  // L301
    gb.text('withFeeStr', 100, '병행보수'),  // L302
    gb.text('feeChargeTypeNm', 100, '청구구분'),  // L303
    gb.text('baseFee', 100, '기본보수(bp)'),  // L304
    gb.textArea('manager', 100, '담당자명'),  // L305
    gb.textArea('managerTel', 150, '담당자연락처'),  // L306
    gb.textArea('note', 250, '비고'),  // L307
  ], []);

  const tabProps = { corp: selected, nonce, onCorpChanged: () => void updateTransInfoGrid() };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  <Button type="register" onClick={insert}>등록</Button>
                  <Button type="delete" onClick={deleteCheck}>삭제</Button>
                  <Button type="download" onClick={downLoad}>출력/다운로드</Button>
                </>}
              >
                {/* [E8] toggle.ValueChange (L198) → 인라인 L198-210: 라디오 값을 바꾸면 계약년도 칸을 켠다.
                    (AS-IS 는 boxLabel.indexOf("전체") > 0 로 가르는데 글자 시작이 0 이라 어느 쪽을 눌러도 켜진다 — 그대로 둔다, 작업기록 "AS-IS 결함 의심") */}
                <Radio.Group value={yearEnabled ? 'year' : 'all'} onChange={() => setYearEnabled(true)}>
                  <Radio value="all">전체</Radio>
                  <Radio value="year">계약년도</Radio>
                </Radio.Group>
                <SearchBar.Input style={{ width: 80 }} disabled={!yearEnabled} value={stdYear} onChange={e => setStdYear(e.target.value)} />
                <SearchBar.Field label="계약상태">
                  <SystemCodeComboBox kindCd="ContStatusCode" altCode={ALL_CODE} style={{ width: 100 }} value={statusCode} onChange={c => setStatusCode(c ?? ALL)} />
                </SearchBar.Field>
                <Checkbox checked={statusCheck} onChange={e => setStatusCheck(e.target.checked)}>계약건만 보기</Checkbox>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} placeholder="계약사명/계약형태/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
                <SearchBar.Field label="거래종료">
                  <SearchBar.Input style={{ width: 60 }} placeholder="전체" value={endMonth} onChange={e => setEndMonth(e.target.value)} />
                </SearchBar.Field>
                <span style={{ fontSize: 12 }}>(개월 전)</span>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<BizContCorp>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.contCorpId)}
                  loading={loading}
                  rowSelection={ROW_SELECT}
                  onRowDataUpdated={e => {
                    // 조회가 끝나면 첫 행을 고르고(select(0, false)) 활성 탭을 읽는다
                    if (!pendingFirst.current) return;
                    pendingFirst.current = false;
                    const node = e.api.getDisplayedRowAtIndex(0);
                    if (node?.data) {
                      node.setSelected(true);
                      setSelectedId(node.data.contCorpId);
                      setNonce(n => n + 1);
                    }
                  }}
                  onRowClicked={e => onRowClicked(e.data)}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={450} min={200} max={900}>
          <div style={{ height: '100%', padding: 10, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', boxSizing: 'border-box', padding: 8 }}>
              {/* [E10] tabPanel.Selection [arg0 != null] (L255) → retrieveTabpage() — 탭을 열 때마다 다시 읽는다(고른 탭만 만든다) */}
              <PageTabs
                activeKey={tab}
                onChange={k => setTab(k as TabKey)}
                items={[
                  { key: 'withCorp', label: '운영정보', children: tab === 'withCorp' ? <Biz13_TabPage_WithCorp {...tabProps} /> : null },
                  { key: 'history', label: '이력관리', children: tab === 'history' ? <Biz11_TabPage_ContHistory {...tabProps} /> : null },
                  { key: 'eachCont', label: '개별계약서', children: tab === 'eachCont' ? <Biz16_TabPage_EachCont {...tabProps} /> : null },
                  { key: 'dualFund', label: '이중사무관리 펀드', children: tab === 'dualFund' ? <Biz17_TabPage_DualManageFund {...tabProps} /> : null },
                ]}
              />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Biz11_Edit_ContHistory target={editTarget} onDone={() => void retrieve()} onClose={() => setEditTarget(null)} />
      <Biz10_Rd_ContCorp cond={rdCond} onClose={() => setRdCond(null)} />
    </div>
  );
};
