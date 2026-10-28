/**
 * 인사평가표 (T02) — Emp43_Tab_EvalExecute의 "인사평가표" 아이콘에서 연다 (평가자가 항목별 등급·평정사유를 적고 평가완료)
 * AS-IS: myApp/client/vi/emp/Emp44_Lookup_Write.java (465줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L71-147: 모달 1000×850 "인사평가표"(X 없음) — · 대상자(조직 직위 성명) · 입사일 · 근무기간 · 평가기간 · 평가요소, 인사평가표 그리드(행번호, 평가항목 100 · 평가요소 550 · 가중치 80(조직장용) · 가중치 80(조직원용) ·
 *   평가등급 80(콤보) · 환산점수 80, 맨 아래 합계 행), 빨간 안내 글 + 오른쪽 "현재 평가등급 : x", · 평정사유 + [저장], 평정사유 입력(높이 100), 아래 가운데 [평가완료][평가취소][닫기]
 * 조직장이면 가중치 3번째 열(조직장용)을 감추고 조직원이면 4번째 열을 감춘다 (settings() L149-255 그대로)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalExecute, EvalGrade, EvalWrite } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<EvalWrite>();

/** setHtmlStyle(글, 색) — 굵은 글씨 */
const LABEL = { fontWeight: 'bold', color: '#0069B4' } as const;

interface Props {
  /** open(evalTargetModel, callback) L71 — 인사평가수행 목록에서 고른 행. null이면 닫힘 */
  target: EvalExecute | null;
  /** [닫기] L248: callback.execute() 뒤 hide() — 부른 쪽이 목록을 다시 조회한다 */
  onClosed: () => void;
}

