/**
 * 이익제공 입력(법인카드) (L02) — 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(법인카드) #1131
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_Card.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L99-164: center = 툴바1(승인기간 ~ · 검색 · [조회] · [출력/다운로드]) + 툴바2([일괄저장] · [거래처 관리 바로가기]) + 카드 사용내역 그리드(체크박스 다중)
 *   + 아래 테두리 칸(문서분류 · 상신상태 · [상신] · [문서보기]), east 420 = 위 `Biz01_Edit_Card`(300) + 아래 `Biz02_Grid_PersonList`(직원 · 거래상대방)
 * 1단계(F·G 변환과 같은 사유): 상신이 여는 전자결재 편집창 `Apr01_Edit_ApprDoc`(다른 도메인 apr)은 다음 단계 — [상신]·[문서보기]는 AS-IS 점검·확인 창까지 하고 편집창 자리에 안내만 띄운다.
 *   RD 출력은 `rdApi`로 주소를 받아 `RdViewer`에 띄운다(docs/RD-대책.md).
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizPromoCard } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';
import { openMenuByNo } from '@/utils/tempData';
import { Biz01_Edit_Card } from './Biz01_Edit_Card';
import { Biz02_Grid_PersonList } from './Biz02_Grid_PersonList';
import { Biz01_Lookup_CardManagement } from './Biz01_Lookup_CardManagement';

const gb = gbFor<BizPromoCard>();

/** AS-IS 링크코드 A41 = 이익제공(법인카드) */
const LINK_CODE = 'A41';
/** 거래처 관리 바로가기가 여는 메뉴 화면번호 (Mkt01_Tab_TargetCompany) */
const CONTACT_MENU_NO = '1405';

const fmtDate = (d: Dayjs) => d.format('YYYY-MM-DD');
const fmtYm = (d: Dayjs) => d.format('YYYY.MM');

/** 상신 상태 (apprChk() L572-622) */
interface ApprState {
  code: string;
  name: string;
  apprId: number | null;
  apprEnabled: boolean;
  viewEnabled: boolean;
}
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };

