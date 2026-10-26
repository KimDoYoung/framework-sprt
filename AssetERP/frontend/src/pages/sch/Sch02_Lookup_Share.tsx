/**
 * 일정알림 공유자 창 (Q04) — 공모주 일정조회(Sch10_Tab_Ipo)의 [일정공유] 아이콘에서 연다
 * AS-IS: myApp/client/vi/sch/Sch02_Lookup_Share.java (338줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L148-178, ButtonSetting L89-135): 모달 580×450 "일정알림 공유자" 위 툴바 50(라디오 직원·부서 · [행 추가][행 삭제] · 새로고침 아이콘 · [알람설정])
 *   + 그리드 체크 다중(구분 70 가운데 · 부서 250 · 성명 100 가운데), 아래 가운데 [저장][닫기]
 * 삭제(deleteRow L304-310)는 그리드에서만 빼 두었다가 [저장]에서 먼저 지운 뒤 저장한다(update L248-283) — 저장이 끝나면 "저장이 완료되었습니다"(updateEnd L285-302)
 *   + 일정공유 문구(sch.Sch02_Share.selectShareInto)를 부르는 쪽에 돌려준다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message, Radio } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch02Share } from '@/types/sch';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { Sch06_Lookup_AlarmSetup } from '@/components/lookup/Sch06_Lookup_AlarmSetup';

const gb = gbFor<Sch02Share>();

/** grid() L137-146 (setChecked MULTI) */
const COLUMNS = [
  gb.textCenter('shareName', 70, '구분'),  // L141
  gb.text('orgName', 250, '부서'),         // L142
  gb.textCenter('personName', 100, '성명'),  // L143
];

interface Props {
  /** open(infoId, callbackResult) L78 — 공모주 일정 ID가 있으면 열린다 */
  ipoId: number | null;
  /** callbackResult.execute(일정공유 문구) — 저장이 끝난 뒤 */
  onSaved?: (shareInfo: string) => void;
  onClose: () => void;
}

