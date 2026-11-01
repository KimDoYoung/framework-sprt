/**
 * [1330] 신청 > 90. 기타신청 > 법인서류 및 날인 신청 (Y11)
 * AS-IS: myApp/client/vi/apr/Apr16_Tab_StampDocAppl.java (304줄) + Apr16_Lookup_StampDocAppl (575줄) + 연결 Apr15_Lookup_ReprCorp · Apr10_Lookup_Stamp · Apr05_Lookup_LoadDoc2 · Apr01_Edit_ApprDoc
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L62-92: 가운데(여백 20) = 툴바(신청일자 ~ · 검색 제공처/목적 230 · [미처리만 조회] · [조회][등록][등록(복사)][삭제]) + 신청 그리드(체크 다중, 15열, 연관문서 묶음 머리)
 * 스타일: SG (견본 Tdm01_Tab_Hr: 바깥 여백 20, 안쪽 padding 10, 간격 8, 테두리 없음)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { GridApi } from 'ag-grid-community';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprStampAppl } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { dynamicIconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';
import { Apr16_Lookup_StampDocAppl, StampApplTarget } from './Apr16_Lookup_StampDocAppl';

const gb = gbFor<AprStampAppl>();
const DATE = 'YYYY-MM-DD';

export const Apr16_Tab_StampDocAppl: React.FC = () => {
  // settings() L94-139: 신청일자 = 올해 1월 1일 ~ 오늘, [미처리만 조회] 기본 체크, 검색 빈칸(제공처/목적)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [resultCheck, setResultCheck] = useState(true);
  const [rows, setRows] = useState<AprStampAppl[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<StampApplTarget | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const gridApi = useRef<GridApi<AprStampAppl> | null>(null);

  // retrieve() L180-197: apr.Apr16_StampDoc.selectByApplEmpId(companyId, personId, "%검색어%", startDate, closeDate, procResult) — 회사·사원은 서버(로그인)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await aprStampDocApi.searchMine({ startDate: startDate.format(DATE), closeDate: closeDate.format(DATE), searchText, procResult: resultCheck }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L61-92) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] insertButton[등록].Select (L121) → insert() L199-206: Apr16_Lookup_StampDocAppl.openNew
  const insert = () => setTarget({ mode: 'new', row: null });

  // [E4] copyButton[등록(복사)].Select (L127) → copy() L208-225
  const copy = () => {
    const selected = gridApi.current?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('복사할 대상을 선택해 주세요'); return; }
    if (selected.length > 1) { message.warning('복사할 대상은 하나만 선택하세요'); return; }
    setTarget({ mode: 'copy', row: selected[0] });
  };

  // [E5] deleteButton[삭제].Select (L133) → deleteChk() L260-288 → [E6] messageBox.DialogHide (L278) → delete() L290-294: apr.Apr16_StampDoc.delete(체크한 행)
  const deleteChk = () => {
    const selected = gridApi.current?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 내역을 선택하세요'); return; }
    for (const r of selected) {
      if (r.regDate != null) { message.warning('접수등록된 항목은 삭제 불가능합니다.'); return; }
      if (r.stampDate != null) { message.warning('날인일자가 설정된 내역은 삭제 불가능합니다.'); return; }
    }
    Modal.confirm({
      title: '확인',
      content: `선택된 ${selected.length}건의 신청내역을 삭제하시겠습니까?`,
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await aprStampDocApi.deleteMine(selected.map(r => r.stampDocId));
          message.success('삭제가 완료되었습니다.');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L141-178
  const columnDefs = useMemo(() => [
    // L162 addCell(ImageCell("Edit")) → lookupDetail() L227-234: Apr16_Lookup_StampDocAppl.open(선택한 행)
    iconCell<AprStampAppl>('edit', 'actionCell', 45, '수정', row => setTarget({ mode: 'edit', row })),
    gb.date('applDate', 90, '신청일자'),  // L163
    gb.text('applTypeName', 120, '신청구분'),  // L164
    gb.text('stampReprCorpName', 200, '인감 및 대표명의'),  // L165
    gb.text('provideCo', 200, '제공처'),  // L166
    gb.text('purpose', 200, '목적'),  // L167
    gb.text('note', 200, '비고<br>(날인요청서류)'),  // L168
    gb.text('requester', 100, '요청자'),  // L169
    gb.longCenter('applQty', 70, '신청/날인<br>부수'),  // L170
    gb.booleanYn2('stampOutYn', 45, '인감<br>반출'),  // L171
    gb.date('stampDate', 90, '날인일자'),  // L172
    gb.group('연관문서', [  // L159 addHeaderGroupMap(HeaderGroupConfig "연관문서", 1, 3)
      gb.text('apprName', 250, '문서명'),  // L173
      gb.textStatus('apprStatusName', 70, '상태'),  // L174
      // L175 addDynamicCell(…, true) → lookupAppr() L236-258: ApprCallbackResult(apprId) → Apr01_Edit_ApprDoc.retrieveApproval, 권한이 없으면 "해당문서의 열람권한이 없습니다"
      dynamicIconCell<AprStampAppl>('view', 'apprCell', 35, ' ', row => setViewApprId(row.apprId ?? null), row => row.apprStatusName != null),
    ]),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L115) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={
            <>
              <Button type="register" onClick={insert}>등록</Button>
              <Button type="register" onClick={copy}>등록(복사)</Button>
              <Button type="delete" onClick={deleteChk}>삭제</Button>
            </>
          }
        >
          <SearchBar.Field label="신청일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L106) → retrieve() */}
            <SearchBar.Input style={{ width: 230 }} placeholder="제공처/목적" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={resultCheck} onChange={e => setResultCheck(e.target.checked)}>미처리만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<AprStampAppl>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.stampDocId)}
            loading={loading}
            onGridReady={e => { gridApi.current = e.api; }}
          />
        </div>
      </div>
      <Apr16_Lookup_StampDocAppl target={target} onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </div>
  );
};
