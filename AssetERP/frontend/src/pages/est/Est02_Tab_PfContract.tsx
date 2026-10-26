/**
 * [1376] 펀드관리 > 05. 부동산PF 용역수행 > 용역계약체결 (Q09)
 * AS-IS: myApp/client/vi/est/Est02_Tab_PfContract.java (405줄) + Est02_Edit_PfContract.java (311줄) + Est02_Grid_File.java (211줄) + Est01_Lookup_PfFeeType.java (142줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-92: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(조회기준일 100 · 검색 300 "차주명/사업자명/수수료명" · [조회][등록][삭제]) + 그리드(행번호, 단일 선택)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] 결재 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(insertLinkApproval)·문서분류 조회창 Dcr01_Lookup_Class·문서보기 아이콘의 retrieveApproval은 다른 도메인이라 지금은 안내만 한다.
 *   결재 아이콘은 편집창이 열릴 자리까지의 사전 검사(작성자 조직원·결재 상태)를 원본 그대로 한다. 결재가 끝나면 updateApprId와 TempData 태그 양식(createMapping)이 필요하다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PfContract } from '@/types/est';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Est02_Edit_PfContract, PfContractTarget } from './Est02_Edit_PfContract';

const gb = gbFor<PfContract>();
const FORMAT = 'YYYY-MM-DD';

export const Est02_Tab_PfContract: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<PfContract>>(null);
  // settings() L94-131: 조회기준일 100(오늘), 검색칸 300 "차주명/사업자명/수수료명"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PfContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<PfContractTarget | null>(null);
  /** LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
  const [myOrgId, setMyOrgId] = useState<number | null>(null);

  // retrieve() L244-257: est.Est02_PfContract.selectByText(companyId, startDate, "%검색어%")
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await estApi.searchPfContracts({ startDate: startDate.format(FORMAT), searchText }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, searchText]);

  // [E0] 화면 열림 (생성자 L67-92) → settings(), retrieve()
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

  // 수정 아이콘 actionCell01 (L134-172): 작성자 조직원만 → est.Est03_PfHistory.checkList(수행내역이 있으면 editChk false) → Est02_Edit_PfContract.edit(model, editChk, callback → retrieve())
  const editRow = async (row: PfContract) => {
    if (!isMyOrg(row)) { message.warning('작성자 또는 작성자의 조직원만 수정이 가능합니다'); return; }
    try {
      const count = await estApi.countPfContractHistories([row.pfContractId]);
      setTarget({ mode: 'edit', row, editChk: count === 0 });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 결재 아이콘 actionCell02 (L173-193): 작성자 조직원만, 결재 상태가 상신·결재중·완료면 막고, 아니면 getClassTreeModel() L311-335 → insertLinkApproval() L337-350 (다음 단계)
  const requestAppr = (row: PfContract) => {
    if (!isMyOrg(row)) { message.warning('작성자 또는 작성자의 조직원만 결재가 가능합니다'); return; }
    const status = row.planApprStatusName;
    if (status === '상신' || status === '결재중' || status === '완료') { message.warning('결재진행중/완료된 문서가 존재합니다'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E6] 문서보기 아이콘 actionCell03 (L194-227): apr.Apr01_Appr.selectById(planApprId) — 문서가 없으면 안내, 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false)
  const viewAppr = (row: PfContract) => {
    if (row.planApprId == null || row.planApprStatusName == null) { message.warning('문서가 존재하지않습니다'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E4] deleteButton[삭제].Select (L125) → deleteChk() L259-287: est.Est03_PfHistory.checkList → 수행내역이 있으면 막고, 작성자 조직원만 → deleteRow() L289-309
  const deleteChk = async () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }
    try {
      const count = await estApi.countPfContractHistories(selected.map(r => r.pfContractId));
      if (count > 0) { message.warning('수행내역이 존재하여 삭제가 불가능합니다'); return; }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    if (!isMyOrg(selected[0])) { message.warning('작성자 또는 작성자의 조직원만 삭제가 가능합니다'); return; }
    // [E7] msgBox.DialogHide [YES] (L292) → est.Est02_PfContract.delete
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건을 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await estApi.deletePfContracts(selected.map(r => r.pfContractId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L133-242
  const columnDefs = useMemo(() => [
    iconCell<PfContract>('edit', 'editAction', 50, '수정', row => void editRow(row)),            // L229 actionCell01
    gb.text('borrower', 100, '차주명'),                                                          // L230
    gb.text('projectSiteName', 250, '사업자명'),                                                 // L231
    gb.text('projectSiteAddr', 250, '사업장 주소지'),                                            // L232
    gb.text('feeName', 200, '용역(수수료)명'),                                                   // L233
    gb.date('startDate', 100, '수행시작일'),                                                     // L234
    gb.date('closeDate', 100, '수행종료일'),                                                     // L235
    gb.text('managerInfo', 350, '담당자'),                                                       // L236
    iconCell<PfContract>('edit', 'apprAction', 50, '결재', requestAppr),                         // L237 actionCell02
    gb.textCenter('planApprStatusName', 100, '결재상태'),                                        // L238
    iconCell<PfContract>('view', 'viewAction', 100, '문서보기', viewAppr),                       // L239 actionCell03
  ], [myOrgId]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
        {/* [E2] retrieveButton[조회].Select (L107) → retrieve(), [E1] searchText.KeyPress [Enter] (L99) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<>
            {/* [E3] insertButton[등록].Select (L113) → Est02_Edit_PfContract.insert(callback → retrieve()) */}
            <Button type="register" onClick={() => setTarget({ mode: 'insert' })}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="조회기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="차주명/사업자명/수수료명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PfContract>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.pfContractId)}
          />
        </div>
      </div>
      {/* [E5] actionCell01 (ImageCell).callbackOnCreate (L159) → 수정 창 callback → retrieve() */}
      <Est02_Edit_PfContract target={target} onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
    </div>
  );
};