export const Sch02_Lookup_Share: React.FC<Props> = ({ ipoId, onSaved, onClose }) => {
  const ipoRef = useRef<number | null>(ipoId);
  ipoRef.current = ipoId;
  /** deleteList — 그리드에서 뺀 저장된 공유 id. [저장]에서 지운다 */
  const deleteList = useRef<number[]>([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const [kind, setKind] = useState<'emp' | 'org'>('emp');  // radio01 직원(기본) / radio02 부서
  const [orgOpen, setOrgOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);

  const crud = useGridCrud<Sch02Share>({
    idField: 'shareId',
    // retrieve() L312-323: sch.Sch02_Share.selectByInfoId3(infoId, companyId)
    search: useCallback(() => (ipoRef.current == null ? Promise.resolve([]) : schApi.searchIpoShares(ipoRef.current)), []),
    save: useCallback((rows: Sch02Share[]) => schApi.saveIpoShares(ipoRef.current as number, rows), []),
    remove: useCallback((ids: number[]) => schApi.deleteIpoShares(ipoRef.current as number, ids), []),
    newRow: () => ({}),
    deleteConfirm: false,
  });
  const { retrieve } = crud;

  const reset = () => {
    deleteList.current = [];
    setDeleteCount(0);
  };

  // [E0] 화면 열림 (생성자 L148-178, open L83-87) → ButtonSetting(), retrieve()
  useEffect(() => {
    if (ipoId == null) return;
    reset();
    setKind('emp');
    void retrieve();
  }, [ipoId, retrieve]);

  // [E1] anchor.MouseDown (L92) → retrieve() L312-323: deleteList를 비우고 다시 읽는다
  const reload = () => {
    reset();
    void retrieve();
  };

  // [E2] insertButton[행 추가].Select (L106) → insertRow() L238-246: 직원 라디오면 openLookupEmpInfo(), 부서면 openLookupOrgInfo()
  const insertRow = () => (kind === 'emp' ? setEmpOpen(true) : setOrgOpen(true));

  // openLookupOrgInfo() L180-206: Org00_Lookup_SelectMulti(오늘) → 고른 조직마다 새 행(구분 "부서"·shareCode "2")을 변경으로
  const openLookupOrgInfo = (orgs: OrgInfo[]) => {
    if (orgs.length === 0) return;
    crud.addRows(orgs.map(o => ({ shareCode: '2', shareName: '부서', infoId: ipoId, orgId: o.orgCodeId, orgName: o.parentFullNm })), true);
  };

  // openLookupEmpInfo() L208-236: Emp00_Lookup_SelectMulti(오늘) → 고른 직원마다 새 행(구분 "직원"·shareCode "1")을 변경으로
  const openLookupEmpInfo = (list: TransInfo[]) => {
    if (list.length === 0) return;
    crud.addRows(list.map(t => ({ shareCode: '1', shareName: '직원', infoId: ipoId, orgId: t.orgCodeId, orgName: t.parentFullNm, personId: t.personId, personName: t.korNm })), true);
  };

  // [E3] deleteButton[행 삭제].Select (L112) → deleteRow() L304-310: 고른 행을 deleteList에 모으고 그리드에서 뺀다(확인 없음)
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    const saved = selected.map(r => r.shareId).filter(id => id > 0);
    deleteList.current.push(...saved);
    setDeleteCount(deleteList.current.length);
    crud.removeRows(selected.map(r => r.shareId));
  };

  // [E5] updateButton[저장].Select (L155) → update() L248-283: 모은 삭제(sch.Sch02_Share.delete) → sch.Sch02_Share.update → updateEnd() L285-302
  const update = async () => {
    const id = ipoRef.current;
    if (id == null) return;
    if (deleteList.current.length === 0 && !crud.hasChanges()) {
      message.warning('변경내역이 없습니다');
      return;
    }
    try {
      if (deleteList.current.length > 0) {
        await schApi.deleteIpoShares(id, deleteList.current);
        reset();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      return;
    }
    await crud.saveRows();
    if (crud.hasChanges()) return;  // 저장 실패(saveRows가 메시지를 냈다)
    message.success('저장이 완료되었습니다');
    if (onSaved) {
      try {
        onSaved(await schApi.getIpoShareInfo(id));
      } catch (err) {
        message.error(errorMessage(err, '일정공유 조회 실패'));
      }
    }
    void retrieve();
  };

  return (
    <LookupModal
      open={ipoId != null}
      title="일정알림 공유자"
      width={610}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          {/* [E5] updateButton[저장].Select (L155) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes.added + crud.changes.modified + deleteCount} onClick={update}>저장</Button>
          {/* [E6] closeButton[닫기].Select (L161) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 330 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio.Group value={kind} onChange={e => setKind(e.target.value)}>
            <Radio value="emp">직원</Radio>
            <Radio value="org">부서</Radio>
          </Radio.Group>
          <Button type="addRow" onClick={insertRow}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          <ReloadOutlined style={{ cursor: 'pointer' }} title="새로고침" onMouseDown={reload} />
          {/* [E4] alarmButton[알람설정].Select (L118) → lookupAlarm() L325-332: Sch06_Lookup_AlarmSetup.open("IPO", infoId) */}
          <Button type="view" style={{ marginLeft: 60 }} onClick={() => setAlarmOpen(true)}>알람설정</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch02Share> crud={crud} columnDefs={COLUMNS} />
        </div>
      </div>
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        onSelect={openLookupOrgInfo}
        onClose={() => setOrgOpen(false)}
      />
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={openLookupEmpInfo} onClose={() => setEmpOpen(false)} />
      <Sch06_Lookup_AlarmSetup target={alarmOpen && ipoId != null ? { targetCode: 'IPO', targetId: ipoId } : null} onClose={() => setAlarmOpen(false)} />
    </LookupModal>
  );
};
