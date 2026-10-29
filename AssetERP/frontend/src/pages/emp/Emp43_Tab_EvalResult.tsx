/**
 * [1396] 경영관리 > 05. 인사평가 > 인사평가 결과조회 (T05)
 * AS-IS: myApp/client/vi/emp/Emp43_Tab_EvalResult.java (335줄) + Emp00_Lookup_SelectSingle(공용 사원찾기 조회창) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L75-105: 위 툴바 50 = 평가기간 [년도 45] 년 [상반기/하반기 콤보 100] [기간조건 제외] · 사원명 [LookupTriggerField 100] · 검색 [조직/직위 200] · [조회],
 *   아래 = 인사평가 결과 그리드(행번호, 체크박스 다중, 2단 헤더: (평가기간) / 인사평가 대상자 / 1차 평가(파랑 456EA6) / 2차 평가(빨강 DD5E5E) / 평가합계 / (평정사유·보기 아이콘) / 상벌 및 평정사유 가감 / (대표이사 평가) / 최종결과)
 * T03·T04와 같은 SQL 계열(selectByTextAdmin)에 사원 조건(targetPersonId)이 더해지고, "기간조건 제외"를 켜면 selectByTextAdminAll(전체 기간)을 부른다
 * 스타일: SG (견본 docs/page-style/SG/Tdm01_Tab_Hr.tsx). UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 한 줄에 다 들어가지 않아 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message } from 'antd';
import dayjs from 'dayjs';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalAdmin, EvalSetting } from '@/types/emp';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { SearchBar } from '@/components/search';

const gb = gbFor<EvalAdmin>();

/** setHtmlGridStyle(제목, 색) — 굵은 글씨 + 색 */
const hs = (color: string) => ({ color, fontWeight: 'bold' });
const BLUE = hs('#456EA6');
const RED = hs('#DD5E5E');
const BLACK = hs('#000000');

