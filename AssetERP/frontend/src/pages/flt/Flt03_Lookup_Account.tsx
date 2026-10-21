/**
 * 계좌정보 조회창 (I05) — Flt10_Tab_RealTransaction의 [계좌선택]·계좌정보 칸에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt03_Lookup_Account.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNull(baseDate, callback) L46-58: [확인][전체][닫기] / open(baseDate, callback) L60-68: [확인][닫기] / openDateLock L70-78: 기준일 고정
 * 생성자 L80-136: 툴바 "기준일" + [조회], 그리드(주계좌 60 · 개설기관 100 · 계좌번호 200 · 계좌명 100 · 종목유형 130)
 * UX보강(10): 조회창 UX-05·06, 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltTrAccount>();
const DATE_FORMAT = 'YYYY-MM-DD';

/** buildGrid() L138-148 — 행 하나 선택(setChecked 없음) */
const buildGrid = () => [
  gb.textCenter('mainAccountYnStr', 60, '주계좌'),
  gb.text('corpName', 100, '개설기관'),
  gb.text('accountNoDec', 200, '계좌번호'),
  gb.text('accountName', 100, '계좌명'),
  gb.text('itemTypeName', 130, '종목유형'),
];

/** confirm() L170: 고른 계좌의 이름 = 계좌번호 + 개설기관 + 계좌명 */
export const accountLabel = (a: FltTrAccount) => `${a.accountNoDec ?? ''} ${a.corpName ?? ''} ${a.accountName ?? ''}`;

interface Props {
  open: boolean;
  /** 기준일(YYYY-MM-DD) */
  baseDate: string;
  /** openNull이면 [전체] 단추를 보인다 */
  withNull?: boolean;
  /** openDateLock이면 기준일을 못 바꾼다 */
  dateLock?: boolean;
  /** callback.execute(model): [확인]·더블클릭 = 고른 계좌, [전체] = null */
  onResult: (account: FltTrAccount | null) => void;
  onClose: () => void;
}

export const Flt03_Lookup_Account: React.FC<Props> = ({ open, baseDate, withNull, dateLock, onResult, onClose }) => {
  const [date, setDate] = useState(baseDate);
  const [rows, setRows] = useState<FltTrAccount[]>([]);
  const [selected, setSelected] = useState<FltTrAccount | undefined>(undefined);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L150-164: 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate=기준일)
  const retrieve = useCallback(async (stdDate: string) => {
    try {
      setRows(await fltApi.searchTrAccounts(stdDate));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L80-136) → show() — open*() : 기준일을 채우고 retrieve()
  useEffect(() => {
    if (!open) return;
    setDate(baseDate);
    setSelected(undefined);
    setRows([]);
    void retrieve(baseDate);
  }, [open, baseDate, retrieve]);

  // [E2] oKButton[확인].Select (L93) · [E5] grid.CellDoubleClick (L124) → confirm() L166-177
  const confirm = (picked?: FltTrAccount) => {
    const account = picked ?? selected;
    if (!account) {
      message.warning('선택된 계좌정보가 없습니다');
      return;
    }
    onResult(account);
  };

  return (
    <LookupModal
      open={open}
      title="계좌정보"
      width={780}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>확인</Button>
            {/* [E3] nullButton[전체].Select (L99) → callback.execute(null), hide() */}
            {withNull && <Button type="close" onClick={() => onResult(null)}>전체</Button>}
            {/* [E4] cancelButton[닫기].Select (L106) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 250, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L87) → retrieve() */}
        <SearchBar onSearch={() => retrieve(date)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} disabled={dateLock} value={dayjs(date)} format={DATE_FORMAT}
              onChange={d => d && setDate(d.format(DATE_FORMAT))} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltTrAccount>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.accountId)}
            onSelect={setSelected}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
