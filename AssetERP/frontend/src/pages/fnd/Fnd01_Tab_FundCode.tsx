/**
 * [1048] 펀드관리 > 02. 펀드관리 > 펀드 등록 및 변경 (P05)
 * AS-IS: myApp/client/vi/fnd/Fnd01_Tab_FundCode.java (421줄) + Fnd01_Edit_FundCode.java (461줄, 아래 편집 폼)
 *   + components/lookup/Fnd03_Lookup_Consignment·Fnd06_Lookup_OfficeWork·Fnd09_Lookup_TrustBank (각 140줄)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L78-222: 위(분할 가능, 여백 20·20·0·20) = 테두리 박스(툴바 50 + 펀드 그리드) / 아래(360, 최대 900, 여백 20) = 편집 폼(Fnd01_Edit_FundCode)
 * 스타일: SGEF (견본 SGVF = Fnd01_Tab_FundSearch의 4항목 적용: 툴바-그리드 간격 8, 폼 라벨 우측 정렬, 폼 영역 최소 360, 줄 간격 10, 위쪽 박스 테두리 없음)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * 도달 불가(원본): [파일업로드] 단추(L139 주석 처리)와 그 fileUpdownForm(E5·E6), deleteRow()(E11, 호출처 없음) → 만들지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundDetail } from '@/types/fnd';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Fnd01_Edit_FundCode } from './Fnd01_Edit_FundCode';

const gb = gbFor<FundDetail>();
const ALL = '%';
/** 콤보 "전체"(fundTypeComboBox·classTypeComboBox = ComboBoxField(…, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd01_Tab_FundCode: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundDetail>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  // [E0] 화면 열림 (생성자 L78-222) → retrieve() — 열자마자 조회한다. 펀드유형 "전체"(150), 클래스구분 "전체"(110), 검색칸(350, 빈칸 글자 안내), 해지펀드포함 해제
  const [fundTypeCode, setFundTypeCode] = useState<string>(ALL);
  const [classTypeCode, setClassTypeCode] = useState<string>(ALL);
  const [fundText, setFundText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [rows, setRows] = useState<FundDetail[]>([]);
  const [loading, setLoading] = useState(false);
  /** 목록에서 고른 행 → 편집 폼(editFundCodeForm). null이면 폼 비활성 */
  const [selected, setSelected] = useState<FundDetail | null>(null);
  /** 다음 rowData 갱신 때 고를 행 id (없으면 첫 행) */
  const pendingSelect = useRef<number | null>(null);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);

  // [E1] fundSearchTextField.KeyPress [Enter] (L86)·[E2] retrieveButton[조회].Select (L97) → retrieve() L271-295: fnd.Fnd01_FundCode.selectByFundName
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchFunds({ closeYn, fundName: fundText, fundTypeCode, classTypeCode });
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(list);  // 조회가 끝나면 첫 행을 고르고 폼을 켠다(onRowDataUpdated), 행이 없으면 폼을 끈다
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5 생략] fileUploadButton[파일업로드].Select (L115) → update() — 단추를 툴바에 안 붙여(L139 주석 처리) 도달 불가
  // [E6 생략] fileUpdownForm.Change (L145) → retrieve() — [파일업로드]가 여는 폼이라 도달 불가
  // [E11 생략] messageBox.DialogHide (L368) → deleteSelectedRow() — deleteRow() 호출처 없음(삭제 단추 없음)
  // [E3] insertButton[등록].Select (L103) → insertRow() L303-313: GridInsertRow — 03 원칙 17에 따라 맨 아래에 넣고 보여 준다
  const insertRow = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const row: FundDetail = {
      fundCodeId: --tempId.current,
      startDate: today,
      workDate: today,
      closeYn: 'false',
      closeName: '정상',
    };
    pendingSelect.current = row.fundCodeId;
    setRows(prev => [...prev, row]);
  };

  // [E4] copyButton[등록(복사)].Select (L109) → copyInsertRow() L315-362: 고른 행의 설정일·해지일·해지구분·협회/예탁원 코드·펀드명·유형·운용부서·신탁/공모·운용역·수탁사·사무수탁사·클래스구분을 가진 새 행
  //   (펀드코드·비고·수탁은행·보수율 등은 복사하지 않는다. ICAM관리 여부도 복사하지 않아 새 행은 일반 저장이 된다 — 원본은 icamYn까지 복사해 저장이 실패한다, 작업기록 제안)
  const copyInsertRow = () => {
    const src = gridRef.current?.api?.getSelectedRows()[0];
    if (!src) {
      message.warning('복사할 대상을 선택해주세요.');
      return;
    }
    const row: FundDetail = {
      fundCodeId: --tempId.current,
      startDate: src.startDate, endDate: src.endDate, closeYn: src.closeYn, closeName: src.closeName,
      kofiaFundCode: src.kofiaFundCode, ksdFundCode: src.ksdFundCode,
      fundName: src.fundName, fundFullName: src.fundFullName,
      kofiaFundTypeCode: src.kofiaFundTypeCode, kofiaFundTypeName: src.kofiaFundTypeName,
      orgCodeName: src.orgCodeName,
      kofiaTrustCode: src.kofiaTrustCode, kofiaTrustName: src.kofiaTrustName,
      operator1: src.operator1, operator2: src.operator2,
      kofiaPublicCode: src.kofiaPublicCode, kofiaPublicName: src.kofiaPublicName,
      consignmentCode: src.consignmentCode, consignmentName: src.consignmentName,
      officeWorkCode: src.officeWorkCode, officeWorkName: src.officeWorkName,
      kofiaClassTypeCode: src.kofiaClassTypeCode, kofiaClassTypeName: src.kofiaClassTypeName,
      workDate: dayjs().format('YYYY-MM-DD'),
    };
    pendingSelect.current = row.fundCodeId;
    setRows(prev => [...prev, row]);
  };

  // [E7] tempDownloadButton[템플릿].Select (L165) → downloadForm.submit(): ./excelTemplete/Template_펀드정보.xlsx
  const downloadTemplate = async () => {
    try {
      await fndApi.downloadFundTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E10] excelUploadButton[엑셀업로드].Select (L215) → excelUpload() L394-412: 파일을 고르면 ExcelUpload?uploadType=fundUpload
  // [E12] fileUploadField.Change (L404) → uploadExcelForm.submit(), [E9] uploadExcelForm.SubmitComplete (L208) → retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await fndApi.uploadFundsExcel(file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    void retrieve();
  };

  // [E8] grid.SelectionChanged [선택>0] (L193) → retrieveEditPage() L254-268: editFundCodeForm.retrieve(선택한 행) / 선택이 없으면 폼 비활성
  const retrieveEditPage = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    setSelected(row ?? null);
  };

  // Fnd01_Edit_FundCode.updateRow()의 결과 행으로 목록을 갱신한다(새 행은 임시 id를 서버 id로 바꾼다) → 그 행을 그대로 고른다
  const onSaved = (oldId: number, saved: FundDetail) => {
    pendingSelect.current = saved.fundCodeId;
    setRows(prev => prev.map(r => (r.fundCodeId === oldId ? saved : r)));
  };

  // buildGrid() L224-252
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 150, '펀드코드', { pinned: 'left' }),  // addTextFrozen
    gb.text('fundName', 350, '펀드명', { pinned: 'left' }),  // addTextFrozen
    gb.text('kofiaFundTypeName', 150, '펀드유형'),
    gb.text('kofiaClassTypeName', 100, '클래스구분'),
    gb.date('startDate', 90, '설정일'),
    gb.date('endDate', 90, '해지일'),
    gb.text('closeName', 70, '해지여부'),
    gb.text('kofiaTrustName', 120, '신탁구분'),
    gb.text('kofiaPublicName', 130, '공모구분'),
    gb.text('orgCodeName', 150, '운용부서'),
    gb.text('operator1', 100, '주운용역'),
    gb.text('operator2', 100, '부운용역'),
    gb.text('consignmentName', 150, '수탁사'),
    gb.text('officeWorkName', 150, '사무수탁사'),
    gb.text('note', 300, '비고'),
  ], []);

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
                  <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
                  <Button type="download" onClick={downloadTemplate}>템플릿</Button>
                  <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>
                  <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
                </>}
              >
                <SearchBar.Field label="펀드유형">
                  <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 150 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="클래스구분">
                  <SystemCodeComboBox kindCd="IcamClassType" altCode={ALL_CODE} style={{ width: 110 }} value={classTypeCode} onChange={c => setClassTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 350 }} placeholder="펀드코드/펀드명/협회코드/예탁원코드/수탁사/사무수탁사" value={fundText} onChange={e => setFundText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<FundDetail>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.fundCodeId)}
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
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={360} min={360} max={900}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <Fnd01_Edit_FundCode model={selected} onSaved={onSaved} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
