/**
 * 특정알림 설정 창 (EE65) — 기본설정(MySetting)의 [특정알림 설정](관리자만 보인다)이 연다.
 * 왼쪽에서 알림 구분(SmsNoticeCode)을 하나 고르면 오른쪽에 그 구분의 수신인 목록(Emp93_Tabpage_SmsNoticeTargetList)이 열린다
 * AS-IS: myApp/client/vi/emp/Emp93_Lookup_SmsNoticeTargetList.java (122줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L44-72: 900×500 모달 "특정알림 설정", 왼쪽 310(툴바 [조회] + 체크박스 다중 그리드 구분 240) | 오른쪽 탭 페이지, 푸터 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { empSmsNoticeTargetApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { SmsNoticeKind } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp93_Tabpage_SmsNoticeTargetList } from './Emp93_Tabpage_SmsNoticeTargetList';

const gb = gbFor<SmsNoticeKind>();

/** buildGrid() L99-104 */
const buildGrid = () => [
  gb.text('smsNoticeName', 240, '구분'),  // L102
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp93_Lookup_SmsNoticeTargetList: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<SmsNoticeKind[]>([]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L106-117 — emp.Emp93_SmsNoticeTarget.getSmsNoticeList
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await empSmsNoticeTargetApi.kinds());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 열림 (open L40-42) → retrieve()
  useEffect(() => {
    if (!open) return;
    setCode(null);
    void retrieve();
  }, [open, retrieve]);

  // [E3] grid.RowClick (L87-96) → 체크된 구분이 정확히 1개면 tabPage.retrieve(그 코드), 아니면 tabPage.retrieve(null)
  const onChecked = (checked: SmsNoticeKind[]) => setCode(checked.length === 1 ? checked[0].smsNoticeCd : null);

  return (
    // 열 폭 합계 (구분 240 + 사원 250 + 비고 250) + 체크·행번호 약 120 + 여백 130 = 990 (03 원칙 21, AS-IS 900보다 작지 않게)
    <LookupModal open={open} title="특정알림 설정" width={1000} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancelButton[닫기].Select (L81) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', gap: 8 }}>
        <div style={{ width: 310, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* [E1] retrieveButton[조회].Select (L75) → retrieve() */}
            <Button type="search" onClick={() => void retrieve()}>조회</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<SmsNoticeKind> rowClick rowData={rows} columnDefs={columnDefs} loading={loading}
              getRowId={p => String(p.data.smsNoticeTargetId)} onCheckedChange={onChecked} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Emp93_Tabpage_SmsNoticeTargetList smsNoticeCode={code} />
        </div>
      </div>
    </LookupModal>
  );
};
