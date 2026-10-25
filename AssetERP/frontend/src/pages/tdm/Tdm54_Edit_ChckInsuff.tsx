/**
 * 조치계획 등록창 (N22) — Tdm52_Edit_ChckManl의 [조치계획등록/확인]이 연다. (N24 미흡내역 조치도 같은 창을 쓴다)
 * AS-IS: myApp/client/vi/tdm/Tdm54_Edit_ChckInsuff.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-73: 모달 640×530, 제목 "조치계획 등록", 아래 가운데 [저장][닫기]. getEditor() L162-196: 등록일·조치완료 예정일·조치 예정자(조회창 칸)·조치명·조치계획내용(250)
 * view(model) L75-78: 읽기 전용([저장] 숨김) / edit(stdDate, model) L80-84. open() L86-125: 점검항목의 조치계획(tdm54)이 있으면 읽고, 없으면 새 계획
 *   (등록일 오늘 · 조치예정자 = 점검자 · 상태 10 발생 · 발생년월/점검년월 = 점검년월 — 회사·직책·부서·상태는 서버가 점검항목에서 채운다)
 * UX보강(10): 조회창(UX-05·06)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Space, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckManlDetail } from '@/types/tdm';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingleTdm } from '@/components/lookup/Emp00_Lookup_SelectSingleTdm';

const DATE_FORMAT = 'YYYY.MM.DD';

export interface ChckInsuffTarget {
  /** 점검항목 (점검상세 창의 폼 값을 담은 것 — editDriver.flush()) */
  manl: TdmCheckManlDetail;
  mode: 'view' | 'edit';
  /** 점검년월 1일 'yyyy-MM-dd' (edit(stdDate, …)) — 이력(tdm55)의 처리자 정보 기준일 */
  stdDate: string;
}

interface Props {
  target: ChckInsuffTarget | null;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; children: React.ReactNode; top?: boolean }> = ({ label, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 16 }}>
    <Typography.Text strong style={{ width: 130, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Tdm54_Edit_ChckInsuff: React.FC<Props> = ({ target, onClose }) => {
  const readOnly = target?.mode === 'view';
  const [chckInsuffId, setChckInsuffId] = useState<number | null>(null);
  const [regDate, setRegDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [emp, setEmp] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [actionName, setActionName] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [empLookup, setEmpLookup] = useState(false);
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L60-73) → open() L86-125: tdm.Tdm54_ChckInsuff.selectByChckManlId(chckManlId)
  useEffect(() => {
    if (!target) return;
    const m = target.manl;
    setChckInsuffId(null);
    setRegDate(dayjs()); setDueDate(null); setActionName(''); setActionPlan('');
    setEmp({ id: m.checkerId ?? null, name: m.checkerName ?? '' });
    let alive = true;
    tdmApi.getChckInsuffByManl(m.chckManlId).then(row => {
      if (!alive || !row) return;                                   // 없으면 새 계획(위 기본값)
      setChckInsuffId(row.chckInsuffId ?? null);
      setRegDate(row.regDate ? dayjs(row.regDate, 'YYYY-MM-DD') : null);
      setDueDate(row.dueDate ? dayjs(row.dueDate, 'YYYY-MM-DD') : null);
      setEmp({ id: row.planActionEmpId ?? null, name: row.planActionEmpName ?? '' });
      setActionName(row.actionName ?? '');
      setActionPlan(row.actionPlan ?? '');
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [target]);

  // [E2] updateButton[저장].Select (L148) → update() L198-245: tdm.Tdm54_ChckInsuff.modelUpdate
  const update = async () => {
    if (!target) return;
    if (!regDate) { message.warning('등록일을 선택하세요'); return; }
    if (!dueDate) { message.warning('조치완료 예정일을 선택하세요'); return; }
    if (dueDate.isBefore(dayjs(), 'day')) { message.warning('조치완료 예정일은 현재일보다 미래여야 합니다'); return; }
    if (emp.id == null) { message.warning('조치 예정자를 선택하세요'); return; }
    if (!actionName) { message.warning('조치명을 입력하세요'); return; }
    if (!actionPlan) { message.warning('조치계획내용을 입력하세요'); return; }
    setBusy(true);
    try {
      await tdmApi.saveChckInsuff({
        chckInsuffId, chckManlId: target.manl.chckManlId, regDate: regDate.format('YYYY-MM-DD'), dueDate: dueDate.format('YYYY-MM-DD'),
        planActionEmpId: emp.id, actionName, actionPlan, stdDate: target.stdDate,
      });
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    } finally {
      setBusy(false);
    }
    message.info('조치계획이 등록되었습니다');
    onClose();                                                      // hide()
  };

  return (
    <Modal
      open={!!target}
      title={<b>조치계획 등록</b>}
      width={640}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!readOnly && <Button type="save" disabled={busy} onClick={update}>저장</Button>}
            {/* [E3] closeButton[닫기].Select (L154) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ paddingTop: 10 }}>
        <Row label="등록일"><DatePicker style={{ width: 280 }} format={DATE_FORMAT} disabled={readOnly} value={regDate} onChange={setRegDate} /></Row>
        <Row label="조치완료 예정일"><DatePicker style={{ width: 280 }} format={DATE_FORMAT} disabled={readOnly} value={dueDate} onChange={setDueDate} /></Row>
        <Row label="조치 예정자">
          {/* [E1] planActionEmpName[조치 예정자].TriggerClick (L129) → Emp00_Lookup_SelectSingleTdm.open(오늘, 점검항목의 부서, cb) */}
          <LookupInput value={emp.name} width={280} disabled={readOnly} onOpen={() => setEmpLookup(true)} />
        </Row>
        <Row label="조치명"><Input readOnly={readOnly} value={actionName} onChange={e => setActionName(e.target.value)} /></Row>
        <Row label="조치계획내용" top><Input.TextArea readOnly={readOnly} style={{ height: 250, resize: 'none' }} value={actionPlan} onChange={e => setActionPlan(e.target.value)} /></Row>
      </div>
      <Emp00_Lookup_SelectSingleTdm
        open={empLookup}
        stdDate={dayjs().format('YYYY-MM-DD')}
        orgId={target?.manl.orgId}
        onResult={p => { setEmpLookup(false); setEmp({ id: p.personId, name: p.korNm ?? '' }); }}
        onClose={() => setEmpLookup(false)}
      />
    </Modal>
  );
};
