/**
 * 4대보험 신고정보 창 — 급여공제정보 #1277·사원정보 관리 #1029 급여공제 폼(Emp35_TabPage_DeductInsert)의 "4대보험 신고정보" 아이콘이 연다
 * AS-IS: myApp/client/vi/pay/Pay31_Popup_InsureApply.java (246줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본 IDMS-IC)
 * 생성자 L71-95: 1000×500 모달 — 위 50(버튼 [조회][등록][저장][삭제]) / 그리드(CellEditGrid) / 아래 [닫기]
 * 4대보험 메뉴(Pay31_Tab_InsureApply S26)와 같은 API(insure-applies)를 쓰고, 조회만 selectByPersonId로 따로 한다
 * UX보강(10): [저장(n)] UX-03
 * AS-IS와 다른 점: 회사는 로그인 회사(원본은 공제 모델의 회사 — 같은 값). 조회 뒤 첫 행 선택은 하지 않는다(CellEditGrid는 체크 선택)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayInsureApply } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useInsureCodes } from './payInsureApplyTab';

const gb = gbFor<PayInsureApply>();

interface Props {
  /** open(deductModel, …)의 사원 ID — 값이 있으면 열린다 */
  personId: number | null;
  onClose: () => void;
}

export const Pay31_Popup_InsureApply: React.FC<Props> = ({ personId, onClose }) => {
  const open = personId != null;
  const insureCodes = useInsureCodes({ kindCd: 'InsureCode' });
  // insureApplyCodeComboBox L143-148: sys.Sys00_Common.selectByKindGroupCode(kindGroupCode "InsureApplyCode003")
  const insureApplyCodes = useInsureCodes({ kindGroupCd: 'InsureApplyCode003' });

  const crud = useGridCrud<PayInsureApply>({
    idField: 'insureApplyId',
    // retrieve() L168-182: pay.Pay31_InsureApply.selectByPersonId(companyId, personId)
    search: useCallback(() => (personId == null ? Promise.resolve([]) : payApi.searchInsureAppliesByPerson(personId)), [personId]),
    // update() L192-221: 모든 행 검사 → GridUpdate pay.Pay31_InsureApply.update
    validate: (_changed, all) => {
      for (const r of all) {
        if (r.insureName == null) return '보험구분은 필수선택 항목입니다';
        if (r.insureApplyName == null) return '신고구분은 필수선택 항목입니다';
        if (r.applyDate == null) return '신고일 필수작성 항목입니다';
        // L213-216 "취득일 필수작성 항목입니다"는 원본도 applyDate를 다시 보므로 여기서 걸리지 않는다(원본 그대로)
      }
      return undefined;
    },
    save: useCallback((rows: PayInsureApply[]) => payApi.saveInsureApplies(rows), []),
    // [E8] messageBox.DialogHide [YES] (L226) → GridDeleteData pay.Pay31_InsureApply.delete
    remove: useCallback((ids: number[]) => payApi.deleteInsureApplies(ids), []),
    // insert() L184-190: 그 사원·회사로 빈 행
    newRow: useCallback(() => ({ personId }), [personId]),
    deleteConfirm: n => `${n}건의 정보를 삭제하시겠습니까?`,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 → open(deductModel) L64-69: retrieve()
  useEffect(() => {
    if (open) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, personId]);

  // buildGrid() L131-166 — 편집기 있는 GridBuilder(체크 없음)
  const columnDefs = useMemo(() => [
    // [E6] insureCodeComboBox[InsureCode].Collapse (L135) → 고른 보험의 코드를 그 행에 넣는다
    gb.textCenter('insureName', 120, '보험구분', {
      editor: 'select',
      values: insureCodes.map(c => c.name),
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.insureName = p.newValue;
        d.insureCode = insureCodes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    // [E7] insureApplyCodeComboBox[selectByKindGroupCode].Collapse (L149) → 고른 신고구분의 코드를 그 행에 넣는다
    gb.textCenter('insureApplyName', 120, '신고구분', {
      editor: 'select',
      values: insureApplyCodes.map(c => c.name),
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.insureApplyName = p.newValue;
        d.insureApplyCode = insureApplyCodes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.date('applyDate', 120, '신고일', { editor: 'date' }),
    gb.date('initDate', 120, '취득일', { editor: 'date' }),
    gb.textCenter('applyMonth', 120, '변경적용월', { editor: 'text' }),
    gb.long('applyMonthPay', 120, '신고보수월액', { editor: 'number' }),
    gb.text('note', 220, '비고', { editor: 'text' }),
  ], [insureCodes, insureApplyCodes]);

  return (
    <LookupModal open={open} title="4대보험 신고정보" width={1000} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select (L122) → callback.execute()(부르는 쪽 빈 콜백), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L98) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {/* [E2] insertButton[등록].Select (L104) → insert() */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E3] updateButton[저장].Select (L110) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L116) → delete(): 확인 "삭제" "n건의 정보를 삭제하시겠습니까?" */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayInsureApply> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
