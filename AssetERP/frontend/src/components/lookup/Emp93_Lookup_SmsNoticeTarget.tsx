/**
 * 알림수신인 설정 조회창 — Bbs11_Tab_ApplicationMng(#1332)·Flt10_Tab_PreApprove의 [알림수신인 설정]이 연다 (여러 도메인이 쓰는 조회창).
 * AS-IS: myApp/client/vi/emp/Emp93_Lookup_SmsNoticeTarget.java (203줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * 생성자 L59-84: 모달 600×500 "알림설정", 툴바([조회][등록][저장][삭제]) + 체크박스 다중 셀 편집 그리드(사원 250 · 비고 250 편집) + [닫기]
 * open(smsNoticeCode) L54-57: 알림구분 코드를 받아 바로 조회 (Bbs11 "B03" · Flt10_Tab_PreApprove "B01")
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { empSmsNoticeTargetApi } from '@/api/emp';
import { SmsNoticeTarget, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

const gb = gbFor<SmsNoticeTarget>();

/** buildGrid() L119-125 */
const buildGrid = () => [
  gb.text('personInfo', 250, '사원'),  // L122 SQL 계산 컬럼
  gb.text('note', 250, '비고', { editor: 'text' }),  // L123
];

interface Props {
  /** open(smsNoticeCode): 값이 있으면 열림 — SmsNoticeCode 코드(B01 사전신고·B03 기타신청서 등) */
  smsNoticeCode: string | null;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Emp93_Lookup_SmsNoticeTarget: React.FC<Props> = ({ smsNoticeCode, onClose }) => {
  const [empOpen, setEmpOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<SmsNoticeTarget>({
    idField: 'smsNoticeTargetId',
    // retrieve() L127-139: emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode(companyId, smsNoticeCode)
    search: useCallback(() => (smsNoticeCode ? empSmsNoticeTargetApi.search(smsNoticeCode) : Promise.resolve([])), [smsNoticeCode]),
    // update() L141-145: emp.Emp93_SmsNoticeTarget.update (GridUpdate)
    save: rows => empSmsNoticeTargetApi.save(rows),
    // deleteRow() L194-198: emp.Emp93_SmsNoticeTarget.delete(체크된 행 목록)
    remove: ids => empSmsNoticeTargetApi.remove(ids),
    newRow: () => ({ smsNoticeCd: smsNoticeCode ?? '' }),
    // deleteChk() L174-192: "{n}건을 삭제하시겠습니까?"
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });

  // [E0] 화면 열림 (open L54-57) → retrieve()
  useEffect(() => {
    if (smsNoticeCode) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smsNoticeCode]);

  // [E2] insertButton[등록].Select (L93) → insertRow() L147-172: Emp00_Lookup_SelectMulti(오늘, 겸직 포함) → 고른 사원마다 새 행
  const insertRows = (list: TransInfo[]) => {
    setEmpOpen(false);
    if (list.length === 0) return;
    // 이미 목록에 있는 사원도 원본은 그대로 행을 더한다(막지 않는다)
    crud.addRows(list.map(m => ({
      personId: m.personId,
      smsNoticeCd: smsNoticeCode ?? '',
      // L165: 이름 + " (" + 조직 이름 + ")"
      personInfo: `${m.korNm ?? ''} (${m.orgKorNm ?? ''})`,
      note: null,
    })), true);
  };

  return (
    <>
      {/* 열 폭 합계 250+250 = 500 + 행번호·체크 60 + 여백 130 = 690 (03 원칙 21, AS-IS 600보다 작지 않게) */}
      <LookupModal open={smsNoticeCode != null} title="알림설정" width={690} maskClosable={false} onCancel={onClose} destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] cancelButton[닫기].Select (L111) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* [E1] retrieveButton[조회].Select (L87) → retrieve() */}
            <Button type="search" onClick={() => void crud.retrieve()}>조회</Button>
            {/* [E2] insertButton[등록].Select (L93) → insertRow() */}
            <Button type="register" onClick={() => setEmpOpen(true)}>등록</Button>
            {/* [E3] updateButton[저장].Select (L99) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] deleteButton[삭제].Select (L105) → deleteChk() → [E6] msgBox [YES] (L177) → deleteRow() */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* setChecked(MULTI) — 삭제·저장용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
            <CellEditGrid<SmsNoticeTarget> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} withAddTitle onResult={insertRows} onClose={() => setEmpOpen(false)} />
    </>
  );
};
