/**
 * 화환신청 상세내용 창 (보기 모드) — Bbs20_Tab_FloralRequestMng 행의 [보기] 아이콘에서 연다 (T21 1단계)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Edit_FloralRequest.java (762줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L387-504: 모달 660×860, 라벨 폭 105, 신청일/신청자 · 경조구분+추가정보 · 경조문구 · 신청사유 · [보내는 사람(리본인쇄)] 회사명/발신인 · [받는 사람] 회사명 · 수신인/직위(직책) · 부서/연락처 · 요청사항 · 발송요청일(요일)/발송요청시간 · 배달장소 · 선 · 신청공유 [설정] 비공개 · 증빙자료(높이 180), 아래 가운데 [저장][닫기]
 * view() L189-192 → open() L194-235: actionName "VIEW" — 제목 "화환신청 상세내용", disabled() L659-680(입력칸 읽기 전용, [불러오기]·[저장] 숨김, 증빙자료 삭제 열 숨김)
 * 1단계: 보기 모드만 (신청자 본인의 등록·수정 `insert`·`edit` — E2·E3·E4·E5·E7과 경조구분 옵션 `Bbs20_Lookup_OccasionsOption`·임직원 `Emp00_Lookup_SelectSingle`·거래처 `Mkt01_Lookup_Select` 불러오기 — 은 신청 화면 `Bbs20_Tab_FloralRequest` 몫)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Input, Modal, Typography } from 'antd';
import dayjs from 'dayjs';
import { BbsFloralRequest } from '@/types/bbs';
import { Button } from '@/components/button';
import { Bbs20_Grid_RelateFile } from './Bbs20_Grid_RelateFile';
import { Bbs21_Lookup_FloralRequestShare } from './Bbs21_Lookup_FloralRequestShare';

const BLUE = '#0069B4';
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 라벨 폭 105 (form.setLabelWidth(105)), required면 파란 라벨(setHtmlStyle "0069B4") */
const Field: React.FC<{ label: string; required?: boolean; width?: number | string; children: React.ReactNode }> = ({ label, required, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width, minWidth: 0 }}>
    <Typography.Text style={{ width: 105, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10, color: required ? BLUE : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** 보내는 사람·받는 사람 머리말 (header1·header2 L454-468) */
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Divider orientation="left" style={{ margin: '16px 0 4px', color: '#525252', fontWeight: 'bold' }}>{title}</Divider>
);

interface Props {
  /** view(model, callback) — 값이 있으면 열린다 */
  model: BbsFloralRequest | null;
  onClose: () => void;
}

export const Bbs20_Edit_FloralRequest: React.FC<Props> = ({ model, onClose }) => {
  const [shareInfo, setShareInfo] = useState('');
  const [privateYn, setPrivateYn] = useState(false);
  const [shareId, setShareId] = useState<number | null>(null);
  useEffect(() => {
    setShareInfo(model?.shareInfo ?? '');
    setPrivateYn(model?.privateYn === 'true');
  }, [model]);
  if (!model) return null;

  // [E0] 화면 열림 (생성자 L387-504) → show()
  // open() L215-232: 경조구분이 10(결혼)·20(근조)일 때만 추가정보 칸을 켠다
  const addInfoEnabled = model.occasionsCode === '10' || model.occasionsCode === '20';
  // [E2 생략] occasionsName[경조구분].Collapse (L249) — 보기 모드는 경조구분이 읽기 전용(disabled() L661)이라 바뀌지 않는다 (신청 화면 몫)
  // [E3 생략] loadButton[불러오기].Select (L305) — 보기 모드에서 숨김(disabled() L676)
  // [E4 생략] button01[임직원].Select (L320) — [불러오기] 안의 단추라 보기 모드에선 열리지 않는다
  // [E5 생략] button02[거래처].Select (L327) — 〃
  // [E1] sendRequestDate.ValueChange (L240) → getDayKor() L630-657: 발송요청일 옆 요일 "(월요일)"
  const dayKor = model.sendRequestDate ? `(${DAYS[dayjs(model.sendRequestDate).day()]}요일)` : '';
  const ro = <K extends keyof BbsFloralRequest>(k: K, placeholder?: string) => (
    <Input readOnly value={(model[k] as string | null | undefined) ?? ''} placeholder={placeholder} />
  );

  return (
    <Modal
      open
      title="화환신청 상세내용"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        body: { maxHeight: '70vh', overflowY: 'auto' },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E7] updateButton[저장] — 보기 모드(disabled() L676-677)에서는 숨김 · [E8] closeButton[닫기].Select (L348) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="신청일" required width="50%"><Input readOnly value={model.regDate ?? ''} /></Field>
          <Field label="신청자" required width="50%"><Input disabled value={model.personName ?? ''} /></Field>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="경조구분" required width="50%"><Input readOnly value={model.occasionsName ?? ''} placeholder="선택하세요" /></Field>
          <div style={{ flex: 1 }}>
            <Input value={model.addInfo ?? ''} placeholder="구분값에 따라 자동으로 입력됩니다" disabled={!addInfoEnabled} readOnly />
          </div>
        </div>
        <Field label="경조문구" required>{ro('message')}</Field>
        <Field label="신청사유" required>{ro('reason')}</Field>
        <SectionTitle title="보내는 사람 (리본인쇄)" />
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="회사명" required width="50%">{ro('sendCompany')}</Field>
          <Field label="발신인" required width="50%">{ro('sendEmp')}</Field>
        </div>
        <SectionTitle title="받는 사람" />
        <Field label="회사명" required width="50%">{ro('rcvCompany', 'ABC자산운용')}</Field>
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="수신인" required width="50%">{ro('rcvEmp', '홍길동')}</Field>
          <Field label="직위(직책)" width="50%">{ro('rcvPos')}</Field>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="부서" width="50%">{ro('rcvDept')}</Field>
          <Field label="연락처" required width="50%">{ro('rcvTel')}</Field>
        </div>
        <Field label="요청사항">{ro('requests', '예, 동양난으로 보내주세요')}</Field>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Field label="발송요청일" required width="45%"><Input readOnly value={model.sendRequestDate ?? ''} /></Field>
          <Typography.Text style={{ width: 70, flex: 'none', lineHeight: '32px' }}>{dayKor}</Typography.Text>
          <Field label="발송요청시간" width="45%">{ro('sendRequestTime', '오전/오후/즉시/특정시간')}</Field>
        </div>
        <Field label="배달장소" required>{ro('rcvAddr')}</Field>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Field label="신청공유" width="55%"><Input value={shareInfo} onChange={e => setShareInfo(e.target.value)} /></Field>
          {/* [E6] shareButton[설정].Select (L336) → lookupShare() L523-533: Bbs21_Lookup_FloralRequestShare.open(신청ID, callback → 신청공유 문구) */}
          <Button type="register" onClick={() => setShareId(model.floralRequestId)}>설정</Button>
          <Typography.Text style={{ lineHeight: '32px', paddingLeft: 10 }}>비공개</Typography.Text>
          <Checkbox checked={privateYn} onChange={e => setPrivateYn(e.target.checked)} />
        </div>
        <Field label="증빙자료">
          <div style={{ height: 180 }}>
            <Bbs20_Grid_RelateFile parentId={model.floralRequestId} occasionsCode={model.occasionsCode} disabled />
          </div>
        </Field>
      </div>
      <Bbs21_Lookup_FloralRequestShare floralRequestId={shareId} onResult={setShareInfo} onClose={() => setShareId(null)} />
    </Modal>
  );
};
