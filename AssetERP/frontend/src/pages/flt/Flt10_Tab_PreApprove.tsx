/**
 * 사전승인 (J02) — 준법감시 > 11. 임직원매매(준감인) > 사전승인 #1128
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_PreApprove.java(780줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L100-176: vlc = 툴바 2줄(1줄: 조회기간 · 승인구분 · 신고자 · 검색 · [조회] · 미승인건만 보기 / 오른쪽 [알림수신인 설정],
 *   2줄: [승인][반려][취소][협의승인자 지정] [펀드보유종목 확인][일괄 알림발송] + 안내 글) / "▶ 매 수" + 매수 그리드(체크 다중) / "▶ 매 도" + 매도 그리드(체크 다중)
 * 열릴 때(E0)는 조회하지 않는다 — settings()가 조회기간·설정만 채운다
 * 협의승인(회사 설정 sys01_flt_add_confirm_yn): 켜져 있을 때만 [협의승인자 지정] 버튼과 승인자·승인상태 열을 보인다(setInitData L693-742)
 * 1단계에서 뺀 것: 알림수신인 설정(Emp93_Lookup_SmsNoticeTarget)·펀드보유종목 확인(Fnd10_Lookup_RelateFund)은 다른 도메인 조회창 → 안내 메시지(다음 단계)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Select } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltPreApprove } from '@/types/flt';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Flt10_Lookup_RejectReasonWrite, RejectReasonTarget } from './Flt10_Lookup_RejectReasonWrite';

const gb = gbFor<FltPreApprove>();
const DATE_FORMAT = 'YYYY-MM-DD';
const APPR_ITEMS = ['전체', '승인', '미승인'];

/** 원본 `addTextLongHtml`·`addTextHtmlCenter` — 값의 HTML(빨간 굵은 글씨)을 보여 주고 오른쪽/가운데 맞춘다 */
const htmlRight = { textAlign: 'right', color: '#404040' } as const;
const htmlCenter = { textAlign: 'center' } as const;

/** buildBuyGrid() L388-428 — 열 인덱스(행번호 0, 체크 1): 승인여부 15, 승인상태 17 */
const buildBuyGrid = (hideInvestLimit: boolean, addConfirm: boolean) => [
  gb.textCenter('personName', 80, '신고자'),
  gb.date('regDate', 90, '매수신고일'),
  gb.date('expectTrDate', 90, '매수유효일'),
  gb.text('itemTypeName', 150, '종목유형'),
  gb.text('itemName', 200, '종목명'),
  gb.double('expectTrQty', 80, '매수수량'),
  gb.long('expectTrAmt', 110, '매수금액'),
  gb.long('yearInvestLimitEmp', 110, '연간투자금액<br>(개인한도)', { hide: hideInvestLimit }),
  gb.textHtml('yearInvestLimitStr', 110, '연간투자금액', { cellStyle: htmlRight }),
  gb.textHtml('totalInvestAmtStr', 110, '총누적투자금액', { cellStyle: htmlRight }),
  gb.textHtml('turnoverRateStr', 100, '월매매회전율<br>(%)', { cellStyle: htmlRight }),
  gb.textCenter('checkBuyLockup', 80, '매수제한'),
  gb.textCenter('checkFundHold', 80, '펀드<br>보유종목'),
  gb.textHtml('statusName', 80, '승인여부', { cellStyle: { ...htmlCenter, cursor: 'pointer' } }),
  // addHeaderGroupMap(new HeaderGroupMap(0, 16, new HeaderGroupConfig("협의승인", 1, 2)))
  gb.group('협의승인', [
    gb.textCenter('addConfirmerName', 100, '승인자', { hide: !addConfirm }),
    gb.textCenter('addStatusName', 80, '승인상태', { hide: !addConfirm, cellStyle: { textAlign: 'center', cursor: 'pointer' } }),
  ]),
  gb.booleanYn('confirmSmsYn', 80, '알림발송'),
];

