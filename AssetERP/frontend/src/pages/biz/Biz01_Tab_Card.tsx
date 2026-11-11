/**
 * 이익제공 입력(법인카드) (L02) — 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(법인카드) #1131
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_Card.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L106-176: center = 툴바1(승인기간 ~ · 계정과목 · 검색 · [v]미상신건만 조회 · [조회]) + 툴바2([일괄저장] · [상신] · [거래처 관리 바로가기] · [출력/다운로드])
 *   + 카드 사용내역 그리드(체크박스 다중), east 420 = 위 `Biz01_Edit_Card`(300) + 아래 `Biz02_Grid_PersonList`(직원 · 거래상대방)
 * 원본 2026-11-04~10(0b44846d9·c0b1e1146·0c3baa89c, 대장 CH-0005·0158 외): 아래 칸(문서분류·상신상태·[상신]·[문서보기])과 그 달 상신(Biz05_RelateAppr)을 없애고
 *   고른 내역을 행 단위로 상신한다 — [상신] = checkLimit() → checkApproval() → 결재창(A41, 제목은 화면이 만든다) → 저장 뒤 내역에 문서 ID(updateByApprId) + 첨부 엑셀.
 *   그리드 첫 열 상신상태·[보기](그 행의 문서). RD 첨부 PDF(createRd → Sys99_Print.insertRdCardSimple, Biz01_Rd_CardSimple)는 #1311과 같이 하지 않는다
 *   (TOBE에 RD PDF 첨부가 없다 — 원본도 파일 경로가 없는 개발계는 PDF 없이 바로 결재창으로 간다).
 *   RD 출력은 `rdApi`로 주소를 받아 `RdViewer`에 띄운다(docs/RD-대책.md).
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 그리드 날짜 폭(UX-08)
 * 스타일: SGHF (견본 — docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Select, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizCodeOption, BizPromoCard } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { RdViewer } from '@/components/lookup/RdViewer';
import { openMenuByNo } from '@/utils/tempData';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Biz01_Edit_Card } from './Biz01_Edit_Card';
import { Biz02_Grid_PersonList } from './Biz02_Grid_PersonList';
import { Biz01_Lookup_CardManagement } from './Biz01_Lookup_CardManagement';

const gb = gbFor<BizPromoCard>();

/** AS-IS 링크코드 A41 = 이익제공(법인카드) */
const LINK_CODE = 'A41';
/** 거래처 관리 바로가기가 여는 메뉴 화면번호 (Mkt01_Tab_TargetCompany) */
const CONTACT_MENU_NO = '1405';

/** 계정과목 콤보 "전체"(CommonComboBoxField(…, "%", "전체")) */
const ALL = '%';
/** 상신중·결재중·완료 — 다시 상신할 수 없는 결재상태 (checkApproval L555) */
const IN_APPR = ['10', '20', '30'];

const fmtDate = (d: Dayjs) => d.format('YYYY-MM-DD');
const fmtYm = (d: Dayjs) => d.format('YYYY.MM');

