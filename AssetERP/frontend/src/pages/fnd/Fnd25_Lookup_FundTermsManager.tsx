/**
 * 펀드규약 수정 창 (P12) — Fnd25_Tab_FundTermsManager 왼쪽 목록의 수정 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd25_Lookup_FundTermsManager.java (247줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L89-129: 모달 "펀드규약 수정" 700×230, 라벨 100, 펀드규약명(655, 읽기 전용) / 신청구분(260, 콤보 FundTermsType) · 조회순서(165) · 예탁원코드(230, 조회창), 아래 가운데 [저장][삭제][닫기]
 * UX보강(10): 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, Input, message, Modal, Space, Typography } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { Terms } from '@/types/fnd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Fnd01_Lookup_SelectSingle } from '@/components/lookup/Fnd01_Lookup_SelectSingle';

interface Props {
  /** edit() L77-87: 고른 규약 — 값이 있으면 열린다 */
  target: Terms | null;
  /** 저장·삭제 뒤 (AS-IS callBack.execute()) — 부르는 쪽이 다시 조회한다 */
  onDone: () => void;
  onClose: () => void;
}

/** 라벨 폭 100 (form.setLabelWidth(100)) */
const Field: React.FC<{ label: string; width: number | string; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Fnd25_Lookup_FundTermsManager: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [termsType, setTermsType] = useState<string | null>(null);
  const [seq, setSeq] = useState<number | null>(null);
  const [fundId, setFundId] = useState<number | null>(null);
  const [ksdFundCode, setKsdFundCode] = useState<string | null>(null);
  const [fundOpen, setFundOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  /** originFundId = termsDetailModel.getFundId() (edit L77-87) */
  const originFundId = target?.fundId ?? null;

  // [E0] 화면 열림 (생성자 L89-129) → show(), edit() L77-87: 고른 규약의 값으로 채운다
  useEffect(() => {
    if (!target) return;
    setTermsType(target.termsType ?? null);
    setSeq(target.seq ?? null);
    setFundId(target.fundId ?? null);
    setKsdFundCode(target.ksdFundCode ?? null);
  }, [target]);

  // [E1] updateButton[저장].Select (L97) → ksdFundCheck() L156-174 → update() L176-196
  // 종료일은 원본 모델(selectBySearchText)에 없어 null이 간다 — 서버가 종료일을 비운다(원본 그대로)
  const update = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await fndApi.updateTerms(target.termsId, { termsType, seq, fundId, closeDate: null, originFundId });
      message.info('저장이 완료되었습니다');
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E3] deleteButton[삭제].Select (L109) → delete() L198-221: "해당 펀드규약을 삭제하시겠습니까?"(제목 "삭제") → [E5] messageBox.DialogHide [YES] (L201) → fnd.Fnd26_TermsDetail.deleteAll
  const remove = () => {
    if (!target) return;
    Modal.confirm({
      title: '삭제',
      content: '해당 펀드규약을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await fndApi.deleteTerms(target.termsId);
          message.info('삭제가 완료되었습니다.');
          onDone();
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={!!target}
      title="펀드규약 수정"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={busy}>저장</Button>
            <Button type="delete" onClick={remove}>삭제</Button>
            {/* [E2] closeButton[닫기].Select (L103) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '15px 10px 10px' }}>
        <Field label="펀드규약명 " width={655}><Input disabled value={target?.termsName ?? ''} /></Field>
        <Space size={10} align="start">
          <Field label="신청구분 " width={260}>
            <SystemCodeComboBox kindCd="FundTermsType" placeholder="(선택하세요)" style={{ width: '100%' }} value={termsType ?? undefined}
              onChange={code => setTermsType(code ?? null)} />
          </Field>
          <Field label="조회순서 " width={165}>
            <InputNumber style={{ width: '100%' }} precision={0} value={seq} onChange={v => setSeq(v == null ? null : Number(v))} />
          </Field>
          <Field label="예탁원코드 " width={230}>
            {/* [E4] ksdFundCode[예탁원코드].TriggerClick (L117) → openLookupOpr() L223-238: Fnd01_Lookup_SelectSingle.openNone2 */}
            <LookupInput value={ksdFundCode ?? ''} width={130} onOpen={() => setFundOpen(true)} />
          </Field>
        </Space>
      </div>
      <Fnd01_Lookup_SelectSingle
        open={fundOpen}
        none="none2"
        onResult={fund => {
          setKsdFundCode(fund?.ksdFundCode ?? null);
          setFundId(fund?.fundId ?? null);
        }}
        onClose={() => setFundOpen(false)}
      />
    </LookupModal>
  );
};
