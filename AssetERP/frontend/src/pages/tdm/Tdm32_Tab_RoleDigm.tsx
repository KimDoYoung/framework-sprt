/**
 * [1419] 책무 > 02. 책무구조도 > 책무체계도 (N13)
 * AS-IS: myApp/client/vi/tdm/Tdm32_Tab_RoleDigm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L101-134: 가운데 = 툴바(조회기간 [시작 100 ~ 종료 100] + 전체보기 · 미처리건만 조회 · [조회][등록][저장][삭제]) + 책무체계도 CellEditGrid(체크박스 단일)
 * 1단계: 결재요청(updateUseFileType·dcrChk·createRd·relateRdFile·insertLinkApproval·updateApprId)과 문서보기(ApprCallbackResult·Apr01_Edit_ApprDoc)는
 *        전자결재·RD라 다음 단계 — 사전 검사까지만 하고 안내한다. 책무체계도 RD 뷰어(viewRd)는 RD 연동이 없어 안내한다(E12 `Tdm32_Tab_RoleDigmAdmin`과 같다).
 *        사용자 파일 올리기·삭제(fileUpload·deleteRoleDigmFile)는 전자결재와 무관해 변환했다.
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08), 등록은 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { sysApi } from '@/api/sys';
import { tdmApi } from '@/api/tdm';
import { Code, FileInfo } from '@/types/sys';
import { TdmRoleDigmCompany } from '@/types/tdm';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { dynamicIconCell } from './tdmGridCells';

const gb = gbFor<TdmRoleDigmCompany>();
const FORMAT = 'YYYY-MM-DD';
const APPR_SENT = ['10', '20', '30'];   // 상신 진행·완료
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;   // setChecked(SelectionMode.SINGLE)

/**
 * AS-IS `addDynamicCell(fileTypeName02, 40, "", ImageCell, 보일 조건)` — 올린 파일 이름이 비었는지(false)/있는지(true)에 따라 아이콘을 보인다.
 * (dynamicIconCell은 값이 허용 목록에 있을 때만이라 "비어 있을 때"를 못 다룬다)
 */
function fileStateCell(kind: Parameters<typeof iconCell>[0], colId: string, showWhenFile: boolean, onClick: (row: TdmRoleDigmCompany) => void): ColDef<TdmRoleDigmCompany> {
  const base = iconCell<TdmRoleDigmCompany>(kind, colId, 40, '', onClick);
  const Icon = base.cellRenderer as React.FC<CustomCellRendererProps<TdmRoleDigmCompany>>;
  return { ...base, field: 'fileTypeName02', cellRenderer: (p: CustomCellRendererProps<TdmRoleDigmCompany>) => (!!p.value === showWhenFile ? <Icon {...p} /> : null) };
}

