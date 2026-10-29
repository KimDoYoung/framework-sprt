/**
 * [1190] 경영관리 > 10. 차량관리 > 공용차량 운행등록 (T14)
 * AS-IS: myApp/client/vi/car/Car04_Tab_PublicJournal.java (416줄) + Car04_Lookup_PublicJournal.java (311줄, 변경 편집창) + Car01_Lookup_Info.java (241줄, 차량 찾기 조회창)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L63-89: 가운데(여백 20, 테두리) = 툴바(기준년월 70 · 차량번호 300 · 조회 · 확정 · 확정취소) + 운행일지 그리드(SingleGrid, 예약 기준)
 * 스타일: SG (견본 Tdm01_Tab_Hr — 바깥 여백 20, 안쪽 padding 10, 툴바-그리드 간격 8)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarInfo, CarPublicJournal } from '@/types/car';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Car01_Lookup_Info } from '@/components/lookup/Car01_Lookup_Info';
import { SearchBar } from '@/components/search';
import { Car04_Lookup_PublicJournal } from './Car04_Lookup_PublicJournal';

const gb = gbFor<CarPublicJournal>();

/** getCarDate() L407-411: 'yyyy.MM' (입력의 '-'는 '.'으로). 읽을 수 없으면 null */
const carDate = (text: string): string | null => {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim().replace(/-/g, '.'));
  return m && +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}.${m[2].padStart(2, '0')}` : null;
};

export const Car04_Tab_PublicJournal: React.FC = () => {
  // settings() L91-155: 기준년월 70(빈칸 "YYYY.MM", 이달 1일의 yyyy.MM), 차량번호 300(읽기 전용, 빈칸 "전체")
  const [stdMonth, setStdMonth] = useState(() => dayjs().format('YYYY.MM'));
  const [info, setInfo] = useState<{ infoId: number; infoName: string } | null>(null);
  const [rows, setRows] = useState<CarPublicJournal[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookupInfoOpen, setLookupInfoOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CarPublicJournal | null>(null);
  const retrieveSeq = useRef(0);

  // retrieve() L183-202: 기준년월 검사 → car.Car04_Journal.selectByPublicJournal(companyId·personId는 서버) → 조회가 끝나면 첫 행을 고른다
  const retrieve = async (target = info): Promise<CarPublicJournal[] | null> => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return null; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return null; }
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await carApi.searchPublicJournals({ infoId: target?.infoId ?? null, stdMonth: ym });
      if (my !== retrieveSeq.current) return null;
      setRows(list);
      return list;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };

  // [E2] infoName.TriggerClick (L110) → 기준년월 검사 → popup.open("2", stdMonth): 전체(null)면 비우고, 고른 차량이면 값 + retrieve()
  const openLookupInfo = () => {
    if (!stdMonth) { message.warning('해당년월을 먼저 입력해주세요'); return; }
    setLookupInfoOpen(true);
  };
  const selectInfo = (r: CarInfo | null) => {
    setLookupInfoOpen(false);
    if (r == null) { setInfo(null); return; }
    const next = { infoId: r.infoId, infoName: `${r.carNo ?? ''} - ${r.carNm ?? ''}` };
    setInfo(next);
    void retrieve(next);
  };

  /** updateCheck(updateModel) L204-223 + update() L225-239: 주행 전·후 계기판은 null로 → checkBookingId → 일지가 없으면 journalId를 비워 새로 넣는다 → car.Car04_Journal.modelUpdate → retrieve() */
  const updateCheck = async (model: CarPublicJournal) => {
    try {
      const exists = await carApi.checkJournalBooking(model.bookingId as number);
      await carApi.saveJournal({ ...model, beforeMileage: null, afterMileage: null, journalId: exists ? model.journalId : null });
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
    await retrieve();
  };

  // closeCheck(action) L353-380: 그 달 일지를 다시 읽어 첫 행이 마감이면 알리고 조회, 아니면 action
  const closeCheck = async (action: () => void) => {
    const ym = carDate(stdMonth);
    let list: CarPublicJournal[] = [];
    if (ym) {
      try {
        list = await carApi.searchPublicJournals({ infoId: info?.infoId ?? null, stdMonth: ym });
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
    }
    if (list.length > 0 && list[0].closeYn) {
      message.warning('마감 처리된 보고입니다. 수정이 불가합니다.');
      await retrieve();
    } else {
      action();
    }
  };

  // editData() L382-405 (actionCell 변경 아이콘 → closeCheck(() -> editData())): 마감이면 알리고, 확정이면 알리고, 아니면 편집창 → updateCheck()
  const editData = (row: CarPublicJournal) => {
    if (row.closeYn) { message.warning('담당자가 마감처리한 운행일지입니다. 담당부서에 문의하세요'); return; }
    if (row.fixYn) { message.warning('해당월의 운행일지는 확정이 되어 변경하실 수 없습니다'); return; }
    setEditTarget(row);
  };

  /** confirmAll()·cancelAll() L268-351: 검사 → 내 몫 행 전부 fixYn 바꿔 저장(updateCheck) → 성공 메시지, retrieve() */
  const fixAll = async (fixYn: boolean) => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return; }
    if (rows.some(r => r.closeYn)) {
      message.warning(fixYn ? '해당월의 운행일지는 마감되었습니다. 담당부서에 문의하세요' : '담당자가 마감처리한 운행일지가 포함되어있습니다. 담당부서에 문의하세요');
      return;
    }
    try {
      await carApi.fixPublicJournals({ infoId: info?.infoId ?? null, stdMonth: ym, fixYn });
      message.success(fixYn ? '해당 기준년월의 공용차량 운행일지가 확정되었습니다' : '해당 기준년월의 공용차량 운행일지가 확정취소되었습니다');
      await retrieve();
    } catch (err) {
      message.warning(errorMessage(err, fixYn ? '확정 실패' : '확정취소 실패'));
    }
  };

  // [E4] confirmButton[확정].Select (L141) → closeCheck(), confirmCheck() L241-266: 이미 확정된 행이 있으면 알리고 → 확인창 → [E6] confirmAll()
  const confirmCheck = () => {
    if (rows.some(r => r.fixYn)) { message.warning('이미 확정되었습니다.'); return; }
    Modal.confirm({ title: '확인', content: `${stdMonth}월의 운행 내역을 확정하시겠습니까?`, okText: '예', cancelText: '아니오', width: 400, onOk: () => fixAll(true) });
  };

  // [E5] cancelButton[확정취소].Select (L148) → closeCheck(), cancelCheck() L297-322: 확정 아닌 행이 있으면 알리고 → 확인창 → [E7] cancelAll()
  const cancelCheck = () => {
    if (rows.some(r => !r.fixYn)) { message.warning('이미 취소되었습니다.'); return; }
    Modal.confirm({ title: '확인', content: `${stdMonth}월의 운행확정 내역을 취소하시겠습니까?`, okText: '예', cancelText: '아니오', width: 400, onOk: () => fixAll(false) });
  };

  // buildGrid() L157-181 (setChecked 없음 = 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '사용일자'),  // L168
    gb.text('infoNm', 240, '차량번호/명'),  // L169
    gb.long('mileage', 120, '주행거리<br>(km)'),  // L170 addLongHtml
    gb.long('commuteMileage', 120, '출퇴근<br>사용거리(km)'),  // L171
    gb.long('bizMileage', 120, '일반업무용<br>사용거리(km)'),  // L172
    gb.long('unBizMileage', 120, '비업무용<br>사용거리(km)'),  // L173
    gb.text('destination', 240, '행선지'),  // L174
    gb.text('reason', 240, '목적'),  // L175
    iconCell<CarPublicJournal>('edit', 'actionCell', 80, '변경', row => void closeCheck(() => editData(row))),  // L176 addCell(ImageCell("Edit"))
    gb.textCenter('fixYnText', 100, '확정여부', { valueGetter: p => (p.data?.fixYn ? '확정' : ' ') }),  // L177 getFixYnText()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [stdMonth, info]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E0] 화면 열림 (생성자 L63-89) → settings() — 열 때 조회하지 않는다 */}
        {/* [E3] retrieveButton[조회].Select (L135), [E1] stdMonth.KeyPress [Enter] (L99) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={<>
            <Button type="save" onClick={() => closeCheck(confirmCheck)}>확정</Button>
            <Button type="cancel" onClick={() => closeCheck(cancelCheck)}>확정취소</Button>
          </>}
        >
          <SearchBar.Field label="기준년월">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY.MM" value={stdMonth} onChange={e => setStdMonth(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="차량번호">
            <LookupInput width={300} placeholder="전체" value={info?.infoName ?? ''} onOpen={openLookupInfo} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<CarPublicJournal>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.bookingId)}
            loading={loading}
            onRowDataUpdated={e => {
              const node = e.api.getDisplayedRowAtIndex(0);
              if (node) node.setSelected(true);  // 조회 뒤 첫 행 선택(grid.getSelectionModel().select(0, false))
            }}
          />
        </div>
      </div>
      {/* lookupInfo: popup.open("2", stdMonth, cb) — [전체]면 비우고 조회는 하지 않는다 */}
      <Car01_Lookup_Info
        open={lookupInfoOpen}
        carType="2"
        stdMonth={stdMonth}
        allButton
        onResult={selectInfo}
        onClose={() => setLookupInfoOpen(false)}
      />
      <Car04_Lookup_PublicJournal
        target={editTarget}
        onResult={model => { setEditTarget(null); void updateCheck(model); }}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
};
