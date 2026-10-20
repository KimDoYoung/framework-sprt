/**
 * [1338] 준법감시 > 01. 법규관리 > 법규등록신청 (H11)
 * AS-IS: myApp/client/vi/ics/Ics17_Tab_UserRequest.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-115: 위 38%(분할, 최대 1000) = 툴바(발생일 ~ · 완료여부 · 검색어 · 미확인건만 보기 · 조회 · 등록) + 법규등록요청 그리드(행번호, 체크박스 단일),
 *   아래 62%(분할, 최대 1100) = 편집 영역 Ics17_Edit_UserRequest. 관리자용 짝은 Ics17_Tab_UserRequestAdmin(E09, 기초자료 #1339)
 * UX보강(10): 툴바 = SearchBar(UX-01 조회 로딩·Enter). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsUserRequest } from '@/types/ics';
import { SingleGrid, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ics17_Edit_UserRequest } from './Ics17_Edit_UserRequest';

const gb = gbFor<IcsUserRequest>();

/** AS-IS buildGrid() L153-166 */
const buildGrid = () => [
  gb.date('regDate', 100, '요청일'),
  gb.text('personName', 120, '요청자'),
  gb.text('lawTitle', 900, '법규명'),
  gb.text('stateName', 80, '진행상태'),
  gb.date('closeDate', 100, '완료일'),
  gb.booleanYn('confirmYn', 100, '확인'),
];

export const Ics17_Tab_UserRequest: React.FC = () => {
  const user = useLoginUser();
  const columnDefs = useMemo(buildGrid, []);
  const gridRef = useRef<AgGridReact<IcsUserRequest>>(null);
  const [rows, setRows] = useState<IcsUserRequest[]>([]);
  const [selected, setSelected] = useState<IcsUserRequest | null>(null);
  const [loading, setLoading] = useState(false);
  // settings() L117-151: 발생일 = 올해 1월 1일 ~ 오늘, 완료여부 = 전체, 미확인건만 보기 켜짐
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [stateCode, setStateCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [unconfirmedOnly, setUnconfirmedOnly] = useState(true);
  const selectedId = useRef<number | null>(null);
  const tempId = useRef(0);

  // AS-IS retrieve() L188-237 — 끝나면 고른 행(없으면 첫 행)을 고르고 retrieveEditPage()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await icsApi.searchUserRequests({
        startDate: startDate.format('YYYY-MM-DD'), closeDate: closeDate.format('YYYY-MM-DD'), stateCode, unconfirmedOnly, searchText,
      });
      setRows(list);
      const keep = list.find(r => r.userRequestId === selectedId.current) ?? list[0] ?? null;
      selectedId.current = keep?.userRequestId ?? null;
      setSelected(keep);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, stateCode, unconfirmedOnly, searchText]);

  // [E0] 화면 열림 (생성자 L58-115) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // 조회·등록 뒤 행 고르기를 그리드에도 반영
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.forEachNode(n => { if (n.data && n.data.userRequestId === selected?.userRequestId && !n.isSelected()) n.setSelected(true); });
  }, [rows, selected]);

  // Edit.updateRow → grid.getStore().update(model): 저장한 행을 그 자리에서 바꾼다 (새 신청은 임시 ID 행이 저장된 행으로 바뀐다)
  const onSaved = (row: IcsUserRequest, previousId: number) => {
    setRows(prev => prev.map(r => (r.userRequestId === previousId ? row : r)));
    selectedId.current = row.userRequestId;
    setSelected(row);
  };

  // Edit.delete() → callback.execute() = retrieve(): 지운 행은 목록에서 빠지고 첫 행이 선택된다
  const onDeleted = () => {
    selectedId.current = null;
    void retrieve();
  };

  // [E4] insertButton[등록].Select (L145) → insertRow() L239-254: 회사·요청자·요청일(오늘)을 채운 빈 행을 맨 아래에 더하고 편집 영역을 연다 (03 원칙 17)
  const insertRow = () => {
    tempId.current -= 1;
    const row: IcsUserRequest = {
      userRequestId: tempId.current, companyId: user.companyId, companyName: user.companyName, personId: user.userId, personName: user.name,
      regDate: dayjs().format('YYYY-MM-DD'), lawTitle: '', lawContent: null, submitTo: null, relatedLaw: null, reportCycle: null,
      result: null, note: null, stateCode: null, stateName: null, closeDate: null, confirmYn: 'false',
    };
    setRows(prev => [...prev, row]);
    selectedId.current = row.userRequestId;
    setSelected(row);
    setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(row.userRequestId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="38%" max={1000} min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 4px', boxSizing: 'border-box' }}>
          {/* [E3] retrieveButton[조회].Select (L139) → retrieve(), [E2] searchText.KeyPress [Enter] (L130) → retrieve() */}
          <div style={{ overflowX: 'auto' }}>
            <SearchBar
              onSearch={retrieve}
              loading={loading}
              style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}
              extra={<Button type="register" onClick={insertRow}>등록</Button>}
            >
              <SearchBar.Field label="발생일">
                <DatePicker allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
                <span style={{ margin: '0 4px' }}>~</span>
                <DatePicker allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
              </SearchBar.Field>
              <SearchBar.Field label="완료여부">
                <SystemCodeComboBox kindCd="AfterStateCode" altCode={['%', '전체']} style={{ width: 100 }} value={stateCode}
                  onChange={code => setStateCode(code ?? '%')} />
              </SearchBar.Field>
              <SearchBar.Field label="검색어">
                <SearchBar.Input style={{ width: 200 }} placeholder="법규명/법규내용" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
              <Checkbox checked={unconfirmedOnly} onChange={e => setUnconfirmedOnly(e.target.checked)}>미확인건만 보기</Checkbox>
            </SearchBar>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E1] grid.RowClick (L107) → retrieveEditPage() L168-186: 고른 행을 편집 영역에 채운다 */}
            <SingleGrid<IcsUserRequest>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.userRequestId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onSelect={r => { if (r) { selectedId.current = r.userRequestId; setSelected(r); } }}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel max={1100} min={200}>
        <Ics17_Edit_UserRequest model={selected} onSaved={onSaved} onDeleted={onDeleted} />
      </Splitter.Panel>
    </Splitter>
  );
};
