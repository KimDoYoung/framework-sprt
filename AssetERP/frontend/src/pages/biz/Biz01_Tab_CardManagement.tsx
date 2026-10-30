/**
 * 법인카드 내역관리 (U15) — 자금관리 > 30. 법인카드관리 > 법인카드 내역관리 #1141
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_CardManagement.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L124-217: north(95) = 왼쪽 86% 툴바 두 줄(1줄 기준년월 70 · 사용자 85 · 제공목적 90 · 검색 320 · [조회][엑셀다운로드] / 2줄 [일괄저장][마감][취소][마감문자발송][계정과목연결]) + 오른쪽 14% 총 승인금액,
 *   center = 사용내역 그리드(체크박스 다중) + 페이징 툴바(500건) + 아래 테두리 칸(문서분류 600 · 상신상태 200 · [상신] · [문서보기]), east 420 = `Biz01_Edit_Account`
 * 1단계(다른 U 화면과 같은 사유): 상신·문서보기가 여는 전자결재 편집창 `Apr01_Edit_ApprDoc`(apr 도메인), [계정과목연결]의 `Act14_Lookup_LinkProvideContent`(act 도메인)는 다음 단계 — [상신]은 AS-IS 점검·확인 창까지 하고
 *   편집창 자리에 안내만 띄운다. RD 엑셀은 `rdDownload`(docs/RD-대책.md).
 * 스타일: SGHF (견본 — docs/page-style.md; `yunhee page-style`은 SGVF로 판정하나 구조는 좌우 분할 + 오른쪽 편집 폼). 툴바가 전체 폭 north(총 승인금액 라벨 포함)라 견본처럼 왼쪽 패널 안에 두지 않는다 (L04와 같음)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 버튼이 많아 UX-02 초기화는 뺀다), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Select, Spin, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizCardManagementApi, bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizCardManagement, BizCodeOption } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { rdDownload } from '@/utils/rdDownload';
import { Crd02_Lookup_OtherList } from '../crd/Crd02_Lookup_OtherList';
import { Biz01_Edit_Account } from './Biz01_Edit_Account';
import { Biz01_Lookup_CardManagement } from './Biz01_Lookup_CardManagement';
import { Biz01_Lookup_CardManagementDownload, DownloadPeriod } from './Biz01_Lookup_CardManagementDownload';
import { Biz01_Lookup_Message } from './Biz01_Lookup_Message';

const gb = gbFor<BizCardManagement>();

/** setToolBar(500) L193 */
const LIMIT = 500;
/** 콤보 빈칸 "전체"의 코드 */
const ALL = '%';
const BLUE = '#456EA6';
/** AS-IS 링크코드 A13 = 법인카드 내역관리 */
const LINK_CODE = 'A13';
const MENU_NAME = 'Biz01_Tab_CardManagement';

/** getDataYm() L930-935: 'yyyy.MM'(또는 'yyyy-MM')으로 읽어 'yyyy.MM'으로 돌려준다. 읽을 수 없으면 null */
function parseYm(text: string): string | null {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim());
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return null;
  return `${m[1]}.${m[2].padStart(2, '0')}`;
}

/** 상신 상태 (apprChk() L879-928) */
interface ApprState {
  code: string;
  name: string;
  apprId: number | null;
  apprEnabled: boolean;
  viewEnabled: boolean;
}
const NOT_SUBMITTED: ApprState = { code: '00', name: '미상신', apprId: null, apprEnabled: true, viewEnabled: false };

