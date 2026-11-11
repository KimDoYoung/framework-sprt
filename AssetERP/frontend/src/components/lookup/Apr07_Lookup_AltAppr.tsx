/**
 * 대결자 지정 조회창 — 휴가신청(Emp20_Edit_Leave, #1032)의 [대결자 지정]이 연다 (다른 도메인에서도 쓰는 조회창).
 * AS-IS: myApp/client/vi/apr/Apr07_Lookup_AltAppr.java (360줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * 생성자 L86-127: 모달 1200×450, 제목 "대결자 지정", 툴바 [등록][저장][삭제] + 안내 글(조회기준일) + 오른쪽 새로고침 아이콘, 셀 편집 그리드(체크박스 단일) + [닫기]
 * open(leaveModel) L75-84: apr.Apr07_AltAppr.selectByToDay(로그인 사원) → 조회가 끝나면 휴가신청의 기간·사유·비상망을 채운 새 행을 하나 더한다(insertRow(leaveModel) L216-231)
 * 같은 grid를 쓰는 대결자 지정 화면은 `Apr07_Tab_AltAppr`(G05, #1021)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { aprAltApprApi } from '@/api/apr';
import { AprAltAppr } from '@/types/apr';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AprAltAppr>();
/** 체크박스 단일 선택(setChecked SINGLE L165). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

/** open(leaveModel)에 넘기는 휴가신청 한 건 — insertRow(leaveModel) L216-231이 쓰는 값만 */
export interface AltApprLeave {
  leaveId: number;
  startDate: string | null;
  closeDate: string | null;
  reason: string | null;
  emergencyTelno: string | null;
}

/** update() L233-311: 필수 검사(수정한 행) → 기간이 겹치는 행 검사(모든 행, altApprId가 있는 쪽 기준) */
const validate = (changed: AprAltAppr[], all: AprAltAppr[]): string | undefined => {
  for (const m of changed) {
    if (m.altEmpId == null) return '대결자는 필수입력 항목입니다';  // L241
    if (!m.startDate) return '시작일은 필수입력 항목입니다';  // L245
    if (!m.closeDate) return '종료일은 필수입력 항목입니다';  // L249
    if (!m.reasonCd) return '대결사유는 필수입력 항목입니다';  // L253
  }
  for (let i = 0; i < all.length; i++) {
    const m1 = all[i];
    for (let j = i + 1; j < all.length; j++) {
      const m2 = all[j];
      // 추가 행은 임시 음수 ID라 AS-IS의 altApprId == null 에 해당 → m1이 새 행이면 건너뛴다
      if (m1.altApprId > 0 && m1.altApprId !== m2.altApprId && m1.startDate && m1.closeDate && m2.startDate && m2.closeDate
        && m1.startDate <= m2.closeDate && m1.closeDate >= m2.startDate) {
        return `'${m1.altEmpName}'님과 대결자 설정기간이 중복됩니다`;  // L302
      }
    }
  }
  return undefined;
};

