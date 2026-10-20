/**
 * [1026] 문서작성 > 04. 전자결재 > 사용인감등록 (G07)
 * AS-IS: myApp/client/vi/apr/Apr10_Tab_Stamp.java (408줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L75-96: center=vlc — 툴바 [조회][등록][저장][삭제] + 셀 편집 그리드(체크박스 단일, 17열: 부서(조회창 트리거) 180 · (정)책임자 120(트리거) · (부)책임자 120(트리거) ·
 *   인감이름 180 · 시작날짜 90 · 종료날짜 90 · 사용용도 200 · 인감(이미지) 60 · 올리기 30 · 법인인감 70 · 결재선 필수추가 70 · 전체사용 70 ·
 *   사용가능 부서 140 · 편집 30 · 미사용 문서분류 70 · 편집 30 · 비고 300). 조회창 4개를 모두 이 ID에서 함께 변환했다:
 *   Apr10_Move_OrgCode(부서 선택) · Org10_Lookup_RoleStamp(부서별 사용권한, 안에서 Org00_Lookup_SelectMulti 새로 만듦) · Dcr40_Lookup_StampAuth(미사용 문서분류) · 사원찾기(기존)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { aprApi } from '@/api/apr';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { AprStampManage } from '@/types/apr';
import { OrgCode } from '@/types/org';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr10_Move_OrgCode } from './Apr10_Move_OrgCode';
import { Org10_Lookup_RoleStamp } from '@/pages/org/Org10_Lookup_RoleStamp';
import { Dcr40_Lookup_StampAuth } from '@/pages/dcr/Dcr40_Lookup_StampAuth';

const gb = gbFor<AprStampManage>();
/** 체크박스 단일 선택(setChecked SINGLE). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

/** update() L281-358: 수정한 행마다 필수 검사 — 부서 → (정)책임자 → (부)책임자 → 인감이름 → 시작날짜 */
const validate = (changed: AprStampManage[]): string | undefined => {
  for (const m of changed) {
    if (m.orgId == null) return '부서는 필수선택 항목입니다';  // L286
    if (m.aprEmpId == null) return '(정)책임자는 필수선택 항목입니다';  // L290
    if (m.secondEmpId == null) return '(부)책임자는 필수선택 항목입니다';  // L294
    if (m.stampName == null || m.stampName === '') return '인감이름은 필수입력 항목입니다';  // L298
    if (!m.startDate) return '시작날짜는 필수선택 항목입니다';  // L302
  }
  return undefined;
};

type EmpTarget = { rowId: number; field: 'apr' | 'second' } | null;

