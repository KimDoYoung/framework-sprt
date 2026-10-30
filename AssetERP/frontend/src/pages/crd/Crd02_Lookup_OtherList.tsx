/**
 * 카드내역 금액 불일치 목록 (U15) — Biz01_Tab_CardManagement [마감]이 업로드 금액과 내역관리 금액이 다르면 연다
 * AS-IS: myApp/client/vi/crd/Crd02_Lookup_OtherList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * settings() L38-67: 모달 850×400(크기 고정), 제목 "List", 안내 "데이터가 일치하지 않습니다. 아래 항목들을 다시 확인해주세요."(높이 50) + 그리드, 창 아래 가운데 [닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { bizCardManagementApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizCardCompare } from '@/types/biz';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizCardCompare>();

interface Props {
  open: boolean;
  /** open(dataYm) — 기준년월 'yyyy.MM' */
  dataYm: string;
  onClose: () => void;
}

export const Crd02_Lookup_OtherList: React.FC<Props> = ({ open, dataYm, onClose }) => {
  const [rows, setRows] = useState<BizCardCompare[]>([]);

  // retrieve() L83-95: 서비스 crd.Crd02_Data.selectByCompareAmt(companyId, dataYm)
  useEffect(() => {
    if (!open) return;
    bizCardManagementApi.compare(dataYm)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, dataYm]);

  // buildUploadGrid() L69-81
  const columnDefs = useMemo(() => [
    gb.text('cardNo', 150, '카드번호'),  // L72
    gb.date('approvalDt', 90, '승인일'),  // L73 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('franchiseName', 200, '가맹점명'),  // L74
    gb.text('sectorName', 150, '업종'),  // L75
    gb.long('approvalAmount', 100, '업로드<br>승인금액'),  // L76
    gb.long('provideAmt', 100, '내역관리<br>승인금액', { cellStyle: { color: '#0069B4' } }),  // L77
  ], []);

  return (
    <LookupModal
      open={open}
      title={<span style={{ color: '#0069B4', fontWeight: 'bold' }}>List</span>}
      width={850}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          {/* [E1] cancelButton[닫기].Select (L45) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      )}
    >
      <div style={{ height: 270, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#c0392b' }}>
          데이터가 일치하지 않습니다. 아래 항목들을 다시 확인해주세요.
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BizCardCompare>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.cardNo}|${p.data.approvalDt}|${p.data.franchiseName}|${p.data.approvalAmount}`}
          />
        </div>
      </div>
    </LookupModal>
  );
};
