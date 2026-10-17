/**
 * [1097] I/F > 10. ICAM > 작업용 (D10)
 * AS-IS: myApp/client/vi/icam/Icam99_Tab_Test.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L239-308: 위 = 툴바 3줄(① 기준일 · 조회 · 종목정보 · 원장 · 시세 · 공모주38 · IPOStock · 미일치생성 · 알람실행
 *   ② 시작일 · 종료일 · 펀드원장 · 공모주청약 · 종목명 변경 반영 · 당일상장주Get · 일임계좌Get · test ③ 연도 칸 · 소실파일 · 타사무 보유종목Get)
 *   + 그리드(행번호, 체크박스 한 행 선택, 24열), 아래(South) = 버튼 줄(시작취소 … 승인시작 · 기간조건 제외 · 인사정보 가져오기 · 적용)
 * 원본이 툴바에 올리지 않은 버튼(batchButton1·2·3·6·10: 정보코드·연계정보·스케줄 생성·청구보수 TEST·준수 현황표)은 만들지 않는다 — [E2][E3][E4][E7][E11] 생략
 * 아래 줄의 버튼들은 원본에도 핸들러가 없다(눌러도 아무 일 없음)
 * 버튼 type: 가져오기·Get = `download`, 미일치생성 = `generate`, 알람실행 = `send`, 종목명 변경 반영 = `save`, 소실파일 = `search`, 나머지는 button-types 대응(제목 → type)
 * 작업 버튼(BatchMain 서블릿)은 서버에 연동이 없어 거절한다 — 작업기록 의존
 */
import React, { useCallback, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamData, IcamTestBatchReq } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const FORMAT = 'YYYY-MM-DD';
const gb = gbFor<IcamData>();

/** AS-IS buildGrid() L311-341 */
const columnDefs = [
  gb.text('icamCompanyCode', 70, '회사코드'),
  gb.date('icamDate', 100, '생성일'),
  gb.text('fundCode', 100, '펀드코드'),
  gb.text('fundName', 300, '펀드명'),
  gb.text('assetCode', 70, '자산구분'),
  gb.text('assetName', 150, '자산명'),
  gb.text('itemCode', 100, '종목코드'),
  gb.text('itemName', 250, '종목명'),
  gb.long('seq', 70, '순번'),
  gb.text('infoCode', 70, '정보코드'),
  gb.text('infoName', 200, '정보명'),
  gb.text('trCode', 70, '거래코드'),
  gb.text('trName', 200, '거래명'),
  gb.date('tgtDate', 100, '예정일자'),
  gb.double('tgtAmt', 120, '예정금액'),
  gb.date('tgtStdDate', 100, '자료기준일'),
  gb.text('note', 500, '비고'),
  gb.text('createDateString', 150, '작업일시'),
  gb.text('creater', 100, '작업자'),
  gb.long('icsClassTreeId', 80, '내부통제ID'),
  gb.long('icsDeadlineId', 80, '내부통제-기한ID'),
  gb.text('confirmYn', 80, '확인여부'),
  gb.long('confirmPersonId', 80, '확인자ID'),
];

