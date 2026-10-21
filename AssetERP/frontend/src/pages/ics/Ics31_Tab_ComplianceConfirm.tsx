/**
 * 내부통제 준수점검(준감인) (K02) — 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수점검(준감인) #1311
 * AS-IS: myApp/client/vi/ics/Ics31_Tab_ComplianceConfirm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L70-112: center = vlc = 툴바(기준 분기(월): 기준년도 · 월/분기 콤보 · 검색 · 미확인건만 조회 · [조회][확인][확인취소]) / 체크박스 다중 그리드 + 페이징(100).
 * 제출된 직원 작성 내역을 확인·확인취소한다. 열 때 자동 조회는 없다(원본 그대로).
 * [상신] 버튼(apprButton, 조회창 Ics32_Lookup_RelateAppr)은 원본도 툴바에 붙이지 않아(L110 주석) 도달할 수 없다 — 변환하지 않는다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsComplianceConfirm } from '@/types/ics';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { defaultPeriod, getDate } from './icsComplyPeriod';

const gb = gbFor<IcsComplianceConfirm>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)

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
  const view = useRef({ cycleType, year, period, searchText, checkBox });
  view.current = { cycleType, year, period, searchText, checkBox };
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ stdDate: string; cycleType: string; searchText: string; checkBox: boolean } | undefined>(undefined);

  // [E0] 화면 열림 (생성자 L70-112) → settings()
  // settings() L114-194 / enable() L196-244: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다. 설정이 없으면 안내하고 화면을 끈다
  useEffect(() => {
    icsApi.getComplianceWriteCycleType().then(c => {
      if (c === 'M' || c === 'Q') {
        const d = defaultPeriod(c);
        setCycleType(c); setYear(String(d.year)); setPeriod(d.period);
      } else {
        message.warning('체크주기가 설정되어있지않습니다. 관리자에게 연락해주세요');
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, []);

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

  // [E2] searchText.KeyPress [Enter] (L148) → retrieve(). [E4] retrieveButton[조회].Select (L170) → retrieve() L271-312: 조건을 만들어 1페이지부터 읽는다
  const retrieve = useCallback(async () => {
    const v = view.current;
    const std = getDate(v.year, v.period, v.cycleType ?? 'M');
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    paramRef.current = { stdDate: std.format('YYYY-MM-DD'), cycleType: v.cycleType ?? 'M', searchText: v.searchText, checkBox: v.checkBox };
    await getPaging(1);
  }, [getPaging]);

  // [E5] confirmButton[확인].Select (L176) / [E6] cancleButton[확인취소].Select (L182) → confirmChk() L314-364: 체크한 행만, 제출 안 된 행이 있으면 안내
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

  // [E7 생략] apprButton[상신].Select (L188) → listPopup() — 툴바에 붙이지 않은 버튼(원본 L110 주석)이라 도달할 수 없다

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
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
            {/* [E1] yyyyText.ValueChange (L139) · [E3] periodComboBox[MonthsCode].ValueChange (L159) → yyyyStr·periodStr 갱신 (조회할 때 읽는다) */}
            <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            {cycleType != null && (
              <SystemCodeComboBox
                kindCd={cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                style={{ width: 80 }}
                allowClear={false}
                value={period}
                onChange={code => { if (code) setPeriod(code); }}
              />
            )}
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
      </div>
    </div>
  );
};
