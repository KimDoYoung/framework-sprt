/**
 * 근태정책 설정 창 (T06) — Att02_Tab_CommuteAdmin의 [근태정책설정]이 연다
 * AS-IS: myApp/client/vi/att/Att01_Lookup_WorkPolicy.java (314줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-90: 툴바 50 = [조회][저장][등록][삭제], 셀 편집 그리드 11열(체크 없음 — 한 행 선택 삭제). open() L61-63: retrieve()
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, message, Space } from 'antd';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttWorkPolicy } from '@/types/att';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AttWorkPolicy>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;
const today = () => new Date().toISOString().slice(0, 10);

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Att01_Lookup_WorkPolicy: React.FC<Props> = ({ open, onClose }) => {
  const crud = useGridCrud<AttWorkPolicy>({
    idField: 'workPolicyId',
    // retrieve() L292-303: att.Att01_WorkPolicy.selectByCompanyId(companyId(서버))
    search: useCallback(() => attApi.searchWorkPolicies(), []),
    save: useCallback((rows: AttWorkPolicy[]) => attApi.saveWorkPolicies(rows), []),
    remove: useCallback((ids: number[]) => attApi.deleteWorkPolicies(ids), []),
    // insertRow() L251-269: 오늘 날짜·사용 true, 출근 09:00·퇴근 18:00·휴게 0·연장 0·지각허용 15·조기허용 0·초과유예 15
    newRow: () => ({
      startDate: today(), useYn: true, workStartTime: '09:00', workEndTime: '18:00', breakMinutes: 0, overtimeMinutes: 0,
      startGraceAfterMinutes: 15, endGraceBeforeMinutes: 0, endGraceAfterMinutes: 15,
    }),
    firstEditField: 'startDate',
    deleteConfirm: false,
    // update() L143-235: 바꾼 행마다 필수 검사 → 적용시작일 중복·사용 여부 한 항목 검사 (그리드에 회사의 모든 정책이 있어 notWorkPolicyIdList 호출은 생략, 작업방법 참조)
    validate: (changed, all) => {
      for (const m of changed) {
        if (m.startDate == null || m.startDate === '') return '적용시작일은 필수입력 항목입니다';  // TOBE 추가: 원본은 DB가 막는다
        if (m.workStartTime == null || m.workStartTime === '') return '출근시간은 필수입력 항목입니다';
        if (m.workEndTime == null || m.workEndTime === '') return '퇴근시간은 필수입력 항목입니다';
        if (m.breakMinutes == null) return '휴게시간(분)은 필수입력 항목입니다';
        if (m.overtimeMinutes == null) return '연장허용시간(분)은 필수입력 항목입니다';
        if (m.startGraceAfterMinutes == null) return '출근 지각 허용시간(분)은 필수입력 항목입니다';
        if (m.endGraceBeforeMinutes == null) return '퇴근 조기 허용시간(분)은 필수입력 항목입니다';
        if (m.endGraceAfterMinutes == null) return '퇴근 초과 인정 유예시간(분)은 필수입력 항목입니다';
      }
      for (let i = 0; i < all.length; i++) {
        const m1 = all[i];
        for (let j = i + 1; j < all.length; j++) {
          const m2 = all[j];
          if (m1.workPolicyId > 0) {  // 원본: keyId1 != null (새 행은 건너뜀)
            if (m1.startDate === m2.startDate) return '적용시작일이 중복됩니다';
            if (m1.useYn && m2.useYn) return '사용 여부는 한 항목에만 적용 가능합니다';
          }
        }
      }
      return undefined;
    },
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L65-90) → settings(), show(). open() L61-63 → retrieve()
  useEffect(() => {
    if (open) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L92-141 — 편집 열은 전부 파란 글씨
  const columnDefs = useMemo(() => [
    gb.date('startDate', 100, '적용시작일', { editor: 'date' }),
    gb.textCenter('workStartTime', 130, '출근시간', { editor: 'text' }),
    gb.textCenter('workEndTime', 130, '퇴근시간', { editor: 'text' }),
    gb.long('breakMinutes', 130, '휴게시간(분)', { editor: 'number' }),
    gb.boolean('useYn', 50, '사용', { editable: true }),
    gb.long('overtimeMinutes', 130, '연장허용시간(분)', { editor: 'number' }),
    gb.long('startGraceAfterMinutes', 130, '출근 지각<br>허용시간(분)', { editor: 'number' }),
    gb.long('endGraceBeforeMinutes', 130, '퇴근 조기<br>허용시간(분)', { editor: 'number' }),
    gb.long('endGraceAfterMinutes', 130, '퇴근 초과인정<br>유예시간(분)', { editor: 'number' }),
    gb.textCenter('pmWorkStartTime', 130, '오후근무<br>출근시간', { editor: 'text' }),
    gb.textCenter('pmWorkEndTime', 130, '오후근무<br>퇴근시간', { editor: 'text' }),
  ], []);

  // [E4] deleteButton[삭제].Select (L111) → deleteChk() L271-290: "해당 정보를 삭제하시겠습니까?"(제목 "확인", 폭 300) → [E6] msgBox.DialogHide [YES] (L274) → delete() L305-309
  const deleteChk = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) { message.warning('삭제할 행을 선택하세요.'); return; }
    Modal.confirm({
      title: '확인',
      content: '해당 정보를 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        const ids = (crud.gridRef.current?.api.getSelectedRows() ?? []).map(r => r.workPolicyId);
        try {
          const persisted = ids.filter(id => id > 0);
          if (persisted.length > 0) await attApi.deleteWorkPolicies(persisted);
          crud.removeRows(ids);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={open}
      title="근태정책 설정"
      width={1200}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] closeButton[닫기].Select (L117) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L93) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {/* [E3] updateButton[저장].Select (L105) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E2] insertButton[등록].Select (L99) → insertRow(): 기본값 칸을 바꾼 것으로 쳐서 저장 대상이 된다 */}
          <Button type="register" onClick={() => crud.addRows([{}], true)}>등록</Button>
          <Button type="delete" onClick={deleteChk}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AttWorkPolicy> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
