/**
 * 계좌정보 조회창 (J07) — Flt02_Tab_EmpInfo의 계좌건수 칸을 눌러 연다. (계좌 선택용 Flt03_Lookup_Account와 다른 창)
 * AS-IS: myApp/client/vi/flt/Flt03_Lookup_AccountView.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-83: 모달 910×400 "계좌정보", 툴바 "기준일"(비활성) · "폐쇄계좌 포함"(켜짐) + [조회], 그리드 8열, [닫기]. open(personId, baseDate) L85-89: 기준일을 채우고 retrieve()
 * 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate, closeAccountYn) — J01 계좌신고현황 API에 personId를 더해 재사용
 * UX보강(10): 조회창 UX-05·06, 툴바 = SearchBar(UX-01), 날짜 열 90은 원본이 이미 90
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltAccountAdmin } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltAccountAdmin>();
const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  /** AS-IS open(personId, baseDate)의 사원 ID — 값이 있으면 열린다 */
  personId: number | null;
  /** 기준일(YYYY-MM-DD) */
  baseDate: string;
  onClose: () => void;
}

export const Flt03_Lookup_AccountView: React.FC<Props> = ({ personId, baseDate, onClose }) => {
  const [closeYn, setCloseYn] = useState(true);
  const [rows, setRows] = useState<FltAccountAdmin[]>([]);

  // buildGrid() L91-105
  const columnDefs = useMemo(() => [
    gb.text('corpName', 150, '개설기관'),
    gb.text('accountNoDec', 150, '계좌번호'),
    gb.textCenter('accountName', 80, '계좌명'),
    gb.textCenter('familyRelateName', 70, '관계'),
    gb.text('itemTypeName', 130, '종목유형'),
    gb.date('setupDate', 90, '계좌개설일'),
    gb.date('apprRegDate', 90, '상신일'),
    gb.textCenter('apprStatusName', 80, '상신상태'),
  ], []);

  // retrieve() L107-122: 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate=기준일, closeAccountYn)
  const retrieve = useCallback(async (close: boolean) => {
    if (personId == null) return;
    try {
      setRows(await fltApi.searchPersonAccounts(personId, baseDate, close));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [personId, baseDate]);

  // [E0] 화면 열림 (생성자 L41-83) → show() — open(): "폐쇄계좌 포함" 켜고 retrieve()
  useEffect(() => {
    setCloseYn(true);
    setRows([]);
    void retrieve(true);
  }, [retrieve]);

  return (
    <LookupModal
      open={personId != null}
      title="계좌정보"
      width={1010}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancelButton[닫기].Select (L60) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 290, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L54) → retrieve() */}
        <SearchBar onSearch={() => retrieve(closeYn)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} disabled value={dayjs(baseDate)} format={DATE_FORMAT} />
          </SearchBar.Field>
          <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>폐쇄계좌 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltAccountAdmin> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.accountId)} />
        </div>
      </div>
    </LookupModal>
  );
};
