/**
 * [1484] 경영관리 > 91. 법인서류 > 부서 인감날인대장 (T25)
 * AS-IS: myApp/client/vi/apr/Apr16_Tab_StampListOrg.java (336줄) + Apr16_Lookup_UpdateStampDate (112줄, T24와 공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-101: T24(Apr16_Tab_StampList)와 같은 배치 — center 여백 20, 테두리 박스 = 툴바(조회기간 시작 ~ 끝 · 인감선택 칸 250 · 검색 250 · "반출만 조회" · [조회][출력/다운로드]) + 단일 선택 그리드(행번호, 12열)
 * T24와 다른 점: ① 조회·출력에 orgId(LoginUser.getOrgCodeId()) 조건을 더해 로그인 사원의 부서가 쓸 수 있는 인감의 내역만 보인다(서버가 부서를 정한다 — API `org=true`)
 *   ② 인감선택 조회창이 Apr10_Lookup_Stamp(flag=false, true) → selectByOrgId(내 부서 소유 인감 포함) ③ 출력 windowClassName "Apr16_Tab_StampListOrg"
 * 1단계: [문서보기] 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 컴포넌트라 다음 단계 — 사전 검사 메시지까지만 하고 안내를 띄운다
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 원본이 vlc.setBorders(true)라 SG 견본과 달리 바깥에 테두리를 둔다(03 원칙 12)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { AprStamp, AprStampList } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { dynamicIconCell, iconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';
import { Apr16_Lookup_UpdateStampDate } from './Apr16_Lookup_UpdateStampDate';

const gb = gbFor<AprStampList>();
const DATE = 'YYYY-MM-DD';
/** 폐기된 문서의 내용에 들어 있는 표시 (원본 buildGrid actionCell indexOf) */
const DISPOSED_VIEW = 'style=color:#E33E31;>[폐기]';

export const Apr16_Tab_StampListOrg: React.FC = () => {
  // settings() L103-195: 조회기간 = 지난달 1일 ~ 오늘, 인감선택 칸은 읽기 전용(트리거만, 비면 "전체"), 반출만 조회 = false
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [stampName, setStampName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [outYn, setOutYn] = useState(false);
  // 인감을 고른 직후 바로 retrieve()를 부르므로 조건의 최신 값을 ref로도 든다
  const cond = useRef<{ stampId: number | null }>({ stampId: null });
  const [rows, setRows] = useState<AprStampList[]>([]);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [editStampDocId, setEditStampDocId] = useState<number | null>(null);
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
      org: true,  // orgId = LoginUser.getOrgCodeId() — 서버가 로그인 사원의 부서로 채운다
    };
  };

  // retrieve() L285-308: apr.Apr16_StampDoc.selectStampByCompanyId(companyId, startDate, closeDate, stampId, outYn, "%검색어%", orgId)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprStampDocApi.searchStampList(params());
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

  // findLookupStampSeq() L310-328: Apr10_Lookup_Stamp(flag=false, checkflag=true).open → 고른 인감 이름·ID를 칸에 넣고, "전체보기"는 칸을 비우고 stampId = null. 어느 쪽이든 retrieve()
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

  // [E4] downloadButton[출력/다운로드].Select (L143) → 서비스 sys.Sys99_Print.insertRdStampListApr16(companyId, personId, windowClassName, orgId, stampId, startDate, closeDate, outYn, searchText)
  //   → 성공이면 RDViewer.viewer(mrd Apr16_Rd_StampList · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const downLoad = async () => {
    setPrinting(true);  // grid.mask("Loading")
    try {
      const p = params();
      const groupId = await aprStampDocApi.stampListRdPrint(p);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Apr16_Rd_StampList',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: p.startDate, closeDate: p.closeDate },
      });
      setRd({ url: res.url, title: '부서 인감날인대장' });
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setPrinting(false);
    }
  };

  // [E5] actionCell (ImageCell "View").callbackOnCreate (L220) → 인라인 L220-225: 연결문서가 없으면 안내, 폐기 문서면 열람 불가 안내,
  //   아니면 ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …) — 다른 도메인 컴포넌트라 다음 단계
  const viewAppr = (row: AprStampList) => {
    if (row.apprId == null) message.warning('연결문서가 없습니다.');
    else if ((row.purpose ?? '').includes(DISPOSED_VIEW)) message.warning('해당문서는 폐기되어 열람이 불가능합니다');
    else message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // [E6] actionCell2 (ImageCell "Edit").callbackOnCreate (L256) → 대외문서(realStampDocId 없음)는 안내, 아니면 selectById로 읽어 Apr16_Lookup_UpdateStampDate.open(callback → retrieve())
  const editStampDate = (row: AprStampList) => {
    if (row.realStampDocId == null) {
      message.warning('대외문서에 대한 날인인감 사용일자는 별도로 지정할 수 없습니다.');
      return;
    }
    setEditStampDocId(row.realStampDocId);
  };

  // buildGrid() L197-283 (setChecked 없음 → 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('applDate', 100, '신청일자'),
    gb.textCenter('applEmpName', 100, '신청자'),
    gb.text('stampName', 120, '날인인감'),
    gb.longCenter('stampQty', 70, '날인부수'),
    gb.booleanYn2('stampOutYn', 60, '반출'),
    gb.text('provideCo', 300, '제출처'),
    gb.textHtml('purpose', 350, '내용'),
    gb.text('note', 250, '비고<br>(날인요청서류)', { cellStyle: { color: '#404040' } }),
    dynamicIconCell<AprStampList>('view', 'actionCell', 50, '문서<br>보기', viewAppr, row => row.apprStatusName != null),  // addDynamicCell(…, true)
    gb.textCenter('stampSeq', 100, '대외문서번호'),
    gb.date('stampDate', 100, '날인일자'),
    iconCell<AprStampList>('edit', 'actionCell2', 27, ' ', editStampDate),  // addCell(actionCell, 27, " ", actionCell2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L137) → retrieve(), [E2] searchText.KeyPress [Enter] (L129) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()} loading={loading} extra={<Button type="download" onClick={downLoad} loading={printing}>출력/다운로드</Button>}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="인감선택">
            {/* [E1] stampField.TriggerClick (L123) → findLookupStampSeq() */}
            <LookupInput value={stampName} width={250} placeholder="전체" onOpen={() => setStampOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="신청자/제출처/내용/대외문서번호" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={outYn} onChange={e => setOutYn(e.target.checked)}>반출만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprStampList> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.stampDocId)} loading={loading} />
        </div>
      </div>
      <Apr10_Lookup_Stamp open={stampOpen} flag={false} checkflag onResult={pickStamp} onDelete={clearStamp} onClose={() => setStampOpen(false)} />
      <Apr16_Lookup_UpdateStampDate stampDocId={editStampDocId} onDone={() => void retrieve()} onClose={() => setEditStampDocId(null)} />
      <RdViewer url={rd?.url ?? null} title={rd?.title ?? ''} onClose={() => setRd(null)} />
    </div>
  );
};
