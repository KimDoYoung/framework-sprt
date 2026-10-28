/**
 * 포상휴가관리 (S10) — 경영관리 > 02. 휴가/출장 관리 > 포상휴가관리 #1234
 * AS-IS: myApp/client/vi/emp/Emp22_Tab_EtcLeave.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L76-117, SGP 옆 페이지): 가운데 테두리 박스(툴바: 조회기간 · 검색 250 · [조회][등록][삭제][저장][문서분류지정] + 체크 다중 셀 편집 그리드)
 *   + 오른쪽 400(드래그로 조절, 최대 1000) 대상 직원 페이지(Emp23_Page_EtcLeavePerson). 그리드에서 행을 고르면 대상 직원을 읽는다.
 * 1단계(사용자 묶음 요청 2026-10-28): [결재요청] 아이콘의 결재문서 생성(Apr01_Edit_ApprDoc.insertLinkApproval → updateApprId)·결재문서 보기(retrieveApproval)는
 *   다음 단계 — 원본의 문서분류·상태·저장 여부 검사까지만 한다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, Splitter, message } from 'antd';
import dayjs from 'dayjs';
import { empEtcLeaveApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { EtcLeaveManage } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { useGridCrud, editableCol } from '@/hooks/useGridCrud';
import { Emp23_Page_EtcLeavePerson } from './Emp23_Page_EtcLeavePerson';

const gb = gbFor<EtcLeaveManage>();

/** preUpdate() L393-441: 고친 행 검사 — 결재 완료(30)·진행(10·20)은 막고, 사용시작일·사용만료일·사유·포상일수 필수 */
const validateRows = (changed: EtcLeaveManage[]): string | undefined => {
  for (const r of changed) {
    if (r.apprId != null) {
      if (r.apprStatusCode === '30') return '결재완료된 문서가 존재합니다';
      if (r.apprStatusCode === '10' || r.apprStatusCode === '20') return '결재진행 중인 문서가 존재합니다';
    }
    if (r.startDate == null || r.startDate === '') return '사용시작일은 필수선택 항목입니다.';
    if (r.closeDate == null || r.closeDate === '') return '사용만료일은 필수선택 항목입니다.';
    if (r.reason == null || r.reason === '') return '사유는 필수입력 항목입니다.';
    // 원본 문구 그대로(포상일수가 비었을 때도 "사유는…")
    if (r.days == null) return '사유는 필수입력 항목입니다.';
  }
  return undefined;
};

