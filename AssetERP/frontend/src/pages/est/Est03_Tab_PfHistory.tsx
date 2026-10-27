/**
 * [1377] 펀드관리 > 05. 부동산PF 용역수행 > 용역수행내역 등록 (Q10)
 * AS-IS: myApp/client/vi/est/Est03_Tab_PfHistory.java (283줄) + Est03_TabPage_PfHistory.java (437줄) + Est04_Grid_PfFile.java (358줄) + Est02_Lookup_PfContract.java (164줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L63-89: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(체결용역 칸 500 · 용역명 200 읽기 전용 · [조회][등록][삭제]) + 그리드(행번호, 단일 선택),
 *   아래 330(여백 0,20,20,20, 테두리) = Est03_TabPage_PfHistory(수행내역 상세 + 증빙자료)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * 전자결재 연결은 없는 화면이다(수행내역 신청·승인은 이 화면의 [승인신청]·승인 화면 Est03_Tab_PfHistoryConfirm(Q11)).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PfContract, PfHistory } from '@/types/est';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Est02_Lookup_PfContract } from './Est02_Lookup_PfContract';
import { Est03_TabPage_PfHistory } from './Est03_TabPage_PfHistory';

const gb = gbFor<PfHistory>();

export const Est03_Tab_PfHistory: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<PfHistory>>(null);
  // settings() L91-152: contractName01(체결용역 칸 500, 읽기 전용) · contractName02(읽기 전용 200)
  const [contractName01, setContractName01] = useState('');
  const [contractName02, setContractName02] = useState('');
  const [pfContractId, setPfContractId] = useState<number | null>(null);
  const [rows, setRows] = useState<PfHistory[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  /** retrieveTabpage()가 부를 때마다 올려 같은 행을 다시 눌러도 아래 영역을 다시 읽는다 */
  const [nonce, setNonce] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState(false);

  // [E0] 화면 열림 (생성자 L63-89) → settings(): 열자마자 조회하지 않는다(체결용역을 먼저 골라야 한다)
  const selected = useMemo(() => rows.find(r => r.pfHistoryId === selectedId) ?? null, [rows, selectedId]);

  // 그리드 선택을 selectedId에 맞춘다 (행을 바꾸거나 새로 만든 뒤)
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    if (selectedId == null) { api.deselectAll(); return; }
    const node = api.getRowNode(String(selectedId));
    if (node && !node.isSelected()) node.setSelected(true);
    if (node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
  }, [rows, selectedId]);

  // retrieve() L177-194: est.Est03_PfHistory.selectByPfContractId(companyId, pfContractId)
  const retrieve = async (contractId: number | null = pfContractId) => {
    if (contractId == null) { message.warning('체결용역을 먼저 선택해주세요'); return; }
    setLoading(true);
    try {
      setRows(await estApi.searchPfHistories(contractId));
      setSelectedId(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E1] contractName01.TriggerClick (L97) → Est02_Lookup_PfContract.open(callback): 사업자명 (차주명) · 용역(수수료)명을 넣고 retrieve()
  const onPickContract = (c: PfContract) => {
    setContractName01(`${c.projectSiteName ?? ''} (${c.borrower ?? ''})`);
    setContractName02(c.feeName ?? '');
    setPfContractId(c.pfContractId);
    void retrieve(c.pfContractId);
  };

  // [E3] insertButton[등록].Select (L126) → insertRow() L196-232: getConfirmerParent(승인자) → GridInsertRow(담당자 = 로그인 사용자, 새 번호) → tabPage.retrieve(null)
  const insertRow = async () => {
    if (pfContractId == null) { message.warning('체결용역을 먼저 선택해주세요'); return; }
    try {
      const confirmer = await estApi.getPfConfirmerParent(dayjs().format('YYYY-MM-DD'));
      const id = await estApi.nextPfHistoryId();
      const row: PfHistory = {
        pfHistoryId: id, pfContractId, no: null, startDate: null, closeDate: null, content: null, detail: null,
        personId: user.userId, personName: user.name, orgName: null, statusCode: null, statusName: null,
        confirmerId: confirmer.confirmerId, confirmerName: confirmer.confirmerName, fileCountStr: null,
      };
      setRows(prev => [...prev, row]);
      setSelectedId(id);
      setNonce(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // [E4] deleteButton[삭제].Select (L132) → 신청(10)·승인(20)이면 "신청 및 승인된 건은 삭제가 불가능합니다", 아니면 deleteRow() L258-278
  const deleteRow = () => {
    const rowsToDelete = gridRef.current?.api?.getSelectedRows() ?? [];
    if (rowsToDelete.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }
    if (rowsToDelete[0].statusCode === '10' || rowsToDelete[0].statusCode === '20') { message.warning('신청 및 승인된 건은 삭제가 불가능합니다'); return; }
    // [E6] msgBox.DialogHide [YES] (L261) → est.Est03_PfHistory.delete
    Modal.confirm({
      title: '삭제',
      content: `${rowsToDelete.length}건을 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await estApi.deletePfHistories(rowsToDelete.map(r => r.pfHistoryId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        const ids = new Set(rowsToDelete.map(r => r.pfHistoryId));
        setRows(prev => prev.filter(r => !ids.has(r.pfHistoryId)));
        setSelectedId(null);
      },
    });
  };

  // buildGrid() L164-175
  const columnDefs = useMemo(() => [
    gb.longCenter('no', 100, '수행번호'),
    gb.date('startDate', 100, '수행시작일'),
    gb.date('closeDate', 100, '수행종료일'),
    gb.text('content', 350, '수행내역'),
    gb.text('detail', 350, '상세내역'),
    gb.text('personName', 100, '담당자'),
    gb.textCenter('statusName', 100, '승인상태'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, margin: 20, border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
        {/* [E2] retrieveButton[조회].Select (L120) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={loading}
          extra={<>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="체결용역">
            <LookupInput value={contractName01} width={500} placeholder="체결용역을 선택해주세요" onOpen={() => setLookup(true)} />
            <Input style={{ width: 200, marginLeft: 8 }} readOnly value={contractName02} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E5] grid.RowClick (L146) → retrieveTabpage() L154-162 */}
          <SingleGrid<PfHistory>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.pfHistoryId)}
            onRowClicked={e => { if (e.data) { setSelectedId(e.data.pfHistoryId); setNonce(n => n + 1); } }}
          />
        </div>
      </div>
      <div style={{ height: 330, flex: 'none', margin: '0 20px 20px', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <Est03_TabPage_PfHistory
          row={selected}
          nonce={nonce}
          onChanged={saved => setRows(prev => prev.map(r => (r.pfHistoryId === saved.pfHistoryId ? saved : r)))}
        />
      </div>
      <Est02_Lookup_PfContract open={lookup} onResult={onPickContract} onClose={() => setLookup(false)} />
    </div>
  );
};
