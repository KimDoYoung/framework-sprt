/**
 * C/F 조회창 (EE77) — AS-IS는 MyPage 오늘의 할일(Monitoring_Page_DayList) 목록에서 업무구분 090(C/F) 행을 더블클릭하면 연다
 * AS-IS: myApp/client/vi/ast/Ast04_Lookup_Cf.java (96줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L50-68: 380×320 모달 "C/F", 읽기 전용 5줄 [구분][거래처][금액][세금][실수령/지급액](금액은 ###,###,###) + [닫기]
 * 호출처가 보내는 값(Monitoring_Page_DayList.open L211-232): ast.Ast04_Cf.selectByRelateId(relateId, 로그인 회사) → cfId가 없으면
 *   "예기치못한 오류가 발생했습니다. 관리자에게 문의해주세요" → 창. 이 창이 그 조회까지 한다.
 * TOBE에서는 MyPage Day List(`components/mypage/DayListBox`, EE106)가 연다
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCfDetail } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** open(cfModel) — 현금흐름 ID(할일 행의 relateId). 값이 있으면 열린다 */
  relateId: number | null;
  onClose: () => void;
}

const fmt = (n?: number | null) => (n == null ? '' : n.toLocaleString('ko-KR'));

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 10 }}>
    <span style={{ width: 120, textAlign: 'right', paddingRight: 10, fontSize: 12, fontWeight: 'bold', flex: 'none' }}>{label}</span>
    <Input readOnly value={value} style={{ textAlign: 'left' }} />
  </div>
);

export const Ast04_Lookup_Cf: React.FC<Props> = ({ relateId, onClose }) => {
  const [cf, setCf] = useState<AstCfDetail | null>(null);

  // [E0] 화면 열림 → modelSettings() L35-48: 값을 채우고 읽기 전용으로
  useEffect(() => {
    setCf(null);
    if (relateId == null) return;
    astApi.getCfByRelateId(relateId)
      .then(setCf)
      .catch(err => { message.error(errorMessage(err, '예기치못한 오류가 발생했습니다. 관리자에게 문의해주세요')); onClose(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relateId]);

  return (
    <LookupModal
      open={relateId != null && cf != null}
      title="C/F"
      width={380}
      maskClosable={false}
      onCancel={onClose}
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select (L58) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '12px 2px 2px' }}>
        <Row label="구분" value={cf?.trName ?? ''} />
        <Row label="거래처" value={cf?.corpName ?? ''} />
        <Row label="금액" value={fmt(cf?.contAmt)} />
        <Row label="세금" value={fmt(cf?.tax)} />
        <Row label="실수령/지급액" value={fmt(cf?.settleAmt)} />
      </div>
    </LookupModal>
  );
};
