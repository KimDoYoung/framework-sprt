/**
 * 매매내역조회 (I08) — 준법감시 > 10. 임직원매매 > 매매내역조회 #1144
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_TrList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L69-113: vlc = 툴바(50: 조회기간 [시작] ~ [끝] · 입/출 · 매매구분 · 검색 · 사전신고 포함 · [조회][엑셀다운로드]) / 읽기 전용 그리드(단일 선택)
 * 원본 엑셀은 RD 리포트 서버(Flt10_Rd_TrList) → TOBE는 서버가 조회 결과를 xlsx로 만든다(E10·G03과 같은 방식)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltTrList } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<FltTrList>();
const DATE_FORMAT = 'YYYY-MM-DD';

/** 사전승인 칸을 눌렀을 때 보여 주는 글 (E5 L171-203) */
const showReason = (m: FltTrList) => {
  const show = (title: string, text: string) =>
    Modal.info({ title, content: <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>, width: 500 });
  if (m.statusCode === '10') {  // 10:신청
    show('매매사유', m.trReason ?? '');
  } else if (m.statusCode === '20' || m.statusCode === '25' || m.statusCode === '30') {  // 20:승인 / 25:협의승인 / 30:반려
    let reason = m.rejectReason ?? '';
    if (m.addConfirmReason) {
      reason = reason.length === 0 ? `(협의승인) ${m.addConfirmReason}` : `${reason}\n\n(협의승인) ${m.addConfirmReason}`;
    }
    show('승인 및 반려사유', reason);
  }
};

export const Flt10_Tab_TrList: React.FC = () => {
  // setInitData() L283-294: 조회기간 = 오늘 − 1개월의 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [ioType, setIoType] = useState('%');
  const [trType, setTrType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [preTr, setPreTr] = useState(true);  // L148 preTrCheckBox.setValue(true)
  const [rows, setRows] = useState<FltTrList[]>([]);
  const paramRef = useRef({ startDate, closeDate, ioType, trType, searchText, preTr });
  paramRef.current = { startDate, closeDate, ioType, trType, searchText, preTr };

  const params = (p: typeof paramRef.current) => ({
    startDate: p.startDate.format(DATE_FORMAT), closeDate: p.closeDate.format(DATE_FORMAT),
    preTrYn: p.preTr, trType: p.trType, ioType: p.ioType, searchText: p.searchText,
  });

  // retrieve() L261-281: 서비스 flt.Flt10_Tr.selectByTrList(companyId, personId, startDate, closeDate, preTrYn, unApprYn "true", trType, ioType, searchText "%…%")
  const retrieve = useCallback(async (override?: Partial<typeof paramRef.current>) => {
    try {
      setRows(await fltApi.searchTrList(params({ ...paramRef.current, ...override })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L69-113) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() L220-245 — setPreTrColumn() L247-259: 사전신고 포함이 꺼지면 4~7번 열(사전신고일·종목명·수량·금액)을 가린다
  const columnDefs = useMemo(() => [
    gb.text('accountNo', 200, '계좌', { pinned: 'left' }),  // 가로 스크롤해도 계좌는 항상 보이게 왼쪽 고정
    gb.textCenter('inOutName', 60, '입/출'),
    gb.textCenter('trTypeName', 100, '매매구분'),
    gb.date('regDate', 90, '사전신고일', { hide: !preTr }),  // 원본 100 → UX-08
    gb.text('itemName', 200, '사전신고종목명', { hide: !preTr }),
    gb.double('expectTrQty', 80, '사전신고수량', { hide: !preTr }),
    gb.long('expectTrAmt', 120, '사전신고금액', { hide: !preTr }),
    // [E5] grid.CellClick [event.getCellIndex() == 8] (L171) → 사유 알림창
    gb.textCenter('statusName', 100, '사전승인', {
      onCellClicked: (e: CellClickedEvent<FltTrList>) => { if (e.data) showReason(e.data); },
    }),
    gb.date('trDate', 90, '매매일자'),  // 원본 100 → UX-08
    gb.text('trItemTypeName', 150, '종목유형'),
    gb.text('trItemName', 200, '종목명'),
    gb.double('trQty', 80, '매매수량'),
    gb.long('trAmt', 120, '매매총액'),
    gb.double('trPlRate', 100, '손익율(%)'),
    gb.textArea('trNote', 150, '비고'),
  ], [preTr]);

  // [E1] ioType.Collapse (L133) → retrieve()
  const onIoTypeChange = (code: string | undefined) => {
    const v = code ?? '%';
    setIoType(v);
    void retrieve({ ioType: v });
  };

  // [E2] trType.Collapse (L142) → retrieve()
  const onTrTypeChange = (code: string | undefined) => {
    const v = code ?? '%';
    setTrType(v);
    void retrieve({ trType: v });
  };

  // [E3] preTrCheckBox.ValueChange (L151) → setPreTrColumn(), retrieve()
  const onPreTrChange = (checked: boolean) => {
    setPreTr(checked);
    void retrieve({ preTr: checked });
  };

  // [E7] downloadButton[엑셀다운로드].Select (L212) → createRdExcel() L296-353 (RD 대신 서버 xlsx)
  const createRdExcel = async () => {
    const p = paramRef.current;
    const fileName = `임직원 매매내역(${p.startDate.format(DATE_FORMAT)} ~ ${p.closeDate.format(DATE_FORMAT)}).xlsx`;
    try {
      await fltApi.downloadTrListExcel(params(p), fileName);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L205) → retrieve(). [E4] searchTextField.KeyPress [Enter] (L162) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={<Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="입/출">
            <SystemCodeComboBox kindGroupCd="BookInOutType0001" altCode={['%', '전체']} style={{ width: 80 }} value={ioType} onChange={onIoTypeChange} />
          </SearchBar.Field>
          <SearchBar.Field label="매매구분">
            <SystemCodeComboBox kindCd="FloorTrCode" altCode={['%', '전체']} style={{ width: 150 }} value={trType} onChange={onTrTypeChange} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="계좌/사전신고종목명/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={preTr} onChange={e => onPreTrChange(e.target.checked)}>사전신고 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltTrList>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trId)}
          />
        </div>
      </div>
    </div>
  );
};
