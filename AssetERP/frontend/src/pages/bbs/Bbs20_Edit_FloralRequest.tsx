/**
 * 화환신청 등록/수정/상세내용 창 — Bbs20_Tab_FloralRequest(신청, Y12)의 [등록]·[수정] 아이콘, Bbs20_Tab_FloralRequestMng(확인, T21)의 [보기] 아이콘에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs20_Edit_FloralRequest.java (762줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L387-504: 모달 660×860, 라벨 폭 105, 신청일/신청자 · 경조구분+추가정보 · 경조문구 · 신청사유 · [보내는 사람(리본인쇄)] 회사명/발신인 · [받는 사람]+[불러오기] 회사명 · 수신인/직위(직책) · 부서/연락처 · 요청사항 · 발송요청일(요일)/발송요청시간 · 배달장소 · 선 · 신청공유 [설정] 비공개 · 증빙자료(높이 180), 아래 가운데 [저장][닫기]
 * 모드: insert() L107-161 → NEW "화환신청 등록"(번호를 먼저 받는다), edit() L163-175 → EDIT "화환신청 수정"(신청자 본인이 아니거나 신청상태가 10이 아니면 VIEW), view() L189-192 → VIEW "화환신청 상세내용"(disabled() L659-680: 입력칸 읽기 전용, [불러오기]·[저장] 숨김, 증빙자료 삭제 열 숨김)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Divider, Input, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { bbsFloralApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsFloralRequest } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Mkt01_Lookup_Select } from '@/components/lookup/Mkt01_Lookup_Select';
import { Bbs20_Grid_RelateFile } from './Bbs20_Grid_RelateFile';
import { Bbs20_Lookup_OccasionsOption } from './Bbs20_Lookup_OccasionsOption';
import { Bbs21_Lookup_FloralRequestShare } from './Bbs21_Lookup_FloralRequestShare';

const BLUE = '#0069B4';
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DATE = 'YYYY-MM-DD';

/** 라벨 폭 105 (form.setLabelWidth(105)), required면 파란 라벨(setHtmlStyle "0069B4") */
const Field: React.FC<{ label: string; required?: boolean; width?: number | string; children: React.ReactNode }> = ({ label, required, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width, minWidth: 0 }}>
    <Typography.Text style={{ width: 105, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10, color: required ? BLUE : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** 보내는 사람·받는 사람 머리말 (header1·header2 L454-468) */
const SectionTitle: React.FC<{ title: string; extra?: React.ReactNode }> = ({ title, extra }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Divider orientation="left" style={{ margin: '16px 0 4px', color: '#525252', fontWeight: 'bold', flex: 1 }}>{title}</Divider>
    {extra}
  </div>
);

/** setReasonEmpty() L356-385 — 경조구분별 신청사유 안내글 */
const reasonHint = (code: string | null): string => {
  switch (code) {
    case '10': return '예, 홍길동 지점장 자녀(홍두깨)결혼';
    case '20': return '예, 홍길동님의 부친상(故 홍철수 님)';
    case '30': return '예, ABC자산운용 본부장 승진';
    case '40': return '예, ABC자산운용 본부장 보직변경';
    case '45': return '예, ABC자산운용 대표이사 취임';
    case '50': return '예, ABC자산운용 개업';
    case '60': return '예, ABC자산운용 본점 이전(위치변경)';
    default: return '';
  }
};

export type FloralEditMode = 'NEW' | 'EDIT' | 'VIEW';
export interface FloralEditTarget {
  mode: FloralEditMode;
  /** NEW면 null(번호는 서버가 새로 준다) */
  model: BbsFloralRequest | null;
}

interface Props {
  target: FloralEditTarget | null;
  /** 저장 성공 뒤 (callback.execute() — 부른 화면이 목록을 다시 읽는다) */
  onSaved?: () => void;
  onClose: () => void;
}

interface Form {
  floralRequestId: number | null;
  regDate: Dayjs | null;
  personName: string;
  occasionsCode: string | null;
  occasionsName: string;
  addInfo: string;
  message: string;
  reason: string;
  sendCompany: string;
  sendEmp: string;
  sendPos: string;
  rcvCompany: string;
  rcvEmp: string;
  rcvPos: string;
  rcvDept: string;
  rcvTel: string;
  requests: string;
  sendRequestDate: Dayjs | null;
  sendRequestTime: string;
  rcvAddr: string;
}

const EMPTY: Form = {
  floralRequestId: null, regDate: null, personName: '', occasionsCode: null, occasionsName: '', addInfo: '', message: '', reason: '',
  sendCompany: '', sendEmp: '', sendPos: '', rcvCompany: '', rcvEmp: '', rcvPos: '', rcvDept: '', rcvTel: '', requests: '',
  sendRequestDate: null, sendRequestTime: '', rcvAddr: '',
};

const fromModel = (m: BbsFloralRequest): Form => ({
  floralRequestId: m.floralRequestId,
  regDate: m.regDate ? dayjs(m.regDate) : null,
  personName: m.personName ?? '',
  occasionsCode: m.occasionsCode ?? null,
  occasionsName: m.occasionsName ?? '',
  addInfo: m.addInfo ?? '',
  message: m.message ?? '',
  reason: m.reason ?? '',
  sendCompany: m.sendCompany ?? '',
  sendEmp: m.sendEmp ?? '',
  sendPos: m.sendPos ?? '',
  rcvCompany: m.rcvCompany ?? '',
  rcvEmp: m.rcvEmp ?? '',
  rcvPos: m.rcvPos ?? '',
  rcvDept: m.rcvDept ?? '',
  rcvTel: m.rcvTel ?? '',
  requests: m.requests ?? '',
  sendRequestDate: m.sendRequestDate ? dayjs(m.sendRequestDate) : null,
  sendRequestTime: m.sendRequestTime ?? '',
  rcvAddr: m.rcvAddr ?? '',
});

export const Bbs20_Edit_FloralRequest: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const user = useLoginUser();
  const [mode, setMode] = useState<FloralEditMode>('VIEW');
  const [f, setF] = useState<Form>(EMPTY);
  const [shareInfo, setShareInfo] = useState('');
  const [privateYn, setPrivateYn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareId, setShareId] = useState<number | null>(null);
  const [optionCode, setOptionCode] = useState<string | null>(null);
  const [loadChoice, setLoadChoice] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [mktOpen, setMktOpen] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(p => ({ ...p, [k]: v }));

  // [E0] 화면 열림 (생성자 L387-504) → show() — insert() L107-161 · edit() L163-175 · view() L189-192 → open() L194-235
  useEffect(() => {
    if (!target) return;
    setLoadChoice(false);
    if (target.mode === 'NEW') {
      setMode('NEW');
      setF(EMPTY);
      setShareInfo('');
      setPrivateYn(false);
      // insert(): 번호를 먼저 받고(DBUtil.setSeq), 신청일 = 오늘, 신청자 = 나, 보내는 사람 = 대표이사(직책 100) 첫 행 또는 나
      bbsFloralApi.newRequest()
        .then(n => setF({ ...EMPTY, floralRequestId: n.floralRequestId, regDate: dayjs(n.regDate), personName: n.personName, sendCompany: n.sendCompany, sendEmp: n.sendEmp, sendPos: n.sendPos }))
        .catch(err => { message.error(errorMessage(err, '새 신청 준비 실패')); onClose(); });
      return;
    }
    const m = target.model;
    if (!m) return;
    // edit() L163-175: 신청자 본인이 아니거나 신청상태가 10이 아니면 VIEW
    const mode2: FloralEditMode = target.mode === 'EDIT' && m.personId === user.userId && m.statusCode === '10' ? 'EDIT' : 'VIEW';
    setMode(mode2);
    setF(fromModel(m));
    setShareInfo(m.shareInfo ?? '');
    setPrivateYn(m.privateYn === 'true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target) return null;
  const ro = mode === 'VIEW';
  const title = mode === 'NEW' ? '화환신청 등록' : mode === 'EDIT' ? '화환신청 수정' : '화환신청 상세내용';

  // open() L215-232: 경조구분이 10(결혼)·20(근조)일 때만 추가정보 칸을 켠다
  const addInfoEnabled = f.occasionsCode === '10' || f.occasionsCode === '20';
  // [E1] sendRequestDate.ValueChange (L240) → getDayKor() L630-657: 발송요청일 옆 요일 "(월요일)"
  const dayKor = f.sendRequestDate ? `(${DAYS[f.sendRequestDate.day()]}요일)` : '';

  // [E2] occasionsName[경조구분].Collapse (L249) → 10·20이면 경조구분 상세 창(Bbs20_Lookup_OccasionsOption)·추가정보 칸 켜기, 아니면 추가정보 비움 → getMessage(code), 증빙 업로드 이름, occasionsCode 반영 → setReasonEmpty()
  const onOccasionsChange = (code: string | undefined, name?: string) => {
    if (!code) return;
    setF(p => ({ ...p, occasionsCode: code, occasionsName: name ?? '', addInfo: code === '10' || code === '20' ? p.addInfo : '' }));
    if (code === '10' || code === '20') setOptionCode(code);
    // getMessage() L506-521: bbs.Bbs22_FloralMessage.getMessage(companyId, code) → 경조문구
    bbsFloralApi.getMessage(code)
      .then(msg => { if (msg != null) setF(p => ({ ...p, message: msg })); })
      .catch(() => undefined);
  };

  // [E3] loadButton[불러오기].Select (L305) → 확인창 "불러오기"(항목을 선택해주세요) [임직원][거래처]
  // [E4] button01[임직원].Select (L320) → empLoad() L682-700
  // [E5] button02[거래처].Select (L327) → lookupTargetCompany() L702-741
  const deleteDefaultShare = async () => {
    if (f.floralRequestId == null) return;
    try {
      await bbsFloralApi.deleteDefaultShare(f.floralRequestId);
      setShareInfo('');
    } catch (err) {
      message.error(errorMessage(err, '공유 삭제 실패'));
    }
  };

  // [E6] shareButton[설정].Select (L336) → lookupShare() L523-533: Bbs21_Lookup_FloralRequestShare.open(신청ID, callback → 신청공유 문구)

  // [E7] updateButton[저장].Select (L342) → update() L565-628: 마지막으로 어긋난 검사의 문구가 나온다
  const update = async () => {
    let msg: string | null = null;
    if ((f.occasionsCode === '10' || f.occasionsCode === '20') && !f.addInfo) msg = '결혼,근조의 상세 값을 입력해주세요';
    if (!f.regDate) msg = '신청일은 필수입력 값입니다.';
    if (!f.occasionsCode) msg = '경조구분은 필수입력 값입니다.';
    if (!f.message) msg = '문구는 필수입력 값입니다.';
    if (!f.sendCompany) msg = '회사명은 필수입력 값입니다.';
    if (!f.sendEmp) msg = '발신인은 필수입력 값입니다.';
    if (!f.rcvCompany) msg = '회사명은 필수입력 값입니다.';
    if (!f.rcvEmp) msg = '담당자는 필수입력 값입니다.';
    if (!f.rcvTel) msg = '연락처는 필수입력 값입니다.';
    if (!f.rcvAddr) msg = '배달장소는 필수입력 값입니다.';
    if (!f.sendRequestDate) msg = '발송요청일은 필수입력 값입니다.';
    if (!f.reason) msg = '신청사유는 필수입력 값입니다.';
    if (msg) { message.warning(msg); return; }
    if (f.floralRequestId == null) return;
    setSaving(true);
    try {
      await bbsFloralApi.saveRequest({
        floralRequestId: f.floralRequestId,
        regDate: f.regDate!.format(DATE),
        occasionsCode: f.occasionsCode!,
        message: f.message,
        sendCompany: f.sendCompany,
        sendEmp: f.sendEmp,
        sendPos: f.sendPos || null,
        rcvCompany: f.rcvCompany,
        rcvEmp: f.rcvEmp,
        rcvPos: f.rcvPos || null,
        rcvDept: f.rcvDept || null,
        rcvTel: f.rcvTel,
        rcvAddr: f.rcvAddr,
        sendRequestDate: f.sendRequestDate!.format(DATE),
        sendRequestTime: f.sendRequestTime || null,
        reason: f.reason,
        addInfo: f.addInfo || null,
        requests: f.requests || null,
        privateYn,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  /** 글자 칸 — 보기 모드는 읽기 전용 */
  const txt = (k: 'message' | 'reason' | 'sendCompany' | 'sendEmp' | 'rcvCompany' | 'rcvEmp' | 'rcvPos' | 'rcvDept' | 'rcvTel' | 'requests' | 'sendRequestTime' | 'rcvAddr', placeholder?: string) => (
    <Input readOnly={ro} value={f[k]} placeholder={ro ? undefined : placeholder} onChange={e => set(k, e.target.value)} />
  );

  return (
    <>
      <Modal
        open
        title={title}
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
            <Space>
              {!ro && <Button type="save" onClick={update} loading={saving}>저장</Button>}
              {/* [E8] closeButton[닫기].Select (L348) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="신청일" required width="50%">
              {ro
                ? <Input readOnly value={f.regDate?.format(DATE) ?? ''} />
                : <DatePicker style={{ width: '100%' }} allowClear={false} value={f.regDate} onChange={d => set('regDate', d)} />}
            </Field>
            <Field label="신청자" required width="50%"><Input disabled value={f.personName} /></Field>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="경조구분" required width="50%">
              {ro
                ? <Input readOnly value={f.occasionsName} placeholder="선택하세요" />
                : <SystemCodeComboBox kindCd="OccasionsCode" style={{ width: '100%' }} placeholder="선택하세요" allowClear={false} value={f.occasionsCode ?? undefined} onChange={onOccasionsChange} />}
            </Field>
            <div style={{ flex: 1 }}>
              <Input value={f.addInfo} readOnly placeholder={ro ? undefined : '구분값에 따라 자동으로 입력됩니다'} disabled={!addInfoEnabled} />
            </div>
          </div>
          <Field label="경조문구" required>{txt('message')}</Field>
          <Field label="신청사유" required>{txt('reason', reasonHint(f.occasionsCode))}</Field>
          <SectionTitle title="보내는 사람 (리본인쇄)" />
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="회사명" required width="50%">{txt('sendCompany')}</Field>
            <Field label="발신인" required width="50%">{txt('sendEmp')}</Field>
          </div>
          <SectionTitle title="받는 사람" extra={!ro && <Button type="register" onClick={() => setLoadChoice(true)}>불러오기</Button>} />
          <Field label="회사명" required width="50%">{txt('rcvCompany', 'ABC자산운용')}</Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="수신인" required width="50%">{txt('rcvEmp', '홍길동')}</Field>
            <Field label="직위(직책)" width="50%">{txt('rcvPos')}</Field>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="부서" width="50%">{txt('rcvDept')}</Field>
            <Field label="연락처" required width="50%">{txt('rcvTel')}</Field>
          </div>
          <Field label="요청사항">{txt('requests', '예, 동양난으로 보내주세요')}</Field>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Field label="발송요청일" required width="45%">
              {ro
                ? <Input readOnly value={f.sendRequestDate?.format(DATE) ?? ''} />
                : <DatePicker style={{ width: '100%' }} allowClear={false} value={f.sendRequestDate} onChange={d => set('sendRequestDate', d)} />}
            </Field>
            <Typography.Text style={{ width: 70, flex: 'none', lineHeight: '32px' }}>{dayKor}</Typography.Text>
            <Field label="발송요청시간" width="45%">{txt('sendRequestTime', '오전/오후/즉시/특정시간')}</Field>
          </div>
          <Field label="배달장소" required>{txt('rcvAddr')}</Field>
          <Divider style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Field label="신청공유" width="55%"><Input value={shareInfo} onChange={e => setShareInfo(e.target.value)} /></Field>
            <Button type="register" onClick={() => setShareId(f.floralRequestId)}>설정</Button>
            <Typography.Text style={{ lineHeight: '32px', paddingLeft: 10 }}>비공개</Typography.Text>
            <Checkbox checked={privateYn} onChange={e => setPrivateYn(e.target.checked)} />
          </div>
          <Field label="증빙자료">
            <div style={{ height: 180 }}>
              {/* NEW: fileList.setButtonName("90", true) L199 — 경조구분을 고르면 setButtonName(code, true) */}
              <Bbs20_Grid_RelateFile parentId={f.floralRequestId} occasionsCode={f.occasionsCode ?? (mode === 'NEW' ? '90' : null)} disabled={ro} />
            </div>
          </Field>
        </div>
      </Modal>
      <Bbs21_Lookup_FloralRequestShare floralRequestId={shareId} onResult={setShareInfo} onClose={() => setShareId(null)} />
      {/* 경조구분 상세 창 — 확인한 글자가 추가정보 칸에 들어간다(닫기는 값을 바꾸지 않는다) */}
      <Bbs20_Lookup_OccasionsOption occasionsCode={optionCode} onResult={t => set('addInfo', t)} onClose={() => setOptionCode(null)} />
      {/* 불러오기 확인창 L305-335 */}
      <Modal open={loadChoice} title="불러오기" width={360} maskClosable={false} destroyOnClose onCancel={() => setLoadChoice(false)} footer={null}>
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ marginBottom: 16 }}>항목을 선택해주세요</div>
          <Space>
            <Button type="select" onClick={() => { setLoadChoice(false); setEmpOpen(true); }}>임직원</Button>
            <Button type="select" onClick={() => { setLoadChoice(false); setMktOpen(true); }}>거래처</Button>
          </Space>
        </div>
      </Modal>
      {/* empLoad() L682-700: Emp00_Lookup_SelectSingle.open(오늘, callback) → 받는 사람에 회사명·성명·직위·부서·휴대폰, 기본 공유 삭제 */}
      <Emp00_Lookup_SelectSingle
        open={empOpen}
        transDate={dayjs().format(DATE)}
        noneLabel={null}
        onResult={r => {
          if (!r) return;
          setF(p => ({ ...p, rcvCompany: user.companyName, rcvEmp: r.korNm ?? '', rcvPos: r.posNm ?? '', rcvDept: r.orgKorNm ?? '', rcvTel: r.mobileTelNo ?? '' }));
          void deleteDefaultShare();
        }}
        onClose={() => setEmpOpen(false)}
      />
      {/* lookupTargetCompany() L702-741: Mkt01_Lookup_Select.open("SINGLE", callback) → 받는 사람 채우고 거래처의 기본 공유를 신청공유로 복사 */}
      <Mkt01_Lookup_Select
        type={mktOpen ? 'SINGLE' : null}
        onResult={async rows => {
          const r = rows[0];
          setF(p => ({ ...p, rcvCompany: r.targetCompanyName ?? '', rcvEmp: r.managerName ?? '', rcvPos: r.managerPosName ?? '', rcvDept: r.managerOrgName ?? '', rcvTel: r.managerTel ?? '' }));
          if (f.floralRequestId == null) return;
          try {
            await bbsFloralApi.deleteDefaultShare(f.floralRequestId);
            setShareInfo(await bbsFloralApi.insertDefaultShare(f.floralRequestId, r.targetCompanyId) ?? '');
          } catch (err) {
            message.error(errorMessage(err, '공유 지정 실패'));
          }
        }}
        onClose={() => setMktOpen(false)}
      />
    </>
  );
};
