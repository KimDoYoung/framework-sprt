/**
 * 부서 인감날인대장(구) (U2-03) — AS-IS 메뉴 없음(Apr19_Tab_StampList의 부서 판)
 * AS-IS: myApp/client/vi/apr/Apr19_Tab_OrgStampList.java (325줄) + Apr19_Edit_StampDate (112줄, 공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-101: Apr19_Tab_StampList와 같은 배치 — center 여백 20, 테두리 박스 = 툴바(조회기간 시작 ~ 끝 · 인감선택 칸 250 · 검색 250 · "반출만 조회" · [조회][출력/다운로드]) + 단일 선택 그리드(행번호, 12열)
 * StampList와 다른 점: ① 조회·출력에 orgCodeId(LoginUser.getOrgCodeId()) 조건을 더해 로그인 사원의 부서가 쓸 수 있는(또는 전체 사용) 인감의 내역만 보인다(서버가 부서를 정한다)
 *   ② 인감선택 조회창이 Apr10_Lookup_Stamp(flag=false, true) ③ 출력 windowClassName "Apr19_Tab_OrgStampList"(mrd는 Apr19_Rd_StampList 그대로)
 * 스타일: SGP (견본 Chk02_Tab_DailyList — docs/page-style.md). 원본이 vlc.setBorders(true)라 바깥에 테두리를 둔다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprRelateStampApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { AprRelateStampList, AprStamp } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';
import { Apr19_Edit_StampDate } from './Apr19_Edit_StampDate';

const gb = gbFor<AprRelateStampList>();
const DATE = 'YYYY-MM-DD';
/** 폐기된 문서의 내용에 들어 있는 표시 (원본 buildGrid actionCell indexOf) */
const DISPOSED_VIEW = 'style=color:#E33E31;>[폐기]';

