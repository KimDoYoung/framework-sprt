/**
 * 매매내역조회 (J03) — 준법감시 > 11. 임직원매매(준감인) > 매매내역조회 #1153
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_TrListAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-134: vlc = 툴바 두 줄(1줄: 조회기간 · 사원명 · 입/출 · 매매구분 · 사전신고 포함 · [조회][엑셀다운로드][엑셀다운로드(금감원양식)] / 2줄: 검색 · 안내문) / 읽기 전용 그리드(단일 선택)
 * 개인용 I08 Flt10_Tab_TrList의 준감인 짝 — 같은 SQL(flt10_tr.selectByTrList)에 사원 선택(personId, 비우면 회사 전체)과 unApprYn "false"가 다르다.
 * 원본 엑셀은 RD 리포트 서버(Flt10_Rd_TrListAdmin·…Report) → TOBE는 서버가 조회 결과를 xlsx로 만든다(E10·G03과 같은 방식)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltTrList } from '@/types/flt';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<FltTrList>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '전체';

/** 사전승인 칸을 눌렀을 때 보여 주는 글 (E7 L224-256) */
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

export const Flt10_Tab_TrListAdmin: React.FC = () => {
  // setInitData(): 조회기간 = 오늘 − 1개월의 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  // settings() L136-278: empKorName은 비어 있고(emptyText "전체") personId = null
  const [empName, setEmpName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [empOpen, setEmpOpen] = useState(false);
  const [ioType, setIoType] = useState('%');
  const [trType, setTrType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [preTr, setPreTr] = useState(true);  // preTrCheckBox.setValue(true)
  const [rows, setRows] = useState<FltTrList[]>([]);
  const paramRef = useRef({ startDate, closeDate, personId, ioType, trType, searchText, preTr });
  paramRef.current = { startDate, closeDate, personId, ioType, trType, searchText, preTr };

  const params = (p: typeof paramRef.current) => ({
    personId: p.personId, startDate: p.startDate.format(DATE_FORMAT), closeDate: p.closeDate.format(DATE_FORMAT),
    preTrYn: p.preTr, trType: p.trType, ioType: p.ioType, searchText: p.searchText,
  });

  // retrieve() L321-340: 서비스 flt.Flt10_Tr.selectByTrList(companyId, personId, startDate, closeDate, preTrYn, unApprYn "false", trType, ioType, searchText "%…%")
  const retrieve = useCallback(async (override?: Partial<typeof paramRef.current>) => {
    try {
      setRows(await fltApi.searchTrListAdmin(params({ ...paramRef.current, ...override })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L84-134) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() — setPreTrColumn(): 사전신고 포함이 꺼지면 4~7번 열(사전신고일·종목명·수량·금액)을 가린다
  const columnDefs = useMemo(() => [
    gb.text('personOrgName', 150, '사원명', { pinned: 'left' }),  // 가로 스크롤해도 사원명은 항상 보이게 왼쪽 고정
    gb.textCenter('inOutName', 60, '입/출'),
    gb.textCenter('trTypeName', 100, '매매구분'),
    gb.date('regDate', 90, '사전신고일', { hide: !preTr }),  // 원본 100 → UX-08
    gb.text('itemName', 180, '사전신고종목명', { hide: !preTr }),
    gb.double('expectTrQty', 80, '사전신고수량', { hide: !preTr }),
    gb.long('expectTrAmt', 120, '사전신고금액', { hide: !preTr }),
    // [E7] grid.CellClick [event.getCellIndex() == 8] (L224) → 사유 알림창
    gb.textCenter('statusName', 100, '사전승인', {
      onCellClicked: (e: CellClickedEvent<FltTrList>) => { if (e.data) showReason(e.data); },
    }),
    gb.date('trDate', 90, '매매일자'),  // 원본 100 → UX-08
    gb.text('trItemTypeName', 150, '종목유형'),
    gb.text('trItemName', 180, '종목명'),
    gb.double('trQty', 80, '매매수량'),
    gb.long('trAmt', 120, '매매총액'),
    gb.double('trPlRate', 100, '손익율(%)'),
    gb.textArea('trNote', 150, '비고'),
  ], [preTr]);

  // [E3] empKorName.TriggerClick [result == null] (L174) → Emp00_Lookup_SelectSingle.open(true, 오늘, …): [전체]는 null → "전체", personId = null
  const onEmpResult = (emp: TransInfo | null) => {
    setEmpOpen(false);
    if (emp == null) {
      setEmpName(ALL);
      setPersonId(null);
    } else {
      setEmpName(emp.korNm ?? '');
      setPersonId(emp.personId);
    }
  };

  // [E4] empKorName.Change (L193) → 칸이 비면 personId = null. 칸이 읽기 전용(setEditable(false))이라 글자를 지울 수 없어 별도 처리 없음 —
  // 비우는 길은 조회창의 [전체]뿐이고 그건 위 E3이 같은 일(전체 · personId null)을 한다

  // [E1] ioTypeComboBox.Collapse (L155) → retrieve()
  const onIoTypeChange = (code: string | undefined) => {
    const v = code ?? '%';
    setIoType(v);
    void retrieve({ ioType: v });
  };

  // [E2] trTypeComboBox.Collapse (L164) → retrieve()
  const onTrTypeChange = (code: string | undefined) => {
    const v = code ?? '%';
    setTrType(v);
    void retrieve({ trType: v });
  };

  // [E5] preTrCheckBox.ValueChange (L204) → setPreTrColumn(), retrieve()
  const onPreTrChange = (checked: boolean) => {
    setPreTr(checked);
    void retrieve({ preTr: checked });
  };

  // [원본에 없음] 초기화 버튼 — 이 화면만의 사용자 개별 요청(2026-10-21, 규칙·선례 아님). 모든 조건을 처음 열었을 때 값으로 되돌리고 자동 조회는 하지 않는다
  const onReset = () => {
    setStartDate(dayjs().subtract(1, 'month').startOf('month'));
    setCloseDate(dayjs());
    setEmpName('');
    setPersonId(null);
    setIoType('%');
    setTrType('%');
    setSearchText('');
    setPreTr(true);
  };

  // [E9] downloadButton[엑셀다운로드].Select (L265) → createRdExcel("default") L355-422 (RD 대신 서버 xlsx, 사전신고 포함 고정)
  // [E10] reportDownloadButton[엑셀다운로드(금감원양식)].Select (L272) → createRdExcel("report") (사전신고 제외)
  const createRdExcel = async (statusCode: 'default' | 'report') => {
    const p = paramRef.current;
    const fileName = `임직원 매매내역(${p.startDate.format(DATE_FORMAT)} ~ ${p.closeDate.format(DATE_FORMAT)}).xlsx`;
    try {
      await fltApi.downloadTrListAdminExcel({ ...params(p), report: statusCode === 'report' }, fileName);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E8] retrieveButton[조회].Select (L258) → retrieve(). [E6] searchTextField.KeyPress [Enter] (L215) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          onReset={onReset}
          extra={
            <>
              <Button type="download" onClick={() => createRdExcel('default')}>엑셀다운로드</Button>
              <Button type="download" onClick={() => createRdExcel('report')}>엑셀다운로드(금감원양식)</Button>
            </>
          }
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <LookupInput width={100} value={empName} placeholder={ALL} onOpen={() => setEmpOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="입/출">
            <SystemCodeComboBox kindGroupCd="BookInOutType0001" altCode={['%', '전체']} style={{ width: 80 }} value={ioType} onChange={onIoTypeChange} />
          </SearchBar.Field>
          <SearchBar.Field label="매매구분">
            <SystemCodeComboBox kindCd="FloorTrCode" altCode={['%', '전체']} style={{ width: 150 }} value={trType} onChange={onTrTypeChange} />
          </SearchBar.Field>
          <Checkbox checked={preTr} onChange={e => onPreTrChange(e.target.checked)}>사전신고 포함</Checkbox>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 222 }} placeholder="사전신고종목명/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ fontSize: 12, color: '#456EA6', fontWeight: 'bold' }}>* 사전승인 글씨를 클릭하여 신청 및 승인/반려 사유를 확인 할 수 있습니다.</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltTrList>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trId)}
          />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={empOpen} transDate={dayjs().format(DATE_FORMAT)} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
    </div>
  );
};
