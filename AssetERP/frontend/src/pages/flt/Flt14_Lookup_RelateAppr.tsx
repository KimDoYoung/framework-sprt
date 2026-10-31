/**
 * 문서 창 (I05 정기보고) — Flt10_Tab_RealTransaction [문서보기]에서 보고월 상신문서가 둘 이상일 때 연다.
 * AS-IS: myApp/client/vi/flt/Flt14_Lookup_RelateAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(param, callback) L58-77: 750×450 모달 "문서", 툴바 [조회], 체크 다중 그리드(상신일자·상신제목·상태·문서보기 아이콘), [닫기](callback 뒤 hide)
 * 스타일: modal(그리드형) — 머리 아래 선·푸터 위 선은 LookupModal, 스크롤은 그리드 하나
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltRelateAppr } from '@/types/flt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<FltRelateAppr>();

interface Props {
  /** open(param{stdDate, personId}) — 값이 있으면 열림. personId는 로그인 사원(서버가 정한다) */
  stdDate: string | null;
  /** [닫기] callback.execute() — 부르는 쪽이 apprChk로 상신상태를 다시 읽는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Flt14_Lookup_RelateAppr: React.FC<Props> = ({ stdDate, onClosed, onClose }) => {
  const [rows, setRows] = useState<FltRelateAppr[]>([]);
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // retrieve() L143-156: 서비스 flt.Flt14_RelateAppr.selectByStdDate(stdDate, personId)
  const retrieve = useCallback(async () => {
    if (!stdDate) return;
    try {
      setRows(await fltApi.searchRelateApprs(stdDate));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [stdDate]);

  // [E0] 화면 열림 (open L58-77) → settings(), retrieve()
  useEffect(() => {
    if (stdDate) void retrieve();
    else setRows([]);
  }, [stdDate, retrieve]);

  // buildGrid() L96-141 — actionCell(View): 문서가 없으면 "문서가 존재하지않습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval(model, false) 뒤 retrieve()
  const columnDefs = useMemo(() => [
    gb.date('apprRegDate', 90, '상신일자'),  // 원본 100 → UX-08
    gb.text('apprTitle', 400, '상신제목'),
    gb.textCenter('apprStatusName', 100, '상태'),
    iconCell<FltRelateAppr>('view', 'actionCell', 80, '문서보기', row => {
      if (row.apprId == null) message.warning('문서가 존재하지않습니다');
      else setViewApprId(row.apprId);
    }),
  ], []);

  return (
    <LookupModal
      open={stdDate != null}
      title="문서"
      width={860}
      maskClosable={false}
      closable={false}
      onCancel={() => { onClosed?.(); onClose(); }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancelButton[닫기].Select (L86) → callback.execute(), hide() */}
          <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L80) → retrieve() */}
        <div>
          <Button type="search" onClick={retrieve}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltRelateAppr>
            rowData={rows}
            columnDefs={columnDefs}
            rowClick
            getRowId={p => String(p.data.relateApprId)}
          />
        </div>
      </div>
      {/* [E3] actionCell.callbackOnCreate (L114) — 문서창을 닫으면 retrieve() */}
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClosed={() => void retrieve()} onClose={() => setViewApprId(null)} />
    </LookupModal>
  );
};
