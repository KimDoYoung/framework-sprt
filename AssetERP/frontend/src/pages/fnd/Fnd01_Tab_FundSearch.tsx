/**
 * [1049] 펀드관리 > 02. 펀드관리 > 펀드 조회 (P07)
 * AS-IS: myApp/client/vi/fnd/Fnd01_Tab_FundSearch.java (303줄) + Fnd01_Edit_FundSearch.java (344줄, 아래 읽기 전용 폼) + Fnd25_Lookup_Content.java (226줄, components/lookup, 규약보기)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-96: 위(분할 가능, 최대 1000, 여백 20·20·0·20) = 테두리 박스(툴바 50 + 펀드 그리드) / 아래(320, 최대 900, 여백 20) = 읽기 전용 폼(Fnd01_Edit_FundSearch)
 * 열 때 조회하지 않는다(생성자는 settings()만). 조회가 끝나면 첫 행을 고른다
 * RD: [엑셀다운로드]는 `rdDownload`(docs/RD-대책.md) — mrd Fnd01_Rd_FundSearch
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { FundSearch } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Fnd25_Lookup_Content } from '@/components/lookup/Fnd25_Lookup_Content';
import { rdDownload } from '@/utils/rdDownload';
import { Fnd01_Edit_FundSearch } from './Fnd01_Edit_FundSearch';

const gb = gbFor<FundSearch>();
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked 없음 → 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd01_Tab_FundSearch: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundSearch>>(null);
  // [E0] 화면 열림 (생성자 L58-96) → settings() L98-141: 펀드유형 "전체"(180), 클래스구분 "전체"(130), 해지펀드포함 해제, 검색칸 400(빈칸 글자 안내)
  const [fundTypeCode, setFundTypeCode] = useState<string>(ALL);
  const [classTypeCode, setClassTypeCode] = useState<string>(ALL);
  const [closeYn, setCloseYn] = useState(false);
  const [fundName, setFundName] = useState('');
  const [rows, setRows] = useState<FundSearch[]>([]);
  const [loading, setLoading] = useState(false);
  /** retrieveEditPage(): 고른 펀드 → 아래 폼 */
  const [selected, setSelected] = useState<FundSearch | null>(null);
  const [termsId, setTermsId] = useState<number | null>(null);
  const retrieveSeq = useRef(0);

  // [E1] retrieveButton[조회].Select (L110) · [E3] fundSearchTextField.KeyPress [Enter] (L124) → retrieve() L205-227: fnd.Fnd01_FundCode.selectByFundName (planYn false)
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchFundSearch({ closeYn, fundName, fundTypeCode, classTypeCode });
      if (my !== retrieveSeq.current) return;
      setRows(list);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  // [E2] downloadButton[엑셀다운로드].Select (L116) → createRdExcel() L229-283: sys.Sys99_Print.insertRdFundSearch → RD 엑셀 내려받기 (파일명 "펀드조회(yyyy-MM-dd).xlsx")
  const createRdExcel = async () => {
    setLoading(true);
    try {
      const groupId = await fndApi.rdDownloadFundSearch({ closeYn, fundName, fundTypeCode, classTypeCode });
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Fnd01_Rd_FundSearch',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `펀드조회(${dayjs().format('YYYY-MM-DD')}).xlsx`,
        rv: { rdGroupId: groupId },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E4] grid.SelectionChanged [선택>0] (L133) → retrieveEditPage() L191-203: editFundCodeForm.retrieve(fundModel), 선택이 없으면 init()
  const retrieveEditPage = () => setSelected(gridRef.current?.api?.getSelectedRows()[0] ?? null);

  // buildGrid() L143-189 (고정 열 1~2) — viewContent() L285-289: Fnd25_Lookup_Content.open(termsId)
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 90, '펀드코드', { pinned: 'left' }),
    gb.text('fundName', 350, '펀드명', { pinned: 'left' }),
    gb.textCenter('kofiaFundCode', 110, '협회펀드코드'),
    gb.textCenter('ksdFundCode', 110, '예탁원펀드코드'),
    gb.textCenter('ksdItemCode', 110, '예탁원종목코드'),
    gb.text('kofiaFundTypeName', 100, '펀드유형'),
    gb.text('kofiaClassTypeName', 100, '클래스구분'),
    gb.date('startDate', 90, '설정일'),
    gb.date('endExpectDate', 90, '만기예정일'),
    gb.date('endDate', 90, '해지일'),
    gb.textCenter('closeName', 70, '해지여부'),
    gb.text('kofiaTrustName', 100, '신탁구분'),
    gb.text('kofiaPublicName', 130, '공모구분'),
    gb.text('consignmentName', 150, '수탁사'),
    gb.text('trustBankName', 120, '수탁은행'),
    gb.text('officeWorkName', 150, '사무수탁사'),
    gb.textCenter('operator1', 90, '주운용역'),
    gb.textCenter('operator2', 90, '부운용역'),
    gb.long('seoljAek', 110, '설정액'),
    gb.long('sunjasanAek', 110, '순자산'),
    gb.double('managementRate', 100, '운용보수율(bp)'),
    gb.double('salesRate', 100, '판매보수율(bp)'),
    gb.double('consignmentRate', 100, '수탁보수율(bp)'),
    gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),
    gb.date('revisionDate', 90, '최종<br>규약일자'),
    gb.longCenter('revisionNo', 70, '최종<br>개정회차'),
    iconCell<FundSearch>('view', 'actionCell', 70, '규약보기', row => {
      if (row.termsId != null) setTermsId(row.termsId);  // 규약이 없는 펀드는 termsId가 null → 원본은 서버 호출 없이 빈 창
    }),
    gb.text('note', 300, '비고'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={150}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%',  display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<Button type="download" onClick={() => void createRdExcel()}>엑셀다운로드</Button>}
              >
                <SearchBar.Field label="펀드유형">
                  <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 180 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="클래스구분">
                  <SystemCodeComboBox kindCd="IcamClassType" altCode={ALL_CODE} style={{ width: 130 }} value={classTypeCode} onChange={c => setClassTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 400 }} placeholder="펀드코드/펀드명/협회코드/예탁원코드/수탁사/사무수탁사" value={fundName} onChange={e => setFundName(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 5 }}>
                <SingleGrid<FundSearch>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.fundCodeId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
                  onSelectionChanged={retrieveEditPage}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={360} min={360} max={900}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <Fnd01_Edit_FundSearch model={selected} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Fnd25_Lookup_Content termsId={termsId} onClose={() => setTermsId(null)} />
    </div>
  );
};
