/**
 * 직책 연결 창 (N07) — 회의체 등록 그리드의 연결직책 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm22_Lookup_RoleRelateCncl2.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 650×400(원본) → 열 합계(250+100+100+100+행번호·선택 60+여백 130) 기준 740: 툴바([행 추가][행 삭제] + 새로고침 아이콘) + CellEditGrid(체크) + [저장][닫기]
 * 행 삭제는 화면에서만 빼 두었다가(deleteList) [저장]에서 서버에서 지운다 (update() L237-316: 저장 → 삭제 순서)
 * UX보강(10): 조회창(UX-05·06은 Tdm20 안에서), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { tdmApi } from '@/api/tdm';
import { TdmCouncilRole } from '@/types/tdm';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Tdm20_Lookup_SelectMulti } from './Tdm20_Lookup_SelectMulti';

const gb = gbFor<TdmCouncilRole>();

/** buildGrid() L156-178 (setChecked MULTI) — 역할은 콤보(TdmCnclMemberType), 사용시작일·종료일은 날짜 입력 */
const buildGrid = (memberCodes: Code[]) => [
  gb.text('roleName', 250, '직책'),  // L170
  gb.textCenter('memberTypeName', 100, '역할', {  // L171 (ValueChange L159-166: 이름과 코드를 함께 바꾼다)
    editor: 'select',
    values: memberCodes.map(c => c.name),
    valueSetter: p => {
      p.data.memberTypeName = p.newValue;
      p.data.memberType = memberCodes.find(c => c.name === p.newValue)?.code ?? p.data.memberType;
      return true;
    },
  }),
  gb.date('startDate', 100, '사용시작일', { editor: 'date' }),  // L172
  gb.date('endDate', 100, '사용종료일', { editor: 'date' }),  // L173
];

/** isDateOverlap() L318-338: 종료일이 없으면 무기한 */
const isDateOverlap = (a: TdmCouncilRole, b: TdmCouncilRole): boolean => {
  const start1 = a.startDate ?? '', end1 = a.endDate;
  const start2 = b.startDate ?? '', end2 = b.endDate;
  if (!end1 && !end2) return true;
  if (!end1) return !(start1 > end2!);
  if (!end2) return !(start2 > end1);
  return !(end1 < start2 || start1 > end2);
};

interface Props {
  /** 값이 있으면 열림 — AS-IS open(cnclId, stdDate, callback) */
  cnclId: number | null;
  /** 직책 고르기창의 기준일 (AS-IS stdDate는 조회에 쓰이지 않고 Tdm20이 오늘로 연다 — 여기서도 오늘) */
  /** [닫기] — AS-IS callback.execute(그리드 행 수) 뒤 hide(): 부르는 쪽이 그 행의 연결직책 건수를 바꾼다 */
  onClose: (count: number) => void;
}

