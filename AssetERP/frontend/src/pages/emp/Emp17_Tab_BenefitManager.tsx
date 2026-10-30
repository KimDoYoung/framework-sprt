/**
 * [1222] 자금관리 > 20. 사업비관리 > 복리후생비 관리 (U05)
 * AS-IS: myApp/client/vi/emp/Emp17_Tab_BenefitManager.java (1103줄) + Emp17_Edit_Note.java (139줄) + Emp55_Lookup_account.java (144줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L124-216: BorderLayout 위 0.45(여백 20,20,0,20) = 툴바 50("▼ 신청내역" · 조회기간 100 ~ 100 · 신청구분 120 · 검색 230 "신청구분/사원명/문서명" · [조회][지출결의등록][문서분류지정][복리후생비 설정]) + 그리드(행번호, 체크 다중, 11열, 합계 행),
 *   가운데(여백 -1,20,20,20) = 툴바 50("▼ 지출결의내역" · 기준년월 년 45 + 월 콤보 55 · 신청구분 120 · 지급여부 100 · 검색 230 · [조회][지출결의제거][지급확인][지급취소]) + 그리드(행번호, 체크 다중, 9열, 합계 행) + 폼 70(문서분류 800 · 상신상태 250 · [상신][문서보기])
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] 위 그리드 [신청문서보기] 아이콘·아래 그리드 [신청문서보기] 아이콘·[상신]·[문서보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc(retrieveApproval·insertLinkApprovals)은 다른 도메인이라 지금은 안내만 한다.
 *   [상신]은 편집창이 열릴 자리까지(내용 없음·문서분류 미지정 검사)를 원본 그대로 하고, 결재 뒤 updatePayRequestApprId API(PUT emp/benefits/pay-requests/appr-id)는 만들어 두었다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Select, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { empBenefitApi, empBenefitInfoApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Benefit, BenefitType } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Emp17_Edit_Note } from './Emp17_Edit_Note';
import { Emp55_Lookup_account } from './Emp55_Lookup_account';

/** 아래 그리드 행: 지급여부 글자(AS-IS Emp17_BenefitModel.getBenefitYnStr L150-156 — 지급완료가 아니면 미지급) */
type BenefitRow = Benefit & { benefitYnStr: string };

const gb = gbFor<Benefit>();
const gb2 = gbFor<BenefitRow>();
const FORMAT = 'YYYY-MM-DD';
const ALL_TYPE: BenefitType = { code: '%', name: '전체' };
const YN_OPTIONS = ['전체', '지급완료', '미지급'];
const NO_CLASS_TEXT = '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';

const toRow = (b: Benefit): BenefitRow => ({ ...b, benefitYnStr: b.benefitYn === 'true' ? '지급완료' : '미지급' });

