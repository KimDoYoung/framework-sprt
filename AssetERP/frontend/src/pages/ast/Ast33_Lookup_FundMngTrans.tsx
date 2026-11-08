/**
 * 이관정보 등록/변경 편집창 (X34) — Ast33_Tab_FundMngTrans의 [등록](NEW)·[수정] 아이콘(MODI)이 연다
 * AS-IS: myApp/client/vi/ast/Ast33_Lookup_FundMngTrans.java (352줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L86-99: 새 행(회사=로그인 회사, 이관일자=오늘, 운용사(corpId)=로그인 회사, 통화 KRW)으로 NEW를 연다. 닫기는 그 행을 그리드에서 뺀다(TOBE는 행을 미리 넣지 않는다)
 * open() L101-144: 모달 600×500 NEW "이관정보 등록"(이관구분 "이관(출)") / MODI "이관정보 변경"(이관구분 비활성 + 빨간 경고). MODI에서 이관(출)이면 펀드코드 읽기 전용·통화/외화/원화 활성, 이관(입)이면 펀드코드 활성·통화/외화/원화 비활성
 * getEditor() L229-279: 라벨 폭 120, 이관구분 · 이관일자 · 펀드(코드 210 + 이름 300) · 통화 · 외화미수보수 · 원화미수보수 · 적요(높이 50) · 파란 안내 · 빨간 경고, 아래 가운데 저장·닫기
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 * X28 `Ast33_Lookup_OfficeMngFundTrans`와 달리 운용사 칸이 없다 — 운용사는 로그인 회사로 고정이고 보수원장 조회창도 그 운용사로만 찾는다
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { FundTrans, PreHoldFee } from '@/types/ast';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ast30_Lookup_HoldFee } from './Ast30_Lookup_HoldFee';

const FORMAT = 'YYYY-MM-DD';

interface Props {
  /** 열린 방식 — NEW: 새 행, MODI: model을 고친다 */
  actionName: 'NEW' | 'MODI';
  /** MODI에서 고칠 이관 행 */
  model: FundTrans | null;
  onClose: () => void;
  /** callback.execute(fundTransModel): 저장한 행 */
  onDone: (saved: FundTrans) => void;
}

