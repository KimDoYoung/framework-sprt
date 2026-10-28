/**
 * [1382] 펀드관리 > 05. 부동산PF 용역수행 > 용역수행내역 승인 (Q11)
 * AS-IS: myApp/client/vi/est/Est03_Tab_PfHistoryConfirm.java (321줄) + Est03_TabPage_PfHistoryConfirm.java (133줄) + Est04_Grid_PfFileConfirm.java (159줄) + Est02_Lookup_PfContract.java (Q10) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-106: BorderLayout 가운데(여백 20, 테두리) = 툴바 두 줄(위: ○일자기준 [조회기준일 100 · 검색 300 · 미승인만 보기] [조회][승인][취소] / 아래: ○체결용역 [체결용역 칸 300 · 용역명 200]) + 그리드(행번호, 단일 선택),
 *   아래 330(여백 0,20,20,20, 테두리) = Est03_TabPage_PfHistoryConfirm(읽기 전용 상세 + 증빙)
 * 로그인 사용자가 승인자인 내역만 나온다(서버가 로그인 사용자로 건다). [승인] → 상태 20·승인일시, [취소] → 상태 10·승인일시 비움(결과보고서가 있으면 불가).
 * 검색칸 Enter 조회는 UX보강(UX-04)이다(원본은 [조회]만).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Radio, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { PfContract, PfHistory } from '@/types/est';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Est02_Lookup_PfContract } from './Est02_Lookup_PfContract';
import { Est03_TabPage_PfHistoryConfirm } from './Est03_TabPage_PfHistoryConfirm';

const gb = gbFor<PfHistory>();
const FORMAT = 'YYYY-MM-DD';

export const Est03_Tab_PfHistoryConfirm: React.FC = () => {
  const gridRef = useRef<AgGridReact<PfHistory>>(null);
  // settings() L108-231: searchType "1" 일자기준(기본) / "2" 체결용역 — 고른 쪽 입력줄만 켜진다(조회·승인·취소는 늘 켜짐)
  const [searchType, setSearchType] = useState<'1' | '2'>('1');
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [confirmCheck, setConfirmCheck] = useState(false);
  const [contractName01, setContractName01] = useState('');
  const [contractName02, setContractName02] = useState('');
  const [pfContractId, setPfContractId] = useState<number | null>(null);
  const [rows, setRows] = useState<PfHistory[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState(false);

  const selected = useMemo(() => rows.find(r => r.pfHistoryId === selectedId) ?? null, [rows, selectedId]);

  // 그리드 선택을 selectedId에 맞춘다
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    if (selectedId == null) { api.deselectAll(); return; }
    const node = api.getRowNode(String(selectedId));
    if (node && !node.isSelected()) node.setSelected(true);
  }, [rows, selectedId]);

  // retrieve() L273-308: 일자기준이면 selectByConfirmer01(companyId, personId, startDate, "%검색어%", confirm), 체결용역이면 체결용역이 있어야 selectByConfirmer02
  const retrieve = async (contractId: number | null = pfContractId, keepId: number | null = null) => {
    if (searchType === '2' && contractId == null) { message.warning('체결용역을 먼저 선택해주세요'); return; }
    setLoading(true);
    try {
      const list = searchType === '1'
        ? await estApi.searchPfHistoriesByConfirmer({ startDate: startDate.format(FORMAT), searchText, confirm: confirmCheck })
        : await estApi.searchPfHistoriesByConfirmerContract(contractId as number);
      setRows(list);
      setSelectedId(keepId != null && list.some(r => r.pfHistoryId === keepId) ? keepId : null);
      setNonce(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2] contractName01.TriggerClick (L166) → Est02_Lookup_PfContract.open(callback): 사업자명 (차주명) · 용역(수수료)명을 넣고 retrieve()
  const onPickContract = (c: PfContract) => {
    setContractName01(`${c.projectSiteName ?? ''} (${c.borrower ?? ''})`);
    setContractName02(c.feeName ?? '');
    setPfContractId(c.pfContractId);
    void retrieve(c.pfContractId);
  };

  // confirm(Boolean) L233-247: est.Est03_PfHistory.updateConfirm(pfHistoryId, confirm) → retrieve() (원본은 아래 상세를 그대로 두지만, 같은 행이 남아 있으면 다시 골라 새 상태를 보인다)
  const confirm = async (apply: boolean) => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    if (!row) { message.warning('행을 선택하세요.'); return; }
    try {
      await estApi.updatePfHistoryConfirm(row.pfHistoryId, apply);
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
      return;
    }
    await retrieve(pfContractId, row.pfHistoryId);
  };

  // [E4] confirmButton[승인].Select (L195) → confirm(true)
  const approve = () => confirm(true);

  // [E5] cancleButton[취소].Select (L201) → est.Est02_PfContract.selectById(pfContractId): 결과보고서(resultApprId)가 있으면 "결과보고서가 존재하여 승인취소가 불가능합니다", 아니면 confirm(false)
  const cancel = async () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    if (!row) { message.warning('행을 선택하세요.'); return; }
    try {
      const contract = await estApi.getPfContract(row.pfContractId);
      if (contract?.resultApprId != null) { message.warning('결과보고서가 존재하여 승인취소가 불가능합니다'); return; }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    await confirm(false);
  };

  // buildGrid() L254-271 (승인자 열의 제목도 원본 그대로 "담당자")
  const columnDefs = useMemo(() => [
    gb.longCenter('no', 100, '수행번호'),
    gb.date('startDate', 100, '수행시작일'),
    gb.date('closeDate', 100, '수행종료일'),
    gb.text('content', 350, '수행내역'),
    gb.text('detail', 350, '상세내역'),
    gb.text('personName', 100, '담당자'),
    gb.text('confirmerName', 100, '담당자'),
    gb.textCenter('statusName', 100, '승인상태'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, margin: 20,  boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
        {/* [E1] toggleSearchType.ValueChange (L144) → 일자기준이면 위 입력줄, 체결용역이면 아래 입력줄만 켠다 */}
        <Radio.Group value={searchType} onChange={e => setSearchType(e.target.value)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Radio value="1" style={{ width: 90 }}>일자기준 :</Radio>
            <DatePicker style={{ width: 120 }} allowClear={false} disabled={searchType !== '1'} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span>검색</span>
            <Input style={{ width: 300 }} allowClear disabled={searchType !== '1'} placeholder="차주명/사업자명/수수료명" value={searchText}
              onChange={e => setSearchText(e.target.value)} onPressEnter={() => retrieve()} />
            <Checkbox disabled={searchType !== '1'} checked={confirmCheck} onChange={e => setConfirmCheck(e.target.checked)}>미승인만 보기</Checkbox>
            <Space>
              {/* [E3] retrieveButton[조회].Select (L189) → retrieve() */}
              <Button type="search" onClick={() => retrieve()} loading={loading}>조회</Button>
              <Button type="save" onClick={approve}>승인</Button>
              <Button type="cancel" onClick={cancel}>취소</Button>
            </Space>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio value="2" style={{ width: 90 }}>체결용역 :</Radio>
            <LookupInput value={contractName01} width={300} disabled={searchType !== '2'} placeholder="체결용역을 선택해주세요" onOpen={() => setLookup(true)} />
            <Input style={{ width: 200 }} readOnly value={contractName02} />
          </div>
        </Radio.Group>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E6] grid.RowClick (L225) → retrieveTabpage() L249-257 */}
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
        {/* [E0] 화면 열림 (생성자 L77-106) → settings() */}
        <Est03_TabPage_PfHistoryConfirm row={selected} nonce={nonce} />
      </div>
      <Est02_Lookup_PfContract open={lookup} onResult={onPickContract} onClose={() => setLookup(false)} />
    </div>
  );
};
