/**
 * 미흡내역 조치결과 승인 창 (N23) — Tdm59_TabPage_CheckAppr 미흡/개선 그리드의 승인처리 아이콘(상태가 "발생"이 아닌 행)이 연다. N24 미흡내역 조치도 이 창을 쓴다.
 * AS-IS: myApp/client/vi/tdm/Tdm54_Lookup_ChckInsuffCmnt.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L92-119: 모달 1310×800(최소 1310×700), 아래 가운데 [승인][반려][취소] … [임시저장][닫기]. getEditor() L280-391:
 *   1.조치계획(등록일·등록자·조치완료 예정일·조치 예정자·조치명·조치계획내용 + [발생 점검항목 보기]) 3.조치결과(조치상태·조치부서·조치완료일·조치자·조치결과)
 *   2.조치기록 그리드(등록일 100·등록자 100·조치내용 470·비고 420·증빙자료 80·보기 아이콘 30) 4.조치결과 승인(승인상태·승인(반려)의견)
 * view(chckInsuffId) L131-149: 조치내역을 ID로 읽어 읽기 전용(승인·반려·취소·임시저장 숨김) / edit(model, stdDate, cb) L151-161. setButton() L478-494: 승인상태 10(대기)이면 승인·반려·임시저장을 켜고 취소는 끈다
 * 다음 단계: 조치기록의 증빙 보기 아이콘(Tdm00_Lookup_RelateAppr "tdm63")은 안내만 (N22와 같다)
 * UX보강(10): 해당 없음
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, Modal, Space, Typography, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprInsuff, TdmCheckApprInsuffRecord, TdmCheckManlDetail } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Tdm52_Edit_ChckManl, CheckManlEditTarget } from './Tdm52_Edit_ChckManl';

const gb = gbFor<TdmCheckApprInsuffRecord>();

export type InsuffCmntTarget =
  /** view(chckInsuffId) — 읽기 전용, 서버에서 조치내역을 읽는다 */
  | { mode: 'view'; chckInsuffId: number }
  /** edit(model, stdDate, cb) — 승인 처리. chckApprCmntId = 이 조치내역이 속한 승인 행, checkYm = 의견 글자수 검사의 기준 */
  | { mode: 'edit'; insuff: TdmCheckApprInsuff; chckApprCmntId: number; checkYm: string };

