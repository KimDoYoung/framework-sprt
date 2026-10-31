/**
 * [1505] KFS > 20. 기타 > 기준가 정정내역 보고 (V32)
 * AS-IS: myApp/client/vi/biz/Biz60_Tab_FundPriceModiReport.java (654줄) + Biz60_Edit_FundPriceModi.java (870줄, 편집 팝업) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L106-150: north = 툴바 50(변경년월 QuickMoveField · 검색 300 "운용사/펀드" · [조회][등록][삭제]), center = 보고 그리드(행번호, 체크박스 다중),
 *   south = 70(문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120).
 * 개별 상신 A75·A76(결재(보기) 아이콘) / 월 통합 상신 A77([상신]) — 둘 다 전자결재 편집창 Apr01_Edit_ApprDoc의 link로 연다.
 * 스타일: SGP (견본 docs/page-style/SGP/Chk02_Tab_DailyList.tsx — 바깥 여백 20·gap 8·SearchBar + MultiGrid + 편집 팝업)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 * 다음 단계: 메일 보내기 창 Dcr10_Lookup_MailSender(다른 도메인) — 완료 문서 검사까지만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizFundPriceModiApi } from '@/api/biz';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { FundPriceModi, FundPriceModiMonth } from '@/types/biz';
import { Button } from '@/components/button';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Biz60_Edit_FundPriceModi, FundPriceModiEdit } from './Biz60_Edit_FundPriceModi';
import dayjs from 'dayjs';

const gb = gbFor<FundPriceModi>();

/** getYYYYMM() — `yyyy.mm` */
const toYyyymm = (v: YearMonth) => `${v.year}.${String(v.month).padStart(2, '0')}`;

/** 개별 상신 문서분류: 보고서구분 1 → A75(오류 발생), 2 → A76(변경 발생) */
const LINK_CODE: Record<string, string> = { '1': 'A75', '2': 'A76' };
const BUSY = ['10', '20', '30'];

interface ClassPick { id: number; name: string }

