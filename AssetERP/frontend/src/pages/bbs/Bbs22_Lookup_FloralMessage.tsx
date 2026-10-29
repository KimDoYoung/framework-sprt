/**
 * 경조구분별 문구등록 창 — Bbs20_Tab_FloralRequestMng [경조구분별 문구등록]에서 연다 (T21)
 * AS-IS: myApp/client/vi/bbs/Bbs22_Lookup_FloralMessage.java (97줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L37-61: 모달 560×400 "경조구분별 문구등록", 그리드(경조구분 100·문구 400 편집), 아래 가운데 [저장][닫기]
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { message, Space } from 'antd';
import { bbsFloralApi } from '@/api/bbs';
import { BbsFloralMessage } from '@/types/bbs';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<BbsFloralMessage>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Bbs22_Lookup_FloralMessage: React.FC<Props> = ({ open, onClose }) => {
  const crud = useGridCrud<BbsFloralMessage>({
    idField: 'floralMessageId',
    // [E0] 화면 열림 → open() L33-35 → insertCode() L70-81: 서비스 bbs.Bbs22_FloralMessage.checkOccasionsCode(companyId) → retrieve() L88-92: selectByCompanyId (서버가 한 번에 한다)
    search: bbsFloralApi.searchMessages,
    // [E1] updateButton[저장].Select (L44) → update() L83-86: GridUpdate → bbs.Bbs22_FloralMessage.update. 응답은 다시 읽은 전체 목록이라 다시 조회한다
    save: bbsFloralApi.saveMessages,
    remove: async () => 0,
    newRow: useCallback(() => ({}), []),
    reloadAfterSave: true,
  });

  useEffect(() => {
    if (open) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L63-68
  const columnDefs = useMemo(() => [
    gb.textCenter('occasionsName', 100, '경조구분'),  // L65
    gb.text('message', 400, '문구', { editor: 'text' }),  // L66
  ], []);

  return (
    <LookupModal
      open={open}
      title="경조구분별 문구등록"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L50) → hide() */}
            <Button type="close" onClick={() => { if (crud.hasChanges()) message.info('저장하지 않은 변경은 버려집니다'); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300 }}>
        <CellEditGrid<BbsFloralMessage> crud={crud} columnDefs={columnDefs} getRowId={p => String(p.data.floralMessageId)} />
      </div>
    </LookupModal>
  );
};
