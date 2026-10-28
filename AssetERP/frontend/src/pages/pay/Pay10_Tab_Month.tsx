/**
 * 급여관리 (S16) — 경영관리 > 04. 급여관리 > 급여관리 #1270
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_Month.java (369줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L161-183 / settings() L76-140: 좌우 분할 40:60. 왼쪽 = 툴바(해당 연도 45 · 구분 칸 "구분을 선택해주세요" · [조회][생성][삭제]) + 급여 목록 체크 다중 그리드
 *   (사번 50 · 사원명 80 · 직급 50 · 지급액계 120 · 공제액계 120 · 차감지급액 120, 모두 읽기 전용), 오른쪽 = Pay11_TabPage_MonthItem
 * 급여 지급일(payDate)은 화면에 보이는 입력칸이 아니라 구분 조회창(Pay10_Lookup_GroupList)이 정해 주는 값이다
 * [수정]·calculate(L268-289)는 AS-IS에서도 버튼이 주석 처리되어 도달 불가라 만들지 않았다
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayMonth, PayMonthGroup } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Pay10_Lookup_GroupList } from './Pay10_Lookup_GroupList';
import { Pay10_Lookup_Insert } from './Pay10_Lookup_Insert';
import { Pay11_TabPage_MonthItem, PayMonthItemHandle } from './Pay11_TabPage_MonthItem';

const gb = gbFor<PayMonth>();

/** buildGrid(): 사번 50 · 사원명 80 · 직급 50(가운데) · 지급액계 · 공제액계 · 차감지급액 120 */
const buildColumns = () => [
  gb.textCenter('personNo', 50, '사번'),
  gb.textCenter('personNm', 80, '사원명'),
  gb.textCenter('posNm', 50, '직급'),
  gb.long('paySum', 120, '지급액계'),
  gb.long('taxDdcSum', 120, '공제액계'),
  gb.long('deductionSum', 120, '차감지급액'),
];

// GXT 체크박스 선택 모델처럼: 행을 누르면 그 행만 선택하고 Ctrl+클릭으로 더한다(삭제 대상은 체크한 행)
const ROW_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: true } as const;

export const Pay10_Tab_Month: React.FC = () => {
  const gridRef = useRef<AgGridReact<PayMonth>>(null);
  const tabPage = useRef<PayMonthItemHandle>(null);
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  // payGroupName: 값 = 지급구분 코드(payCode), 글자 = "yyyy-MM-dd / 구분명"
  const [payCode, setPayCode] = useState<string | null>(null);
  const [payGroupText, setPayGroupText] = useState('');
  const [payDate, setPayDate] = useState<string | null>(null);
  const [rows, setRows] = useState<PayMonth[]>([]);
  const [rowsTick, setRowsTick] = useState(0);
  const [loading, setLoading] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const monthIdRef = useRef<number | null>(null);
  // [E0] 화면 열림 (생성자 L161-183) → settings(): 연도 = 올해, 구분 = "구분을 선택해주세요", 좌우 분할 40:60
  const columnDefs = useMemo(buildColumns, []);

  // retrieveEditPage() L142-159: 한 행만 골랐으면 그 행의 항목을, 아니면 비운다. 구분 03(퇴직정산)이면 enabled도 다시 본다
  const retrieveEditPage = useCallback((selected: PayMonth[], code: string | null, date: string | null) => {
    if (selected.length === 1) {
      monthIdRef.current = selected[0].monthId;
      if (code === '03' && date) void tabPage.current?.enabled(code, date, monthIdRef.current);
      void tabPage.current?.retrieve(selected[0]);
    } else {
      monthIdRef.current = null;
      if (code === '03' && date) void tabPage.current?.enabled(code, date, null);
      tabPage.current?.init();
    }
  }, []);

  // retrieve() L212-240: 구분이 없으면 안내 → enabled → 목록 조회 → 첫 행 선택 + 항목 조회
  const retrieve = useCallback(async (code: string | null = payCode, date: string | null = payDate) => {
    if (code == null || date == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    void tabPage.current?.enabled(code, date, monthIdRef.current);
    setLoading(true);
    try {
      const list = await payApi.searchMonths(code, date);
      setRows(list);
      setRowsTick(t => t + 1);
      if (list.length > 0) {
        monthIdRef.current = list[0].monthId;
        void tabPage.current?.enabled(code, date, list[0].monthId);
      } else {
        retrieveEditPage([], code, date);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [payCode, payDate, retrieveEditPage]);

  // 목록이 새로 들어오면 첫 행을 선택한다(grid.getSelectionModel().select(0)) — 선택이 바뀌면 아래 onCheckedChange가 항목을 읽는다
  useEffect(() => {
    if (rowsTick === 0) return;
    const t = setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 0);
    return () => clearTimeout(t);
  }, [rowsTick]);

  // [E5] grid.RowClick (L126) → retrieveEditPage()
  const onChecked = (selected: PayMonth[]) => retrieveEditPage(selected, payCode, payDate);

  // [E1] payGroupName.TriggerClick (L91) → lookupPayGroup() L345-359: 고른 구분·지급일로 채우고 monthId를 비운 뒤 조회
  const groupPicked = (g: PayMonthGroup) => {
    setGroupOpen(false);
    setPayCode(g.payCd);
    setPayGroupText(g.payGroupNm);
    setPayDate(g.date);
    monthIdRef.current = null;
    void retrieve(g.payCd, g.date);
  };

  // [E3] deleteButton[삭제].Select (L114) → checkAppr("delete") L242-266 → deleteCheck() L291-319 → [E6] delete() L321-343
  const deleteRows = async () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    try {
      const res = await payApi.checkMonthAppr(payCode, payDate, monthIdRef.current);
      if (!res.ok) {
        message.warning(res.message ?? '삭제할 수 없습니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
      return;
    }
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제할 정보의 좌측 체크박스를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건의 급여정보를 삭제하시겠습니까?`,
      width: 360,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.deleteMonths(selected.map(r => r.monthId));
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="40%" min={420}>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* [E2] retrieveButton[조회].Select (L102) → retrieve() */}
            <SearchBar
              onSearch={() => retrieve()}
              loading={loading}
              extra={<>
                {/* [E4] insertButton[생성].Select (L120) → insert() L200-210: Pay10_Lookup_Insert.open(callback) */}
                <Button type="generate" onClick={() => setInsertOpen(true)}>생성</Button>
                <Button type="delete" onClick={deleteRows}>삭제</Button>
              </>}
            >
              <SearchBar.Field label="해당 연도">
                <SearchBar.Input style={{ width: 70 }} value={yearText} onChange={e => setYearText(e.target.value)} />
              </SearchBar.Field>
              <SearchBar.Field label="구분">
                <LookupInput value={payGroupText} placeholder="구분을 선택해주세요" width={200} onOpen={() => setGroupOpen(true)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MultiGrid<PayMonth>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.monthId)}
                rowSelection={ROW_SELECTION}
                onCheckedChange={onChecked}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={520}>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', borderLeft: 'none', padding: 4 }}>
            <Pay11_TabPage_MonthItem ref={tabPage} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Pay10_Lookup_GroupList open={groupOpen} year={yearText} onResult={groupPicked} onClose={() => setGroupOpen(false)} />
      <Pay10_Lookup_Insert open={insertOpen} onClose={() => setInsertOpen(false)} />
    </div>
  );
};
