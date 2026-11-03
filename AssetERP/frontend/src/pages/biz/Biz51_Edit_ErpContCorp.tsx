/**
 * AssetERP 계약사 편집 창 (EE22) — Biz51_Tab_ErpContCorp의 [등록]·행의 [수정] 아이콘이 연다
 * AS-IS: myApp/client/vi/biz/Biz51_Edit_ErpContCorp.java (363줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L96-119(신규, 열자마자 getSeq)·L114-119(수정): 모달 600×580 "계약사 신규"/"계약사 수정", getEditor() L236-321: 라벨 폭 140,
 *   계약사명(조회창) / 계약상태(ContStatusCode03 그룹)·서비스 종류(ErpServiceType) / 최초계약일·서브 도메인(회사 조회창) / (재)계약일·시스템 사용시작일 / 계약종료일·시스템 사용종료일
 *   / 사용료(읽기 전용, 클릭하면 사용료 창) / 담당자·연락처 / 이메일 / 대표이사 / 주소 / 비고(높이 100), 아래 가운데 [저장][닫기]
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { bizErpContCorpApi, bizErpFeeApi } from '@/api/bizErp';
import { errorMessage } from '@/api/client';
import { BizErpContCorp } from '@/types/bizErp';
import { Corp, Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Biz52_Lookup_ErpFee } from './Biz52_Lookup_ErpFee';

/** 열 때 받는 값 — 신규 또는 수정(그리드 행) */
export type BizErpContCorpEditTarget = { mode: 'new' } | { mode: 'edit'; row: BizErpContCorp };

interface Props {
  /** 값이 있으면 열린다 */
  target: BizErpContCorpEditTarget | null;
  onClose: () => void;
  /** callback.execute() — 저장한 뒤 (부르는 쪽이 다시 조회) */
  onSaved: () => void;
}

interface Form {
  erpContCorpId: number;
  corpId: number | null;
  corpNm: string;
  contStatusCd: string | undefined;
  serviceType: string | undefined;
  firstContDate: string | null;
  contDate: string | null;
  contEndDate: string | null;
  erpStartDate: string | null;
  erpEndDate: string | null;
  companyId: number | null;
  locationNm: string;
  erpFeeNm: string;
  managerNm: string;
  managerTel: string;
  managerEmail: string;
  companyCeo: string;
  companyAddr: string;
  note: string;
}

const day = (s: string | null) => (s ? dayjs(s) : null);
const fmt = (d: dayjs.Dayjs | null) => (d ? d.format('YYYY-MM-DD') : null);
/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string) => (s === '' ? null : s);
/** checkLongNull() L344-354 */
const money = (v: number | null | undefined) => (v == null ? '- ' : v.toLocaleString('ko-KR'));

