/**
 * [1404] 관리자 > 01. 고객관리 > 로그아웃 알림 관리 (A24)
 * AS-IS: myApp/client/vi/sys/Sys86_Tab_Websocket.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L65-114: 툴바(고객사 콤보 · 검색 · 조회·개별전송·전체전송·개별로그아웃·전체로그아웃 · 남은 시간) + 그리드(행번호, 체크박스 다중) + 페이징 툴바(100). 여백 20
 * 이 화면은 **지금 WebSocket에 접속한 사원**만 보여 주고(AS-IS BroadcastWebsocket.getInfoList()), 알림을 보내거나 강제 로그아웃시킨다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 넣지 않는다 — 버튼이 많아 줄바꿈이 생긴다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Select, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, WebsocketPerson, WebsocketResult } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SendMessage } from '../utils/SendMessage';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const ALL = '%';     // companyName "전체" 또는 "%"
const TIMER_SECONDS = 300;  // startTimer() L279-299: 5분

const gb = gbFor<WebsocketPerson>();

/** AS-IS buildGrid() L236-248 */
const columnDefs = [
  gb.text('companyName', 300, '고객사'),  // L239 SQL 계산 컬럼(sys01_company_nm)
  gb.textCenter('korName', 100, '사원명'),  // L240
  gb.textCenter('empNo', 150, '사번'),  // L241
  gb.textCenter('posName', 100, '직위'),  // L242
  gb.text('officeTelno', 120, '사무실'),  // L244
  gb.text('mobileTelno', 120, '휴대폰'),  // L245
];