export const Tdm22_Lookup_RoleRelateCncl2: React.FC<Props> = ({ cnclId, onClose }) => {
  const [memberCodes, setMemberCodes] = useState<Code[]>([]);
  const [roleLookup, setRoleLookup] = useState(false);
  const deleteList = useRef<number[]>([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const columnDefs = useMemo(() => buildGrid(memberCodes), [memberCodes]);

  const crud = useGridCrud<TdmCouncilRole>({
    idField: 'roleRelateCnclId',
    search: useCallback(async () => (cnclId ? tdmApi.searchCouncilRoles(cnclId) : []), [cnclId]),
    save: useCallback(async (rows: TdmCouncilRole[]) => (cnclId ? tdmApi.saveCouncilRoles(cnclId, rows) : []), [cnclId]),
    remove: useCallback(async () => 0, []),
    newRow: useCallback((): Partial<TdmCouncilRole> => ({ cnclId: cnclId ?? undefined }), [cnclId]),
  });
  const { retrieve: retrieveRows, clear } = crud;

  // retrieve() L180-193: deleteList.clear() 뒤 tdm.Tdm22_RoleRelateCncl.selectByCnclId
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    setDeleteCount(0);
    try {
      await retrieveRows();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [retrieveRows]);

  // [E0] open() L68-91 → setting(), retrieve()
  useEffect(() => {
    if (cnclId) {
      sysApi.searchCodes('TdmCnclMemberType').then(setMemberCodes).catch(() => {});
      void retrieve();
    } else {
      clear();
      deleteList.current = [];
      setDeleteCount(0);
    }
  }, [cnclId]);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] insertButton[행 추가].Select (L107) → insertRow() L195-222: Tdm20_Lookup_SelectMulti → 고른 직책마다 새 행(역할 "(선택하세요)")
  const insertRows = (roles: { roleId: number; roleName: string | null }[]) => {
    crud.addRows(
      roles.map(r => ({ roleId: r.roleId, cnclId: cnclId ?? undefined, roleName: r.roleName, memberType: null, memberTypeName: '(선택하세요)' })),
      true,
    );
  };

  // [E3] deleteButton[행 삭제].Select (L113) → deleteRow() L224-235: 고른 행을 deleteList에 담고 화면에서 뺀다
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    const ids = selected.map(r => r.roleRelateCnclId);
    deleteList.current = [...deleteList.current, ...ids.filter(id => id > 0)];
    setDeleteCount(deleteList.current.length);
    crud.removeRows(ids);
  };

  // [E4] updateButton[저장].Select (L119) → update() L237-316
  const update = async () => {
    if (!cnclId) return;
    const changed = crud.getChanged();
    if (changed.length === 0 && deleteList.current.length === 0) {
      message.warning('변경된 내역이 없습니다');
      return;
    }
    for (const r of changed) {
      if (!r.memberType) { message.warning('역할은 필수선택 항목입니다'); return; }
      if (!r.startDate) { message.warning('사용시작일은 필수입력 항목입니다'); return; }
    }
    // 같은 직책끼리 적용기간이 겹치면 안 된다 (L266-283)
    const all = crud.rows;
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        if (all[i].roleName !== all[j].roleName) continue;
        if (isDateOverlap(all[i], all[j])) {
          message.warning(`적용기간이 겹치는 직책(${all[i].roleName})이 존재합니다.`);
          return;
        }
      }
    }
    try {
      if (changed.length > 0) await tdmApi.saveCouncilRoles(cnclId, changed);
      if (deleteList.current.length > 0) await tdmApi.deleteCouncilRoles(cnclId, deleteList.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    // updateEnd() L340-345: "저장이 완료되었습니다" 뒤 retrieve()
    message.success('저장이 완료되었습니다');
    await retrieve();
  };

  // [E5] closeButton[닫기].Select (L125) → 반영 안 된 변경이 있으면 확인(E6) 뒤 callback.execute(행 수) + hide()
  const close = () => {
    if (deleteList.current.length > 0 || crud.hasChanges()) {
      Modal.confirm({
        title: '확인',
        content: '반영되지 않은 변경사항이 존재합니다. 그냥 닫으시겠습니까?',
        width: 450,
        // [E6] msgBox.DialogHide [YES] (L131) → callback.execute(행 수) + hide()
        onOk: () => onClose(crud.rows.length),
      });
    } else {
      onClose(crud.rows.length);
    }
  };

  return (
    <LookupModal
      open={!!cnclId}
      title="직책 연결"
      width={740}
      closable={false}
      maskClosable={false}
      onCancel={close}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + deleteCount }} onClick={update}>저장</Button>
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Button type="addRow" onClick={() => setRoleLookup(true)}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          {/* [E1] anchor.MouseDown (L96) → retrieve() — 새로고침 아이콘 */}
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E7] tdmCnclMemberComboBox[TdmCnclMemberType].ValueChange (L159) → 열의 valueSetter */}
          <CellEditGrid<TdmCouncilRole> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Tdm20_Lookup_SelectMulti open={roleLookup} onSelect={insertRows} onClose={() => setRoleLookup(false)} />
    </LookupModal>
  );
};
