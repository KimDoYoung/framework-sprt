/**
 * [1010] 문서작성 > 06. 문서작성현황 > 운영현황표 (G16)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_TotalList.java (183줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L48-87: center=vlc01 — 툴바(조회기간 · 담당부서 · 담당자 · [조회]) + 담당자별 건수 그리드(단일 선택, 헤더 묶음 발생건수·처리건수·미처리건수, 맨 아래 합계 행 "계")
 * 건별명세 아이콘(L92-110)은 메뉴 #1011(Apr01_Tab_SubList, G17)을 열고 조회기간·담당자·담당부서를 넘긴다 — TempData + MenuOpener (utils/tempData.ts)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprTotalList } from '@/types/apr';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { TempData, openMenuByNo } from '@/utils/tempData';
import { SUB_LIST_KEY, SubListRequest } from './Apr01_Tab_SubList';

const gb = gbFor<AprTotalList>();
const DATE_FORMAT = 'YYYY-MM-DD';
/** 처리건수 열 글자색·미처리건수 열 글자색 (addLong(…, "0069B4" / "DF5E5E")) */
const PROC_COLOR = '#0069B4';
const UNPROC_COLOR = '#DF5E5E';
const procStyle = { cellStyle: { color: PROC_COLOR } };
const unprocStyle = { cellStyle: { color: UNPROC_COLOR } };
const SUB_LIST_MENU_NO = '1011';

export const Apr01_Tab_TotalList: React.FC = () => {
  // setInitData() L133-143: 조회기간 = 이번 달 1일 ~ 말일
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [orgName, setOrgName] = useState('');
  const [personName, setPersonName] = useState('');
  const [rows, setRows] = useState<AprTotalList[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // [E1] searchButton[조회].Select (L50) → retrieve() L145-175: apr.Apr01_Appr.selectByTotalList (담당자·담당부서는 비면 전체, 아니면 %…%는 서버)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    setRows([]);       // grid.getStore().clear()
    try {
      const list = await aprApi.searchTotalList({
        startDate: startDate.format(DATE_FORMAT),
        closeDate: closeDate.format(DATE_FORMAT),
        orgName,
        personName,
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L48-87) → setInitData(), retrieve() — 열 때 바로 조회한다
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L89-131 (단일 선택) — 건별명세 아이콘(View): 현재 조회기간·고른 행의 담당자/부서를 TempData에 담고 메뉴 1011을 연다
  const openSubList = (row: AprTotalList) => {
    if (!openMenuByNo(SUB_LIST_MENU_NO)) {
      message.warning('건별명세 화면을 열 수 없습니다');
      return;
    }
    const request: SubListRequest = {
      startDate: startDate.format(DATE_FORMAT),
      closeDate: closeDate.format(DATE_FORMAT),
      personName: row.aprPersonName ?? '',
      orgName: row.aprOrgName ?? '',
    };
    TempData.publish(SUB_LIST_KEY, request);
  };

  const columnDefs = useMemo(() => [
    gb.text('aprOrgName', 150, '담당부서'),  // L116
    gb.text('aprPersonName', 100, '담당자'),  // L117
    gb.group('발생건수', [  // L112
      gb.long('genCnt', 100, '일반문서'),  // L118
      gb.long('icsCnt', 100, '내부통제문서'),  // L119
      gb.long('totalCnt', 100, '계'),  // L120
    ]),
    { ...gb.group('처리건수', [  // L113 (제목 색 0069B4)
      gb.long('procGenCnt', 100, '일반문서', procStyle),  // L121
      gb.long('procIcsCnt', 100, '내부통제문서', procStyle),  // L122
      gb.long('procTotalCnt', 100, '계', procStyle),  // L123
    ]), headerStyle: { color: PROC_COLOR } },
    { ...gb.group('미처리건수', [  // L114 (제목 색 DF5E5E)
      gb.long('unProcGenCnt', 100, '일반문서', unprocStyle),  // L124
      gb.long('unProcIcsCnt', 100, '내부통제문서', unprocStyle),  // L125
      gb.long('unProcTotalCnt', 100, '계', unprocStyle),  // L126
    ]), headerStyle: { color: UNPROC_COLOR } },
    {
      ...iconCell<AprTotalList>('view', 'actionCell', 100, '건별명세', openSubList),  // L127 addCell
      cellRendererSelector: (p: { node: { rowPinned?: string | null } }) => (p.node.rowPinned ? { component: () => null } : undefined),  // 합계 행에는 아이콘 없음
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [startDate, closeDate]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="담당부서">
            <SearchBar.Input style={{ width: 160 }} value={orgName} onChange={e => setOrgName(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="담당자">
            <SearchBar.Input style={{ width: 120 }} value={personName} onChange={e => setPersonName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprTotalList>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            sumRow={{
              labelField: 'aprPersonName',
              label: '계',
              sum: ['genCnt', 'icsCnt', 'totalCnt', 'procGenCnt', 'procIcsCnt', 'procTotalCnt', 'unProcGenCnt', 'unProcIcsCnt', 'unProcTotalCnt'],
            }}
          />
        </div>
      </div>
    </div>
  );
};