interface Props {
  open: boolean;
  /** open(leaveModel): 새 행에 기간·사유·비상망을 채운다. 없으면 빈 목록 조회만 한다 */
  leave: AltApprLeave | null;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Apr07_Lookup_AltAppr: React.FC<Props> = ({ open, leave, onClose }) => {
  const [pickOpen, setPickOpen] = useState(false);
  const [pickRowId, setPickRowId] = useState<number | null>(null);

  const crud = useGridCrud<AprAltAppr>({
    idField: 'altApprId',
    // open() L75-84 · retrieve() L197-202: 서비스 apr.Apr07_AltAppr.selectByToDay(empId = 로그인 사원)
    search: aprAltApprApi.searchAltApprsToday,
    // updateFinal() L313-325: GridUpdate → apr.Apr07_AltAppr.update, 성공 "정상적으로 등록완료되었습니다"
    save: aprAltApprApi.saveAltApprs,
    // delete() L347-351: GridDeleteData → apr.Apr07_AltAppr.delete
    remove: aprAltApprApi.deleteAltApprs,
    // [E4] deleteButton[삭제].Select (L142) → deleteChk() L327-345: "삭제"/"선택한 항목을 삭제하시겠습니까?"(폭 300)
    // [E7] msgBox.DialogHide [YES] (L330) → delete() L347-351
    deleteConfirm: '선택한 항목을 삭제하시겠습니까?',
    // [E2] insertRowButton[등록].Select (L130) → insertRow() L204-214: GridInsertRow, targetEmpId ← 로그인 사원(서버가 채운다)
    newRow: useCallback(() => ({ stampYn: 'false' }), []),
    firstEditField: 'altEmpName',
    // [E3] saveButton[저장].Select (L136) → update() L233-311
    validate,
  });

  // [E0] 화면 열림 (생성자 L86-127) → settings(), show()
  // open(leaveModel) L75-84: 조회가 끝나면 insertRow(leaveModel) L216-231 — leaveId·기간·사유·비상망을 넣은 새 행(변경으로 친다: addChange)
  useEffect(() => {
    if (!open) return;
    void (async () => {
      await crud.retrieve();
      if (leave) {
        crud.addRows([{
          leaveId: leave.leaveId,
          stampYn: 'false',
          startDate: leave.startDate,
          closeDate: leave.closeDate,
          reasonCd: leave.reason,
          emgrPoint: leave.emergencyTelno,
        }], true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E6] lookupEmpInfo.TriggerClick (L159) → openLookupEmpInfo() L179-195: 사원찾기(open(오늘, …)) → 선택 행에 대결자 사원 정보를 넣는다
  const onPick = (emp: TransInfo | null) => {
    setPickOpen(false);
    if (!emp || pickRowId == null) return;
    crud.updateRow(pickRowId, {
      altEmpId: emp.personId,
      altEmpNo: emp.empNo,
      altEmpName: emp.korNm,
      altOrgName: emp.orgKorNm,
      altTitleName: emp.titleNm,
    });
  };

  // buildGrid() L156-177
  const columnDefs = useMemo(() => [
    gb.textCenter('altEmpName', 80, '성명', {  // L166 (LookupTriggerField)
      cellStyle: { color: '#1677ff', textAlign: 'center' },
      cellRenderer: (p: { data?: AprAltAppr; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) { setPickRowId(p.data.altApprId); setPickOpen(true); } }} />
          {p.value}
        </>
      ),
    }),
    gb.text('altEmpNo', 100, '사번'),  // L167
    gb.text('altOrgName', 150, '부서명'),  // L168
    gb.textCenter('altTitleName', 80, '직책'),  // L169
    gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L170
    gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L171
    gb.boolean('stampYn', 120, '인감날인은<br>(부)책임자가 대리', { editable: true }),  // L172
    gb.text('reasonCd', 250, '대결사유', { editor: 'text' }),  // L173
    gb.text('emgrPoint', 120, '비상연락(비고)', { editor: 'text' }),  // L174
  ], []);

  const title = `결재권한을 이관할 직원을 등록합니다. 인감날인 책임자 체크는 '(정)책임자'만 해당됩니다. [ 조회기준일 : ${dayjs().format('YYYY-MM-DD')} ]`;

  return (
    <>
      {/* 열 폭 합계 80+100+150+80+100+100+120+250+120 = 1100 + 행번호·체크 60 + 여백 130 = 1290 → 1120 초과라 AS-IS 폭(1200)보다 크게, 넘치는 만큼만 스크롤 (03 원칙 21) */}
      <LookupModal open={open} title="대결자 지정" width={1290} maskClosable={false} onCancel={onClose} destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] closeButton[닫기].Select (L148) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" disabled={!crud.hasChecked} onClick={() => crud.deleteChecked()}>삭제</Button>
            <span style={{ flex: 1, minWidth: 0, color: '#1677ff' }}>{title}</span>
            {/* [E1] anchor.MouseDown (L104) → retrieve() — 새로고침 아이콘 */}
            <AntButton type="text" size="small" icon={<ReloadOutlined />} onClick={() => void crud.retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<AprAltAppr> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectSingle open={pickOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickOpen(false)} />
    </>
  );
};