export const Sys86_Tab_Websocket: React.FC = () => {
  const gridRef = useRef<AgGridReact<WebsocketPerson>>(null);
  const [companies, setCompanies] = useState<Code[]>([]);
  // settings() L116-234: 고객사 = 전체, 검색 빈칸(힌트 "고객사명/사원명/휴대폰")
  const [companyCd, setCompanyCd] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<WebsocketPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ companyId: number | null; searchText: string } | undefined>(undefined);
  // msg: 마지막에 쓴 알림 내용(원본 필드 msg — 다음에 열 때 처음 내용)
  const [msg, setMsg] = useState('');
  const [sendOpen, setSendOpen] = useState<{ list: WebsocketPerson[] | null } | null>(null);
  // timerLabel: "N초 남았습니다"
  const [remaining, setRemaining] = useState<number | null>(null);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await sysApi.searchWebsocketPersons({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L250-277: 조건을 만들어 1페이지부터 다시 읽는다 (조회 뒤 첫 행 선택)
  const retrieve = (code: string = companyCd) => {
    paramRef.current = {
      companyId: code === ALL ? null : Number(code),  // "전체" 또는 "%"이면 null
      searchText,                                     // 원본은 "%" + 검색어 + "%" — 서버가 만든다(05 §6)
    };
    void getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L65-114) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCompanyNames().then(setCompanies).catch(err => message.error(errorMessage(err, '조회 실패')));
    retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // startTimer() L279-299: 300초부터 1초마다 줄어든다(0초에서 멈춘다). 시간이 다 돼도 로그아웃은 일어나지 않는다 — 원본도 표시만 한다
  const startTimer = () => setRemaining(TIMER_SECONDS);
  useEffect(() => {
    if (remaining === null || remaining <= 0) return;
    const t = setTimeout(() => setRemaining(r => (r === null ? r : r - 1)), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const selectedRows = () => gridRef.current?.api.getSelectedRows() ?? [];

  /** 결과 문구: 오프라인 사원이 있으면 이름을, 아니면 완료 문구 (AS-IS sendMessage·sendForceLogout) */
  const report = (res: WebsocketResult, done: string) => {
    if (res.offlineNames.length > 0) message.warning(`[ ${res.offlineNames.join(' ')} ] 해당 사용자는 오프라인 상태입니다`);
    else message.success(done);
  };

  // sendMessage(list) L301-335: 고른 사원에게 알림
  const sendMessage = async (list: WebsocketPerson[], text: string) => {
    try {
      report(await sysApi.sendWebsocketAlarm(list.map(p => p.personId), text), '알림이 발송되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '알림 발송 실패'));
    }
  };

  // sendMessageAll() L337-346: 전체 알림
  const sendMessageAll = async (text: string) => {
    try {
      await sysApi.sendWebsocketAlarmAll(text);
      message.success('전체알림이 발송되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '알림 발송 실패'));
    }
  };

  // [E4] sendButton[개별전송].Select [list.size() == 0] (L144) → 선택이 없으면 "선택된 사원이 없습니다", 있으면 SendMessage.open(msg, list, cb)
  const onSend = () => {
    const list = selectedRows();
    if (list.length === 0) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    setSendOpen({ list });
  };

  // [E5] sendAllButton[전체전송].Select [result != null] (L166) → SendMessage.open(msg, cb)
  const onSendAll = () => setSendOpen({ list: null });

  // SendMessage의 "전송 및 로그아웃" 콜백: result != null이면 msg = result; sendMessage(list) 또는 sendMessageAll(); startTimer()
  const onSendResult = (text: string | null) => {
    const target = sendOpen;
    if (text === null || !target) return;
    setMsg(text);
    if (target.list) void sendMessage(target.list, text);
    else void sendMessageAll(text);
    startTimer();
  };

  // [E6] forceLogoutButton[개별로그아웃].Select [YES] (L182) → 선택 확인 → [E7] msgBox.DialogHide [YES] (L192) → sendForceLogout() L348-382
  const onForceLogout = () => {
    const list = selectedRows();
    if (list.length === 0) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '선택된 사용자들은 즉시 로그아웃됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: async () => {
        try {
          report(await sysApi.forceLogoutPersons(list.map(p => p.personId)), '강제 로그아웃처리되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '강제 로그아웃 실패'));
        }
      },
    });
  };

  // [E8] forceLogoutAllButton[전체로그아웃].Select [YES] (L211) → [E9] msgBox.DialogHide [YES] (L216) → sendForceLogoutAll() L384-392
  const onForceLogoutAll = () => {
    Modal.confirm({
      title: '확인',
      content: '모든 사용자들이 즉시 로그아웃됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: async () => {
        try {
          await sysApi.forceLogoutAllPersons();
          message.success('전체 로그아웃처리되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '전체 로그아웃 실패'));
        }
      },
    });
  };

  const companyOptions = useMemo(() => [{ value: ALL, label: '전체' }, ...companies.map(c => ({ value: c.code, label: c.name }))], [companies]);
  const onRowDataUpdated = useCallback((e: { api: { getDisplayedRowAtIndex: (i: number) => { setSelected: (s: boolean, c?: boolean) => void } | undefined } }) => {
    e.api.getDisplayedRowAtIndex(0)?.setSelected(true, false);  // 콜백: 첫 행이 있으면 select(0, false)
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L138) → retrieve() */}
      <SearchBar style={{ minHeight: 50 }} onSearch={() => retrieve()} loading={loading} extra={<>
        <Button type="send" onClick={onSend}>개별전송</Button>
        <Button type="send" onClick={onSendAll}>전체전송</Button>
        <Button type="cancel" onClick={onForceLogout}>개별로그아웃</Button>
        <Button type="cancel" onClick={onForceLogoutAll}>전체로그아웃</Button>
        {remaining !== null && <Typography.Text style={{ color: '#CE4242' }}>{remaining}초 남았습니다</Typography.Text>}
      </>}>
        <SearchBar.Field label="고객사">
          {/* [E2] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L132) → retrieve() — 고르면 바로 조회 */}
          <Select style={{ width: 200 }} value={companyCd} options={companyOptions}
            onChange={code => { setCompanyCd(code); retrieve(code); }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          {/* [E1] searchText.KeyPress [Enter] (L124) → retrieve() */}
          <SearchBar.Input style={{ width: 200 }} placeholder="고객사명/사원명/휴대폰" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<WebsocketPerson>
          gridRef={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.personId)}
          onRowDataUpdated={onRowDataUpdated}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      <SendMessage open={!!sendOpen} msg={msg} list={sendOpen?.list ?? null} onResult={onSendResult} onClose={() => setSendOpen(null)} />
    </div>
  );
};
