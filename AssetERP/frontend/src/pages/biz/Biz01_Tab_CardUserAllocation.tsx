/**
 * 법인카드 실사용자 배분 (U16) — 자금관리 > 30. 법인카드관리 > 법인카드 실사용자 배분 #1406
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_CardUserAllocation.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-123: 가운데(여백 20, 테두리) = 툴바(기준년월 60 · "미분배건 조회" 체크(기본 켬) · [조회] · [일괄저장]) + 공통카드 사용내역 그리드(체크박스 다중)
 * 함께: Emp00_Lookup_SelectSingle(실사용자 고르기, 공통 단추 있음)
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 원본의 외곽 테두리는 SG 규격(테두리 없음)을 따른다
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 조건이 2개라 UX-02 초기화는 뺀다), 그리드 날짜 폭(UX-08)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bizCardManagementApi, bizCardUserAllocationApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizCardUserAllocation } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<BizCardUserAllocation>();

/** getDataYm() L215-220: 'yyyy.MM'(또는 'yyyy-MM')으로 읽어 'yyyy.MM'으로 돌려준다. 읽을 수 없으면 null */
function parseYm(text: string): string | null {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(text.trim());
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return null;
  return `${m[1]}.${m[2].padStart(2, '0')}`;
}

export const Biz01_Tab_CardUserAllocation: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizCardUserAllocation>>(null);
  // 생성자 L92-101: 기준년월 = 지난달(yyyy.MM), "미분배건 조회" 기본 체크
  const [dataYm, setDataYm] = useState(() => dayjs().subtract(1, 'month').format('YYYY.MM'));
  const [unassignedOnly, setUnassignedOnly] = useState(true);
  const [rows, setRows] = useState<BizCardUserAllocation[]>([]);
  const [checked, setChecked] = useState<BizCardUserAllocation[]>([]);
  const [personOpen, setPersonOpen] = useState(false);

  // retrieve() L142-158: biz.Biz01_Promo.selectCardCommonUser (companyId는 서버, providePurCode "%", realPersonCheck = 체크박스)
  const retrieve = async () => {
    const ym = parseYm(dataYm);
    if (!ym) { message.warning('기준년월을 YYYY.MM 형식으로 입력해주세요'); return; }
    try {
      setRows(await bizCardUserAllocationApi.search(ym, unassignedOnly));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L55-123) → 실사용자 관리를 쓰지 않는 회사면 안내(L66-68), retrieve()
  useEffect(() => {
    void retrieve();
    bizCardManagementApi.getCardRealUser()
      .then(used => { if (!used) message.warning('법인카드 실사용자 관리 미사용 고객입니다. 관리자에게 문의바랍니다.'); })
      .catch(() => undefined);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L125-140
  const columnDefs = useMemo(() => [
    gb.textCenter('closeName', 70, '마감구분'),  // L131
    gb.text('htmlCardName', 110, '카드명'),  // L132
    gb.date('approvalDt', 100, '카드승인일'),  // L133
    gb.text('franchiseName', 200, '가맹점명'),  // L134
    gb.text('sectorName', 150, '업종'),  // L135
    gb.long('provideAmt', 100, '승인금액'),  // L136
    gb.textCenter('regEmpName', 70, '사용자'),  // L137
  ], []);

  // [E3] selectUpdateButton[일괄저장].Select (L85) → selectUpdate() L160-213
  //   고른 내역이 없으면 "선택된 내역이 없습니다." / 첫 고른 행이 마감이면 "마감처리가 완료되어 일괄반영이 불가합니다."
  //   → Emp00_Lookup_SelectSingle.openPublic(오늘, 공통 단추, 겸직 포함) → biz.Biz01_Promo.updateRealPersonId([공통]이면 realPersonId 비움) → 메시지 → retrieve()
  const selectUpdate = () => {
    if (checked.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    if (checked[0].closeYn) { message.warning('마감처리가 완료되어 일괄반영이 불가합니다.'); return; }
    setPersonOpen(true);
  };

  const applyPerson = async (realPersonId: number | null) => {
    setPersonOpen(false);
    try {
      await bizCardUserAllocationApi.update({ promoIds: checked.map(r => r.promoId), realPersonId });
      message.success('저장이 완료되었습니다.');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L79) → retrieve() · [E1] dataYMText.KeyPress [Enter] (L71) → retrieve() · [E4] dataYMText.KeyPress [Enter] (L102) → retrieve() (두 핸들러가 같은 일) */}
        <SearchBar
          onSearch={retrieve}
          extra={<Button type="save" onClick={selectUpdate}>일괄저장</Button>}
        >
          <SearchBar.Field label="기준년월">
            <SearchBar.Input style={{ width: 80 }} placeholder="YYYY.MM" value={dataYm} onChange={e => setDataYm(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={unassignedOnly} onChange={e => setUnassignedOnly(e.target.checked)}>미분배건 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BizCardUserAllocation>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.promoId)}
            onCheckedChange={setChecked}
          />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle
        open={personOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        separateAddTitle
        noneLabel="공통"
        onResult={row => void applyPerson(row == null ? null : row.personId)}
        onClose={() => setPersonOpen(false)}
      />
    </div>
  );
};