/** 라벨 폭 140 (form.setLabelWidth(140)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
    <span style={{ width: 140, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ display: 'flex', gap: 10 }}>{children}</div>;

export const Biz51_Edit_ErpContCorp: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);

  const isNew = target?.mode === 'new';

  // [E0] 화면 열림 — 신규(L96-112): getSeq 로 번호를 받는다. 수정(L114-119): 그리드 행 그대로
  useEffect(() => {
    if (!target) { setF(null); return; }
    let alive = true;
    void (async () => {
      try {
        if (target.mode === 'new') {
          const id = await bizErpContCorpApi.nextId();
          if (alive) setF({
            erpContCorpId: id, corpId: null, corpNm: '', contStatusCd: undefined, serviceType: undefined, firstContDate: null, contDate: null, contEndDate: null,
            erpStartDate: null, erpEndDate: null, companyId: null, locationNm: '', erpFeeNm: '', managerNm: '', managerTel: '', managerEmail: '', companyCeo: '',
            companyAddr: '', note: '',
          });
        } else {
          const r = target.row;
          if (alive) setF({
            erpContCorpId: r.erpContCorpId, corpId: r.corpId, corpNm: r.corpNm ?? '', contStatusCd: r.contStatusCd ?? undefined, serviceType: r.serviceType ?? undefined,
            firstContDate: r.firstContDate, contDate: r.contDate, contEndDate: r.contEndDate, erpStartDate: r.erpStartDate, erpEndDate: r.erpEndDate,
            companyId: r.companyId, locationNm: r.locationNm ?? '', erpFeeNm: r.erpFeeNm ?? '', managerNm: r.managerNm ?? '', managerTel: r.managerTel ?? '',
            managerEmail: r.managerEmail ?? '', companyCeo: r.companyCeo ?? '', companyAddr: r.companyAddr ?? '', note: r.note ?? '',
          });
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        onClose();
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target || !f) return null;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => prev && { ...prev, [k]: v });

  // [E3] corpName[계약사명].TriggerClick [result != null] (L203) → Sys15_Lookup_Corp.open(true, true, …): 고르면 corpId·이름, [선택안함](null)이면 둘 다 비움
  const onCorpResult = (corp: Corp | null) => {
    setF(prev => prev && { ...prev, corpId: corp?.corpId ?? null, corpNm: corp?.corpName ?? '' });
    setCorpOpen(false);
  };
  // [E2] locationName[서브 도메인].TriggerClick [result != null] (L181) → Sys01_Lookup_Company.open(): 고르면 지역명·회사 ID, [선택안함](null)이면 둘 다 비움
  const onCompanyResult = (c: Company | null) => {
    setF(prev => prev && { ...prev, companyId: c?.companyId ?? null, locationNm: c?.locNm ?? '' });
    setCompanyOpen(false);
  };
  // [E1] erpFeeName[사용료].TriggerClick [list.size() != 0] (L151) → Biz52_Lookup_ErpFee.open(…, 닫으면 callback): biz.Biz52_ErpFee.selectByStartDate(오늘)가 있으면
  //   "시스템사용료 : n원, DATA 사용료 : n원", 없으면 비움
  const onFeeClosed = async () => {
    setFeeOpen(false);
    try {
      const fee = await bizErpFeeApi.current(f.erpContCorpId, dayjs().format('YYYY-MM-DD'));
      set('erpFeeNm', fee ? `시스템사용료 : ${money(fee.erpFee)}원, DATA 사용료 : ${money(fee.dataFee)}원` : '');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] updateButton[저장].Select (L222) → update() L323-342: 계약사명이 비면 "계약사는 필수입력 항목입니다", 아니면 biz.Biz51_ErpContCorp.insertUpdate → callback.execute(), hide()
  const update = async () => {
    if (f.corpNm === '') { message.warning('계약사는 필수입력 항목입니다'); return; }
    setSaving(true);
    try {
      await bizErpContCorpApi.save({
        erpContCorpId: f.erpContCorpId, corpId: f.corpId, contStatusCd: f.contStatusCd ?? null, serviceType: f.serviceType ?? null,
        firstContDate: f.firstContDate, contDate: f.contDate, contEndDate: f.contEndDate, erpStartDate: f.erpStartDate, erpEndDate: f.erpEndDate,
        companyId: f.companyId, managerNm: n(f.managerNm), managerTel: n(f.managerTel), managerEmail: n(f.managerEmail), companyCeo: n(f.companyCeo),
        companyAddr: n(f.companyAddr), note: n(f.note),
      });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open
        title={isNew ? '계약사 신규' : '계약사 수정'}
        width={780}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update} loading={saving}>저장</Button>
              {/* [E5] closeButton[닫기].Select (L228) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <Row>
            <Field label="계약사명">
              <LookupInput value={f.corpNm} width={420} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
            </Field>
          </Row>
          <Row>
            <Field label="계약상태">
              {/* [E6] contStatusName[계약상태].Collapse (L237) → contStatusCode = 고른 코드 (코드그룹 ContStatusCode03) */}
              <SystemCodeComboBox kindGroupCd="ContStatusCode03" style={{ width: '100%' }} value={f.contStatusCd} onChange={c => set('contStatusCd', c)} />
            </Field>
            <Field label="서비스 종류">
              {/* [E7] serviceTypeName[서비스 종류].Collapse (L243) → serviceType = 고른 코드 */}
              <SystemCodeComboBox kindCd="ErpServiceType" style={{ width: '100%' }} value={f.serviceType} onChange={c => set('serviceType', c)} />
            </Field>
          </Row>
          <Row>
            <Field label="최초계약일"><DatePicker style={{ width: '100%' }} value={day(f.firstContDate)} onChange={d => set('firstContDate', fmt(d))} /></Field>
            <Field label="서브 도메인">
              <LookupInput value={f.locationNm} onOpen={() => setCompanyOpen(true)} onClear={() => onCompanyResult(null)} width={240} />
            </Field>
          </Row>
          <Row>
            <Field label="(재)계약일"><DatePicker style={{ width: '100%' }} value={day(f.contDate)} onChange={d => set('contDate', fmt(d))} /></Field>
            <Field label="시스템 사용시작일"><DatePicker style={{ width: '100%' }} value={day(f.erpStartDate)} onChange={d => set('erpStartDate', fmt(d))} /></Field>
          </Row>
          <Row>
            <Field label="계약종료일"><DatePicker style={{ width: '100%' }} value={day(f.contEndDate)} onChange={d => set('contEndDate', fmt(d))} /></Field>
            <Field label="시스템 사용종료일"><DatePicker style={{ width: '100%' }} value={day(f.erpEndDate)} onChange={d => set('erpEndDate', fmt(d))} /></Field>
          </Row>
          <Row>
            <Field label="사용료">
              <LookupInput value={f.erpFeeNm} width={420} onOpen={() => setFeeOpen(true)} />
            </Field>
          </Row>
          <Row>
            <Field label="담당자"><Input value={f.managerNm} onChange={e => set('managerNm', e.target.value)} /></Field>
            <Field label="연락처"><Input value={f.managerTel} onChange={e => set('managerTel', e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="이메일"><Input placeholder="이메일1; 이메일2;" value={f.managerEmail} onChange={e => set('managerEmail', e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="대표이사"><Input value={f.companyCeo} onChange={e => set('companyCeo', e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="주소"><Input value={f.companyAddr} onChange={e => set('companyAddr', e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="비고"><Input.TextArea rows={4} value={f.note} onChange={e => set('note', e.target.value)} /></Field>
          </Row>
        </div>
      </Modal>
      {/* regYn true·empYn true: [거래처추가]를 보이고 [전체]를 [선택안함]으로, 임직원도 목록에 (open(true, true, cb)) */}
      <Sys15_Lookup_Corp open={corpOpen} regYn empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Sys01_Lookup_Company open={companyOpen} onResult={onCompanyResult} onClose={() => setCompanyOpen(false)} />
      <Biz52_Lookup_ErpFee erpContCorpId={feeOpen ? f.erpContCorpId : null} onClose={() => void onFeeClosed()} />
    </>
  );
};
