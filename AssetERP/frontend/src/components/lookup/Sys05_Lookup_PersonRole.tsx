/**
 * 권한그룹 조회창 (C04) — Emp00_Tab_RoleMenu 사원 그리드의 [그룹] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys05_Lookup_PersonRole.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 모달 850×450(크기 고정), 제목 "권한그룹", 그리드 + 가운데 [닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PersonRole } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<PersonRole>();

/** AS-IS buildGrid() (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),
  gb.boolean('userRoleYn', 40, '권한'),  // addBooleanHtml = 읽기 전용 체크
  gb.text('seq', 80, '순서'),
  gb.text('note', 450, '비고'),
];

const selectOne = { mode: 'singleRow' as const, checkboxes: true, enableClickSelection: true };

interface Props {
  open: boolean;
  /** open(personId) L27-31 */
  personId?: number;
  /** [E1] closeButton[닫기].Select (L34) → hide() */
  onClose: () => void;
}

export const Sys05_Lookup_PersonRole: React.FC<Props> = ({ open, personId, onClose }) => {
  const [rows, setRows] = useState<PersonRole[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] 화면 열림 (생성자 L42-52) → open(personId) → retrieve() L67-72: sys.Sys04_Role.selectByUserId(userId=personId, 로그인 회사)
  useEffect(() => {
    if (!open || personId === undefined) return;
    setRows([]);
    sysApi.searchPersonRoles(personId)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, personId]);

  return (
    <LookupModal open={open} title="권한그룹" width={850} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 340 }}>
        <SingleGrid<PersonRole>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.roleId)}
          rowSelection={selectOne}
        />
      </div>
    </LookupModal>
  );
};
