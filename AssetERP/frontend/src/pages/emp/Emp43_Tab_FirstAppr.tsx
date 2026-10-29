/**
 * [1394] 경영관리 > 05. 인사평가 > 인사평가결과(인사부) (T03)
 * AS-IS: myApp/client/vi/emp/Emp43_Tab_FirstAppr.java (573줄) + Emp43_Edit_Score(114줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L91-134: 위 툴바 50 = 평가기간 [년도 45] 년 [상반기/하반기 콤보 100] · 검색 [조직/직위/성명 200] · [조회],
 *   가운데 = 인사평가결과 그리드(행번호, 체크박스 다중, 2단 헤더: 인사평가 대상자 / 1차 평가결과(파랑 456EA6) / 2차 평가결과(빨강 DD5E5E) / 평가결과 합계 / (수정 아이콘) / 상벌가감 / 변경결과),
 *   아래 70 = 문서분류 [LookupTriggerField 800] · 상신상태 [읽기 전용 250] · [상신] · [문서보기]
 * 1단계(F01~F12·S05와 같은 사유): [상신]·[문서보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc과 문서분류 선택창 Dcr30_Move_DcrClass는 다음 단계 —
 *   [상신]은 원본의 조건 검사("평정사유 누락"·"완료되지 않은 인사평가내역"·"이미 상신 중")까지만 하고 상신 행(emp45)을 만들지 않는다
 * 스타일: SGP (견본 docs/page-style/SGP/Chk02_Tab_DailyList.tsx). UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 한 줄에 다 들어가지 않아 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
import { Emp43_Edit_Score } from './Emp43_Edit_Score';

const gb = gbFor<EvalAdmin>();

/** setHtmlGridStyle(제목, 색) — 굵은 글씨 + 색 */
const hs = (color: string) => ({ color, fontWeight: 'bold' });
const BLUE = hs('#456EA6');
const RED = hs('#DD5E5E');
const BLACK = hs('#000000');

/** 상신 중이거나 완료된 문서 상태(결재 진행 10 · 20 · 30) */
const isApprLocked = (code: string) => code === '10' || code === '20' || code === '30';

