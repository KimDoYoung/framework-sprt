/**
 * 원천징수영수증(사본) (S24) — 경영관리 > 04. 급여관리 > 원천징수영수증(사본) #1219
 * AS-IS: myApp/client/vi/pay/Pay08_Tab_TaxWithholding.java (139줄) + Pay08_PDFViewer(69줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 Pay08_Tab_TaxWithholding() L37-69: 왼쪽 580 = 툴바 50([조회]) + 파일 그리드(단일 선택), 가운데 = PDF 뷰어(분할), 바깥 여백 20.
 * 본인(로그인 사용자)의 영수증 파일만 보인다 — 사원은 서버가 정한다. PDF 뷰어는 매뉴얼용 Sys95_PDFViewer(A33)를 그대로 쓴다(Pay08_PDFViewer와 같은 open() 안내).
 * 스타일: SG
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { PayTaxReceipt } from '@/types/pay';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Sys95_PDFViewer } from '../sys/Sys95_PDFViewer';

const gb = gbFor<PayTaxReceipt>();

export const Pay08_Tab_TaxWithholding: React.FC = () => {
  const gridRef = useRef<AgGridReact<PayTaxReceipt>>(null);
  const selectFirst = useRef(false);
  const [rows, setRows] = useState<PayTaxReceipt[]>([]);
  const [selected, setSelected] = useState<PayTaxReceipt>();
  const [loading, setLoading] = useState(false);

  // retrieve() L113-138: pay.Pay08_TaxWithholding.selectByPersonId(personId = 로그인 사용자). 조회 뒤 첫 행을 선택하고 PDF면 열고 아니면 "none"
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await payApi.searchMyTaxReceipts();
      selectFirst.current = true;
      setSelected(undefined);
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L37-69) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  useEffect(() => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    if (rows.length > 0) setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true));
  }, [rows]);

  // buildGrid() L93-111: 파일명 300 · 비고 200 · 내려받기 아이콘 30 (FileDownload?fileType=file&fileId=)
  const columnDefs = useMemo(() => [
    gb.text('fileName', 300, '파일명'),
    gb.text('note', 200, '비고'),
    iconCell<PayTaxReceipt>('down', 'actionCell', 30, '', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  const isPdf = selected?.fileExt?.toLowerCase() === 'pdf';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <Splitter style={{ height: '100%', border: '1px solid #d9d9d9' }}>
        <Splitter.Panel defaultSize={580} min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
            {/* [E2] retrieveButton[조회].Select (L85) → retrieve() */}
            <SearchBar onSearch={retrieve} loading={loading} />
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E1] grid.CellClick (L72) → 인라인 L72-84: 고른 파일이 pdf면 viewer.open(PDF) 아니면 viewer.open("none") */}
              <SingleGrid<PayTaxReceipt>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.fileId)}
                onSelect={setSelected}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={300}>
          <Sys95_PDFViewer fileId={isPdf ? selected?.fileId : undefined} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
