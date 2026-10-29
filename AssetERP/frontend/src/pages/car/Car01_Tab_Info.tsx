/**
 * [1188] 경영관리 > 10. 차량관리 > 차량정보관리 (T10)
 * AS-IS: myApp/client/vi/car/Car01_Tab_Info.java (275줄) + Car01_Edit_Info.java (172줄, 아래 왼쪽 편집 폼) + Car02_Grid_User.java (203줄, 아래 오른쪽 사용자 그리드)
 *   + components/lookup/Emp00_Lookup_SelectSingle (사용자 그리드의 사원찾기)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L61-99: 위(분할 가능, 여백 20, 최대 1000) = 테두리 박스(툴바 50 + 차량 그리드) / 아래(285, 최대 1000, 여백 0·20·20·20) = 편집 폼(865) + 사용자 그리드
 * 스타일: SGEF (견본 Fnd01_Tab_FundCode — 툴바-그리드 간격 8, 폼 영역 최소, 위쪽 박스 테두리 없음)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarInfo } from '@/types/car';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Car01_Edit_Info } from './Car01_Edit_Info';
import { Car02_Grid_User } from './Car02_Grid_User';

const gb = gbFor<CarInfo>();
const ALL = '%';
/** 콤보 "전체"(carTypeName = ComboBoxField("CarTypeCode", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** 전용차량 — 이때만 사용자 그리드가 켜진다(L142) */
const PRIVATE_CAR = '1';
/** 단일 선택 — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Car01_Tab_Info: React.FC = () => {
  const gridRef = useRef<AgGridReact<CarInfo>>(null);
  // [E0] 화면 열림 (생성자 L61-99) → settings(), retrieve() — 차량구분 "전체"(100), 검색칸(300, 빈칸 글자 안내)
  const [carType, setCarType] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<CarInfo[]>([]);
  const [loading, setLoading] = useState(false);
  /** 목록에서 고른 행 → 편집 폼(editForm)·사용자 그리드(userGrid). null이면 둘 다 비활성 */
  const [selected, setSelected] = useState<CarInfo | null>(null);
  /** 편집 폼에서 차량구분을 바꾼 값 — 사용자 그리드 활성(callback.execute(actionCode)). 행을 고르면 그 행의 값으로 다시 정한다 */
  const [formCarType, setFormCarType] = useState<string | null>(null);
  /** 다음 rowData 갱신 때 고를 행 id (없으면 첫 행) */
  const pendingSelect = useRef<number | null>(null);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);

  // [E1] searchText.KeyPress [Enter] (L106)·[E2] retrieveButton[조회].Select (L114) → retrieve() L185-211: car.Car01_Info.selectByCompanyId
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await carApi.searchInfos({ carType, searchText });
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(list);  // 조회가 끝나면 첫 행을 고르고 폼을 켠다(onRowDataUpdated), 행이 없으면 폼을 끈다
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] insertButton[등록].Select (L120) → insertRow() L213-218: GridInsertRow — 03 원칙 17에 따라 맨 아래에 넣고 보여 준다
  const insertRow = () => {
    const row: CarInfo = { infoId: --tempId.current };
    pendingSelect.current = row.infoId;
    setRows(prev => [...prev, row]);
  };

  // [E4] deleteButton[삭제].Select (L126) → deleteCheck() L220-255: 확인창 "삭제" → [YES] car.Car03_Booking.selectByInfoId(사용내역이 있으면 "사용내역이 등록된 차량정보는 삭제불가합니다")
  //   → [E6] delete() L257-270: car.Car01_Info.delete 뒤 첫 행을 고른다
  const deleteCheck = () => {
    const target = gridRef.current?.api?.getSelectedRows()[0];
    if (!target) { message.warning('삭제할 대상을 선택해주세요.'); return; }
    Modal.confirm({
      title: '삭제',
      content: '선택한 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          if (target.infoId > 0) await carApi.deleteInfos([target.infoId]);  // 저장 전 새 행은 서버에 없다
          pendingSelect.current = null;
          setRows(prev => prev.filter(r => r.infoId !== target.infoId));
          setSelected(null);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E5] grid.SelectionChanged [선택>0] (L134) → 인라인 L134-166: editForm·userGrid 켜기, 전용차량(1)일 때만 userGrid 활성, userGrid.retrieve(infoId), editForm.retrieve(행)
  //   선택이 없으면 둘 다 비활성
  const onSelectionChanged = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0] ?? null;
    setSelected(row);
    setFormCarType(row?.carType ?? null);
  };

  // Car01_Edit_Info.update()의 결과 행으로 목록을 갱신한다(새 행은 임시 id를 서버 id로 바꾼다) → 그 행을 그대로 고른다
  const onSaved = (oldId: number, saved: CarInfo) => {
    pendingSelect.current = saved.infoId;
    setRows(prev => prev.map(r => (r.infoId === oldId ? saved : r)));
  };

  // buildGrid() L169-183
  const columnDefs = useMemo(() => [
    gb.textCenter('carTypeNm', 100, '차량구분'),
    gb.text('carNo', 100, '차량번호'),
    gb.text('carNm', 250, '차량명'),
    gb.text('carInfo', 250, '차량정보'),
    gb.text('note', 400, '비고'),
    gb.text('personNm', 100, '사용자'),
    gb.date('startDate', 100, '사용시작일'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120} max={1000}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="delete" onClick={deleteCheck}>삭제</Button>
                </>}
              >
                <SearchBar.Field label="차량구분">
                  <SystemCodeComboBox kindCd="CarTypeCode" altCode={ALL_CODE} style={{ width: 100 }} value={carType} onChange={c => setCarType(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 300 }} placeholder="차량번호/차량정보/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<CarInfo>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.infoId)}
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
                  onSelectionChanged={onSelectionChanged}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={285} min={200} max={1000}>
          <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box', display: 'flex', gap: 0 }}>
            <div style={{ width: 865, flexShrink: 0, height: '100%' }}>
              <Car01_Edit_Info model={selected} onCarTypeChange={setFormCarType} onSaved={onSaved} />
            </div>
            <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
              <Car02_Grid_User infoId={selected && selected.infoId > 0 ? selected.infoId : undefined} enabled={selected != null && formCarType === PRIVATE_CAR} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
