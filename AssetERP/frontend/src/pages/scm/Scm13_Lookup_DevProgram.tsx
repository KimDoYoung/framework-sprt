/**
 * 개발 프로그램 조회창 (EE16) — Scm10_Grid_Dev의 프로그램 [보기] 아이콘이 연다
 * AS-IS: myApp/client/vi/scm/Scm13_Lookup_DevProgram.java (93줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 모달 600×350 "변경프로그램": 그리드 buildApprStepGrid() L67-84 (구분 100 · 프로그램ID 310 · 배포순서 60 · 소스 30) + [닫기]
 * retrieve() L61-65: scm.Scm13_DevProgram.selectByDevId(devId). 소스 아이콘 → Scm13_Edit_DevProgram.open(상세보기)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevProgram } from '@/types/scm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';
import { Scm13_Edit_DevProgram } from './Scm13_Edit_DevProgram';

const gb = gbFor<DevProgram>();

interface Props {
  open: boolean;
  devId: number | null;
  onClose: () => void;
}

export const Scm13_Lookup_DevProgram: React.FC<Props> = ({ open, devId, onClose }) => {
  const [rows, setRows] = useState<DevProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<DevProgram | null>(null);

  const retrieve = useCallback(async () => {
    if (devId == null) return;
    setLoading(true);
    try {
      setRows(await scmApi.searchDevPrograms(devId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [devId]);

  // [E0] 화면 열림 (생성자 L33-50) → settings(), show() + open(devId) L28-31: retrieve()
  useEffect(() => { if (open) void retrieve(); else setRows([]); }, [open, retrieve]);

  const columnDefs = useMemo(() => [
    gb.text('programTypeNm', 100, '구분'),
    gb.text('programCd', 310, '프로그램ID'),
    gb.long('deploySeq', 60, '배포순서'),
    iconCell<DevProgram>('edit', 'sourceCell', 30, '소스', row => setTarget(row)),
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="변경프로그램"
        width={600}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        focusFirst={false}
        styles={{ header: MODAL_HEADER_STYLE }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] closeButton[닫기].Select (L53) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 300 }}>
          <SingleGrid<DevProgram> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.devProgramId)} loading={loading} />
        </div>
      </LookupModal>
      {/* 소스 아이콘 (L68-74) → Scm13_Edit_DevProgram.open(programModel) — 상세보기 */}
      <Scm13_Edit_DevProgram open={target != null} mode="view" program={target} onClose={() => setTarget(null)} />
    </>
  );
};
