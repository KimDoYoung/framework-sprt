/**
 * 예외사원 (J09) — Flt01_Tab_CompanyStd의 [예외사원]에서 연다. 정기보고 매매등록 시작일을 사원별로 따로 관리한다.
 * AS-IS: myApp/client/vi/flt/Flt16_Lookup_ExceptPerson.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L56-84: 모달 910×550 "예외사원 : 정기보고 매매등록 시작일 별도 관리", 툴바(조회 · 등록 · 저장 · 삭제) + 셀 편집 그리드(체크박스 다중) + 하단 [닫기].
 * [등록]은 사원찾기(Emp00_Lookup_SelectSingle, 널 단추 "선택안함")에서 고른 사원으로 새 행을 만든다(사원명·부서명은 읽기 전용).
 * UX보강(10): 툴바 = SearchBar(UX-01, 조건 없음), 저장 = 저장(n)(UX-03), 조회창 UX-05, 날짜 편집 열 120(UX-08)
 */
import React, { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { FltExceptPerson } from '@/types/flt';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<FltExceptPerson>();

/** update() L192-218: 바뀐 행마다 매매등록 시작일자 → 예외사유 순으로 검사한다 */
const validate = (changed: FltExceptPerson[]): string | undefined => {
  for (const m of changed) {
    if (!m.rptStartDate) return '매매등록 시작일자를 입력하세요';
    if (!m.reason) return '예외사유를 입력하세요';
  }
  return undefined;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Flt16_Lookup_ExceptPerson: React.FC<Props> = ({ open, onClose }) => {
  const user = useLoginUser();
  const [pickOpen, setPickOpen] = useState(false);

  const crud = useGridCrud<FltExceptPerson>({
    idField: 'exceptPersonId',
    // retrieve() L151-163: 로그인 회사 → flt.Flt16_ExceptPerson.selectByCompanyId
    search: useCallback(() => fltApi.searchExceptPersons(), []),
    // update() L192-218: GridUpdate → flt.Flt16_ExceptPerson.update (사원 중복은 서버가 막는다)
    save: useCallback((rows: FltExceptPerson[]) => fltApi.updateExceptPersons(rows), []),
    // delete() L220-224: GridDeleteData → flt.Flt16_ExceptPerson.delete
    remove: useCallback((ids: number[]) => fltApi.deleteExceptPersons(ids), []),
    // [E4] deleteButton[삭제].Select (L99): "삭제"/"n건을 삭제하시겠습니까?"(폭 300) → [E5] msgBox.DialogHide [YES] (L114) → delete()
    deleteConfirm: (n: number) => `${n}건을 삭제하시겠습니까?`,
    // insertRow() L165-190: 회사 = 로그인 회사, 사원 = 사원찾기에서 고른 사원
    newRow: useCallback(() => ({ companyId: user.companyId }), [user.companyId]),
    validate,
  });

  // 화면 열림 (open() L56-84) → show(), retrieve() — 원본 이벤트 목록에는 없다
  React.useEffect(() => {
    if (open) void crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L139-149
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 100, '사원명'),  // L143
    gb.text('orgName', 200, '부서명'),  // L144
    gb.date('rptStartDate', 120, '매매등록<br>시작일자', { editor: 'date' }),  // L145 (원본 100 → 편집 날짜 120, UX-08)
    gb.text('reason', 300, '예외사유', { editor: 'text' }),  // L146
  ], []);

  // [E2] insertButton[등록].Select (L93) → insertRow() L165-190: 사원찾기(openNull) → 고른 사원으로 새 행(사원명·부서명 채움), 널 단추면 아무것도 안 한다
  const onPick = (emp: TransInfo | null) => {
    setPickOpen(false);
    if (!emp) return;
    // 같은 사원이 이미 목록에 있어도 AS-IS는 저장할 때 서버가 막는다 — 여기서는 그대로 행을 넣는다
    crud.addRows([{ personId: emp.personId, personName: emp.korNm, orgName: emp.orgKorNm }]);
  };

  // [E4] deleteButton[삭제].Select (L99): 선택이 없으면 알린다
  const deleteRows = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <>
      <LookupModal
        open={open}
        title="예외사원 : 정기보고 매매등록 시작일 별도 관리"
        width={910}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E6] cancelButton[닫기].Select (L131) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L87) → retrieve() */}
          <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
            <Button type="register" onClick={() => setPickOpen(true)}>등록</Button>
            {/* [E3] updateButton[저장].Select (L99) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRows}>삭제</Button>
          </>} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<FltExceptPerson> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectSingle open={open && pickOpen} separateAddTitle noneLabel="선택안함" transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickOpen(false)} />
    </>
  );
};