/** buildSellGrid() L430-470 — 승인여부 11, 승인상태 13 */
const buildSellGrid = (addConfirm: boolean) => [
  gb.textCenter('personName', 80, '신고자'),
  gb.date('regDate', 90, '매도신고일'),
  gb.date('expectTrDate', 90, '매도유효일'),
  gb.text('itemTypeName', 150, '종목유형'),
  gb.text('itemName', 200, '종목명'),
  gb.textHtml('bookDays', 100, '보유기간', { cellStyle: htmlCenter }),
  gb.textCenter('checkFundHold', 80, '펀드<br>보유종목'),
  gb.double('expectTrQty', 80, '매도수량'),
  gb.long('expectTrAmt', 110, '매도금액'),
  gb.textHtml('statusName', 80, '승인여부', { cellStyle: { ...htmlCenter, cursor: 'pointer' } }),
  gb.group('협의승인', [
    gb.textCenter('addConfirmerName', 100, '승인자', { hide: !addConfirm }),
    gb.textCenter('addStatusName', 80, '승인상태', { hide: !addConfirm, cellStyle: { textAlign: 'center', cursor: 'pointer' } }),
  ]),
  gb.booleanYn('confirmSmsYn', 80, '알림발송'),
];

/** NoticeMessage.show(제목, 글) */
const showNotice = (title: string, text: string | null) =>
  Modal.info({ title, content: <div style={{ whiteSpace: 'pre-wrap' }}>{text ?? ''}</div>, width: 500 });

const sectionLabel: React.CSSProperties = { fontSize: 14, fontWeight: 'bold' };

