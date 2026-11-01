/**
 * [1359] 신청 > 01. 외출/출장/휴가 > 출장품의 및 결과보고 (Y05)
 * AS-IS: myApp/client/vi/emp/Emp53_Tab_BizTrip.java (583줄) + Emp53_Lookup_BizTrip(272줄)·Emp53_Lookup_BizTripShare(157줄)·Emp56_Lookup_Share(339줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-165: 가운데(여백 20, 테두리) = 툴바(조회기간 100 ~ 100 · 검색 230 "출장지/출장목적" · [조회][등록][삭제] · [문서분류지정](관리자만)) + 본인 출장 그리드
 *   (MultiGrid 체크 다중, 2단 헤더 출장기간·출장품의·결과보고, 수정·결재요청·상세보기·공유 아이콘 열 6개).
 * 결재요청 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 B11/B13(출장신청서, 구분 1 국내/그 밖) · B12/B14(출장결과보고서) — checkAppr() L331-428 → checkDcr() L452-478 → insertLinkApproval() L480-491 → updateApprId() L493-514.
 * 스타일: SG (견본 Tdm01_Tab_Hr — 바깥 여백 20, 안쪽 padding 10, 툴바-그리드 간격 8)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 부품이 그리지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empBizTripApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { MyBizTrip } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Emp53_Lookup_BizTrip } from './Emp53_Lookup_BizTrip';
import { Emp53_Lookup_BizTripShare } from './Emp53_Lookup_BizTripShare';

const gb = gbFor<MyBizTrip>();
const FORMAT = 'YYYY-MM-DD';
const BLUE = { color: '#456EA6' };  // setHtmlGridStyle("결과보고","456EA6") L248, addCell(…, "456EA6")

/** checkAppr() L331-428 의 진행 중 안내 */
const PROGRESS_MSG: Record<string, string> = {
  '10': '상신진행중인 문서입니다. 상세보기버튼을 통해 확인바랍니다.',
  '20': '결재진행중인 문서입니다. 상세보기버튼을 통해 확인바랍니다.',
  '30': '완료된 문서입니다. 상세보기버튼을 통해 확인바랍니다.',
};

