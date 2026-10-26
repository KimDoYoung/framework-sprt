/**
 * [1388] 펀드관리 > 03. 일임(자문)관리 > 일임계좌 등록 (Q01)
 * AS-IS: myApp/client/vi/adv/Adv02_Tab_Account.java (350줄) + Adv02_Edit_Account.java (228줄, 아래 편집 폼)
 *   + components/lookup/Sys15_Lookup_Corp (증권사 조회창, 다른 도메인) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L73-118: 위(분할 가능, 여백 20·20·0·20) = 테두리 박스(툴바 50 + 그리드 + 페이징 툴바 500건) / 아래(150, 최대 900, 여백 20) = 편집 폼(Adv02_Edit_Account)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * 도달 불가(원본): deleteSelectedRow()(E11) — deleteRow() 호출처가 없고 삭제 단추도 없다 → 만들지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { advApi } from '@/api/adv';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { AdvAccount } from '@/types/adv';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Adv02_Edit_Account } from './Adv02_Edit_Account';

const gb = gbFor<AdvAccount>();
/** setToolBar(500) — 한 페이지 행 수 */
const LIMIT = 500;
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Adv02_Tab_Account: React.FC = () => {
  const gridRef = useRef<AgGridReact<AdvAccount>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  const loginUser = useLoginUser();
  // [E0] 화면 열림 (생성자 L73-118) → settings(), retrieve() — 열자마자 조회한다. 검색칸 400(빈칸 글자 "관리코드/계좌명")
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AdvAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** 목록에서 고른 행 → 편집 폼(tabPage). null이면 폼 비활성 */
  const [selected, setSelected] = useState<AdvAccount | null>(null);
  /** 다음 rowData 갱신 때 고를 행 id (없으면 첫 행) */
  const pendingSelect = useRef<number | null>(null);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<string | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (paramRef.current === undefined) return;
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await advApi.searchAccounts({ searchText: paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(res.rows);  // 조회가 끝나면 첫 행을 고르고 폼을 켠다(onRowDataUpdated), 행이 없으면 폼을 끈다
      setTotal(res.total);
      setPage(p);
      if (res.rows.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };

  // [E1] searchText.KeyPress [Enter] (L124)·[E2] retrieveButton[조회].Select (L133) → retrieve() L241-268: 조건("%검색어%"는 서버가 만든다)을 정하고 1페이지부터
  const retrieve = () => {
    paramRef.current = searchText;
    void getPaging(1);
  };
  useEffect(retrieve, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E11 생략] messageBox.DialogHide (L321) → deleteSelectedRow() — deleteRow() 호출처 없음(삭제 단추 없음)
  // [E3] insertButton[등록].Select (L139) → insertRow() L270-284: GridInsertRow — 03 원칙 17에 따라 맨 아래에 넣고 보여 준다
  const insertRow = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const row: AdvAccount = {
      accountId: --tempId.current,
      companyId: loginUser.companyId,
      startDate: today,
      workDate: `${today}T00:00:00`,
      worker: loginUser.name,
    };
    pendingSelect.current = row.accountId;
    setRows(prev => [...prev, row]);
  };

  // [E4] copyButton[등록(복사)].Select (L145) → copyInsertRow() L286-316: 고른 행의 계좌명·증권사코드/명·계좌번호·최초설정일·해지일(있으면)을 가진 새 행 (관리코드는 복사하지 않는다)
  const copyInsertRow = () => {
    const src = gridRef.current?.api?.getSelectedRows()[0];
    if (!src) {
      message.warning('복사할 대상을 선택해주세요.');
      return;
    }
    const today = dayjs().format('YYYY-MM-DD');
    const row: AdvAccount = {
      accountId: --tempId.current,
      companyId: loginUser.companyId,
      workDate: `${today}T00:00:00`,
      worker: loginUser.name,
      manageName: src.manageName,
      trCorpCode: src.trCorpCode,
      trCorpName: src.trCorpName,
      accountNoDec: src.accountNoDec,
      startDate: src.startDate,
      ...(src.closeDate ? { closeDate: src.closeDate } : {}),
    };
    pendingSelect.current = row.accountId;
    setRows(prev => [...prev, row]);
  };

  // [E6] tempDownloadButton[템플릿].Select (L157) → downloadForm.submit(): ./excelTemplete/Template_일임계좌정보.xlsx
  const downloadTemplate = async () => {
    try {
      await advApi.downloadAccountTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E8] excelUploadButton[엑셀업로드].Select (L174) → excelUpload() L198-227: 파일을 고르면 ExcelUpload?uploadType=adv02Upload
  // [E10] fileUploadField.Change (L220) → uploadExcelForm.submit(), [E7]·[E9] uploadExcelForm.SubmitComplete (L168·L208) → 결과 문구 알림(SimpleMessage) + retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await advApi.uploadAccountsExcel(file);
      Modal.info({ title: '확인', content: '일임계좌정보를 업로드하였습니다.' });
    } catch (err) {
      Modal.info({ title: '확인', content: errorMessage(err, '업로드 실패') });
    }
    retrieve();
  };

  // [E5] grid.RowClick (L151) → retrieveEditPage() L229-239: tabPage.retrieve(선택한 행) / 선택이 없으면 폼 비활성
  const retrieveEditPage = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    setSelected(row ?? null);
  };

  // Adv02_Edit_Account.updateRow()의 결과 행으로 목록을 갱신한다(새 행은 임시 id를 서버 id로 바꾼다) → 그 행을 그대로 고른다
  const onSaved = (oldId: number, saved: AdvAccount) => {
    pendingSelect.current = saved.accountId;
    setRows(prev => prev.map(r => (r.accountId === oldId ? saved : r)));
  };

  // buildGrid() L182-196 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.textCenter('manageCode', 150, '관리코드'),  // L185
    gb.text('manageName', 300, '계좌명'),  // L186
    gb.text('trCorpName', 150, '증권사명'),  // L188
    gb.text('accountNoDec', 300, '계좌번호'),  // L189
    gb.date('startDate', 90, '최초설정일자'),  // L190
    gb.date('closeDate', 90, '해지일자'),  // L191
    gb.date('workDate', 90, '작업일시'),  // L192
    gb.text('worker', 90, '작업자'),  // L193
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120} max={1000}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={retrieve}
                loading={loading}
                extra={<>
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
                  <Button type="download" onClick={downloadTemplate}>템플릿</Button>
                  <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
                  <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
                </>}
              >
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 400 }} placeholder="관리코드/계좌명" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SingleGrid<AdvAccount>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.accountId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => {
                    // 조회·등록·저장 뒤 고를 행(없으면 첫 행)을 고르고 보여 준다
                    const node = pendingSelect.current != null ? e.api.getRowNode(String(pendingSelect.current)) : e.api.getDisplayedRowAtIndex(0);
                    pendingSelect.current = null;
                    if (node) {
                      node.setSelected(true);
                      if (node.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                    }
                  }}
                  onSelectionChanged={retrieveEditPage}
                />
              </div>
              <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void getPaging(p)} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={150} min={120} max={900}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <Adv02_Edit_Account model={selected} onSaved={onSaved} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
