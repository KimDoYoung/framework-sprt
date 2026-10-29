/**
 * 퇴직정산서 탭 (S22) — Pay10_Tab_Retire의 첫 탭 "퇴직정산서".
 * AS-IS: myApp/client/vi/pay/Pay10_TabPage_Retire.java (409줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-79: BorderLayout — 가운데 RD 보고서 폼(Pay10_Rd_Retire) / 아래 70: 문서분류 {classTreeFullName 800} · 상신상태 {apprStepName 250, 읽기 전용} · [상신] · [문서보기]
 * 1단계: [상신]의 상신 행 생성·결재문서 작성(Apr01_Edit_ApprDoc, 다른 도메인 apr)과 [문서보기]의 결재문서 보기는 다음 단계 — 상신 검사까지만 하고 안내한다(S13·S18 선례)
 * [E0] 화면 열림 (생성자 L58-79) → settings(), defaultName() L125-144: 연결 코드 A05(퇴직정산)의 문서분류가 하나면 그 이름을 안내 글자로, 아니면 "문서분류가 미지정 상태입니다…"
 * [E1] classTreeFullName[문서분류].TriggerClick (L86) → openLookupDoc() L146-155: Dcr30_Move_DcrClass.open(callback) → 고른 분류 이름
 * [E2] apprButton[상신].Select (L92) → insertPayRelateAppr() L288-313: 사원이 없으면 "사원을 선택해주세요" / 이미 상신 중(10·20·30)이면 "이미 상신 중입니다" → (다음 단계) 상신 행·Apr01_Edit_ApprDoc
 * [E3] apprViewButton[문서보기].Select (L98) → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval — 다음 단계
 * retrieve(param) L163-234: 퇴직정산서(pay_cd 03)가 없으면 "선택한 사원의 퇴직정산서 내역이 없습니다. 생성 후 다시시도해주세요", 있으면 RD 보고서(항목 수 중 큰 값 num)와 retrieveApprStep() L236-286
 *   (상신 행이 없거나 상태가 없으면 "미상신"[상신 켬·문서보기 끔], 반려(40)면 [상신][문서보기] 모두 켬, 그 밖은 [상신] 끔·[문서보기] 켬)
 */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { payApi } from '@/api/pay';
import { dcrApi } from '@/api/dcr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Pay10_Rd_Retire } from './Pay10_Rd_Retire';
import { RETIRE_NO_MONTH, RetireTabHandle, RetireTabParam } from './payRetireTab';

const LABEL_STYLE: React.CSSProperties = { width: 105, textAlign: 'right', paddingRight: 10, fontWeight: 'bold', flex: 'none' };

export const Pay10_TabPage_Retire = forwardRef<RetireTabHandle>((_props, ref) => {
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [classTreeFullName, setClassTreeFullName] = useState('');
  const [classTreeEmptyText, setClassTreeEmptyText] = useState('미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.');
  const [classOpen, setClassOpen] = useState(false);
  const [apprStepCode, setApprStepCode] = useState('00');
  const [apprStepName, setApprStepName] = useState('미상신');
  const [apprButtonEnabled, setApprButtonEnabled] = useState(false);
  const [apprViewEnabled, setApprViewEnabled] = useState(false);
  const personIdRef = useRef<number | null>(null);

  // [E0] defaultName() L125-144
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode('A05')
      .then(list => setClassTreeEmptyText(list.length === 1
        ? list[0].classTreeFullName
        : '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요'))
      .catch(() => undefined);
  }, []);

  const clear = () => {
    setRdUrl(null);
    setApprStepCode('00');
    setApprStepName('');
    setApprButtonEnabled(false);
    setApprViewEnabled(false);
  };

  // retrieveApprStep() L236-286
  const retrieveApprStep = async (monthId: number) => {
    setApprStepName('');
    const appr = await payApi.getRetireRelateAppr(monthId);
    if (appr == null || appr.statusCode == null) {
      setApprStepCode('00');
      setApprStepName('미상신');
      setApprButtonEnabled(true);
      setApprViewEnabled(false);
    } else if (appr.statusCode === '40') {
      setApprStepCode(appr.statusCode);
      setApprStepName(appr.statusName ?? '');
      setApprButtonEnabled(true);
      setApprViewEnabled(true);
    } else {
      setApprStepCode(appr.statusCode);
      setApprStepName(appr.statusName ?? '');
      setApprButtonEnabled(false);
      setApprViewEnabled(true);
    }
  };

  // retrieve(param) L163-234
  const retrieve = async (param: RetireTabParam) => {
    if (param.personId == null) return;
    personIdRef.current = param.personId;
    try {
      const num = await payApi.retireRdCount(param.personId);
      const today = new Date().toISOString().slice(0, 10);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Pay10_Rd_Retire', options: '/rhtmlimportopt [2]', rv: { personId: String(param.personId), date: today, num: String(num) } });
      setRdUrl(res.url);
      const month = await payApi.getRetireMonth(param.personId);
      if (month == null) {
        message.warning(RETIRE_NO_MONTH);
        setApprStepCode('00');
        setApprStepName('');
        setApprButtonEnabled(false);
        setApprViewEnabled(false);
        return;
      }
      await retrieveApprStep(month.monthId);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({ retrieve, clear }));

  // [E2] apprButton[상신].Select (L92) → insertPayRelateAppr() L288-313
  const apprRequest = () => {
    if (personIdRef.current == null) {
      message.warning('사원을 선택해주세요');
      return;
    }
    if (apprStepCode === '10' || apprStepCode === '20' || apprStepCode === '30') {
      message.warning('이미 상신 중입니다');
      return;
    }
    message.info('전자결재 상신(결재문서 작성)은 다음 단계에서 제공됩니다.');
  };

  // [E3] apprViewButton[문서보기].Select (L98) → apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval — 다음 단계
  const apprView = () => {
    message.info('결재문서 보기는 다음 단계에서 제공됩니다.');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}><Pay10_Rd_Retire url={rdUrl} /></div>
      <div style={{ borderTop: '1px solid #d9d9d9', height: 70, boxSizing: 'border-box', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, flex: 'none', overflowX: 'auto' }}>
        <span style={LABEL_STYLE}>문서분류</span>
        {/* [E1] classTreeFullName[문서분류].TriggerClick (L86) → openLookupDoc() L146-155 */}
        <LookupInput value={classTreeFullName} placeholder={classTreeEmptyText} width={800} onOpen={() => setClassOpen(true)} />
        <span style={LABEL_STYLE}>상신상태</span>
        <Input readOnly value={apprStepName} style={{ width: 250, flex: 'none' }} />
        {/* [E2] apprButton[상신].Select (L92) */}
        <Button type="register" disabled={!apprButtonEnabled} onClick={apprRequest}>상신</Button>
        {/* [E3] apprViewButton[문서보기].Select (L98) */}
        <Button type="search" disabled={!apprViewEnabled} onClick={apprView}>문서보기</Button>
      </div>
      <Dcr30_Move_DcrClass
        open={classOpen}
        hideNull
        onResult={r => setClassTreeFullName(r.classTreeFullName ?? '')}
        onClose={() => setClassOpen(false)}
      />
    </div>
  );
});
Pay10_TabPage_Retire.displayName = 'Pay10_TabPage_Retire';