export const Emp53_Tab_BizTrip: React.FC = () => {
  // 생성자 L83-90: 조회기간 = 올해 1월 1일 ~ 오늘 + 1개월
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().add(1, 'month'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MyBizTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<MyBizTrip | 'NEW' | null>(null);
  const [shareTrip, setShareTrip] = useState<MyBizTrip | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [viewStatus, setViewStatus] = useState<string | null>(null);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; refId: number; result: boolean } | null>(null);
  const [userManager, setUserManager] = useState(false);  // LoginUser.getIsUserManager() L106
  const gridRef = useRef<AgGridReact<MyBizTrip> | null>(null);

  // retrieve() L271-293: emp.Emp53_BizTrip.selectByPersonId(companyId, personId, startDate, closeDate, "%검색어%")
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await empBizTripApi.searchMine(startDate.format(FORMAT), closeDate.format(FORMAT), searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [closeDate, searchText, startDate]);

  // [E0] 화면 열림 (생성자 L80-167) → retrieve()
  useEffect(() => {
    schApi.isUserManager().then(setUserManager).catch(() => setUserManager(false));
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const select = (row: MyBizTrip) => gridRef.current?.api?.getRowNode(String(row.bizTripId))?.setSelected(true, true);

  // [E3] insertButton[등록].Select (L128) → insert() L295-305: Emp53_Lookup_BizTrip.insert(→ retrieve())
  // [E4] deleteButton[삭제].Select (L135) → delete() L307-329
  const deleteRows = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 항목을 선택해주세요'); return; }  // 원본은 선택 없이 누르면 오류 — 안내만 더한다
    if (checked.some(r => r.apprStatusCode != null)) { message.warning('진행 및 완료된 문서가 포함 되어있습니다. 삭제 불가합니다.'); return; }
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 정보를 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      // [E6] messageBox.DialogHide [YES] (L315) → emp.Emp53_BizTrip.delete
      onOk: async () => {
        try {
          await empBizTripApi.deleteMine(checked.map(r => r.bizTripId));
          setRows(prev => prev.filter(r => !checked.some(c => c.bizTripId === r.bizTripId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // 수정 아이콘 (buildGrid L172-191): 진행·완료 문서(10·20·30)가 있으면 수정 불가
  const editRow = (row: MyBizTrip) => {
    select(row);
    const st = row.apprStatusCode;
    if (st === '10' || st === '20' || st === '30') { message.warning('진행 및 완료된 문서가 있습니다. 수정이 불가합니다.'); return; }
    setEditTarget(row);
  };

  // apprView() L430-450: apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve())
  const apprView = (apprId: number | null, status: string | null) => {
    setViewStatus(status);
    setViewApprId(apprId);
  };

  // checkDcr() L452-478: dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) → 없으면 안내, 있으면 첫 결과 → insertLinkApproval() L480-491
  const checkDcr = async (row: MyBizTrip, linkCode: string, result: boolean) => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(linkCode);
      if (list.length === 0) { message.warning('문서분류가 지정되어 있지 않습니다. 관리자에게 문의바랍니다.'); return; }
      setLink({ classTreeId: list[0].classTreeId, linkCode, refId: row.bizTripId, result });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // checkAppr(action) L331-428: 결재상태 이름이 없으면 바로, 반려면 확인 뒤 새 결재요청, 진행 중이면 안내, 그 밖(임시저장)은 문서 열기
  const checkAppr = (row: MyBizTrip, result: boolean) => {
    select(row);
    const statusCode = result ? row.resultApprStatusCode : row.apprStatusCode;
    const statusName = result ? row.resultApprStatusName : row.apprStatusName;
    const apprId = result ? row.resultApprId : row.apprId;
    if (result && row.apprStatusCode !== '30') { message.warning('출장신청서가 완료된 후에 문서작성이 가능합니다.'); return; }
    const domestic = row.bizTripCode === '1';
    const linkCode = result ? (domestic ? 'B12' : 'B14') : (domestic ? 'B11' : 'B13');
    if (!statusName) { void checkDcr(row, linkCode, result); return; }
    if (statusName === '반려') {
      // [E7] msgBox.DialogHide [YES] (L347) → checkDcr() / [E8] msgBox.DialogHide [YES] (L395) → checkDcr()
      Modal.confirm({ title: '확인', content: '새로운 결재요청을 진행하시겠습니까?', okText: '예', cancelText: '아니오', width: 450, onOk: () => void checkDcr(row, linkCode, result) });
      return;
    }
    if (statusCode && PROGRESS_MSG[statusCode]) { message.warning(PROGRESS_MSG[statusCode]); return; }
    apprView(apprId, statusCode);
  };

  // updateApprId() L493-514: emp.Emp53_BizTrip.update → 성공하면 retrieve()
  const updateApprId = async (apprId: number) => {
    if (!link) return;
    try {
      await empBizTripApi.updateApprId(link.refId, apprId, link.result);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // 상세보기 (buildGrid L200-211, L220-236)
  const viewRow = (row: MyBizTrip) => {
    select(row);
    if (row.apprStatusCode == null || row.apprStatusCode === '') { message.warning('문서가 없습니다. 결재요청버튼을 눌러주세요.'); return; }
    apprView(row.apprId, row.apprStatusCode);
  };
  const viewResultRow = (row: MyBizTrip) => {
    select(row);
    if (row.resultApprStatusCode == null || row.resultApprStatusCode === '') { message.warning('문서가 없습니다. 결재요청버튼을 눌러주세요.'); return; }
    if (row.apprStatusCode == null || row.apprStatusCode !== '30') { message.warning('출장신청서가 완료된 후에 문서작성이 가능합니다.'); return; }
    apprView(row.resultApprId, row.resultApprStatusCode);
  };

  // buildGrid() L169-269 (setChecked MULTI, 헤더 묶음 3개)
  const columnDefs = useMemo(() => [
    gb.group('출장기간', [
      gb.date('startDate', 100, '시작일'),  // L251
      gb.date('closeDate', 100, '종료일'),  // L252
    ]),
    gb.textCenter('bizTripName', 100, '구분'),  // L253
    gb.text('destination', 150, '출장지'),  // L254
    gb.text('purpose', 200, '출장목적'),  // L255
    gb.textCenter('num', 100, '출장인원'),  // L256
    gb.text('companion', 150, '동반인'),  // L257
    iconCell<MyBizTrip>('edit', 'editCell', 60, '수정', editRow),  // L258
    gb.group('출장품의', [
      iconCell<MyBizTrip>('edit', 'apprCell', 60, '결재요청', r => checkAppr(r, false)),  // L259
      gb.textCenter('apprStatusName', 80, '결재상태'),  // L260
      iconCell<MyBizTrip>('view', 'viewCell', 60, '상세보기', viewRow),  // L261
    ]),
    { ...gb.group('결과보고', [
      { ...iconCell<MyBizTrip>('edit', 'resultApprCell', 60, '결재요청', r => checkAppr(r, true)), headerStyle: BLUE },  // L262
      gb.textCenter('resultApprStatusName', 80, '결재상태', { headerStyle: BLUE }),  // L263
      { ...iconCell<MyBizTrip>('view', 'resultViewCell', 60, '상세보기', viewResultRow), headerStyle: BLUE },  // L264
    ]), headerStyle: BLUE },
    gb.text('shareInfo', 150, '공유'),  // L265
    iconCell<MyBizTrip>('view', 'shareCell', 60, '', r => { select(r); setShareTrip(r); }),  // L266 shareViewCell L238-244
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L112) → retrieve(), [E2] retrieveButton[조회].Select (L121) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={
            <>
              <Button type="register" onClick={() => setEditTarget('NEW')}>등록</Button>
              <Button type="delete" onClick={deleteRows}>삭제</Button>
              {/* [E5] dcrLinkButton[문서분류지정].Select (L142) → Dcr30_Lookup_Link.open("LinkCode0004", …) */}
              {userManager && <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>}
            </>
          }
        >
          <SearchBar.Field label="조회기간">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 230 }} placeholder="출장지/출장목적" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<MyBizTrip> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bizTripId)} />
        </div>
      </div>
      <Emp53_Lookup_BizTrip target={editTarget} onDone={refresh => { setEditTarget(null); if (refresh) void retrieve(); }} />
      <Emp53_Lookup_BizTripShare
        trip={shareTrip}
        onUpdated={row => setRows(prev => prev.map(r => (r.bizTripId === row.bizTripId ? row : r)))}
        onClose={() => setShareTrip(null)}
      />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0004" onClose={() => setLinkOpen(false)} />
      {/* 상세보기 = retrieveApproval, 결재요청 = insertLinkApproval(classTreeModel, linkCode, 출장 행, …) */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        statusCode={viewStatus}
        link={link ? { classTreeId: link.classTreeId, linkCode: link.linkCode, refId: link.refId } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLink(null); }}
      />
    </div>
  );
};