export const Apr19_Tab_OrgStampList: React.FC = () => {
  // settings() L103-191: 조회기간 = 올해 1월 1일 ~ 오늘, 인감선택 칸은 읽기 전용(트리거만, 비면 "전체"), 반출만 조회 = false
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [stampName, setStampName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [outYn, setOutYn] = useState(false);
  // 인감을 고른 직후 바로 retrieve()를 부르므로 조건의 최신 값을 ref로도 든다
  const cond = useRef<{ stampId: number | null }>({ stampId: null });
  const [rows, setRows] = useState<AprRelateStampList[]>([]);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [editRelateStampId, setEditRelateStampId] = useState<number | null>(null);
  const [apprId, setApprId] = useState<number | null>(null);
  const [rd, setRd] = useState<{ url: string; title: string } | null>(null);
  const seq = useRef(0);
  const state = useRef({ startDate, closeDate, searchText, outYn });
  state.current = { startDate, closeDate, searchText, outYn };

  const params = () => {
    const s = state.current;
    return {
      startDate: s.startDate.format(DATE),
      closeDate: s.closeDate.format(DATE),
      stampId: cond.current.stampId ?? undefined,
      outYn: s.outYn,
      searchText: s.searchText || undefined,
    };
  };

  // retrieve() L281-298: apr.Apr19_RelateStamp.selectByOrgCodeId(companyId, orgCodeId, startDate, closeDate, stampId, outYn, "%검색어%")
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprRelateStampApi.searchOrgStampList(params());
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L68-101) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] stampField.TriggerClick (L119) → findLookupStampSeq() L300-317: Apr10_Lookup_Stamp(flag=false, checkflag=true).open → 고른 인감 이름·ID를 칸에 넣고, "전체보기"는 칸을 비우고 stampId = null. 어느 쪽이든 retrieve()
  const pickStamp = (stamp: AprStamp | null) => {
    if (!stamp) return;
    setStampName(stamp.stampName ?? '');
    cond.current.stampId = stamp.stampId;
    void retrieve();
  };
  const clearStamp = () => {
    setStampName('');
    cond.current.stampId = null;
    void retrieve();
  };

  // [E4] downloadButton[출력/다운로드].Select (L139) → 서비스 sys.Sys99_Print.insertRdOrgStampList(companyId, personId, orgCodeId, windowClassName, stampId, startDate, closeDate, outYn, searchText)
  //   → 성공이면 RDViewer.viewer(mrd Apr19_Rd_StampList · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const downLoad = async () => {
    setPrinting(true);  // grid.mask("Loading")
    try {
      const p = params();
      const groupId = await aprRelateStampApi.rdPrint({ ...p, org: true });
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Apr19_Rd_StampList',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: p.startDate, closeDate: p.closeDate },
      });
      setRd({ url: res.url, title: '인감날인대장' });
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setPrinting(false);
    }
  };

  // [E5] actionCell (ImageCell "View").callbackOnCreate (L215) → 인라인 L215-220: 연결문서가 없으면 안내, 폐기 문서면 열람 불가 안내,
  //   아니면 ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …)
  const viewAppr = (row: AprRelateStampList) => {
    if (row.apprId == null) message.info('연결문서가 없습니다.');
    else if ((row.purpose ?? '').includes(DISPOSED_VIEW)) message.info('해당문서는 폐기되어 열람이 불가능합니다');
    else setApprId(row.apprId);
  };

  // [E6] actionCell2 (ImageCell "Edit").callbackOnCreate (L251) → 대외문서(realRelateStampId 없음)는 안내, 아니면 selectById로 읽어 Apr19_Edit_StampDate.open(callback → retrieve())
  const editStampDate = (row: AprRelateStampList) => {
    if (row.realRelateStampId == null) {
      message.info('대외문서에 대한 날인인감 사용일자는 별도로 지정할 수 없습니다.');
      return;
    }
    setEditRelateStampId(row.realRelateStampId);
  };

  // buildGrid() L194-279 (setChecked 없음 → 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('callDate', 100, '신청일자'),  // L266
    gb.textCenter('callEmpName', 100, '신청자'),  // L267
    gb.text('stampName', 120, '날인인감'),  // L268
    gb.longCenter('stampCnt', 70, '날인부수'),  // L269
    gb.booleanYn2('outYn', 60, '반출'),  // L270
    gb.text('provideCo', 300, '제출처'),  // L271
    gb.textHtml('purpose', 350, '내용'),  // L272
    gb.text('note', 250, '비고<br>(날인요청서류)', { cellStyle: { color: '#404040' } }),  // L273
    iconCell<AprRelateStampList>('view', 'actionCell', 50, '문서확인', viewAppr),  // L274 addCell(actionCell, 55, "문서확인", actionCell)
    gb.text('apprCntStr', 80, ''),  // L275
    gb.textCenter('stampSeq', 100, '대외문서번호'),  // L277 (L276 대장번호는 주석 처리)
    gb.date('stampDate', 100, '날인일자'),  // L278
    iconCell<AprRelateStampList>('edit', 'actionCell2', 27, ' ', editStampDate),  // L279 addCell(actionCell, 27, " ", actionCell2)
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L133) → retrieve(), [E2] searchText.KeyPress [Enter] (L125) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()} loading={loading} extra={<Button type="download" onClick={downLoad} loading={printing}>출력/다운로드</Button>}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="인감선택">
            <LookupInput value={stampName} width={250} placeholder="전체" onOpen={() => setStampOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="신청자/제출처/내용/대외문서번호" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={outYn} onChange={e => setOutYn(e.target.checked)}>반출만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprRelateStampList> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateStampId)} loading={loading} />
        </div>
      </div>
      <Apr10_Lookup_Stamp open={stampOpen} flag={false} checkflag onResult={pickStamp} onDelete={clearStamp} onClose={() => setStampOpen(false)} />
      <Apr19_Edit_StampDate relateStampId={editRelateStampId} onDone={() => void retrieve()} onClose={() => setEditRelateStampId(null)} />
      <Apr01_Edit_ApprDoc apprId={apprId} onClose={() => setApprId(null)} />
      <RdViewer url={rd?.url ?? null} title={rd?.title ?? ''} onClose={() => setRd(null)} />
    </div>
  );
};
