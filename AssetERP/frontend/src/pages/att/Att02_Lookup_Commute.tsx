/**
 * 출퇴근 창 (EE50) — MainFrame이 로그인 직후(회사 설정 commutePopupYn) 열고, TopBar 출퇴근 아이콘으로도 연다
 * AS-IS: myApp/client/vi/att/Att02_Lookup_Commute.java (450줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-123: 300×430 모달(크기 고정), 머리말 = 오늘 상태명(미출근·정상·지각 …), 큰 시계 HH:mm:ss(1초 갱신, getClock L262-273),
 *   출근/퇴근 안내 줄(🕒 00:00 출근 전 → HH:mm 출근완료 → HH:mm 퇴근완료), [출근][퇴근], [외근 후 퇴근], [연장근무신청], [오후근무신청]
 * 오후근무신청(Att05_Lookup_PmWork)은 EE72, 연장근무신청(Att03_Lookup_OvertimeReq)은 EE73에서 연결했다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttMyCommute, AttWorkPolicy } from '@/types/att';
import { Button } from '@/components/button';
import { Att02_Edit_Reason, ReasonTarget } from './Att02_Edit_Reason';
import { Att02_Edit_CheckOutTime } from './Att02_Edit_CheckOutTime';
import { Att05_Lookup_PmWork } from './Att05_Lookup_PmWork';
import { Att03_Lookup_OvertimeReq } from './Att03_Lookup_OvertimeReq';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DATE = 'YYYY-MM-DD';
const FONT_COLOR = '#365B9D';
const LOCK_MSG = '퇴근시간이 수기 입력되었습니다. 관리자 확인 전 까지 출퇴근 버튼 이용이 제한됩니다.';

/** 'HH:mm' 또는 'HH:mm:ss' → 하루 중 초 (AS-IS DateTimeFormat "HH:mm:ss" 파싱, 5자리면 ":00"을 붙임) */
const toSec = (s: string): number => {
  const [h, m, sec] = (s.length === 5 ? `${s}:00` : s).split(':').map(Number);
  return h * 3600 + m * 60 + (sec || 0);
};