interface Props {
  target: InsuffCmntTarget | null;
  /** AS-IS callback.execute(model) — 처리 뒤 서버에서 다시 읽은 조치내역(목록의 그 행을 바꾼다) */
  onChanged?: (insuff: TdmCheckApprInsuff) => void;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; blue?: boolean; top?: boolean; children: React.ReactNode }> = ({ label, blue, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 12 }}>
    <Typography.Text strong style={{ width: 122, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8, color: blue ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Title: React.FC<{ children: React.ReactNode; extra?: React.ReactNode }> = ({ children, extra }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 8px 5px' }}>
    <span style={{ fontSize: 15, fontWeight: 'bold' }}>{children}</span>{extra}
  </div>
);

const dot = (d?: string | null) => (d ? d.replace(/-/g, '.') : '');

const MESSAGES: Record<'A' | 'R' | 'C', string> = {
  A: '승인 처리가 완료되었습니다',
  R: '반려 처리가 완료되었습니다',
  C: '취소가 완료되었습니다',
};

export const Tdm54_Lookup_ChckInsuffCmnt: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const edit = target?.mode === 'edit';
  const [model, setModel] = useState<TdmCheckApprInsuff | null>(null);      // chckInsuffModel
  const [records, setRecords] = useState<TdmCheckApprInsuffRecord[]>([]);
  const [apprCmnt, setApprCmnt] = useState('');
  const [manlView, setManlView] = useState<CheckManlEditTarget | null>(null);
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L92-119, open() L163-171): view면 조치내역을 ID로 읽는다 → 폼에 채우고 setButton(), retrieveRecord() L416-427 (tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId)
  useEffect(() => {
    if (!target) { setModel(null); setRecords([]); return; }
    let alive = true;
    void (async () => {
      try {
        const m = target.mode === 'view' ? await tdmApi.getCheckApprInsuff(target.chckInsuffId) : target.insuff;
        if (!alive) return;
        setModel(m);
        setApprCmnt(m.apprCmnt ?? '');
        setRecords(await tdmApi.searchCheckApprInsuffRecords(m.chckInsuffId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    return () => { alive = false; };
  }, [target]);

  // recordGirdBuilder() L393-414
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L406
    gb.textCenter('regEmpName', 100, '등록자'),  // L407
    gb.textArea('content', 470, '조치내용'),  // L408
    gb.textArea('note', 420, '비고'),  // L409
    gb.textCenter('fileCountStr', 80, '증빙자료'),  // L410
    // L411 fileCell → Tdm00_Lookup_RelateAppr.view("tdm63", chckInsuffRecordId, null) — 다음 단계
    iconCell<TdmCheckApprInsuffRecord>('view', 'fileCell', 30, ' ', () => { message.info('증빙자료 창(Tdm00_Lookup_RelateAppr)은 다음 단계에서 연결됩니다'); }),
  ], []);

  const waiting = model?.apprStatusCode === '10';                            // setButton() L478-494

  // [E1] manlButton[발생 점검항목 보기].Select (L189) → tdm.Tdm52_ChckManl.selectById(chckManlId) → Tdm52_Edit_ChckManl.view(model)
  const viewManl = async () => {
    if (!model) return;
    try {
      const manl: TdmCheckManlDetail = await tdmApi.getCheckManl(model.chckManlId);
      setManlView({ manl, mode: 'view' });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // updateApprStatus(actionType) L444-476: tdm.Tdm61_ChckInsuffAppr.updateApprStatus
  const updateApprStatus = async (actionType: 'A' | 'R' | 'C') => {
    if (!model || target?.mode !== 'edit' || model.chckInsuffApprId == null) return;
    setBusy(true);
    try {
      const updated = await tdmApi.updateCheckApprInsuffStatus(target.chckApprCmntId, model.chckInsuffApprId, { actionType, checkYm: target.checkYm, apprCmnt });
      message.info(MESSAGES[actionType]);
      onChanged?.(updated);
      if (updated.apprStatusCode === '10') {
        setModel(updated);                                                   // editDriver.edit(chckInsuffModel); setButton()
        setApprCmnt(updated.apprCmnt ?? '');
      } else {
        onClose();                                                           // hide()
      }
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
    } finally {
      setBusy(false);
    }
  };

  const confirm = (content: string, action: 'A' | 'R' | 'C') => {
    Modal.confirm({ title: '확인', content, width: 300, okText: '예', cancelText: '아니오', onOk: () => updateApprStatus(action) });
  };

  // [E2] agreeButton[승인].Select (L208) → 승인 의견 필수 → messageBox YES [E3] (L217) → updateApprStatus("A")
  const onAgree = () => {
    if (!apprCmnt) { message.warning('승인 의견을 입력하세요'); return; }
    confirm('승인하시겠습니까?', 'A');
  };

  // [E4] rejectButton[반려].Select (L229) → 반려 의견 필수 → messageBox YES [E5] (L238) → updateApprStatus("R")
  const onReject = () => {
    if (!apprCmnt) { message.warning('반려 의견을 입력하세요'); return; }
    confirm('반려하시겠습니까?', 'R');
  };

  // [E6] cancelButton[취소].Select (L250) → messageBox YES [E7] (L254) → updateApprStatus("C")
  const onCancel = () => confirm('승인(반려)를 취소하시겠습니까?', 'C');

  // [E8] updateButton[임시저장].Select (L266) → update() L429-442: tdm.Tdm61_ChckInsuffAppr.updateApprCmnt
  const update = async () => {
    if (!model || target?.mode !== 'edit' || model.chckInsuffApprId == null) return;
    setBusy(true);
    try {
      await tdmApi.saveCheckApprInsuffCmnt(target.chckApprCmntId, model.chckInsuffApprId, apprCmnt);
      message.info('저장이 완료되었습니다');
    } catch (err) {
      message.info(errorMessage(err, '저장 실패'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={!!target}
      title={<b>미흡내역 조치결과 승인</b>}
      width="min(1310px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {edit && <Button type="save" disabled={!waiting || busy} onClick={onAgree}>승인</Button>}
            {edit && <Button type="cancel" disabled={!waiting || busy} onClick={onReject}>반려</Button>}
            {edit && <Button type="cancel" disabled={waiting || busy} onClick={onCancel}>취소</Button>}
            {edit && <Button type="save" disabled={!waiting || busy} onClick={update}>임시저장</Button>}
            {/* [E9] closeButton[닫기].Select (L272) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ maxHeight: 'calc(100vh - 190px)', overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title extra={<Button type="search" onClick={viewManl}>발생 점검항목 보기</Button>}>1. 조치계획</Title>
              <div style={{ border: '1px solid #d9d9d9', padding: '15px 15px 3px 5px' }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}><Row label="등록일"><Input readOnly value={dot(model.regDate)} /></Row></div>
                  <div style={{ flex: 1 }}><Row label="등록자"><Input readOnly value={model.planRegEmpName ?? ''} /></Row></div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}><Row label="조치완료 예정일"><Input readOnly value={dot(model.dueDate)} /></Row></div>
                  <div style={{ flex: 1 }}><Row label="조치 예정자"><Input readOnly value={model.planActionEmpName ?? ''} /></Row></div>
                </div>
                <Row label="조치명"><Input readOnly value={model.actionName ?? ''} /></Row>
                <Row label="조치계획내용" top><Input.TextArea readOnly style={{ height: 116, resize: 'none' }} value={model.actionPlan ?? ''} /></Row>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title>3. 조치결과</Title>
              <div style={{ border: '1px solid #d9d9d9', padding: '15px 15px 3px 5px' }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}><Row label="조치상태"><Input readOnly value={model.statusName ?? ''} /></Row></div>
                  <div style={{ flex: 1 }}><Row label="조치부서"><Input readOnly value={model.orgName ?? ''} /></Row></div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}><Row label="조치완료일"><Input readOnly value={dot(model.actionDate)} /></Row></div>
                  <div style={{ flex: 1 }}><Row label="조치자"><Input readOnly value={model.actionEmpName ?? ''} /></Row></div>
                </div>
                <Row label="조치결과" top><Input.TextArea readOnly style={{ height: 150, resize: 'none' }} value={model.actionCmnt ?? ''} /></Row>
              </div>
            </div>
          </div>
          <Title>2. 조치기록</Title>
          <div style={{ height: 200 }}>
            <SingleGrid<TdmCheckApprInsuffRecord>
              rowData={records}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.chckInsuffRecordId)}
            />
          </div>
          <Title>4. 조치결과 승인</Title>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px 15px 3px 5px' }}>
            <Row label="승인상태" blue><Input readOnly style={{ width: 250 }} value={model.apprStatusName ?? ''} /></Row>
            <Row label="승인(반려)의견" blue top>
              <Input.TextArea style={{ height: 100, resize: 'none' }} readOnly={!waiting} value={apprCmnt} onChange={e => setApprCmnt(e.target.value)} />
            </Row>
          </div>
        </div>
      )}
      <Tdm52_Edit_ChckManl target={manlView} onChanged={() => undefined} onClose={() => setManlView(null)} />
    </Modal>
  );
};
