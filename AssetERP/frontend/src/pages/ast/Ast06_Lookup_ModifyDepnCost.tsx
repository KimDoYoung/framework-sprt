/**
 * 감가상각비 수정창 (W11) — Ast06_Tab_EvalDepn 의 처리 줄 [수정] 아이콘
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_ModifyDepnCost.java (116줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L38-56: 500×160, 폼 라벨 150 "감가상각비" + LongField(#,###, 폭 330) + 푸터 [저장][닫기]. open(trModel, header, callback) L58-64: 현재 금액을 채운다
 * 편집창: 11 §4a 규격(머리 아래 선·푸터 위 선·라벨 오른쪽 정렬, 필수 검사 없음)
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, message, Modal } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

export interface ModifyDepnCostTarget {
  trId: number;
  /** "[ 자산명 ] (취득일 yyyy-MM-dd)" */
  title: string;
  amt: number | null;
}

interface Props {
  target: ModifyDepnCostTarget | null;
  /** 저장한 금액 — AS-IS callback.execute(trModel)이 그리드 행을 바꾼다 */
  onSaved: (trId: number, amt: number | null) => void;
  onClose: () => void;
}

export const Ast06_Lookup_ModifyDepnCost: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [depnCost, setDepnCost] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L38-56) → show(), setting() L66-83: depn_cost.setValue(trModel.getAmt())
  useEffect(() => { if (target) setDepnCost(target.amt); }, [target]);

  // [E2] updateButton[저장].Select (L74) → update() L85-107: ast.Ast06_Tr.updateDepnCost → "저장이 완료되었습니다." → callback → hide()
  const update = async () => {
    if (!target) return;
    setSaving(true);
    try {
      await astApi.updateDepnCost(target.trId, depnCost);
      message.success('저장이 완료되었습니다.');
      onSaved(target.trId, depnCost);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={target !== null} title={target?.title ?? ''} width={500} maskClosable={false} onCancel={onClose} destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={[
        <Button key="save" type="save" loading={saving} onClick={update}>저장</Button>,
        /* [E1] cancleButton[닫기].Select (L67) → hide() */ <Button key="close" type="close" onClick={onClose}>닫기</Button>,
      ]}
    >
      <div style={{ padding: '12px 2px', display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 150, textAlign: 'right', paddingRight: 10 }}>감가상각비</span>
        <InputNumber style={{ width: 200 }} value={depnCost} onChange={v => setDepnCost(v == null ? null : Math.trunc(v))}
          formatter={v => (v == null ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
          parser={v => Number(String(v ?? '').replace(/,/g, '')) as unknown as number} />
      </div>
    </Modal>
  );
};
