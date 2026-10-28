/**
 * [1393] 경영관리 > 05. 인사평가 > 인사평가수행(평가자) (T02)
 * AS-IS: myApp/client/vi/emp/Emp43_Tab_EvalExecute.java (220줄) + Emp44_Lookup_Write(465줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L59-85 / settings() L87-155: 위 툴바 50 = 평가기간 [년도 45] 년 [상반기/하반기 콤보 100] · 검색 [조직/직위/성명 200] · [조회],
 *   아래 = 인사평가 수행 그리드(행번호, 단일 선택, 2단 헤더: 인사평가 대상자(평가구분 80 · 구분 80 · 직위 80 · 성명 120 · 부서 180) · 인사평가결과(파랑 456EA6: 인사평가표 100(아이콘) · 점수 80 · 등급 80 · 평가상태 100 · 평정사유 100))
 * 로그인 사원이 1차 또는 2차 평가자인 대상자만 나온다(서버가 로그인 사원으로 조회). 평가기간 콤보는 회사 설정이 05(반기별)일 때만 켜지고, 아니면 "전체" 비활성 + 조회는 기간코드 "10"
 * 스타일: SG (견본 — docs/page-style.md). UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 한 줄에 다 들어가지 않아 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalExecute, EvalSetting } from '@/types/emp';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Emp44_Lookup_Write } from './Emp44_Lookup_Write';

const gb = gbFor<EvalExecute>();

/** setHtmlGridStyle(제목, "456EA6") L208-211 — 굵은 글씨 + 색 */
const BLUE = { color: '#456EA6', fontWeight: 'bold' };

export const Emp43_Tab_EvalExecute: React.FC = () => {
  // settings() L87-155: 기준 = 이번 달 1일의 전날(지난달) — 년도, 1~6월이면 상반기 아니면 하반기
  const initDate = useMemo(() => dayjs().startOf('month').subtract(1, 'day'), []);
  const [stdYear, setStdYear] = useState(initDate.format('YYYY'));
  const [termCode, setTermCode] = useState<string | undefined>(initDate.month() < 6 ? '20' : '30');
  const [searchText, setSearchText] = useState('');
  const [setting, setSetting] = useState<EvalSetting | null>(null);
  const [rows, setRows] = useState<EvalExecute[]>([]);
  const [writeTarget, setWriteTarget] = useState<EvalExecute | null>(null);

  // 조회 조건을 동기로 들고 있는다 (이벤트에서 상태 반영 전 값으로 조회하려고)
  const query = useRef({ stdYear, termCode, searchText, cycle: null as string | null });
  const committedYear = useRef(stdYear);

  // retrieve() L187-206: emp.Emp43_EvalTarget.selectByText(companyId·personId(서버), stdYear, "%검색어%", stdTermCode — 반기별(05)이면 콤보, 아니면 "10")
  const retrieve = useCallback(async () => {
    const q = query.current;
    try {
      setRows(await empEvalApi.searchEvalExecutes(q.stdYear, q.cycle === '05' ? q.termCode ?? '' : '10', q.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L59-85) → settings(): 서비스 sys.Sys01_Company.selectById(회사 평가기간 설정) → retrieve().
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

  // [E1] dataYearText.ValueChange (L94) → retrieve()
  const onYearCommit = () => {
    if (stdYear === committedYear.current) return;
    committedYear.current = stdYear;
    query.current.stdYear = stdYear;
    void retrieve();
  };

  // [E2] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L143) → retrieve()
  const onTermChange = (code: string | undefined) => {
    setTermCode(code);
    query.current.termCode = code;
    void retrieve();
  };

  // buildGrid() L157-185
  const columnDefs = useMemo(() => [
    gb.group('인사평가 대상자', [  // HeaderGroupMap(0, 1, "인사평가 대상자", 1, 5) L169
      gb.textCenter('orderEvalNm', 80, '평가구분'),  // L173
      gb.textCenter('orgHeadNm', 80, '구분'),  // L174
      gb.textCenter('posNm', 80, '직위'),  // L175
      gb.textCenter('personNm', 120, '성명'),  // L176
      gb.text('orgNm', 180, '부서'),  // L177
    ]),
    { ...gb.group('인사평가결과', [  // HeaderGroupMap(0, 6, …, 1, 5) L170
      // L178 addCell(ImageCell("Edit")) → Emp44_Lookup_Write.open(선택한 행, callback → retrieve())
      { ...iconCell<EvalExecute>('edit', 'actionCell', 100, '인사평가표', row => setWriteTarget(row)), headerStyle: BLUE },
      gb.textCenter('orderScore', 80, '점수', { headerStyle: BLUE }),  // L179
      gb.textCenter('orderGrade', 80, '등급', { headerStyle: BLUE }),  // L180
      gb.textCenter('orderStatus', 100, '평가상태', { headerStyle: BLUE }),  // L181
      gb.textCenter('orderReason', 100, '평정사유', { headerStyle: BLUE }),  // L182
    ]), headerStyle: BLUE },
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L149) → retrieve() */}
        <SearchBar onSearch={retrieve}>
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
          <SingleGrid<EvalExecute> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.evalTargetId)} />
        </div>
      </div>
      {/* [E4] actionCell (ImageCell).callbackOnCreate (L162) → 창을 닫은 뒤 retrieve() */}
      <Emp44_Lookup_Write target={writeTarget} onClosed={() => { setWriteTarget(null); void retrieve(); }} />
    </div>
  );
};
