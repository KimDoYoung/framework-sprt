/**
 * 반복주기 조건 창 (E01-1) — Sch03_Lookup_Ics의 [반복주기조건] 또는 목록의 수정 아이콘(주기 99가 아닌 행)에서 연다. ics·icr 도메인이 쓰는 공통 조회창(IM-02)
 * AS-IS: myApp/client/vi/sch/Sch03_Lookup_Cycle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L61-114·L116-168: 모달 800×400 "반복주기", 탭 6개(일·주·월·분기·반기·년), 아래 "※ 적용기간" 시작일 ~ 종료일, 아래 가운데 [저장][닫기]
 */
import React, { useRef, useState } from 'react';
import { DatePicker, message, Modal, Space, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch03Deadline } from '@/types/sch';
import { Button } from '@/components/button';
import { Sch03_TabPage_Cycle01 } from './Sch03_TabPage_Cycle01';
import { Sch03_TabPage_Cycle02 } from './Sch03_TabPage_Cycle02';
import { Sch03_TabPage_Cycle03 } from './Sch03_TabPage_Cycle03';
import { Sch03_TabPage_Cycle04 } from './Sch03_TabPage_Cycle04';
import { Sch03_TabPage_Cycle05 } from './Sch03_TabPage_Cycle05';
import { Sch03_TabPage_Cycle06 } from './Sch03_TabPage_Cycle06';
import { Sch03TabHandle } from './sch03CycleParts';

const KEYS = ['01', '02', '03', '04', '05', '06'] as const;
type CycleKey = typeof KEYS[number];

interface Props {
  /** new Sch03_Lookup_Cycle(selectModel, …)의 수정할 기한 — 없으면 새 기한 (new Sch03_Lookup_Cycle(classTreeId, …)) */
  deadline?: Sch03Deadline | null;
  /** 기한을 거는 법규 */
  classTreeId: number;
  /** 스케줄 구분 (1 스케줄 / 2 내부통제-반복 / 3 내부통제-수시) */
  scheduleCode: string;
  /** callback.execute(): 저장한 뒤 */
  onSaved: () => void;
  onClose: () => void;
}

export const Sch03_Lookup_Cycle: React.FC<Props> = ({ deadline, classTreeId, scheduleCode, onSaved, onClose }) => {
  const refs = { '01': useRef<Sch03TabHandle>(null), '02': useRef<Sch03TabHandle>(null), '03': useRef<Sch03TabHandle>(null),
    '04': useRef<Sch03TabHandle>(null), '05': useRef<Sch03TabHandle>(null), '06': useRef<Sch03TabHandle>(null) };
  // SetModel() L170-195: 읽어 온 기한의 주기 탭을 연다. getDate() L197-209: 시작일 = 기한의 시작일(없으면 오늘), 종료일 = 기한의 종료일(없으면 2999-12-31)
  const [active, setActive] = useState<CycleKey>(KEYS.includes(deadline?.cycleCode as CycleKey) ? (deadline?.cycleCode as CycleKey) : '01');
  const [startDate, setStartDate] = useState<string | null>(deadline?.startDate ?? dayjs().format('YYYY-MM-DD'));
  const [closeDate, setCloseDate] = useState<string | null>(deadline?.closeDate ?? '2999-12-31');

  // [E0] 화면 열림 (생성자 L61-114) → settings(), getDate(), show(), SetModel()
  // [E1] updateButton[저장].Select (L212) → update() L226-253: 켜진 탭의 getModel() + 회사·법규·스케줄 구분·시작일·종료일 → insertModel() L255-270:
  //   서비스 sch.Sch03_Deadline.insertModel → callback.execute(); hide()
  const update = async () => {
    const patch = refs[active].current?.getModel() ?? {};
    try {
      const { deadlineId: _id, companyId: _c, cycleName: _n, deadlineFullName: _f, ...base } = deadline ?? ({} as Sch03Deadline);
      await schApi.saveDeadline({ ...base, ...patch, deadlineId: deadline?.deadlineId ?? null, infoId: classTreeId, scheduleCode, startDate, closeDate });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const model = deadline ?? null;
  return (
    <Modal
      open
      title="반복주기"
      width={840}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L218) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Tabs
        activeKey={active}
        onChange={k => setActive(k as CycleKey)}
        items={[
          { key: '01', label: '일', forceRender: true, children: <Sch03_TabPage_Cycle01 ref={refs['01']} model={model} /> },
          { key: '02', label: '주', forceRender: true, children: <Sch03_TabPage_Cycle02 ref={refs['02']} model={model} /> },
          { key: '03', label: '월', forceRender: true, children: <Sch03_TabPage_Cycle03 ref={refs['03']} model={model} /> },
          { key: '04', label: '분기', forceRender: true, children: <Sch03_TabPage_Cycle04 ref={refs['04']} model={model} /> },
          { key: '05', label: '반기', forceRender: true, children: <Sch03_TabPage_Cycle05 ref={refs['05']} model={model} /> },
          { key: '06', label: '년', forceRender: true, children: <Sch03_TabPage_Cycle06 ref={refs['06']} model={model} /> },
        ]}
      />
      <div style={{ border: '1px solid #d9d9d9', padding: '10px 15px' }}>
        <Typography.Text strong>※ 적용기간</Typography.Text>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text strong>시작일</Typography.Text>
          <DatePicker style={{ width: 140 }} format="YYYY-MM-DD" value={startDate ? dayjs(startDate) : null} onChange={d => setStartDate(d ? d.format('YYYY-MM-DD') : null)} />
          <span>~</span>
          <Typography.Text strong>종료일</Typography.Text>
          <DatePicker style={{ width: 140 }} format="YYYY-MM-DD" value={closeDate ? dayjs(closeDate) : null} onChange={d => setCloseDate(d ? d.format('YYYY-MM-DD') : null)} />
        </div>
      </div>
    </Modal>
  );
};
