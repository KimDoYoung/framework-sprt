/**
 * 펀드찾기 창 (EE100) — 운용계획서를 고르면 그 계획서의 연관펀드(내 조직 권한이 있는 것)가 아래에 나오고, 펀드를 체크해 돌려준다
 * AS-IS: myApp/client/vi/opr/Opr02_Lookup_Fund.java (219줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L58-145: 900×500 모달 "펀드찾기", 위 툴바 = 년도(100) + 검색*(250) + [조회], 운용계획서 그리드(단일 선택, 200 높이: *제목 200 · 년도 80 · 기간구분 80 · 담당자 100 · 직위 80 · 부서 200 · 시작일 100 · 완료일 100),
 *   "연관펀드" 글, 연관펀드 그리드(체크 다중: 펀드코드 70 · 펀드명 250 · 펀드유형 80 · 운용역 70 · 설정일 80 · 공모/사모 70 · 운용부서 150), 아래 가운데 [확인][취소]
 * 호출처 Opr02_Tabpage_Fund_Manager는 TOBE에 없다(Opr 도메인 미변환) — 창만 만들고 연결하지 않는다
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { oprApi } from '@/api/opr';
import { errorMessage } from '@/api/client';
import { OprCreate, OprFund } from '@/types/opr';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb1 = gbFor<OprCreate>();
const gb2 = gbFor<OprFund>();

interface Props {
  open: boolean;
  /** confirm() L200-210: 체크한 연관펀드 (AS-IS는 한 건도 안 골라도 빈 목록으로 부른다) */
  onResult: (funds: OprFund[]) => void;
  onClose: () => void;
}

export const Opr02_Lookup_Fund: React.FC<Props> = ({ open, onResult, onClose }) => {
  const createGridRef = useRef<AgGridReact<OprCreate>>(null);
  const fundGridRef = useRef<AgGridReact<OprFund>>(null);
  const [year, setYear] = useState(dayjs().format('YYYY'));  // searchYear.setValue(LoginUser.getYear()) L70
  const [title, setTitle] = useState('');
  const [creates, setCreates] = useState<OprCreate[]>([]);
  const [funds, setFunds] = useState<OprFund[]>([]);
  const [loading, setLoading] = useState(false);
  const loadedCreate = useRef<number | null>(null);

  // retrieve2() L191-198: opr.Opr02_Fund.selectByCreateId(companyId, createId, orgId)
  const retrieve2 = useCallback(async (createId: number) => {
    loadedCreate.current = createId;
    try {
      setFunds(await oprApi.searchFunds(createId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieve() L176-189: opr.Opr01_Create.selectByLookupTitle(companyId, "%제목%", "%년도%") → 첫 행을 고른다
  const retrieve = useCallback(async (y: string, t: string) => {
    setLoading(true);
    try {
      const list = await oprApi.searchCreates(t, y);
      setCreates(list);
      loadedCreate.current = null;
      if (list.length > 0) {
        setTimeout(() => createGridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
        await retrieve2(list[0].createId);
      } else {
        setFunds([]);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [retrieve2]);

  // [E0] 화면 열림 (open L58-145) → show(), retrieve()
  useEffect(() => {
    if (!open) return;
    const y = dayjs().format('YYYY');
    setYear(y);
    setTitle('');
    setCreates([]);
    setFunds([]);
    void retrieve(y, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] okButton[확인].Select (L126) → confirm() L200-210
  const confirm = () => {
    onResult(fundGridRef.current?.api?.getSelectedRows() ?? []);
    onClose();
  };

  // buildGrid() L147-160
  const createCols = useMemo(() => [
    gb1.text('title', 200, '*제목'),  // L151
    gb1.text('year', 80, '년도'),  // L152
    gb1.text('termName', 80, '기간구분'),  // L153
    gb1.text('korName', 100, '담당자'),  // L154
    gb1.text('posName', 80, '직위'),  // L155
    gb1.text('orgName' as keyof OprCreate & string, 200, '부서'),  // L156 — AS-IS도 이 SQL에 값이 없어 빈칸
    gb1.date('startDate', 100, '시작일'),  // L157
    gb1.date('closeDate' as keyof OprCreate & string, 100, '완료일'),  // L158 — 빈칸
  ], []);

  // buildGrid2() L162-174
  const fundCols = useMemo(() => [
    gb2.text('fundCode', 70, '펀드코드'),  // L166
    gb2.text('fundName', 250, '펀드명'),  // L167
    gb2.text('fundTypeName', 80, '펀드유형'),  // L168
    gb2.text('empName1', 70, '운용역'),  // L169
    gb2.date('startDate', 80, '설정일'),  // L170
    gb2.text('publicName', 70, '공모/사모'),  // L171
    gb2.text('orgCodeName', 150, '운용부서'),  // L172
  ], []);

  return (
    <LookupModal
      open={open}
      title="펀드찾기"
      width={1010}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L134) → hide() */}
            <Button type="close" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchYear·searchTitle.KeyPress [Enter] (L71·L85), [E2] retrieveButton[조회].Select (L98) → retrieve() */}
        <SearchBar onSearch={() => retrieve(year, title)} loading={loading}>
          <SearchBar.Field label="년도">
            <SearchBar.Input style={{ width: 70 }} value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색*">
            <SearchBar.Input style={{ width: 200 }} value={title} onChange={e => setTitle(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ height: 180, flex: 'none' }}>
          {/* [E5] grid.SelectionChanged [선택>0] (L117) → retrieve2() */}
          <SingleGrid<OprCreate>
            gridRef={createGridRef}
            rowData={creates}
            columnDefs={createCols}
            getRowId={p => String(p.data.createId)}
            onSelect={row => { if (row && row.createId !== loadedCreate.current) void retrieve2(row.createId); }}
          />
        </div>
        <div style={{ fontWeight: 600 }}>연관펀드</div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<OprFund> gridRef={fundGridRef} rowData={funds} columnDefs={fundCols} getRowId={p => String(p.data.fundId)} rowClick />
        </div>
      </div>
    </LookupModal>
  );
};
