/**
 * [1046] 펀드관리 > 01. 상품기획 > 신규기획펀드 등록 (P01)
 * AS-IS: myApp/client/vi/fnd/Fnd01_Tab_FundPlan.java (258줄) + Fnd01_Edit_FundPlan.java (368줄, 아래 편집 폼) + Fnd00_Lookup_FundCode.java (221줄, components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L54-141: 위(분할 가능, 여백 20) = 테두리 박스(툴바 50 + 임시펀드 그리드) / 아래(310, 최대 900, 여백 0·20·20·20) = 편집 폼(Fnd01_Edit_FundPlan)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundPlan } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Fnd01_Edit_FundPlan } from './Fnd01_Edit_FundPlan';

const gb = gbFor<FundPlan>();
const ALL = '%';
/** 콤보 "전체"(fundTypeComboBox = ComboBoxField("IcamFundType", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd01_Tab_FundPlan: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundPlan>>(null);
  // [E0] 화면 열림 (생성자 L54-141) → retrieve() — 열자마자 조회한다. 펀드유형 "전체"(200), 임시펀드 검색칸(400, 빈칸 글자 "전체"), 종료임시펀드포함 해제
  const [fundTypeCode, setFundTypeCode] = useState<string>(ALL);
  const [fundText, setFundText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [rows, setRows] = useState<FundPlan[]>([]);
  const [loading, setLoading] = useState(false);
  /** 목록에서 고른 행 → 편집 폼(editFundCodeForm). null이면 폼 비활성 */
  const [selected, setSelected] = useState<FundPlan | null>(null);
  /** 다음 rowData 갱신 때 고를 행 id (없으면 첫 행) */
  const pendingSelect = useRef<number | null>(null);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);

  // [E1] fundSearchTextField.KeyPress [Enter] (L58)·[E2] retrieveButton[조회].Select (L82) → retrieve() L177-200: fnd.Fnd01_FundCode.selectByFundPlan
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchFundPlans({ closeYn, fundName: fundText, fundTypeCode });
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(list);  // 조회가 끝나면 첫 행을 고르고 폼을 켠다(onRowDataUpdated), 행이 없으면 폼을 끈다
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] insertButton[등록].Select (L88) → insertRow() L208-220: GridInsertRow — 03 원칙 17에 따라 맨 아래에 넣고 보여 준다
  const insertRow = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const row: FundPlan = {
      fundCodeId: --tempId.current,
      startDate: today,
      workDate: today,
      closeName: '임시펀드',
      closeYn: 'false',
    };
    pendingSelect.current = row.fundCodeId;
    setRows(prev => [...prev, row]);
  };

  // [E4] deleteButton[삭제].Select (L95) → deleteRow() L223-236: 확인창 "삭제" "선택한 내용을 삭제하시겠습니까?"
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    // [E6] messageBox.DialogHide [YES] (L226) → deleteSelectedRow() L238-249: fnd.Fnd01_FundCode.delete
    Modal.confirm({
      title: '삭제',
      content: '선택한 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          const saved = checked.filter(r => r.fundCodeId > 0);
          if (saved.length > 0) await fndApi.deleteFundPlans(saved);
          const ids = new Set(checked.map(r => r.fundCodeId));
          pendingSelect.current = null;
          setRows(prev => prev.filter(r => !ids.has(r.fundCodeId)));  // 지운 뒤 첫 행을 고른다
          setSelected(null);
          message.success(`${saved.length}건 삭제되었습니다.`);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E5] grid.SelectionChanged [선택>0] (L121) → retrieveEditPage() L165-174: editFundCodeForm.retrieve(선택한 행) / 선택이 없으면 폼 비활성
  const retrieveEditPage = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    setSelected(row ?? null);
  };

  // Fnd01_Edit_FundPlan.updateRow()의 결과 행으로 목록을 갱신한다(새 행은 임시 id를 서버 id로 바꾼다) → 그 행을 그대로 고른다
  const onSaved = (oldId: number, saved: FundPlan) => {
    pendingSelect.current = saved.fundCodeId;
    setRows(prev => prev.map(r => (r.fundCodeId === oldId ? saved : r)));
  };

  // buildGrid() L143-163
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 70, '임시코드'),
    gb.text('fundName', 250, '임시펀드명'),
    gb.text('kofiaFundTypeName', 120, '펀드유형'),
    gb.date('startDate', 90, '등록일'),
    gb.date('endDate', 90, '예정일'),
    gb.text('closeName', 70, '펀드상태'),
    gb.text('kofiaTrustName', 120, '신탁구분'),
    gb.text('kofiaPublicName', 130, '공모구분'),
    gb.text('orgCodeName', 120, '운용부서'),
    gb.text('operator1', 100, '운용역1'),
    gb.text('operator2', 100, '운용역2'),
    gb.text('realFundCode', 90, '확정펀드'),
    gb.text('realFundName', 250, '확정펀드명'),
    gb.text('note', 300, '비고'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120} max={1000}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="delete" onClick={deleteRow}>삭제</Button>
                </>}
              >
                <SearchBar.Field label="펀드유형">
                  <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 200 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="임시펀드">
                  <SearchBar.Input style={{ width: 400 }} placeholder="전체" value={fundText} onChange={e => setFundText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>종료임시펀드포함</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<FundPlan>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.fundCodeId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => {
                    // 조회·등록·저장 뒤 고를 행(없으면 첫 행)을 고르고 보여 준다
                    const node = pendingSelect.current != null ? e.api.getRowNode(String(pendingSelect.current)) : e.api.getDisplayedRowAtIndex(0);
                    pendingSelect.current = null;
                    if (node) {
                      node.setSelected(true);
                      if (node.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                    }
                  }}
                  onSelectionChanged={retrieveEditPage}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={350} min={350} max={900}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Fnd01_Edit_FundPlan model={selected} onSaved={onSaved} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