export const Emp22_Tab_EtcLeave: React.FC = () => {
  // [E0] 화면 열림 (생성자 L76-117 → settings() L119-178, retrieve()): 조회기간 = 올해 1월 1일 ~ 오늘
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState(dayjs());
  const [searchText, setSearchText] = useState('');
  const cur = useRef({ startDate, closeDate, searchText });
  cur.current = { startDate, closeDate, searchText };
  const [linkOpen, setLinkOpen] = useState(false);
  // retrieveDoc() L303-321: Link 코드 A25에 지정된 문서분류가 정확히 1건이면 쓰고, 아니면 null
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  // 고른 포상휴가 (대상 직원 페이지의 부모)
  const [etcLeaveId, setEtcLeaveId] = useState<number | null>(null);
  const selectFirst = useRef(false);

  // retrieve() L285-301: 서비스 emp.Emp22_EtcLeave.selectByDate(companyId, startDate, closeDate, "%검색어%") → retrieveDoc(), 첫 행 선택
  const crud = useGridCrud<EtcLeaveManage>({
    idField: 'etcLeaveId',
    search: useCallback(() => empEtcLeaveApi.search(
      cur.current.startDate.format('YYYY-MM-DD'), cur.current.closeDate.format('YYYY-MM-DD'), cur.current.searchText), []),
    // [E10] msgBox.DialogHide [YES] (L435) / preUpdate() 끝 → update() L455-467: GridUpdate → emp.Emp22_EtcLeave.update
    save: useCallback((rows: EtcLeaveManage[]) => empEtcLeaveApi.save(rows), []),
    // [E9] msgBox.DialogHide [YES] (L345) → delete() L362-382: emp.Emp22_EtcLeave.deleteApprId → delete(체크된 행)
    remove: useCallback((ids: number[]) => empEtcLeaveApi.remove(ids), []),
    deleteConfirm: false,
    // insertRow() L384-391: 회사 ID 채움, 휴가코드 "05"는 서버가 넣는다
    newRow: useCallback(() => ({ leaveCode: '05' }), []),
    validate: useCallback((changed: EtcLeaveManage[]) => validateRows(changed), []),
  });

  // retrieveDoc() L303-321
  const retrieveDoc = useCallback(async () => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode('A25');
      setClassTreeId(list.length === 1 ? list[0].classTreeId : null);
    } catch { setClassTreeId(null); }
  }, []);

  useEffect(() => { void retrieve(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // [E1] searchText.KeyPress [Enter] (L127) / [E2] retrieveButton[조회].Select (L136) → retrieve()
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
    void retrieveDoc();
  };

  // 조회 뒤 첫 행 선택(grid.getSelectionModel().select(0, false))
  const onRowDataUpdated = () => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true);
  };
  // [E7] grid.SelectionChanged (L172) → retrieveEtcPerson() L277-283: 고른 행이 있으면 대상 직원 조회 (선택이 모두 풀리면 아무 일도 하지 않는다)
  const onRowSelected = (e: { node: { isSelected: () => boolean | undefined; data?: EtcLeaveManage } }) => {
    if (e.node.isSelected() && e.node.data) setEtcLeaveId(e.node.data.etcLeaveId);
  };

  // [E3] insertButton[등록].Select (L142) → insertRow() L384-391: GridInsertRow(맨 아래 — 03 원칙 17)
  const insertRow = () => crud.addRow();

  // [E4] deleteButton[삭제].Select (L148) → deleteCheck() L323-360: 결재완료(30)·진행(10·20)이 있으면 안내, 아니면 확인창("n건의 정보를 삭제하시겠습니까?", 300폭)
  const deleteCheck = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    for (const r of selected) {
      if (r.apprStatusCode === '30') { message.warning('결재완료된 문서가 존재합니다'); return; }
      if (r.apprStatusCode === '10' || r.apprStatusCode === '20') { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    }
    Modal.confirm({
      title: '확인',
      content: `${selected.length}건의 정보를 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: () => crud.deleteChecked(), // → [E9] YES
    });
  };

  // [E6] updateButton[저장].Select (L166) → preUpdate() L393-453: 검사 뒤 임시저장(99) 결재문서가 걸린 행이 있으면 확인창("저장시 임시저장 문서는 삭제됩니다…", 300폭) → [E10] YES → update()
  const preUpdate = () => {
    const changed = crud.getChanged();
    const msg = validateRows(changed);
    if (msg) { message.warning(msg); return; }
    const tempCount = changed.filter(r => r.apprId != null && r.apprStatusCode === '99').length;
    if (tempCount > 0) {
      Modal.confirm({
        title: '확인',
        content: '저장시 임시저장 문서는 삭제됩니다. 저장하시겠습니까?',
        width: 300,
        okText: '예',
        cancelText: '아니오',
        onOk: () => crud.saveRows(),
      });
      return;
    }
    return crud.saveRows();
  };

  // [E5] dcrLinkButton[문서분류지정].Select (L154) → Dcr30_Lookup_Link.open("A25", callback → retrieveDoc())
  const openLink = () => setLinkOpen(true);

  // [E8] actionCell (ImageCell).callbackOnCreate (L212) → 서비스 apr.Apr01_Appr.selectById(apprId):
  //   상신 문서가 있으면 Apr01_Edit_ApprDoc.retrieveApproval(편집창은 다음 단계),
  //   없으면 저장된 행인지 확인("저장 후 결재요청이 가능합니다") → insertLinkApproval() L238-261(문서분류·상태 검사 뒤 Apr01_Edit_ApprDoc.insertLinkApproval — 다음 단계)
  const requestAppr = (row: EtcLeaveManage) => {
    if (row.apprId != null) { message.info('전자결재 문서 보기는 아직 변환 전입니다(다음 단계).'); return; }
    if (row.etcLeaveId <= 0) { message.warning('저장 후 결재요청이 가능합니다'); return; }
    if (classTreeId == null) { message.warning('[문서분류지정]에서 먼저 문서분류를 선택해주세요'); return; }
    if (row.apprStatusCode === '10' || row.apprStatusCode === '20' || row.apprStatusCode === '30') {
      message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다');
      return;
    }
    message.info('결재문서 작성(전자결재 편집창)은 아직 변환 전입니다(다음 단계).');
  };

  // AS-IS buildGrid() L180-236 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    editableCol(gb.text('reason', 400, '사유', { editor: 'text' })),
    editableCol(gb.long('days', 100, '포상일수', { editor: 'number' })),
    editableCol(gb.date('startDate', 100, '사용시작일', { editor: 'date' })),
    editableCol(gb.date('closeDate', 100, '사용만료일', { editor: 'date' })),
    gb.textCenter('apprStatusName', 100, '결재상태'),
    iconCell<EtcLeaveManage>('edit', 'actionCell', 80, '결재요청', row => requestAppr(row)),
    editableCol(gb.text('note', 400, '비고', { editor: 'text' })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [classTreeId]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={400}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SearchBar
              onSearch={() => void retrieve()}
              extra={(
                <>
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="delete" onClick={deleteCheck}>삭제</Button>
                  <Button type="save" count={crud.changes} onClick={preUpdate}>저장</Button>
                  <Button type="select" onClick={openLink}>문서분류지정</Button>
                </>
              )}
            >
              <SearchBar.Field label="조회기간">
                <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
                <span>~</span>
                <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
              </SearchBar.Field>
              <SearchBar.Field label="검색">
                <SearchBar.Input style={{ width: 250 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<EtcLeaveManage>
                crud={crud}
                columnDefs={columnDefs}
                onRowDataUpdated={onRowDataUpdated}
                onRowSelected={onRowSelected}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={400} max={1000}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', marginLeft: 2 }}>
            <Emp23_Page_EtcLeavePerson etcLeaveId={etcLeaveId} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="A25" onClose={() => { setLinkOpen(false); void retrieveDoc(); }} />
    </div>
  );
};
