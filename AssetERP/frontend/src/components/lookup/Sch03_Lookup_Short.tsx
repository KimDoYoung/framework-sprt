/**
 * 수시 조건 창 (E01-1) — Sch03_Lookup_Ics의 [일회성조건] 또는 목록의 수정 아이콘(주기 99)에서 연다. ics·icr 도메인이 쓰는 공통 조회창(IM-02)
 * AS-IS: myApp/client/vi/sch/Sch03_Lookup_Short.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L42-67·L73-97: 모달 400×300 "수시", 탭 하나("수시" = Sch03_TabPage_Short99), 아래 가운데 [저장][닫기]
 */
import React, { useRef } from 'react';
import { message, Space, Tabs } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch03Deadline } from '@/types/sch';
import { Button } from '@/components/button';
import { Sch03_TabPage_Short99 } from './Sch03_TabPage_Short99';
import { Sch03TabHandle } from './sch03CycleParts';

interface Props {
  /** new Sch03_Lookup_Short(selectModel, …)의 수정할 기한 — 없으면 새 기한 (new Sch03_Lookup_Short(classTreeId, …)) */
  deadline?: Sch03Deadline | null;
  /** 기한을 거는 법규 */
  classTreeId: number;
  /** 스케줄 구분 (1 스케줄 / 2 내부통제-반복 / 3 내부통제-수시) */
  scheduleCode: string;
  /** callback.execute(): 저장한 뒤 */
  onSaved: () => void;
  onClose: () => void;
}

export const Sch03_Lookup_Short: React.FC<Props> = ({ deadline, classTreeId, scheduleCode, onSaved, onClose }) => {
  const tab = useRef<Sch03TabHandle>(null);

  // [E0] 화면 열림 (생성자 L42-67) → Settings(), show(), SetModel()
  // [E1] updateButton[저장].Select (L102) → update() L116-130: 계산구분 "01"인데 일자가 없으면 "일자를 선택하세요"
  //   → 회사·법규·스케줄 구분을 넣어 insertModel() L132-147: 서비스 sch.Sch03_Deadline.insertModel → callback.execute(); hide()
  const update = async () => {
    const patch = tab.current?.getModel() ?? {};
    if (patch.cycleCalcType === '01' && !patch.fixDate) {
      message.warning('일자를 선택하세요');
      return;
    }
    try {
      const { deadlineId: _id, companyId: _c, cycleName: _n, deadlineFullName: _f, ...base } = deadline ?? ({} as Sch03Deadline);
      await schApi.saveDeadline({ ...base, ...patch, deadlineId: deadline?.deadlineId ?? null, infoId: classTreeId, scheduleCode });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open
      title="수시"
      width={440}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L108) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Tabs items={[{ key: '99', label: '수시', children: <Sch03_TabPage_Short99 ref={tab} model={deadline} scheduleCode={scheduleCode} /> }]} />
    </LookupModal>
  );
};
