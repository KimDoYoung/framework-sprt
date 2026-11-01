/**
 * 복리후생비 신청 창 (Y06) — Emp17_Tab_Benefit의 [등록]에서 연다
 * AS-IS: myApp/client/vi/emp/Emp17_Lookup_Benefit.java (490줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L101-145: 모달 640×260 "복리후생비 신청", 아래 가운데 [상신][닫기]. getEditor() L147-188: 줄1 = 신청구분 콤보 + 내용(코드 끝이 Y일 때만 입력),
 *   줄2 = (코드 끝에서 둘째 글자가 B) 사용월 [년 텍스트][월 콤보] / (A) 발생일자 + 신청금액, 안내 문구. 사용월 기본 = 지난달.
 * [상신] update() L190-300: 입력 검사 → emp.Emp17_Benefit.modelUpdate(신청 행 먼저 저장) → 전자결재 편집창(Apr01_Edit_ApprDoc.insertLinkApproval, 링크코드 = 신청구분 설정의 발행 연결코드)
 *   → 상신되면 updateApprId, 저장 없이 닫으면 deleteBenefitId로 신청 행을 지운다.
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬.
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { empBenefitApi, empBenefitInfoApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { BenefitType } from '@/types/emp';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const LABEL = 100;  // form.setLabelWidth(100)
const MSG = ['※ 청구월이 아닌 명세서상의 사용월을 선택해주세요.', '(2023년 6월 청구명세서인 경우 사용월은 5월이므로 5월을 선택해야 합니다)'];

interface Props {
  open: boolean;
  /** 상신 뒤 callBack.execute() — 부른 화면이 목록을 다시 읽는다 */
  onSaved: () => void;
  onClose: () => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ width: LABEL, textAlign: 'right', paddingRight: 10, flex: 'none', fontWeight: 'bold' }}>{label}</span>
    {children}
  </div>
);

