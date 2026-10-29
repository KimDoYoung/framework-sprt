/**
 * [1395] 경영관리 > 05. 인사평가 > 인사평가보고(대표이사) (T04)
 * AS-IS: myApp/client/vi/emp/Emp43_Tab_FinalAppr.java (580줄) + Emp43_Edit_CeoScore(112줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L91-134: 위 툴바 50 = 평가기간 [년도 45] 년 [상반기/하반기 콤보 100] · 검색 [조직/직위/성명 200] · [조회],
 *   가운데 = 인사평가보고 그리드(행번호, 체크박스 다중, 2단 헤더: 인사평가 대상자 / 평가결과(상벌가감후)(파랑 456EA6) / (평정사유) / (보기·수정 아이콘) / 대표이사 평가 / 최종결과),
 *   아래 70 = 문서분류 [LookupTriggerField 800] · 상신상태 [읽기 전용 250] · [상신] · [문서보기]
 * T03(Emp43_Tab_FirstAppr)과 같은 SQL(selectByTextAdmin)·툴바·상신 줄이고, 다른 점은 최종 보고 상신(insertFinal·updateFinalApprId·링크코드 A71)과 열·수정창(Emp43_Edit_CeoScore)
 * 1단계(T03과 같은 사유): [상신]·[문서보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc과 문서분류 선택창 Dcr30_Move_DcrClass는 다음 단계 —
 *   [상신]은 원본의 조건 검사("평정사유 누락"·"완료되지 않은 인사평가내역"·"수행결과보고 미완료"·"이미 상신 중")까지만 하고 상신 행(emp45)을 만들지 않는다
 * 스타일: SGP (견본 docs/page-style/SGP/Chk02_Tab_DailyList.tsx). UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 한 줄에 다 들어가지 않아 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { empEvalApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { EvalAdmin, EvalSetting } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { SearchBar } from '@/components/search';
import { Emp43_Edit_CeoScore } from './Emp43_Edit_CeoScore';

const gb = gbFor<EvalAdmin>();

/** setHtmlGridStyle(제목, 색) — 굵은 글씨 + 색 */
const hs = (color: string) => ({ color, fontWeight: 'bold' });
const BLUE = hs('#456EA6');
const BLACK = hs('#000000');

/** 상신 중이거나 완료된 문서 상태(결재 진행 10 · 20 · 30) */
const isApprLocked = (code: string) => code === '10' || code === '20' || code === '30';