export const Emp43_Tab_EvalResult: React.FC = () => {
  // settings() L107-224: 기준 = 이번 달 1일의 전날(지난달) — 년도, 1~6월이면 상반기 아니면 하반기
  const initDate = useMemo(() => dayjs().startOf('month').subtract(1, 'day'), []);
  const [stdYear, setStdYear] = useState(initDate.format('YYYY'));
  const [termCode, setTermCode] = useState<string | undefined>(initDate.month() < 6 ? '20' : '30');
  const [termNotinclude, setTermNotinclude] = useState(false);
  const [personName, setPersonName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [setting, setSetting] = useState<EvalSetting | null>(null);
  const [rows, setRows] = useState<EvalAdmin[]>([]);
  const [personOpen, setPersonOpen] = useState(false);
  const [reasonView, setReasonView] = useState<string | null>(null);

  // 조회 조건을 동기로 들고 있는다 (이벤트에서 상태 반영 전 값으로 조회하려고)
  const query = useRef({ stdYear, termCode, searchText, termNotinclude: false, personId: null as number | null, cycle: null as string | null });
  const committedYear = useRef(stdYear);

  // retrieve() L278-317: 기간조건 제외면 emp.Emp43_EvalTarget.selectByTextAdminAll, 아니면 selectByTextAdmin(stdYear, stdTermCode — 반기별(05)이면 콤보, 아니면 "10").
  //   searchText = "%글자%", 사원을 골랐으면 targetPersonId
  const retrieve = useCallback(async () => {
    const q = query.current;
    try {
      setRows(q.termNotinclude
        ? await empEvalApi.searchEvalAdminAll(q.searchText, q.personId)
        : await empEvalApi.searchEvalAdmins(q.stdYear, q.cycle === '05' ? q.termCode ?? '' : '10', q.searchText, q.personId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L75-105) → settings(), retrieve().
  //   settings(): sys.Sys01_Company.selectById(회사 평가기간 설정).
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
      await retrieve();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] termNotinclude[기간조건 제외].ValueChange (L110-126) → 켜면 년도·기간 콤보 비활성, 끄면 년도 활성 + 기간 콤보는 반기별(05)일 때만 활성(아니면 "전체" 비활성). 조회는 하지 않는다
  const onTermNotinclude = (checked: boolean) => {
    setTermNotinclude(checked);
    query.current.termNotinclude = checked;
    if (!checked && query.current.cycle !== '05') setTermCode(undefined);
  };

  // [E2] personName.TriggerClick (L128-147) → Emp00_Lookup_SelectSingle.open(true, 오늘): 사원을 고르면 사원명·ID, [전체]면 둘 다 비운다. 조회는 하지 않는다
  const onPickPerson = (t: { personId: number; korNm?: string | null } | null) => {
    setPersonName(t?.korNm ?? '');
    query.current.personId = t?.personId ?? null;
  };

  // [E4] dataYearText.ValueChange (L163) → retrieve()
  const onYearCommit = () => {
    if (stdYear === committedYear.current) return;
    committedYear.current = stdYear;
    query.current.stdYear = stdYear;
    void retrieve();
  };

  // [E5] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L212) → retrieve()
  const onTermChange = (code: string | undefined) => {
    setTermCode(code);
    query.current.termCode = code;
    void retrieve();
  };

  // actionCell01 (ImageCell View) L227-244 → 1차·2차 평정사유가 있는 것만 NoticeMessage.show("평정사유", "[1차 평가 : 등급] 사유\n\n[2차 평가 : 등급] 사유")
  const onView = (row: EvalAdmin) => {
    if (row.firstEvalReason != null && row.secondEvalReason != null) {
      setReasonView(`[1차 평가 : ${row.firstEvalGrade ?? ''}] ${row.firstEvalReason}\n\n[2차 평가 : ${row.secondEvalGrade ?? ''}] ${row.secondEvalReason}`);
    } else if (row.firstEvalReason != null) {
      setReasonView(`[1차 평가 : ${row.firstEvalGrade ?? ''}] ${row.firstEvalReason}`);
    } else if (row.secondEvalReason != null) {
      setReasonView(`[2차 평가 : ${row.secondEvalGrade ?? ''}] ${row.secondEvalReason}`);
    }
  };

  // buildGrid() L226-276
  const columnDefs = useMemo(() => [
    gb.textCenter(undefined, 200, '평가기간', {  // L253 — 모델 getEvalDateStr(): "yyyy-MM-dd ~ yyyy-MM-dd"
      colId: 'evalDateStr',
      valueGetter: p => `${p.data?.evalStartDate ?? ''} ~ ${p.data?.evalCloseDate ?? ''}`,
    }),
    gb.group('인사평가 대상자', [  // HeaderGroupMap(0, 3, …, 1, 4) L246
      gb.text('orgNm', 180, '부서'),  // L254
      gb.textCenter('personNm', 80, '성명'),  // L255
      gb.textCenter('posNm', 80, '직위'),  // L256
      gb.textCenter('titleNm', 80, '직책'),  // L257
    ]),
    { ...gb.group('1차 평가', [  // HeaderGroupMap(0, 7, …, 1, 2) L247
      gb.doubleCenter('firstEvalScore', 60, '점수', { headerStyle: BLUE }),  // L258
      gb.textCenter('firstEvalGrade', 60, '등급', { headerStyle: BLUE }),  // L259
    ]), headerStyle: BLUE },
    { ...gb.group('2차 평가', [  // HeaderGroupMap(0, 9, …, 1, 2) L248
      gb.doubleCenter('secondEvalScore', 60, '점수', { headerStyle: RED }),  // L260
      gb.textCenter('secondEvalGrade', 60, '등급', { headerStyle: RED }),  // L261
    ]), headerStyle: RED },
    { ...gb.group('평가합계', [  // HeaderGroupMap(0, 11, …, 1, 2) L249
      gb.doubleCenter('totalEvalScore', 60, '점수'),  // L262
      gb.textCenter('totalEvalGrade', 60, '등급'),  // L263
    ]), headerStyle: BLACK },
    gb.textCenter('totalOrderReason', 100, '평정사유'),  // L264
    iconCell<EvalAdmin>('view', 'actionCell', 30, '', onView),  // L265 addCell(ImageCell("View"))
    { ...gb.group('상벌 및 평정사유 가감', [  // HeaderGroupMap(0, 15, …, 1, 5) L250
      gb.longCenter('plusScore', 60, '상', { headerStyle: BLUE }),  // L266
      gb.longCenter('minusScore', 60, '벌', { headerStyle: BLUE }),  // L267
      gb.longCenter('reasonAdjustScore', 60, '사유', { headerStyle: BLUE }),  // L268
      gb.doubleCenter('adjustEvalScore', 80, '변경점수', { headerStyle: BLUE }),  // L269
      gb.textCenter('adjustEvalGrade', 80, '변경등급', { headerStyle: BLUE }),  // L270
    ]), headerStyle: BLUE },
    gb.longCenter('ceoEvalScore', 100, '대표이사<br>평가'),  // L271 — SQL·테이블에 열이 없어 원본도 늘 빈칸
    { ...gb.group('최종결과', [  // HeaderGroupMap(0, 21, …, 1, 2) L251
      gb.doubleCenter('finalEvalScore', 60, '점수'),  // L272
      gb.textCenter('finalEvalGrade', 60, '등급'),  // L273
    ]), headerStyle: BLACK },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L218) → retrieve(), [E3] searchText.KeyPress [Enter] (L151) → retrieve() */}
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="평가기간">
            <Input style={{ width: 60 }} maxLength={4} disabled={termNotinclude} value={stdYear}
              onChange={e => setStdYear(e.target.value)} onBlur={onYearCommit} onPressEnter={onYearCommit} />
            <span>년</span>
            <SystemCodeComboBox kindGroupCd="EmpEvalTermCode0001" style={{ width: 100 }} placeholder="전체"
              disabled={termNotinclude || (setting != null && setting.empEvalCycleCode !== '05')}
              value={termCode} onChange={onTermChange} />
          </SearchBar.Field>
          <Checkbox checked={termNotinclude} onChange={e => onTermNotinclude(e.target.checked)}>기간조건 제외</Checkbox>
          <SearchBar.Field label="사원명">
            <LookupInput width={100} value={personName} onOpen={() => setPersonOpen(true)} onClear={() => onPickPerson(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="조직/직위" value={searchText}
              onChange={e => { setSearchText(e.target.value); query.current.searchText = e.target.value; }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<EvalAdmin> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.evalTargetId)} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personOpen} transDate={dayjs().format('YYYY-MM-DD')}
        onResult={t => { onPickPerson(t); setPersonOpen(false); }} onClose={() => setPersonOpen(false)} />
      <AreaMessage open={reasonView != null} title="평정사유" value={reasonView} readOnly width={450} height={250} onClose={() => setReasonView(null)} />
    </div>
  );
};