export const Emp17_Tab_BenefitManager: React.FC = () => {
  const gridRef = useRef<AgGridReact<Benefit>>(null);
  const payGridRef = useRef<AgGridReact<BenefitRow>>(null);
  // 위: 조회기간(올해 1월 1일 ~ 오늘), 신청구분(기본 전체), 검색 — settings() L218-393
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [types, setTypes] = useState<BenefitType[]>([]);
  const [benefitCode, setBenefitCode] = useState('%');
  const [rows, setRows] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  // 아래: 기준년월(이번 달), 신청구분(첫 항목), 지급여부(전체), 검색
  // [E1] monthComboBox (ComboBoxField).callbackOnCreate (L94) → 인라인 L94-102: 콤보가 만들어지면 기준년(올해)·월(이번 달)을 채운다
  const [year, setYear] = useState(() => String(dayjs().year()));
  const [month, setMonth] = useState(() => dayjs().format('MM'));
  const [benefitCode2, setBenefitCode2] = useState('');
  const [benefitYn, setBenefitYn] = useState('전체');
  const [searchText2, setSearchText2] = useState('');
  const [payRows, setPayRows] = useState<BenefitRow[]>([]);
  const [loading2, setLoading2] = useState(false);
  // 문서분류(classTreeModel · classTreeFullName 칸 — 고르기 전에는 기본값을 흐린 글씨로 보인다) · 상신상태(apprStepCode/Name)
  const [classTree, setClassTree] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [classText, setClassText] = useState('');
  const [classHint, setClassHint] = useState('');
  const [apprStep, setApprStep] = useState({ code: '00', name: '미상신' });
  const [apprEnabled, setApprEnabled] = useState(true);
  const [apprViewEnabled, setApprViewEnabled] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [noteTarget, setNoteTarget] = useState<Benefit | null>(null);

  const monthName = `${Number(month)}월`;

  // retrieve() L548-570: emp.Emp17_Benefit.selectByText(startDate, closeDate, benefitCode, "%검색어%") — 콤보가 전체면 "%"
  const retrieve = useCallback(async (code: string = benefitCode) => {
    setLoading(true);
    try {
      setRows(await empBenefitApi.searchBenefits({ startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), benefitCode: code, searchText }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [benefitCode, startDate, closeDate, searchText]);

  // retrieve2() L572-608 → 조회가 끝나면 defaultName() L851-889 · apprChk() L891-937 · getAccountName() L1080-1094
  const retrieve2 = useCallback(async (opts?: { code?: string; yn?: string; month?: string }) => {
    const code = opts?.code ?? benefitCode2;
    const yn = opts?.yn ?? benefitYn;
    const mm = opts?.month ?? month;
    setLoading2(true);
    try {
      const ynStr = yn === '지급완료' ? 'true' : yn === '미지급' ? 'false' : '%';
      const list = await empBenefitApi.searchPayRequests({ yyyymm: `${year}.${mm}`, benefitCode: code, benefitYn: ynStr, searchText: searchText2 });
      setPayRows(list.map(toRow));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    } finally {
      setLoading2(false);
    }
    // defaultName() + getAccountName(): 신청구분의 설정 한 건(문서분류 연결코드 · 계정과목)
    try {
      const info = code ? await empBenefitInfoApi.getBenefitInfoByCode(code) : null;
      if (info == null) {
        setClassTree({ id: null, name: '' });
      } else {
        const trees = await dcrApi.searchClassTreeByLinkCode(info.expenseLinkCode);
        if (trees.length === 1) {
          setClassTree({ id: trees[0].classTreeId, name: trees[0].classTreeFullName });
          setClassHint(trees[0].classTreeFullName);
        } else {
          setClassHint(NO_CLASS_TEXT);
        }
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    // apprChk(): 기준년월·신청구분의 지출결의서 상신 상태 → 상신/문서보기 단추 활성
    try {
      const pr = await empBenefitApi.getPayRequest(`${year}.${mm}`, code);
      if (pr == null || pr.payRequestApprStatusCode == null) {
        setApprStep({ code: '00', name: '미상신' });
        setApprEnabled(true);
        setApprViewEnabled(false);
      } else {
        setApprStep({ code: pr.payRequestApprStatusCode, name: pr.payRequestApprStatusName ?? '' });
        setApprEnabled(pr.payRequestApprStatusCode === '40');
        setApprViewEnabled(true);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [benefitCode2, benefitYn, month, year, searchText2]);

  // comboBoxRetrieve() L610-628: 두 신청구분 콤보를 다시 읽고 첫 항목을 고른 뒤 retrieve() · retrieve2() (위 콤보는 "전체" 포함)
  const comboBoxRetrieve = useCallback(async () => {
    let list: BenefitType[] = [];
    try {
      list = await empBenefitApi.searchBenefitTypes();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    setTypes(list);
    setBenefitCode('%');
    const first = list[0]?.code ?? '';
    setBenefitCode2(first);
    void retrieve('%');
    void retrieve2({ code: first });
  }, [retrieve, retrieve2]);

  // [E0] 화면 열림 (생성자 L124-216) → settings() → comboBoxRetrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void comboBoxRetrieve(); }, []);

  /** 선택한 신청의 ID들 */
  const selectedIds = (ref: React.RefObject<AgGridReact<any> | null>): number[] =>
    (ref.current?.api.getSelectedRows() ?? []).map((r: Benefit) => r.benefitId);

  // [E20]·[E22] actionCell (ImageCell).callbackOnCreate (L413·L516) → 인라인: 신청문서보기 아이콘 (buildGrid L395-497 · payRequestdGrid L499-546): 상신문서가 없으면 안내, 있으면 Apr01_Edit_ApprDoc.retrieveApproval() (다음 단계)
  const viewAppr = (row: Benefit) => {
    if (row.apprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E21] 문서폐기 아이콘 deleteCell (L411-468): 상신문서가 없으면 안내 → 결재상태가 완료(30)가 아니면 안내 → 확인(400) → emp.Emp17_Benefit.deleteApprId → 안내 후 retrieve() [E21 YES L435]
  const discardAppr = (row: Benefit) => {
    if (row.apprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
    if (row.apprStatusCode !== '30') { message.warning('결재상태가 완료인건만 문서폐기가 가능합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '해당문서를 폐기하시겠습니까?',
      width: 400,
      onOk: async () => {
        try {
          await empBenefitApi.discardAppr(row.benefitId);
          message.success('문서폐기가 완료되었습니다. 알림을 통해 해당 사용자에게 해당내용을 안내해주세요');
          void retrieve();
        } catch (err) {
          message.error(errorMessage(err, '문서폐기 실패'));
        }
      },
    });
  };

  // buildGrid() L395-497 (setChecked(MULTI), getSumGrid("합계", 3, 6, 6) → 신청구분 칸에 "합계", 신청금액 합)
  const columnDefs = useMemo(() => [
    gb.date('issueDate', 100, '신청일'),  // L475
    gb.text('benefitName', 100, '신청구분'),  // L476
    gb.textCenter('personName', 100, '사원명'),  // L477
    gb.text('apprTitleName', 400, '문서명'),  // L478
    gb.long('issueAmt', 80, '신청금액'),  // L479
    gb.date('occDate', 100, '발생일자'),  // L480
    gb.text('benefitDetail', 200, '내용'),  // L481
    gb.textCenter('apprStatusName', 100, '결재상태'),  // L482
    iconCell<Benefit>('view', 'viewAction', 80, '신청문서보기', viewAppr),  // L483 actionCell (ImageCell "View")
    iconCell<Benefit>('delete', 'discardAction', 80, '문서폐기', discardAppr),  // L484 deleteCell (ImageCell "Trash")
    // [E22] 알림 아이콘 noticeCell (L486-): Emp17_Edit_Note.open(선택한 행)
    iconCell<Benefit>('edit', 'noteAction', 80, '알림', row => setNoteTarget(row)),  // L485 noticeCell (ImageCell "Edit")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  // payRequestdGrid() L499-546 (setChecked(MULTI), getSumGrid("합계", 3, 6, 6))
  const payColumnDefs = useMemo(() => [
    gb2.date('issueDate', 100, '신청일'),  // L533
    gb2.text('benefitName', 100, '신청구분'),  // L534
    gb2.textCenter('personName', 100, '사원명'),  // L535
    gb2.text('apprTitleName', 400, '문서명'),  // L536
    gb2.long('issueAmt', 80, '신청금액'),  // L537
    gb2.date('occDate', 100, '발생일자'),  // L538
    gb2.text('benefitDetail', 200, '내용'),  // L539
    iconCell<BenefitRow>('view', 'viewAction', 80, '신청문서보기', viewAppr),  // L540 actionCell (ImageCell "View")
    gb2.textCenter('benefitYnStr', 80, '지급여부'),  // L541
  ], []);

  // [E9] payRequestInsertButton[지출결의등록].Select (L293) → apprChk2() L939-966: 서버가 기준년월·신청구분의 지출결의서를 검사 → 막는 메시지가 없으면 payRequestInsert() L703-782
  const apprChk2 = async () => {
    const ids = selectedIds(gridRef);
    if (ids.length < 1) { message.warning('등록할 내용을 선택해주세요'); return; }  // payRequestInsert L707-710
    try {
      const blocked = await empBenefitApi.checkPayRequest(year, month, ids);
      if (blocked) { message.warning(blocked); return; }
    } catch (err) {
      message.error(errorMessage(err, '검사 실패'));
      return;
    }
    const picked = gridRef.current?.api.getSelectedRows() ?? [];
    // payRequestInsert() L714-737: 행마다 결재상태 검사
    for (const r of picked) {
      if (r.apprStatusCode === '10' || r.apprStatusCode === '20') { message.warning('상신/결제중인 문서는 등록할 수 없습니다.'); return; }
      if (r.apprStatusCode === '40') { message.warning('반려된 문서는 등록할 수 없습니다.'); return; }
      if (r.apprStatusCode === '99') { message.warning('임시저장 문서는 등록할 수 없습니다.'); return; }
      if (r.apprStatusCode == null) { message.warning('존재하지 않는 문서는 등록할 수 없습니다.'); return; }
    }
    Modal.confirm({
      title: '지출결의등록',
      content: `${year}년 ${monthName} 지출결의에 ${picked.length}건을 등록하시겠습니까?`,
      width: 380,
      // [E25] msgBox.DialogHide [YES] (L744) → emp.Emp17_Benefit.updatePayRequestYm → 안내 → retrieve2(), retrieve()
      onOk: async () => {
        try {
          await empBenefitApi.updatePayRequestYm(ids, `${year}.${month}`);
          Modal.info({ title: '확인', width: 400, content: <>{year}년 {monthName} 지출결의 등록이 완료되었습니다.<br /> 하단 그리드를 확인해주세요.</> });
          void retrieve2();
          void retrieve();
        } catch (err) {
          message.error(errorMessage(err, '등록 실패'));
        }
      },
    });
  };

  // [E10] payRequestDeleteButton[지출결의제거].Select (L299) → payRequestDelete() L784-837: 선택 없으면 안내 → 상신상태(apprStepCode)가 10·20·30이면 / 40 / 99 안내 → updatePayRequestYm(null) → 안내 → retrieve2(), retrieve()
  const payRequestDelete = async () => {
    const ids = selectedIds(payGridRef);
    if (ids.length < 1) { message.warning('삭제할 내용을 선택해주세요'); return; }
    if (['10', '20', '30'].includes(apprStep.code)) { message.warning('상신/결재/완료인 문서는 삭제할 수 없습니다.'); return; }
    if (apprStep.code === '40') { message.warning('반려된 문서는 삭제할 수 없습니다. 폐기 후 진행바랍니다.'); return; }
    if (apprStep.code === '99') { message.warning('임시저장 문서를 제거 후 진행바랍니다.'); return; }
    try {
      await empBenefitApi.updatePayRequestYm(ids, null);
      message.success(`${year}년 ${monthName} 지출결의가 ${ids.length}건 삭제되었습니다.`);
      void retrieve2();
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E7]·[E8] confirmButton[지급확인]·cancelButton[지급취소].Select (L281·L287) → updateBenefitYn(true|false) L630-701: 확인 후 emp.Emp17_Benefit.update → retrieve2() [E23·E24 YES L649·L676]
  const updateBenefitYn = (yn: boolean) => {
    const ids = selectedIds(payGridRef);
    Modal.confirm({
      title: yn ? '지급' : '지급취소',
      content: yn ? `${ids.length}건의 지급을 확인하시겠습니까?` : `${ids.length}건의 지급을 취소하시겠습니까?`,
      width: 300,
      // [E23] msgBox.DialogHide [YES] (L649) → 지급확인 / [E24] (L676) → 지급취소: 같은 서비스 emp.Emp17_Benefit.update 뒤 retrieve2()
      onOk: async () => {
        try {
          if (ids.length > 0) await empBenefitApi.updateBenefitYn(ids, yn);
          void retrieve2();
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
        }
      },
    });
  };

  // [E18] apprButton[상신].Select (L362) → insertLinkApproval() L968-1048: 지출결의내역이 없으면 / 문서분류가 없으면 안내, 그 뒤 Apr01_Edit_ApprDoc (다음 단계)
  const insertLinkApproval = () => {
    if (payRows.length === 0) { message.warning('상신할 내용이 없습니다.'); return; }
    if (classTree.id == null) { message.warning('문서분류를 선택해주세요.'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E19] apprViewButton[문서보기].Select (L368) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval() (다음 단계)
  const viewPayAppr = () => {
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // [E13] classTreeFullName[문서분류].TriggerClick (L331) → openLookupDoc() L840-849: Dcr30_Move_DcrClass.open(callback) → 고른 분류를 칸에 넣는다
  const onClassResult = (r: Dcr30ClassResult) => {
    setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' });
    setClassText(r.classTreeFullName ?? '');
    setMoveOpen(false);
  };

  const typeOptions = types.map(t => ({ value: t.code, label: t.name }));

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="45%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E5] retrieveButton[조회].Select (L269) → retrieve(), [E2] searchTextField.KeyPress [Enter] (L235) → retrieve() */}
              <SearchBar onSearch={() => void retrieve()} loading={loading}
                extra={(
                  <>
                    {/* [E9] payRequestInsertButton[지출결의등록].Select (L293) */}
                    <Button type="register" onClick={apprChk2}>지출결의등록</Button>
                    {/* [E12] dcrLinkButton[문서분류지정].Select (L318) → Dcr30_Lookup_Link.open("LinkCode0001", …) */}
                    <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
                    {/* [E11] benefitSetButton[복리후생비 설정].Select (L305) → Emp55_Lookup_account.open(→ comboBoxRetrieve()) */}
                    <Button type="save" onClick={() => setAccountOpen(true)}>복리후생비 설정</Button>
                  </>
                )}>
                <SearchBar.Field label="▼ 신청내역">{null}</SearchBar.Field>
                <SearchBar.Field label="조회기간">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                    ~
                    <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                  </span>
                </SearchBar.Field>
                <SearchBar.Field label="신청구분">
                  {/* [E14] benefitName[sys.Sys00_Common.selectBenefit].Collapse (L338) → retrieve() */}
                  <Select style={{ width: 120 }} value={benefitCode} options={[{ value: ALL_TYPE.code, label: ALL_TYPE.name }, ...typeOptions]}
                    onChange={v => { setBenefitCode(v); void retrieve(v); }} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 230 }} placeholder="신청구분/사원명/문서명" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <MultiGrid<Benefit> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.benefitId)}
                  sumRow={{ labelField: 'benefitName', label: '합계', sum: ['issueAmt'] }} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E6] retrieveButton2[조회].Select (L275) → retrieve2(), [E3] searchTextField2.KeyPress [Enter] (L246) → retrieve2() */}
              <SearchBar onSearch={() => void retrieve2()} loading={loading2}
                extra={(
                  <>
                    <Button type="delete" onClick={payRequestDelete}>지출결의제거</Button>
                    <Button type="save" onClick={() => updateBenefitYn(true)}>지급확인</Button>
                    <Button type="cancel" onClick={() => updateBenefitYn(false)}>지급취소</Button>
                  </>
                )}>
                <SearchBar.Field label="▼ 지출결의내역">{null}</SearchBar.Field>
                <SearchBar.Field label="기준년월">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {/* [E4] yearField.KeyPress [Enter] (L255) → retrieve2() */}
                    <Input style={{ width: 55 }} value={year} onChange={e => setYear(e.target.value)} onPressEnter={() => void retrieve2()} />
                    {/* [E16] monthComboBox[MonthsCode].Collapse (L350) → retrieve2() */}
                    <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 70 }} value={month}
                      onChange={v => { if (!v) return; setMonth(v); void retrieve2({ month: v }); }} />
                  </span>
                </SearchBar.Field>
                <SearchBar.Field label="신청구분">
                  {/* [E15] benefitName2[sys.Sys00_Common.selectBenefit].Collapse (L344) → retrieve2() */}
                  <Select style={{ width: 120 }} value={benefitCode2 || undefined} placeholder="신청구분 선택바랍니다" options={typeOptions}
                    onChange={v => { setBenefitCode2(v); void retrieve2({ code: v }); }} />
                </SearchBar.Field>
                <SearchBar.Field label="지급여부">
                  {/* [E17] benefitYn[전체].Collapse (L356) → retrieve2() */}
                  <Select style={{ width: 100 }} value={benefitYn} options={YN_OPTIONS.map(v => ({ value: v }))}
                    onChange={v => { setBenefitYn(v); void retrieve2({ yn: v }); }} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 230 }} placeholder="신청구분/사원명/문서명" value={searchText2} onChange={e => setSearchText2(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <MultiGrid<BenefitRow> gridRef={payGridRef} rowData={payRows} columnDefs={payColumnDefs} getRowId={p => String(p.data.benefitId)}
                  sumRow={{ labelField: 'benefitName', label: '합계', sum: ['issueAmt'] }} />
              </div>
              {/* 폼 70 (L181-195, 원본은 테두리 패널이지만 GG는 외곽 테두리를 두지 않는다): 문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120, 라벨 폭 105 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 70, flex: 'none', padding: '0 10px', boxSizing: 'border-box' }}>
                <span style={{ width: 105, textAlign: 'right', paddingRight: 10 }}>문서분류</span>
                <div style={{ width: 800, maxWidth: '50%' }}>
                  {/* classTreeFullName: LookupTriggerField(편집 불가) — 기본 문서분류는 흐린 글씨(setEmptyText) */}
                  <LookupInput value={classText} placeholder={classHint} width={800} onOpen={() => setMoveOpen(true)} />
                </div>
                <span style={{ width: 105, textAlign: 'right', paddingRight: 10 }}>상신상태</span>
                <Input style={{ width: 140 }} readOnly value={apprStep.name} />
                {/* [E18] 상신 */}
                <Button type="register" disabled={!apprEnabled} onClick={insertLinkApproval}>상신</Button>
                {/* [E19] 문서보기 */}
                <Button type="search" disabled={!apprViewEnabled} onClick={viewPayAppr}>문서보기</Button>
              </div>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0001" onClose={() => setLinkOpen(false)} />
      <Dcr30_Move_DcrClass open={moveOpen} hideNull onResult={onClassResult} onClose={() => setMoveOpen(false)} />
      <Emp55_Lookup_account open={accountOpen} onClose={() => { setAccountOpen(false); void comboBoxRetrieve(); }} />
      <Emp17_Edit_Note model={noteTarget} onClose={() => setNoteTarget(null)} />
    </div>
  );
};
