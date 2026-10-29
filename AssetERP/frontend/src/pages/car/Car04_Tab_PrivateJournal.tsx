/**
 * [1189] 경영관리 > 10. 차량관리 > 전용차량 운행등록 (T11)
 * AS-IS: myApp/client/vi/car/Car04_Tab_PrivateJournal.java (529줄) + Car04_Lookup_PrivateJournal.java (488줄, 등록·변경 편집창) + Car01_Lookup_Info.java (241줄, 차량 찾기 조회창)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L67-95: 가운데(여백 20, 최대 1000, 테두리) = 툴바(기준년월 70 · 차량번호 300 · 조회 · 등록 · 삭제 · 확정 · 확정취소) + 운행일지 그리드(체크 다중)
 * 스타일: SG (견본 Tdm01_Tab_Hr — 바깥 여백 20, 안쪽 padding 10, 툴바-그리드 간격 8)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarInfo, CarJournal } from '@/types/car';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Car01_Lookup_Info } from '@/components/lookup/Car01_Lookup_Info';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Car04_Lookup_PrivateJournal, PrivateJournalTarget } from './Car04_Lookup_PrivateJournal';

const gb = gbFor<CarJournal>();

/** getCarDate() L519-524: 'yyyy.MM' (입력의 '-'는 '.'으로). 읽을 수 없으면 null */
const carDate = (text: string): string | null => {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim().replace(/-/g, '.'));
  return m && +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}.${m[2].padStart(2, '0')}` : null;
};

export const Car04_Tab_PrivateJournal: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<CarJournal>>(null);
  // settings() L97-163: 기준년월 70(빈칸 "YYYY.MM", 이달 1일의 yyyy.MM), 차량번호 300(읽기 전용, 빈칸 "차량정보를 선택해주세요")
  const [stdMonth, setStdMonth] = useState(() => dayjs().format('YYYY.MM'));
  const [info, setInfo] = useState<{ infoId: number; infoName: string } | null>(null);
  const [rows, setRows] = useState<CarJournal[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookupInfoOpen, setLookupInfoOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PrivateJournalTarget | null>(null);
  const retrieveSeq = useRef(0);

  // retrieve() L256-282: 기준년월·차량번호 검사 → car.Car04_Journal.selectByPrivateJournal → 조회가 끝나면 첫 행을 고른다
  const retrieve = async (target = info): Promise<CarJournal[] | null> => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return null; }
    if (!target) { message.warning('차량번호를 선택해주세요'); return null; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return null; }
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await carApi.searchJournals({ infoId: target.infoId, stdMonth: ym });
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

  /** 차량 고름 → infoId·infoName 값, 곧바로 retrieve() */
  const selectInfo = (r: CarInfo) => {
    const next = { infoId: r.infoId, infoName: `${r.carNo ?? ''} - ${r.carNm ?? ''}` };
    setInfo(next);
    void retrieve(next);
  };

  // [E0] 화면 열림 (생성자 L67-95) → settings() → defaultInfoCheck() L165-187: 내 전용차량이 한 대면 그 차량으로 조회, 여러 대면 차량 찾기 창
  useEffect(() => {
    (async () => {
      const ym = carDate(stdMonth);
      if (!ym) return;
      try {
        const list = await carApi.searchLookupInfos({ carType: '1', stdMonth: ym, searchText: '', admin: false });
        if (list.length === 1) selectInfo(list[0]);
        else if (list.length > 1) setLookupInfoOpen(true);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] infoName.TriggerClick (L116) → 기준년월 검사 → lookupInfo() L189-205
  const openLookupInfo = () => {
    if (!stdMonth) { message.warning('해당년월을 먼저 입력해주세요'); return; }
    setLookupInfoOpen(true);
  };

  // [E4] insertButton[등록].Select (L133) → insertRow() L284-300: 차량을 안 골랐으면 알리고, 아니면 편집창(insert) → 확인하면 update()
  const insertRow = () => {
    if (!info) { message.warning('차량정보를 선택해주세요'); return; }
    setEditTarget({ mode: 'insert', infoId: info.infoId, personId: user.userId });
  };

  // update(updateModel) L346-360: 주행 전·후 계기판은 null로 → car.Car04_Journal.modelUpdate → retrieve()
  const update = async (model: CarJournal) => {
    try {
      await carApi.saveJournal(model);
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
    await retrieve();
  };

  // 그리드 변경 아이콘 (actionCell L209-235): 마감이면 알리고, 확정이면 알리고, 아니면 편집창(edit) → update()
  const editRow = (row: CarJournal) => {
    if (row.closeYn) { message.warning('담당자가 마감처리한 운행일지입니다. 담당부서에 문의하세요'); return; }
    if (row.fixYn) { message.warning('해당월의 운행일지는 확정이 되어 변경하실 수 없습니다'); return; }
    setEditTarget({ mode: 'edit', row });
  };

  const checked = () => gridRef.current?.api.getSelectedRows() ?? [];

  // [E5] deleteButton[삭제].Select (L139) → 고른 행이 있을 때만 deleteCheck() L302-329: 확정된 행이 있으면 알리고 → 확인창 "삭제" → [E8] delete() L331-344
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
          await carApi.deleteJournals(selected.map(r => r.journalId as number));
          const gone = new Set(selected.map(r => r.journalId));
          setRows(prev => prev.filter(r => !gone.has(r.journalId)));  // GridDeleteData: 지운 행을 목록에서 뺀다
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // closeCheck(action) L491-517: 그 달 일지를 다시 읽어 첫 행이 마감이면 알리고 조회, 아니면 action
  const closeCheck = async (action: () => void) => {
    let list: CarJournal[] = [];
    const ym = carDate(stdMonth);
    if (info && ym) {
      try {
        list = await carApi.searchJournals({ infoId: info.infoId, stdMonth: ym });
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

  /** confirmAll()·cancelAll() L389-489: 검사 → car.Car04_Journal.update(그 달 전부 fixYn) → 성공 메시지, retrieve() */
  const fixAll = async (fixYn: boolean) => {
    if (!stdMonth) { message.warning('기준년월을 입력해주세요'); return; }
    if (!info) { message.warning('차량번호를 선택해주세요'); return; }
    const ym = carDate(stdMonth);
    if (!ym) { message.warning('기준년월을 입력해주세요'); return; }
    if (rows.some(r => r.closeYn)) {
      message.warning(fixYn ? '해당월의 운행일지는 마감되었습니다. 담당부서에 문의하세요' : '담당자가 마감처리한 운행일지가 포함되어있습니다. 담당부서에 문의하세요');
      return;
    }
    try {
      await carApi.fixJournals({ infoId: info.infoId, stdMonth: ym, fixYn });
      message.success(fixYn ? '해당 기준년월의 전용차량 운행일지가 확정되었습니다' : '해당 기준년월의 전용차량 운행일지가 확정취소되었습니다');
      await retrieve();
    } catch (err) {
      message.warning(errorMessage(err, fixYn ? '확정 실패' : '확정취소 실패'));
    }
  };

  // [E6] confirmButton[확정].Select (L147) → closeCheck(), confirmCheck() L362-387: 이미 확정된 행이 있으면 알리고 → 확인창 → [E9] confirmAll()
  const confirmCheck = () => {
    if (rows.some(r => r.fixYn)) { message.warning('이미 확정되었습니다.'); return; }
    Modal.confirm({ title: '확인', content: `${stdMonth}월의 운행 내역을 확정하시겠습니까?`, okText: '예', cancelText: '아니오', width: 400, onOk: () => fixAll(true) });
  };

  // [E7] cancelButton[확정취소].Select (L154) → closeCheck(), cancelCheck() L426-451: 확정 아닌 행이 있으면 알리고 → 확인창 → [E10] cancelAll()
  const cancelCheck = () => {
    if (rows.some(r => !r.fixYn)) { message.warning('이미 취소되었습니다.'); return; }
    Modal.confirm({ title: '확인', content: `${stdMonth}월의 운행확정 내역을 취소하시겠습니까?`, okText: '예', cancelText: '아니오', width: 400, onOk: () => fixAll(false) });
  };

  // buildGrid() L207-254 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '사용일자'),  // L241
    gb.long('beforeMileage', 120, '주행전<br>계기판(km)'),  // L242 addLongHtml
    gb.long('afterMileage', 120, '주행후<br>계기판(km)'),  // L243
    gb.long('mileage', 120, '주행거리<br>(km)'),  // L244
    gb.long('commuteMileage', 120, '출퇴근<br>사용거리(km)'),  // L245
    gb.long('bizMileage', 120, '일반업무용<br>사용거리(km)'),  // L246
    gb.long('unBizMileage', 120, '비업무용<br>사용거리(km)'),  // L247
    gb.text('destination', 240, '행선지'),  // L248
    gb.text('reason', 240, '목적'),  // L249
    iconCell<CarJournal>('edit', 'actionCell', 80, '변경', editRow),  // L250 addCell(ImageCell("Edit"))
    gb.textCenter('fixYnText', 100, '확정여부', { valueGetter: p => (p.data?.fixYn ? '확정' : ' ') }),  // L251 getFixYnText()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L127), [E1] stdMonth.KeyPress [Enter] (L105) → retrieve() */}
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
            <LookupInput width={300} placeholder="차량정보를 선택해주세요" value={info?.infoName ?? ''} onOpen={openLookupInfo} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<CarJournal>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.journalId)}
            loading={loading}
            onRowDataUpdated={e => {
              const node = e.api.getDisplayedRowAtIndex(0);
              if (node) node.setSelected(true);  // 조회 뒤 첫 행 선택(grid.getSelectionModel().select(0, false))
            }}
          />
        </div>
      </div>
      {/* lookupInfo() L189-205: popup.open("1", stdMonth) → 고른 차량이면 값 + retrieve(), null이면 비운다 */}
      <Car01_Lookup_Info
        open={lookupInfoOpen}
        carType="1"
        stdMonth={stdMonth}
        onResult={r => {
          setLookupInfoOpen(false);
          if (r == null) setInfo(null);
          else selectInfo(r);
        }}
        onClose={() => setLookupInfoOpen(false)}
      />
      <Car04_Lookup_PrivateJournal
        target={editTarget}
        onResult={model => { setEditTarget(null); void update(model); }}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
};
