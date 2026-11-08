/**
 * 펀드보수 발생내역 가져오기 창 (X23) — Icam10_Tab_OfficeMngFee의 [ICAM발생내역 가져오기]에서 연다
 * AS-IS: myApp/client/vi/icam/Icam10_Lookup_getICAM.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(date1, date2, feeType) L55-175: 모달 "펀드보수 발생내역 가져오기" 550×330, 라벨 폭 100, 작업기간 ~ · 운용사(이름 220 + 코드 50) · 펀드코드(100, "전체"),
 * 버튼 줄1 [보수발생내역 가져오기][보수원장 재생성], 줄2 [보수인출거래 재생성] + 안내 문구, 아래 가운데 [닫기]
 * 사무관리보수(20407)만 운용사 칸이 열려 있다(Sys15_Lookup_Corp, 선택안함이면 "전체"). 그 밖은 로그인 회사로 고정이고 칸은 비활성
 * (AS-IS는 코드 칸에 회사의 ICAM 운용사 코드를 넣지만 로그인 사용자에 그 값이 없어 비워 둔다 — 이 화면은 20407만 연다)
 * 편집창 규격: 11 §4a
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeJobReq } from '@/types/icam';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { useLoginUser } from '@/hooks/useLoginUser';

const FORMAT = 'YYYY-MM-DD';
const OFFICE_FEE = '20407';   // 미지급사무관리보수

interface Props {
  open: boolean;
  /** open(date1, date2, feeType): 열 때 작업기간과 보수구분 */
  startDate: Dayjs;
  closeDate: Dayjs;
  feeType: string;
  onClose: () => void;
}

/** 라벨 폭 100 (form.setLabelWidth(100)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
  </div>
);

export const Icam10_Lookup_getICAM: React.FC<Props> = ({ open, startDate: start0, closeDate: close0, feeType, onClose }) => {
  const user = useLoginUser();
  const [startDate, setStartDate] = useState<Dayjs>(start0);
  const [closeDate, setCloseDate] = useState<Dayjs>(close0);
  const [fundCode, setFundCode] = useState('');
  const [corpName, setCorpName] = useState('');
  const [corpCode, setCorpCode] = useState('');
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpOpen, setCorpOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const office = feeType === OFFICE_FEE;

  // 열 때마다 처음 값 (open(date1, date2, feeType))
  useEffect(() => {
    if (!open) return;
    setStartDate(start0);
    setCloseDate(close0);
    setFundCode('');
    setCorpName(office ? '' : user.companyName);
    setCorpCode('');
    setCorpId(office ? null : user.companyId);
  }, [open]);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] corpName[운용사].TriggerClick [result != null] (L80) → Sys15_Lookup_Corp.open(): 고르면 이름·코드·ID, 선택안함이면 "전체"
  const onCorp = (corp: { corpId: number; corpName: string | null; corpCode: string | null } | null) => {
    setCorpOpen(false);
    if (corp) {
      setCorpName(corp.corpName ?? '');
      setCorpCode(corp.corpCode ?? '');
      setCorpId(corp.corpId);
    } else {
      setCorpName('');
      setCorpCode('');
      setCorpId(null);
    }
  };

  // serviceCall(serviceName) L177-213: 펀드코드·운용사코드는 비면 "%". 성공이면 "정상정으로 수행되었습니다.", 실패면 서버 메시지
  const serviceCall = async (call: (req: IcamFeeJobReq) => Promise<void>) => {
    setBusy(true);   // this.mask("loading")
    try {
      await call({
        feeType,
        startDate: startDate.format(FORMAT),
        closeDate: closeDate.format(FORMAT),
        corpId,
        corpCode: corpCode === '' ? '%' : corpCode,
        fundCode: fundCode === '' ? '%' : fundCode,
      });
      message.success('정상정으로 수행되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    } finally {
      setBusy(false);   // unmask()
    }
  };

  return (
    <Modal
      open={open}
      title="펀드보수 발생내역 가져오기"
      width={560}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select (L161) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="작업기간">
          <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          ~
          <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </Field>
        <Field label="운용사">
          <LookupInput width={220} placeholder="전체" disabled={!office} value={corpName}
            onOpen={() => setCorpOpen(true)} onClear={() => onCorp(null)} />
          <Input style={{ width: 70 }} readOnly disabled={!office} value={corpCode} />
        </Field>
        <Field label="펀드코드">
          <Input style={{ width: 100 }} placeholder="전체" value={fundCode} onChange={e => setFundCode(e.target.value)} />
        </Field>
        <div style={{ paddingLeft: 100 }}>
          <Space>
            {/* [E2] getICAMButton[보수발생내역 가져오기].Select (L143) → serviceCall("icam.Icam10_Fee.getICAMFundFee") */}
            <Button type="download" disabled={busy} onClick={() => serviceCall(icamApi.getIcamFundFee)}>보수발생내역 가져오기</Button>
            {/* [E3] createFeeBookButton[보수원장 재생성].Select (L149) → serviceCall("icam.Icam10_Fee.createFeeBook") */}
            <Button type="generate" disabled={busy} onClick={() => serviceCall(icamApi.createFeeBook)}>보수원장 재생성</Button>
          </Space>
        </div>
        <div style={{ paddingLeft: 100, display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E4] createFeeRcvTrButton[보수인출거래 재생성].Select (L155) → serviceCall("icam.Icam10_Fee.createFeeRcvTr") */}
          <Button type="generate" disabled={busy} onClick={() => serviceCall(icamApi.createFeeRcvTr)}>보수인출거래 재생성</Button>
          <span>☜ 거래재생성은 운용사별로만 가능(펀드별 거래처리 안됨!!)</span>
        </div>
      </div>
      <Sys15_Lookup_Corp open={corpOpen} onResult={onCorp} onClose={() => setCorpOpen(false)} />
    </Modal>
  );
};