export const Emp44_Lookup_Write: React.FC<Props> = ({ target, onClosed }) => {
  const gridRef = useRef<AgGridReact<EvalWrite>>(null);
  const [model, setModel] = useState<EvalExecute | null>(target);
  const [rows, setRows] = useState<EvalWrite[]>([]);
  const [grades, setGrades] = useState<EvalGrade[]>([]);
  const [reason, setReason] = useState('');
  const [currentGrade, setCurrentGrade] = useState('');
  const [reasonYn, setReasonYn] = useState(false);
  const [gradeLabel, setGradeLabel] = useState('');

  const done = model?.orderStatus === '완료';
  const orgHead = model?.orgHeadNm === '조직장';

  // getEvalGrade() L317-339: emp.Emp44_EvalWrite.getEmpEvalGrade → "현재 평가등급 : x", 그 등급이 평정사유 필수 등급이면 reasonYn
  const getEvalGrade = useCallback(async (m: EvalExecute, reasonGrades: string[]) => {
    try {
      const g = await empEvalApi.getEvalWriteGrade(m.evalListStdId, m.evalTargetId);
      setReasonYn(g != null && reasonGrades.includes(g));
      setCurrentGrade(g ?? '');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieve() L300-315: emp.Emp44_EvalWrite.getEvalTargetList(evalListStdId, evalTargetId, personId(서버)) → getEvalGrade(), enableComboBox()
  const retrieve = useCallback(async (m: EvalExecute, reasonGrades: string[]) => {
    try {
      setRows(await empEvalApi.searchEvalWrites(m.evalListStdId, m.evalTargetId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await getEvalGrade(m, reasonGrades);
  }, [getEvalGrade]);

  const reasonGrades = useMemo(() => grades.filter(g => g.reasonYn === 'true').map(g => g.grade), [grades]);

  // open() L71-147 → settings() L149-255: 평가등급 콤보(sys.Sys00_Common.selectEvalGrade) · 평정사유 처음 값 · emp.Emp42_EvalGrade.selectByEvalListStdId(안내 글) → show() → retrieve()
  useEffect(() => {
    setModel(target);
    if (!target) return;
    setRows([]);
    setCurrentGrade('');
    setReasonYn(false);
    setReason((target.orderEvalNm === '1차' ? target.firstEvalReason : target.secondEvalReason) ?? '');
    void (async () => {
      let list: EvalGrade[] = [];
      try {
        list = await empEvalApi.searchEvalGrades(target.evalListStdId);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      setGrades(list);
      const rg = list.filter(g => g.reasonYn === 'true').map(g => g.grade);
      setGradeLabel(rg.map(g => `${g} `).join(''));
      await retrieve(target, rg);
    })();
  }, [target, retrieve]);

  // updateReason() L341-354: emp.Emp43_EvalTarget.updateReason(evalTargetId, reason, orderEvalName) — 원본은 결과 메시지가 없다
  const updateReason = async (m: EvalExecute): Promise<boolean> => {
    try {
      await empEvalApi.updateEvalReason(m.evalTargetId, reason === '' ? null : reason, m.orderEvalNm);
      return true;
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return false;
    }
  };

  // [E1] updateButton[저장].Select (L204)
  const onUpdate = () => {
    if (!model) return;
    if (model.orderStatus === '완료') { message.warning('완료된 인사평가내역은 변경이 불가능합니다'); return; }
    void updateReason(model);
  };

  // updateEndYn() L382-428
  const updateEndYn = async (m: EvalExecute, endYn: boolean) => {
    if (endYn && reasonYn) {
      if (reason === '') { message.warning('해당 평가등급은 평정사유 기재가 필요합니다'); return; }
      await updateReason(m);
    }
    if (rows.some(r => r.evalGrade == null)) { message.warning('평가처리하지 않은 항목이 존재합니다'); return; }
    try {
      await empEvalApi.updateEvalEnd(m.evalTargetId, endYn, m.orderEvalNm);
      message.info(endYn ? '인사평가처리가 완료되었습니다' : '인사평가처리가 취소되었습니다');
      // refresh() L430-444: emp.Emp43_EvalTarget.getWrite → 평가상태, enableComboBox()
      const status = await empEvalApi.getEvalWriteStatus(m.evalTargetId);
      setModel({ ...m, orderStatus: status });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // eventChk() L356-380: emp.Emp45_EvalRelateAppr.selectByTermCode → 1차보고 상신문서 상태가 10·20·30이면 막는다
  const eventChk = async (endYn: boolean) => {
    if (!model) return;
    try {
      const status = await empEvalApi.getApprStatus(model.stdYear, model.stdTermCd);
      if (status === '10' || status === '20' || status === '30') {
        message.warning('1차보고 상신문서가 존재하여 수정이 불가능합니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    await updateEndYn(model, endYn);
  };

  // [E5] evalGradeComboBox[sys.Sys00_Common.selectEvalGrade].Collapse (L262) → emp.Emp44_EvalWrite.updateEvalGradeId → retrieve()
  const onGradeChanged = async (e: CellValueChangedEvent<EvalWrite>) => {
    if (!model || !e.data || e.oldValue === e.newValue) return;
    const grade = grades.find(g => g.grade === e.newValue);
    if (!grade) { await retrieve(model, reasonGrades); return; }  // getCodeId() == null → 아무 일 없다
    try {
      await empEvalApi.updateEvalWriteGrade(model.evalTargetId, e.data.evalListId, grade.evalGradeId, orgHead);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
    await retrieve(model, reasonGrades);
  };

  // buildGrid() L257-298 (getSumGrid("합계", 2, 3, 6, "5"))
  const columnDefs = useMemo(() => [
    gb.textCenter('evalClassNm', 100, '평가항목'),  // L290
    gb.textArea('content', 550, '평가요소'),  // L291
    gb.longCenter('weightLeader', 80, '가중치', { hide: orgHead }),  // L292 — 조직장이면 감춘다(L162-164)
    gb.longCenter('weightMember', 80, '가중치', { hide: !orgHead }),  // L293 — 조직원이면 감춘다
    gb.textCenter('evalGrade', 80, '평가등급', { editor: 'select', values: grades.map(g => g.grade), editable: !done }),  // L294 evalGradeComboBox
    gb.doubleCenter('evalGradeScore', 80, '환산점수'),  // L295
  ], [grades, orgHead, done]);

  const info = (label: string, value: string | null | undefined) => (
    <div style={{ display: 'flex', height: 30, alignItems: 'center', padding: '0 10px' }}>
      <span style={{ ...LABEL, width: 100 }}>· {label}</span>
      <span style={LABEL}>{value ?? ''}</span>
    </div>
  );

  return (
    <Modal
      open={target != null}
      title="인사평가표"
      width={1000}
      closable={false}
      maskClosable={false}
      keyboard={false}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] excuteConfirmButton[평가완료].Select (L214) → eventChk(), updateEndYn(true) */}
            <Button type="save" disabled={done} onClick={() => eventChk(true)}>평가완료</Button>
            {/* [E3] excuteCancleButton[평가취소].Select (L231) → eventChk(), updateEndYn(false) */}
            <Button type="cancel" disabled={!done} onClick={() => eventChk(false)}>평가취소</Button>
            {/* [E4] closeButton[닫기].Select (L248) → callback.execute(), hide() */}
            <Button type="close" onClick={onClosed}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ height: 640, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          {info('대상자', `${model.orgNm ?? ''} ${model.posNm ?? ''} ${model.personNm ?? ''}`)}
          {info('입사일', model.hireDateStr)}
          {info('근무기간', model.workYear)}
          {info('평가기간', model.dateStr)}
          {info('평가요소', '')}
          <div style={{ flex: 1, minHeight: 0, margin: '10px 20px', boxSizing: 'border-box' }}>
            <SingleGrid<EvalWrite>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.evalWriteId)}
              sumRow={{ labelField: 'content', label: '합계', sum: ['weightLeader', 'weightMember', 'evalGradeScore'] }}
              onCellValueChanged={e => void onGradeChanged(e)}
              stopEditingWhenCellsLoseFocus
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30, padding: '0 20px 0 10px' }}>
            <span style={{ color: '#DD5E5E', fontWeight: 'bold' }}>* 최종(합계) 평가등급이 {gradeLabel}등급인 경우 하단의 평정사유를 필히 기재하시기 바랍니다.</span>
            <span style={{ fontWeight: 'bold' }}>현재 평가등급 : {currentGrade}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', height: 36, padding: '0 10px' }}>
            <span style={{ ...LABEL, width: 100 }}>· 평정사유</span>
            {/* [E1] updateButton[저장].Select (L204) → updateReason() */}
            <Button type="save" disabled={done} onClick={onUpdate}>저장</Button>
          </div>
          <div style={{ height: 100, margin: '0 10px 10px' }}>
            <Input.TextArea style={{ height: '100%', resize: 'none' }} value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>
      )}
    </Modal>
  );
};