export const Tdm32_Tab_RoleDigm: React.FC = () => {
  // [E0] 화면 열림 (생성자 L101-134) → settings() L136-223: 기간 올해 1/1~오늘(전체보기라 비활성), 전체보기 켬·미처리건만 조회 끔 → retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // yyyy-01-01
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());                   // LoginUser.getToday()
  const [notPeriodYn, setNotPeriodYn] = useState(true);                          // notPeriodYn "전체보기" = true → 기간 칸 비활성
  const [notEndYn, setNotEndYn] = useState(false);                               // notEndYn "미처리건만 조회" = false
  const [reasonCodes, setReasonCodes] = useState<Code[]>([]);                    // reasonComboBox[TdmDescRegReason]
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);               // 책무체계도 첨부 보기
  const fileForm = useRef<FileUpdownFormHandle>(null);                           // fileUpdownForm (숨은 파일 선택)
  const fileParentId = useRef<number | null>(null);                              // fileParentId — 올릴 파일의 파일정보 ID

  useEffect(() => {
    sysApi.searchCodes('TdmDescRegReason').then(setReasonCodes).catch(() => {});
  }, []);

  // retrieve() L619-647: tdm.Tdm33_RoleDigmFile.fileCheck → tdm.Tdm32_RoleDigm.selectByRegDate(companyId, startDate, closeDate, notEndYn, notPeriodYn)
  const latest = useRef({ startDate, closeDate, notEndYn, notPeriodYn });
  latest.current = { startDate, closeDate, notEndYn, notPeriodYn };
  const override = useRef<{ notEndYn?: boolean; notPeriodYn?: boolean }>({});   // 체크박스를 바꾼 직후 상태가 반영되기 전 값
  const search = useCallback(async () => {
    const q = { ...latest.current, ...override.current };
    override.current = {};
    const list = await tdmApi.searchRoleDigmsCompany({
      startDate: q.startDate.format(FORMAT),
      closeDate: q.closeDate.format(FORMAT),
      notEndYn: q.notEndYn,
      notPeriodYn: q.notPeriodYn,
    });
    // selectByRegDate가 sys10_file을 LEFT JOIN해 시스템 생성 파일이 둘 이상이면 같은 책무체계도가 여러 행으로 온다 — 행 ID가 겹치지 않게 처음 행만 쓴다
    return list.filter((r, i) => list.findIndex(x => x.roleDigmId === r.roleDigmId) === i);
  }, []);

  // updateChk() L437-477: 바뀐 행마다 상신 중·완료면 "수정할 수 없습니다", 생성일·책무배분기준일·생성사유가 없으면 "필수선택 항목입니다" (첫 번째에서 멈춘다)
  const validate = useCallback((changed: TdmRoleDigmCompany[]) => {
    for (const r of changed) {
      if (r.apprStatusCode && APPR_SENT.includes(r.apprStatusCode)) return '이미 상신중이거나 완료된 문서는 수정할 수 없습니다';
      if (!r.regDate) return '생성일은 필수선택 항목입니다';
      if (!r.allcStdDate) return '책무배분기준일은 필수선택 항목입니다';
      if (!r.reasonCode) return '생성사유는 필수선택 항목입니다';
    }
    return undefined;
  }, []);

  // insertRow() L421-435: 생성일 오늘, 생성사유 "(선택하세요)"(코드 없음) — 변경으로 친다(addChange)
  const initRow = useCallback((): Partial<TdmRoleDigmCompany> => ({
    companyId: null,
    regDate: dayjs().format(FORMAT),
    allcStdDate: null,
    reasonCode: null,
    reasonName: '(선택하세요)',
    apprId: null,
    apprStatusCode: null,
    apprStatusName: null,
  }), []);

  const crud = useGridCrud<TdmRoleDigmCompany>({
    idField: 'roleDigmId',
    search,
    // update() L479-482: GridUpdate → tdm.Tdm32_RoleDigm.update
    save: useCallback(async (changed: TdmRoleDigmCompany[]) => { await tdmApi.saveRoleDigms(changed); return changed; }, []),
    // deleteRow() L518-532: GridDeleteData → tdm.Tdm32_RoleDigm.delete
    remove: tdmApi.deleteRoleDigms,
    newRow: initRow,
    firstEditField: 'regDate',
    validate,
    deleteConfirm: false,
    reloadAfterSave: true,
  });
  const api = () => crud.gridRef.current?.api;

  // [E1] notPeriodYn[전체보기].ValueChange (L146) → 기간 칸 사용 여부 + retrieve(), [E2] notEndYn[미처리건만 조회].Change (L162) → retrieve()
  const retrieveWith = (over: { notEndYn?: boolean; notPeriodYn?: boolean }) => {
    override.current = over;
    return crud.retrieve();
  };
  // [E0] 생성자 끝의 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  // [E6] deleteButton[삭제].Select (L187) → deleteChk() L484-516: 상신 중·완료가 하나라도 있으면 안내, 없으면 "n건을 삭제하시겠습니까?" → [YES] [E11] deleteRow()
  const deleteChk = () => {
    const checked = (api()?.getSelectedRows() ?? []) as TdmRoleDigmCompany[];
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

  // viewRd() L788-830: Sys99_Print.CreateTdmRoleDigm → RD 뷰어(Tdm32_Rd_DigmRpt) — RD 연동이 없어 열 수 없다 (E12와 같다)
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무체계도를 열 수 없습니다.');
  };

  // openRelateFile02(): 파일정보 ID의 첫 첨부(sys10_file)를 Sys10_Lookup_FileViewer로 연다
  const openRelateFile02 = async (roleDigmFileId: number) => {
    const files = await fileApi.searchByParentId(roleDigmFileId);
    if (files.length > 0) setViewFile(files[0]);
    else message.info('열 수 있는 파일이 없습니다.');             // 원본은 result.getResult(0)이 비어 있으면 오류가 난다
  };

  // openRelateFile01() L877-894: selectByFileType(roleDigmId, useFileType) 첫 건이 있으면 파일 열기, 없으면 viewRd()
  const openRelateFile01 = async (row: TdmRoleDigmCompany) => {
    const ids = await tdmApi.getRoleDigmFileIds(row.roleDigmId, row.useFileType ?? '');
    if (ids.length !== 0) await openRelateFile02(ids[0]);
    else viewRd();
  };

  // 책무체계도 (actionCell01 L233-285): 저장 안 한 변경 안내, 결재상태 10·20·30이면 openRelateFile01(), 아니면 fileType "2"가 정확히 1건일 때 그 파일, 아니면 viewRd()
  const onView = async (row: TdmRoleDigmCompany) => {
    if (crud.hasChanges()) { message.warning('작업중인 내용을 저장 후 이용해주세요'); return; }
    try {
      if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) {
        await openRelateFile01(row);
      } else {
        const ids = await tdmApi.getRoleDigmFileIds(row.roleDigmId, '2');
        if (ids.length === 1) await openRelateFile02(ids[0]);
        else viewRd();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 결재요청 (actionCell03 L287-324): 저장하지 않은 변경이 있으면 안내
  // 그다음 사용 파일구분 결정(upsertByRoleDigmId·updateUseFileType)·dcrChk(Dcr01_Lookup_Class)·createRd(RD)·Apr01_Edit_ApprDoc·updateApprId는 전자결재/RD라 다음 단계
  const apprRequest = (_row: TdmRoleDigmCompany) => {
    if (crud.hasChanges()) { message.warning('작업중인 내용을 저장 후 이용해주세요'); return; }
    // [E생략] updateUseFileType → dcrChk → createRd(Sys99_Print.CreateTdmRoleDigm·RDUtil)/insertLinkApproval → Apr01_Edit_ApprDoc → updateApprId: 전자결재·RD는 다음 단계
    message.info('전자결재 상신(Apr01_Edit_ApprDoc)은 아직 변환 전입니다');
  };

  // 문서보기 (actionCell04 L326-352): 결재 ID가 없으면 "문서가 존재하지않습니다". ApprCallbackResult·Apr01_Edit_ApprDoc.retrieveApproval은 다음 단계
  const viewAppr = (row: TdmRoleDigmCompany) => {
    if (row.apprId == null) { message.warning('문서가 존재하지않습니다'); return; }
    // [E생략] ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval: 전자결재는 다른 도메인 — 다음 단계
    message.info('전자결재 문서 보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다');
  };

  // 파일업로드 (actionCell02 → fileUploadChk() L832-842 → fileUpload() L844-860): 상신 중·완료면 안내, 아니면 파일정보(fileType "2")를 만들고 파일 선택 창을 연다
  const fileUploadChk = async (row: TdmRoleDigmCompany) => {
    if (row.roleDigmId <= 0) { message.warning('저장 후 진행가능합니다'); return; }
    if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) { message.warning('이미 상신중이거나 완료된 문서는 변경할 수 없습니다'); return; }
    fileParentId.current = null;
    try {
      fileParentId.current = await tdmApi.createRoleDigmFileInfo(row.roleDigmId, '2');
      fileForm.current?.click();
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
  };

  // [E8] fileUpdownForm.Change (L203) → FileUpload?fileType=file&parentId=fileParentId 로 올린 뒤 retrieve()
  const onFilePicked = async (file: File | undefined) => {
    if (!file || fileParentId.current == null) return;
    try {
      await fileApi.upload(fileParentId.current, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await crud.retrieve();
  };

  // [E7 생략] fileDeleteForm.SubmitComplete (L195) → retrieve(): 숨은 삭제 폼(setVisible(false))으로 쓰는 곳이 없다 — 파일 삭제는 서비스 호출 뒤 직접 retrieve()한다
  // 파일삭제 (actionCell05 L214-231): 상신 중·완료면 안내, 아니면 "해당 파일을 삭제하시겠습니까?"(350) → [YES] [E10] deleteRoleDigmFile() L862-875
  const fileDelete = (row: TdmRoleDigmCompany) => {
    if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) { message.warning('이미 상신중이거나 완료된 문서는 변경할 수 없습니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '해당 파일을 삭제하시겠습니까?',
      width: 350,
      onOk: async () => {
        try {
          await tdmApi.deleteRoleDigmFileInfo(row.roleDigmId, '2');
          message.success('삭제가 완료되었습니다.');
          await crud.retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L225-419
  const columnDefs = useMemo(() => [
    gb.date('regDate', 120, '생성일', { editor: 'date' }),  // L396
    gb.date('allcStdDate', 120, '책무배분기준일', { editor: 'date' }),  // L397
    gb.text('reasonName', 300, '생성사유', {  // L398 reasonComboBox — [E9] reasonComboBox[TdmDescRegReason].Collapse (L229) → 고른 행의 생성사유 코드와 이름을 같이 바꾼다
      editor: 'select',
      values: reasonCodes.map(c => c.name),
      valueSetter: p => {
        p.data.reasonName = p.newValue;
        p.data.reasonCode = reasonCodes.find(c => c.name === p.newValue)?.code ?? p.data.reasonCode;
        return true;
      },
    }),
    iconCell<TdmRoleDigmCompany>('view', 'actionCell', 80, '책무체계도', row => { void onView(row); }),  // L399 actionCell01
    fileStateCell('upload', 'fileUpload', false, row => { void fileUploadChk(row); }),  // L400 addDynamicCell(fileTypeName02, 40, "", actionCell02, false) — 올린 파일이 없는 행에만 올리기 아이콘
    fileStateCell('delete', 'fileDelete', true, fileDelete),  // L401 addDynamicCell(fileTypeName02, 40, "", actionCell05, true) — 올린 파일이 있는 행에만 삭제 아이콘
    dynamicIconCell<TdmRoleDigmCompany>('edit', 'apprStatusCode', 'apprRequest', 80, '결재요청', ['00', '40', '99'], apprRequest),  // L402 actionCell03
    gb.textStatus('apprStatusName', 80, '결재상태'),  // L403
    dynamicIconCell<TdmRoleDigmCompany>('view', 'apprStatusCode', 'apprView', 80, '문서보기', APPR_SENT, viewAppr),  // L404 actionCell04
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [reasonCodes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L169) → retrieve() */}
      <SearchBar
        onSearch={() => crud.retrieve()}
        extra={
          <>
            {/* [E4] insertButton[등록].Select (L175) → insertRow() */}
            <Button type="register" onClick={() => crud.addRows([initRow()], true)}>등록</Button>
            {/* [E5] updateButton[저장].Select (L181) → updateChk() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={notPeriodYn} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          {/* [E1] notPeriodYn[전체보기].ValueChange (L146) → 기간 칸 사용 여부 + retrieve() */}
          <Checkbox checked={notPeriodYn} onChange={e => { setNotPeriodYn(e.target.checked); void retrieveWith({ notPeriodYn: e.target.checked }); }}>전체보기</Checkbox>
          {/* [E2] notEndYn[미처리건만 조회].Change (L162) → retrieve() */}
          <Checkbox checked={notEndYn} onChange={e => { setNotEndYn(e.target.checked); void retrieveWith({ notEndYn: e.target.checked }); }}>미처리건만 조회</Checkbox>
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<TdmRoleDigmCompany> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
      </div>
      <FileUpdownForm ref={fileForm} onChange={file => { void onFilePicked(file); }} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
