/**
 * 내규 관리그룹 설정 창 (H09) — 내규관리의 관리그룹 아이콘(Icr01_Grid_IcrType.managerList)이 연다
 * AS-IS: myApp/client/vi/icr/Icr01_Lookup_Share.java (210줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L162-173: 모달 550×350 "내규 관리그룹 설정", 라벨 폭 80, 관리그룹 칸(350) + 공유 그리드(구분 80 가운데 · 부서 250, 높이 200), 아래 가운데 [저장][닫기].
 *   담당자(personName) 줄은 원본에서 주석 처리돼 화면에 없다. 열리면 그 내규의 관리그룹(없으면 미지정 그룹)과 공유를 읽는다.
 *   관리그룹 칸의 조회창 Icr02_Lookup_Manager는 법규의 Ics02_Lookup_Manager와 같은 SQL·화면이라 그 부품을 쓴다([전체] 없음)
 */
import React, { useEffect, useState } from 'react';
import { message, Typography } from 'antd';
import { icsApi } from '@/api/ics';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcsManager, IcsShare } from '@/types/ics';
import { IcrRule } from '@/types/icr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Ics02_Lookup_Manager } from '@/components/lookup/Ics02_Lookup_Manager';

const gb = gbFor<IcsShare>();
const COLUMNS = [
  gb.textCenter('shareName', 80, '구분'),  // L155
  gb.text('orgName', 250, '부서'),  // L156
];

interface Props {
  /** open(classTreeId, callback) L54-61 — 값이 있으면 그 내규의 관리그룹·공유를 읽고 열린다 */
  classTreeId: number | null;
  /** [저장] = 바뀐 내규 행(relateUpdate 결과), [닫기] = null (callback.execute() — 부른 쪽이 그 행을 다시 읽는다) */
  onResult: (row: IcrRule | null) => void;
  onClose: () => void;
}

export const Icr01_Lookup_Share: React.FC<Props> = ({ classTreeId, onResult, onClose }) => {
  const [manager, setManager] = useState<IcsManager | null>(null);
  const [shares, setShares] = useState<IcsShare[]>([]);
  const [managerOpen, setManagerOpen] = useState(false);

  // shareRetrieve() L191-201: ics.Ics04_Share.selectByManagerId
  const shareRetrieve = (managerId: number) =>
    icsApi.searchManagerShares(managerId).then(setShares).catch(err => message.error(errorMessage(err, '조회 실패')));

  // [E0] 화면 열림 (생성자 L63-74) → open() → retrieve() L76-112: icr.Icr05_RelateManager.selectByClassTreeId, 없으면 ics.Ics02_Manager.getDefaultYn
  useEffect(() => {
    setManager(null);
    setShares([]);
    if (classTreeId == null) return;
    icrApi.getRelateManager(classTreeId)
      .then(m => { setManager(m); return shareRetrieve(m.managerId); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] updateButton[저장].Select (L115) → update() L175-189: icr.Icr05_RelateManager.relateUpdate(icrClassTreeId, managerId) → callback.execute(); hide()
  const update = async () => {
    if (classTreeId == null || !manager) return;
    try {
      onResult(await icrApi.relateManager(manager.managerId, classTreeId));
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] closeButton[닫기].Select (L121) → callback.execute(); hide()
  const close = () => {
    onResult(null);
    onClose();
  };

  return (
    <LookupModal
      open={classTreeId != null}
      title="내규 관리그룹 설정"
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
      <div style={{ padding: '20px 15px 15px 5px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text strong style={{ width: 80, flex: 'none' }}>관리그룹 </Typography.Text>
          {/* [E3] managerGroupName[관리그룹].TriggerClick (L130) → Icr02_Lookup_Manager.open(): 고른 그룹의 공유를 다시 읽는다 */}
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
