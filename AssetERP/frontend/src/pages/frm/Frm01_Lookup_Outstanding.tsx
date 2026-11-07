/**
 * 미결재건 창 (EE56) — Frm01_Lookup_CheckList(알림)의 [미결재건]이 연다. 내(대결 대상 포함) 차례인 미결재 전자결재 문서 목록
 * AS-IS: myApp/client/vi/frm/Frm01_Lookup_Outstanding.java (99줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L35-50: 720×400, 머리말 "미결재건", 단일 그리드. open(callback) L30-33 → retrieve()
 * buildGrid() L52-78: 등록일 100 · 제목 240 · 상신자 100(가운데) · 상세보기 아이콘 80, 행번호 숨김
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { frmApi } from '@/api/frm';
import { errorMessage } from '@/api/client';
import { FrmOutstanding } from '@/types/frm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<FrmOutstanding>();

interface Props {
  open: boolean;
  /** AS-IS callback.execute() — 문서를 처리하고 닫았을 때. 부르는 쪽이 건수를 다시 읽는다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Frm01_Lookup_Outstanding: React.FC<Props> = ({ open, onChanged, onClose }) => {
  const [rows, setRows] = useState<FrmOutstanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [apprId, setApprId] = useState<number | null>(null);

  // retrieve() L80-95 — apr.Apr01_Appr.selectOutstandingPopup
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await frmApi.searchOutstanding());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L35-50, open L30-33) → retrieve()
  useEffect(() => { if (open) void retrieve(); }, [open, retrieve]);

  const columns = [
    gb.date('regDate', 100, '등록일'),            // L71 addDateFix
    gb.text('title', 240, '제목'),                // L72
    gb.textCenter('regEmpName', 100, '상신자'),   // L73
    // [E1] 상세보기 아이콘 (apprButton L55-70) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → callback.execute(), retrieve())
    iconCell<FrmOutstanding>('view', 'actionCell', 80, '상세보기', row => setApprId(row.apprId)),
  ];

  return (
    <>
      <LookupModal
        open={open}
        title="미결재건"
        width={720}
        maskClosable={false}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ height: 300 }}>
          <SingleGrid<FrmOutstanding> rowData={rows} columnDefs={columns} rowNumber={false} loading={loading} getRowId={p => String(p.data.apprId)} />
        </div>
      </LookupModal>
      <Apr01_Edit_ApprDoc
        apprId={apprId}
        onClosed={() => { onChanged?.(); void retrieve(); }}
        onClose={() => setApprId(null)}
      />
    </>
  );
};
