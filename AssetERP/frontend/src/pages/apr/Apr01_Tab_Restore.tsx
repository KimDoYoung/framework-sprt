/**
 * [1098] 관리자 > 03. 문서관리 > 폐기문서 복구 (EE01, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_Restore.java (291줄) + Apr01_Edit_ApprDoc(연결, getApprDelModel) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L58-93: center = vlc(테두리) — 툴바 50(조회기간 시작 ~ 끝 · 담당부서 150 · 담당자 100 · 상신제목 250 · [조회][복구]) / 폐기문서 그리드(행번호, 체크박스 단일)
 * 스타일: SG (견본 — docs/page-style.md). 편집 팝업은 없고 [상세보기] 아이콘이 문서 보기 창(읽기 전용)을 연다 — yunhee가 AS-IS를 SGP로 보는 것은 연결 클래스 Apr01_Edit_ApprDoc 때문
 * [상세보기] → 열람권한(permissionsCheckWithDel) → Apr01_Edit_ApprDoc deleted 모드(getApprDelModel, apr99에서 읽기 전용) — 2026-11-10 연결, 전엔 안내만
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 5개이나 한 줄에 공간이 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprDel } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { comRelateApprApi } from '@/api/com';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';

const gb = gbFor<AprApprDel>();
const DATE_FORMAT = 'YYYY-MM-DD';

export const Apr01_Tab_Restore: React.FC = () => {
  const gridRef = useRef<AgGridReact<AprApprDel>>(null);
  // setInitData() L194-204: 시작일 = 이번 달 1일, 종료일 = 이번 달 말일 (LoginUser.getToday() 기준)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [orgName, setOrgName] = useState('');
  const [personName, setPersonName] = useState('');
  const [aprName, setAprName] = useState('');
  const [rows, setRows] = useState<AprApprDel[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // [E1] searchButton[조회].Select (L102), [E3] orgName·[E4] personName·[E5] aprName.KeyPress [Enter] (L114·L122·L130) → retrieve() L206-244
  //   서비스 apr.Apr99_ApprDel.selectByCompanyId (companyId는 서버가 세션에서, 입력이 없으면 '%' / 있으면 '%값%'도 서버가 만든다)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchApprDels({
        startDate: startDate.format(DATE_FORMAT),
        closeDate: closeDate.format(DATE_FORMAT),
        orgName, personName, aprName,
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L58-93) → buttonSetting(), setInitData(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E2] restoreButton[복구].Select (L108) → restoreChk() L246-264: "선택한 문서를 복구하시겠습니까?"(제목 "복구", 폭 300)
  //   → [E7] msgBox.DialogHide [YES] (L249) → restore() L266-286: apr.Apr99_ApprDel.restore → "문서복구가 완료되었습니다" / 실패 "폐기문서 복구 중 문제가 발생했습니다. 관리자에게 문의하세요" → retrieve()
  const restoreChk = () => {
    const selected = gridRef.current?.api?.getSelectedRows()[0];
    // 05 §8: 선택 없이 복구는 확인창 없이 경고 (원본은 선택 행이 null이라 클라이언트 오류)
    if (!selected) { message.warning('복구할 문서를 선택하세요.'); return; }
    Modal.confirm({
      title: '복구',
      content: '선택한 문서를 복구하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await aprApi.restoreApprDel(selected.apprId);
          message.success('문서복구가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '폐기문서 복구 중 문제가 발생했습니다. 관리자에게 문의하세요'));
        }
        await retrieve();  // 재조회한다.
      },
    });
  };

  /** 폐기문서 보기 창 (Apr01_Edit_ApprDoc.getApprDelModel) */
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  // [E6] L144-178: ApprCallbackResult(apprId, 로그인 사용자) = apr.Apr01_Appr.permissionsCheckWithDel → 없으면 "해당문서의 열람권한이 없습니다"
  const openDeleted = async (apprId: number) => {
    try {
      if (await comRelateApprApi.permissionWithDel(apprId)) setViewApprId(apprId);
      else message.info('해당문서의 열람권한이 없습니다');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L140-192 — 체크박스 단일(setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L180
    gb.date('effectDate', 100, '시행일'),  // L181
    gb.text('classTreeNameAllPath', 400, '문서분류'),  // L182
    gb.text('title', 400, '상신제목'),  // L183
    // [E6] actionCell (ImageCell "View").callbackOnCreate (L156) L144-178: ApprCallbackResult(apprId, 로그인 사용자) → 열람권한 없으면 "해당문서의 열람권한이 없습니다",
    //   있으면 Apr01_Edit_ApprDoc.getApprDelModel(model, false, callback → retrieve())
    iconCell<AprApprDel>('view', 'actionCell', 50, '상세보기', row => { void openDeleted(row.apprId); }),
    gb.text('aprOrgName', 150, '담당부서'),  // L185
    gb.textCenter('aprPersonName', 100, '담당자'),  // L186
    gb.date('delDate', 100, '폐기일'),  // L187
    gb.textCenter('delEmpName', 100, '폐기진행'),  // L188
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <SearchBar
        onSearch={() => void retrieve()}
        searchText="조회"
        loading={loading}
        extra={<Button type="reset" onClick={restoreChk}>복구</Button>}
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="담당부서">
          <SearchBar.Input style={{ width: 150 }} value={orgName} onChange={e => setOrgName(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="담당자">
          <SearchBar.Input style={{ width: 100 }} value={personName} onChange={e => setPersonName(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="상신제목">
          <SearchBar.Input style={{ width: 250 }} value={aprName} onChange={e => setAprName(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprApprDel>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.apprId)}
          loading={loading}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      {/* getApprDelModel 콜백(L157-160): 창을 닫으면 retrieve() */}
      <Apr01_Edit_ApprDoc apprId={viewApprId} deleted onClosed={() => void retrieve()} onClose={() => setViewApprId(null)} />
    </div>
  );
};