export const Att02_Lookup_Commute: React.FC<Props> = ({ open, onClose }) => {
  const [clock, setClock] = useState(dayjs().format('HH:mm:ss'));
  const [statusName, setStatusName] = useState('미출근');
  const [inTimeText, setInTimeText] = useState('00:00 출근 전');
  const [processing, setProcessing] = useState(false);
  const [reasonTarget, setReasonTarget] = useState<ReasonTarget | null>(null);
  const [checkOutTarget, setCheckOutTarget] = useState<AttMyCommute | null>(null);
  const [pmWorkOpen, setPmWorkOpen] = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);

  const processingRef = useRef(false);
  const lastInfoRef = useRef<AttMyCommute | null>(null);
  const lockYnRef = useRef(false);
  const policyRef = useRef<AttWorkPolicy | null>(null);
  const extCheckOutYnRef = useRef(false);

  // private startProcessing() L62-74 / endProcessing() L76-82 — 출근·퇴근·외근 후 퇴근 버튼 잠금
  const startProcessing = () => {
    if (processingRef.current) return false;
    processingRef.current = true;
    setProcessing(true);
    return true;
  };
  const endProcessing = () => { processingRef.current = false; setProcessing(false); };

  // updateReason() L363-371 → Att02_Edit_Reason
  const updateReason = (commute: AttMyCommute, actionCode: 'in' | 'out') => setReasonTarget({ actionCode, commute });

  // getInOutTime() L275-361 — 오늘 출퇴근 읽어 안내 줄·머리말을 바꾸고 지각·조기퇴근이면 사유 창
  const getInOutTime = useCallback(async () => {
    const today = dayjs().format(DATE);
    let list: AttMyCommute[] = [];
    try { list = await attApi.searchMyCommute(today); } catch (err) { message.error(errorMessage(err, '조회 실패')); return; }
    if (list.length !== 1) return;
    const r = list[0];
    if (r.checkInTimeStr) {
      setInTimeText(`${r.checkInTimeStr} 출근완료`);
      if (r.checkOutTimeStr) setInTimeText(`${r.checkOutTimeStr} 퇴근완료`);
    } else {
      setInTimeText('00:00 출근 전');
    }
    setStatusName(r.statusName ?? '');
    const wp = policyRef.current;

    // 지각
    if (r.inReason == null && wp && r.checkInTimeStr && wp.workStartTime && wp.startGraceAfterMinutes != null) {
      if (toSec(r.checkInTimeStr) > toSec(wp.workStartTime) + wp.startGraceAfterMinutes * 60) updateReason(r, 'in');
    }
    // 외근(퇴근), 조기퇴근
    if (extCheckOutYnRef.current) {
      updateReason(r, 'out');
      extCheckOutYnRef.current = false;
    } else if (r.outReason == null && wp && r.checkOutTimeStr && wp.workEndTime && wp.endGraceBeforeMinutes != null) {
      if (toSec(r.checkOutTimeStr) < toSec(wp.workEndTime) - wp.endGraceBeforeMinutes * 60) updateReason(r, 'out');
    }
  }, []);

  // [E0] 화면 열림 (생성자 L84-123) → settings(), show(), changeHeading(), getClock(), getLastInfo(), defaultInfo()
  useEffect(() => {
    if (!open) return;
    setStatusName('미출근');
    setInTimeText('00:00 출근 전');
    processingRef.current = false; setProcessing(false);
    lastInfoRef.current = null; policyRef.current = null; extCheckOutYnRef.current = false;
    setClock(dayjs().format('HH:mm:ss'));
    const timer = setInterval(() => setClock(dayjs().format('HH:mm:ss')), 1000); // getClock() L262-273
    let alive = true;

    // getLastInfo() L146-187
    (async () => {
      try {
        const res = await attApi.getMyCommuteLast();
        if (!alive) return;
        lockYnRef.current = res.lockYn;
        const last = res.last;
        if (!last) { lastInfoRef.current = null; return; }
        lastInfoRef.current = last;
        if (res.lockYn && last.statusCode === '99') {
          message.info(LOCK_MSG);
          onClose();
        }
        if (dayjs().format(DATE) !== last.workDate && last.checkInTime != null && last.checkOutTime == null) {
          setCheckOutTarget(last); // Att02_Edit_CheckOutTime.edit(resultModel, callback)
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();

    // defaultInfo() L125-140 — 근태정책 한 건 뒤 getInOutTime()
    (async () => {
      try {
        const list = await attApi.searchActiveWorkPolicies();
        if (!alive) return;
        if (list.length === 1) policyRef.current = list[0];
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      if (alive) await getInOutTime();
    })();

    return () => { alive = false; clearInterval(timer); };
  }, [open, getInOutTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // commute(on) L373-416
  const commute = async (on: boolean) => {
    if (!startProcessing()) return;
    const last = lastInfoRef.current;
    const today = dayjs().format(DATE);
    let baseDate = today;
    if (last && !(today !== last.workDate && last.checkOutTime != null)) baseDate = last.workDate;
    try {
      const status = await attApi.checkMyCommute(on, baseDate);
      if (status > 0) {
        message.info(on ? '출근 처리가 완료되었습니다' : '퇴근 처리가 완료되었습니다');
        await getInOutTime();
      } else if (status === -1) {
        message.info('이미 처리된 요청입니다');
      } else if (status === -2) {
        message.info('출근 기록이 존재하지 않습니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    } finally {
      endProcessing();
    }
  };

  // commuteOffWork() L418-445
  const commuteOffWork = async () => {
    if (!startProcessing()) return;
    try {
      const status = await attApi.offWorkMyCommute(dayjs().format(DATE));
      if (status > 0) {
        extCheckOutYnRef.current = true;
        message.info('외근 후 퇴근 처리가 완료되었습니다');
        await getInOutTime();
      } else if (status === -2) {
        message.info('출근 기록이 존재하지 않습니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    } finally {
      endProcessing();
    }
  };

  // [E1] inButton[출근].Select (L190) → commute()
  const onIn = () => commute(true);
  // [E2] outButton[퇴근].Select [YES] (L196) → commute() / [E3] msgBox.DialogHide [YES] (L205) → commute()
  const onOut = () => {
    if (processingRef.current) return;
    Modal.confirm({ title: '확인', content: '지금 퇴근하시겠습니까?', width: 200, okText: '예', cancelText: '아니오', onOk: () => commute(false) });
  };
  // [E4] offWorkButton[외근 후 퇴근].Select [YES] (L223) → commuteOffWork() / [E5] msgBox.DialogHide [YES] (L228) → commuteOffWork()
  const onOffWork = () => {
    Modal.confirm({
      title: '확인', content: '외근 종료 후 퇴근 처리하시겠습니까? (정시 퇴근으로 반영됩니다.)', width: 400,
      okText: '예', cancelText: '아니오', onOk: commuteOffWork,
    });
  };
  // [E6] overButton[연장근무신청].Select (L246) → Att03_Lookup_OvertimeReq.open() — 다음 단계(팝업-미변환목록 G-22)
  const onOver = () => setOvertimeOpen(true);
  // [E7] afternoonButton[오후근무신청].Select (L253) → Att05_Lookup_PmWork.open() (EE72)
  const onAfternoon = () => setPmWorkOpen(true);

  const big: React.CSSProperties = { width: '100%', height: 55 };

  return (
    <>
      <Modal
        open={open}
        title={statusName}
        width={300}
        footer={null}
        maskClosable={false}
        onCancel={onClose}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 4px 8px' }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: FONT_COLOR, fontVariantNumeric: 'tabular-nums' }}>{clock}</div>
          <div style={{ fontSize: 16, color: FONT_COLOR }}><ClockCircleOutlined />&nbsp;{inTimeText}</div>
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <Button type="register" style={big} disabled={processing} onClick={onIn}>출근</Button>
            <Button type="change" style={big} disabled={processing} onClick={onOut}>퇴근</Button>
          </div>
          <Button type="goto" style={big} disabled={processing} onClick={onOffWork}>외근 후 퇴근</Button>
          <Button type="register" style={big} onClick={onOver}>연장근무신청</Button>
          <Button type="register" style={big} onClick={onAfternoon}>오후근무신청</Button>
        </div>
      </Modal>
      <Att02_Edit_Reason target={reasonTarget} onClose={() => setReasonTarget(null)} />
      <Att05_Lookup_PmWork open={pmWorkOpen} onClose={() => setPmWorkOpen(false)} />
      <Att03_Lookup_OvertimeReq open={overtimeOpen} onClose={() => setOvertimeOpen(false)} />
      <Att02_Edit_CheckOutTime
        target={checkOutTarget}
        onClose={() => setCheckOutTarget(null)}
        onDone={() => {
          // callback.execute() L170-178: 잠금 사용이면 안내 후 닫기, 아니면 닫기
          if (lockYnRef.current) message.info(LOCK_MSG);
          onClose();
        }}
      />
    </>
  );
};
