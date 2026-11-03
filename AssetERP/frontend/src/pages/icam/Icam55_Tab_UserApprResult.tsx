/**
 * [1316] KFS > 04. ICAM 사용자ID 관리 > 사용자ID 처리결과 등록 (EE30)
 * AS-IS: myApp/client/vi/icam/Icam55_Tab_UserApprResult.java (310줄) + Icam55_Lookup_UserApprResult(167줄, 선택내역 일괄반영 창)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-100: 가운데(여백 20, 테두리) = 툴바(신청일자 ~ · 신청서구분 170 · 검색 300 · 미처리만 조회 · [조회][저장][일괄저장]) + 셀 편집 그리드(CellEditGrid, 체크 다중, 행번호, 11열).
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 이 화면은 셀 편집 그리드 + 일괄반영 창.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n) UX-03, 날짜 열 폭 UX-08(읽기 90 · 편집 120)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { sysApi } from '@/api/sys';
import { IcamUserResult } from '@/types/icam';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Icam55_Lookup_UserApprResult } from './Icam55_Lookup_UserApprResult';

const gb = gbFor<IcamUserResult>();
const FORMAT = 'YYYY-MM-DD';
const NONE = '(선택안함)';

export const Icam55_Tab_UserApprResult: React.FC = () => {
  const user = useLoginUser();
  // settings() L102-147: 신청일자 = 올해 1월 1일 ~ 오늘, 신청서구분 "전체", 미처리만 조회 = true
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [regType, setRegType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [procResult, setProcResult] = useState(true);
  const [stateCodes, setStateCodes] = useState<Code[]>([]);
  const [batchIds, setBatchIds] = useState<number[] | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [viewStatus, setViewStatus] = useState<string | null>(null);

  // retrieve() L225-256: icam.Icam55_IcamUser.selectByDate
  const search = useCallback(() => icamUserApi.searchResults({
    searchText, regType, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), procResult,
  }), [searchText, regType, startDate, closeDate, procResult]);
  // [E3] updateButton[저장].Select (L134) → update() L258-271: icam.Icam55_IcamUser.update → retrieve()
  const save = useCallback(async (rows: IcamUserResult[]) => { await icamUserApi.saveResults(rows); return rows; }, []);
  const remove = useCallback(async () => undefined, []);

  const crud = useGridCrud<IcamUserResult>({ idField: 'icamUserId', search, save, remove, newRow: () => ({}), reloadAfterSave: true });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L67-100) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCodes('ProcStateCode').then(setStateCodes).catch(() => {});
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] allUpdateButton[일괄저장].Select (L141) → openLookupResult() L274-295
  const openLookupResult = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    if (checked.some(r => r.procStateCode != null)) { message.warning('이미 처리된 항목이 있습니다.'); return; }
    setBatchIds(checked.map(r => r.icamUserId));
  };

  // [E6] viewCell (ImageCell) L174-206: apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve())
  const apprView = (row: IcamUserResult) => {
    if (row.apprId == null) { message.warning('관련 상신문서가 존재하지 않습니다'); return; }
    setViewStatus(row.apprStatusCode ?? null);
    setViewApprId(row.apprId);
  };

  // [E5] procStateComboBox[ProcStateCode].Collapse (L152) → 인라인 L152-172: 고른 코드·이름을 행에 기록하고,
  //   (선택안함)이면 처리일자·처리상세·처리자를 비우고, 1(완료)·9(이행불가)이고 처리일자·처리자가 비었으면 오늘·로그인 사원
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '신청일자'),                                         // L210 (UX-08)
    gb.text('regTypeName', 300, '신청서구분'),                                   // L211
    gb.text('companyName', 300, '회사명'),                                       // L212
    gb.text('userName', 150, '사용자'),                                          // L213
    gb.text('procTypeName', 100, '처리구분'),                                    // L214
    iconCell<IcamUserResult>('view', 'viewCell', 60, '문서보기', apprView),      // L215
    gb.text('regEmpName', 80, '등록자'),                                         // L216
    gb.text('procStateName', 100, '처리결과', {                                  // L217
      editor: 'select',
      values: [NONE, ...stateCodes.map(c => c.name)],
      valueSetter: p => {
        const picked = p.newValue === NONE ? null : stateCodes.find(c => c.name === p.newValue) ?? null;
        const d = p.data;
        d.procStateCode = picked?.code ?? null;
        d.procStateName = picked?.name ?? null;
        if (picked == null) {
          d.procDate = null; d.procNote = null; d.procEmpId = null; d.procEmpName = null;
        } else if ((picked.code === '1' || picked.code === '9') && d.procDate == null && d.procEmpId == null) {
          d.procDate = dayjs().format(FORMAT); d.procEmpId = user.userId; d.procEmpName = user.name;
        }
        setTimeout(() => p.api.refreshCells({ rowNodes: p.node ? [p.node] : undefined, force: true }));
        return true;
      },
    }),
    gb.date('procDate', 120, '처리일자', { editor: 'date' }),                    // L218 (UX-08)
    gb.text('procEmpName', 80, '처리자'),                                        // L219
    gb.textArea('procNote', 300, '처리상세', { editor: 'largeText' }),           // L220
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [stateCodes, user.userId, user.name]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L127) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={crud.loading}
          extra={
            <>
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="save" onClick={openLookupResult}>일괄저장</Button>
            </>
          }
        >
          <SearchBar.Field label="신청일자">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="신청서구분">
            <SystemCodeComboBox kindCd="IcamUserRegType" altCode={['%', '전체']} style={{ width: 170 }} value={regType} onChange={c => setRegType(c ?? '%')} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L118) → retrieve() */}
            <SearchBar.Input style={{ width: 300 }} placeholder="회사명/사용자/처리결과/처리상세" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={procResult} onChange={e => setProcResult(e.target.checked)}>미처리만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<IcamUserResult> crud={crud} columnDefs={columnDefs} getRowId={p => String(p.data.icamUserId)} />
        </div>
      </div>
      <Icam55_Lookup_UserApprResult ids={batchIds} onDone={() => void retrieve()} onClose={() => setBatchIds(null)} />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        statusCode={viewStatus}
        onClosed={() => void retrieve()}
        onClose={() => setViewApprId(null)}
      />
    </div>
  );
};
