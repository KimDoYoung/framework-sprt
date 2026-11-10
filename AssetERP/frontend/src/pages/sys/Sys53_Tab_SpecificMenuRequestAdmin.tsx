/**
 * [1410] 관리자 > 01. 고객관리 > 고객별 특정화면 관리 (A28)
 * AS-IS: myApp/client/vi/sys/Sys53_Tab_SpecificMenuRequestAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L56-75: 툴바(고객사·구분·특정업무구분 콤보·조회·저장) + 셀 편집 그리드(행번호, 체크박스 단일)
 * UX보강(10) 시범(B11): 툴바 = SearchBar(UX-01 조회 로딩·UX-02 초기화), 저장 = 저장(n)(UX-03)
 * 문서보기 아이콘 → 전자결재 문서 창 Apr01_Edit_ApprDoc (2026-11-10 연결, 전엔 안내만 — 13-누락대장). 로그인 회사 문서만 열린다
 * 스타일: CG (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { message } from 'antd';
import { sysApi } from '@/api/sys';
import { Code, SpecificMenuRequestAdmin } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { CompanyPopupField } from '@/components/lookup/CompanyPopupField';
import type { AxiosError } from 'axios';
import { errorMessage } from '@/api/client';
import { aprDetailApi } from '@/api/apr';
import { Apr01_Edit_ApprDoc } from '@/pages/apr/Apr01_Edit_ApprDoc';

type Row = SpecificMenuRequestAdmin;
const gb = gbFor<Row>();
const ALL = '%';  // companyName: "전체" 또는 "%"이면 모든 고객사

/** AS-IS buildGrid() L119-173 */
const buildGrid = (states: Code[], viewDocument: (r: Row) => void) => [
  gb.text('companyNm', 240, '회사명'),
  gb.date('regDate', 100, '신청일'),
  gb.text('personNm', 200, '신청자'),
  gb.text('specificWorkNm', 120, '특정업무'),
  iconCell<Row>('edit', 'actionCell', 80, '문서보기', viewDocument),  // L121-148 actionCell
  gb.textStatus('aprStatusNm', 100, '문서상태'),
  gb.text('confirmNm', 200, '처리자', { editor: 'text' }),
  gb.date('confirmDate', 100, '처리일', { editor: 'date' }),
  // [E5] stateComboBox[SpecificStateCode].Collapse (L153-160) → addChange(stateCode, getCode()) + addChange(stateName, getName())
  gb.textStatus('stateNm', 100, '처리상태', {
    editor: 'select',
    values: states.map(c => c.name),
    valueSetter: p => {
      p.data.stateNm = p.newValue;
      p.data.stateCd = states.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
];

export const Sys53_Tab_SpecificMenuRequestAdmin: React.FC = () => {
  const [states, setStates] = useState<Code[]>([]);
  // companyName 콤보, specificStateComboBoxField ("SpecificStateCode", 전체), specificWorkComboBoxField ("SpecificWorkCode", 전체)
  const sp = useSearchParams(() => ({ companyCd: ALL, stateCd: ALL, specificWorkCd: ALL }));
  const { companyCd, stateCd, specificWorkCd } = sp.values;

  const crud = useGridCrud<Row>({
    idField: 'specificMenuRequestId',
    // retrieve() L175-196: companyId, stateCode, specificWorkCode → sys.Sys53_SpecificMenuRequest.selectByTextAdmin
    search: useCallback(() => sysApi.searchSpecificMenuRequestsAdmin(companyCd, stateCd, specificWorkCd), [companyCd, stateCd, specificWorkCd]),
    // update() L198-201: GridUpdate → sys.Sys53_SpecificMenuRequest.update
    save: sysApi.updateSpecificMenuRequestsAdmin,
    remove: async () => 0,   // 원본에 삭제·등록 단추가 없다
    newRow: () => ({}),
  });
  // 오래 사는 콜백이 최신 crud 를 부르게 한다 (crud 는 rows 가 바뀔 때마다 새 객체)
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // 문서보기 아이콘 (buildGrid L121-148): apr.Apr01_Appr.selectById(apprId) → 없으면 '연관문서가 존재하지않습니다',
  // 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false) (2026-11-10 연결, 전엔 안내만).
  // AS-IS와 다른 점: 문서 상세 API(selectById)는 로그인 회사의 문서만 읽는다(원본은 회사 조건 없음) — 다른 회사 문서는 "연관문서가 존재하지않습니다"
  // [E4] actionCell (ImageCell).callbackOnCreate (L140) → 인라인 L140-145: 문서 창을 닫으면 grid.unmask() — TOBE는 마스크가 없어 창 닫기만
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const viewDocument = useCallback(async (r: Row) => {
    if (r.apprId == null) {
      message.warning('연관문서가 존재하지않습니다');
      return;
    }
    try {
      await aprDetailApi.getDetail(r.apprId);
      setViewApprId(r.apprId);
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 404) message.warning('연관문서가 존재하지않습니다');
      else message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  const columnDefs = useMemo(() => buildGrid(states, viewDocument), [states, viewDocument]);

  // [E0] 화면 열림 (생성자 L56-75) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCodes('SpecificStateCode').then(setStates).catch(() => setStates([]));
    void crudRef.current.retrieve();
  }, []);

  // [E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L99) → retrieve()
  // 콤보를 바꾸면 바뀐 값으로 조회해야 하므로 값이 바뀐 다음 조회한다
  const [pending, setPending] = useState(false);
  useEffect(() => { if (pending) { setPending(false); void crudRef.current.retrieve(); } }, [pending]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box' }}>
      {/* [E2] retrieveButton[조회].Select (L105) → retrieve(). 초기화는 UX-02(원본 없음, 자동 조회 안 함) */}
      <SearchBar onSearch={crud.retrieve} onReset={sp.reset} loading={crud.loading}
        // [E3] updateButton[저장].Select (L111) → update(). 저장(n)은 UX-03
        extra={<Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>}>
        <SearchBar.Field label="고객사">
          <CompanyPopupField value={companyCd} onChange={v => { sp.set('companyCd', v); setPending(true); }} />
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          <SystemCodeComboBox kindCd="SpecificStateCode" altCode={[ALL, '전체']} style={{ width: 100 }} value={stateCd}
            onChange={v => sp.set('stateCd', v ?? ALL)} />
        </SearchBar.Field>
        <SearchBar.Field label="특정업무구분">
          <SystemCodeComboBox kindCd="SpecificWorkCode" altCode={[ALL, '전체']} style={{ width: 120 }} value={specificWorkCd}
            onChange={v => sp.set('specificWorkCd', v ?? ALL)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* setChecked(SINGLE) = 체크박스 단일 선택 */}
        <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
      </div>
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </div>
  );
};
