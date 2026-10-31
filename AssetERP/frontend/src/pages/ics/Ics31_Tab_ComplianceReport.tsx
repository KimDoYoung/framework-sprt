/**
 * 내부통제 준수보고(준감인) (K03) — 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수보고(준감인) #1312
 * AS-IS: myApp/client/vi/ics/Ics31_Tab_ComplianceReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L86-127: center = vlc = 툴바(기준 분기(월): 기준년도 · 월/분기 콤보 · [조회]) / 보고서 미리보기(RD 뷰어 Ics31_Rd_ComplianceReport) /
 * 아래 70px 박스(문서분류 · 상신상태 · [상신][문서보기]). 열 때는 안내 문구만 보이고 [조회]로 보고서를 만든다.
 * 1단계: 조회(보고서·상신상태). RD 미리보기는 서버 RD 리포트 대신 같은 행(사원·부서·준수항목·결과·사유)을 표로 보여 준다.
 * V19: [문서분류](Dcr30_Move_DcrClass, 권한 검사 열기)·[상신](ics.Ics32_RelateAppr.insert → Apr01_Edit_ApprDoc.insertLinkApproval("A32") → updateApprId)·[문서보기]를 연결했다.
 * 남은 것(다음 단계): createRd() L510-582의 RD 첨부 PDF 만들기 — TOBE에는 RD 리포트·PDF 엔진이 없다. AS-IS도 파일 저장 경로가 없는 환경(개발계)에서는 PDF 없이
 * insertRelateApprId()로 바로 간다(L537-538) — TOBE는 그 길만 간다. 본문의 "첨부파일을 참고하세요."는 그대로 나온다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { icsApi } from '@/api/ics';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { IcsComplianceReportRow } from '@/types/ics';
import { SingleGrid, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { SearchBar } from '@/components/search';
import { defaultPeriod, getDate } from './icsComplyPeriod';

const gb = gbFor<IcsComplianceReportRow>();
const LINK_CODE = 'A32';  // defaultName()의 dcr.Dcr30_Link.selectByLinkCode — 준수보고 연결 문서분류 · insertLinkApproval(…, "A32", …)

/** insertLinkApproval()에 넘기는 값 — 상신을 누른 시점의 기준 분기(월)와 insertRelateApprId()가 돌려준 연결 ID (AS-IS insetModel) */
interface LinkDoc {
  classTreeId: number;
  relateApprId: number;
  stdDate: string;
  cycleType: string;
  year: string;
  period: string;
  cycleName: string;
}

// 보고서 미리보기 열 — RD 리포트(Ics31_Tab_ComplianceReport.mrd)의 값: 순번·사원명·부서명·준수항목·준수결과·미준수사유
const columnDefs = [
  gb.longCenter('seq', 60, '순번'),
  gb.text('personName', 100, '사원명'),
  gb.text('orgName', 200, '부서명'),
  gb.text('complianceTypeName', 200, '준수항목'),
  gb.textCenter('complianceResult', 100, '준수결과'),
  gb.textArea('reason', 500, '미준수사유'),
];