export const Emp43_Tab_FinalAppr: React.FC = () => {
  // settings() L136-282: 기준 = 이번 달 1일의 전날(지난달) — 년도, 1~6월이면 상반기 아니면 하반기
  const initDate = useMemo(() => dayjs().startOf('month').subtract(1, 'day'), []);
  const [stdYear, setStdYear] = useState(initDate.format('YYYY'));
  const [termCode, setTermCode] = useState<string | undefined>(initDate.month() < 6 ? '20' : '30');
  const [searchText, setSearchText] = useState('');
  const [setting, setSetting] = useState<EvalSetting | null>(null);
  const [rows, setRows] = useState<EvalAdmin[]>([]);
  const [scoreTarget, setScoreTarget] = useState<EvalAdmin | null>(null);
  const [reasonView, setReasonView] = useState<string | null>(null);
  // 문서분류 칸: 빈 칸 안내 글(defaultName L284-303)과 상신 상태(retrieveApprStatus L402-455)
  const [classEmptyText, setClassEmptyText] = useState('미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.');
  const [apprStepCode, setApprStepCode] = useState('');
  const [apprStepName, setApprStepName] = useState('');
  const [apprEnabled, setApprEnabled] = useState(false);
  const [apprOpenEnabled, setApprOpenEnabled] = useState(false);

  // 조회 조건을 동기로 들고 있는다 (이벤트에서 상태 반영 전 값으로 조회하려고)
  const query = useRef({ stdYear, termCode, searchText, cycle: null as string | null });
  const committedYear = useRef(stdYear);
  const rowsRef = useRef<EvalAdmin[]>([]);
  const apprCodeRef = useRef('');  // 아이콘 콜백이 그리드 정의 안에 있어서 최신 상신 상태를 ref로 읽는다

  const termParam = () => (query.current.cycle === '05' ? query.current.termCode ?? '' : '10');

  // retrieveApprStatus() L402-455: emp.Emp45_EvalRelateAppr.selectByTermCode — 최종 보고 상신문서 상태. 진행 중(10·20·30)이면 [상신] 비활성
  const retrieveApprStatus = useCallback(async () => {
    setApprStepName('');
    try {
      const r = await empEvalApi.getEvalRelateAppr(query.current.stdYear, termParam());
      if (r?.finalApprStatusCode != null) {
        setApprEnabled(!isApprLocked(r.finalApprStatusCode));
        apprCodeRef.current = r.finalApprStatusCode;
        setApprStepCode(r.finalApprStatusCode);
        setApprStepName(r.finalApprStatusName ?? '');
        setApprOpenEnabled(true);
      } else {
        apprCodeRef.current = '00';
        setApprStepCode('00');
        setApprStepName('미상신');
        setApprEnabled(true);
        setApprOpenEnabled(false);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieve() L381-400: emp.Emp43_EvalTarget.selectByTextAdmin(companyId(서버), stdYear, "%검색어%", stdTermCode — 반기별(05)이면 콤보, 아니면 "10") → retrieveApprStatus()
  const retrieve = useCallback(async () => {
    const q = query.current;
    try {
      const list = await empEvalApi.searchEvalAdmins(q.stdYear, termParam(), q.searchText);
      rowsRef.current = list;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await retrieveApprStatus();
  }, [retrieveApprStatus]);

  // [E0] 화면 열림 (생성자 L91-134) → settings(), retrieve().
  //   settings(): sys.Sys01_Company.selectById(회사 평가기간 설정) · dcr.Dcr30_Link.selectByLinkCode("A71")(문서분류 빈 칸 글).
  //   원본은 설정 응답을 기다리지 않고 조회해 반기별 회사의 처음 조회가 기간코드 "10"으로 나갈 수 있다 — 설정을 읽은 뒤 조회한다(T01 작업기록 결정과 같다)
  useEffect(() => {
    void (async () => {
      try {
        const s = await empEvalApi.getEvalSetting();
        setSetting(s);
        query.current.cycle = s.empEvalCycleCode;
        if (s.empEvalCycleCode !== '05') setTermCode(undefined);  // 비활성 + "전체"
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      try {
        const links = await dcrApi.searchClassTreeByLinkCode('A71');
        setClassEmptyText(links.length === 1 ? links[0].classTreeFullName : '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
      } catch { /* 안내 글만 못 바꾼다 */ }
      await retrieve();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] dataYearText.ValueChange (L145) → retrieve()
  const onYearCommit = () => {
    if (stdYear === committedYear.current) return;
    committedYear.current = stdYear;
    query.current.stdYear = stdYear;
    void retrieve();
  };

  // [E5] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L270) → retrieve()
  const onTermChange = (code: string | undefined) => {
    setTermCode(code);
    query.current.termCode = code;
    void retrieve();
  };

  // [E2 생략] classTreeFullName[문서분류].TriggerClick (L197) → openLookupDoc(): Dcr30_Move_DcrClass 문서분류 선택창은 다음 단계
  const openLookupDoc = () => message.info('문서분류 선택창(Dcr30_Move_DcrClass)은 아직 변환 전입니다.');

  // [E3] apprButton[상신].Select (L203) → insertRelateAppr() L469-492
  //   목록 검사(L206-226) → 목록을 "%"로 다시 조회 → "이미 상신 중입니다" 검사 → emp.Emp45_EvalRelateAppr.insertFinal → insertLinkApprovals() L494-540 (Apr01_Edit_ApprDoc 상신창, 링크코드 A71 — 다음 단계)
  const onAppr = async () => {
    for (const m of rowsRef.current) {
      if (m.firstOrderReason === '작성필요') { message.warning('1차 평정사유가 누락되었습니다.(특정 등급 필수입력)'); return; }
      if (m.secondOrderReason === '작성필요') { message.warning('2차 평정사유가 누락되었습니다.(특정 등급 필수입력)'); return; }
      if (m.totalEvalStatus !== '완료') { message.warning('완료되지 않은 인사평가내역이 존재합니다'); return; }
      if (m.apprStatus !== '완료') { message.warning('인사평가 수행결과보고가 아직 완료되지않았습니다'); return; }
    }
    try {
      const list = await empEvalApi.searchEvalAdmins(query.current.stdYear, termParam(), '');
      rowsRef.current = list;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    if (isApprLocked(apprStepCode)) { message.warning('이미 상신 중입니다'); return; }
    Modal.info({ title: '상신', content: '전자결재 상신(Apr01_Edit_ApprDoc)은 아직 변환 전입니다.' });
  };

  // [E4 생략] apprOpenButton[문서보기].Select (L245) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(model, false): 결재 문서창은 다음 단계
  const onApprOpen = () => message.info('전자결재 문서보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다.');

  // actionCell01 (ImageCell View) L322-339 → 1차·2차 평정사유가 있는 것만 NoticeMessage.show("평정사유", "[1차 평가 : 등급] 사유\n\n[2차 평가 : 등급] 사유")
  const onView = (row: EvalAdmin) => {
    if (row.firstEvalReason != null && row.secondEvalReason != null) {
      setReasonView(`[1차 평가 : ${row.firstEvalGrade ?? ''}] ${row.firstEvalReason}\n\n[2차 평가 : ${row.secondEvalGrade ?? ''}] ${row.secondEvalReason}`);
    } else if (row.firstEvalReason != null) {
      setReasonView(`[1차 평가 : ${row.firstEvalGrade ?? ''}] ${row.firstEvalReason}`);
    } else if (row.secondEvalReason != null) {
      setReasonView(`[2차 평가 : ${row.secondEvalGrade ?? ''}] ${row.secondEvalReason}`);
    }
  };

  // [E9] actionCell02 (ImageCell Edit).callbackOnCreate (L348) → 상신 중이거나 완료된 문서는 수정 불가, 아니면 Emp43_Edit_CeoScore.edit(선택한 행, callback → retrieve())
  const onEdit = (row: EvalAdmin) => {
    if (isApprLocked(apprCodeRef.current)) { message.warning('상신 중이거나 완료된 문서는 수정이 불가능합니다'); return; }
    setScoreTarget(row);
  };

  // [E7][E8 생략] lookup01·lookup02.TriggerClick (L308-321) — 원본 핸들러 본문이 비어 있고 그리드에 달리지도 않는다

  // buildGrid() L305-379
  const columnDefs = useMemo(() => [
    gb.group('인사평가 대상자', [  // HeaderGroupMap(0, 2, …, 1, 4) L358
      gb.text('orgNm', 180, '부서'),  // L363
      gb.textCenter('personNm', 100, '성명'),  // L364
      gb.textCenter('posNm', 100, '직위'),  // L365
      gb.textCenter('orgHeadNm', 80, '구분'),  // L366
    ]),
    { ...gb.group('평가결과(상벌가감후)', [  // HeaderGroupMap(0, 6, …, 1, 3) L359
      gb.doubleCenter('adjustEvalScore', 80, '점수', { headerStyle: BLUE }),  // L367
      gb.textCenter('adjustEvalGrade', 80, '등급', { headerStyle: BLUE }),  // L368
      gb.textCenter('apprStatus', 100, '결과', { headerStyle: BLUE }),  // L369
    ]), headerStyle: BLUE },
    gb.textCenter('totalOrderReason', 100, '평정사유'),  // L370
    iconCell<EvalAdmin>('view', 'actionCellView', 30, '', onView),  // L371 addCell(ImageCell("View"))
    iconCell<EvalAdmin>('edit', 'actionCellEdit', 30, '', onEdit),  // L372 addCell(ImageCell("Edit")) → Emp43_Edit_CeoScore
    { ...gb.group('대표이사 평가', [  // HeaderGroupMap(0, 12, …, 1, 2) L360
      gb.longCenter('ceoEvalBonus', 80, '가점', { headerStyle: BLUE }),  // L373
      gb.longCenter('ceoEvalPenalty', 80, '감점', { headerStyle: BLUE }),  // L374
    ]), headerStyle: BLUE },
    { ...gb.group('최종결과', [  // HeaderGroupMap(0, 14, …, 1, 2) L361
      gb.doubleCenter('finalEvalScore', 80, '점수'),  // L375
      gb.textCenter('finalEvalGrade', 80, '등급'),  // L376
    ]), headerStyle: BLACK },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L276) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="평가기간">
            <Input style={{ width: 60 }} maxLength={4} value={stdYear} onChange={e => setStdYear(e.target.value)} onBlur={onYearCommit} onPressEnter={onYearCommit} />
            <span>년</span>
            <SystemCodeComboBox kindGroupCd="EmpEvalTermCode0001" style={{ width: 100 }} placeholder="전체" disabled={setting != null && setting.empEvalCycleCode !== '05'}
              value={termCode} onChange={onTermChange} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="조직/직위/성명" value={searchText}
              onChange={e => { setSearchText(e.target.value); query.current.searchText = e.target.value; }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<EvalAdmin> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.evalTargetId)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #d9d9d9' }}>
          <span style={{ width: 105, textAlign: 'right', paddingRight: 10, flex: 'none' }}>문서분류</span>
          <LookupInput width={800} value="" placeholder={classEmptyText} onOpen={openLookupDoc} />
          <span style={{ paddingLeft: 10 }}>상신상태</span>
          <Input readOnly style={{ width: 250 }} value={apprStepName} />
          <Button type="register" disabled={!apprEnabled} onClick={onAppr}>상신</Button>
          <Button type="search" disabled={!apprOpenEnabled} onClick={onApprOpen}>문서보기</Button>
        </div>
      </div>
      <Emp43_Edit_CeoScore target={scoreTarget} onSaved={() => { void retrieve(); }} onClose={() => setScoreTarget(null)} />
      <AreaMessage open={reasonView != null} title="평정사유" value={reasonView} readOnly width={450} height={250} onClose={() => setReasonView(null)} />
    </div>
  );
};
