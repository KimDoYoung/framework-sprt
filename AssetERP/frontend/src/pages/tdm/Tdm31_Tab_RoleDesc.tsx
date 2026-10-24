/**
 * [1418] 책무 > 02. 책무구조도 > 임원별 책무기술서 (N12)
 * AS-IS: myApp/client/vi/tdm/Tdm31_Tab_RoleDesc.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L101-138: 가운데 = 툴바(조회기간 [시작 100 ~ 종료 100] + 전체보기 · 검색 250 "직책/담당임원" + 미처리건만 조회 · [조회][등록][저장][삭제]) + 책무기술서 CellEditGrid(체크박스 다중)
 * 1단계: 결재요청(createRd·dcrChk·insertLinkApproval·updateApprId)과 문서보기(ApprCallbackResult·Apr01_Edit_ApprDoc)는 전자결재라 다음 단계 — 사전 검사까지만 하고 안내한다.
 *        책무기술서 RD 뷰어(viewRd)는 RD 연동이 없어 안내한다(E11 `Tdm31_Tab_RoleDescAdmin`·N11 `Tdm34_TabPage_RoleAllcDetail`과 같다).
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08), 등록은 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { sysApi } from '@/api/sys';
import { tdmApi } from '@/api/tdm';
import { Code, FileInfo } from '@/types/sys';
import { TdmRoleDescCompany } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { RoleDescPick, Tdm30_Lookup_SelectMulti } from './Tdm30_Lookup_SelectMulti';
import { dynamicIconCell } from './tdmGridCells';

const gb = gbFor<TdmRoleDescCompany>();
const FORMAT = 'YYYY-MM-DD';
const APPR_SENT = ['10', '20', '30'];   // 상신 진행·완료

export const Tdm31_Tab_RoleDesc: React.FC = () => {
  // [E0] 화면 열림 (생성자 L101-138) → settings() L140-220: 기간 올해 1/1~오늘(전체보기라 비활성), 전체보기 켬·미처리건만 조회 끔 → retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // yyyy-01-01
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());                   // LoginUser.getToday()
  const [notPeriodYn, setNotPeriodYn] = useState(true);                          // notPeriodYn "전체보기" = true → 기간 칸 비활성
  const [searchText, setSearchText] = useState('');
  const [notEndYn, setNotEndYn] = useState(false);                               // notEndYn "미처리건만 조회" = false
  const [reasonCodes, setReasonCodes] = useState<Code[]>([]);                    // reasonComboBox[TdmDescRegReason]
  const [lookupOpen, setLookupOpen] = useState(false);                           // Tdm30_Lookup_SelectMulti
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);               // 책무기술서 첨부 보기

  useEffect(() => {
    sysApi.searchCodes('TdmDescRegReason').then(setReasonCodes).catch(() => {});
  }, []);

  // retrieve() L361-377: tdm.Tdm31_RoleDesc.selectByRegDate(companyId, startDate, closeDate, "%검색어%", notEndYn, notPeriodYn)
  const latest = useRef({ startDate, closeDate, searchText, notEndYn, notPeriodYn });
  latest.current = { startDate, closeDate, searchText, notEndYn, notPeriodYn };
  const override = useRef<{ notEndYn?: boolean; notPeriodYn?: boolean }>({});   // 체크박스를 바꾼 직후 상태가 반영되기 전 값
  const search = useCallback(async () => {
    const q = { ...latest.current, ...override.current };
    override.current = {};
    return tdmApi.searchRoleDescsCompany({
      startDate: q.startDate.format(FORMAT),
      closeDate: q.closeDate.format(FORMAT),
      searchText: q.searchText,
      notEndYn: q.notEndYn,
      notPeriodYn: q.notPeriodYn,
    });
  }, []);

  // updateChk() L426-461: 바뀐 행마다 상신 중·완료면 "수정할 수 없습니다", 생성사유가 없으면 "필수선택항목입니다" (첫 번째에서 멈춘다)
  const validate = useCallback((changed: TdmRoleDescCompany[]) => {
    for (const r of changed) {
      if (r.apprStatusCode && APPR_SENT.includes(r.apprStatusCode)) return '이미 상신중이거나 완료된 문서는 수정할 수 없습니다';
      if (!r.reasonCode) return '생성사유는 필수선택항목입니다';
    }
    return undefined;
  }, []);

  const crud = useGridCrud<TdmRoleDescCompany>({
    idField: 'roleDescId',
    search,
    // update() L463-466: GridUpdate → tdm.Tdm31_RoleDesc.update
    save: useCallback(async (changed: TdmRoleDescCompany[]) => { await tdmApi.saveRoleDescs(changed); return changed; }, []),
    // deleteRow() L501-515: GridDeleteData → tdm.Tdm31_RoleDesc.delete
    remove: tdmApi.deleteRoleDescs,
    // insertRow() L379-424는 임원선택 조회창이 행을 채워 addRows로 넣는다 — 빈 행 등록은 없다
    newRow: useCallback(() => ({}), []),
    validate,
    deleteConfirm: false,
    reloadAfterSave: true,
  });
  const api = () => crud.gridRef.current?.api;

  // [E1] notPeriodYn[전체보기].ValueChange (L150) → 기간 칸 사용 여부 + retrieve(), [E2] notEndYn[미처리건만 조회].Change (L166) → retrieve()
  const retrieveWith = (over: { notEndYn?: boolean; notPeriodYn?: boolean }) => {
    override.current = over;
    return crud.retrieve();
  };
  // [E0] 생성자 끝의 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  // [E5] insertButton[등록].Select (L190) → insertRow() L379-424: 임원선택 조회창에서 고른 임원마다 행을 만든다(생성일 오늘, 생성사유는 일괄 적용값 또는 "(선택하세요)")
  const insertRow = ({ rows, reasonCode, reasonName }: RoleDescPick) => {
    crud.addRows(rows.map(p => ({
      companyId: null,
      regDate: dayjs().format(FORMAT),
      allcStdDate: p.allcStdDate,
      personName: p.personName,
      personId: p.personId,
      roleAllcId: p.roleAllcId,
      roleName: p.roleName,
      addTitle: p.addTitle,
      reasonCode: reasonCode ?? null,
      reasonName: reasonCode ? reasonName : '(선택하세요)',
      apprId: null,
      apprStatusCode: null,
      apprStatusName: null,
    })), true);
  };

  // [E7] deleteButton[삭제].Select (L202) → deleteChk() L468-499: 상신 중·완료가 하나라도 있으면 안내, 없으면 "n건을 삭제하시겠습니까?" → [YES] [E10] deleteRow()
  const deleteChk = () => {
    const checked = (api()?.getSelectedRows() ?? []) as TdmRoleDescCompany[];
    for (const r of checked) {
      if (r.apprStatusCode && APPR_SENT.includes(r.apprStatusCode)) { message.warning('이미 상신중이거나 완료된 문서는 삭제할 수 없습니다'); return; }
    }
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건을 삭제하시겠습니까?`,
      width: 280,
      onOk: () => crud.deleteChecked(),
    });
  };

  // viewRd() L670-711: Sys99_Print.CreateTdmRoleDesc → RD 뷰어(Tdm31_Rd_DescRpt) — RD 연동이 없어 열 수 없다 (E11과 같다)
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무기술서를 열 수 없습니다.');
  };

  // viewFile() L763-783: sys.Sys10_File.selectByParentId(roleDescId) → 있으면 Sys10_Lookup_FileViewer, 없으면 "파일생성실패로인한 RD뷰어호출" 후 viewRd()
  const viewAttached = async (row: TdmRoleDescCompany) => {
    try {
      const files = await fileApi.searchByParentId(row.roleDescId);
      if (files.length > 0) {
        setViewFile(files[0]);
      } else {
        message.info('파일생성실패로인한 RD뷰어호출');
        viewRd();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 책무기술서 (actionCell01 L249-260): 결재상태 10·20·30이면 viewFile(), 아니면 viewRd()
  const onView = (row: TdmRoleDescCompany) => {
    if (row.roleDescId <= 0) { message.warning('저장 후 진행가능합니다'); return; }
    if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) void viewAttached(row);
    else viewRd();
  };

  // 결재요청 (actionCell02 L262-300): 저장하지 않은 변경이 있으면 안내, 1분 안에 파일을 만들고 있으면 "현재 작업중인 기술서입니다."
  // 그다음 작업일시 표시·fileCheck·createRd·dcrChk(Dcr01_Lookup_Class)·Apr01_Edit_ApprDoc·updateApprId는 전자결재/RD라 다음 단계
  const apprRequest = async (row: TdmRoleDescCompany) => {
    if (crud.hasChanges()) { message.warning('작업중인 내용을 저장 후 이용해주세요'); return; }
    try {
      if (await tdmApi.isRoleDescWorking(row.roleDescId)) { message.info('현재 작업중인 기술서입니다.'); return; }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    // [E생략] updateWorkDate(99) → fileCheck → createRd(Sys99_Print.CreateTdmRoleDesc·RDUtil) → Dcr01_Lookup_Class·Dcr30_Link.selectByLinkCode → Apr01_Edit_ApprDoc → updateApprId: 전자결재·RD는 다음 단계
    message.info('전자결재 상신(Apr01_Edit_ApprDoc)은 아직 변환 전입니다');
  };

  // 문서보기 (actionCell03 L302-340): 결재상태가 없으면 "문서가 존재하지않습니다". ApprCallbackResult·Apr01_Edit_ApprDoc.retrieveApproval은 다음 단계
  const viewAppr = (row: TdmRoleDescCompany) => {
    if (!row.apprStatusCode) { message.warning('문서가 존재하지않습니다'); return; }
    // [E생략] ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval: 전자결재는 다른 도메인 — 다음 단계
    message.info('전자결재 문서 보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다');
  };

  // buildGrid() L222-359
  const columnDefs = useMemo(() => [
    gb.date('regDate', 120, '생성일', { editor: 'date' }),  // L343
    gb.text('reasonName', 180, '생성사유', {  // L344 reasonComboBox — [E9] reasonComboBox[TdmDescRegReason].ValueChange [selectModel != null] (L238) → 고른 행의 생성사유 코드와 이름을 같이 바꾼다
      editor: 'select',
      values: reasonCodes.map(c => c.name),
      valueSetter: p => {
        p.data.reasonName = p.newValue;
        p.data.reasonCode = reasonCodes.find(c => c.name === p.newValue)?.code ?? p.data.reasonCode;
        return true;
      },
    }),
    gb.textCenter('personName', 90, '임원명'),  // L345
    gb.date('allcStdDate', 90, '임원의 최종<br>책무배분일'),  // L346 (기준일에 따라 책무배분ID가 바뀔 수 있어 화면 입력 없음)
    gb.text('roleName', 200, '(본)직책'),  // L347
    gb.text('addTitle', 300, '겸직사항'),  // L350
    iconCell<TdmRoleDescCompany>('view', 'actionCell', 80, '책무기술서', onView),  // L353 actionCell01
    dynamicIconCell<TdmRoleDescCompany>('edit', 'apprStatusCode', 'apprRequest', 60, '결재요청', ['00', '40', '99'], row => { void apprRequest(row); }),  // L354 actionCell02
    gb.textStatus('apprStatusName', 80, '결재상태'),  // L355
    dynamicIconCell<TdmRoleDescCompany>('view', 'apprStatusCode', 'apprView', 60, '문서보기', APPR_SENT, viewAppr),  // L356 actionCell03
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [reasonCodes]);

  // [E8] reasonComboBox[TdmDescRegReason].Expand (L228) → 상신 진행·완료이면 "문서 진행 상태로 인해 수정이 제한됩니다." 하고 콤보를 접는다
  const gridCrud = {
    ...crud,
    gridProps: {
      ...crud.gridProps,
      onCellEditingStarted: (e: Parameters<NonNullable<typeof crud.gridProps.onCellEditingStarted>>[0]) => {
        crud.gridProps.onCellEditingStarted?.(e);
        if (e.column.getColId() === 'reasonName' && e.data?.apprStatusCode && APPR_SENT.includes(e.data.apprStatusCode)) {
          message.warning('문서 진행 상태로 인해 수정이 제한됩니다.');
          e.api.stopEditing(true);
        }
      },
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E4] retrieveButton[조회].Select (L184), [E3] searchText.KeyPress [Enter] (L175) → retrieve() */}
      <SearchBar
        onSearch={() => crud.retrieve()}
        extra={
          <>
            {/* [E5] insertButton[등록].Select (L190) → insertRow() */}
            <Button type="register" onClick={() => setLookupOpen(true)}>등록</Button>
            {/* [E6] updateButton[저장].Select (L196) → updateChk() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          {/* [E1] notPeriodYn[전체보기].ValueChange (L150) → 기간 칸 사용 여부 + retrieve() */}
          <Checkbox checked={notPeriodYn} onChange={e => { setNotPeriodYn(e.target.checked); void retrieveWith({ notPeriodYn: e.target.checked }); }}>전체보기</Checkbox>
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="직책/담당임원" value={searchText} onChange={e => setSearchText(e.target.value)} />
          {/* [E2] notEndYn[미처리건만 조회].Change (L166) → retrieve() */}
          <Checkbox checked={notEndYn} onChange={e => { setNotEndYn(e.target.checked); void retrieveWith({ notEndYn: e.target.checked }); }}>미처리건만 조회</Checkbox>
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<TdmRoleDescCompany> crud={gridCrud} columnDefs={columnDefs} />
      </div>
      <Tdm30_Lookup_SelectMulti open={lookupOpen} onSelect={insertRow} onClose={() => setLookupOpen(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
