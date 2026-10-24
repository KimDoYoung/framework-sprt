/**
 * 임원별 직책배정의 책무배분일 탭 (N11) — 직책배정 그리드에서 고른 행의 책무배분일을 편집한다.
 * AS-IS: myApp/client/vi/tdm/Tdm34_TabPage_RoleAllcDetail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-103: 툴바([조회][등록][저장][삭제]) + 책무배분일 그리드(행번호, 셀 편집)
 * 1단계: 상신(Apr01_Edit_ApprDoc·Dcr01_Lookup_Class·insertLinkApprovals·updateApprId)과 상신문서보기는 전자결재라 다음 단계 — 검사까지만 하고 안내한다.
 *        책무기술서 미리보기의 RD 뷰어(viewRd)는 RD 연동이 없어 안내한다(E11 `Tdm31_Tab_RoleDescAdmin`과 같다).
 * UX보강(10): 저장 = 저장(n)(UX-03), 등록은 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmRoleAllc, TdmRoleAllcDetail } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Tdm35_Lookup_RoleAllcTask } from './Tdm35_Lookup_RoleAllcTask';
import { dynamicIconCell } from './tdmGridCells';

const gb = gbFor<TdmRoleAllcDetail>();
const APPR_SENT = ['10', '20', '30'];   // 상신 진행·완료 (99 임시저장·40 반려는 상신 전으로 본다)

/** validate: updateChk01() L310-338 — 바뀐 행마다 책무배분일 → 등록사유 필수, 그다음 전체 행의 책무배분일 중복 */
const validate = (changed: TdmRoleAllcDetail[], all: TdmRoleAllcDetail[]) => {
  for (const r of changed) {
    if (!r.roleAllcDate) return '책무배분일은 필수선택항목입니다';
    if (!r.regReason) return '등록사유는 필수입력항목입니다';
  }
  const dateSet = new Set<string | null>();
  for (const r of all) {
    if (dateSet.has(r.roleAllcDate)) return '책무배분일이 중복되었습니다';
    dateSet.add(r.roleAllcDate);
  }
  return undefined;
};

interface Props {
  /** 직책배정 그리드에서 고른 행 — AS-IS retrieve(selectModel) */
  roleAllc: TdmRoleAllc | null;
  /** 값이 바뀌면 다시 조회한다 (직책배정을 조회할 때마다 AS-IS retrieveTabPage() 가 탭을 다시 읽는다) */
  nonce: number;
}

