/**
 * 내부통제 준수점검(준감인) (K02) — 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수점검(준감인) #1311
 * AS-IS: myApp/client/vi/ics/Ics31_Tab_ComplianceConfirm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L70-112: center = vlc = 툴바(기준 분기(월): 기준년도 · 월/분기 콤보 · 검색 · 미확인건만 조회 · [조회][확인][확인취소]) / 체크박스 다중 그리드 + 페이징(100).
 * 제출된 직원 작성 내역을 확인·확인취소한다. 열 때 자동 조회는 없다(원본 그대로).
 * 2026-10-29 원본이 "상신기능 추가"로 바뀌었다(V28): 툴바에 사원명 조회(Ics31_Lookup_SelectPerson)가 생기고, 그리드 아래에 문서분류 · 상신상태 · [상신][문서보기] 줄이 붙었다.
 *   내가 확인자인 작성 내역만 읽는다(서버가 로그인 사원으로 건다). [상신] = 조회 후 → 문서분류 → 미확인 건 없음 → createRd() L575-648 → insertRelateApprId() L651-670
 *   → insertLinkApproval("A52") L672-696 → updateApprId() L698-. 옛 조회창 Ics32_Lookup_RelateAppr는 어디서도 열리지 않아 변환하지 않는다.
 *   createRd()의 RD 첨부 PDF: [상신] 때 출력 자료(sys.Sys99_Print.insertComplianceState)를 만들고, 결재 저장 뒤 서버가 RD(mrd Ics31_Tab_ComplianceReport)로
 *   PDF를 만들어 "내부통제 준수보고(yyyy년 주기).pdf"로 붙인다(CH-0018·0109, 사용자 결정 2026-11-11). RD가 꺼졌거나 실패하면 AS-IS 개발계처럼 첨부 없이 간다.
 * 스타일: SG (견본 — docs/page-style.md). 그리드 아래 폼 줄은 테두리 없이 같은 안쪽 div에 flex: none 높이 70.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { fltApi } from '@/api/flt';
import { IcsComplianceConfirm } from '@/types/ics';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Ics31_Lookup_SelectPerson } from './Ics31_Lookup_SelectPerson';
import { defaultPeriod, getDate } from './icsComplyPeriod';

const gb = gbFor<IcsComplianceConfirm>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const LINK_CODE = 'A52';  // defaultName()의 dcr.Dcr30_Link.selectByLinkCode — 부서장 준수확인서 연결 문서분류 · insertLinkApproval(…, "A52", …)

/** insertLinkApproval()에 넘기는 값 — 상신을 누른 시점의 기준 분기(월)와 insertRelateApprId()가 돌려준 연결 ID (AS-IS insetModel) */
interface LinkDoc {
  classTreeId: number;
  relateApprId: number;
  stdDate: string;
  cycleType: string;
  year: string;
  cycleName: string;
  /** createRd()가 만든 RD 출력 자료 그룹 ID (insertComplianceState) */
  rdGroupId: number;
}

// buildGrid() L246-269 — 열 순서·폭·제목은 원본 그대로
const columnDefs = [
  gb.text('complianceTypeName', 200, '준수항목'),
  gb.textCenter('subNum', 80, '번호'),
  gb.textArea('content', 450, '내용'),
  gb.textArea('reason', 300, '답변'),
  gb.text('orgName', 250, '부서명'),
  gb.text('personName', 100, '사원명'),
  gb.booleanYn('confirmYn', 80, '확인여부'),
];

