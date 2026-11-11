/**
 * 특정알림 수신인 탭 — Emp93_Lookup_SmsNoticeTargetList(특정알림 설정 창)의 오른쪽 목록 (EE65)
 * AS-IS: myApp/client/vi/emp/Emp93_Tabpage_SmsNoticeTargetList.java (180줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L48-64: 툴바 [조회][등록][저장][삭제] + 체크박스 다중 셀 편집 그리드(사원 250 · 비고 250 편집)
 * 구분(smsNoticeCode)은 왼쪽 목록에서 하나를 고르면 들어온다. 고른 게 없으면(null) 등록할 때 "좌측 구분값을 선택해주세요"
 * 같은 조회·저장·삭제 API 는 EE44 알림수신인 설정(Emp93_Lookup_SmsNoticeTarget)과 같다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { empSmsNoticeTargetApi } from '@/api/emp';
import { SmsNoticeTarget, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

const gb = gbFor<SmsNoticeTarget>();

/** buildGrid() L93-99 */
const buildGrid = () => [
  gb.text('personInfo', 250, '사원'),  // L96 SQL 계산 컬럼
  gb.text('note', 250, '비고', { editor: 'text' }),  // L97
];

interface Props {
  /** retrieve(smsNoticeCode) L101 — 왼쪽에서 고른 구분 코드. 없으면 null(빈 목록) */
  smsNoticeCode: string | null;
}

export const Emp93_Tabpage_SmsNoticeTargetList: React.FC<Props> = ({ smsNoticeCode }) => {
  const [empOpen, setEmpOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<SmsNoticeTarget>({
    idField: 'smsNoticeTargetId',
    // retrieve() L101-114: emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode(companyId, smsNoticeCode)
    search: useCallback(() => (smsNoticeCode ? empSmsNoticeTargetApi.search(smsNoticeCode) : Promise.resolve([])), [smsNoticeCode]),
    // update() L116-120: emp.Emp93_SmsNoticeTarget.update (GridUpdate)
    save: rows => empSmsNoticeTargetApi.save(rows),
    // deleteRow() L175-179: emp.Emp93_SmsNoticeTarget.delete(체크된 행 목록)
    remove: ids => empSmsNoticeTargetApi.remove(ids),
    newRow: () => ({ smsNoticeCd: smsNoticeCode ?? '' }),
    // deleteChk() L155-173: "{n}건을 삭제하시겠습니까?"
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // 왼쪽 구분이 바뀔 때마다 retrieve(smsNoticeCode) (부모 grid RowClick L87-96)
  useEffect(() => {
    void crudRetrieve();
  }, [smsNoticeCode, crudRetrieve]);

  // [E2] insertButton[등록].Select (L73) → insertRow() L122-153: 구분이 없으면 안내, 있으면 Emp00_Lookup_SelectMulti(오늘, 겸직 포함) → 고른 사원마다 새 행
  const insertRow = () => {
    if (!smsNoticeCode) {
      message.info('좌측 구분값을 선택해주세요');
      return;
    }
    setEmpOpen(true);
  };
  const insertRows = (list: TransInfo[]) => {
    setEmpOpen(false);
    if (list.length === 0) return;
    crud.addRows(list.map(m => ({
      personId: m.personId,
      smsNoticeCd: smsNoticeCode ?? '',
      // L146: 이름 + " (" + 조직 이름 + ")"
      personInfo: `${m.korNm ?? ''} (${m.orgKorNm ?? ''})`,
      note: null,
    })), true);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L67) → retrieve(smsNoticeCode) */}
        <Button type="search" onClick={() => void crud.retrieve()}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L79) → update() */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L85) → deleteChk() → [YES] deleteRow() */}
        <Button type="delete" disabled={!crud.hasChecked} onClick={crud.deleteChecked}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* setChecked(MULTI) — 삭제·저장용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
        <CellEditGrid<SmsNoticeTarget> crud={crud} columnDefs={columnDefs} />
      </div>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} withAddTitle onResult={insertRows} onClose={() => setEmpOpen(false)} />
    </div>
  );
};
