/**
 * [1210] KFS > 10. ICAM 계약사관리 > 최저보수 청구 (EE21)
 * AS-IS: myApp/client/vi/biz/Biz20_Tab_FeeCharge.java (950줄) + Biz20_Edit_FeeCharge(편집창)·Biz22_Lookup_FeeChargeCalc(계산상세)·Biz20_Lookup_FileList(파일)
 *   ·Biz29_Lookup_Account(보수입금계좌)·Biz10_Lookup_ContCorp(계약사)·Dcr01_Lookup_Class·Apr01_Edit_ApprDoc(상신) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 init() L322-344: 위에서부터 buttonBar01(45) · buttonBar02(45) · 그리드, 바깥 여백 20.
 *   buttonBar01 = 해당 연도 [45] [분기 콤보 1~4] 분기 · 검색 [200] · [조회][자료일괄생성][계약사별자료생성][파일 일괄 다운로드][츨력/다운로드][보수입금계좌]
 *   buttonBar02 = [등록][삭제][확정][확정취소][통합상신]
 * 그리드 buildGrid() L346-447: 체크 다중 · 헤더 묶음 전분기(456EA6)·당분기(DD5E5E) · 합계 행 getSumGrid("합계", 3, 4, 7)
 * 스타일: SGP (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 초기화(UX-02)는 조건이 연도·분기·검색 3개지만 줄이 이미 가득 차서 넣지 않는다
 * 미완(다음 단계): 자료생성 뒤 엑셀·PDF 만들기(makeExcel·makePDF), [파일 일괄 다운로드](zip), 통합상신의 통합 엑셀 첨부(createTotalFeeExcel), 계산상세의 [엑셀다운로드]
 *   · ICAM 발생보수는 외부 DB라 자료생성에서 빠져 있다(새로 만든 자료의 발생보수는 0)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizFeeChargeApi } from '@/api/bizFee';
import { dcrApi } from '@/api/dcr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizFeeCharge } from '@/types/bizFee';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Biz10_Lookup_ContCorp } from './Biz10_Lookup_ContCorp';
import { Biz20_Edit_FeeCharge, BizFeeChargeEditTarget } from './Biz20_Edit_FeeCharge';
import { Biz20_Lookup_FileList } from './Biz20_Lookup_FileList';
import { Biz22_Lookup_FeeChargeCalc } from './Biz22_Lookup_FeeChargeCalc';
import { Biz29_Lookup_Account } from './Biz29_Lookup_Account';

const gb = gbFor<BizFeeCharge>();
/** 전분기 / 당분기 헤더 색 (setHtmlGridStyle) */
const PRE_COLOR = '#456EA6';
const CUR_COLOR = '#DD5E5E';
/** setChecked(MULTI) — 삭제·확정용 체크라 행 클릭이 선택을 바꾸지 않는다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true } as const;
const QUARTER_END = ['03-31', '06-30', '09-30', '12-31'];

/** 열 때 연도·분기 (eventSetting L131-156): 오늘에서 3개월을 뺀 날의 연도, 그 달의 분기 */
const initialPeriod = () => {
  const d = dayjs().subtract(3, 'month');
  return { year: d.format('YYYY'), quarter: String(Math.floor(d.month() / 3) + 1) };
};

