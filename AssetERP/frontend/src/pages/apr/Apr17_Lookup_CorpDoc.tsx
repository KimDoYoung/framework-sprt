/**
 * 신청내역 창 (EE92) — 법인서류(인감증명서·등기부등본) 등록 전 신청내역을 골라 등록일을 오늘로 확정한다.
 * AS-IS: myApp/client/vi/apr/Apr17_Lookup_CorpDoc.java (182줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-98: 모달 1080×400(닫기 X 없음), 위 툴바 50([조회]) + 체크 다중 그리드(신청일자 100 · 신청자 80 · 제공처 300 · 목적 300 · 법인인감증명서 신청매수 100 · 법인등기부등본 신청매수 100), 푸터 [확인][닫기]
 * 조회창 규격(11a): LookupModal, 열 때 바로 조회(open L53-58)
 * 호출처 Apr17_Tab_CorpDoc은 TOBE에 없다 — 창만 만들고 연결하지 않는다
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprCorpDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprCorpDoc } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprCorpDoc>();

interface Props {
  open: boolean;
  /** [확인]으로 등록한 뒤, 또는 [닫기] — AS-IS callback.execute() 뒤 hide */
  onResult: () => void;
  onClose: () => void;
}

export const Apr17_Lookup_CorpDoc: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AprCorpDoc>>(null);
  const [rows, setRows] = useState<AprCorpDoc[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L165-177: apr.Apr17_CorpDoc.selectByCompanyId
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await aprCorpDocApi.search());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (open L53-58) → retrieve()
  useEffect(() => {
    if (open) { setRows([]); void retrieve(); }
  }, [open, retrieve]);

  // [E2] updateButton[확인].Select (L72) → update() L114-163: 고른 게 없으면 "선택된 신청내역이 없습니다", 확인(330) "n건의 항목을 등록하시겠습니까?" → apr.Apr17_CorpDoc.regDateUpdate → callback, hide
  const update = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.info('선택된 신청내역이 없습니다'); return; }
    if (checked.some(r => r.regDate != null)) { message.info('이미 등록된 항목이 있습니다'); return; }
    Modal.confirm({
      title: '등록', content: `${checked.length}건의 항목을 등록하시겠습니까?`, width: 330, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await aprCorpDocApi.regDateUpdate(checked.map(r => r.corpDocId));
          onResult();
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
        }
      },
    });
  };

  // buildGrid() L100-112
  const columnDefs = useMemo(() => [
    gb.date('callDate', 100, '신청일자'),  // L104
    gb.text('callEmpName', 80, '신청자'),  // L105
    gb.text('provideCo', 300, '제공처'),  // L106
    gb.text('purpose', 300, '목적'),  // L107
    gb.long('stampCertCallCnt', 100, '법인인감증명서<br>신청매수'),  // L108
    gb.long('corpRegCallCnt', 100, '법인등기부등본<br>신청매수'),  // L109
  ], []);

  return (
    <LookupModal
      open={open}
      title="신청내역"
      width={1080}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E3] cancleButton[닫기].Select (L78) → callback.execute(), hide() */}
            <Button type="close" onClick={() => { onResult(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L66) → retrieve() */}
          <Button type="search" onClick={retrieve} loading={loading}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 120 }}>
          <MultiGrid<AprCorpDoc> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.corpDocId)} rowClick />
        </div>
      </div>
    </LookupModal>
  );
};
