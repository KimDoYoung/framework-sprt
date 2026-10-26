/**
 * 연관펀드 조회창 — 한 펀드 선택 (P12 Fnd25_Edit_FundTermsManager·Fnd25_Lookup_FundTermsManager의 예탁원코드 칸이 연다)
 * AS-IS: myApp/client/vi/fnd/Fnd01_Lookup_SelectSingle.java (283줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L100-206: 모달 1200×500 "연관펀드", 위 툴바(일반펀드/임시펀드 라디오 · 펀드유형 120 · 검색 120 · 해지펀드포함 · 클래스펀드&차등배분형 제외 · [조회]),
 *   단일 체크 그리드(펀드코드 80 · 예탁원코드 120 · 펀드명 350 · 펀드유형 100 · 클래스구분 80 · 수탁사 150 · 설정일 90 · 운용역 90 · 비고 200), 아래 가운데 [확인][취소]
 *   openNone() L74-85: [전체] 단추를 앞에 더한다(callback(null)), openNone2() L87-98: [해당없음] 단추 — `none`으로 고른다. 어느 쪽이든 내 조직 권한 펀드만 나온다
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, message, Radio, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundSingle } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<FundSingle>();
const ALL_CODE: [string, string] = ['%', '전체'];
/** setChecked(SINGLE): 체크박스 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** AS-IS openNone()=[전체] / openNone2()=[해당없음] — 누르면 onResult(null) 뒤 닫는다. 없으면 open()(단추 없음) */
  none?: 'all' | 'none2';
  /** confirm() L246-255: callback.execute(고른 펀드) 뒤 hide() */
  onResult: (fund: FundSingle | null) => void;
  onClose: () => void;
}

export const Fnd01_Lookup_SelectSingle: React.FC<Props> = ({ open, none, onResult, onClose }) => {
  const [planYn, setPlanYn] = useState(false);
  const [fundType, setFundType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [classYn, setClassYn] = useState(true);
  const [rows, setRows] = useState<FundSingle[]>([]);
  const [selected, setSelected] = useState<FundSingle | null>(null);
  const [busy, setBusy] = useState(false);

  // retrieve() L226-244: fnd.Fnd00_Fund.selectBySearchText (회사·내 조직·검색어·펀드유형·클래스제외·해지포함·임시펀드)
  const retrieve = async (over?: { planYn?: boolean }) => {
    setBusy(true);  // grid.mask("Loading")
    try {
      setRows(await fndApi.searchFundSingle({ planYn: over?.planYn ?? planYn, fundType, searchText, closeYn, classYn }));
      setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 화면 열림 → open() L100-206: 일반펀드 선택, 펀드유형 "전체", 해지펀드포함 해제, 클래스펀드&차등배분형 제외 체크, show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setPlanYn(false); setFundType('%'); setSearchText(''); setCloseYn(false); setClassYn(true); setRows([]); setSelected(null);
    setBusy(true);
    fndApi.searchFundSingle({ planYn: false, fundType: '%', searchText: '', closeYn: false, classYn: true })
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setBusy(false));
  }, [open]);

  // [E3] toggleFundType.ValueChange (L117) → retrieve() — 원본은 라디오가 툴바에 붙어 있어 곧바로 다시 조회한다
  const onToggleFundType = (plan: boolean) => { setPlanYn(plan); void retrieve({ planYn: plan }); };

  // [E7] okButton[확인].Select (L187), [E4] grid.RowDoubleClick (L132) → confirm() L246-255
  const confirm = (row: FundSingle | null = selected) => {
    if (!row) {
      message.warning('선택된 펀드가 없습니다');
      return;
    }
    onResult(row);
    onClose();
  };

  // [E1] noneButton[전체].Select (L76), [E2] noneButton2[해당없음].Select (L89) → callback(null), hide()
  const pickNone = () => { onResult(null); onClose(); };

  // buildGrid() L208-224
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 80, '펀드코드'),
    gb.text('ksdFundCode', 120, '예탁원코드'),
    gb.text('fundName', 350, '펀드명'),
    gb.text('kofiaFundTypeName', 100, '펀드유형'),
    gb.text('kofiaClassTypeName', 80, '클래스구분'),
    gb.text('kofiaTrustName', 150, '수탁사'),
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
            {none === 'all' && <Button onClick={pickNone}>전체</Button>}
            {none === 'none2' && <Button onClick={pickNone}>해당없음</Button>}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E8] cancelButton[취소].Select (L193) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] searchText.KeyPress [Enter] (L141), [E6] retrieveButton[조회].Select (L156) → retrieve() */}
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
          <SingleGrid<FundSingle>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fundId)}
            loading={busy}
            rowSelection={SINGLE_CHECKED}
            onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0] ?? null)}
            onRowDoubleClicked={e => e.data && confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
