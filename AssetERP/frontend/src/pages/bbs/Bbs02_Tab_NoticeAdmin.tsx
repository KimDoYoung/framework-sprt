/**
 * [1246] 커뮤니티 > 02. 공지사항 > KFS공지등록 (Z04)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Tab_NoticeAdmin.java (356줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L70-111: center=테두리 박스(여백 20) — 툴바(공지구분 120 · 구분상세 200 · 공지기간 100~100 · 상태 100 · 검색 200 "공지구분/제목/기타메모" · [조회][등록]) + 공지 그리드(단일 선택) + 페이징 툴바(100).
 *   KFS 공지는 회사 ID 0에 쌓인다(companyId = 0)
 * 연결: Bbs02_Edit_NoticeAdmin(등록·상세보기) · Bbs02_Edit_Message→Emp00_Lookup_SelectMulti(문자발송)
 * 스타일: SGP (견본 Chk02_Tab_DailyList — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsNoticeAdminApi } from '@/api/bbs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNoticeAdmin } from '@/types/bbs';
import { Code } from '@/types/sys';
import { TransInfo } from '@/types/emp';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { SearchBar } from '@/components/search';
import { Bbs02_Edit_Message } from './Bbs02_Edit_Message';
import { Bbs02_Edit_NoticeAdmin, BbsNoticeAdminEdit } from './Bbs02_Edit_NoticeAdmin';

const gb = gbFor<BbsNoticeAdmin>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const DATE = 'YYYY-MM-DD';
const SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Param { openYn: string; noticeType: string; noticeDetail: string; searchText: string; startDate?: string; closeDate?: string }

export const Bbs02_Tab_NoticeAdmin: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<BbsNoticeAdmin>>(null);
  const [noticeType, setNoticeType] = useState('%');
  const [detailCodes, setDetailCodes] = useState<Code[]>([]);
  const [noticeDetail, setNoticeDetail] = useState('%');
  // settings() L113-221: 기간 기본값 = 오늘 -3개월 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(3, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [openYn, setOpenYn] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsNoticeAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BbsNoticeAdminEdit | null>(null);
  const [sendMsg, setSendMsg] = useState<string | null>(null);   // Bbs02_Edit_Message가 열려 있으면 처음 문구
  const [pickMsg, setPickMsg] = useState<string | null>(null);   // 문구가 정해지면 Emp00_Lookup_SelectMulti로 수신자를 고른다
  const paramRef = useRef<Param | undefined>(undefined);
  const allDetailRef = useRef<Code[]>([]);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await bbsNoticeAdminApi.searchNotices({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // retrieve() L254-293: 상태 "알림"·"대기"만 걸고(그 밖은 %), 구분이 전체('%')일 때만 기간을 건다. 1페이지부터 다시 읽는다 (companyId는 서버 = 0, typeCode NoticeType002)
  const retrieve = (over?: { noticeType?: string; noticeDetail?: string; openYn?: string }) => {
    const type = over?.noticeType ?? noticeType;
    const status = over?.openYn ?? openYn;
    paramRef.current = {
      openYn: status === '알림' || status === '대기' ? status : '%',
      noticeType: type,
      noticeDetail: over?.noticeDetail ?? noticeDetail,
      searchText,
      ...(type === '%' ? { startDate: startDate.format(DATE), closeDate: closeDate.format(DATE) } : {}),
    };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L70-111) → settings(): 구분상세 목록(sys.Sys09_Code.selectByCode3, 코드 "%")을 미리 읽고 [E3] 첫 조회
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => { allDetailRef.current = list; })
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')))
      .finally(() => { void retrieveRef.current(); });
  }, []);

  // [E2] noticeTypeComboBox[NoticeType002].Collapse (L133): 전체면 구분상세를 "전체"·꺼짐으로 두고, 아니면 켜고 selectByCode3(구분+"%") 뒤 조회. 기간은 구분이 전체일 때만 켠다(setDateField)
  const onTypeChange = (code: string | undefined) => {
    const v = code && code !== '' ? code : '%';
    setNoticeType(v);
    setNoticeDetail('%');
    setDetailCodes(v === '%' ? [] : allDetailRef.current.filter(c => c.code.startsWith(v)));
    void retrieve({ noticeType: v, noticeDetail: '%' });
  };

  // [E8] insertButton[등록].Select (L215) → insertRow() L337-340: Bbs02_Edit_NoticeAdmin.newNotice(grid) L454-483 — 새 ID, 회사 0, 전체공지·전체고객사 체크, 상태 "대기", 작성자 = 로그인
  const insertRow = async () => {
    try {
      const id = await bbsNoticeAdminApi.getNextId();
      setEditTarget({
        isNew: true, noticeId: id, companyId: 0, fromDate: null, toDate: null, openYn: '대기', noticeNo: null,
        noticeType: null, noticeTypeName: null, noticeDetailCode: null, noticeDetailName: null, noticeDetailFullName: null,
        title: null, note: null, notice: null, userId: user.userId, userName: user.name, publicYn: true, publicCompanyYn: true,
      });
    } catch (err) {
      message.error(errorMessage(err, '새 공지 ID를 받지 못했습니다'));
    }
  };

  // Bbs02_Edit_NoticeAdmin 콜백: 저장한 줄을 목록에 반영한다. 새 행은 맨 아래(03 원칙 17)로 보여 준다
  const onSaved = (saved: BbsNoticeAdmin) => {
    const exists = rows.some(r => r.noticeId === saved.noticeId);
    setRows(prev => (exists ? prev.map(r => (r.noticeId === saved.noticeId ? saved : r)) : [...prev, saved]));
    if (!exists) setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(saved.noticeId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };
  const onDeleted = (noticeId: number) => setRows(prev => prev.filter(r => r.noticeId !== noticeId));

  // sendMessage(msg) L295-305 → sendList(msg) L307-335: 사원 다중 선택 뒤 sms.Sms03_GroupSend.sendNoticeMessage → 성공이면 "발송이 완료되었습니다"
  const sendList = async (msg: string, list: TransInfo[]) => {
    try {
      await bbsNoticeAdminApi.sendNoticeMessage(msg, list.map(t => t.personId));
      message.success('발송이 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '발송 실패'));
    }
  };

  // buildGrid() L223-252 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('fromDate', 100, '공지일'),  // L242
    gb.date('toDate', 100, '종료일'),  // L243
    gb.textCenter('openYn', 70, '상태'),  // L244
    gb.text('noticeDetailFullName', 200, '공지구분'),  // L245
    gb.textCenter('noticeNo', 100, '공지번호'),  // L246
    gb.text('title', 500, '제목'),  // L247
    // L248 addCell(actionCell, 50, "상세보기", ImageCell("View")) → Bbs02_Edit_NoticeAdmin.editNotice(grid)
    iconCell<BbsNoticeAdmin>('view', 'actionCell', 50, '상세보기', row => setEditTarget(row)),
    gb.text('note', 200, '기타메모'),  // L249
    // L250 addCell(actionCell, 100, "문자발송", ImageCell("Send")) → sendMessage("'[공지구분 / 공지번호] 제목' 을 확인부탁드립니다.")
    iconCell<BbsNoticeAdmin>('send', 'sendCell', 50, '문자발송', row =>
      setSendMsg(`'[${row.noticeDetailFullName} / ${row.noticeNo}] ${row.title}' 을 확인부탁드립니다.`)),
  ], []);

  const dateEnabled = noticeType === '%';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E7] retrieveButton[조회].Select (L209) → retrieve() */}
      <SearchBar
        onSearch={() => void retrieve()}
        loading={loading}
        extra={<Button type="register" onClick={() => void insertRow()}>등록</Button>}
      >
        <SearchBar.Field label="공지구분">
          {/* [E1] callbackOnCreate (L125) / [E2] 위 onTypeChange */}
          <SystemCodeComboBox kindGroupCd="NoticeType002" altCode={['%', '전체']} style={{ width: 120 }} value={noticeType} onChange={onTypeChange} />
          {/* [E3] callbackOnCreate (L159) → 전체·꺼짐, retrieve() / [E4] noticeDetailComboBox.Collapse (L169) → retrieve() */}
          <Select
            style={{ width: 200 }}
            disabled={noticeType === '%'}
            value={noticeDetail}
            onChange={v => { setNoticeDetail(v); void retrieve({ noticeDetail: v }); }}
            options={[{ value: '%', label: '전체' }, ...detailCodes.map(c => ({ value: c.code, label: c.name }))]}
          />
        </SearchBar.Field>
        <SearchBar.Field label="공지기간">
          <DatePicker style={{ width: 130 }} allowClear={false} disabled={!dateEnabled} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} disabled={!dateEnabled} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="상태">
          {/* [E5] openYnComboBox[전체].Collapse (L191) → retrieve() */}
          <Select
            style={{ width: 100 }}
            value={openYn}
            onChange={v => { setOpenYn(v); void retrieve({ openYn: v }); }}
            options={[{ value: '전체', label: '전체' }, { value: '알림', label: '알림' }, { value: '대기', label: '대기' }]}
          />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          {/* [E6] searchText.KeyPress [Enter] (L200) → retrieve() */}
          <SearchBar.Input style={{ width: 200 }} placeholder="공지구분/제목/기타메모" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BbsNoticeAdmin>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.noticeId)}
          loading={loading}
          rowSelection={SELECTION}
          // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      <Bbs02_Edit_NoticeAdmin model={editTarget} onClose={() => setEditTarget(null)} onSaved={onSaved} onDeleted={onDeleted} />
      <Bbs02_Edit_Message message={sendMsg} onSend={msg => setPickMsg(msg)} onClose={() => setSendMsg(null)} />
      <Emp00_Lookup_SelectMulti
        open={pickMsg != null}
        transDate={dayjs().format(DATE)}
        onResult={list => { const msg = pickMsg; setPickMsg(null); if (msg != null) void sendList(msg, list); }}
        onClose={() => setPickMsg(null)}
      />
    </div>
  );
};
