/**
 * 알림설정 창 — 문자 & 메일 (EE63) — 기본설정(MySetting)의 [문자 & 메일 알림설정]이 연다. 항목별로 앱·문자·메일 수신 여부를 내가 정한다
 * AS-IS: myApp/client/vi/emp/Emp92_Lookup_SmsNotice.java (76줄) + Emp92_TabPage_SmsNotice01·02 — 함수 이름은 원본 메서드 이름 그대로
 * 원본 98d5afdd6(2026-11-11, CH-0275·0276·0278·0313): 한 그리드를 탭 2개로 나눴다 — "필수알림"(M으로 시작하는 코드) · "선택알림"(그 밖)
 * 생성자 L28-46: 545×600, 머리말 "알림설정", 탭(필수알림·선택알림) + 푸터 [저장][닫기]. 탭마다 오른쪽 정렬 [새로고침] + 셀 편집 그리드
 * buildGrid() (TabPage L66-75): 항목 300 · 앱 60 · 문자 60 · 메일 60 (불리언 편집)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo } from 'react';
import { Tabs } from 'antd';
import { empSmsNoticeApi } from '@/api/emp';
import { SmsNotice } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<SmsNotice>();

/** Emp92_TabPage_SmsNotice01·02.buildGrid() L66-75 */
const buildGrid = () => [
  gb.text('smsNoticeName', 300, '항목'),
  gb.boolean('talkNoticeYn', 60, '앱', { editable: true }),
  gb.boolean('smsNoticeYn', 60, '문자', { editable: true }),
  gb.boolean('mailNoticeYn', 60, '메일', { editable: true }),
];

interface TabHandle {
  retrieve: () => Promise<void> | void;
  update: () => Promise<void>;
}

/** Emp92_TabPage_SmsNotice01(type M, 필수) · 02(type T, 선택) */
const SmsNoticeTab = forwardRef<TabHandle, { type: 'M' | 'T' }>(({ type }, ref) => {
  const columnDefs = useMemo(buildGrid, []);
  const crud = useGridCrud<SmsNotice>({
    idField: 'smsNoticeId',
    // retrieve() L77-90 — emp.Emp92_SmsNotice.selectByPersonId(personId, type)
    search: useCallback(() => empSmsNoticeApi.search(type), [type]),
    // update() — emp.Emp92_SmsNotice.updateList (바뀐 행만), 저장 뒤 retrieve()
    save: rows => empSmsNoticeApi.save(rows),
    remove: async () => 0,
    newRow: () => ({}),
    reloadAfterSave: true,
    // 01.update() L106-114: 필수알림은 바뀐 행마다 앱·문자·메일 중 하나는 켜져 있어야 한다(02는 검사 없음)
    validate: type === 'M'
      ? changed => (changed.some(r => !r.talkNoticeYn && !r.smsNoticeYn && !r.mailNoticeYn) ? '필수 알림은 하나 이상의 수신 방법을 선택해야 합니다' : undefined)
      : undefined,
  });
  const { retrieve, saveRows } = crud;
  useImperativeHandle(ref, () => ({ retrieve, update: saveRows }), [retrieve, saveRows]);

  return (
    <div style={{ height: 460, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* retrieveButton[새로고침].Select (L58) → retrieve() */}
        <Button type="search" onClick={() => void retrieve()}>새로고침</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<SmsNotice> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
});
SmsNoticeTab.displayName = 'SmsNoticeTab';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp92_Lookup_SmsNotice: React.FC<Props> = ({ open, onClose }) => {
  const tab01 = React.useRef<TabHandle>(null);
  const tab02 = React.useRef<TabHandle>(null);

  // [E0] open() L23-26 → tab01.retrieve(), tab02.retrieve()
  useEffect(() => {
    if (!open) return;
    void tab01.current?.retrieve();
    void tab02.current?.retrieve();
  }, [open]);

  // update() L63-71: 두 탭 모두 저장 (필수알림 검사에 걸려도 선택알림은 저장한다 — 원본 순서 그대로)
  const update = async () => {
    await tab01.current?.update();
    await tab02.current?.update();
  };

  return (
    <LookupModal
      open={open}
      title="알림설정"
      width={545}
      maskClosable={false}
      forceRender
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
          {/* [E2] updateButton[저장].Select (L49) → update() */}
          <Button type="save" onClick={() => void update()}>저장</Button>
          {/* [E3] closeButton[닫기].Select (L55) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <Tabs
        items={[
          { key: '1', label: '필수알림', forceRender: true, children: <SmsNoticeTab ref={tab01} type="M" /> },
          { key: '2', label: '선택알림', forceRender: true, children: <SmsNoticeTab ref={tab02} type="T" /> },
        ]}
      />
    </LookupModal>
  );
};