export const Emp17_Lookup_Benefit: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const [types, setTypes] = useState<BenefitType[]>([]);
  const [benefitCode, setBenefitCode] = useState<string | undefined>(undefined);
  const [benefitDetail, setBenefitDetail] = useState('');
  // 생성자 L110-115: 사용월 기본 = 지난달
  const last = dayjs().subtract(1, 'month');
  const [year, setYear] = useState(last.format('YYYY'));
  const [month, setMonth] = useState(last.format('MM'));
  const [occDate, setOccDate] = useState<Dayjs | null>(null);
  const [issueAmt, setIssueAmt] = useState<number | null>(null);
  const [linkCode, setLinkCode] = useState<string | undefined>(undefined);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; refId: number; yyyy: string; mm: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const linkSaved = useRef(false);

  // [E0] 화면 열림 (생성자 L101-145) → show() / insert() L87-99: classTreeModel = null, 신청일 오늘 / 생성자 L131-137: 신청구분 콤보 조회
  useEffect(() => {
    if (!open) return;
    setBenefitCode(undefined); setBenefitDetail(''); setOccDate(null); setIssueAmt(null); setClassTreeId(null); setLinkCode(undefined);
    const l = dayjs().subtract(1, 'month');
    setYear(l.format('YYYY')); setMonth(l.format('MM'));
    empBenefitApi.searchBenefitTypes().then(setTypes).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open]);

  const suffixY = benefitCode?.endsWith('Y') ?? false;  // 코드 끝이 Y면 내용 입력
  const dateCode = benefitCode ? benefitCode.substring(benefitCode.length - 2, benefitCode.length - 1) : '';  // B 사용월 / A 발생일자

  // [E4] benefitName.Selection (L156) → updateRow02(), searchDcr() L317-354
  const onType = async (code: string) => {
    setBenefitCode(code);
    setBenefitDetail('');
    try {
      const info = await empBenefitInfoApi.getBenefitInfoByCode(code);
      if (info != null) {
        setLinkCode(info.issueLinkCode ?? undefined);
        const list = await dcrApi.searchClassTreeByLinkCode(info.issueLinkCode ?? '');
        if (list.length > 0) setClassTreeId(list[list.length - 1].classTreeId);  // 결과마다 덮어쓴다 — 마지막 것, 없으면 null
        else setClassTreeId(null);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E1] updateButton[상신].Select (L118) → update() L190-300
  const update = async () => {
    if (benefitCode == null) { message.warning('신청구분을 선택해주세요'); return; }
    if (dateCode === 'B') {
      if (!year) { message.warning('신청년도를 입력해주세요'); return; }
      if (!month) { message.warning('신청월을 입력해주세요'); return; }
    } else if (dateCode === 'A') {
      if (occDate == null) { message.warning('발생일자를 입력해주세요'); return; }
    }
    if (suffixY && benefitDetail === '') { message.warning('내용을 입력해주세요'); return; }
    if (issueAmt == null) { message.warning('신청금액을 입력해주세요'); return; }
    if (classTreeId == null) { message.warning('해당 신청구분의 문서분류가 존재하지않습니다. 관리자에게 문의해주세요'); return; }
    // endDate: 사용월의 말일
    const endDate = dayjs(`${year}-${month}-01`).endOf('month');
    setSaving(true);
    try {
      const row = await empBenefitApi.createBenefit({
        benefitCode, issueAmt,
        occDate: dateCode === 'B' ? endDate.format('YYYY-MM-DD') : dateCode === 'A' ? occDate!.format('YYYY-MM-DD') : null,
        benefitDetail: suffixY ? benefitDetail : null,
        dcrClassTreeId: classTreeId,
      });
      linkSaved.current = false;
      setLink({ classTreeId, linkCode: linkCode ?? '', refId: row.benefitId, yyyy: year, mm: month });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // updateApprId() L302-315: emp.Emp17_Benefit.updateApprId → callBack.execute(), hide()
  const updateApprId = async (apprId: number) => {
    if (!link) return;
    linkSaved.current = true;
    try {
      await empBenefitApi.updateBenefitApprId(link.refId, apprId);
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // 결재창을 저장 없이 닫음(callback result == null) → emp.Emp17_Benefit.deleteBenefitId
  const onApprClose = () => {
    const cur = link;
    setLink(null);
    if (cur && !linkSaved.current) void empBenefitApi.deleteBenefit(cur.refId).catch(() => undefined);
  };

  return (
    <>
      <Modal
        open={open}
        title="복리후생비 신청"
        width={700}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="register" loading={saving} onClick={update}>상신</Button>
              {/* [E2] closeButton[닫기].Select (L124) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {/* [E3] benefitName[신청구분].Collapse (L149) → benefitCode.setValue / [E4] Selection (L156) */}
            <Row label="신청구분">
              <Select style={{ width: 170 }} placeholder="선택" value={benefitCode} options={types.map(t => ({ value: t.code, label: t.name }))} onChange={v => void onType(v)} />
            </Row>
            <Row label="내용">
              <Input style={{ width: 200 }} maxLength={100} placeholder="ex) 자기계발비 / 체력단련비" disabled={!suffixY} value={benefitDetail} onChange={e => setBenefitDetail(e.target.value)} />
            </Row>
          </div>
          <div style={{ display: 'flex', gap: 20, minHeight: 32 }}>
            {dateCode === 'B' && (
              <Row label="사용월">
                <Input style={{ width: 70 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
                <span>년</span>
                <SystemCodeComboBox kindCd="MonthsCode" style={{ width: 80 }} allowClear={false} value={month} onChange={c => { if (c) setMonth(c); }} />
              </Row>
            )}
            {dateCode === 'A' && (
              <Row label="발생일자">
                <DatePicker style={{ width: 130 }} value={occDate} onChange={setOccDate} />
              </Row>
            )}
            {(dateCode === 'A' || dateCode === 'B') && (
              <Row label="신청금액">
                <InputNumber style={{ width: 150 }} min={0} controls={false} value={issueAmt} formatter={v => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={v => Number((v ?? '').replace(/,/g, ''))} onChange={v => setIssueAmt(v == null ? null : Number(v))} />
              </Row>
            )}
          </div>
          <div style={{ color: '#4472C4', fontSize: 13, paddingLeft: 20 }}>
            {MSG.map(m => <div key={m}>{m}</div>)}
          </div>
        </div>
      </Modal>
      {/* update() L277-297: Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, linkCode, resultModel, false, callback) */}
      <Apr01_Edit_ApprDoc
        apprId={null}
        link={link ? { classTreeId: link.classTreeId, linkCode: link.linkCode, refId: link.refId, args: { yyyy: link.yyyy, mm: link.mm } } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClose={onApprClose}
      />
    </>
  );
};
