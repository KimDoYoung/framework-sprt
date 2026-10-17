/**
 * 예외사원 등록 창 (E05-1) — Ics30_Tab_Compliance의 [예외사원 등록]에서 연다 (open("10") = 내부통제 준수확인서 작성 예외)
 * AS-IS: myApp/client/vi/emp/Emp33_Lookup_ExceptBiz.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-89: 모달 1200×600 "예외사원 등록", 위 = 툴바 [조회][등록][저장][삭제], 아래 = 셀 편집 그리드(행번호, 체크박스 단일:
 *   사원명 250 · 예외시작일 100 · 예외종료일 100 · 예외사유 350 · 보고서에서 제거 250), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { empExceptBizApi } from '@/api/emp';
import { ExceptBiz, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<ExceptBiz>();
/** 체크박스 단일 선택(setChecked SINGLE). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

interface Props {
  /** open(exceptBizCode) L66-89 — 값이 있으면 열린다 ("10" = 내부통제 준수확인서 작성) */
  exceptBizCode: string | null;
  onClose: () => void;
}

export const Emp33_Lookup_ExceptBiz: React.FC<Props> = ({ exceptBizCode, onClose }) => {
  const user = useLoginUser();
  const open = exceptBizCode !== null;
  const [pickOpen, setPickOpen] = useState(false);

  const crud = useGridCrud<ExceptBiz>({
    idField: 'exceptBizId',
    // retrieve() L137-150: 서비스 emp.Emp33_ExceptBiz.selectByExceptBizCode(companyId, exceptBizCode)
    search: useCallback(() => (exceptBizCode ? empExceptBizApi.searchExceptBiz(exceptBizCode) : Promise.resolve([])), [exceptBizCode]),
    // update() L152-167: GridUpdate → emp.Emp33_ExceptBiz.update
    save: empExceptBizApi.saveExceptBiz,
    // deleteRow() L223-227: GridDeleteData → emp.Emp33_ExceptBiz.delete
    remove: empExceptBizApi.deleteExceptBiz,
    // [E4] deleteButton[삭제].Select (L110) → deleteChk() L198-221: "삭제"/"선택한 사원을 삭제하시겠습니까?"(폭 300) → [E6] msgBox.DialogHide [YES] (L206) → deleteRow()
    deleteConfirm: '선택한 사원을 삭제하시겠습니까?',
    newRow: useCallback(() => ({ companyId: user.companyId, exceptBizCode: exceptBizCode ?? undefined, unvisibleYn: 'false' }), [user.companyId, exceptBizCode]),
    firstEditField: 'startDate',
    // update() L152-167: 수정한 행마다 예외시작일이 없으면 "예외시작일을 입력하세요"
    validate: changed => (changed.some(m => !m.startDate) ? '예외시작일을 입력하세요' : undefined),
  });

  // [E0] 화면 열림 (생성자 L58-64) → open() L66-89: show(), retrieve()
  useEffect(() => {
    if (open) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] insertButton[등록].Select (L98) → insertRow() L169-196: 사원찾기(Emp00_Lookup_SelectSingle.open(오늘, true, …)) → 고른 사원으로 새 행(사원명 "이름(조직명)", 보고서에서 제거 false)
  const onPick = (emp: TransInfo | null) => {
    setPickOpen(false);
    if (!emp) return;
    crud.addRows([{ personId: emp.personId, personInfo: `${emp.korNm}(${emp.orgKorNm})` }]);
  };

  // [E4] deleteButton[삭제].Select (L110) → deleteChk() L198-221: 고른 내역이 없으면 "삭제할 내역을 선택하세요"
  const deleteChk = () => {
    if ((crud.gridRef.current?.api?.getSelectedRows() ?? []).length === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    crud.deleteChecked();
  };

  // buildGrid() L124-135
  const columnDefs = useMemo(() => [
    gb.text('personInfo', 250, '사원명'),                                                   // L128
    gb.date('startDate', 100, '예외시작일', { editor: 'date' }),                             // L129
    gb.date('closeDate', 100, '예외종료일', { editor: 'date' }),                             // L130
    gb.textArea('reason', 350, '예외사유', { editor: 'largeText' }),                         // L131
    gb.boolean('unvisibleYn', 250, "보고서에서 제거<br>(미체크시 '해당없음'으로 표시됨)", { editable: true }),  // L132
  ], []);

  return (
    <>
      <Modal
        open={open}
        title="예외사원 등록"
        width={1200}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] cancelButton[닫기].Select (L116) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 450, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
          <Space>
            {/* [E1] retrieveButton[조회].Select (L92) → retrieve() */}
            <Button type="search" onClick={crud.retrieve}>조회</Button>
            <Button type="register" onClick={() => setPickOpen(true)}>등록</Button>
            {/* [E3] updateButton[저장].Select (L104) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<ExceptBiz> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
          </div>
        </div>
      </Modal>
      <Emp00_Lookup_SelectSingle open={pickOpen} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickOpen(false)} />
    </>
  );
};
