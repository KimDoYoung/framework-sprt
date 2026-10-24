/**
 * [1480] 책무 > 02. 책무구조도 > 책무구조도 제출 (N14)
 * AS-IS: myApp/client/vi/tdm/Tdm36_Tab_RoleReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-98: center(0.4) = 툴바(조회기간 [시작 100 ~ 종료 100] + 전체보기 · 미처리건만 조회 · [조회][등록][저장][삭제]) + 이사회 개최 CellEditGrid(체크박스 없음, 단일 선택)
 *               south(0.6) = Tdm36_TabPage_RoleReport (첨부 목록)
 * 다음 단계: 첨부 목록의 보기(RD 뷰어·FINES 다운로드)와 문서(전자결재 문서 보기) — Tdm36_TabPage_RoleReport 머리 참고
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08), 등록은 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { tdmApi } from '@/api/tdm';
import { TdmRoleReport } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Tdm36_TabPage_RoleReport } from './Tdm36_TabPage_RoleReport';

const gb = gbFor<TdmRoleReport>();
const FORMAT = 'YYYY-MM-DD';
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;   // setChecked 없음

export const Tdm36_Tab_RoleReport: React.FC = () => {
  // [E0] 화면 열림 (생성자 L61-98) → settings() L100-161: 기간 올해 1/1~오늘(전체보기라 비활성), 전체보기 켬·미처리건만 조회 끔 → retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // yyyy-01-01
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());                   // LoginUser.getToday()
  const [checkYn01, setCheckYn01] = useState(true);                              // checkYn01 "전체보기" = true → 기간 칸 비활성
  const [checkYn02, setCheckYn02] = useState(false);                             // checkYn02 "미처리건만 조회" = false
  const [selected, setSelected] = useState<TdmRoleReport | null>(null);          // tabPage.retrieve(고른 행)
  const [nonce, setNonce] = useState(0);                                         // 같은 행을 다시 눌러도 첨부 목록을 다시 읽게

  // retrieve() L185-207: tabPage.gridClear() → tdm.Tdm36_RoleReport.selectByDate(companyId, startDate, closeDate, checkYn01, checkYn02)
  //                      → 끝나면 첫 행을 고르고 tabPage.retrieve(첫 행)
  const latest = useRef({ startDate, closeDate, checkYn01, checkYn02 });
  latest.current = { startDate, closeDate, checkYn01, checkYn02 };
  const override = useRef<{ checkYn01?: boolean; checkYn02?: boolean }>({});   // 체크박스를 바꾼 직후 상태가 반영되기 전 값
  const selectFirst = useRef(false);                                            // 조회 끝에 첫 행을 고른다 (저장 뒤 다시 읽을 때는 고르지 않는다)
  const search = useCallback(async () => {
    const q = { ...latest.current, ...override.current };
    override.current = {};
    return tdmApi.searchRoleReports({
      startDate: q.startDate.format(FORMAT),
      closeDate: q.closeDate.format(FORMAT),
      notPeriodYn: q.checkYn01,
      notEndYn: q.checkYn02,
    });
  }, []);

  // insertRow() L215-221: 회사만 채운 빈 행 (서버가 로그인 회사로 채운다)
  const initRow = useCallback((): Partial<TdmRoleReport> => ({ companyId: null }), []);

  const crud = useGridCrud<TdmRoleReport>({
    idField: 'roleReportId',
    search,
    // update() L209-213: GridUpdate(updName) → tdm.Tdm36_RoleReport.update
    save: useCallback(async (changed: TdmRoleReport[]) => { await tdmApi.saveRoleReports(changed); return changed; }, []),
    // deleteRow() L243-248: GridDeleteData(userName) → tdm.Tdm36_RoleReport.delete
    remove: tdmApi.deleteRoleReports,
    newRow: initRow,
    firstEditField: 'boardOpenDate',
    deleteConfirm: false,
    reloadAfterSave: true,
  });

  const retrieve = (over: { checkYn01?: boolean; checkYn02?: boolean } = {}) => {
    override.current = over;
    selectFirst.current = true;
    setSelected(null);   // tabPage.gridClear()
    return crud.retrieve();
  };
  // [E0] 생성자 끝의 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // 조회가 끝나 행이 들어오면 첫 행을 고르고 첨부 목록을 읽는다 (grid.getSelectionModel().select(0), tabPage.retrieve(첫 행))
  const onRowDataUpdated = () => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    const first = crud.gridRef.current?.api?.getDisplayedRowAtIndex(0);
    if (!first) return;
    first.setSelected(true);
    setSelected(first.data ?? null);
    setNonce(n => n + 1);
  };

  // [E7] grid.RowClick (L155) → retrieveEditPage() L163-166: tabPage.retrieve(고른 행)
  const retrieveEditPage = (row: TdmRoleReport | undefined) => {
    setSelected(row ?? null);
    setNonce(n => n + 1);
  };

  // [E6] deleteButton[삭제].Select (L149) → deleteChk() L223-241: "해당 이사회 개최정보를 삭제하시겠습니까?"(300) → [YES] [E8] deleteRow()
  const deleteChk = () => {
    Modal.confirm({
      title: '삭제',
      content: '해당 이사회 개최정보를 삭제하시겠습니까?',
      width: 300,
      onOk: () => crud.deleteChecked(),
    });
  };

  // buildGrid() — 이사회 개최 정보
  const columnDefs = useMemo(() => [
    gb.date('boardOpenDate', 120, '이사회<br>개최일', { editor: 'date' }),
    gb.date('allcStdDate', 120, '책무배분<br>기준일', { editor: 'date' }),
    gb.date('reportDate', 120, '보고서<br>제출일', { editor: 'date' }),
    gb.text('boardOpenLoc', 200, '이사회<br>장소', { editor: 'text' }),
    gb.long('membTotCnt', 100, '이사회<br>이사 수', { editor: 'number' }),
    gb.long('membAttendCnt', 100, '출석이사 수', { editor: 'number' }),
    gb.text('boardOpenAgenda', 400, '안건', { editor: 'text' }),
    gb.text('membYesName', 400, '찬성이사', { editor: 'text' }),
    gb.textCenter('updName', 100, '등록자'),
    gb.textCenter('updDateStr', 150, '등록일'),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="40%" min={200}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
            {/* [E3] retrieveButton[조회].Select (L131) → retrieve() */}
            <SearchBar
              onSearch={() => retrieve()}
              extra={
                <>
                  {/* [E4] insertButton[등록].Select (L137) → insertRow() */}
                  <Button type="register" onClick={() => crud.addRows([initRow()], false)}>등록</Button>
                  {/* [E5] updateButton[저장].Select (L143) → update() */}
                  <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                  <Button type="delete" onClick={deleteChk}>삭제</Button>
                </>
              }
            >
              <SearchBar.Field label="조회기간">
                <DatePicker style={{ width: 140 }} allowClear={false} disabled={checkYn01} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                ~
                <DatePicker style={{ width: 140 }} allowClear={false} disabled={checkYn01} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                {/* [E1] checkYn01[전체보기].ValueChange (L110) → 기간 칸 사용 여부 + retrieve() */}
                <Checkbox checked={checkYn01} onChange={e => { setCheckYn01(e.target.checked); void retrieve({ checkYn01: e.target.checked }); }}>전체보기</Checkbox>
                {/* [E2] checkYn02[미처리건만 조회].ValueChange (L125) → retrieve() */}
                <Checkbox checked={checkYn02} onChange={e => { setCheckYn02(e.target.checked); void retrieve({ checkYn02: e.target.checked }); }}>미처리건만 조회</Checkbox>
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<TdmRoleReport>
                crud={crud}
                columnDefs={columnDefs}
                rowSelection={SINGLE_SELECTION}
                onRowDataUpdated={onRowDataUpdated}
                onRowClicked={e => retrieveEditPage(e.data)}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', paddingTop: 8, boxSizing: 'border-box' }}>
            <Tdm36_TabPage_RoleReport roleReport={selected} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