export const Flt10_Tab_PreApprove: React.FC = () => {
  // setInitData() L693-742: 조회기간 = 이번 달 1일의 한 달 전 ~ 이번 달 1일의 두 달 뒤 하루 전
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month').subtract(1, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().startOf('month').add(2, 'month').subtract(1, 'day'));
  const [apprName, setApprName] = useState('전체');
  const [empName, setEmpName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [noLimitYn, setNoLimitYn] = useState(false);
  const [investLimitUnvisible, setInvestLimitUnvisible] = useState(false);
  const [addConfirmYn, setAddConfirmYn] = useState(false);
  const [buyRows, setBuyRows] = useState<FltPreApprove[]>([]);
  const [sellRows, setSellRows] = useState<FltPreApprove[]>([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [confirmerOpen, setConfirmerOpen] = useState(false);
  const [reasonTarget, setReasonTarget] = useState<RejectReasonTarget | null>(null);
  const buyGridRef = useRef<AgGridReact<FltPreApprove>>(null);
  const sellGridRef = useRef<AgGridReact<FltPreApprove>>(null);
  const buyChecked = useRef<FltPreApprove[]>([]);
  const sellChecked = useRef<FltPreApprove[]>([]);
  const reasonCallback = useRef<{ statusCode?: string; row?: FltPreApprove; trType?: 'BUY' | 'SELL' }>({});
  const paramRef = useRef({ startDate, closeDate, apprName, personId, searchText, noLimitYn });
  paramRef.current = { startDate, closeDate, apprName, personId, searchText, noLimitYn };

  // [E0] 화면 열림 (생성자 L100-176) → settings() → setInitData(): 기준관리의 투자한도 숨김 · 협의승인 회사 여부
  useEffect(() => {
    fltApi.getPreApproveSetting(closeDate.format(DATE_FORMAT))
      .then(s => { setInvestLimitUnvisible(s.investLimitUnvisibleYn); setAddConfirmYn(s.addConfirmYn); })
      .catch(err => message.error(errorMessage(err, '설정 조회 실패')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retrieve() L472-527: 매수('10I')·매도('20O') 두 그리드를 각각 flt.Flt10_Tr.selectByCompanyId로
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    const apprYn = p.apprName === '승인' ? 'true' : p.apprName === '미승인' ? 'false' : '%';
    const params = {
      personId: p.personId, apprYn, startDate: p.startDate.format(DATE_FORMAT), closeDate: p.closeDate.format(DATE_FORMAT),
      searchText: p.searchText, noLimitYn: p.noLimitYn,
    };
    buyGridRef.current?.api?.deselectAll();
    sellGridRef.current?.api?.deselectAll();
    setBuyLoading(true);
    setSellLoading(true);
    await Promise.all([
      fltApi.searchPreApproves({ ...params, trType: '10I' }).then(setBuyRows)
        .catch(err => message.error(errorMessage(err, '조회 실패'))).finally(() => setBuyLoading(false)),
      fltApi.searchPreApproves({ ...params, trType: '20O' }).then(setSellRows)
        .catch(err => message.error(errorMessage(err, '조회 실패'))).finally(() => setSellLoading(false)),
    ]);
  }, []);

  // [E3] empKorName.Change (L229): 칸이 비면 personId = null. 칸이 읽기 전용(setEditable(false))이라 글자를 지울 수 없고,
  // 비우는 길은 x(onClear)뿐이라 거기서 같은 일(이름 비움 · personId null)을 한다
  // [E1] confirmYnBox.ValueChange (L187): 켜면 조회기간·승인구분·신고자를 막는다
  const lockFilters = noLimitYn;

  // [E2] empKorName.TriggerClick (L215) → Emp00_Lookup_SelectSingle.open(오늘, "One", …) → 이름과 personId
  const onEmpResult = (emp: TransInfo | null) => {
    setEmpOpen(false);
    if (emp == null) return;
    setEmpName(emp.korNm ?? '');
    setPersonId(emp.personId);
  };

  // [E5]·[E6] buyGrid·sellGrid.CellClick (L249·L273): 승인여부 칸 → 신청(10)이면 매매사유, 아니면 사유 수정 창 / 승인상태 칸 → 협의승인 사유
  const onCellClicked = (trType: 'BUY' | 'SELL') => (e: CellClickedEvent<FltPreApprove>) => {
    const row = e.data;
    if (!row) return;
    const field = e.colDef.field;
    if (field === 'statusName') {
      if (row.statusCode === '10') {
        lookupOpenReason(row);  // L671-674 lookupOpenReason
      } else {
        lookupEditReject(trType, row);  // L676-691
      }
    }
    if (field === 'addStatusName' && row.addConfirmerId != null) {
      showNotice('승인 및 반려사유', row.addConfirmReason);
    }
  };

  const lookupOpenReason = (row: FltPreApprove) => showNotice('매매사유', row.trReason);

  const lookupEditReject = (trType: 'BUY' | 'SELL', row: FltPreApprove) => {
    reasonCallback.current = { trType };
    setReasonTarget({ mode: 'edit', row });
  };

  // 사유 수정 창에서 저장한 행으로 그리드 행을 바꾼다 (store.update)
  const onReasonSaved = (row: FltPreApprove) => {
    const apply = (rows: FltPreApprove[]) => rows.map(r => (r.trId === row.trId ? row : r));
    if (reasonCallback.current.trType === 'BUY') setBuyRows(apply);
    else setSellRows(apply);
  };

  const checkedCount = () => buyChecked.current.length + sellChecked.current.length;
  const checkedIds = () => [...buyChecked.current, ...sellChecked.current].map(r => r.trId);

  // updateStatusCode() L644-669: 고른 매수·매도 행들을 한 번에
  const updateStatusCode = async (statusCode: string, rejectReason: string | null) => {
    try {
      await fltApi.updatePreApproveStatus(checkedIds(), statusCode, rejectReason);
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    }
    await retrieve();
  };

  // updateReason() L625-642: 승인·반려 사유 창 → 입력하면 처리, 취소하면 안내
  const updateReason = (statusCode: string) => {
    reasonCallback.current = { statusCode };
    setReasonTarget({ mode: 'open', statusCode });
  };
  const onReasonResult = (reason: string | null) => {
    const statusCode = reasonCallback.current.statusCode;
    if (statusCode == null) return;
    if (reason == null) {
      message.info(statusCode === '20' ? '승인이 취소되었습니다.' : '반려가 취소되었습니다.');
      return;
    }
    void updateStatusCode(statusCode, reason);
  };

  /** 승인·반려·취소 확인창 (HtmlMessageBox, 300폭) → YES면 고른 행 상태 검사 후 run */
  const confirmBox = (title: string, verb: string, invalid: (r: FltPreApprove) => boolean, invalidMsg: string, run: () => void) => {
    Modal.confirm({
      title, content: `${checkedCount()}건의 항목을 ${verb}하시겠습니까?`, width: 300, okText: '예', cancelText: '아니오',
      onOk: () => {
        if ([...buyChecked.current, ...sellChecked.current].some(invalid)) {
          message.warning(invalidMsg);
          return;
        }
        run();
      },
    });
  };

  // [E8] confirmButton[승인].Select (L303) → confirmChk() L529-559 → [E15] YES → updateReason("20")
  const confirmChk = () => confirmBox('승인', '승인', r => r.statusCode !== '10', '승인(반려) 처리된 내역이 존재합니다', () => updateReason('20'));
  // [E9] rejectButton[반려].Select (L309) → rejectChk() L593-623 → [E17] YES → updateReason("30")
  const rejectChk = () => confirmBox('반려', '반려', r => r.statusCode !== '10', '승인(반려) 처리된 내역이 존재합니다', () => updateReason('30'));
  // [E10] cancelButton[취소].Select (L315) → cancelChk() L561-591 → [E16] YES → updateStatusCode("10", null)
  const cancelChk = () => confirmBox('취소', '취소', r => r.statusCode === '10', '승인(반려)전 내역이 존재합니다', () => void updateStatusCode('10', null));

  // [E11] fundStockButton[펀드보유종목 확인].Select (L321) → Fnd10_Lookup_RelateFund.open()
  // [E11 생략] 다른 도메인(펀드) 조회창 — 다음 단계
  const fundStock = () => message.info('펀드보유종목 확인 창(Fnd10_Lookup_RelateFund)은 다음 단계에서 제공됩니다');

  // [E13] noticeButton[알림수신인 설정].Select (L334) → Emp93_Lookup_SmsNoticeTarget.open("B01")
  // [E13 생략] 다른 도메인(사원) 조회창 — 다음 단계
  const noticeTarget = () => message.info('알림수신인 설정 창(Emp93_Lookup_SmsNoticeTarget)은 다음 단계에서 제공됩니다');

  // [E12] sendMessageButton[일괄 알림발송].Select (L328) → sendMessage() L371-386
  const sendMessage = async () => {
    try {
      const msg = await fltApi.sendPreApproveMessage();
      message.info(msg);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '발송 실패'));
    }
  };

  // [E14] addConfirmerButton[협의승인자 지정].Select (L341) → 이미 협의승인자가 처리한 건 검사 → updateAddConfirmer(list) L744-768
  const addConfirmer = () => {
    const list = [...buyChecked.current, ...sellChecked.current];
    if (list.some(r => r.addConfirmDatetime != null)) {
      message.warning('협의승인자가 승인 또는 반려한 신고내역은 변경할 수 없습니다');
      return;
    }
    if (list.length === 0) {
      message.warning('선택된 신고내역이 없습니다');
      return;
    }
    setConfirmerOpen(true);
  };
  const onConfirmerResult = async (emp: TransInfo | null) => {
    setConfirmerOpen(false);
    try {
      await fltApi.updatePreApproveConfirmer(checkedIds(), emp == null ? null : emp.personId);
    } catch (err) {
      message.error(errorMessage(err, '지정 실패'));
    }
    await retrieve();
  };

  const buyColumns = useMemo(() => buildBuyGrid(investLimitUnvisible, addConfirmYn), [investLimitUnvisible, addConfirmYn]);
  const sellColumns = useMemo(() => buildSellGrid(addConfirmYn), [addConfirmYn]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          {/* [E7] retrieveButton[조회].Select (L297) → retrieve(). [E4] searchText.KeyPress [Enter] (L240) → retrieve() — SearchBar.Input이 Enter=조회 */}
          <SearchBar
            onSearch={() => retrieve()}
            extra={
              <Checkbox checked={noLimitYn} onChange={e => setNoLimitYn(e.target.checked)}>
                <span style={{ color: '#404040' }}>미승인건만 보기(조회기간 제한없음)</span>
              </Checkbox>
            }
          >
            <SearchBar.Field label="조회기간">
              <DatePicker style={{ width: 130 }} allowClear={false} disabled={lockFilters} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
              <span style={{ margin: '0 4px' }}>~</span>
              <DatePicker style={{ width: 130 }} allowClear={false} disabled={lockFilters} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
            </SearchBar.Field>
            <SearchBar.Field label="승인구분">
              <Select style={{ width: 90 }} disabled={lockFilters} value={apprName} onChange={setApprName} options={APPR_ITEMS.map(v => ({ value: v, label: v }))} />
            </SearchBar.Field>
            <SearchBar.Field label="신고자">
              <LookupInput width={110} value={empName} placeholder="전체" disabled={lockFilters} onOpen={() => setEmpOpen(true)}
                onClear={() => { setEmpName(''); setPersonId(null); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 221 }} placeholder="신고자/종목유형/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <Button type="assign" onClick={noticeTarget}>알림수신인 설정</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button type="save" onClick={confirmChk}>승인</Button>
          <Button type="cancel" onClick={rejectChk}>반려</Button>
          <Button type="cancel" onClick={cancelChk}>취소</Button>
          {addConfirmYn && <Button type="assign" onClick={addConfirmer}>협의승인자 지정</Button>}
          <Button type="view" onClick={fundStock}>펀드보유종목 확인</Button>
          <Button type="send" onClick={sendMessage}>일괄 알림발송</Button>
          <span style={{ fontSize: 12, color: '#456EA6', fontWeight: 'bold' }}>&nbsp;* 승인여부 클릭하여 매매사유 확인 및 승인/반려사유를 수정 할 수 있습니다.</span>
        </div>
        <div style={sectionLabel}>▶ 매 수</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltPreApprove>
            gridRef={buyGridRef}
            rowData={buyRows}
            columnDefs={buyColumns}
            loading={buyLoading}
            getRowId={p => String(p.data.trId)}
            onCheckedChange={rows => { buyChecked.current = rows; }}
            onCellClicked={onCellClicked('BUY')}
            sumRow={{ labelField: 'personName', label: '계', sum: ['expectTrQty', 'expectTrAmt'] }}
          />
        </div>
        <div style={sectionLabel}>▶ 매 도</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltPreApprove>
            gridRef={sellGridRef}
            rowData={sellRows}
            columnDefs={sellColumns}
            loading={sellLoading}
            getRowId={p => String(p.data.trId)}
            onCheckedChange={rows => { sellChecked.current = rows; }}
            onCellClicked={onCellClicked('SELL')}
            sumRow={{ labelField: 'personName', label: '계', sum: ['expectTrQty', 'expectTrAmt'] }}
          />
        </div>
      </div>
      {/* noneLabel=null: callback만 받는 open(오늘, "One", …)에는 [전체]가 없다 */}
      <Emp00_Lookup_SelectSingle open={empOpen} noneLabel={null} transDate={dayjs().format(DATE_FORMAT)} onResult={onEmpResult} onClose={() => setEmpOpen(false)} />
      <Emp00_Lookup_SelectSingle open={confirmerOpen} separateAddTitle noneLabel="선택안함" transDate={dayjs().format(DATE_FORMAT)}
        onResult={onConfirmerResult} onClose={() => setConfirmerOpen(false)} />
      <Flt10_Lookup_RejectReasonWrite target={reasonTarget} onResult={onReasonResult} onSaved={onReasonSaved} onClose={() => setReasonTarget(null)} />
    </div>
  );
};