export const Biz60_Tab_FundPriceModiReport: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundPriceModi>>(null);
  const [ym, setYm] = useState<YearMonth>(() => ({ year: dayjs().year(), month: dayjs().month() + 1 }));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FundPriceModi[]>([]);
  // apprChk() L323-378: 변경년월의 월 통합 상신 상태 (stepCode '00' = 미상신)
  const [month, setMonth] = useState<FundPriceModiMonth | null>(null);
  const stepCode = month?.statusCode ?? '00';
  const stepName = month?.statusCode == null ? '미상신' : (month.statusName ?? '');
  // defaultName() L444-495: dcr.Dcr30_Link.selectByLinkCode A75 / A76 / A77 — 각각 정확히 1건일 때만 쓴다
  const [class01, setClass01] = useState<number | null>(null);
  const [class02, setClass02] = useState<number | null>(null);
  const [relateClass, setRelateClass] = useState<ClassPick | null>(null);
  const [classOpen, setClassOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FundPriceModiEdit>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  // 개별 상신 대상 · 월 통합 상신 대상
  const [rowLink, setRowLink] = useState<{ row: FundPriceModi; classTreeId: number; linkCode: string } | null>(null);
  const [monthLink, setMonthLink] = useState<{ classTreeId: number; ids: number[]; yyyymm: string } | null>(null);
  const latest = useRef({ ym, searchText });
  latest.current = { ym, searchText };

  // apprChk() L323-378
  const apprChk = useCallback(async (v: YearMonth = latest.current.ym) => {
    try {
      setMonth(await bizFundPriceModiApi.month(toYyyymm(v)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieve() L596-610: biz.Biz60_FundPriceModi.selectByText(companyId, yyyymm, "%검색어%") → apprChk()
  const retrieve = useCallback(async (v: YearMonth = latest.current.ym) => {
    try {
      setRows(await bizFundPriceModiApi.search(toYyyymm(v), latest.current.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await apprChk(v);
  }, [apprChk]);

  // defaultName() L444-495
  const defaultName = useCallback(async () => {
    const one = async (code: string) => {
      try {
        const list = await dcrApi.searchClassTreeByLinkCode(code);
        return list.length === 1 ? list[0] : null;
      } catch { return null; }
    };
    const [a, b, c] = await Promise.all([one('A75'), one('A76'), one('A77')]);
    setClass01(a?.classTreeId ?? null);
    setClass02(b?.classTreeId ?? null);
    setRelateClass(c ? { id: c.classTreeId, name: c.classTreeFullName ?? '' } : null);
  }, []);

  // [E0] 화면 열림 (생성자 L106-150) → settings()(defaultName()), retrieve()
  //   [E1] quickMoveField.callbackOnCreate (L74) → retrieve() — 처음 한 번 조회
  useEffect(() => {
    void defaultName();
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E5] insertButton[등록].Select (L174) → insertRow() L612-619: Biz60_Edit_FundPriceModi(callback → retrieve())
  const insertRow = () => setEditTarget('new');

  // [E6] deleteButton[삭제].Select (L180) → deleteChk() L621-639: "n건을 삭제하시겠습니까?"(제목 "삭제", 폭 300) → [E12] msgBox.DialogHide [YES] (L624) → deleteRow() L641-645
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }  // 05 §8: 선택 없이 삭제는 확인창 없이 경고
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await bizFundPriceModiApi.remove(checked.map(r => r.fundPriceModiId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // ApprCallbackResult(apprId) → 문서를 열고, 열람 권한/문서가 없으면 "해당문서의 열람권한이 없습니다"
  const viewAppr = (apprId: number | null) => {
    if (apprId == null) { message.warning('해당문서의 열람권한이 없습니다'); return; }
    setViewApprId(apprId);
  };

  // insertLinkApproval() L381-411 (개별 상신): 보고서구분으로 문서분류(A75/A76)를 고르고 없으면 안내
  const insertLinkApproval = (row: FundPriceModi) => {
    const linkCode = LINK_CODE[row.reportType ?? ''];
    const classTreeId = linkCode === 'A75' ? class01 : linkCode === 'A76' ? class02 : null;
    if (classTreeId == null || linkCode == null) { message.warning('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요'); return; }
    setRowLink({ row, classTreeId, linkCode });
  };

  // updateApprId(apprId) L413-430: biz.Biz60_FundPriceModi.update(선택 행 + apprId) → retrieve()
  const updateApprId = async (apprId: number) => {
    if (!rowLink) return;
    try {
      await bizFundPriceModiApi.updateApprId(rowLink.row.fundPriceModiId, apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // [E9] relateClassTreeFullName[문서분류].TriggerClick (L221) → openLookupDoc() L433-442: Dcr30_Move_DcrClass.open(callback → 문서분류 교체)
  // [E7] apprButton[상신].Select (L186) → relateInsertLinkApproval() L505-579 (월 통합 상신, A77)
  const relateInsertLinkApproval = () => {
    if (rows.length === 0) { message.warning('상신할 내용이 없습니다.'); return; }
    if (rows.some(r => r.statusCode !== '30')) { message.warning('결재완료되지않은 내역이 존재합니다.'); return; }
    if (relateClass == null) { message.warning('문서분류를 선택해주세요.'); return; }
    if (BUSY.includes(stepCode)) {
      // L526-560: 상신 중·완료 월이면 월 상신 문서를 연다(biz.Biz60_FundPriceModi.selectApprId는 매퍼에 SQL이 없어 원본에서도 실패 — 이 단추는 이때 꺼져 있어 닿지 않는다)
      viewAppr(month?.apprId ?? null);
      return;
    }
    setMonthLink({ classTreeId: relateClass.id, ids: rows.map(r => r.fundPriceModiId), yyyymm: toYyyymm(ym) });
  };

  // relateUpdateApprId(apprId) L581-594: biz.Biz61_ModiRptRelateAppr.updateApprId(companyId, yyyymm, apprId) → apprChk()
  const relateUpdateApprId = async (apprId: number) => {
    if (!monthLink) return;
    try {
      await bizFundPriceModiApi.saveMonth(monthLink.yyyymm, apprId);
      await apprChk();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // [E8] apprViewButton[문서보기].Select (L196) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → apprChk())
  const apprView = () => { if (month?.apprId != null) setViewApprId(month.apprId); };

  // buildGrid() L229-321
  const columnDefs = useMemo(() => {
    const mail = iconCell<FundPriceModi>('send', 'mailCell', 80, '메일<br>보내기', row => {
      // [E11 인접] actionCell03 (Send) L279-303: ApprCallbackResult → 완료(30)가 아니면 "완료되지 않은 문서입니다", 맞으면 Dcr10_Lookup_MailSender.open(apprId)
      if (row.apprId == null) { message.warning('해당문서의 열람권한이 없습니다'); return; }
      if (row.statusCode !== '30') { message.warning('완료되지 않은 문서입니다'); return; }
      message.info('메일 보내기 창(Dcr10_Lookup_MailSender)은 다음 단계에서 연결됩니다');
    });
    const base = mail.cellRenderer;
    return [
      // [E10] actionCell01 (ImageCell).callbackOnCreate (L235) → Biz60_Edit_FundPriceModi(선택 행, callback → retrieve())
      iconCell<FundPriceModi>('edit', 'actionCell', 55, '수정', row => setEditTarget(row)),
      gb.date('modiDate', 100, '변경일'),
      gb.textCenter('reportTypeName', 180, '구분'),
      gb.text('amCorpName', 200, '운용사'),
      gb.text('fundName', 300, '펀드'),
      gb.date('priceStdDate', 100, '산출일'),
      gb.text('firstPersonName', 100, '최초발견자'),
      gb.booleanYn('ksdNoticeYn', 70, '예탁원<br>공시'),
      gb.booleanYn('kofiaNoticeYn', 70, '협회<br>공시'),
      gb.double('cmpsAmt', 100, '배상금액'),
      // [E11] actionCell02 (ImageCell).callbackOnCreate (L260) → 결재 중·완료(10·20·30)면 ApprCallbackResult → retrieveApproval(callback → retrieve()), 아니면 insertLinkApproval()
      iconCell<FundPriceModi>('edit', 'apprCell', 80, '결재(보기)', row => {
        if (row.statusCode != null && BUSY.includes(row.statusCode)) viewAppr(row.apprId);
        else insertLinkApproval(row);
      }),
      gb.textStatus('statusName', 80, '결재상태'),
      // addDynamicCell(statusCode, …, {"30"}): 결재완료 문서만 메일 아이콘
      { ...mail, cellRendererSelector: p => (p.data?.statusCode === '30' && base ? { component: base } : { component: () => null }) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class01, class02]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E4] retrieveButton[조회].Select (L168) → retrieve(), [E3] searchText.KeyPress [Enter] (L160) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={(
          <>
            <Button type="register" onClick={insertRow} disabled={BUSY.includes(stepCode)}>등록</Button>
            <Button type="delete" onClick={deleteChk} disabled={BUSY.includes(stepCode)}>삭제</Button>
          </>
        )}
      >
        <SearchBar.Field label="변경년월">
          {/* [E2] quickMoveField.callbackOnCollapse (L80) → retrieve() — 바뀐 값으로 곧바로 조회 */}
          <QuickMoveField {...ym} onChange={setYm} onCommit={v => { latest.current.ym = v; void retrieve(v); }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="운용사/펀드" value={searchText}
            onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<FundPriceModi> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fundPriceModiId)} />
      </div>
      <div style={{ background: '#f5f5f5', borderRadius: 4, padding: '10px 12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span>문서분류</span>
        <LookupInput width={800} value={relateClass?.name ?? ''} placeholder="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요" onOpen={() => setClassOpen(true)} />
        <span>상신상태</span>
        <Input style={{ width: 250 }} readOnly value={stepName} />
        <Button type="register" onClick={relateInsertLinkApproval} disabled={BUSY.includes(stepCode)}>상신</Button>
        <Button type="search" onClick={apprView} disabled={month?.apprId == null}>문서보기</Button>
      </div>
      <Biz60_Edit_FundPriceModi model={editTarget} onSaved={() => void retrieve()} onClose={() => setEditTarget(null)} />
      <Dcr30_Move_DcrClass open={classOpen}
        onResult={r => { if (r.classTreeId != null) setRelateClass({ id: r.classTreeId, name: r.classTreeFullName ?? '' }); setClassOpen(false); }}
        onClose={() => setClassOpen(false)} />
      {/* 개별 상신 insertLinkApproval(classTreeModel, A75|A76, 행, false, callback → updateApprId) / 월 통합 상신 insertLinkApprovals(relateClassTreeModel, "A77", {gridList}, false, callback → relateUpdateApprId + retrieve()) / retrieveApproval */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={rowLink ? { classTreeId: rowLink.classTreeId, linkCode: rowLink.linkCode, refId: rowLink.row.fundPriceModiId }
          : monthLink ? { classTreeId: monthLink.classTreeId, linkCode: 'A77', args: { ids: monthLink.ids.join(',') } } : null}
        onLinkSaved={id => void (rowLink ? updateApprId(id) : relateUpdateApprId(id))}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setRowLink(null); setMonthLink(null); }}
      />
    </div>
  );
};
