/**
 * 연결회의체 창 (N08) — 직책 그리드의 연결회의체 아이콘·직책 편집창의 [연결회의체(n건)]가 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm22_Lookup_RoleRelateCncl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 650×400(원본) → 열 합계(250+100+100+100+행번호·선택 60+여백 130) 기준 740: 툴바([행 추가][행 삭제] + 새로고침) + CellEditGrid(체크) + [저장][닫기]
 * 회의체 쪽 창(N07 `Tdm22_Lookup_RoleRelateCncl2`)과 열만 다르다(직책 대신 회의체) — 행 삭제는 [저장]에서 서버에서 지운다 (update() L234-312)
 * UX보강(10): 조회창(UX-05·06은 Tdm05 안에서), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { sysApi } from '@/api/sys';
import { tdmApi } from '@/api/tdm';
import { Code } from '@/types/sys';
import { TdmCouncil, TdmRoleCouncil } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm05_Lookup_SelectMulti } from './Tdm05_Lookup_SelectMulti';
import { useDeferredCrud } from './useDeferredCrud';

const gb = gbFor<TdmRoleCouncil>();

/** buildGrid() L154-176 (setChecked MULTI) — 역할은 콤보(TdmCnclMemberType), 사용시작일·종료일은 날짜 입력 */
const buildGrid = (memberCodes: Code[]) => [
  gb.text('cnclName', 250, '회의체'),  // L168
  gb.textCenter('memberTypeName', 100, '역활', {  // L169 (ValueChange L157-164: 이름과 코드를 함께 바꾼다)
    editor: 'select',
    values: memberCodes.map(c => c.name),
    valueSetter: p => {
      p.data.memberTypeName = p.newValue;
      p.data.memberType = memberCodes.find(c => c.name === p.newValue)?.code ?? p.data.memberType;
      return true;
    },
  }),
  gb.date('startDate', 100, '사용시작일', { editor: 'date' }),  // L170
  gb.date('endDate', 100, '사용종료일', { editor: 'date' }),  // L171
];

/** isDateOverlap() L314-334: 종료일이 없으면 무기한 */
const isDateOverlap = (a: TdmRoleCouncil, b: TdmRoleCouncil): boolean => {
  const start1 = a.startDate ?? '', end1 = a.endDate;
  const start2 = b.startDate ?? '', end2 = b.endDate;
  if (!end1 && !end2) return true;
  if (!end1) return !(start1 > end2!);
  if (!end2) return !(start2 > end1);
  return !(end1 < start2 || start1 > end2);
};

interface Props {
  /** 값이 있으면 열림 — AS-IS open(roleId, callback) */
  roleId: number | null;
  /** [닫기] — AS-IS callback.execute(그리드 행 수) 뒤 hide(): 부르는 쪽이 건수를 바꾼다 */
  onClose: (count: number) => void;
}

export const Tdm22_Lookup_RoleRelateCncl: React.FC<Props> = ({ roleId, onClose }) => {
  const [memberCodes, setMemberCodes] = useState<Code[]>([]);
  const [cnclLookup, setCnclLookup] = useState(false);
  const columnDefs = useMemo(() => buildGrid(memberCodes), [memberCodes]);
  const { crud, retrieve, reset, deleteRow, commit, close, saveCount } = useDeferredCrud<TdmRoleCouncil>({
    idField: 'roleRelateCnclId',
    search: useCallback(async () => (roleId ? tdmApi.searchRoleCouncils(roleId) : []), [roleId]),
    newRow: useCallback((): Partial<TdmRoleCouncil> => ({ roleId: roleId ?? undefined }), [roleId]),
  });

  // [E0] open() L67-89 → setting(), retrieve() / [E1] anchor.MouseDown (L94) → retrieve()
  useEffect(() => {
    if (roleId) {
      sysApi.searchCodes('TdmCnclMemberType').then(setMemberCodes).catch(() => {});
      void retrieve();
    } else {
      reset();
    }
  }, [roleId]);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] insertButton[행 추가].Select (L105) → insertRow() L192-219: Tdm05_Lookup_SelectMulti → 고른 회의체마다 새 행(역할 "(선택하세요)")
  const insertRows = (councils: TdmCouncil[]) => {
    crud.addRows(
      councils.map(c => ({ roleId: roleId ?? undefined, cnclId: c.cnclId, cnclName: c.cnclName, memberType: null, memberTypeName: '(선택하세요)' })),
      true,
    );
  };

  // [E6] msgBox.DialogHide [YES] (L129) → callback.execute(행 수) + hide() — useDeferredCrud.close의 확인
  // [E4] updateButton[저장].Select (L117) → update() L234-312: 필수·같은 회의체 기간 겹침 검사 → update → delete
  const update = () => commit({
    validate: (changed, all) => {
      for (const r of changed) {
        if (!r.memberType) return '역할은 필수선택 항목입니다';
        if (!r.startDate) return '사용시작일은 필수입력 항목입니다';
      }
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          if (all[i].cnclName !== all[j].cnclName) continue;
          if (isDateOverlap(all[i], all[j])) return `적용기간이 겹치는 회의체(${all[i].cnclName})이 존재합니다.`;
        }
      }
      return undefined;
    },
    save: changed => tdmApi.saveRoleCouncils(roleId!, changed),
    remove: ids => tdmApi.deleteRoleCouncils(roleId!, ids),
  });

  return (
    <LookupModal
      open={!!roleId}
      title="회의체 연결"
      width={740}
      closable={false}
      maskClosable={false}
      onCancel={() => close(onClose)}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" count={saveCount} onClick={update}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L123) → 변경이 있으면 확인(E6, L129) 뒤 callback.execute(행 수) + hide() */}
            <Button type="close" onClick={() => close(onClose)}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Button type="addRow" onClick={() => setCnclLookup(true)}>행 추가</Button>
          {/* [E3] deleteButton[행 삭제].Select (L111) → deleteRow() L221-232 */}
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
          <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void retrieve()} />
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E7] tdmCnclMemberComboBox[TdmCnclMemberType].ValueChange (L157) → 열의 valueSetter */}
          <CellEditGrid<TdmRoleCouncil> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Tdm05_Lookup_SelectMulti roleId={cnclLookup ? roleId : null} onSelect={insertRows} onClose={() => setCnclLookup(false)} />
    </LookupModal>
  );
};
