/**
 * 증빙자료 창 (L02) — Biz01_Edit_Card의 [증빙자료(n건)]에서 연다
 * AS-IS: myApp/client/vi/biz/Biz05_Lookup_RelateAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L97-120: 모달 880×550(크기 조절), 툴바 [조회][불러오기][연결제거] + 연결된 상신문서 그리드(buildGrid L122-162: 체크박스 다중,
 *   제목 370 · 등록일 90 · 시행일 90 · 등록자 80 · 상신상태 80 · 상세보기 70) + 아래 200 = `Biz05_Lookup_RelateFile`, 창 아래 가운데 [닫기]
 * 1단계: [불러오기](Apr05_Lookup_LoadDoc)·상세보기(Apr01_Edit_ApprDoc)는 다른 도메인 컴포넌트라 다음 단계 — 안내만 띄운다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizRelateApprApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizRelateAppr } from '@/types/biz';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Biz05_Lookup_RelateFile } from './Biz05_Lookup_RelateFile';

const gb = gbFor<BizRelateAppr>();

interface Props {
  open: boolean;
  /** open(title, promoId, callback) 의 title — 창 제목(파란 굵은 글씨) */
  title: string;
  promoId: number | null;
  /** [닫기] → callback.execute() 뒤 hide() — 부르는 쪽이 증빙자료 건수를 다시 센다 */
  onClose: () => void;
}

export const Biz05_Lookup_RelateAppr: React.FC<Props> = ({ open, title, promoId, onClose }) => {
  const gridRef = useRef<AgGridReact<BizRelateAppr>>(null);
  const [rows, setRows] = useState<BizRelateAppr[]>([]);

  // retrieve() L164-170: 서비스 biz.Biz05_RelateAppr.selectByPromoId(companyId, promoId)
  const retrieve = useCallback(async () => {
    if (!open || promoId == null) return;
    try {
      setRows(await bizRelateApprApi.searchByPromo(promoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [open, promoId]);

  // [E0] 열림 (생성자 L97-120, open L56-65) → fileList.open(promoId), settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E3] deleteButton[연결제거].Select (L80) → delete() L197-201: GridDeleteData → biz.Biz05_RelateAppr.delete(체크한 행). 확인창 없음
  const remove = async () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    try {
      const n = await bizRelateApprApi.deleteRelateApprs(checked.map(r => r.relateApprId));
      message.success(`${n}건 삭제되었습니다.`);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L122-162
  const columnDefs = useMemo(() => [
    gb.text('title', 370, '제목'),  // L154
    gb.date('regDate', 90, '등록일'),  // L155
    gb.date('effectDate', 90, '시행일'),  // L156
    gb.textCenter('regEmpName', 80, '등록자'),  // L157
    gb.textCenter('statusName', 80, '상신상태'),  // L158
    // L159 상세보기 ImageCell("Detail") → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval — 전자결재는 다음 단계
    iconCell<BizRelateAppr>('view', 'detailCell', 70, '상세보기', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
  ], []);

  return (
    <LookupModal
      open={open}
      title={<span style={{ color: '#0069B4', fontWeight: 'bold' }}>{title}</span>}
      width={880}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] closeButton[닫기].Select [callback != null] (L86) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L68) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E2] insertButton[불러오기].Select (L74) → insert() L172-195: Apr05_Lookup_LoadDoc → biz.Biz05_RelateAppr.modelUpdate — 불러오기 창은 다른 도메인이라 다음 단계 */}
          <Button type="register" onClick={() => message.info('전자결재 문서 불러오기 창은 다음 단계에서 연결됩니다')}>불러오기</Button>
          <Button type="delete" onClick={remove}>연결제거</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BizRelateAppr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateApprId)} />
        </div>
        <div style={{ height: 200 }}>
          <Biz05_Lookup_RelateFile promoId={promoId} />
        </div>
      </div>
    </LookupModal>
  );
};
