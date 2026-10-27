/**
 * [1378] 펀드관리 > 05. 부동산PF 용역수행 > 용역결과보고서 (Q12)
 * AS-IS: myApp/client/vi/est/Est02_Tab_PfResultReport.java (317줄) + Est03_TabPage_PfHistoryList.java (142줄) + Est04_Lookup_PfFile.java (138줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-89: BorderLayout 가운데(여백 20) = 툴바 50(조회기준일 100 · 검색 300 "차주명/사업자명/수수료명" · [조회]) + 그리드(행번호, 단일 선택), 아래 330(여백 0,20,20,20) = Est03_TabPage_PfHistoryList
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] 결재 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(insertLinkApproval)·문서분류 조회창 Dcr01_Lookup_Class·문서분류지정 Dcr30_Link(getClassTreeModel)·문서보기 아이콘의 retrieveApproval은 다른 도메인이라 지금은 안내만 한다.
 *   결재 아이콘은 편집창이 열릴 자리까지의 사전 검사(수행내역 모두 승인·작성자 조직원·결재 상태)를 원본 그대로 한다. 결재가 끝나면 updateResultApprId와 TempData 태그 양식(createMapping)이 필요하다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PfContract } from '@/types/est';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Est03_TabPage_PfHistoryList } from './Est03_TabPage_PfHistoryList';

const gb = gbFor<PfContract>();
const FORMAT = 'YYYY-MM-DD';

export const Est02_Tab_PfResultReport: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<PfContract>>(null);
  // settings() L91-116: 조회기준일 100(오늘), 검색칸 300 "차주명/사업자명/수수료명"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PfContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  /** LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
  const [myOrgId, setMyOrgId] = useState<number | null>(null);

  // retrieve() L203-221: est.Est02_PfContract.selectByText(companyId, startDate, "%검색어%") → 첫 행 선택 → tabPage.retrieve(첫 행의 pfContractId)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await estApi.searchPfContracts({ startDate: startDate.format(FORMAT), searchText });
      setRows(list);
      const first = list[0] ?? null;
      setSelectedId(first ? first.pfContractId : null);
      setNonce(n => n + 1);
      if (first) setTimeout(() => gridRef.current?.api?.getRowNode(String(first.pfContractId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, searchText]);

  // [E0] 화면 열림 (생성자 L61-89) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    void (async () => {
      try {
        setMyOrgId(user.userId < 0 ? 0 : (await empApi.getCurrentTransInfo(user.userId)).orgCodeId ?? 0);
      } catch {
        setMyOrgId(null);
      }
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  /** selectModel.getManagerOrgId().equals(LoginUser.getOrgCodeId()) — 작성자 또는 작성자의 조직원 */
  const isMyOrg = (row: PfContract) => row.managerOrgId != null && myOrgId != null && row.managerOrgId === myOrgId;

  // 결재 아이콘 actionCell01 (L129-152): 수행내역이 모두 승인(20)이어야 → 작성자 조직원만 → 결재 상태가 상신·결재중·완료면 막고, 아니면 getClassTreeModel() L223-247 → insertLinkApproval() (다음 단계)
  const requestAppr = async (row: PfContract) => {
    // tabPage.statusCheck() L126-137: 목록의 수행내역이 하나라도 20이 아니면 false (없으면 true)
    let allConfirmed: boolean;
    try {
      allConfirmed = (await estApi.searchPfHistories(row.pfContractId)).every(h => h.statusCode === '20');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    if (!allConfirmed) { message.warning('모든 수행내역이 승인완료시 결재가 가능합니다'); return; }
    if (!isMyOrg(row)) { message.warning('작성자 또는 작성자의 조직원만 결재가 가능합니다'); return; }
    const status = row.resultApprStatusName;
    if (status === '상신' || status === '결재중' || status === '완료') { message.warning('결재진행중/완료된 문서가 존재합니다'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E4] 문서보기 아이콘 actionCell02 (L153-188, callbackOnCreate L174): apr.Apr01_Appr.selectById(resultApprId) — 문서가 없으면 안내, 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false)
  const viewAppr = (row: PfContract) => {
    if (row.resultApprId == null || row.resultApprStatusName == null) { message.warning('문서가 존재하지않습니다'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // buildGrid() L128-201
  const columnDefs = useMemo(() => [
    gb.text('borrower', 250, '차주명'),                                                          // L180
    gb.text('projectSiteName', 300, '사업자명'),                                                 // L181
    gb.text('projectSiteAddr', 300, '사업장 주소지'),                                            // L182
    gb.text('feeName', 250, '용역(수수료)명'),                                                   // L183
    gb.date('startDate', 100, '수행시작일'),                                                     // L184
    gb.date('closeDate', 100, '수행종료일'),                                                     // L185
    iconCell<PfContract>('edit', 'apprAction', 50, '결재', row => void requestAppr(row)),        // L186 actionCell01
    gb.textCenter('resultApprStatusName', 100, '결재상태'),                                      // L187
    iconCell<PfContract>('view', 'viewAction', 100, '문서보기', viewAppr),                       // L188 actionCell02
  ], [myOrgId]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="50%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L104) → retrieve(), [E1] searchText.KeyPress [Enter] (L96) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading}>
                <SearchBar.Field label="조회기준일">
                  <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 300 }} placeholder="차주명/사업자명/수수료명" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E3] grid.RowClick (L110) → retrieveTabpage() L118-126: 같은 행을 다시 눌러도 다시 읽는다 */}
                <SingleGrid<PfContract>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.pfContractId)}
                  onRowClicked={e => { if (e.data) { setSelectedId(e.data.pfContractId); setNonce(n => n + 1); } }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="50%" min={200}>
          <div style={{ height: '100%', padding: 10, boxSizing: 'border-box' }}>
            <Est03_TabPage_PfHistoryList pfContractId={selectedId} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
