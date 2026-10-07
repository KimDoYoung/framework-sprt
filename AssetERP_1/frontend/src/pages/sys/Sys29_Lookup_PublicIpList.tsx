/**
 * 공인IP 등록/수정 조회창 (A15) — 관리정보 탭(Sys01_TabPage_Info01)의 보안로그인 옆 [View]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys29_Lookup_PublicIpList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Modal, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { LoginSecure } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<LoginSecure>();

/** AS-IS buildGrid() L113-122 (체크박스 다중) */
const buildGrid = () => [
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L117
  gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L118
  gb.text('publicIp', 200, '공인IP', { editor: 'text' }),  // L119
  gb.text('note', 200, '비고', { editor: 'text' }),  // L120
];

interface Props {
  /** open(companyId) L50-78 — 값이 있으면 열린다 */
  companyId?: number;
  onClose: () => void;
}

export const Sys29_Lookup_PublicIpList: React.FC<Props> = ({ companyId, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);
  const crud = useGridCrud<LoginSecure>({
    idField: 'loginSecureId',
    // retrieve() L124-133: 서비스 sys.Sys29_LoginSecure.selectByCompanyId(companyId)
    search: useCallback(() => (companyId ? sysApi.searchLoginSecures(companyId) : Promise.resolve([])), [companyId]),
    save: useCallback((rows: LoginSecure[]) => sysApi.updateLoginSecures(companyId!, rows), [companyId]),
    remove: useCallback((ids: number[]) => sysApi.deleteLoginSecures(companyId!, ids), [companyId]),
    // insertRow() L135-141: 회사 = 연 회사, 시작일 = 오늘
    newRow: useCallback(() => ({ companyId, startDate: dayjs().format('YYYY-MM-DD') }), [companyId]),
    firstEditField: 'publicIp',
    // delete() L143-163: "n건을 삭제하시겠습니까?" → [E6] YES → 서비스 sys.Sys29_LoginSecure.delete
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });
  const retrieve = crud.retrieve;
  const insertRow = crud.addRow;
  const update = crud.saveRows;
  const remove = crud.deleteChecked;

  // open() L50-78 → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) retrieve(); }, [companyId]);

  return (
    <Modal
      open={!!companyId}
      title="공인IP 등록/수정"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select (L105) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 470, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L81) */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L87) */}
          <Button type="register" onClick={insertRow}>등록</Button>
          {/* [E3] updateButton[저장].Select (L93) */}
          <Button type="save" onClick={update}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L99) */}
          <Button type="delete" onClick={remove}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<LoginSecure> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </Modal>
  );
};
