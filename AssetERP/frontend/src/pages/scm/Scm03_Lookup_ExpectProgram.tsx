/**
 * 예상목록 창 (EE17) — 의뢰에 등록된 예상프로그램을 본다(보기 전용)
 * AS-IS: myApp/client/vi/scm/Scm03_Lookup_ExpectProgram.java (102줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 600×500 · 위 [새로고침] · 체크 다중 그리드(구분 80 · 프로그램코드 200 · 프로그램명 200) · [닫기]
 * [E0] 화면 열림 (생성자 L39-71) → open(srId) L33-37: retrieve() · scm.Scm03_ExpectProgram.selectBySrId L85-97
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { ExpectProgram } from '@/types/scm';
import { MultiGrid, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

const gb = gbFor<ExpectProgram>();

interface Props {
  open: boolean;
  srId: number | null;
  onClose: () => void;
}

export const Scm03_Lookup_ExpectProgram: React.FC<Props> = ({ open, srId, onClose }) => {
  const [rows, setRows] = useState<ExpectProgram[]>([]);
  const [loading, setLoading] = useState(false);

  // [E1] retrieveButton[새로고침].Select (L46) → retrieve()
  const retrieve = useCallback(async () => {
    if (srId == null) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await scmApi.searchExpectPrograms(srId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [srId]);

  useEffect(() => { if (open) void retrieve(); else setRows([]); }, [open, retrieve]);

  const columnDefs = useMemo(() => [
    gb.text('programTypeNm', 80, '구분'),
    gb.text('programCd', 200, '프로그램코드'),
    gb.text('programNm', 200, '프로그램명'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="예상목록"
      width={600}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancelButton[닫기].Select (L52) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 340 }}>
        <div style={{ paddingBottom: 8 }}>
          <Button type="reset" onClick={retrieve}>새로고침</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<ExpectProgram> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.expectProgramId)} loading={loading} rowClick />
        </div>
      </div>
    </LookupModal>
  );
};