export const Ics31_Tab_ComplianceReport: React.FC = () => {
  const [cycleType, setCycleType] = useState<string | null>(null);  // enable(cycleType) — null이면 화면 비활성
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [rows, setRows] = useState<IcsComplianceReportRow[] | null>(null);  // null = 아직 조회 전(안내 문구)
  const [loading, setLoading] = useState(false);
  const [classEmpty, setClassEmpty] = useState('');  // classTreeFullName.setEmptyText(…)
  const [apprStepName, setApprStepName] = useState('');
  const [apprEnabled, setApprEnabled] = useState(false);  // apprButton
  const [apprViewEnabled, setApprViewEnabled] = useState(false);  // apprViewButton
  const [apprId, setApprId] = useState<number | null>(null);  // defaultApprName()가 정하는 상신 문서
  const [periodName, setPeriodName] = useState('');  // periodComboBox.getText() — 제목·본문에 쓰는 분기(월) 이름
  const [classTreeId, setClassTreeId] = useState<number | null>(null);  // classTreeModel — 기본(defaultName) 또는 고른 문서분류
  const [defaultClassTreeId, setDefaultClassTreeId] = useState<number | null>(null);  // defaultModel
  const [classTreeFullName, setClassTreeFullName] = useState('');  // classTreeFullName.setValue — 고른 분류의 이름
  const [moveOpen, setMoveOpen] = useState(false);
  const [masking, setMasking] = useState(false);  // MASK(true)
  const [linkDoc, setLinkDoc] = useState<LinkDoc | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const view = useRef({ cycleType, year, period });
  view.current = { cycleType, year, period };

  // defaultName() L355-375: 연결 기본 문서분류(dcr.Dcr30_Link.selectByLinkCode)를 안내 글자로 보여 준다
  const defaultName = useCallback(async () => {
    try {
      const model = await fltApi.getDocClass(LINK_CODE);
      setClassEmpty(model?.classTreeFullName ?? '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
      if (model) { setDefaultClassTreeId(model.classTreeId); setClassTreeId(model.classTreeId); }
    } catch {
      setClassEmpty('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
    }
  }, []);

  // [E0] 화면 열림 (생성자 L86-127) → settings() L129-246: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다(enable() L377-425). 설정이 없으면 안내하고 화면을 끈다
  useEffect(() => {
    void defaultName();
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

  // defaultApprName() L459-506: 그 달 상신 연결의 결재 상태로 상신상태와 [상신]·[문서보기]를 정한다
  const defaultApprName = useCallback(async (std: string, cycle: string) => {
    const appr = await icsApi.getComplianceReportAppr(std.slice(0, 7).replace('-', '.'), cycle);
    if (appr == null || appr.statusCode == null) {  // 연결이 없거나 아직 상신 전
      setApprStepName('미상신'); setApprId(null); setApprEnabled(true); setApprViewEnabled(false);
    } else if (appr.statusCode === '40') {  // 취소는 다시 상신할 수 있다
      setApprStepName(appr.statusName ?? ''); setApprId(appr.apprId); setApprEnabled(true); setApprViewEnabled(true);
    } else {
      setApprStepName(appr.statusName ?? ''); setApprId(appr.apprId); setApprEnabled(false); setApprViewEnabled(true);
    }
  }, []);

  // [E3] periodComboBox[MonthsCode].Collapse (L172) / [E4] retrieveButton[조회].Select (L179) → retrieve() L427-457:
  // sys.Sys99_Print.insertComplianceState(예외업무 10) → 보고서 미리보기(rdForm.retrieve) → defaultApprName(). 값을 막 바꾼 콤보는 `next`로 넘긴다(상태 반영 전)
  const retrieve = useCallback(async (nextPeriod?: string) => {
    const v = view.current;
    const std = getDate(v.year, nextPeriod ?? v.period, v.cycleType ?? 'M');
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    const stdDate = std.format('YYYY-MM-DD');
    setApprStepName('');  // 상신 체크 초기화
    setLoading(true);  // MASK(true)
    try {
      setRows(await icsApi.searchComplianceReport(stdDate, v.cycleType ?? 'M'));
      await defaultApprName(stdDate, v.cycleType ?? 'M');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // MASK(false)
    }
  }, [defaultApprName]);

  // [E5] classTreeFullName[문서분류].TriggerClick (L190) → openLookupDoc() L344-353: Dcr30_Move_DcrClass.open(defaultModel, callback) — 일반 사용자 권한 검사 열기. 고른 분류를 칸에 넣는다
  const openLookupDoc = () => setMoveOpen(true);
  const onPickClass = (r: { classTreeId: number | null; classTreeFullName: string | null }) => {
    setMoveOpen(false);
    if (r.classTreeId == null) return;
    setClassTreeId(r.classTreeId);
    setClassTreeFullName(r.classTreeFullName ?? '');
  };

  // [E6] apprButton[상신].Select [apprStepCode == null] (L196): 조회 전이면 안내, 문서분류가 없으면 안내, 있으면 createRd() L510-582 → insertRelateApprId() L249-267 → insertLinkApproval() L305-327
  const createRd = async () => {
    if (apprStepName === '') { message.info('조회 후 진행바랍니다.'); return; }
    if (classTreeId == null) { message.info('문서분류를 먼저 선택해주세요'); return; }
    const v = view.current;
    const cycle = v.cycleType ?? 'M';
    const std = getDate(v.year, v.period, cycle);
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    setMasking(true);  // MASK(true)
    try {
      // RD 첨부 PDF 만들기(sys.Sys99_Print.insertComplianceState + RD)는 다음 단계 — 위 머리 설명
      const relateApprId = await icsApi.createComplianceReportRelate(std.format('YYYY.MM'), cycle);  // ics.Ics32_RelateAppr.insert
      setLinkDoc({ classTreeId, relateApprId, stdDate: std.format('YYYY-MM-DD'), cycleType: cycle, year: v.year, period: v.period, cycleName: periodName });
    } catch (err) {
      message.error(errorMessage(err, '상신 연결을 만들지 못했습니다'));
    } finally {
      setMasking(false);  // MASK(false)
    }
  };

  // updateApprId() L329-342: ics.Ics32_RelateAppr.updateApprId(relateApprId, apprId) → "상신완료 되었습니다" → defaultApprName()
  const updateApprId = async (newApprId: number) => {
    if (!linkDoc) return;
    try {
      await icsApi.updateComplianceReportApprId(linkDoc.relateApprId, newApprId);
      message.success('상신완료 되었습니다');
      await defaultApprName(linkDoc.stdDate, linkDoc.cycleType);
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 연결하지 못했습니다'));
    }
  };

  // [E7] apprViewButton[문서보기].Select (L212) → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → defaultApprName())
  const viewAppr = () => { if (apprId != null) setViewApprId(apprId); };

  // [E8] rdFileCreateForm.SubmitComplete (L238) → insertRelateApprId() — RD 첨부 업로드 폼의 후속이라 createRd()가 바로 부른다

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
        ...(cycleType == null ? { pointerEvents: 'none', opacity: 0.5 } : {}) }}>
        <SearchBar onSearch={() => retrieve()} disabled={!enabled} loading={loading}>
          <SearchBar.Field label="기준 분기(월)">
            {/* [E1] yyyyText.ValueChange (L154) · [E2] periodComboBox[MonthsCode].ValueChange (L164) → yyyyStr·periodStr 갱신 (조회할 때 읽는다) */}
            <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            {cycleType != null && (
              <SystemCodeComboBox
                kindCd={cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                style={{ width: 80 }}
                allowClear={false}
                value={period}
                onLoad={codes => setPeriodName(codes.find(c => c.code === view.current.period)?.name ?? '')}
                onChange={(code, name) => { if (code) { setPeriod(code); setPeriodName(name ?? ''); void retrieve(code); } }}
              />
            )}
          </SearchBar.Field>
        </SearchBar>
        {/* 보고서 미리보기(Ics31_Rd_ComplianceReport). [E0] 화면 열림 (생성자 L31-35) → showGuideMessage(): 조회 전에는 안내 문구, retrieve(rdGroupId)가 오면 보고서(setRd L57-74) */}
        <div style={{ flex: 1, minHeight: 0, border: rows == null ? '1px solid #d9d9d9' : undefined }}>
          {rows == null ? (
            <div style={{ lineHeight: '24px', textAlign: 'left', paddingTop: 30, paddingLeft: 45, fontWeight: 'bold', fontSize: 14, color: '#1F4D83' }}>
              미리보기 상단 [조회]버튼을 클릭해주세요.
            </div>
          ) : (
            <SingleGrid<IcsComplianceReportRow>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => `${p.data.personId}-${p.data.complianceType}`}
              loading={loading}
            />
          )}
        </div>
        <div style={{ border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <strong>문서분류</strong>
          {/* [E5] */}
          <LookupInput value={classTreeFullName} empty={['']} placeholder={classEmpty} width={600} onOpen={openLookupDoc} />
          <strong>상신상태</strong>
          <Input style={{ width: 150 }} readOnly value={apprStepName} />
          <Button type="register" disabled={!apprEnabled || masking} onClick={() => void createRd()}>상신</Button>
          <Button type="search" disabled={!apprViewEnabled} onClick={viewAppr}>문서보기</Button>
        </div>
      </div>
      <Dcr30_Move_DcrClass open={moveOpen} authCheck defaultClassTreeId={defaultClassTreeId} onResult={onPickClass} onClose={() => setMoveOpen(false)} />
      {/* insertLinkApproval() L305-327: Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A32", insetModel, isAdmin, callback → updateApprId) / retrieveApproval */}
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