export const Biz01_Tab_CardManagement: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizCardManagement>>(null);
  // settings() L219-366: 기준년월 = 지난달(yyyy.MM), 사용자·제공목적 빈칸 = "전체", 검색 320
  const sp = useSearchParams(() => ({
    dataYm: dayjs().subtract(1, 'month').format('YYYY.MM'),
    managerId: ALL,
    providePurCode: ALL,
    searchText: '',
  }));
  const { dataYm, managerId, providePurCode, searchText } = sp.values;

  const [rows, setRows] = useState<BizCardManagement[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const [managers, setManagers] = useState<BizCodeOption[]>([]);
  const [checked, setChecked] = useState<BizCardManagement[]>([]);
  const [current, setCurrent] = useState<BizCardManagement | null>(null);
  const [realUser, setRealUser] = useState(false);
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 선택 규칙에 쓴다)
  const num = useRef(0);
  const lastChecked = useRef<number[]>([]);
  const managerYm = useRef('');

  const [defaultDoc, setDefaultDoc] = useState<Dcr30ClassResult | null>(null);
  const [classTree, setClassTree] = useState<Dcr30ClassResult | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [appr, setAppr] = useState<ApprState>(NOT_SUBMITTED);
  const [accountOpen, setAccountOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [compareYm, setCompareYm] = useState<string | null>(null);

  // getDataYm(): 읽을 수 없는 기준년월은 안내한다
  const cardDate = (): string | null => {
    const ym = parseYm(sp.current.current.dataYm);
    if (!ym) message.warning('기준년월을 yyyy.MM 형식으로 입력하세요');
    return ym;
  };

  // settings() L240-262 · [E3] dataYMText.ValueChange (L243): 서비스 sys.Sys00_Common.selectBizCardManager(companyId, stdYYYYMM) → 사용자 콤보를 다시 읽고 "전체"로
  const loadManagers = useCallback(async (ym: string) => {
    try {
      setManagers(await bizPromoApi.searchCardManagers(ym));
      managerYm.current = ym;
    } catch (err) {
      message.error(errorMessage(err, '사용자 조회 실패'));
    }
  }, []);

  const onYmChange = () => {
    const ym = parseYm(sp.current.current.dataYm);
    if (!ym || ym === managerYm.current) return;
    sp.set('managerId', ALL);
    void loadManagers(ym);
  };

  // apprChk() L879-928: 서비스 biz.Biz05_RelateAppr.selectByDataYm(companyId, "%기준년월%", linkCode A13) — 한 건이면 그 상태(없으면 미상신, 40 반려면 [상신] 다시 가능), 아니면 미상신
  const apprChk = useCallback(async () => {
    const ym = parseYm(sp.current.current.dataYm);
    if (!ym) return;
    try {
      const r = await bizRelateApprApi.getByDataYm(ym, LINK_CODE);
      if (!r || r.statusCode == null) setAppr(NOT_SUBMITTED);
      else if (r.statusCode === '40') setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: true, viewEnabled: true });
      else setAppr({ code: r.statusCode, name: r.statusName ?? '', apprId: r.apprId, apprEnabled: false, viewEnabled: true });
    } catch (err) {
      message.error(errorMessage(err, '상신 상태 조회 실패'));
    }
  }, [sp]);

  // retrieve() L403-431 · totalAmtCheck() L434-466: 서비스 biz.Biz01_Promo.selectByPaging(companyId, dataYm, managerId, providePurCode, searchText) → 읽은 뒤 선택 규칙
  //   (첫 행이 있고 num == 0이면 첫 행 선택, 아니면 num 행에 포커스만) + apprChk() + 서비스 biz.Biz01_Promo.selectByAmt(총 승인금액)
  const load = useCallback(async (toPage: number) => {
    const v = sp.current.current;
    const ym = parseYm(v.dataYm);
    if (!ym) {
      message.warning('기준년월을 yyyy.MM 형식으로 입력하세요');
      return;
    }
    const cond = { dataYm: ym, managerId: v.managerId, providePurCode: v.providePurCode, searchText: v.searchText };
    setBusy(true);
    try {
      const res = await bizCardManagementApi.search({ ...cond, offset: (toPage - 1) * LIMIT, limit: LIMIT });
      gridRef.current?.api?.deselectAll();
      lastChecked.current = [];
      setChecked([]);
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
      setAmount(await bizPromoApi.getCardContentsAmount(cond));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
    await apprChk();
  }, [sp, apprChk]);

  // retrieve(): 다른 쪽에 있으면 1쪽으로 가서 읽는다(toolBar.setActivePage(1))
  const retrieve = useCallback(() => load(1), [load]);

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

  // defaultName() L555-575: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, "A13") — 한 건이면 그 분류, 아니면 안내 문구
  useEffect(() => {
    bizPromoApi.getDocClass(LINK_CODE)
      .then(d => {
        const model = d ? { classTreeId: d.classTreeId, classTreeFullName: d.classTreeFullName } : null;
        setDefaultDoc(model);
        setClassTree(model);
      })
      .catch(() => undefined);
    bizCardManagementApi.getCardRealUser().then(setRealUser).catch(() => undefined);
  }, []);

  // [E0] 화면 열림 (생성자 L124-217) → settings(), defaultName() · [E1] gridToolBar.callbackOnCreate (L187) → retrieve()
  useEffect(() => {
    void loadManagers(sp.current.current.dataYm);
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] grid.SelectionChanged [선택>0] (L276) → retrieveTabpage() L388-401: 고른 내역의 마감 여부로 오른쪽 폼을 잠그고 그 내역을 폼에 넘긴다, num = 그 행 번호
  const onCheckedChange = useCallback((list: BizCardManagement[]) => {
    setChecked(list);
    const ids = list.map(r => r.promoId);
    const added = ids.filter(id => !lastChecked.current.includes(id));
    const keep = lastChecked.current.length > 0 ? lastChecked.current[lastChecked.current.length - 1] : undefined;
    const curId = added.length > 0 ? added[added.length - 1] : (keep !== undefined && ids.includes(keep) ? keep : ids[ids.length - 1]);
    lastChecked.current = ids;
    if (list.length === 0 || curId === undefined) return;
    const cur = list.find(r => r.promoId === curId) ?? list[list.length - 1];
    num.current = Math.max(0, rows.findIndex(r => r.promoId === cur.promoId));
    setCurrent(cur);
  }, [rows]);

  // [E7] selectUpdateButton[일괄저장].Select (L291) → openLookupAccount() L595-615: 고른 내역이 없으면 "선택된 내역이 없습니다." / 첫 고른 내역이 마감이면 "마감처리가 완료되어 일괄반영이 불가합니다."
  //   → Biz01_Lookup_CardManagement.open(내역들, "Biz01_Tab_CardManagement", callback → retrieve())
  const openLookupAccount = () => {
    if (checked.length === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    if (checked[0].closeYn) {
      message.warning('마감처리가 완료되어 일괄반영이 불가합니다.');
      return;
    }
    setAccountOpen(true);
  };

  // [E8] downloadButton[엑셀다운로드].Select (L297) → downloadLookUp() L861-877: Biz01_Lookup_CardManagementDownload.open(기준년월, callback → createRdExcel(기간))
  const downloadLookUp = () => {
    if (!cardDate()) return;
    setDownloadOpen(true);
  };

  // createRdExcel() L799-859: 서비스 sys.Sys99_Print.insertRdCardManagement(companyId, personId, "Biz01_Tab_CardManagement", startYm, closeYm, managerId, providePurCode, searchText)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Biz01_Rd_CardManagement · options "/rexportopt [6] /rxlsopt [100]" · 파일 "법인카드 내역(yyyy.MM[~yyyy.MM]).xlsx" · rv companyId·personId·rdGroupId)
  const createRdExcel = async (p: DownloadPeriod) => {
    const v = sp.current.current;
    const startYm = `${p.startYear}.${p.startMonth}`;
    const closeYm = `${p.closeYear}.${p.closeMonth}`;
    setBusy(true);
    try {
      const groupId = await bizCardManagementApi.rdDownload({ startYm, closeYm, managerId: v.managerId, providePurCode: v.providePurCode, searchText: v.searchText });
      const dataYmTitle = `${p.startYear}${p.startMonth}` === `${p.closeYear}${p.closeMonth}` ? startYm : `${startYm}~${closeYm}`;
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Biz01_Rd_CardManagement',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `법인카드 내역(${dataYmTitle}).xlsx`,
        rv: { rdGroupId: groupId },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // close() L529-553: 서비스 biz.Biz01_Promo.cardClose(companyId, personId, dataYm, procType) → 성공이면 "마감처리가 완료되었습니다."/"취소처리가 완료되었습니다." 뒤 num = 0, retrieve() / 실패면 서버 메시지
  const close = async (actionType: 'P' | 'C') => {
    const ym = cardDate();
    if (!ym) return;
    try {
      await bizCardManagementApi.close(ym, actionType);
      message.success(actionType === 'P' ? '마감처리가 완료되었습니다.' : '취소처리가 완료되었습니다.');
      num.current = 0;
      void retrieve();
    } catch (err) {
      message.warning(errorMessage(err, '처리 실패'));
    }
  };

  // closeCheck(String actionType) L486-527: 목록이 비면 "내역이 존재하지 않습니다." / P는 첫 내역이 마감이면 "이미 마감되었습니다." / C는 마감 전이면 "아직 마감전입니다."
  //   → 확인창 "[ 기준년월 : … ] 마감을 진행하시겠습니까?" / "마감을 취소하시겠습니까?" ([E16] msgBox.DialogHide [YES] (L511) → close())
  const closeCheck = (actionType: 'P' | 'C') => {
    const ym = cardDate();
    if (!ym) return;
    const first = rows[0];
    if (!first) {
      message.warning('내역이 존재하지 않습니다.');
      return;
    }
    if (actionType === 'P') {
      if (first.closeYn) { message.warning('이미 마감되었습니다.'); return; }
    } else if (!first.closeYn) {
      message.warning('아직 마감전입니다.');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `[ 기준년월 : ${ym} ] 마감을 ${actionType === 'P' ? '진행' : '취소'}하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: () => close(actionType),
    });
  };

  // compareCheck() L468-484: 서비스 biz.Biz01_Promo.compareCheck(companyId, dataYm) — 업로드 내역과 금액이 다르면(status -1·1) Crd02_Lookup_OtherList.open(dataYm) / 같으면 closeCheck("P")
  const compareCheck = async () => {
    const ym = cardDate();
    if (!ym) return;
    try {
      const list = await bizCardManagementApi.compare(ym);
      if (list.length > 0) setCompareYm(ym);
      else closeCheck('P');
    } catch (err) {
      message.error(errorMessage(err, '마감 점검 실패'));
    }
  };

  // [E9] closeButton[마감].Select (L303) → closeCheck(Runnable) L774-797: 서비스 biz.Biz01_Promo.closeCheck(목록의 내역들) 마감이 있으면 "이미 마감되었습니다." / 없으면 compareCheck()
  const closeButton = async () => {
    try {
      if (await bizPromoApi.hasClosed(rows.map(r => r.promoId))) {
        message.warning('이미 마감되었습니다.');
        return;
      }
      await compareCheck();
    } catch (err) {
      message.error(errorMessage(err, '마감 확인 실패'));
    }
  };

  // [E11] connectButton[계정과목연결].Select (L315) → Act14_Lookup_LinkProvideContent.open() — act 도메인 조회창은 다음 단계
  const connect = () => { message.info('계정과목연결 창은 다음 단계에서 연결됩니다'); };

  // [E13] apprButton[상신].Select (L329) → checkApproval() L617-644: 문서분류가 없으면 "문서분류를 선택해주세요" → 확인창 "[ 기준년월 : … ] 상신을 진행하시겠습니까?"
  const checkApproval = () => {
    const ym = cardDate();
    if (!ym) return;
    if (classTree?.classTreeId == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `[ 기준년월 : ${ym} ] 상신을 진행하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 400,
      // [E17] msgBox.DialogHide [YES] (L627) → getPromoList() L646-668: biz.Biz01_Promo.selectCardManagement(그 달 전체) → insertLinkApprovals() L670-754:
      //   Apr01_Edit_ApprDoc.insertLinkApprovals(분류, "A13", {내역들, 마감일}, isAdmin, callback → updateApprId(apprId)) → biz.Biz05_RelateAppr.insert — 전자결재 편집창은 다음 단계
      onOk: () => { message.info('전자결재 작성 창은 다음 단계에서 연결됩니다'); },
    });
  };

  // [E14] apprViewButton[문서보기].Select (L335) → 서비스 apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(…, callback → apprChk()) — 전자결재 편집창은 다음 단계
  const apprView = () => { message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다'); };

  // buildGrid(): 행번호 + 체크박스(다중) + 12열
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 70, '마감구분'),
    gb.text('htmlCardName', 110, '카드명'),
    gb.textCenter('regEmpName', 100, '사용자'),
    gb.date('approvalDt', 90, '카드승인일'),  // 원본 100 — UX-08 읽기 전용 날짜는 90
    gb.text('franchiseName', 200, '가맹점명'),
    gb.text('sectorName', 150, '업종'),
    gb.long('provideAmt', 100, '승인금액'),
    gb.textCenter('providePurName', 100, '제공목적'),
    gb.textCenter('provideContentName', 100, '제공내역'),
    gb.text('accountName', 130, '계정과목'),
    gb.textCenter('taxTypeName', 70, '과세구분'),
    gb.text('note', 300, '비고(사용내역)'),
  ], []);

  const docText = classTree?.classTreeFullName ?? '';
  const docPlaceholder = defaultDoc?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';
  const ym = parseYm(dataYm) ?? dataYm;

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, border: '1px solid #d9d9d9', padding: '8px 10px', boxSizing: 'border-box' }}>
        <div style={{ flex: 6, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E6] retrieveButton[조회].Select (L284) → retrieve() · [E2] dataYMText.KeyPress [Enter] (L235) · [E4] searchText.KeyPress [Enter] (L267) → retrieve() */}
          <SearchBar
            onSearch={() => { num.current = 0; return retrieve(); }}
            extra={<Button type="download" onClick={downloadLookUp}>엑셀다운로드</Button>}
          >
            <SearchBar.Field label="기준년월">
              <SearchBar.Input style={{ width: 80 }} placeholder="YYYY.MM" value={dataYm}
                onChange={e => sp.set('dataYm', e.target.value)} onBlur={onYmChange} />
            </SearchBar.Field>
            <SearchBar.Field label="사용자">
              <Select<string>
                style={{ width: 120 }}
                value={managerId}
                options={[{ value: ALL, label: '전체' }, ...managers.map(m => ({ value: m.code, label: m.name }))]}
                onChange={code => sp.set('managerId', code)}
              />
            </SearchBar.Field>
            <SearchBar.Field label="제공목적">
              <SystemCodeComboBox
                kindGroupCd="ProvidePurCode002"
                altCode={[ALL, '전체']}
                style={{ width: 120 }}
                value={providePurCode}
                onChange={code => sp.set('providePurCode', code ?? ALL)}
              />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 320 }} placeholder="카드명/가맹점명/업종/제공목적/제공내역/계정과목"
                value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          {/* [E7] 일괄저장 · [E9] 마감 · [E10] closeCancelButton[취소].Select (L309) → closeCheck("C") · [E15] sendButton[마감문자발송].Select (L360) → sendMessage() L957-960: Biz01_Lookup_Message.open(기준년월) · [E11] 계정과목연결 */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button type="save" onClick={openLookupAccount}>일괄저장</Button>
            <Button type="save" onClick={closeButton}>마감</Button>
            <Button type="cancel" onClick={() => closeCheck('C')}>취소</Button>
            <Button type="send" onClick={() => { if (cardDate()) setMessageOpen(true); }}>마감문자발송</Button>
            <Button type="save" onClick={connect}>계정과목연결</Button>
          </div>
        </div>
        {/* totalAmtCheck() L434-466: label01 — 총 승인금액 (오른쪽 정렬, 14px 굵게, 금액은 #456EA6) */}
        <div style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          총 승인금액 : <span style={{ color: BLUE }}>{amount.toLocaleString()}</span> 원
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel min={600}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <MultiGrid<BizCardManagement>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.promoId)}
                  onCheckedChange={onCheckedChange}
                />
                {busy && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="Loading" />
                  </div>
                )}
              </div>
              <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p)} />
              {/* [E12] classTreeFullName[문서분류].TriggerClick (L323) → openLookupDoc() L583-592: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류를 칸에 넣는다 */}
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
            <div style={{ height: '100%', boxSizing: 'border-box' }}>
              <Biz01_Edit_Account promo={current} closed={!!current?.closeYn} realUser={realUser} onSaved={() => void retrieve()} />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <Dcr30_Move_DcrClass open={docOpen} onResult={r => { setDocOpen(false); setClassTree(r); }} onClose={() => setDocOpen(false)} />
      <Biz01_Lookup_CardManagement open={accountOpen} rows={checked} menuName={MENU_NAME} onSaved={() => void retrieve()} onClose={() => setAccountOpen(false)} />
      <Biz01_Lookup_CardManagementDownload open={downloadOpen} dataYm={ym} onResult={p => void createRdExcel(p)} onClose={() => setDownloadOpen(false)} />
      <Biz01_Lookup_Message open={messageOpen} dataYm={ym} onClose={() => setMessageOpen(false)} />
      <Crd02_Lookup_OtherList open={compareYm != null} dataYm={compareYm ?? ym} onClose={() => setCompareYm(null)} />
    </div>
  );
};
