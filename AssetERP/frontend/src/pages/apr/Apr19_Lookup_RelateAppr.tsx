/**
 * 연관문서 창 (EE94) — 법인서류 신청내역에 연결된 상신문서 목록 (읽기 전용)
 * AS-IS: myApp/client/vi/apr/Apr19_Lookup_RelateAppr.java (163줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-77: 모달 900×450 "연관문서", 위 툴바 50([새로고침]) + 단일 선택 그리드(제목 370 · 등록일 90 · 시행일 90 · 등록자 80 · 상신상태 80 · 상세보기 70), 푸터 [닫기]
 * 호출처 Apr19_Tab_StampFileCheck(인감날인 확인)의 법인서류 쪽은 TOBE에 없다 — 창만 만들고 연결하지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { aprCorpDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprCorpDocRelate } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';

const gb = gbFor<AprCorpDocRelate>();

interface Props {
  /** 값이 있으면 열림 — open(corpDocId) */
  corpDocId: number | null;
  onClose: () => void;
}

export const Apr19_Lookup_RelateAppr: React.FC<Props> = ({ corpDocId, onClose }) => {
  const [rows, setRows] = useState<AprCorpDocRelate[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailApprId, setDetailApprId] = useState<number | null>(null);

  // retrieve() L147-158: apr.Apr18_RelateCorpDoc.selectByCorpDocId
  const retrieve = useCallback(async () => {
    if (corpDocId == null) return;
    setLoading(true);
    try {
      setRows(await aprCorpDocApi.searchRelates(corpDocId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [corpDocId]);

  // [E0] 화면 열림 (open L43-47) → retrieve()
  useEffect(() => {
    setRows([]);
    if (corpDocId != null) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpDocId]);

  // [E2] actionCell (ImageCell "View").callbackOnCreate (L95-131): 연결문서가 없으면 "연결문서가 없습니다.", 제목에 [폐기]가 있으면 "해당문서는 폐기되어 열람이 불가능합니다", 아니면 Apr01_Edit_ApprDoc.retrieveApproval
  const openDetail = (row: AprCorpDocRelate) => {
    if (row.apprId == null) { message.info('연결문서가 없습니다.'); return; }
    if (row.title != null && row.title.indexOf('style=color:#E33E31;>[폐기]') !== -1) { message.info('해당문서는 폐기되어 열람이 불가능합니다'); return; }
    setDetailApprId(row.apprId);
  };

  // buildGrid() L94-145
  const columnDefs = useMemo(() => [
    gb.text('title', 370, '제목'),  // L134
    gb.date('regDate', 90, '등록일'),  // L135
    gb.date('effectDate', 90, '시행일'),  // L136
    gb.textCenter('regEmpName', 80, '등록자'),  // L137
    gb.textCenter('statusName', 80, '상신상태'),  // L138
    iconCell<AprCorpDocRelate>('view', 'detailAction', 70, '상세보기', openDetail),  // L139
  ], []);

  return (
    <LookupModal
      open={corpDocId != null}
      title="연관문서"
      width={900}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] closeButton[닫기].Select (L86) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 350, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[새로고침].Select (L80) → retrieve() */}
          <Button type="reset" onClick={retrieve} loading={loading}>새로고침</Button>
        </div>
        <div style={{ flex: 1, minHeight: 120 }}>
          <SingleGrid<AprCorpDocRelate> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.relateCorpDocId)} />
        </div>
      </div>
      <Apr01_Edit_ApprDoc apprId={detailApprId} onClose={() => setDetailApprId(null)} />
    </LookupModal>
  );
};
