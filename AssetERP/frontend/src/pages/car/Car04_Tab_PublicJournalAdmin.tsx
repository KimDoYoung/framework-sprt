/**
 * [1192] 경영관리 > 10. 차량관리 > 공용차량 운행변경(경영관리팀) (T15)
 * AS-IS: myApp/client/vi/car/Car04_Tab_PublicJournalAdmin.java (505줄) + Car04_Lookup_PublicJournalAdmin.java (475줄, 등록창) + Car04_Edit_PublicJournalAdmin.java (385줄, 변경창)
 *   + Car01_Lookup_Info.java (T11 차량 찾기, openAdmin) + components/lookup/Emp00_Lookup_SelectSingle (창 안 사용자 선택) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L68-100: 가운데(여백 20, 최대 1000, 테두리) = 툴바(기준년월 70 · 차량번호 250 · 검색 300 · 조회 · 등록 · 삭제 · 확정 · 확정취소) + 운행일지 그리드(체크 다중)
 * 스타일: SGP (견본 Chk02_Tab_DailyList — 바깥 여백 20, 세로 flex gap 8, 편집 팝업 `*_Edit_*`)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건 3개이지만 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarInfo, CarPublicAdminJournal } from '@/types/car';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Car01_Lookup_Info } from '@/components/lookup/Car01_Lookup_Info';
import { SearchBar } from '@/components/search';
import { Car04_Edit_PublicJournalAdmin } from './Car04_Edit_PublicJournalAdmin';
import { Car04_Lookup_PublicJournalAdmin } from './Car04_Lookup_PublicJournalAdmin';

const gb = gbFor<CarPublicAdminJournal>();

/** getCarDate() L496-500: 'yyyy.MM' (입력의 '-'는 '.'으로). 읽을 수 없으면 null */
const carDate = (text: string): string | null => {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim().replace(/-/g, '.'));
  return m && +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}.${m[2].padStart(2, '0')}` : null;
};

export const Car04_Tab_PublicJournalAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<CarPublicAdminJournal>>(null);
  // settings() L102-185: 기준년월 70(빈칸 "YYYY.MM", 이달 1일의 yyyy.MM), 차량번호 250(읽기 전용, 빈칸 "전체"), 검색 300(빈칸 "요일/사용자/행선지/목적")
  const [stdMonth, setStdMonth] = useState(() => dayjs().format('YYYY.MM'));
  const [info, setInfo] = useState<{ infoId: number; infoName: string } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<CarPublicAdminJournal[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookupInfoOpen, setLookupInfoOpen] = useState(false);
  const [insertInfoId, setInsertInfoId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<CarPublicAdminJournal | null>(null);
  const retrieveSeq = useRef(0);

  // retrieve() L295-315: 기준년월 검사 → car.Car04_Journal.selectByPublicJournalAdmin(companyId는 서버, infoId, stdMonth, searchText) → 조회가 끝나면 첫 행을 고른다
  // [E10] actionCell (ImageCell).callbackOnCreate (L269) → retrieve()
  const retrieve = async (target = info): Promise<void> => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return; }
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await carApi.searchPublicAdminJournals({ infoId: target?.infoId ?? null, stdMonth: ym, searchText });
      if (my === retrieveSeq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };

  // [E2] infoName.TriggerClick (L121) → popup.openAdmin("2") — [전체](null)면 비우고, 고른 차량이면 값 + retrieve()
  const selectInfo = (r: CarInfo | null) => {
    setLookupInfoOpen(false);
    if (r == null) { setInfo(null); return; }
    const next = { infoId: r.infoId, infoName: `${r.carNo ?? ''} - ${r.carNm ?? ''}` };
    setInfo(next);
    void retrieve(next);
  };

  // [E5] insertButton[등록].Select (L157) → insertRow() L187-200: 차량을 안 골랐으면 알리고, 아니면 등록창 → 저장 뒤 retrieve()
  const insertRow = () => {
    if (!info) { message.warning('차량정보를 선택해주세요'); return; }
    setInsertInfoId(info.infoId);
  };

  const checked = () => gridRef.current?.api.getSelectedRows() ?? [];

  // [E6] deleteButton[삭제].Select (L163) → 고른 행이 있을 때만 deleteCheck() L202-229: 확정된 행이 있으면 알리고 → 확인창 "삭제" → [E9] delete() L231-250
  const deleteCheck = () => {
    const selected = checked();
    if (selected.length === 0) return;
    if (selected.some(r => r.fixYn)) { message.warning('확정된 내역은 삭제가 불가능합니다'); return; }
    Modal.confirm({
      title: '삭제',
      content: '선택한 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await carApi.deleteAdminBookings(selected.map(r => r.bookingId as number));
          const gone = new Set(selected.map(r => r.bookingId));
          setRows(prev => prev.filter(r => !gone.has(r.bookingId)));  // GridDeleteData: 지운 행을 목록에서 뺀다
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // closeCheck(action) L466-494: 그 달 일지를 다시 읽어 첫 행이 마감이면 알리고 조회, 아니면 action
  const closeCheck = async (action: () => void) => {
    const ym = carDate(stdMonth);
    let list: CarPublicAdminJournal[] = [];
    if (ym) {
      try {
        list = await carApi.searchPublicAdminJournals({ infoId: info?.infoId ?? null, stdMonth: ym, searchText });
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

  /** confirmAll()·cancelAll() L381-464: 검사 → 보이는 행 전부 fixYn 바꿔 저장(updateCheck) → 성공 메시지, retrieve() */
  const fixAll = async (fixYn: boolean) => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return; }
    if (rows.some(r => r.closeYn)) {
      message.warning(fixYn ? '해당월의 운행일지는 마감되었습니다. 담당부서에 문의하세요' : '담당자가 마감처리한 운행일지가 포함되어있습니다. 담당부서에 문의하세요');
      return;
    }
    try {
      await carApi.fixPublicAdminJournals({ infoId: info?.infoId ?? null, stdMonth: ym, searchText, fixYn });
      message.success(fixYn ? '해당 기준년월의 공용차량 운행일지가 확정되었습니다' : '해당 기준년월의 공용차량 운행일지가 확정취소되었습니다');
      await retrieve();
    } catch (err) {
      message.warning(errorMessage(err, fixYn ? '확정 실패' : '확정취소 실패'));
    }
  };

  // [E7] confirmButton[확정].Select (L171) → closeCheck(), confirmCheck() L354-379: 이미 확정된 행이 있으면 알리고 → 확인창 → [E11] confirmAll()
  const confirmCheck = () => {
    if (rows.some(r => r.fixYn)) { message.warning('이미 확정되었습니다.'); return; }
    Modal.confirm({ title: '확인', content: `${stdMonth}월의 운행 내역을 확정하시겠습니까?`, okText: '예', cancelText: '아니오', width: 400, onOk: () => fixAll(true) });
  };

  // [E8] cancelButton[확정취소].Select (L178) → closeCheck(), cancelCheck() L410-435: 확정 아닌 행이 있으면 알리고 → 확인창 → [E12] cancelAll()
  const cancelCheck = () => {
    if (rows.some(r => !r.fixYn)) { message.warning('이미 취소되었습니다.'); return; }
    Modal.confirm({ title: '확인', content: `${stdMonth}월의 운행확정 내역을 취소하시겠습니까?`, okText: '예', cancelText: '아니오', width: 400, onOk: () => fixAll(false) });
  };

  // buildGrid() L252-293 (setChecked MULTI). actionCell L254-277: 마감이면 알리고, 확정이면 알리고, 아니면 변경창 → retrieve()
  const columnDefs = useMemo(() => [
    gb.text('infoNm', 270, '차량번호/명'),  // L282
    gb.textCenter('datetime', 180, '사용일시'),  // L283
    gb.textHtml('weekName', 80, '요일', { cellStyle: { textAlign: 'center' } }),  // L284 addTextHtmlCenter
    gb.textCenter('personNm', 100, '사용자'),  // L285
    gb.long('mileage', 120, '주행거리<br>(km)'),  // L286 addLongHtml
    gb.text('destination', 270, '행선지'),  // L287
    gb.text('reason', 270, '목적'),  // L288
    iconCell<CarPublicAdminJournal>('edit', 'actionCell', 80, '변경', row => {
      if (row.closeYn) { message.warning('담당자가 마감처리한 운행일지입니다. 담당부서에 문의하세요'); return; }
      if (row.fixYn) { message.warning('해당월의 운행일지는 확정이 되어 변경하실 수 없습니다'); return; }
      setEditTarget(row);
    }),  // L289
    gb.textCenter('fixYnText', 100, '확정여부', { valueGetter: p => (p.data?.fixYn ? '확정' : ' ') }),  // L290 getFixYnText()
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E0] 화면 열림 (생성자 L68-100) → settings() — 열 때 조회하지 않는다 */}
      {/* [E4] retrieveButton[조회].Select (L151), [E1] stdMonth.KeyPress [Enter] (L110), [E3] searchText.KeyPress [Enter] (L143) → retrieve() */}
      <SearchBar
        onSearch={() => void retrieve()}
        loading={loading}
        extra={<>
          <Button type="register" onClick={insertRow}>등록</Button>
          <Button type="delete" onClick={deleteCheck}>삭제</Button>
          <Button type="save" onClick={() => closeCheck(confirmCheck)}>확정</Button>
          <Button type="cancel" onClick={() => closeCheck(cancelCheck)}>확정취소</Button>
        </>}
      >
        <SearchBar.Field label="기준년월">
          <SearchBar.Input style={{ width: 70 }} placeholder="YYYY.MM" value={stdMonth} onChange={e => setStdMonth(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="차량번호">
          <LookupInput width={250} placeholder="전체" value={info?.infoName ?? ''} onOpen={() => setLookupInfoOpen(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="요일/사용자/행선지/목적" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<CarPublicAdminJournal>
          gridRef={gridRef}
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
      {/* settings() L121-140: popup.openAdmin("2", cb) — [전체]면 비우고 조회는 하지 않는다 */}
      <Car01_Lookup_Info open={lookupInfoOpen} carType="2" admin allButton onResult={selectInfo} onClose={() => setLookupInfoOpen(false)} />
      <Car04_Lookup_PublicJournalAdmin infoId={insertInfoId} onDone={() => void retrieve()} onClose={() => setInsertInfoId(null)} />
      <Car04_Edit_PublicJournalAdmin target={editTarget} onDone={() => void retrieve()} onClose={() => setEditTarget(null)} />
    </div>
  );
};