export const Biz01_Tab_Card: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizPromoCard>>(null);
  // setting() L166-310: 승인기간 = 지난달 1일 ~ 지난달 말일
  const sp = useSearchParams(() => {
    const start = dayjs().subtract(1, 'month').startOf('month');
    return { startDate: start, closeDate: start.endOf('month'), searchText: '' };
  });
  const { startDate, closeDate, searchText } = sp.values;

  const [rows, setRows] = useState<BizPromoCard[]>([]);
  const [afterLoad, setAfterLoad] = useState(0);
  const [checked, setChecked] = useState<BizPromoCard[]>([]);
  const [current, setCurrent] = useState<BizPromoCard | null>(null);
  const [closed, setClosed] = useState(false);
  const [personRefresh, setPersonRefresh] = useState(0);
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);
  const lastChecked = useRef<number[]>([]);

  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(NOT_SUBMITTED);
  const [accountOpen, setAccountOpen] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // apprChk() L572-622: 서비스 biz.Biz05_RelateAppr.selectByPersonId(companyId, dataYm = 승인기간 시작월 yyyy.MM, linkCode A41, personId = 로그인 사원)
  const apprChk = useCallback(async () => {
    try {
      const r = await bizRelateApprApi.getByPerson(fmtYm(sp.current.current.startDate), LINK_CODE);
      if (!r || r.statusCode == null) setAppr(NOT_SUBMITTED);
      else if (r.statusCode === '40') setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: true, viewEnabled: true });
      else setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: false, viewEnabled: true });
    } catch (err) {
      message.error(errorMessage(err, '상신 상태 조회 실패'));
    }
  }, [sp]);

  // retrieve() L399-421: 서비스 biz.Biz01_Promo.selectByCard(companyId, personId, startDate, closeDate, searchText = '%…%') → 목록을 다시 읽으면 선택이 풀린다.
  //   첫 행이 있고 num == 0이면 첫 행을 고르고, 아니면 num 행에 포커스만 둔다. 끝나면 apprChk()
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      const list = await bizPromoApi.searchCards(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText);
      gridRef.current?.api.deselectAll();
      lastChecked.current = [];
      setChecked([]);
      setRows(list);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await apprChk();
  }, [sp, apprChk]);

  // 목록이 바뀐 뒤(afterLoad) 선택 규칙 적용
  useEffect(() => {
    if (afterLoad === 0) return;
    const api = gridRef.current?.api;
    if (!api || rows.length === 0) return;
    if (num.current === 0) {
      api.getRowNode(String(rows[0].promoId))?.setSelected(true);
    } else {
      const i = Math.min(num.current, rows.length - 1);
      api.ensureIndexVisible(i);
      api.setFocusedCell(i, 'htmlCardName');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // defaultName() L447-467: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, "A41") — 한 건이면 그 분류, 아니면 안내 문구
  useEffect(() => {
    bizPromoApi.getDocClass(LINK_CODE)
      .then(d => {
        const model = d ? { classTreeId: d.classTreeId, classTreeFullName: d.classTreeFullName } : null;
        setDefaultDoc(model);
        setClassTree(model);
      })
      .catch(() => undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L99-164) → setting(), defaultName(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // checkClose() L358-397: 마감 여부 = 내역의 마감(closeYn·closeName) 또는 이번 달 상신이 진행 중(상태가 없지 않고 40 반려가 아님)
  //   (AS-IS는 상신 조회 결과를 다음 호출에서야 쓴다 — 여기서는 그 자리에서 읽는다)
  const checkClose = useCallback(async (model: BizPromoCard): Promise<boolean> => {
    let relateClosed = false;
    try {
      const r = await bizRelateApprApi.getByPerson(fmtYm(sp.current.current.startDate), LINK_CODE);
      if (r && r.statusCode != null && r.statusCode !== '40') relateClosed = true;
    } catch {
      relateClosed = false;
    }
    return !!model.closeYn || !!model.closeName || relateClosed;
  }, [sp]);

  // [E1] grid.SelectionChanged [선택>0] (L191) → retrieveTabpage() L335-356: 마감 여부로 편집 칸·인원 칸 버튼을 켜고 끄고, 고른 내역을 편집 칸·인원 칸에 넘긴다
  const onCheckedChange = useCallback(async (list: BizPromoCard[]) => {
    setChecked(list);
    const ids = list.map(r => r.promoId);
    const added = ids.filter(id => !lastChecked.current.includes(id));
    const keep = lastChecked.current.length > 0 ? lastChecked.current[lastChecked.current.length - 1] : undefined;
    const curId = added.length > 0 ? added[added.length - 1] : (keep !== undefined && ids.includes(keep) ? keep : ids[ids.length - 1]);
    lastChecked.current = ids;
    if (list.length === 0 || curId === undefined) {
      setCurrent(null);
      return;
    }
    const cur = list.find(r => r.promoId === curId) ?? list[list.length - 1];
    const closeYn = await checkClose(cur);
    setClosed(closeYn);
    num.current = rows.findIndex(r => r.promoId === cur.promoId);
    if (num.current < 0) num.current = 0;
    setCurrent(cur);
  }, [checkClose, rows]);

  // [E2] downLoadButton[출력/다운로드].Select (L206) → 서비스 sys.Sys99_Print.insertRdCard(companyId, personId, "Biz01_Tab_Card", startDate, closeDate, searchText) → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Biz01_Rd_Card · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const downLoad = async () => {
    const v = sp.current.current;
    try {
      const groupId = await bizPromoApi.rdPrint(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Biz01_Rd_Card',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: fmtDate(v.startDate), closeDate: fmtDate(v.closeDate) },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E5] contactPointButton[거래처 관리 바로가기].Select (L263) → MenuOpener.openTabCallback(MenuGrid.tabPanel, "1405", …)
  const contactPoint = () => {
    if (!openMenuByNo(CONTACT_MENU_NO)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
  };

  // [E6] selectUpdateButton[일괄저장].Select (L275) → closeCheck() L624-656: 선택 없음 "선택된 내역이 없습니다." → 마감·상신 내역이 있으면 "마감 또는 상신된 내역이 있습니다. 다시 확인바랍니다"
  //   → 서비스 biz.Biz01_Promo.closeCheck(고른 내역들) 마감이면 "마감된 내역이 있습니다. 다시 확인바랍니다." → openLookupAccount() L424-433
  const selectUpdate = async () => {
    if (checked.length === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    try {
      for (const model of checked) {
        if (await checkClose(model)) {
          message.warning('마감 또는 상신된 내역이 있습니다. 다시 확인바랍니다');
          return;
        }
      }
      if (await bizPromoApi.hasClosed(checked.map(r => r.promoId))) {
        message.warning('마감된 내역이 있습니다. 다시 확인바랍니다.');
        return;
      }
      setAccountOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '마감 확인 실패'));
    }
  };

  // [E7] classTreeFullName[문서분류].TriggerClick (L283) → openLookupDoc() L436-445: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다
  const onDocResult = (r: Dcr30ClassResult) => {
    setDocOpen(false);
    setClassTree(r);
  };

  // [E8] apprButton[상신].Select (L289) → checkApproval() L469-507
  const checkApproval = () => {
    const v = sp.current.current;
    const monthStart = v.startDate.startOf('month');
    const monthClose = monthStart.endOf('month');
    if (classTree?.classTreeId == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    if (fmtDate(monthClose) !== fmtDate(v.closeDate) || fmtDate(monthStart) !== fmtDate(v.startDate)) {
      message.warning('상신하려는 달의 1일 ~ 말일로 맞춰주시길 바랍니다.');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `[ 기준년월 : ${v.startDate.format('YYYY년 MM월')} ] 상신을 진행하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      // [E10] msgBox.DialogHide [YES] (L491) → insertLinkApprovals() L510-528: Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A41", printModel, isAdmin, callback → updateApprId(apprId)
      //   → biz.Biz05_RelateAppr.insertPersonId → "정상적으로 상신이 완료되었습니다") — 전자결재 편집창은 다음 단계
      onOk: () => { message.info('전자결재 작성 창은 다음 단계에서 연결됩니다'); },
    });
  };

  // [E9] apprViewButton[문서보기].Select (L295) → 상태 99(임시저장)면 안내 뒤 apprView() L549-570: apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(…, callback → apprChk()) — 전자결재 편집창은 다음 단계
  const apprView = () => {
    const open = () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    if (appr.code === '99') {
      Modal.info({ title: '알림', content: '해당 문서는 과거에 임시저장한 문서입니다. 현재 데이터와 상이할 수 있습니다.', okText: '확인', onOk: open });
    } else {
      open();
    }
  };

  // buildGrid() L312-333
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 70, '마감구분'),  // L317
    gb.text('htmlCardName', 150, '카드명'),  // L318
    gb.date('approvalDt', 90, '카드승인일'),  // L319 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('franchiseName', 200, '가맹점명'),  // L320
    gb.text('sectorName', 150, '업종'),  // L321
    gb.long('approvalAmount', 100, '승인금액'),  // L322
    gb.textCenter('providePurName', 150, '제공목적'),  // L323
    gb.textCenter('provideContentName', 150, '제공내역'),  // L324
    gb.long('totalPeple', 70, '인원'),  // L325
    gb.long('averagePrice', 100, '인당 경제적가치'),  // L326
    gb.text('note', 300, '비고'),  // L327
  ], []);

  const docText = classTree?.classTreeFullName ?? '';
  const docPlaceholder = defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={600}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* [E3] retrieveButton[조회].Select (L249) → retrieve() · [E4] searchTextField.KeyPress [Enter] (L255) → retrieve() */}
              <SearchBar onSearch={retrieve} onReset={sp.reset} extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}>
                <SearchBar.Field label="승인기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
                  <span>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 270 }} placeholder="카드명/가맹점/업종/비고" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="save" onClick={selectUpdate}>일괄저장</Button>
                <Button type="goto" onClick={contactPoint}>거래처 관리 바로가기</Button>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MultiGrid<BizPromoCard>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.promoId)}
                onCheckedChange={list => { void onCheckedChange(list); }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 10px', borderTop: '1px solid #d9d9d9', background: '#fff' }}>
              <span style={{ fontWeight: 'bold' }}>문서분류</span>
              <LookupInput value={docText} placeholder={docPlaceholder} width={500} onOpen={() => setDocOpen(true)} />
              <span style={{ fontWeight: 'bold' }}>상신상태</span>
              <Input style={{ width: 115 }} readOnly value={appr.name} />
              <Button type="register" disabled={!appr.apprEnabled} onClick={checkApproval}>상신</Button>
              <Button type="search" disabled={!appr.viewEnabled} onClick={apprView}>문서보기</Button>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={420} min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 300, flex: 'none' }}>
              <Biz01_Edit_Card promo={current} closed={closed} onSaved={() => void retrieve()} onEmpAdded={() => setPersonRefresh(n => n + 1)} />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Biz02_Grid_PersonList promo={current} closed={closed} refreshKey={personRefresh} onChanged={() => void retrieve()} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Dcr30_Move_DcrClass open={docOpen} onResult={onDocResult} onClose={() => setDocOpen(false)} />
      <Biz01_Lookup_CardManagement open={accountOpen} rows={checked} menuName="Biz01_Tab_Card" onSaved={() => void retrieve()} onClose={() => setAccountOpen(false)} />
      <RdViewer url={rdUrl} title="이익제공(수령) 법인카드 사용내역" onClose={() => setRdUrl(null)} />
    </div>
  );
};