export const Tdm34_TabPage_RoleAllcDetail: React.FC<Props> = ({ roleAllc, nonce }) => {
  // [E0] 화면 열림 (생성자 L80-103) → settings(): 버튼 연결은 아래 툴바, 조회는 직책배정을 고를 때 부른다(retrieve(selectModel) L279-283)
  const roleAllcId = roleAllc?.roleAllcId ?? null;
  const idRef = useRef<number | null>(null);
  idRef.current = roleAllcId;
  const [taskDetailId, setTaskDetailId] = useState<number | null>(null);   // 책무 및 세부내용 창
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);         // 책무기술서 첨부 보기

  // retrieve() L285-299: tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId(roleAllcId) → 첫 행 선택
  const crud = useGridCrud<TdmRoleAllcDetail>({
    idField: 'roleAllcDetailId',
    search: useCallback(async () => (idRef.current == null ? [] : tdmApi.searchRoleAllcDetails(idRef.current)), []),
    // update() L340-343: GridUpdate → tdm.Tdm34_RoleAllcDetail.update (응답이 목록 전체라 다시 조회)
    save: useCallback(async (changed: TdmRoleAllcDetail[]) => {
      if (idRef.current != null) await tdmApi.saveRoleAllcDetails(idRef.current, changed);
      return changed;
    }, []),
    // deleteRow() L365-393: GridDeleteData → tdm.Tdm34_RoleAllcDetail.delete
    remove: tdmApi.deleteRoleAllcDetails,
    // insertRow() L301-308: roleAllcId 만 채운 빈 행
    newRow: useCallback(() => ({
      roleAllcId: idRef.current ?? 0, roleAllcDate: null, regReason: null, deputyEmpName: null,
      apprId: null, apprStatusCode: null, apprStatusName: null, addTitleYnStr: null, updName: null, updDateStr: null,
    }), []),
    firstEditField: 'roleAllcDate',
    validate,
    deleteConfirm: false,
    reloadAfterSave: true,
  });
  const api = () => crud.gridRef.current?.api;

  const retrieve = useCallback(async () => {
    await crud.retrieve();
    setTimeout(() => api()?.getDisplayedRowAtIndex(0)?.setSelected(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crud.retrieve]);

  // 직책배정 행을 고르거나 다시 조회하면 탭을 다시 읽는다 (Tdm30_Tab_RoleAllc.retrieveTabPage → tabPage.retrieve(selectModel))
  useEffect(() => {
    if (roleAllcId == null) return;
    void retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleAllcId, nonce]);

  // [E4] deleteButton[삭제].Select (L124) → deleteChk() L345-363: "n건을 삭제하시겠습니까?" → [YES] [E7] deleteRow() L365-393
  const deleteChk = () => {
    const count = api()?.getSelectedRows().length ?? 0;
    Modal.confirm({
      title: '삭제',
      content: `${count}건을 삭제하시겠습니까?`,
      width: 280,
      onOk: async () => {
        if (crud.hasChanges()) { message.warning('저장 후 진행가능합니다'); return; }
        for (const r of (api()?.getSelectedRows() ?? []) as TdmRoleAllcDetail[]) {
          if (r.apprStatusCode && APPR_SENT.includes(r.apprStatusCode)) { message.warning('상신중이거나 완료된 문서는 삭제 불가합니다.'); return; }
        }
        await crud.deleteChecked();
      },
    });
  };

  // 책무보기 (actionCell01 L134-141): Tdm35_Lookup_RoleAllcTask.open(roleAllcDetailId)
  const viewTask = (row: TdmRoleAllcDetail) => {
    if (row.roleAllcDetailId <= 0) { message.warning('저장 후 진행가능합니다'); return; }
    setTaskDetailId(row.roleAllcDetailId);
  };

  // 상신 (actionCell02 L144-168): 6/22 이전이면 권장 확인 → [E5] messageBox.DialogHide (L154) [아니오] → dcrChk() L395-432
  const apprRequest = (row: TdmRoleAllcDetail) => {
    if (dayjs().isBefore('2026-06-22')) {
      Modal.confirm({
        title: '확인',
        content: <>원활한 진행을 위해 6월 22일 이후 상신하시기를 권장드립니다.<br />상신을 취소하시겠습니까?</>,
        width: 500,
        okText: '예',
        cancelText: '아니오',
        onCancel: () => dcrChk(row),
      });
    } else {
      dcrChk(row);
    }
  };

  // dcrChk() L395-432: 저장하지 않은 변경이 있으면 / 이미 상신중·완료면 안내. 그다음 분류 조회(Dcr30_Link A90)·책무 HTML·전자결재 편집창은 다음 단계
  const dcrChk = (row: TdmRoleAllcDetail) => {
    if (crud.hasChanges()) { message.warning('저장 후 진행가능합니다'); return; }
    if (row.apprStatusCode && APPR_SENT.includes(row.apprStatusCode)) { message.warning('이미 상신중이거나 완료된 문서가 존재합니다'); return; }
    // [E생략] Dcr30_Link.selectByLinkCode → Dcr01_Lookup_Class → Tdm12_TaskRelateDetail.getHtmlData → Apr01_Edit_ApprDoc → updateApprId: 전자결재는 다른 도메인 — 다음 단계
    message.info('전자결재 상신(Apr01_Edit_ApprDoc)은 아직 변환 전입니다');
  };

  // 상신문서보기 (actionCell03 L171-206)
  const viewAppr = (row: TdmRoleAllcDetail) => {
    if (row.apprId == null) { message.warning('상신문서가 없습니다'); return; }
    if (row.apprStatusCode === '99') { message.warning('임시저장 문서는 열람이 불가능합니다'); return; }
    // [E생략] ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval: 전자결재는 다른 도메인 — 다음 단계
    message.info('전자결재 문서 보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다');
  };

  // viewRd() L545-588: Sys99_Print.CreateTdmRoleDesc → RD 뷰어(Tdm31_Rd_DescRpt) — RD 연동이 없어 열 수 없다 (E11과 같다)
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무기술서를 열 수 없습니다.');
  };

  // lookupDesc() L507-543: tdm.Tdm35_RoleAllcTask.deleteInsert(상신 전 확정책무 다시 만들기) → viewRd()
  const lookupDesc = async (row: TdmRoleAllcDetail) => {
    try {
      await tdmApi.rebuildRoleAllcTasks(row.roleAllcDetailId);
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
      return;
    }
    viewRd();
  };

  // viewFile() L590-610: sys.Sys10_File.selectByParentId(roleDescId) → 있으면 Sys10_Lookup_FileViewer, 없으면 "파일생성실패로인한 RD뷰어호출" 후 viewRd()
  const viewAttached = async (roleDescId: number) => {
    try {
      const files = await fileApi.searchByParentId(roleDescId);
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

  // 책무기술서 미리보기 (actionCell04 L209-234): 승인 완료(30)면 tdm.Tdm31_RoleDesc.getRollAllcDetailId → 있으면 viewFile(roleDescId), 없으면 lookupDesc(). 그 밖은 lookupDesc()
  const viewDesc = async (row: TdmRoleAllcDetail) => {
    if (row.roleAllcDetailId <= 0) { message.warning('저장 후 진행가능합니다'); return; }
    if (row.apprStatusCode === '30') {
      try {
        const roleDescId = await tdmApi.searchRoleDescIdByDetail(row.roleAllcDetailId);
        if (roleDescId != null) { await viewAttached(roleDescId); return; }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
    }
    await lookupDesc(row);
  };

  // buildGrid() L132-277
  const columnDefs = useMemo(() => [
    gb.date('roleAllcDate', 90, '책무배분일', { editor: 'date' }),  // L249
    gb.textArea('regReason', 200, '등록사유', { editor: 'text' }),  // L250
    gb.text('deputyEmpName', 120, '유고시<br>대체 임직원', { editor: 'text' }),  // L251
    iconCell<TdmRoleAllcDetail>('view', 'viewTask', 70, '책무보기', viewTask),  // L252 actionCell01
    dynamicIconCell<TdmRoleAllcDetail>('view', 'addTitleYnStr', 'viewDesc', 75, '책무기술서<br>미리보기', ['N'], row => { void viewDesc(row); }),  // L254 actionCell04 (겸직 아님만)
    // HeaderGroupMap(0, 6, "임원동의서", 1, 3) — 상신상태 + 아이콘 두 칸
    gb.group('임원동의서', [
      gb.textStatus('apprStatusName', 70, '상신상태'),  // L255
      dynamicIconCell<TdmRoleAllcDetail>('edit', 'apprStatusCode', 'apprRequest', 30, ' ', ['00', '99', '40'], apprRequest),  // L256 actionCell02 (상신 전)
      dynamicIconCell<TdmRoleAllcDetail>('view', 'apprStatusCode', 'apprView', 30, ' ', APPR_SENT, viewAppr),  // L257 actionCell03 (상신 진행·완료)
    ]),
    gb.textCenter('updName', 80, '변경자'),  // L258
    gb.textCenter('updDateStr', 150, '변경일시'),  // L259
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // [E6] gridBuilder.BeforeStartEdit [model != null] (L260) → 상신 진행·완료이면 책무배분일 편집을 시작할 때 "상신문서 존재시 책무배분일은 수정할 수 없습니다" (AS-IS는 안내만 하고 편집은 막지 않는다)
  const gridCrud = {
    ...crud,
    gridProps: {
      ...crud.gridProps,
      onCellEditingStarted: (e: Parameters<NonNullable<typeof crud.gridProps.onCellEditingStarted>>[0]) => {
        crud.gridProps.onCellEditingStarted?.(e);
        if (e.column.getColId() === 'roleAllcDate' && e.data?.apprStatusCode && APPR_SENT.includes(e.data.apprStatusCode)) {
          message.warning('상신문서 존재시 책무배분일은 수정할 수 없습니다');
        }
      },
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
      <div style={{ padding: '10px 10px 8px' }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L106) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L112) → insertRow() */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E3] updateButton[저장].Select (L118) → updateChk01() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={deleteChk}>삭제</Button>
        </Space>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<TdmRoleAllcDetail> crud={gridCrud} columnDefs={columnDefs} />
      </div>
      <Tdm35_Lookup_RoleAllcTask roleAllcDetailId={taskDetailId} onClose={() => setTaskDetailId(null)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