export const Ics31_Tab_ComplianceConfirm: React.FC = () => {
  const [cycleType, setCycleType] = useState<string | null>(null);  // enable(cycleType) — null이면 화면 비활성
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [searchText, setSearchText] = useState('');
  const [checkBox, setCheckBox] = useState(false);  // "미확인건만 조회"
  const [rows, setRows] = useState<IcsComplianceConfirm[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const checkedRef = useRef<IcsComplianceConfirm[]>([]);
  const [personId, setPersonId] = useState<number | null>(null);  // personId(LongField) — 사원명 조회창에서 고른 작성자, 비면 전체
  const [personName, setPersonName] = useState('');
  const [personOpen, setPersonOpen] = useState(false);
  const [periodName, setPeriodName] = useState('');  // periodComboBox.getText() — 제목·본문에 쓰는 분기(월) 이름
  const [classEmpty, setClassEmpty] = useState('');  // classTreeFullName.setEmptyText(…)
  const [classTreeId, setClassTreeId] = useState<number | null>(null);  // classTreeModel — 기본(defaultName) 또는 고른 문서분류
  const [defaultClassTreeId, setDefaultClassTreeId] = useState<number | null>(null);  // defaultModel
  const [classTreeFullName, setClassTreeFullName] = useState('');
  const [moveOpen, setMoveOpen] = useState(false);
  const [apprStepName, setApprStepName] = useState('');  // 조회 전에는 비어 있다(apprStepCode == null)
  const [apprEnabled, setApprEnabled] = useState(false);  // apprButton
  const [apprViewEnabled, setApprViewEnabled] = useState(false);  // apprViewButton
  const [apprId, setApprId] = useState<number | null>(null);  // defaultApprName()가 정하는 상신 문서
  const [masking, setMasking] = useState(false);  // MASK(true)
  const [linkDoc, setLinkDoc] = useState<LinkDoc | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const view = useRef({ cycleType, year, period, searchText, checkBox, personId });
  view.current = { cycleType, year, period, searchText, checkBox, personId };
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ stdDate: string; cycleType: string; searchText: string; checkBox: boolean; writerId: number | null } | undefined>(undefined);

  // defaultName() L502-522: 연결 기본 문서분류(dcr.Dcr30_Link.selectByLinkCode "A52")를 안내 글자로 보여 준다
  const defaultName = useCallback(async () => {
    try {
      const model = await fltApi.getDocClass(LINK_CODE);
      setClassEmpty(model?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
      if (model) { setDefaultClassTreeId(model.classTreeId); setClassTreeId(model.classTreeId); }
    } catch {
      setClassEmpty('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
    }
  }, []);

  // defaultApprName() L524-573: ics.Ics32_RelateAppr.selectByCompanyId(yyyymm, cycleType, personId = 로그인 사원, apprType "2") — 그 분기(월)의 내 상신 연결과 결재 상태
  const defaultApprName = useCallback(async (std: string, cycle: string) => {
    try {
      const appr = await icsApi.getComplianceReportAppr(std.slice(0, 7).replace('-', '.'), cycle, '2');
      if (appr == null || appr.statusCode == null) {  // 연결이 없거나 아직 상신 전
        setApprStepName('미상신'); setApprId(null); setApprEnabled(true); setApprViewEnabled(false);
      } else if (appr.statusCode === '40') {  // 취소는 다시 상신할 수 있다
        setApprStepName(appr.statusName ?? ''); setApprId(appr.apprId); setApprEnabled(true); setApprViewEnabled(true);
      } else {
        setApprStepName(appr.statusName ?? ''); setApprId(appr.apprId); setApprEnabled(false); setApprViewEnabled(true);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E1] gridToolBar (GridPagingLoader).callbackOnCreate (L132) → PagingToolBar. [E0] 화면 열림 (생성자 L103-165) → settings()
  // settings() L114-194 / enable() L196-244: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다. 설정이 없으면 안내하고 화면을 끈다
  useEffect(() => {
    void defaultName();  // settings() 끝의 defaultName() L339
    icsApi.getComplianceWriteCycleType().then(c => {
      if (c === 'M' || c === 'Q') {
        const d = defaultPeriod(c);
        setCycleType(c); setYear(String(d.year)); setPeriod(d.period);
      } else {
        message.warning('체크주기가 설정되어있지않습니다. 관리자에게 연락해주세요');
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [defaultName]);

  const enabled = cycleType != null && period !== '';

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icsApi.searchComplianceConfirms({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // [E3] searchText.KeyPress [Enter] (L205) → retrieve(). [E6] retrieveButton[조회].Select (L237) → retrieve() L417-461: 조건을 만들어 1페이지부터 읽고, 끝나면 defaultApprName()
  const retrieve = useCallback(async () => {
    const v = view.current;
    const std = getDate(v.year, v.period, v.cycleType ?? 'M');
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    paramRef.current = { stdDate: std.format('YYYY-MM-DD'), cycleType: v.cycleType ?? 'M', searchText: v.searchText, checkBox: v.checkBox, writerId: v.personId };
    await getPaging(1);
    await defaultApprName(std.format('YYYY-MM-DD'), v.cycleType ?? 'M');  // 조회가 끝나면 defaultApprName() L453
  }, [getPaging, defaultApprName]);

  // [E7] confirmButton[확인].Select (L243) / [E8] cancleButton[확인취소].Select (L249) → confirmChk() L463-488: 체크한 행만, 제출 안 된 행이 있으면 안내
  const confirmChk = async (check: boolean) => {
    const selected = checkedRef.current;
    if (selected.some(m => !m.fixYn)) { message.info('미완료된 문항이 있습니다'); return; }
    try {
      await icsApi.updateComplianceConfirm(check, selected.map(m => m.complianceWriteId));
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E11] personName.TriggerClick [result == null] (L315) → Ics31_Lookup_SelectPerson.open(getDate(), cycleType, callback): 고르면 사원명·personId, [전체]면 비움 → retrieve()
  const onPickPerson = (row: { personId: number; personName: string | null } | null) => {
    const id = row?.personId ?? null;
    setPersonId(id);
    setPersonName(row?.personName ?? '');
    view.current = { ...view.current, personId: id };
    void retrieve();
  };

  // [E5] classTreeFullName[문서분류].TriggerClick (L227) → openLookupDoc() L491-500: Dcr30_Move_DcrClass.open(defaultModel, callback) — 일반 사용자 권한 검사 열기
  const onPickClass = (r: { classTreeId: number | null; classTreeFullName: string | null }) => {
    setMoveOpen(false);
    if (r.classTreeId == null) return;
    setClassTreeId(r.classTreeId);
    setClassTreeFullName(r.classTreeFullName ?? '');
  };

  // [E9] apprButton[상신].Select [apprStepCode == null] (L255) → 조회 전이면 안내, 문서분류가 없으면 안내, ics.Ics30_Compliance.getConfirmYn으로 미확인 건이 있으면 안내
  //   → createRd() L575-648 → insertRelateApprId() L651-670 → insertLinkApproval() L672-696
  const createRd = async () => {
    if (apprStepName === '') { message.info('조회 후 진행바랍니다.'); return; }
    if (classTreeId == null) { message.info('문서분류를 먼저 선택해주세요'); return; }
    const v = view.current;
    const cycle = v.cycleType ?? 'M';
    const std = getDate(v.year, v.period, cycle);
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    setMasking(true);  // MASK(true)
    try {
      if (await icsApi.getComplianceConfirmUnconfirmed(std.format('YYYY-MM-DD'), cycle) > 0) { message.info('미확인 건이 존재합니다.'); return; }
      // sys.Sys99_Print.insertComplianceState(confirmerId = 로그인 사원) → 출력 그룹 ID. PDF(RD)는 결재 저장 뒤 서버가 만들어 붙인다(updateApprId)
      const rdGroupId = await icsApi.createComplianceRdState(std.format('YYYY-MM-DD'), cycle);
      const relateApprId = await icsApi.createComplianceReportRelate(std.format('YYYY.MM'), cycle, '2');  // ics.Ics32_RelateAppr.insert (apprType "2", personId = 로그인 사원)
      setLinkDoc({ classTreeId, relateApprId, stdDate: std.format('YYYY-MM-DD'), cycleType: cycle, year: v.year, cycleName: periodName, rdGroupId });
    } catch (err) {
      message.error(errorMessage(err, '상신 연결을 만들지 못했습니다'));
    } finally {
      setMasking(false);  // MASK(false)
    }
  };

  // updateApprId() L698-: ics.Ics32_RelateAppr.updateApprId(relateApprId, apprId) → "상신완료 되었습니다" → defaultApprName()
  const updateApprId = async (newApprId: number) => {
    if (!linkDoc) return;
    try {
      // + 결재 저장 때 붙이던 RD 첨부 PDF (Apr01_Grid_ApprFile.ics32RelateApprFileSetting: "내부통제 준수보고(yyyy년 주기)")
      await icsApi.updateComplianceReportApprId(linkDoc.relateApprId, newApprId,
        { rdGroupId: linkDoc.rdGroupId, yyyy: linkDoc.year, cycleName: linkDoc.cycleName });
      message.success('상신완료 되었습니다');
      await defaultApprName(linkDoc.stdDate, linkDoc.cycleType);
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 연결하지 못했습니다'));
    }
  };

  // [E10] apprViewButton[문서보기].Select (L290) → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → defaultApprName())
  const viewAppr = () => { if (apprId != null) setViewApprId(apprId); };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8,
        ...(cycleType == null ? { pointerEvents: 'none', opacity: 0.5 } : {}) }}>
        <SearchBar
          onSearch={retrieve}
          disabled={!enabled}
          loading={loading}
          extra={
            <>
              <Button type="save" disabled={!enabled} onClick={() => confirmChk(true)}>확인</Button>
              <Button type="cancel" disabled={!enabled} onClick={() => confirmChk(false)}>확인취소</Button>
            </>
          }
        >
          <SearchBar.Field label="기준 분기(월)">
            {/* [E2] yyyyText.ValueChange (L196) · [E4] periodComboBox[MonthsCode].ValueChange (L216) → yyyyStr·periodStr 갱신 (조회할 때 읽는다) */}
            <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            {cycleType != null && (
              <SystemCodeComboBox
                kindCd={cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                style={{ width: 80 }}
                allowClear={false}
                value={period}
                onLoad={codes => setPeriodName(codes.find(c => c.code === view.current.period)?.name ?? '')}
                onChange={(code, name) => { if (code) { setPeriod(code); setPeriodName(name ?? ''); } }}
              />
            )}
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            {/* [E11] personName.TriggerClick (L315) → Ics31_Lookup_SelectPerson */}
            <LookupInput value={personName} placeholder="전체" width={100} onOpen={() => setPersonOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="내용/부서명/사원명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={checkBox} onChange={e => setCheckBox(e.target.checked)}>미확인건만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<IcsComplianceConfirm>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.complianceWriteId)}
            loading={loading}
            onCheckedChange={r => { checkedRef.current = r; }}
            // retrieve(): 조회가 끝나면 첫 행을 고른다(grid.getSelectionModel().select(0, false))
            onRowDataUpdated={e => { e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
        {/* 생성자 L142-161: 문서분류 · 상신상태 · [상신][문서보기] (SG: 테두리 없이 높이 70) */}
        <div style={{ flex: 'none', height: 70, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap' }}>
          <strong>문서분류</strong>
          <LookupInput value={classTreeFullName} empty={['']} placeholder={classEmpty} width={600} onOpen={() => setMoveOpen(true)} />
          <strong>상신상태</strong>
          <Input style={{ width: 150 }} readOnly value={apprStepName} />
          <Button type="register" disabled={!apprEnabled || masking || !enabled} onClick={() => void createRd()}>상신</Button>
          <Button type="search" disabled={!apprViewEnabled} onClick={viewAppr}>문서보기</Button>
        </div>
      </div>
      {(() => {
        const std = cycleType != null ? getDate(year, period, cycleType) : null;
        return (
          <Ics31_Lookup_SelectPerson
            open={personOpen}
            stdDate={std ? std.format('YYYY-MM-DD') : ''}
            cycleType={cycleType ?? 'M'}
            onResult={onPickPerson}
            onClose={() => setPersonOpen(false)}
          />
        );
      })()}
      <Dcr30_Move_DcrClass open={moveOpen} authCheck defaultClassTreeId={defaultClassTreeId} onResult={onPickClass} onClose={() => setMoveOpen(false)} />
      {/* insertLinkApproval() L672-696: Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A52", insetModel, false, callback → updateApprId) / retrieveApproval */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? {
          classTreeId: linkDoc.classTreeId,
          linkCode: LINK_CODE,
          args: { stdDate: linkDoc.stdDate, cycleType: linkDoc.cycleType, yyyy: linkDoc.year, mm: linkDoc.cycleName, cycleName: linkDoc.cycleName },  // insetModel.setMm(periodComboBox.getCurrentValue()) = 콤보 이름
        } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => { const v = view.current; const std = getDate(v.year, v.period, v.cycleType ?? 'M'); if (std) void defaultApprName(std.format('YYYY-MM-DD'), v.cycleType ?? 'M'); }}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
