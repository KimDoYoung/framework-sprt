/**
 * 전년도분 보수총액 신고 탭 (S26) — Pay31_Tab_InsureApply 셋째 탭
 * AS-IS: myApp/client/vi/pay/Pay31_TabPage_InsureApply3.java (415줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L83-113: 세로 — 위 50(기준년도 · 신고구분(InsureCode002, 기본 "건강보험") · 사원명 · [조회][생성][저장][삭제]) / 가운데 CellEditGrid(체크 다중) /
 *   아래 50(고용보험일 때 첫 행의 구간정보 글)
 * 그리드 열은 신고구분에 따라 바뀐다(retrieve L265-288): 고용보험이면 기준년도 보험료 납부총액·기준년도 보수총액·근무개월수를 숨기고 보수총액(구간1·2·3)을 보이며,
 *   그 밖이면 반대. 고용보험일 때만 구간정보 글을 보인다(AS-IS는 조회 직전의 첫 행 기준)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { PayInsureApply } from '@/types/pay';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';
import { PayInsureApplyTabHandle, PayInsurePersonField } from './payInsureApplyTab';
import { Pay31_Lookup_Insert3 } from './Pay31_Lookup_Insert3';

const gb = gbFor<PayInsureApply>();
const EMPLOYMENT = '고용보험';

export const Pay31_TabPage_InsureApply3 = forwardRef<PayInsureApplyTabHandle>((_props, ref) => {
  // settings() L115-: 기준년도 = 작년, 신고구분 = 건강보험
  const [yearText, setYearText] = useState(() => String(dayjs().year() - 1));
  const [insureCode, setInsureCode] = useState<string | undefined>('2');
  const [insureName, setInsureName] = useState('건강보험');
  const personIdRef = useRef<number | null>(null);
  const [insert3Year, setInsert3Year] = useState<string | null>(null);
  // retrieve() L265-288: 조회할 때 신고구분으로 정한다
  const [employment, setEmployment] = useState(false);
  const [termInfo, setTermInfo] = useState('');
  const latest = useRef({ yearText, insureCode, insureName });
  latest.current = { yearText, insureCode, insureName };

  const crud = useGridCrud<PayInsureApply>({
    idField: 'insureApplyId',
    // retrieve() L257-302: pay.Pay31_InsureApply.selectByCompanyId(startDate = 기준년도-01-01, closeDate = 기준년도-12-31, year = 기준년도+1, insureApplyGubun "4")
    search: useCallback(() => {
      const y = latest.current.yearText;
      return payApi.searchInsureApplies({
        gubun: '4', personId: personIdRef.current, insureCode: latest.current.insureCode ?? '%',
        year: String(Number(y) + 1), startDate: `${y}-01-01`, closeDate: `${y}-12-31`,
      });
    }, []),
    // update() L304-348: 바뀐 행을 pay.Pay31_InsureApply.updateList(year) → 끝나면 retrieve()
    save: useCallback(async (rows: PayInsureApply[]) => {
      await payApi.saveInsurePreYear(latest.current.yearText, rows);
      return rows;
    }, []),
    // deleteRow() L362-400: 확인 "삭제" → pay.Pay31_InsureApply.deleteList(year) → retrieve()
    remove: useCallback((ids: number[]) => payApi.deleteInsurePreYear(latest.current.yearText, ids), []),
    newRow: useCallback(() => ({}), []),
    reloadAfterSave: true,
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
  });
  const { retrieve: retrieveRows } = crud;

  const retrieve = useCallback(async () => {
    if (latest.current.yearText.trim() === '') {
      message.warning('기준년도를 입력해주세요');
      return;
    }
    const emp = latest.current.insureName === EMPLOYMENT;
    setEmployment(emp);
    setTermInfo(emp ? (crud.rows[0]?.termInfo ?? '') : '');
    await retrieveRows();
  }, [retrieveRows, crud.rows]);

  useImperativeHandle(ref, () => ({ retrieve: () => void retrieve() }), [retrieve]);
  // [E0] 화면 열림: 탭이 선택되면 retrieve(null) → retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L208-228 — CellEditGrid(Pay31_InsureApplyModel), 체크 다중. 같은 속성(preYearPay1)이 두 열에 쓰인다(보수총액 / 구간1)
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 80, '사번'),
    gb.textCenter('personName', 100, '성명'),
    gb.long('insureYearPay', 200, '기준년도 보험료 납부총액', { hide: employment }),
    gb.long('preYearPay1', 200, '기준년도 보수총액', { colId: 'preYearPay1', editor: 'number', hide: employment }),
    gb.long('preYearPay1', 200, '기준년도 보수총액<br>(구간1)', { colId: 'preYearPay1Term', editor: 'number', hide: !employment }),
    gb.long('preYearPay2', 200, '기준년도 보수총액<br>(구간2)', { editor: 'number', hide: !employment }),
    gb.long('preYearPay3', 200, '기준년도 보수총액<br>(구간3)', { editor: 'number', hide: !employment }),
    gb.long('preYearWorkMonthCnt', 150, '근무개월수', { editor: 'number', hide: employment }),
  ], [employment]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E5] retrieveButton[조회].Select (L187) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        loading={crud.loading}
        extra={<>
          {/* [E6] insertButton[생성].Select (L193) → insertRow(): Pay31_Lookup_Insert3.open(기준년도, callback = retrieve()) */}
          <Button type="generate" onClick={() => setInsert3Year(yearText)}>생성</Button>
          {/* [E7] updateButton[저장].Select (L199) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E8] deleteButton[삭제].Select (L205) → deleteRow() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </>}
      >
        <SearchBar.Field label="기준년도">
          {/* [E2] yearText.KeyPress [Enter] (L139) → retrieve() */}
          <Input style={{ width: 60 }} placeholder="YYYY" value={yearText}
            onChange={e => { latest.current.yearText = e.target.value; setYearText(e.target.value); }}
            onPressEnter={() => void retrieve()} />
        </SearchBar.Field>
        <SearchBar.Field label="신고구분">
          {/* [E1] insureComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L128) → retrieve() */}
          <SystemCodeComboBox kindGroupCd="InsureCode002" style={{ width: 120 }} value={insureCode}
            onLoad={codes => {
              const found = codes.find(c => c.name === '건강보험');
              if (found && latest.current.insureName === '건강보험') { latest.current.insureCode = found.code; setInsureCode(found.code); }
            }}
            onChange={(code, name) => {
              latest.current.insureCode = code; latest.current.insureName = name ?? '';
              setInsureCode(code); setInsureName(name ?? '');
              void retrieve();
            }} />
        </SearchBar.Field>
        <SearchBar.Field label="사원명">
          {/* [E3] personName.TriggerClick (L149) → openLookupPerson(null) · [E4] personName.ValueChange (L155) */}
          <PayInsurePersonField onChange={(id, doRetrieve) => { personIdRef.current = id; if (doRetrieve) void retrieve(); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayInsureApply> crud={crud} columnDefs={columnDefs} />
      </div>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>{termInfo}</div>
      {/* [E9] messageBox.DialogHide [YES] (L365) → deleteList 뒤 retrieve() */}
      <Pay31_Lookup_Insert3 year={insert3Year} onDone={() => void retrieve()} onClose={() => setInsert3Year(null)} />
    </div>
  );
});
Pay31_TabPage_InsureApply3.displayName = 'Pay31_TabPage_InsureApply3';
