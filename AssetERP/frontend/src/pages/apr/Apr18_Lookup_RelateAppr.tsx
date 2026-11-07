/**
 * 연관결재 창 (EE93) — 법인서류 신청내역에 상신문서를 연결·제거한다
 * AS-IS: myApp/client/vi/apr/Apr18_Lookup_RelateAppr.java (205줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L96-114: 모달 850×400, 위 툴바 38([조회][불러오기][연결제거]) + 체크 다중 그리드(제목 370 · 등록일 90 · 시행일 90 · 등록자 80 · 상신상태 80 · 상세보기 70), 푸터 [닫기]
 * 제목은 호출처가 준다(open(title, relateId, callback)). 호출처 Apr17_Tab_CorpDoc은 TOBE에 없다 — 창만 만들고 연결하지 않는다
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprCorpDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprCorpDocRelate, AprLoadDoc } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';
import { Apr05_Lookup_LoadDoc } from './Apr05_Lookup_LoadDoc';

const gb = gbFor<AprCorpDocRelate>();

/** 열 때 받는 값 (AS-IS open(title, relateId, callback)) */
export interface AprCorpDocRelateTarget {
  title: string;
  relateId: number;
}

interface Props {
  /** 값이 있으면 열림 */
  target: AprCorpDocRelateTarget | null;
  /** [닫기] 단추 (AS-IS callback != null이면 execute() 뒤 hide) — X로 닫을 때는 부르지 않는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Apr18_Lookup_RelateAppr: React.FC<Props> = ({ target, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<AprCorpDocRelate>>(null);
  const [rows, setRows] = useState<AprCorpDocRelate[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadDocOpen, setLoadDocOpen] = useState(false);
  const [detailApprId, setDetailApprId] = useState<number | null>(null);

  // retrieve() L158-164: apr.Apr18_RelateCorpDoc.selectByCorpDocId
  const retrieve = useCallback(async () => {
    if (!target) return;
    setLoading(true);
    try {
      setRows(await aprCorpDocApi.searchRelates(target.relateId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [target]);

  // [E0] 화면 열림 (open L58-63) → settings(), retrieve()
  useEffect(() => {
    setRows([]);
    if (target) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E2] insertButton[불러오기].Select (L72) → insert() L166-194: Apr05_Lookup_LoadDoc → 고른 문서로 apr.Apr18_RelateCorpDoc.modelUpdate → 성공이면 retrieve(), 아니면 서버 메시지("이미 연결된 문서입니다.")
  const insert = async (appr: AprLoadDoc) => {
    if (!target) return;
    try {
      await aprCorpDocApi.insertRelate(target.relateId, appr.apprId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] deleteButton[연결제거].Select (L78) → delete() L196-200: GridDeleteData(확인창 없음) → apr.Apr18_RelateCorpDoc.delete → 지운 줄을 그리드에서 뺀다
  const remove = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.info('삭제할 항목을 선택해주세요.'); return; }
    try {
      await aprCorpDocApi.deleteRelates(checked.map(r => r.relateCorpDocId));
      const gone = new Set(checked.map(r => r.relateCorpDocId));
      setRows(prev => prev.filter(r => !gone.has(r.relateCorpDocId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L116-156
  const columnDefs = useMemo(() => [
    gb.text('title', 370, '제목'),  // L148
    gb.date('regDate', 90, '등록일'),  // L149
    gb.date('effectDate', 90, '시행일'),  // L150
    gb.textCenter('regEmpName', 80, '등록자'),  // L151
    gb.textCenter('statusName', 80, '상신상태'),  // L152
    // [E5] actionCell (ImageCell "Detail").callbackOnCreate (L117-143): ApprCallbackResult(apprId) → Apr01_Edit_ApprDoc.retrieveApproval — 열람권한이 없으면 문서 창이 안내한다
    iconCell<AprCorpDocRelate>('view', 'detailAction', 70, '상세보기', row => { if (row.apprId != null) setDetailApprId(row.apprId); }),  // L153
  ], []);

  return (
    <LookupModal
      open={target != null}
      title={target?.title ?? ''}
      width={850}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] closeButton[닫기].Select (L85) → callback != null이면 callback(), hide() */}
            <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L66) → retrieve() */}
          <Button type="search" onClick={retrieve} loading={loading}>조회</Button>
          <Button type="register" onClick={() => setLoadDocOpen(true)}>불러오기</Button>
          <Button type="delete" onClick={() => void remove()}>연결제거</Button>
        </div>
        <div style={{ flex: 1, minHeight: 120 }}>
          <MultiGrid<AprCorpDocRelate> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateCorpDocId)} />
        </div>
      </div>
      <Apr01_Edit_ApprDoc apprId={detailApprId} onClose={() => setDetailApprId(null)} />
      <Apr05_Lookup_LoadDoc open={loadDocOpen} onResult={doc => void insert(doc)} onClose={() => setLoadDocOpen(false)} />
    </LookupModal>
  );
};
