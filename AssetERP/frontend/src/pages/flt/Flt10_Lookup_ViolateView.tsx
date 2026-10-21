/**
 * 위반내역 조회창 (J07) — Flt02_Tab_EmpInfo의 위반건수 칸을 눌러 연다.
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_ViolateView.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L39-76: 모달 1300×500 "위반내역", 툴바 "기준일"(비활성) + [조회], 그리드 8열, [닫기]. open(personId, baseDate) L78-82: 기준일을 채우고 retrieve()
 * 서비스 flt.Flt10_Tr.selectViolate(companyId, personId, stdDate) — I10 위반내역조회 API 재사용
 * UX보강(10): 조회창 UX-05·06, 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltViolate } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltViolate>();
const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  /** AS-IS open(personId, baseDate)의 사원 ID — 값이 있으면 열린다 */
  personId: number | null;
  /** 기준일(YYYY-MM-DD) */
  baseDate: string;
  onClose: () => void;
}

export const Flt10_Lookup_ViolateView: React.FC<Props> = ({ personId, baseDate, onClose }) => {
  const [rows, setRows] = useState<FltViolate[]>([]);

  // buildGrid() L84-99
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 120, '사원명'),
    gb.text('checkName', 200, '위반내역'),
    gb.text('checkStd', 100, '기준정보'),
    gb.text('checkViolate', 100, '위반정보'),
    gb.date('trDate', 90, '위반거래일'),  // 원본 100 → UX-08
    gb.text('trItemName', 200, '위반종목'),
    gb.textArea('rejectReason', 200, '사전승인의견'),
    gb.textArea('trNote', 200, '매매사유'),
  ], []);

  // retrieve() L101-115: 서비스 flt.Flt10_Tr.selectViolate(companyId, personId, stdDate)
  const retrieve = useCallback(async () => {
    if (personId == null) return;
    try {
      setRows(await fltApi.searchViolate(baseDate, personId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [personId, baseDate]);

  // [E0] 화면 열림 (생성자 L39-76) → show() — open(): retrieve()
  useEffect(() => {
    setRows([]);
    void retrieve();
  }, [retrieve]);

  return (
    <LookupModal
      open={personId != null}
      title="위반내역"
      width={1300}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancelButton[닫기].Select (L55) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L49) → retrieve() */}
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} disabled value={dayjs(baseDate)} format={DATE_FORMAT} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltViolate> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)} />
        </div>
      </div>
    </LookupModal>
  );
};
