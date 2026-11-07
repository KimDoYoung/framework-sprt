/**
 * 알림설정 창 — 문자 & 메일 (EE63) — 기본설정(MySetting)의 [문자 & 메일 알림설정]이 연다. 항목별로 앱·문자·메일 수신 여부를 내가 정한다
 * AS-IS: myApp/client/vi/emp/Emp92_Lookup_SmsNotice.java (144줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-87: 540×450, 머리말 "알림설정", 오른쪽 정렬 [새로고침] + 셀 편집 그리드(체크 열) + 푸터 [저장][닫기]
 * buildGrid() L89-98: 항목 300 · 앱 60 · 문자 60 · 메일 60 (불리언 편집)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { empSmsNoticeApi } from '@/api/emp';
import { SmsNotice } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<SmsNotice>();

/** buildGrid() L89-98 */
const buildGrid = () => [
  gb.text('smsNoticeName', 300, '항목'),
  gb.boolean('talkNoticeYn', 60, '앱', { editable: true }),
  gb.boolean('smsNoticeYn', 60, '문자', { editable: true }),
  gb.boolean('mailNoticeYn', 60, '메일', { editable: true }),
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp92_Lookup_SmsNotice: React.FC<Props> = ({ open, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<SmsNotice>({
    idField: 'smsNoticeId',
    // retrieve() L100-112 — emp.Emp92_SmsNotice.selectByPersonId
    search: useCallback(() => empSmsNoticeApi.search(), []),
    // update() L114-140 — emp.Emp92_SmsNotice.updateList (바뀐 행만), 저장 뒤 retrieve()
    save: rows => empSmsNoticeApi.save(rows),
    remove: async () => 0,
    newRow: () => ({}),
    reloadAfterSave: true,
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // [E0] 열림 (생성자 L65-87) → show(), retrieve()
  useEffect(() => {
    if (open) void crudRetrieve();
  }, [open, crudRetrieve]);

  return (
    <LookupModal
      open={open}
      title="알림설정"
      width={650}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
          {/* [E2] updateButton[저장].Select (L51) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E3] closeButton[닫기].Select (L57) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* [E1] retrieveButton[새로고침].Select (L45) → retrieve() */}
          <Button type="search" onClick={() => void crud.retrieve()}>새로고침</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<SmsNotice> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