// [E0] 화면 열림 (생성자 L96-309): 기준일·시작일·종료일 오늘, 연도 칸 폭 100, 체크박스 "기간조건 제외". 열 때 조회하지 않는다
export const Icam99_Tab_Test: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcamData>>(null);
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [year, setYear] = useState('');
  const [rows, setRows] = useState<IcamData[]>([]);
  const [loading, setLoading] = useState(false);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L548-550) */
  const selectFirst = useRef(false);

  // [E1] retrieveButton[조회].Select (L111) → retrieve() L538-553
  const retrieve = useCallback(async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const data = await icamApi.searchIcamData();
      selectFirst.current = true;
      setRows(data);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // batch(actionNo) L343-479: BatchMain?actionCode=…&worker=…&stdDate=… 를 숨은 폼으로 제출 — 서버에 연동이 없으면 거절 메시지
  const batch = async (actionCode: string) => {
    const req: IcamTestBatchReq = { actionCode };
    if (['icamItem', 'icamBook', 'icamPrice', 'icamIpo', 'extrFundHoldItem'].includes(actionCode)) req.stdDate = stdDate.format(FORMAT);
    if (actionCode === 'icamFundBook') {
      req.startDate = startDate.format(FORMAT);
      req.closeDate = closeDate.format(FORMAT);
    }
    if (actionCode === 'filemissing') req.year = year;
    if (actionCode === 'sendExpenseRequest') message.info('test!!');   // L471
    try {
      await icamApi.runTestBatch(req);
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E5] batchButton4 (L135) → batch("4") */}
          <Button type="download" onClick={() => batch('icamItem')}>ICAM 종목정보 가져오기</Button>
          {/* [E6] batchButton5 (L141) → batch("5") */}
          <Button type="download" onClick={() => batch('icamBook')}>ICAM 원장 가져오기(fnd10)</Button>
          {/* [E8] batchButton7 (L153) → batch("7") */}
          <Button type="download" onClick={() => batch('icamPrice')}>ICAM 시세가져오기</Button>
          {/* [E12] batchButton11 (L177) → batch("11") */}
          <Button type="download" onClick={() => batch('crawlingIpo')}>공모주38</Button>
          {/* [E15] batchButton14 (L195) → batch("14") */}
          <Button type="download" onClick={() => batch('scrapingIpo')}>IPOStock</Button>
          {/* [E14] batchButton13 (L189) → batch("13") */}
          <Button type="generate" onClick={() => batch('ipoMismatch')}>공모주 미일치생성</Button>
          {/* [E13] batchButton12 (L183) → batch("12") */}
          <Button type="send" onClick={() => batch('alarm')}>알람실행</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          {/* [E9] batchButton8 (L159) → batch("8") */}
          <Button type="download" onClick={() => batch('icamFundBook')}>ICAM 펀드원장 가져오기</Button>
          {/* [E10] batchButton9 (L165) → batch("9") */}
          <Button type="download" onClick={() => batch('icamIpo')}>ICAM 공모주청약정보 가져오기</Button>
          {/* [E16] batchButton15 (L201) → batch("15") */}
          <Button type="save" onClick={() => batch('changedItemName')}>종목명 변경 반영</Button>
          {/* [E17] batchButton16 (L207) → batch("16") */}
          <Button type="download" onClick={() => batch('icamTodayListItem')}>당일상장주식Get</Button>
          {/* [E18] batchButton17 (L213) → batch("17") */}
          <Button type="download" onClick={() => batch('icamAdvice')}>일임계좌Get</Button>
          {/* [E21] batchButton99[test] (L231) → batch("test") */}
          <Button type="primary" onClick={() => batch('sendExpenseRequest')}>test</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Input style={{ width: 100 }} value={year} onChange={e => setYear(e.target.value)} />
          {/* [E19] batchButton18 (L219) → batch("18") */}
          <Button type="search" onClick={() => batch('filemissing')}>소실파일</Button>
          {/* [E20] batchButton19 (L225) → batch("19") */}
          <Button type="download" onClick={() => batch('extrFundHoldItem')}>타사무관리펀드 보유종목Get(ifi34=&gt;flt09)</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcamData>
            gridRef={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            getRowId={p => String(p.data.dataId)}
            onRowDataUpdated={e => {
              if (selectFirst.current) {
                selectFirst.current = false;
                e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
              }
            }}
          />
        </div>
      </div>
      {/* South (L273-290, L308): 원본에도 이 버튼들에는 핸들러가 없다 — 눌러도 아무 일 없음 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', padding: 8, border: '1px solid #d9d9d9' }}>
        <Button type="cancel">시작취소</Button>
        <Button type="save">확정</Button>
        <Button type="delete">삭제</Button>
        <Button type="cancel">취소</Button>
        <Button type="register">신청</Button>
        <Button type="cancel">신청취소</Button>
        <Button type="register">검토요청</Button>
        <Button type="cancel">요청취소</Button>
        <Button type="save">검토진행</Button>
        <Button type="save">검토완료</Button>
        <Button type="cancel">검토취소</Button>
        <Button type="save">점검시작</Button>
        <Button type="save">승인시작</Button>
        <Checkbox>기간조건 제외</Checkbox>
        <Button type="register">인사정보 가져오기</Button>
        <Button type="save">적용</Button>
      </div>
    </div>
  );
};