export const Emp43_Tab_FirstAppr: React.FC = () => {
  // settings() L136-277: 기준 = 이번 달 1일의 전날(지난달) — 년도, 1~6월이면 상반기 아니면 하반기
  const initDate = useMemo(() => dayjs().startOf('month').subtract(1, 'day'), []);
  const [stdYear, setStdYear] = useState(initDate.format('YYYY'));
  const [termCode, setTermCode] = useState<string | undefined>(initDate.month() < 6 ? '20' : '30');
  const [searchText, setSearchText] = useState('');
  const [setting, setSetting] = useState<EvalSetting | null>(null);
  const [rows, setRows] = useState<EvalAdmin[]>([]);
  const [scoreTarget, setScoreTarget] = useState<EvalAdmin | null>(null);
  const [reasonView, setReasonView] = useState<{ title: string; text: string } | null>(null);
  // 문서분류 칸: 빈 칸 안내 글(defaultName L279-298)과 상신 상태(retrieveApprStatus L395-448)
  const [classEmptyText, setClassEmptyText] = useState('미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.');
  const [apprStepCode, setApprStepCode] = useState('');
  const [apprStepName, setApprStepName] = useState('');
  const [apprEnabled, setApprEnabled] = useState(false);
  const [apprOpenEnabled, setApprOpenEnabled] = useState(false);

  // 조회 조건을 동기로 들고 있는다 (이벤트에서 상태 반영 전 값으로 조회하려고)
  const query = useRef({ stdYear, termCode, searchText, cycle: null as string | null });
  const committedYear = useRef(stdYear);
  const rowsRef = useRef<EvalAdmin[]>([]);
  const apprCodeRef = useRef('');  // 수정 아이콘 콜백이 그리드 정의 안에 있어서 최신 상신 상태를 ref로 읽는다

  const termParam = () => (query.current.cycle === '05' ? query.current.termCode ?? '' : '10');

  // retrieveApprStatus() L395-448: emp.Emp45_EvalRelateAppr.selectByTermCode — 1차 상신문서 상태. 최종 결재가 진행 중이면 [상신] 비활성
  const retrieveApprStatus = useCallback(async () => {
    setApprStepName('');
    try {
      const r = await empEvalApi.getEvalRelateAppr(query.current.stdYear, termParam());
      if (r?.apprStatusCode != null) {
        setApprEnabled(!isApprLocked(r.finalApprStatusCode ?? ''));
        apprCodeRef.current = r.apprStatusCode;
        setApprStepCode(r.apprStatusCode);
        setApprStepName(r.apprStatusName ?? '');
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

  // retrieve() L374-393: emp.Emp43_EvalTarget.selectByTextAdmin(companyId(서버), stdYear, "%검색어%", stdTermCode — 반기별(05)이면 콤보, 아니면 "10") → retrieveApprStatus()
  const retrieve = useCallback(async (text?: string) => {
    const q = query.current;
    try {
      const list = await empEvalApi.searchEvalAdmins(q.stdYear, termParam(), text ?? q.searchText);
      rowsRef.current = list;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await retrieveApprStatus();
  }, [retrieveApprStatus]);

  // [E0] 화면 열림 (생성자 L91-134) → settings(), retrieve().
  //   settings(): sys.Sys01_Company.selectById(회사 평가기간 설정) · dcr.Dcr30_Link.selectByLinkCode("A70")(문서분류 빈 칸 글).
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
        const links = await dcrApi.searchClassTreeByLinkCode('A70');
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

  // [E5] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L265) → retrieve()
  const onTermChange = (code: string | undefined) => {
    setTermCode(code);
    query.current.termCode = code;
    void retrieve();
  };

  // [E2 생략] classTreeFullName[문서분류].TriggerClick (L197) → openLookupDoc() L451-460: Dcr30_Move_DcrClass 문서분류 선택창은 다음 단계
  const openLookupDoc = () => message.info('문서분류 선택창(Dcr30_Move_DcrClass)은 아직 변환 전입니다.');

  // [E3] apprButton[상신].Select (L203) → insertRelateAppr() L462-485
  //   목록 검사(L204-218) → 목록을 "%"로 다시 조회 → "이미 상신 중입니다" 검사 → emp.Emp45_EvalRelateAppr.insert → insertLinkApprovals() L487-533 (Apr01_Edit_ApprDoc 상신창 — 다음 단계)
  const onAppr = async () => {
    for (const m of rowsRef.current) {
      if (m.firstOrderReason === '작성필요') { message.warning('1차 평정사유가 누락되었습니다.(특정 등급 필수입력)'); return; }
      if (m.secondOrderReason === '작성필요') { message.warning('2차 평정사유가 누락되었습니다.(특정 등급 필수입력)'); return; }
      if (m.totalEvalStatus !== '완료') { message.warning('완료되지 않은 인사평가내역이 존재합니다'); return; }
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

  // [E4 생략] apprOpenButton[문서보기].Select (L240) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(model, false): 결재 문서창은 다음 단계
  const onApprOpen = () => message.info('전자결재 문서보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다.');

  // [E9] actionCell03 (ImageCell Edit).callbackOnCreate (L331) → 상신 중이거나 완료된 문서는 수정 불가, 아니면 Emp43_Edit_Score.edit(선택한 행, callback → retrieve())
  const onEdit = (row: EvalAdmin) => {
    if (isApprLocked(apprCodeRef.current)) { message.warning('상신 중이거나 완료된 문서는 수정이 불가능합니다'); return; }
    setScoreTarget(row);
  };

  // [E7][E8] lookup01·lookup02.TriggerClick (L303-322) → 평정사유가 있으면 NoticeMessage.show("1차 평정사유"·"2차 평정사유", 사유)
  const reasonCol = (field: 'firstOrderReason' | 'secondOrderReason', reasonField: 'firstEvalReason' | 'secondEvalReason', title: string, color: string) =>
    gb.textCenter(field, 100, '사유', {
      headerStyle: hs(color),
      cellRenderer: (p: { value?: string | null; data?: EvalAdmin }) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#1677ff' }}>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); const t = p.data?.[reasonField]; if (t != null) setReasonView({ title, text: t }); }} />
          {p.value}
        </span>
      ),
    });

  // buildGrid() L300-372
  const columnDefs = useMemo(() => [
    gb.group('인사평가 대상자', [  // HeaderGroupMap(0, 2, …, 1, 4) L341
      gb.text('orgNm', 180, '부서'),  // L349
      gb.textCenter('personNm', 80, '성명'),  // L350
      gb.textCenter('posNm', 80, '직위'),  // L351
      gb.textCenter('orgHeadNm', 60, '구분'),  // L352
    ]),
    { ...gb.group('1차 평가결과', [  // HeaderGroupMap(0, 6, …, 1, 4) L342
      gb.textCenter('firstPersonNm', 80, '성명', { headerStyle: BLUE }),  // L353
      gb.doubleCenter('firstEvalScore', 60, '점수', { headerStyle: BLUE }),  // L354
      gb.textCenter('firstEvalGrade', 60, '등급', { headerStyle: BLUE }),  // L355
      reasonCol('firstOrderReason', 'firstEvalReason', '1차 평정사유', '#456EA6'),  // L356 + lookup01
    ]), headerStyle: BLUE },
    { ...gb.group('2차 평가결과', [  // HeaderGroupMap(0, 10, …, 1, 4) L343
      gb.textCenter('secondPersonNm', 80, '성명', { headerStyle: RED }),  // L357
      gb.doubleCenter('secondEvalScore', 60, '점수', { headerStyle: RED }),  // L358
      gb.textCenter('secondEvalGrade', 60, '등급', { headerStyle: RED }),  // L359
      reasonCol('secondOrderReason', 'secondEvalReason', '2차 평정사유', '#DD5E5E'),  // L360 + lookup02
    ]), headerStyle: RED },
    { ...gb.group('평가결과 합계', [  // HeaderGroupMap(0, 14, …, 1, 3) L344
      gb.doubleCenter('totalEvalScore', 60, '점수'),  // L361
      gb.textCenter('totalEvalGrade', 60, '등급'),  // L362
      gb.textCenter('totalEvalStatus', 100, '결과'),  // L363
    ]), headerStyle: BLACK },
    iconCell<EvalAdmin>('edit', 'actionCell', 30, '', onEdit),  // L364 addCell(ImageCell("Edit")) → Emp43_Edit_Score
    { ...gb.group('상벌가감', [  // HeaderGroupMap(0, 18, …, 1, 2) L345
      gb.longCenter('plusScore', 60, '상', { headerStyle: BLUE }),  // L365
      gb.longCenter('minusScore', 60, '벌', { headerStyle: BLUE }),  // L366
    ]), headerStyle: BLUE },
    gb.longCenter('reasonAdjustScore', 60, '평정사유<br>가감', { headerStyle: BLUE }),  // L367
    { ...gb.group('변경결과', [  // HeaderGroupMap(0, 21, …, 1, 2) L346
      gb.doubleCenter('adjustEvalScore', 60, '점수'),  // L368
      gb.textCenter('adjustEvalGrade', 60, '등급'),  // L369
    ]), headerStyle: BLACK },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L271) → retrieve() */}
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
      <Emp43_Edit_Score target={scoreTarget} onSaved={() => { void retrieve(); }} onClose={() => setScoreTarget(null)} />
      <AreaMessage open={reasonView != null} title={reasonView?.title ?? ''} value={reasonView?.text} readOnly width={450} height={250} onClose={() => setReasonView(null)} />
    </div>
  );
};
