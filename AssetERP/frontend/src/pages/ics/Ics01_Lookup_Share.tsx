/**
 * 법규 관리그룹 설정 창 (H08) — 법규관리의 관리그룹 아이콘([관리그룹 일괄지정] 포함)이 연다
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_Share.java (260줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L187-198: 모달 550×350 "법규 관리그룹 설정", 라벨 폭 80, 관리그룹 칸(350, 빈칸 "선택하세요") + 공유 그리드(구분 80 가운데 · 부서 250, 높이 200), 아래 가운데 [저장][닫기]
 * 한 법규로 열면(open(Long classTreeId, …)) 그 법규의 관리그룹(없으면 미지정 그룹)과 공유를 읽고, 여러 법규로 열면(open(List, …)) 비어서 열린다.
 */
import React, { useEffect, useState } from 'react';
import { message, Typography } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsLawManage, IcsManager, IcsShare } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Ics02_Lookup_Manager } from '@/components/lookup/Ics02_Lookup_Manager';

const gb = gbFor<IcsShare>();
const COLUMNS = [
  gb.textCenter('shareName', 80, '구분'),  // L180
  gb.text('orgName', 250, '부서'),  // L181
];

/** 열린 대상: 한 법규(id)나 고른 여러 법규 */
export type ShareTarget = { classTreeId: number } | { laws: IcsLawManage[] };

interface Props {
  target: ShareTarget | null;
  /** [저장] = 바뀐 법규관리 행들(relateUpdate 결과), [닫기] = null (AS-IS callbackResult.execute(null)) */
  onResult: (rows: IcsLawManage[] | null) => void;
  onClose: () => void;
}

export const Ics01_Lookup_Share: React.FC<Props> = ({ target, onResult, onClose }) => {
  const [manager, setManager] = useState<IcsManager | null>(null);
  const [shares, setShares] = useState<IcsShare[]>([]);
  const [managerOpen, setManagerOpen] = useState(false);

  // shareRetrieve() L242-251: ics.Ics04_Share.selectByManagerId
  const shareRetrieve = (managerId: number) =>
    icsApi.searchManagerShares(managerId).then(setShares).catch(err => message.error(errorMessage(err, '조회 실패')));

  // open() L62-80 → retrieve() L95-131: 한 법규면 ics.Ics05_RelateManager.selectByClassTreeId, 없으면 ics.Ics02_Manager.getDefaultYn
  useEffect(() => {
    setManager(null);
    setShares([]);
    if (!target || !('classTreeId' in target)) return;
    icsApi.getRelateManager(target.classTreeId)
      .then(m => { setManager(m); return shareRetrieve(m.managerId); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] updateButton[저장].Select (L134) → update() L200-240: ics.Ics05_RelateManager.relateUpdate(managerId, 법규 목록)
  const update = async () => {
    if (!manager) {
      message.warning('관리그룹을 선택하세요');
      return;
    }
    const ids = !target ? [] : 'classTreeId' in target ? [target.classTreeId] : target.laws.map(l => l.classTreeId);
    if (ids.length === 0) {
      message.warning('예외발생(대상 법규정보 미존재) 전산팀에 문의하세요');
      return;
    }
    try {
      const rows = await icsApi.relateManager(manager.managerId, ids);
      onResult(rows);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] closeButton[닫기].Select [callback != null] (L140) → callbackResult.execute(null), hide()
  const close = () => {
    onResult(null);
    onClose();
  };

  return (
    <LookupModal
      open={target != null}
      title="법규 관리그룹 설정"
      width={550}
      maskClosable={false}
      onCancel={close}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="save" onClick={update}>저장</Button>
          <Button type="close" onClick={close}>닫기</Button>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L82-93) → getEditor(), show() */}
      <div style={{ padding: '20px 15px 15px 5px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text strong style={{ width: 80, flex: 'none' }}>관리그룹 </Typography.Text>
          {/* [E3] managerGroupName[관리그룹].TriggerClick (L155) → Ics02_Lookup_Manager.open(): 고른 그룹의 공유를 다시 읽는다 */}
          <LookupInput value={manager?.managerGroupName ?? ''} placeholder="선택하세요" width={350} onOpen={() => setManagerOpen(true)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 15 }}>
          <Typography.Text strong style={{ width: 80, flex: 'none', paddingTop: 4 }}>공유 </Typography.Text>
          <div style={{ flex: 1, height: 200, minWidth: 0 }}>
            <SingleGrid<IcsShare> rowData={shares} columnDefs={COLUMNS} getRowId={p => String(p.data.shareId)} />
          </div>
        </div>
      </div>
      <Ics02_Lookup_Manager
        open={managerOpen}
        onResult={m => { if (m) { setManager(m); void shareRetrieve(m.managerId); } }}
        onClose={() => setManagerOpen(false)}
      />
    </LookupModal>
  );
};