export const Biz20_Tab_FeeCharge: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizFeeCharge>>(null);
  const init = useMemo(initialPeriod, []);
  const [year, setYear] = useState(init.year);
  const [quarter, setQuarter] = useState(init.quarter);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizFeeCharge[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BizFeeChargeEditTarget | null>(null);
  const [calcRow, setCalcRow] = useState<BizFeeCharge | null>(null);
  const [fileTarget, setFileTarget] = useState<{ id: number; fixYn: boolean } | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [contCorpOpen, setContCorpOpen] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  // 상신: 문서분류 확인(Dcr01_Lookup_Class) → 결재 문서(Apr01_Edit_ApprDoc)
  const [classOpen, setClassOpen] = useState(false);
  const [defaultClassId, setDefaultClassId] = useState<number | null>(null);
  /** 개별 상신(A18·A19)의 행 — 통합상신(A20)은 null */
  const [apprRow, setApprRow] = useState<BizFeeCharge | null>(null);
  const [apprLinkCode, setApprLinkCode] = useState<string | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; linkCode: string; refId: number } | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  /** getChargeDate() L473-490: 연도 + 분기 말일 */
  const chargeDateOf = (y = year, q = quarter) => `${y}-${QUARTER_END[Number(q) - 1] ?? QUARTER_END[3]}`;

  // retrieve() L458-471: biz.Biz20_FeeCharge.selectByChargeDate(companyId(서버), chargeDate, "%검색어%")
  const retrieve = useCallback(async (over?: { year?: string; quarter?: string; text?: string }) => {
    const y = over?.year ?? year;
    if (!/^\d{4}$/.test(y)) { message.warning('해당 연도를 확인해주세요'); return; }
    setLoading(true);
    try {
      setRows(await bizFeeChargeApi.search(chargeDateOf(y, over?.quarter ?? quarter), over?.text ?? searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, quarter, searchText]);

  // [E0] 화면 열림 (생성자 L100-104) → init(), eventSetting(), retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checked = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // ── 자료생성 ──
  // batch() L742-763: 마스크 "생성 중" → biz.Biz20_FeeCharge.createFeeCharge(companyId, chargeDate, contCorpId) → makeExcel → makePDF → retrieve (엑셀·PDF는 다음 단계)
  const batch = async (contCorpId: number | null) => {
    const hide = message.loading('생성 중', 0);
    try {
      await bizFeeChargeApi.batch(chargeDateOf(), contCorpId);
    } catch (err) {
      hide();
      message.error(errorMessage(err, '자료 생성 실패'));
      return;
    }
    hide();
    await retrieve();
  };
  // [E4] batchButton[자료일괄생성].Select (L178) → contCorpId = null, batchCheck() L721-740 → [E22] msgBox [YES] (L724) → batch()
  const batchCheck = () => {
    Modal.confirm({
      title: '확인',
      content: <>기존 자료는 삭제되며 신규생성됩니다. 진행하시겠습니까?<br />(해당분기에 확정처리된 청구보수는 생성대상에서 제외됩니다)</>,
      okText: '예', cancelText: '아니오', width: 500,
      onOk: () => batch(null),
    });
  };
  // [E5] corpBatchButton[계약사별자료생성].Select (L185) → Biz10_Lookup_ContCorp.open() → 고르면 [E6] msgBox "기존 자료는 삭제되며 신규생성됩니다. 진행하시겠습니까?"(폭 450) [YES] (L197) → batch()
  const onContCorpResult = (contCorpId: number) => {
    setContCorpOpen(false);
    Modal.confirm({
      title: '확인', content: '기존 자료는 삭제되며 신규생성됩니다. 진행하시겠습니까?', okText: '예', cancelText: '아니오', width: 450,
      onOk: () => batch(contCorpId),
    });
  };

  // [E7] allFileDownloadButton[파일 일괄 다운로드].Select (L220) → allFileDownload() L711-719: FileDownload?fileType=feeCharge&companyId&chargeDate (zip) — 다음 단계
  const allFileDownload = () => { message.info('파일 일괄 다운로드(zip)는 다음 단계에서 변환합니다.'); };

  // [E8] printDownButton[츨력/다운로드].Select (L226) → sys.Sys99_Print.insertRdFeeCharge → 성공이면 RD Biz20_Rd_FeeCharge(rv: rdGroupId·companyId·personId·year·quarter)
  const printDown = async () => {
    try {
      const groupId = await bizFeeChargeApi.rdPrint(chargeDateOf(), searchText);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Biz20_Rd_FeeCharge', options: '/rhtmlimportopt [2]', rv: { rdGroupId: groupId, year, quarter } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // ── 삭제·확정 ──
  // [E11] deleteButton[삭제].Select (L278) → deleteChk() L492-510: "선택하신 운용사의 당분기 정보를 삭제하시겠습니까?"(제목 "삭제", 폭 300) → [E19] [YES] (L495) → deleteList() L512-542
  const deleteChk = () => {
    Modal.confirm({
      title: '삭제', content: '선택하신 운용사의 당분기 정보를 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 300,
      onOk: deleteList,
    });
  };
  const deleteList = async () => {
    const sel = checked();
    if (sel.length === 0) { message.warning('선택된 운용사가 없습니다'); return; }
    if (sel.some(r => r.fixYn === 'true')) { message.warning('확정된 최저보수 청구정보가 포함되어있습니다'); return; }
    try {
      await bizFeeChargeApi.delete(sel.map(r => r.realFeeChargeId).filter((id): id is number => id != null));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      return;
    }
    await retrieve();
  };
  // [E12] confirmButton[확정].Select (L284) · [E13] cancleButton[확정취소].Select (L290) → confirmUpdate(fixYn) L544-639
  const confirmUpdate = (fixYn: boolean) => {
    const sel = checked();
    if (sel.length === 0) { message.warning('선택된 운용사가 없습니다'); return; }
    for (const r of sel) {
      if (r.realFeeChargeId == null) { message.warning('당분기 최저보수 청구내역이 없습니다 (확정 불필요)'); return; }
      if (r.fixYn === 'true' && fixYn) { message.warning('이미 확정된 운용사입니다'); return; }
      if (r.trId != null && !fixYn) { message.warning('발생업무 회계처리 화면에서 전표삭제 후 취소가능합니다'); return; }
    }
    // [E20]·[E21] msgBox [YES] (L581·L610) → biz.Biz20_FeeCharge.confirmUpdate → retrieve()
    Modal.confirm({
      title: fixYn ? '확정' : '확정취소',
      content: `${sel.length}건의 항목을 ${fixYn ? '확정' : '확정취소'}하시겠습니까?`,
      okText: '예', cancelText: '아니오', width: 330,
      onOk: async () => {
        try {
          await bizFeeChargeApi.confirm(sel.map(r => r.realFeeChargeId!), fixYn);
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // ── 상신 ──
  // 행의 [상신] 아이콘 (apprCell L391-426): apprCheck → 미확정이면 "확정되지 않은 청구보수임으로 문서상신이 불가능합니다", 계좌가 없으면 "보수입금계좌를 입력해주세요.", 아니면 checkAppr()
  const apprClick = async (row: BizFeeCharge) => {
    try {
      const list = row.realFeeChargeId == null ? [] : await bizFeeChargeApi.apprCheck(row.realFeeChargeId);
      if (row.fixYn !== 'true') { message.warning('확정되지 않은 청구보수임으로 문서상신이 불가능합니다'); return; }
      if (list.length === 0) { message.warning('보수입금계좌를 입력해주세요.'); return; }
      await checkAppr(row);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // checkAppr() L805-837: 결재문서가 있고 상태가 상신·완료·결재중이면 그 문서를 열고(닫으면 retrieve), 아니면 checkdcr()
  const checkAppr = async (row: BizFeeCharge) => {
    if (row.apprId != null && ['상신', '완료', '결재중'].includes(row.aprStatusNm ?? '')) {
      setViewApprId(row.apprId);
      return;
    }
    await checkdcr(row);
  };
  // checkdcr() L839-878: 연결 코드 A18(manageType 1) / A19(그 밖) → dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) → Dcr01_Lookup_Class.open(지정된 분류 또는 null) → insertLinkApproval()
  const checkdcr = async (row: BizFeeCharge) => {
    const linkCode = row.manageType === '1' ? 'A18' : 'A19';
    const list = await dcrApi.searchClassTreeByLinkCode(linkCode);
    setDefaultClassId(list.length === 0 ? null : list[0].classTreeId);
    setApprRow(row);
    setApprLinkCode(linkCode);
    setClassOpen(true);
  };
  // [E14] apprAllButton[통합상신].Select [YES] (L296) → "[ 연도년 N분기 ] 통합상신을 진행하시겠습니까?"(폭 380) → [E15] [YES] (L303) → apprAll() L641-692
  const apprAllConfirm = () => {
    Modal.confirm({
      title: '확인', content: `[ ${year}년 ${quarter}분기 ] 통합상신을 진행하시겠습니까?`, okText: '예', cancelText: '아니오', width: 380,
      onOk: apprAll,
    });
  };
  // apprAll(): 전체 목록(검색어 "%")에 당분기 청구가 있는데 미확정인 행이 있으면 "확정처리가 되지않은 운용사가 존재합니다" → 연결 코드 A20 → Dcr01_Lookup_Class → insertLinkApproval(…, "A20", feeChargeId 0)
  const apprAll = async () => {
    try {
      const all = await bizFeeChargeApi.search(chargeDateOf(), '');
      if (all.some(r => r.fixYn !== 'true' && r.realFeeChargeId != null)) { message.warning('확정처리가 되지않은 운용사가 존재합니다'); return; }
      const list = await dcrApi.searchClassTreeByLinkCode('A20');
      setDefaultClassId(list.length === 0 ? null : list[0].classTreeId);
      setApprRow(null);
      setApprLinkCode('A20');
      setClassOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // insertLinkApproval() L880-891 / L694-709: 고른 문서분류로 상신 문서를 연다. A18·A19 는 행의 청구보수 ID, A20 은 0
  const onClassResult = (c: { classTreeId: number }) => {
    setClassOpen(false);
    if (!apprLinkCode) return;
    setLinkDoc({ classTreeId: c.classTreeId, linkCode: apprLinkCode, refId: apprRow?.realFeeChargeId ?? 0 });
  };
  // 문서를 저장·결재요청한 뒤: A18·A19 는 updateApprId(L893-907)로 청구보수에 문서 ID를 기록하고 retrieve, A20 은 "정상적으로 상신이 완료되었습니다"
  const onLinkSaved = async (apprId: number) => {
    if (linkDoc?.linkCode === 'A20') { message.success('정상적으로 상신이 완료되었습니다'); return; }
    if (apprRow?.realFeeChargeId == null) return;
    try {
      await bizFeeChargeApi.updateApprId(apprRow.realFeeChargeId, apprId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
    await retrieve();
  };

  // buildGrid() L346-447
  const columnDefs = useMemo(() => [
    gb.textCenter('fixNm', 80, '확정여부'),  // L432
    gb.text('corpNm', 200, '운용사'),  // L433
    { ...gb.group('전분기', [  // L430 HeaderGroupMap(0, 4) span 2
      gb.long('preOccFee', 120, '발생보수', { headerStyle: { color: PRE_COLOR } }),  // L434
      gb.long('preRealChargeFee', 120, '청구액', { headerStyle: { color: PRE_COLOR } }),  // L435
    ]), headerStyle: { color: PRE_COLOR } },
    { ...gb.group('당분기', [  // L431 HeaderGroupMap(0, 6) span 2
      gb.long('occFee', 120, '발생보수', { headerStyle: { color: CUR_COLOR } }),  // L436
      gb.long('realChargeFee', 120, '청구액', { headerStyle: { color: CUR_COLOR } }),  // L437
    ]), headerStyle: { color: CUR_COLOR } },
    iconCell<BizFeeCharge>('edit', 'editCell', 50, '수정', row => setEditTarget({ mode: 'edit', row })),  // L438 → Biz20_Edit_FeeCharge(선택행)
    iconCell<BizFeeCharge>('view', 'calcCell', 50, '계산\n상세', row => setCalcRow(row)),  // L439 → Biz22_Lookup_FeeChargeCalc.open(선택행)
    iconCell<BizFeeCharge>('view', 'fileCell', 50, '파일', row => {  // L440 [E18] → realFeeChargeId 가 없으면 "No realFeeChargeId", 있으면 Biz20_Lookup_FileList.open(id, fixYn)
      if (row.realFeeChargeId == null) { message.info('No realFeeChargeId'); return; }
      setFileTarget({ id: row.realFeeChargeId, fixYn: row.fixYn === 'true' });
    }),
    gb.textCenter('aprStatusNm', 120, '결재상태'),  // L441
    iconCell<BizFeeCharge>('edit', 'apprCell', 50, '상신', row => { void apprClick(row); }),  // L442
    gb.textArea('note', 400, '비고'),  // L443
    gb.longCenter('realFeeChargeId', 120, 'RealFeeChargeId'),  // L444
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* buttonBar01 — [E1] quarterComboBox.Collapse (L157) → retrieve(), [E2] searchTextField.KeyPress [Enter] (L164) → retrieve(), [E3] retrieveButton[조회].Select (L172) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        loading={loading}
        extra={
          <>
            <Button type="generate" onClick={batchCheck}>자료일괄생성</Button>
            <Button type="generate" onClick={() => setContCorpOpen(true)}>계약사별자료생성</Button>
            <Button type="download" onClick={allFileDownload}>파일 일괄 다운로드</Button>
            <Button type="download" onClick={printDown}>츨력/다운로드</Button>
            {/* [E9] accountButton[보수입금계좌].Select (L265) → lookupAccount() L925-928 */}
            <Button type="view" onClick={() => setAccountOpen(true)}>보수입금계좌</Button>
          </>
        }
      >
        <SearchBar.Field label="해당 연도">
          <Input style={{ width: 80 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} onPressEnter={() => retrieve()} />
        </SearchBar.Field>
        <SearchBar.Field label={null}>
          <Select style={{ width: 60 }} value={quarter} options={['1', '2', '3', '4'].map(q => ({ value: q, label: q }))}
            onChange={q => { setQuarter(q); void retrieve({ quarter: q }); }} />
        </SearchBar.Field>
        <span style={{ alignSelf: 'center' }}>분기</span>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      {/* buttonBar02 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* [E10] insertButton[등록].Select (L272) → insert() L449-456: Biz20_Edit_FeeCharge(chargeDate) → 저장하면 retrieve() */}
        <Button type="register" onClick={() => setEditTarget({ mode: 'new', chargeDate: chargeDateOf() })}>등록</Button>
        <Button type="delete" onClick={deleteChk}>삭제</Button>
        <Button type="save" onClick={() => confirmUpdate(true)}>확정</Button>
        <Button type="cancel" onClick={() => confirmUpdate(false)}>확정취소</Button>
        <Button type="register" onClick={apprAllConfirm}>통합상신</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BizFeeCharge>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.feeChargeId)}
          loading={loading}
          rowSelection={MULTI_CHECK}
          sumRow={{ labelField: 'corpNm', label: '합계', sum: ['preOccFee', 'preRealChargeFee', 'occFee', 'realChargeFee'] }}
        />
      </div>
      {/* [E17] actionCell (ImageCell).callbackOnCreate (L355) → Biz20_Edit_FeeCharge 를 저장하고 닫으면 retrieve() */}
      <Biz20_Edit_FeeCharge target={editTarget} onClose={() => setEditTarget(null)} onSaved={() => { void retrieve(); }} />
      <Biz22_Lookup_FeeChargeCalc row={calcRow} onClose={() => setCalcRow(null)} />
      <Biz20_Lookup_FileList parentId={fileTarget?.id ?? null} fixYn={fileTarget?.fixYn ?? false} onClose={() => setFileTarget(null)} />
      <Biz29_Lookup_Account open={accountOpen} onClose={() => setAccountOpen(false)} />
      <Biz10_Lookup_ContCorp open={contCorpOpen} onResult={onContCorpResult} onClose={() => setContCorpOpen(false)} />
      <RdViewer url={rdUrl} title="최저보수 청구" onClose={() => setRdUrl(null)} />
      <Dcr01_Lookup_Class open={classOpen} classTreeId={defaultClassId} onResult={onClassResult} onClose={() => { setClassOpen(false); setApprRow(null); setApprLinkCode(null); }} />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc}
        onLinkSaved={id => { void onLinkSaved(id); }}
        onClosed={() => { void retrieve(); }}
        onClose={() => { setViewApprId(null); setLinkDoc(null); setApprRow(null); setApprLinkCode(null); }}
      />
    </div>
  );
};
