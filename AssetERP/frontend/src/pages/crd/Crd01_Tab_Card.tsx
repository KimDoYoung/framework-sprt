/**
 * [1038] 자금관리 > 30. 법인카드관리 > 법인카드 및 사용자등록 (U13) — 같은 클래스: [1478] 경영관리 > 92. 법인카드 등록 > 법인카드 및 사용자등록
 * AS-IS: myApp/client/vi/crd/Crd01_Tab_Card.java (381줄) + Crd01_Edit_Card.java (263줄, 아래 왼쪽 편집 폼) + Crd03_Grid_User.java (267줄, 아래 오른쪽 사용자 그리드)
 *   + 이미 있는 Ast01_Lookup_CorpAccount(결제계좌)·Emp00_Lookup_SelectSingle(직원) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L85-214: 위(0.55, 분할 가능, 여백 20) = 툴바 50(사용자 85 "전체" · 검색 300 · 사용카드만 보기 · [조회][등록][삭제] · [템플릿][엑셀업로드]) + 카드 그리드(SingleGrid)
 *   / 아래(0.45, 여백 0·20·20·20, 최대 1000) = 편집 폼(570) + 사용자 그리드
 * 스타일: SGEF (견본 = Fnd01_Tab_FundCode + Fnd01_Edit_FundCode — 아래 폼 오른쪽에 사용자 그리드가 더 붙는 변형이다, 결과확인 13)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개이나 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal, Select, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { crdApi } from '@/api/crd';
import { errorMessage } from '@/api/client';
import { CrdCard, CrdCardManager } from '@/types/crd';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Crd01_Edit_Card } from './Crd01_Edit_Card';
import { Crd03_Grid_User } from './Crd03_Grid_User';

const gb = gbFor<CrdCard>();
const ALL = '%';
/** setSelectionModel 단일 선택(체크박스 없음). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Crd01_Tab_Card: React.FC = () => {
  const gridRef = useRef<AgGridReact<CrdCard>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  // [E0] 화면 열림 (생성자 L80-83) → init(): 사용자 "전체"(85), 검색칸(300, 빈칸 글자 안내), "사용카드만 보기" 체크 → retrieve() — 열자마자 조회한다
  const [managerId, setManagerId] = useState<string>(ALL);
  const [managers, setManagers] = useState<CrdCardManager[]>([]);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(true);
  const [rows, setRows] = useState<CrdCard[]>([]);
  const [loading, setLoading] = useState(false);
  /** 목록에서 고른 카드 → 편집 폼(editForm)·사용자 그리드(userGrid). null이면 둘 다 비활성 */
  const [selected, setSelected] = useState<CrdCard | null>(null);
  /** 다음 rowData 갱신 때 고를 행 id (없으면 첫 행) */
  const pendingSelect = useRef<number | null>(null);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);

  // [E1] searchText.KeyPress [Enter] (L93)·[E2] retrieveButton[조회].Select (L102) → retrieve() L235-268: crd.Crd01_Card.selectByText(searchText, companyId, useYn, managerId)
  //   끝나면 사용자 콤보를 다시 읽고(selectCardManager, useYn 조건), 첫 행을 고르고 폼·사용자 그리드를 켠다(행이 없으면 끈다)
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      // getManagerId() L362-372: "%"이거나 없으면 전체(null)
      const list = await crdApi.searchCards({ searchText, useYn, managerId: managerId === ALL ? null : Number(managerId) });
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(list);
      if (list.length === 0) setSelected(null);
      setManagers(await crdApi.searchCardManagers(useYn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] insertButton[등록].Select (L108) → insertRow() L270-280: GridInsertRow — 03 원칙 17에 따라 맨 아래에 넣고 보여 준다
  //   새 행 = 카드구분 1 "신용카드", 사용여부 true
  const insertRow = () => {
    const row: CrdCard = { cardId: --tempId.current, cardType: '1', cardTypeName: '신용카드', closeYn: 'true' };
    pendingSelect.current = row.cardId;
    setRows(prev => [...prev, row]);
  };

  // [E4] deleteButton[삭제].Select (L114) → 고른 카드가 있을 때만 deleteCheck() L282-317: "삭제"/"선택한 내용을 삭제하시겠습니까?"(폭 300)
  //   → [E9] msgBox.DialogHide [YES] (L285) → 서버가 사용내역을 확인("사용내역이 등록된 카드는 삭제불가합니다") → delete() L319-341: 사용자 이력 삭제 + 카드 삭제 → 첫 행 선택
  const deleteCheck = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    if (!row) return;
    Modal.confirm({
      title: '삭제',
      content: '선택한 내용을 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          if (row.cardId > 0) await crdApi.deleteCard(row.cardId);
          pendingSelect.current = null;
          setRows(prev => prev.filter(r => r.cardId !== row.cardId));
          setSelected(null);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E5] tempDownloadButton[템플릿].Select (L125) → downloadForm.submit(): ./excelTemplete/Template_카드업로드.xlsx
  const downloadTemplate = async () => {
    try {
      await crdApi.downloadCardTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E6] excelUploadButton[엑셀업로드].Select (L132) → excelUpload() L343-360: 파일을 고르면 ExcelUpload?uploadType=cardUpload
  // [E10] fileUploadField.Change (L352) → uploadExcelForm.submit(), [E7] uploadExcelForm.SubmitComplete (L142): "Y"면 "업로드가 완료되었습니다" 뒤 retrieve(), 아니면 오류 메시지
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await crdApi.uploadCardsExcel(file);
      message.success('업로드가 완료되었습니다');
      void retrieve();
    } catch (err) {
      message.warning(errorMessage(err, '업로드 실패'));
    }
  };

  // [E8] grid.SelectionChanged [선택>0] (L197) → editForm.setEnabled(true)·userGrid.setEnabled(true), editForm.retrieve(카드), userGrid.retrieve(cardId) / 선택이 없으면 둘 다 비활성
  const onSelectionChanged = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    setSelected(row ?? null);
  };

  // Crd01_Edit_Card.update()의 결과 카드로 목록을 갱신한다(새 카드는 임시 id를 서버 id로 바꾼다) → 그 행을 그대로 고른다. 카드사용자 열은 저장이 바꾸지 않으므로 이전 값을 유지한다
  const onSaved = (oldId: number, saved: CrdCard) => {
    pendingSelect.current = saved.cardId;
    setRows(prev => prev.map(r => (r.cardId === oldId ? { ...saved, cardManagerName: r.cardManagerName } : r)));
  };

  // buildGrid() L216-233
  const columnDefs = useMemo(() => [
    gb.text('cardName', 200, '카드명'),  // L221
    gb.textCenter('cardManagerName', 100, '카드사용자'),  // L222
    gb.text('cardNoSlip', 230, '카드번호'),  // L223
    gb.text('bankName', 200, '카드회사'),  // L224
    gb.date('frDate', 90, '시작일자'),  // L225
    gb.date('toDate', 90, '종료일자'),  // L226
    gb.text('cardNo', 230, '사용내역 업로드 식별구분'),  // L227
    gb.text('cardTypeName', 80, '카드구분'),  // L228
    // L229 addBooleanString: 값이 true면 "사용", 아니면 "미사용"
    gb.textCenter('closeYn', 80, '사용여부', { valueFormatter: p => (p.value === 'true' ? '사용' : '미사용') }),
    gb.text('note', 200, '비고'),  // L230
  ], []);

  const managerOptions = useMemo(
    () => [{ value: ALL, label: '전체' }, ...managers.map(m => ({ value: String(m.personId), label: m.name }))],
    [managers],
  );

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120} max={1000}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="delete" onClick={deleteCheck}>삭제</Button>
                  <Button type="download" onClick={downloadTemplate}>템플릿</Button>
                  <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
                  <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
                </>}
              >
                <SearchBar.Field label="사용자">
                  <Select style={{ width: 85 }} value={managerId} options={managerOptions} onChange={setManagerId} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 300 }} placeholder="카드번호/명을 입력하세요." value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용카드만 보기</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<CrdCard>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.cardId)}
                  loading={loading}
                  rowSelection={SINGLE_SELECTION}
                  onRowDataUpdated={e => {
                    // 조회·등록·저장 뒤 고를 행(없으면 첫 행)을 고르고 보여 준다
                    const node = pendingSelect.current != null ? e.api.getRowNode(String(pendingSelect.current)) : e.api.getDisplayedRowAtIndex(0);
                    pendingSelect.current = null;
                    if (node) {
                      node.setSelected(true);
                      if (node.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                    }
                  }}
                  onSelectionChanged={onSelectionChanged}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={440} min={440} max={1000}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box', display: 'flex' }}>
            <div style={{ width: 570, flexShrink: 0, marginRight: -1 }}>
              <Crd01_Edit_Card model={selected} onSaved={onSaved} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Crd03_Grid_User cardId={selected?.cardId ?? null} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