export const Apr10_Tab_Stamp: React.FC = () => {
  const [orgPickRowId, setOrgPickRowId] = useState<number | null>(null);
  const [empPick, setEmpPick] = useState<EmpTarget>(null);
  const [roleStamp, setRoleStamp] = useState<AprStampManage | null>(null);
  const [authStampId, setAuthStampId] = useState<number | null>(null);
  const [myOrgCodeId, setMyOrgCodeId] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadRowRef = useRef<AprStampManage | null>(null);
  // 행 안 아이콘 콜백이 늘 최신 crud를 보게 한다 (columnDefs는 한 번만 만든다)
  const crudRef = useRef<ReturnType<typeof useGridCrud<AprStampManage>> | null>(null);

  const crud = useGridCrud<AprStampManage>({
    idField: 'stampId',
    // retrieve() L268-279: 서비스 apr.Apr10_Stamp.selectByCodeName(orgId, companyId)
    search: aprApi.searchStampManage,
    // update() L281-358: GridUpdate → apr.Apr10_Stamp.update 뒤 retrieve()
    save: aprApi.saveStampManage,
    reloadAfterSave: true,
    // deleteRow() L372-393: "삭제"/"선택한 인감을 삭제하시겠습니까?"(폭 300) → [E9] msgBox.DialogHide [YES] (L378) → apr.Apr10_Stamp.delete
    remove: aprApi.deleteStampManage,
    deleteConfirm: '선택한 인감을 삭제하시겠습니까?',
    // [E3] insertButton[등록].Select (L119) → insertRow() L360-370: GridInsertRow, 부서 = 내 부서, 시작날짜 = 오늘, 사용가능 부서 "전체사용", 결재선 필수추가·전체사용 true
    newRow: useCallback(() => ({
      orgId: myOrgCodeId > 0 ? myOrgCodeId : undefined,
      startDate: dayjs().format('YYYY-MM-DD'),
      roleName: '전체사용',
      stepUseYn: 'true',
      allUseYn: 'true',
    }), [myOrgCodeId]),
    firstEditField: 'stampName',
    // [E4] updateButton[저장].Select (L125) → update()
    validate,
  });
  crudRef.current = crud;

  // [E0] 화면 열림 (생성자 L75-96) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    aprApi.getMyOrgCodeId().then(setMyOrgCodeId).catch(() => setMyOrgCodeId(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // buildGrid() 안 아이콘: 변경사항이 있으면 "변경사항을 먼저 저장 후 진행가능합니다" (actionCell02·03 L172-196)
  const checkSaved = useCallback((): boolean => {
    if (crudRef.current?.hasChanges()) {
      message.warning('변경사항을 먼저 저장 후 진행가능합니다');
      return false;
    }
    return true;
  }, []);

  /** 조회창 트리거 열 (AS-IS LookupTriggerField) */
  const trigger = useCallback((field: keyof AprStampManage & string, width: number, title: string, open: (row: AprStampManage) => void) =>
    gb.text(field, width, title, {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: AprStampManage; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
          {p.value}
        </>
      ),
    }), []);

  // [E6] lookupOrgInfo.TriggerClick (L143) → findOrg() L254-266: Apr10_Move_OrgCode(오늘) → 부서명·부서ID
  // [E7] lookupEmpInfo1.TriggerClick (L150) → findEmp1() L228-239 / [E8] lookupEmpInfo2.TriggerClick (L157) → findEmp2() L241-252: 사원찾기(오늘, true) → 책임자 ID·이름
  // [E1] fileUpdownForm.Change (L100) → FileUpload?fileType=image&parentId={stampId} 뒤 update()
  const columnDefs = useMemo(() => [
    trigger('orgName', 180, '부서', row => setOrgPickRowId(row.stampId)),  // L208
    trigger('aprEmpName', 120, '(정)책임자', row => setEmpPick({ rowId: row.stampId, field: 'apr' })),  // L209
    trigger('secondEmpName', 120, '(부)책임자', row => setEmpPick({ rowId: row.stampId, field: 'second' })),  // L210
    gb.text('stampName', 180, '인감이름', { editor: 'text' }),  // L211
    gb.date('startDate', 90, '시작날짜', { editor: 'date' }),  // L212
    gb.date('closeDate', 90, '종료날짜', { editor: 'date' }),  // L213
    gb.text('useName', 200, '사용용도', { editor: 'text' }),  // L214
    {  // L215 addCell(stampId_string, 60, "인감", CustomImageCell) — FileDownload?fileType=image&parentId={stampId}
      ...gb.textCenter('stampIdString', 60, '인감'),
      autoHeight: true,
      cellRenderer: (p: CustomCellRendererProps<AprStampManage>) =>
        p.value ? <img alt="" style={{ height: 50, width: 50, margin: '5px 5px' }} src={fileApi.imageUrl({ parentId: Number(p.value) })} /> : null,
    },
    // L216 actionCell01(Upload) → fileUpdownForm.click(). 저장 안 된 새 행은 올릴 ID가 없어 안내한다(원본은 parentId=null로 올려 실패)
    iconCell<AprStampManage>('upload', 'actionCell01', 30, ' ', row => {
      if (row.stampId <= 0) {
        message.warning('변경사항을 먼저 저장 후 진행가능합니다');
        return;
      }
      uploadRowRef.current = row;
      fileInputRef.current?.click();
    }),
    gb.boolean('corpStampYn', 70, '법인인감', { editable: true }),  // L217
    gb.boolean('stepUseYn', 70, '결재선<br>필수추가', { editable: true }),  // L218
    gb.boolean('allUseYn', 70, '전체사용', { editable: true }),  // L219
    gb.text('roleName', 140, '(전체사용이 아닌 경우)<br>사용가능 부서'),  // L220
    // L221 actionCell02(Edit) → Org10_Lookup_RoleStamp.open(selectModel, callback: roleName ← msg)
    iconCell<AprStampManage>('edit', 'actionCell02', 30, ' ', row => { if (checkSaved()) setRoleStamp(row); }),
    gb.textCenter('stampAuthCntStr', 70, '미사용<br>문서분류'),  // L222
    // L223 actionCell03(Edit) → Dcr40_Lookup_StampAuth.open(selectModel, callback: retrieve())
    iconCell<AprStampManage>('edit', 'actionCell03', 30, ' ', row => { if (checkSaved()) setAuthStampId(row.stampId); }),
    gb.text('note', 300, '비고', { editor: 'text' }),  // L224
  ], [trigger, checkSaved]);

  // findOrg() 결과: grid.getStore().getRecord(stampModel).addChange(orgName, orgId)
  const onPickOrg = (org: OrgCode) => {
    if (orgPickRowId != null) crud.updateRow(orgPickRowId, { orgName: org.korNm, orgId: org.codeId });
  };

  // findEmp1()·findEmp2() 결과
  const onPickEmp = (emp: TransInfo | null) => {
    const target = empPick;
    setEmpPick(null);
    if (!emp || !target) return;
    if (target.field === 'apr') crud.updateRow(target.rowId, { aprEmpId: emp.personId, aprEmpName: emp.korNm });
    else crud.updateRow(target.rowId, { secondEmpId: emp.personId, secondEmpName: emp.korNm });
  };

  // [E1] fileUpdownForm.Change (L100): 선택한 행의 인감ID로 이미지 올림 → update()
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const row = uploadRowRef.current;
    if (!file || !row) return;
    try {
      await fileApi.upload(row.stampId, file);
      if (crud.hasChanges()) await crud.saveRows();
      else await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
  };

  // Org10_Lookup_RoleStamp [저장] callback.execute(msg): 그 행의 사용가능 부서 요약을 바꾼다(저장 대상으로 표시하지 않는다)
  const onRoleSaved = (stampId: number, msg: string) => {
    const row = crud.rows.find(r => r.stampId === stampId);
    if (row) crud.replaceRow(stampId, { ...row, roleName: msg });
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L113) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E5] deleteButton[삭제].Select (L131) → deleteRow() L372-393 */}
          <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AprStampManage> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
      <Apr10_Move_OrgCode baseDate={orgPickRowId != null ? dayjs().format('YYYY-MM-DD') : null} onSelect={onPickOrg} onClose={() => setOrgPickRowId(null)} />
      <Emp00_Lookup_SelectSingle open={empPick != null} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')} onResult={onPickEmp} onClose={() => setEmpPick(null)} />
      <Org10_Lookup_RoleStamp stamp={roleStamp} onSaved={onRoleSaved} onClose={() => setRoleStamp(null)} />
      <Dcr40_Lookup_StampAuth stampId={authStampId} onClosed={() => void crud.retrieve()} onClose={() => setAuthStampId(null)} />
    </div>
  );
};
