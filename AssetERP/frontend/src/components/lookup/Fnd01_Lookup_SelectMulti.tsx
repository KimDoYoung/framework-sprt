/**
 * 연관펀드 조회창 — 여러 펀드 선택 (P06 Fnd08_Lookup_OrgAuth의 [행 추가]가 연다). AS-IS openAdmin(callback)만 변환했다(관리자 SQL, orgId 없음)
 * AS-IS: myApp/client/vi/fnd/Fnd01_Lookup_SelectMulti.java (261줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L77-180: 모달 1200×500 "연관펀드", 위 툴바(일반펀드/임시펀드 라디오 · 펀드유형 120 · 검색 120 · 해지펀드포함 · 클래스펀드&차등배분형 제외 · [조회]),
 *   체크박스 다중 그리드(펀드코드 80 · 펀드명 350 · 펀드유형 100 · 클래스구분 80 · 수탁사 150 · 설정일 90 · 운용역 90 · 비고 200), 아래 가운데 [확인][취소]
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Radio, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundMulti } from '@/types/fnd';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<FundMulti>();
const ALL_CODE: [string, string] = ['%', '전체'];

interface Props {
  open: boolean;
  /** confirm() L222-233: callback.execute(고른 펀드들) 뒤 hide() — 고른 것이 없어도 빈 목록으로 닫는다(원본: getSelectedItems()는 null이 아니다) */
  onSelect: (funds: FundMulti[]) => void;
  onClose: () => void;
}

export const Fnd01_Lookup_SelectMulti: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<FundMulti>>(null);
  const [planYn, setPlanYn] = useState(false);
  const [fundType, setFundType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [classYn, setClassYn] = useState(true);
  const [rows, setRows] = useState<FundMulti[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L199-220: fnd.Fnd00_Fund.selectBySearchText (orgId 없음 → selectBySearchTextAdmin)
  const retrieve = async (over?: { planYn?: boolean }) => {
    setBusy(true);  // grid.mask("Loading")
    try {
      setRows(await fndApi.searchFundMulti({ planYn: over?.planYn ?? planYn, fundType, searchText, closeYn, classYn }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 화면 열림 → open() L77-180: 일반펀드 선택, 펀드유형 "전체", 해지펀드포함 해제, 클래스펀드&차등배분형 제외 체크, show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setPlanYn(false); setFundType('%'); setSearchText(''); setCloseYn(false); setClassYn(true); setRows([]);
    setBusy(true);
    fndApi.searchFundMulti({ planYn: false, fundType: '%', searchText: '', closeYn: false, classYn: true })
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setBusy(false));
  }, [open]);

  // [E1] toggleFundType.ValueChange (L97) → retrieve() — 원본은 라디오가 툴바에 붙어 있지 않아 도달 불가였지만 open()의 buttonBar에는 붙어 있다
  const onToggleFundType = (plan: boolean) => { setPlanYn(plan); void retrieve({ planYn: plan }); };

  // [E4] okButton[확인].Select (L161) → confirm() L222-233
  const confirm = () => {
    onSelect(gridRef.current?.api?.getSelectedRows() ?? []);
    onClose();
  };

  // buildGrid() L182-197
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 80, '펀드코드'),
    gb.text('fundName', 350, '펀드명'),
    gb.text('kofiaFundTypeName', 100, '펀드유형'),
    gb.text('kofiaClassTypeName', 80, '클래스구분'),
    gb.text('consignmentName', 150, '수탁사'),
    gb.date('startDate', 90, '설정일'),
    gb.text('empName1', 90, '운용역'),
    gb.text('note', 200, '비고'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="연관펀드"
      width={1200}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E5] cancelButton[취소].Select (L169) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] searchText.KeyPress [Enter] (L114), [E3] retrieveButton[조회].Select (L129) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={busy}>
          <Radio.Group value={planYn} onChange={e => onToggleFundType(e.target.value as boolean)}>
            <Radio value={false}>일반펀드</Radio>
            <Radio value={true}>임시펀드</Radio>
          </Radio.Group>
          <SearchBar.Field label="펀드유형">
            <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 120 }} value={fundType} onChange={c => setFundType(c ?? '%')} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 120 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
          <Checkbox checked={classYn} onChange={e => setClassYn(e.target.checked)}>클래스펀드&amp;차등배분형 제외</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <MultiGrid<FundMulti>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fundId)}
            loading={busy}
            rowClick
          />
        </div>
      </div>
    </LookupModal>
  );
};