/** 라벨 폭 120 (form.setLabelWidth(120)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 120, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const comma = (v: number | string | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));

export const Ast33_Lookup_FundMngTrans: React.FC<Props> = ({ actionName, model, onClose, onDone }) => {
  const user = useLoginUser();
  const isNew = actionName === 'NEW';
  // [E0] 화면 열림 (생성자 L82-84) → openNew() L86-99 / open() L101-144 → editDriver.edit(model)
  const [f, setF] = useState<FundTrans>(() => model ?? ({
    companyId: user.companyId,
    fundTransCode: '1',            // fundTransName.setText("이관(출)")
    date: dayjs().format(FORMAT),  // LoginUser.getToday()
    corpId: user.companyId,        // insertModel.setCorpId(LoginUser.getCompanyId())
    curCode: 'KRW',
    fundCode: '',
  } as FundTrans));
  const [saving, setSaving] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const set = (patch: Partial<FundTrans>) => setF(prev => ({ ...prev, ...patch }));
  /** 이관구분 1 = 이관(출) */
  const out = f.fundTransCode === '1';

  // [E1] fundTransName[이관구분].Collapse (L151) → 이관(출)이면 펀드코드 선택·통화/외화/원화 활성, 이관(입)이면 펀드코드 직접 입력·통화/외화/원화 비활성 + KRW/0/0
  const changeTransCode = (code: string | undefined) => {
    if (code === '1') set({ fundTransCode: code });
    else set({ fundTransCode: code ?? null, curCode: 'KRW', forFee: 0, fee: 0 });
  };

  // [E2] fundCode[펀드].TriggerClick (L171) → 이관(출)이면 보수원장(Ast30_Lookup_HoldFee) 팝업, 이관(입)이면 "펀드코드를 입력해주세요"
  const openFund = () => {
    if (out) setHoldOpen(true);
    else message.warning('펀드코드를 입력해주세요');
  };
  const onHold = (rows: PreHoldFee[]) => {
    const r = rows[0];
    setHoldOpen(false);
    if (!r) return;
    set({ fundCode: r.fundCode, fundName: r.fundName, forFee: r.forFee, fee: r.fee, curCode: r.curCode });
  };

  // [E4] updateButton[저장].Select (L209) → preUpdate() L281-310 → update() L312-342 (회계마감 검사는 서버가 먼저 한다)
  const update = async () => {
    if (!f.date) return message.warning('해지일자(이관일자)는 필수입력 항목입니다');
    if (!f.fundCode) return message.warning('펀드코드는 필수입력 항목입니다');
    setSaving(true);
    try {
      const saved = await astApi.saveFundTrans([f]);
      message.success('저장이 완료되었습니다.');
      onClose();
      if (saved[0]) onDone(saved[0]);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={isNew ? '이관정보 등록' : '이관정보 변경'}
      width={600}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L215) → NEW: 임시 행 제거 + callback(null) / MODI: callback(model) 뒤 hide() — 바뀐 것이 없으니 닫기만 */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="이관구분">
          <SystemCodeComboBox kindCd="FundTransCode" style={{ width: 260 }} disabled={!isNew} value={f.fundTransCode ?? undefined} onChange={changeTransCode} />
        </Field>
        <Field label="이관일자">
          <DatePicker style={{ width: 260 }} allowClear={false} format={FORMAT} value={f.date ? dayjs(f.date) : null} onChange={d => set({ date: d ? d.format(FORMAT) : null })} />
        </Field>
        <Field label="펀드">
          <Space.Compact style={{ width: '100%' }}>
            {out
              ? <LookupInput value={f.fundCode ?? ''} width={210} disabled={!isNew} onOpen={openFund} />
              : <Input style={{ width: 210 }} value={f.fundCode ?? ''} onChange={e => set({ fundCode: e.target.value })}
                  suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={openFund} />} />}
            <Input readOnly value={f.fundName ?? ''} />
          </Space.Compact>
        </Field>
        <Field label="통화">
          <SystemCodeComboBox kindCd="CurCode" style={{ width: 260 }} disabled={!out} value={f.curCode ?? undefined} onChange={code => set({ curCode: code ?? null })} />
        </Field>
        <Field label="외화미수보수">
          <InputNumber style={{ width: 260 }} disabled={!out} controls={false} formatter={v => comma(v)} parser={v => Number((v ?? '').replace(/,/g, ''))}
            value={f.forFee} onChange={v => set({ forFee: v == null ? null : Number(v) })} />
        </Field>
        <Field label="원화미수보수">
          {/* [E3] fee[원화미수보수].ValueChange (L200) → 통화가 KRW면 외화미수보수 = 원화미수보수 */}
          <InputNumber style={{ width: 260 }} disabled={!out} controls={false} precision={0} formatter={v => comma(v)} parser={v => Number((v ?? '').replace(/,/g, ''))}
            value={f.fee} onChange={v => set(f.curCode === 'KRW' ? { fee: v == null ? null : Number(v), forFee: v == null ? null : Number(v) } : { fee: v == null ? null : Number(v) })} />
        </Field>
        <Field label="적요">
          <Input.TextArea rows={2} value={f.note ?? ''} onChange={e => set({ note: e.target.value })} />
        </Field>
        <div style={{ paddingLeft: 20, fontSize: 13, fontWeight: 'bold', color: '#456EA6', lineHeight: 1.6 }}>
          ※ 처리전 ICAM운용보수 발생내역을 확인하여 이관일의 보수인출 금액을 정리하세요<br />
          ※ 이관일자 : 이관(입) 등록시 최초 보수발생일 / 이관(출) 등록시 최종 보수발생 다음일
        </div>
        {!isNew && (
          <div style={{ paddingLeft: 20, fontSize: 13, fontWeight: 'bold', color: '#DD5E5E' }}>
            ※ 저장시 기존내역을 삭제 후 재처리합니다. (미수결제등 관련 거래가 재생성됩니다)
          </div>
        )}
      </div>
      {/* lookupBook.open(date, companyId, callback) — 운용사 = 로그인 회사로 고정이라 corpId를 넘긴다(운용사 열 숨김) */}
      <Ast30_Lookup_HoldFee open={holdOpen} stdDate={f.date ?? ''} corpId={user.companyId} onResult={onHold} onClose={() => setHoldOpen(false)} />
    </Modal>
  );
};
