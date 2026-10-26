/**
 * 담당자 변경 처리 창 (O01) — Sch01_Lookup_ManagerModi의 [변경]에서 연다
 * AS-IS: myApp/client/vi/sch/Sch01_Lookup_ManagerModiRun.java (223줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 변경 전 담당자(읽기 전용 100) · 변경 후 담당자(사원 조회창 트리거 100, 빈 문구 "선택하세요") · 처리구분 라디오 이동(기본)/복사, 아래 가운데 [변경하기][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, Modal, Radio, message } from 'antd';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch01InfoManager } from '@/types/sch';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

export interface ManagerModiRunTarget {
  /** open(managerId, managerName, selectList, callback) L99-105 — 변경 전 담당자 */
  managerId: number;
  managerName: string;
  /** 변경할 일정들 */
  infos: Sch01InfoManager[];
}

interface Props {
  /** 값이 있으면 열린다 */
  target: ManagerModiRunTarget | null;
  /** closeButton[닫기]의 callback.execute() — 부른 쪽이 목록을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const Sch01_Lookup_ManagerModiRun: React.FC<Props> = ({ target, onClosed, onClose }) => {
  const [procType, setProcType] = useState<'MOVE' | 'COPY'>('MOVE');
  const [aftManager, setAftManager] = useState<{ id: number; name: string } | null>(null);
  const [lookupEmp, setLookupEmp] = useState(false);

  // [E0] 화면 열림 (생성자 → open() L99-105) → settings() L107-148: moveRadio = true, aftManagerId = null
  useEffect(() => {
    if (target) {
      setProcType('MOVE');
      setAftManager(null);
    }
  }, [target]);

  // [E1] aftManagerName[변경 후 담당자].TriggerClick (L125) → openLookupManagerInfo() L150-160: Emp00_Lookup_SelectSingle.open(오늘, callback)
  const onEmpResult = (row: TransInfo | null) => {
    setLookupEmp(false);
    if (row) setAftManager({ id: row.personId, name: row.korNm ?? '' });
  };

  // [E2] updateButton[변경하기].Select (L132) → preUpdate() L162-179 → [E4] messageBox.DialogHide [YES] (L169) → update() L181-212
  const preUpdate = () => {
    if (!aftManager) {
      message.warning('변경 후 담당자를 선택하세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '담당자 변경 처리를 하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await schApi.copyInfos(aftManager.id, procType, (target?.infos ?? []).map(i => i.infoId));
          message.success('변경이 완료되었습니다.');
        } catch (err) {
          message.warning(errorMessage(err, '처리중 오류발생'));
        }
      },
    });
  };

  return (
    <>
      <LookupModal
        open={target != null}
        title="담당자 변경 처리"
        width={460}
        maskClosable={false}
        onCancel={onClose}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Button type="assign" onClick={preUpdate}>변경하기</Button>
            {/* [E3] closeButton[닫기].Select [callback != null] (L139) → callback.execute(); hide() */}
            <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
          </div>
        )}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 14, alignItems: 'center', padding: '10px 0' }}>
          <span>변경 전 담당자</span>
          <Input readOnly style={{ width: 100 }} value={target?.managerName ?? ''} />
          <span>변경 후 담당자</span>
          <LookupInput width={100} value={aftManager?.name ?? ''} placeholder="선택하세요" onOpen={() => setLookupEmp(true)} />
          <span>처리구분</span>
          <Radio.Group value={procType} onChange={e => setProcType(e.target.value)}>
            <Radio value="MOVE">이동</Radio>
            <Radio value="COPY">복사</Radio>
          </Radio.Group>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectSingle open={lookupEmp && target != null} transDate={today()} noneLabel={null} onResult={onEmpResult} onClose={() => setLookupEmp(false)} />
    </>
  );
};