export const Biz01_Tab_Card: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizPromoCard>>(null);
  // setting() L166-310: 승인기간 = 지난달 1일 ~ 지난달 말일
  const sp = useSearchParams(() => {
    const start = dayjs().subtract(1, 'month').startOf('month');
    return { startDate: start, closeDate: start.endOf('month'), searchText: '', accountCode: ALL, apprCheck: false };
  });
  const { startDate, closeDate, searchText, accountCode, apprCheck } = sp.values;
  const [accountOptions, setAccountOptions] = useState<BizCodeOption[]>([]);

  const [rows, setRows] = useState<BizPromoCard[]>([]);
  const [afterLoad, setAfterLoad] = useState(0);
  const [checked, setChecked] = useState<BizPromoCard[]>([]);
  const [current, setCurrent] = useState<BizPromoCard | null>(null);
  const [closed, setClosed] = useState(false);
  const [personRefresh, setPersonRefresh] = useState(0);
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);
  const lastChecked = useRef<number[]>([]);

  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  /** insertLinkApprovals() L716-742: 결재창에 넘기는 문서분류·제목(printModel.string02)과 고른 내역(selectList) */
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; title: string; promoIds: number[] } | null>(null);

  // retrieve() L455-480: 서비스 biz.Biz01_Promo.selectByCard(companyId, personId, startDate, closeDate, searchText = '%…%', apprCheck, accountId) → 목록을 다시 읽으면 선택이 풀린다.
  //   첫 행이 있고 num == 0이면 첫 행을 고르고, 아니면 num 행에 포커스만 둔다 (원본 2026-11-04: 끝의 apprChk()는 없어졌다)
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      const list = await bizPromoApi.searchCards(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText,
        { apprCheck: v.apprCheck, accountId: v.accountCode === ALL ? null : Number(v.accountCode) });
      gridRef.current?.api?.deselectAll();
      lastChecked.current = [];
      setChecked([]);
      setRows(list);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // setting() L198-228: 승인기간 시작·끝 칸이 바뀌면(그리고 처음에) 계정과목 콤보를 다시 읽고 "전체"로 — 서비스 sys.Sys00_Common.selectAccountName(companyId, personId, startDate, closeDate)
  useEffect(() => {
    sp.set('accountCode', ALL);
    bizPromoApi.cardAccountNames(fmtDate(startDate), fmtDate(closeDate))
      .then(setAccountOptions)
      .catch(err => message.error(errorMessage(err, '계정과목 조회 실패')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, closeDate]);

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

  // defaultName() L508-527: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, "A41") — 한 건이면 그 분류(상신에 쓴다), 아니면 없음
  useEffect(() => {
    bizPromoApi.getDocClass(LINK_CODE)
      .then(d => setClassTree(d ? { classTreeId: d.classTreeId, classTreeFullName: d.classTreeFullName } : null))
      .catch(() => undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L106-176) → setting(), defaultName(). 원본 2026-11-04부터 생성자 끝의 retrieve()는 주석 처리됨 — 열면 빈 그리드, [조회]로 읽는다

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

  // [E3] grid.SelectionChanged [선택>0] (L191) → retrieveTabpage() L335-356: 마감 여부로 편집 칸·인원 칸 버튼을 켜고 끄고, 고른 내역을 편집 칸·인원 칸에 넘긴다
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

  // [E4] downLoadButton[출력/다운로드].Select → 서비스 sys.Sys99_Print.insertRdCard(companyId, personId, "Biz01_Tab_Card", startDate, closeDate, searchText, apprCheck) → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Biz01_Rd_Card · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  //   (원본 2026-11-04: [미상신건만 조회]도 넘긴다. 계정과목은 넘기지 않는다)
  const downLoad = async () => {
    const v = sp.current.current;
    try {
      const groupId = await bizPromoApi.rdPrint(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText, v.apprCheck);
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

  // [E7] contactPointButton[거래처 관리 바로가기].Select → MenuOpener.openTabCallback(MenuGrid.tabPanel, "1405", …)
  const contactPoint = () => {
    if (!openMenuByNo(CONTACT_MENU_NO)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
  };

  // [E8] selectUpdateButton[일괄저장].Select → closeCheck(): 선택 없음 "선택된 내역이 없습니다." → 마감·상신 내역이 있으면 "마감 또는 상신된 내역이 있습니다. 다시 확인바랍니다"
  //   → 서비스 biz.Biz01_Promo.closeCheck(고른 내역들) 마감이면 "마감된 내역이 있습니다. 다시 확인바랍니다." → openLookupAccount()
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

  // checkApproval() L541-627: 고른 내역 중 상신중·결재중·완료(10·20·30)가 있으면 막는다. 승인일의 달이 둘 이상이면 막는다.
  //   제목 = "[법인카드] yyyy년 MM월 지출결의 승인 요청의건" + 계정과목(고른 순서의 첫 이름, 둘 이상이면 " 외 n") → "n건의 상신을 진행하시겠습니까?"
  //   [YES] → createRd(): RD 첨부 PDF(Sys99_Print.insertRdCardSimple · Biz01_Rd_CardSimple)는 하지 않는다(머리 설명) → insertLinkApprovals()
  const checkApproval = (list: BizPromoCard[], classTreeId: number) => {
    const accountNames: string[] = [];
    const months: string[] = [];
    for (const item of list) {
      if (item.apprStatusCode && IN_APPR.includes(item.apprStatusCode)) {
        message.warning('이미 상신중이거나 완료된 문서가 존재합니다');
        return;
      }
      const acc = item.accountName?.trim();
      if (acc && !accountNames.includes(acc)) accountNames.push(acc);
      const ym = item.approvalDt ? dayjs(item.approvalDt).format('YYYY년 MM월') : '';
      if (ym && !months.includes(ym)) months.push(ym);
    }
    let titleAccountName = '';
    if (accountNames.length > 0) {
      titleAccountName = '_' + accountNames[0];
      if (accountNames.length > 1) titleAccountName += ' 외 ' + (accountNames.length - 1);
    }
    if (months.length > 1) {
      message.warning('상신하려는 내역의 월을 맞춰주시길 바랍니다. (월단위)');
      return;
    }
    const title = `[법인카드] ${months[0] ?? ''} 지출결의 승인 요청의건${titleAccountName}`;
    Modal.confirm({
      title: '확인',
      content: `${list.length}건의 상신을 진행하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      // [E10] msgBox.DialogHide [YES] (L612) → createRd()(PDF 없이) → insertLinkApprovals() L716-742: Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A41", {selectList, printModel}, isAdmin, callback → updateApprId(apprId))
      onOk: () => setLinkDoc({ classTreeId, title, promoIds: list.map(r => r.promoId) }),
    });
  };

  // [E9] apprButton[상신].Select → checkLimit() L528-555: 문서분류가 없으면 "문서분류가 설정되어 있지 않습니다." · 고른 내역이 없으면 "선택된 항목이 존재하지 않습니다."
  //   → 서비스 biz.Biz01_Promo.selectTargetInfoReqYn(고른 내역) 0이 아니면 "거래상대방은 필수입력입니다." → checkApproval()
  const checkLimit = async () => {
    if (classTree?.classTreeId == null) {
      message.warning('문서분류가 설정되어 있지 않습니다.');
      return;
    }
    if (checked.length === 0) {
      message.warning('선택된 항목이 존재하지 않습니다.');
      return;
    }
    try {
      if (await bizPromoApi.countTargetInfoMissing(checked.map(r => r.promoId)) > 0) {
        message.warning('거래상대방은 필수입력입니다.');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '거래상대방 확인 실패'));
      return;
    }
    checkApproval(checked, classTree.classTreeId);
  };

  // updateApprId(apprId) L744-781: 서비스 biz.Biz01_Promo.updateByApprId(apprId, 고른 내역) → "정상적으로 상신이 완료되었습니다" → retrieve().
  //   원본은 결재창 저장 때 첨부 엑셀(createCardExcel2: 고른 내역, 파일 이름 = 제목)을 먼저 만든다 — TOBE는 문서 ID가 정해지는 이 한 번에 같이(POST biz/promos/cards/appr-link)
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    try {
      await bizPromoApi.linkCardAppr(apprId, linkDoc.promoIds, linkDoc.title);
      message.success('정상적으로 상신이 완료되었습니다');
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '상신 내역을 기록하지 못했습니다'));
    }
  };

  // 그리드 [보기] 셀(ImageCell) → viewAppr() L783-812: 그 행에 상신 문서가 없으면 "상신문서가 존재하지 않습니다", 있으면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval
  const viewAppr = (row: BizPromoCard) => {
    if (row.apprId == null) {
      message.warning('상신문서가 존재하지 않습니다');
      return;
    }
    setViewApprId(row.apprId);
  };

  // buildGrid() L350-384 (원본 2026-11-04: 첫 열 상신상태·[보기], 비고가 승인금액 뒤로, 마감구분이 끝으로, 폭 변경)
  const columnDefs = useMemo(() => [
    gb.textCenter('apprStatusName', 70, '상신상태'),
    { ...iconCell<BizPromoCard>('view', 'actionCell', 40, '보기', row => viewAppr(row)) },
    gb.text('htmlCardName', 150, '카드명'),
    gb.date('approvalDt', 90, '카드승인일'),
    gb.text('franchiseName', 180, '가맹점명'),
    gb.text('sectorName', 130, '업종'),
    gb.long('approvalAmount', 100, '승인금액'),
    gb.text('note', 230, '비고'),
    gb.textCenter('providePurName', 150, '제공목적'),
    gb.textCenter('provideContentName', 150, '제공내역'),
    gb.long('totalPeple', 70, '인원'),
    gb.long('averagePrice', 100, '인당 경제적가치'),
    gb.textCenter('closeName', 70, '마감구분'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={600}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ padding: '0 10px 10px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* [E5] retrieveButton[조회].Select → retrieve() · [E6] searchTextField.KeyPress [Enter] → retrieve() */}
              <SearchBar onSearch={retrieve} onReset={sp.reset}>
                <SearchBar.Field label="승인기간">
                  {/* [E1] startDate.Change · [E2] closeDate.Change → 계정과목 콤보 다시 읽기(위 useEffect) */}
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
                  <span>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
                </SearchBar.Field>
                <SearchBar.Field label="계정과목">
                  <Select style={{ width: 130 }} value={accountCode} onChange={v => sp.set('accountCode', v)}
                    options={[{ value: ALL, label: '전체' }, ...accountOptions.map(o => ({ value: o.code, label: o.name }))]} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 230 }} placeholder="카드명/가맹점/업종/비고" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={apprCheck} onChange={e => sp.set('apprCheck', e.target.checked)}>미상신건만 조회</Checkbox>
              </SearchBar>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="save" onClick={selectUpdate}>일괄저장</Button>
                <Button type="register" onClick={checkLimit}>상신</Button>
                <Button type="goto" onClick={contactPoint}>거래처 관리 바로가기</Button>
                <Button type="download" onClick={downLoad}>출력/다운로드</Button>
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
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={420} min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ height: 300, flex: 'none' }}>
              <Biz01_Edit_Card promo={current} closed={closed} onSaved={() => void retrieve()} onEmpAdded={() => setPersonRefresh(n => n + 1)} />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Biz02_Grid_PersonList promo={current} closed={closed} refreshKey={personRefresh} onChanged={() => void retrieve()} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Biz01_Lookup_CardManagement open={accountOpen} rows={checked} menuName="Biz01_Tab_Card" onSaved={() => void retrieve()} onClose={() => setAccountOpen(false)} />
      <RdViewer url={rdUrl} title="이익제공(수령) 법인카드 사용내역" onClose={() => setRdUrl(null)} />
      {/* insertLinkApprovals() / viewAppr(): Apr01_Edit_ApprDoc (A41 제목은 화면이 만든 title — 서버 link-seed가 받는다) */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: LINK_CODE, args: { title: linkDoc.title } } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
