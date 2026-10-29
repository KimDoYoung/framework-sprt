/**
 * [1486] 경영관리 > 06. 근태관리 > 연장근무관리 (T07)
 * AS-IS: myApp/client/vi/att/Att03_Tab_OvertimeReq.java (219줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-77: 가운데(여백 20, 테두리) = 툴바(조회기간 {시작=오늘} ~ {종료=오늘+7} · [조회][저장] · [확정][확정취소]) + 체크박스 다중 그리드(13열, 지급방법만 콤보 셀 편집)
 * 스타일: CG로 분류되나 견본·상세가 없어 SG 견본(Tdm01_Tab_Hr: SearchBar + 그리드)을 뼈대로 썼다 — 결과확인 13
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { AttOvertimeReq } from '@/types/att';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AttOvertimeReq>();
const DATE = 'YYYY-MM-DD';

export const Att03_Tab_OvertimeReq: React.FC = () => {
  // settings() L79-85: 조회기간 = 오늘 ~ 오늘+7일. 서버 SQL이 기간을 쓰지 않아 조회에는 보내지 않는다(T07 작업방법)
  const [startDate, setStartDate] = useState(() => dayjs().format(DATE));
  const [closeDate, setCloseDate] = useState(() => dayjs().add(7, 'day').format(DATE));
  const [rows, setRows] = useState<AttOvertimeReq[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<Code[]>([]);
  // 수정한 행·체크한 행은 ref로 든다: 다시 그리면 그리드 선택이 풀리기 때문(11 §1 함정)
  const modified = useRef<Map<number, AttOvertimeReq>>(new Map());
  const checked = useRef<AttOvertimeReq[]>([]);
  const gridRef = useRef<{ api?: { deselectAll: () => void } } | null>(null);

  // retrieve() L201-214: att.Att03_OvertimeReq.getConfirmList(companyId, startDate, closeDate)
  const retrieve = useCallback(async () => {
    try {
      const list = await attApi.searchOvertimeReqs();
      modified.current = new Map();
      checked.current = [];
      gridRef.current?.api?.deselectAll();
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L51-77) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    sysApi.searchCodes('PaymentTypeCode').then(setPaymentTypes).catch(() => undefined);
  }, [retrieve]);

  // update() L147-173: 수정한 행 중 확정된 것이 있으면 막는다 → att.Att13_OvertimeReqHist.updateInfo(confirmerId, updateList)
  const update = async () => {
    const list = [...modified.current.values()];
    if (list.some(m => m.confirmYn === 'true')) {
      message.warning('확정된 내역은 수정이 불가능합니다');
      return;
    }
    try {
      await attApi.updateOvertimeReqs({ rows: list.map(({ overtimeReqId, paymentTypeCode, confirmYn, changeReason }) => ({ overtimeReqId, paymentTypeCode, confirmYn, changeReason })) });
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // confirm(boolean) L175-199: 수정 중이면 막고, 체크한 행으로 att.Att13_OvertimeReqHist.updateInfo(confirmYn, confirmerId, updateList)
  const confirm = async (confirmYn: boolean) => {
    // [E3]·[E4] L100-118: 선택이 없으면 먼저 알린다
    if (checked.current.length === 0) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    if (modified.current.size > 0) {
      message.warning('저장 후 진행가능합니다');
      return;
    }
    try {
      await attApi.updateOvertimeReqs({
        confirmYn,
        rows: checked.current.map(({ overtimeReqId, paymentTypeCode, changeReason }) => ({ overtimeReqId, paymentTypeCode, confirmYn: String(confirmYn), changeReason })),
      });
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, confirmYn ? '확정 실패' : '확정취소 실패'));
    }
  };

  // buildGrid() L122-145
  const columnDefs = useMemo(() => [
    gb.booleanYn('confirmYn', 50, '확정'),  // L130
    gb.date('workDate', 100, '근무일자'),  // L131
    gb.textCenter('personNo', 100, '사원번호'),  // L132
    gb.textCenter('personName', 80, '사원명'),  // L133
    gb.text('orgName', 160, '본부(부서)'),  // L134
    gb.textCenter('posName', 80, '직위'),  // L135
    gb.textCenter('workTypeName', 100, '구분'),  // L136
    gb.textCenter('overTimeStr', 140, '근무시간'),  // L137
    gb.text('reason', 220, '사유'),  // L138
    gb.textCenter('workRewardTypeName', 120, '보상구분'),  // L139
    // [E5] paymentType[PaymentTypeCode].Collapse (L124) → 고른 코드를 지급방법(paymentTypeCode)의 변경으로 기록
    gb.textCenter('paymentTypeName', 120, '지급방법', {  // L140
      editor: 'select',
      values: paymentTypes.map(c => c.name),
      valueSetter: p => {
        const code = paymentTypes.find(c => c.name === p.newValue)?.code ?? null;
        if (p.data.paymentTypeCode === code) return false;
        p.data.paymentTypeName = p.newValue;
        p.data.paymentTypeCode = code;
        modified.current.set(p.data.overtimeReqId, p.data);
        return true;
      },
    }),
    gb.textHtml('weekReport', 100, '주 연장근로'),  // L141 addTextHtmlCenter
    gb.textHtml('monthReport', 100, '월 연장근로'),  // L142 addTextHtmlCenter
  ], [paymentTypes]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L88) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={
            <>
              {/* [E2] updateButton[저장].Select (L94) → update() */}
              <Button type="save" onClick={update}>저장</Button>
              {/* [E3] confirmButton[확정].Select (L100) → confirm(true) */}
              <Button type="save" onClick={() => confirm(true)}>확정</Button>
              {/* [E4] rejectButton[확정취소].Select (L110) → confirm(false) */}
              <Button type="cancel" onClick={() => confirm(false)}>확정취소</Button>
            </>
          }
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 125 }} allowClear={false} format={DATE} value={dayjs(startDate)} onChange={d => d && setStartDate(d.format(DATE))} />
            <span style={{ margin: '0 6px' }}>~</span>
            <DatePicker style={{ width: 125 }} allowClear={false} format={DATE} value={dayjs(closeDate)} onChange={d => d && setCloseDate(d.format(DATE))} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<AttOvertimeReq>
            gridRef={gridRef as never}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.overtimeReqId)}
            onCheckedChange={r => { checked.current = r; }}
          />
        </div>
      </div>
    </div>
  );
};
