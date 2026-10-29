/**
 * [1193] 경영관리 > 10. 차량관리 > 차량 운행일지 (T16)
 * AS-IS: myApp/client/vi/car/Car04_Tab_Journal.java (764줄) + Car04_Lookup_PublicJournal(T14)·Car04_Lookup_PrivateJournal(T11) 편집창 + Car01_Lookup_Info(T11) 차량 찾기 + RDViewer.openCar04(출력)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L92-144: 가운데(여백 20, 최대 1000, 테두리) = 툴바(기준년월 70 · 차량구분 100 · 차량번호 300 · 조회 · 마감 · 마감취소 · 출력/다운로드) + 운행일지 그리드(합계 행),
 *   아래 70(여백 -2,20,20,20) = 문서분류 · 결재상태 · [상신] · [문서보기]
 * 1단계: [상신]·[문서보기]·문서분류가 여는 전자결재 편집창 Apr01_Edit_ApprDoc과 상신용 PDF 만들기(PDFCreate.createCarJournal)는 다음 단계 — 결재상태 표시와 "상신 중" 검사는 한다
 * 스타일: SG (견본 Tdm01_Tab_Hr — 바깥 여백 20, 안쪽 padding 10, 툴바-그리드 간격 8)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Input, message, Select, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { CarInfo, CarJournal, CarPublicJournal, CarRelateAppr } from '@/types/car';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Car01_Lookup_Info } from '@/components/lookup/Car01_Lookup_Info';
import { SearchBar } from '@/components/search';
import { Car04_Lookup_PrivateJournal, PrivateJournalTarget } from './Car04_Lookup_PrivateJournal';
import { Car04_Lookup_PublicJournal } from './Car04_Lookup_PublicJournal';

const gb = gbFor<CarJournal>();

/** getCarDate() L751-755: 'yyyy.MM' (입력의 '-'는 '.'으로). 읽을 수 없으면 null */
const carDate = (text: string): string | null => {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim().replace(/-/g, '.'));
  return m && +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}.${m[2].padStart(2, '0')}` : null;
};

const MONTHS = [{ value: '%', label: '전체' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: String(i + 1).padStart(2, '0') }))];

/** RDViewer.openCar04 L199-217: 창 위쪽 년도(40)·월 콤보(60, 기본 전체)·[조회]·[닫기] + RD 보고서(Car04_Rd_Journal). retrieveCar10() L327-359 */
const RdJournalViewer: React.FC<{ infoId: number | null; onClose: () => void }> = ({ infoId, onClose }) => {
  const [year, setYear] = useState(() => dayjs().format('YYYY'));
  const [month, setMonth] = useState('%');
  const [url, setUrl] = useState<string | null>(null);

  const retrieve = async (y = year, m = month) => {
    if (infoId == null) return;
    try {
      const groupId = await carApi.rdPrintJournal({ infoId, year: y, month: m });
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Car04_Rd_Journal', options: '/rhtmlimportopt [2]', rv: { rdGroupId: String(groupId) } });
      setUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  return (
    <LookupModal
      open={infoId != null}
      title="차량 운행일지"
      width="90vw"
      style={{ top: 20 }}
      maskClosable={false}
      destroyOnHidden
      afterOpenChange={open => { if (open) void retrieve(); else setUrl(null); }}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <Space style={{ marginBottom: 8 }}>
        <Input style={{ width: 70 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
        <Select style={{ width: 80 }} value={month} options={MONTHS} onChange={setMonth} />
        <Button type="search" onClick={() => retrieve()}>조회</Button>
      </Space>
      {url && <iframe title="RD" src={url} style={{ width: '100%', height: '70vh', border: '1px solid #d9d9d9' }} />}
    </LookupModal>
  );
};

export const Car04_Tab_Journal: React.FC = () => {
  const gridRef = useRef<AgGridReact<CarJournal>>(null);
  // settings() L146-301: 기준년월 70(빈칸 "YYYY.MM", 이달 1일의 yyyy.MM), 차량구분 100(CarTypeCode, 처음 "선택"), 차량번호 300(읽기 전용, 빈칸 "차량정보를 선택해주세요")
  const [stdMonth, setStdMonth] = useState(() => dayjs().format('YYYY.MM'));
  const [carType, setCarType] = useState<string | null>(null);
  const [info, setInfo] = useState<{ infoId: number; infoName: string } | null>(null);
  const [rows, setRows] = useState<CarJournal[]>([]);
  const [loading, setLoading] = useState(false);
  const [appr, setAppr] = useState<CarRelateAppr | null>(null);
  const [lookupInfoOpen, setLookupInfoOpen] = useState(false);
  const [privateTarget, setPrivateTarget] = useState<PrivateJournalTarget | null>(null);
  const [publicTarget, setPublicTarget] = useState<CarPublicJournal | null>(null);
  const [rdInfoId, setRdInfoId] = useState<number | null>(null);
  const retrieveSeq = useRef(0);

  /** 검사 3개 (retrieve() L333-346): 기준년월 → 차량구분 → 차량번호 */
  const check = (target = info): { ym: string; infoId: number } | null => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return null; }
    if (carType == null) { message.warning('차량구분을 선택해주세요'); return null; }
    if (target == null) { message.warning('차량번호를 선택해주세요'); return null; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return null; }
    return { ym, infoId: target.infoId };
  };

  // retrieveApprStatus() L374-420: car.Car05_RelateAppr.selectByStdMonth — 없으면 "미상신"(00)
  const retrieveApprStatus = async (infoId: number, ym: string) => {
    try {
      setAppr(await carApi.getJournalApprStatus({ infoId, stdMonth: ym }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E1] stdMonth Enter · [E3] infoName 선택 · [E4] [조회] → retrieve() L332-372: car.Car04_Journal.selectByJournal → 결재상태 조회
  const retrieve = async (target = info): Promise<CarJournal[] | null> => {
    const c = check(target);
    if (!c) return null;
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await carApi.searchMonthJournals({ infoId: c.infoId, stdMonth: c.ym });
      if (my !== retrieveSeq.current) return null;
      setRows(list);
      void retrieveApprStatus(c.infoId, c.ym);
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };

  // [E3] infoName.TriggerClick (L174) → 차량구분 검사 → Car01_Lookup_Info.openAll(carType): 고른 차량이면 값 + retrieve(), null이면 비운다
  const openLookupInfo = () => {
    if (carType == null) { message.warning('차량구분을 선택해주세요'); return; }
    setLookupInfoOpen(true);
  };
  const selectInfo = (r: CarInfo | null) => {
    setLookupInfoOpen(false);
    if (r == null) { setInfo(null); return; }
    const next = { infoId: r.infoId, infoName: `${r.carNo ?? ''} - ${r.carNm ?? ''}` };
    setInfo(next);
    void retrieve(next);
  };

  // [E2] carTypeName[CarTypeCode].Collapse (L164) → 차량번호 비우기
  const changeCarType = (code: string | undefined) => {
    setCarType(code ?? null);
    setInfo(null);
  };

  // modelUpdate() L440-454: 주행 전·후 계기판 null → car.Car04_Journal.modelUpdate → retrieve()
  const modelUpdate = async (model: CarJournal) => {
    try {
      await carApi.saveJournal({ ...model, beforeMileage: null, afterMileage: null });
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
    await retrieve();
  };

  // editData() L718-749: 마감이면 알리고, 전용(1)이면 전용 편집창, 공용(2)이면 공용 편집창 → modelUpdate()
  const editData = (row: CarJournal) => {
    if (row.closeYn) { message.warning('해당월의 운행일지는 마감이 되어 변경하실 수 없습니다'); return; }
    if (carType === '1') setPrivateTarget({ mode: 'edit', row });
    else setPublicTarget(row);
  };

  // fixCheck(action) L689-716: 그 달 일지를 다시 읽어 첫 행이 확정이 아니면 "확정 취소된 보고입니다. 다시 확인해주세요." 후 조회, 아니면 action
  const fixCheck = async (action: () => void) => {
    const c = check();
    if (!c) return;
    let list: CarJournal[] = [];
    try {
      list = await carApi.searchMonthJournals({ infoId: c.infoId, stdMonth: c.ym });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    if (list.length > 0 && list[0].fixYn) action();
    else { message.warning('확정 취소된 보고입니다. 다시 확인해주세요.'); await retrieve(); }
  };

  const BLOCK_STATUS = ['10', '20', '30'];

  /** updateCheck(action) L456-527 → update(action) L529-566: 검사 뒤 car.Car04_Journal.getBefore/AfterCloseYn(서버) → 전체 마감·마감취소 → 성공 메시지, retrieve() */
  const updateCheck = async (close: boolean) => {
    for (const r of rows) {
      if (r.closeYn == null) continue;
      if (r.closeYn && close) { message.warning('이미 마감되었습니다.'); return; }
      if (!r.closeYn && !close) { message.warning('이미 취소되었습니다.'); return; }
    }
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return; }
    if (info == null) { message.warning('차량번호를 선택해주세요'); return; }
    if (close) {
      for (const r of rows) {
        if (r.mileage == null || r.mileage === 0) { message.warning('주행거리가 미입력된 운행일지가 포함되어있습니다'); return; }
        if (!r.fixYn) { message.warning('확정처리가 되지않은 운행일지가 포함되어있습니다'); return; }
      }
    } else if (BLOCK_STATUS.includes(appr?.statusCode ?? '')) {
      message.warning('상신 중인 차량 운행일지입니다. 상신 취소 후 마감취소가 가능합니다');
      return;
    }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return; }
    try {
      await carApi.closeJournals({ infoId: info.infoId, stdMonth: ym, closeYn: close });
      message.success(`해당 기준년월의 '${info.infoName}' 운행일지가 ${close ? '마감' : '마감취소'}되었습니다`);
      await retrieve();
    } catch (err) {
      message.warning(errorMessage(err, close ? '마감 실패' : '마감취소 실패'));
    }
  };

  // [E5] confirmButton[마감].Select (L207) · [E6] cancleButton[마감취소].Select (L214) → fixCheck(() -> updateCheck(…))
  const closeAction = (close: boolean) => fixCheck(() => { void updateCheck(close); });

  // [E10] rdButton[출력/다운로드].Select (L259): 기준년월·차량구분·차량번호 검사 → RDViewer.openCar04(mrd Car04_Rd_Journal, 년도·월 선택) — insertRdCarJournal
  const openRd = () => {
    const c = check();
    if (c) setRdInfoId(c.infoId);
  };

  // [E7] classTreeFullName[문서분류].TriggerClick (L222) → openLookupDoc() / [E8] apprButton[상신].Select (L228) → insertApprCheck() /
  // [E9] apprViewButton[문서보기].Select (L234) → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(): 전자결재 편집창 Apr01_Edit_ApprDoc과 상신용 PDF 만들기는 다음 단계
  const apprStatusText = appr?.apprId != null ? (appr.statusName ?? '') : '미상신';

  // buildGrid() L303-330 (setChecked 없음 = 단일 선택, getSumGrid("합계", 6, 8, 11))
  const columnDefs = useMemo(() => [
    gb.textCenter('closeYnText', 80, '마감여부', { valueGetter: p => (p.data?.closeYn ? '마감' : ' ') }),  // L315
    iconCell<CarJournal>('edit', 'actionCell', 60, '변경', editData),  // L316 addCell(ImageCell("Edit"))
    gb.date('date', 100, '사용일자'),  // L317
    gb.textCenter('infoPersonNm', 100, '사용자'),  // L318
    gb.textCenter('fixYnText', 80, '사용자<br>확정여부', { valueGetter: p => (p.data?.fixYn ? '확정' : ' ') }),  // L319 addTextCenterHtml
    gb.long('beforeMileage', 120, '주행전<br>계기판(km)'),  // L320
    gb.long('afterMileage', 120, '주행후<br>계기판(km)'),  // L321
    gb.long('mileage', 120, '주행거리<br>(km)'),  // L322
    gb.long('commuteMileage', 120, '출퇴근<br>사용거리(km)', { hide: carType !== '1' }),  // L323 (전용만, L359-367)
    gb.long('bizMileage', 120, '일반업무용<br>사용거리(km)', { hide: carType !== '1' }),  // L324
    gb.long('unBizMileage', 120, '비업무용<br>사용거리(km)', { hide: carType !== '1' }),  // L325
    gb.text('destination', 240, '행선지'),  // L326
    gb.text('reason', 240, '목적'),  // L327
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [carType]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1, minHeight: 0, padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E0] 화면 열림 (생성자 L92-144) → settings(), defaultName() — 열 때 조회하지 않는다 */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={<>
            <Button type="save" onClick={() => closeAction(true)}>마감</Button>
            <Button type="cancel" onClick={() => closeAction(false)}>마감취소</Button>
            <Button type="download" onClick={openRd}>출력/다운로드</Button>
          </>}
        >
          <SearchBar.Field label="기준년월">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY.MM" value={stdMonth} onChange={e => setStdMonth(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="차량구분">
            <SystemCodeComboBox kindCd="CarTypeCode" style={{ width: 100 }} placeholder="선택" value={carType ?? undefined} onChange={changeCarType} />
          </SearchBar.Field>
          <SearchBar.Field label="차량번호">
            <LookupInput width={300} placeholder="차량정보를 선택해주세요" value={info?.infoName ?? ''} onOpen={openLookupInfo} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<CarJournal>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.journalId)}
            loading={loading}
            sumRow={{ labelField: 'beforeMileage', label: '합계', sum: ['mileage', 'commuteMileage', 'bizMileage', 'unBizMileage'] }}
          />
        </div>
      </div>
      {/* 아래 70: 결재상태(읽기 전용, 빈칸 "결재상태 정보없음") — 문서분류·[상신]·[문서보기]는 다음 단계 */}
      <div style={{ height: 70, flexShrink: 0, boxSizing: 'border-box', border: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
        <label>결재상태</label>
        <Input style={{ width: 150 }} disabled readOnly placeholder="결재상태 정보없음" value={appr == null && rows.length === 0 ? '' : apprStatusText} />
      </div>
      {/* openAll(carType): 사용자 조건 없이 그 구분의 차량 전부 */}
      <Car01_Lookup_Info open={lookupInfoOpen} carType={(carType ?? '1') as '1' | '2'} admin onResult={selectInfo} onClose={() => setLookupInfoOpen(false)} />
      <Car04_Lookup_PrivateJournal target={privateTarget} onResult={m => { setPrivateTarget(null); void modelUpdate(m); }} onClose={() => setPrivateTarget(null)} />
      <Car04_Lookup_PublicJournal target={publicTarget} onResult={m => { setPublicTarget(null); void modelUpdate(m); }} onClose={() => setPublicTarget(null)} />
      <RdJournalViewer infoId={rdInfoId} onClose={() => setRdInfoId(null)} />
    </div>
  );
};
