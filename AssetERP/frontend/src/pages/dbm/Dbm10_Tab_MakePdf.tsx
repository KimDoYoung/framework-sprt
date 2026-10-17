/**
 * [1108] 관리자 > 09. 기타 > PDF 생성 테스트 (C07)
 * AS-IS: myApp/client/vi/dbm/Dbm10_Tab_MakePdf.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L26-37: 툴바(조회 · PDF 생성) + 그리드(등록일·시행일·문서분류·문서명·등록자·등록부서, 체크박스 단일 선택)
 * PDF 생성 = 서버 PDFCreate.createPDF7(전자결재 Apr10_StampPDF7) — 연동이 없어 서버가 만들지 않고 알린다(작업기록 의존)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 없어 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { dbmApi } from '@/api/dbm';
import { errorMessage } from '@/api/client';
import { PdfTarget } from '@/types/dbm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<PdfTarget>();

/** AS-IS buildGrid() L39-53 */
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L45
  gb.date('effectDate', 100, '시행일'),  // L46
  gb.text('classTreeNameAllPath', 300, '문서분류'),  // L47
  gb.text('title', 400, '문서명'),  // L48
  gb.text('regEmpName', 80, '등록자'),  // L49
  gb.text('orgName', 150, '등록부서'),  // L50
];

export const Dbm10_Tab_MakePdf: React.FC = () => {
  const [rows, setRows] = useState<PdfTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<PdfTarget>>(null);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L56-66: 서비스 apr.Apr01_Appr.selectPdfMakeTarget (companyId는 서버가 세션에서)
  const retrieve = useCallback(async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await dbmApi.searchPdfTargets());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // update() L69-86: 선택 행의 apprId → 서비스 utils.pdf.PDFCreate.createPDF7 → 끝나면 unmask, retrieve()
  const update = async () => {
    const target = gridRef.current?.api.getSelectedRows()[0];
    if (!target) return;  // 원본은 선택이 없으면 NPE로 mask가 풀리지 않는다 — 제안(작업기록)
    setLoading(true);  // grid.mask("PDF 생성중")
    try {
      await dbmApi.createPdf(target.apprId);
    } catch (err) {
      message.error(errorMessage(err, 'PDF 생성 실패'));
    } finally {
      setLoading(false);
    }
    await retrieve();
  };

  // [E0] 화면 열림 (생성자 L26-37) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] searchbarBuilder[조회].Retrieve (L30) → retrieve()  /  [E2] searchbarBuilder[PDF 생성].Update (L31) → update() */}
      <SearchBar onSearch={retrieve} loading={loading} extra={
        <Button type="generate" onClick={update}>PDF 생성</Button>
      } />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<PdfTarget>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => p.data.apprId}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
    </div>
  );
};
