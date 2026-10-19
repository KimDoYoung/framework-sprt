/**
 * [1445] I/F > 01. I/F 관리 > I/F 설정 (D01)
 * AS-IS: myApp/client/vi/ifi/Ifi90_Tab_Config.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-95: center = 툴바(I/F구분 · 검색 · 조회 · 등록 · 삭제) + 그리드(행번호, 체크박스 단일, Local/Target 헤더 묶음),
 *   south = Ifi90_Edit_Config (편집 폼, 높이 270, 분할 조절 최대 900). 회사 구분 없는 공통 테이블이다.
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04, 조건 2개: I/F구분·검색)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { ifiApi } from '@/api/ifi';
import { errorMessage } from '@/api/client';
import { IfiConfig } from '@/types/ifi';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Ifi90_Edit_Config } from './Ifi90_Edit_Config';

const gb = gbFor<IfiConfig>();
const ALL = '%';  // ifTypeComboBox: ComboBoxField("InterfaceType", "%", "전체")
const LOCAL = '#456EA6';
const TARGET = '#2EAC7E';
const colored = (color: string) => ({ headerStyle: { color, fontWeight: 'bold' } });

/** AS-IS buildGrid() L143-168 — 헤더 묶음 Local(L146)·Target(L147)은 각각 6열 */
const columnDefs = [
  gb.text('ifCode', 120, 'I/F코드'),  // L150
  gb.text('ifName', 250, 'I/F명'),  // L151
  gb.textCenter('ifTypeName', 60, '방식'),  // L152
  { ...gb.group('Local', [  // L146
    gb.text('localHost', 180, 'HOST', colored(LOCAL)),  // L153
    gb.textCenter('localPort', 60, 'PORT', colored(LOCAL)),  // L154
    gb.text('localAccount', 120, '계정ID', colored(LOCAL)),  // L155
    gb.text('localPwDec', 100, '계정PW', colored(LOCAL)),  // L156
    gb.text('localPath', 100, 'Path', colored(LOCAL)),  // L157
    gb.text('localKey', 100, 'Key', colored(LOCAL)),  // L158
  ]), ...colored(LOCAL) },
  { ...gb.group('Target', [  // L147
    gb.text('targetHost', 180, 'HOST', colored(TARGET)),  // L159
    gb.textCenter('targetPort', 60, 'PORT', colored(TARGET)),  // L160
    gb.text('targetAccount', 120, '계정ID', colored(TARGET)),  // L161
    gb.text('targetPwDec', 100, '계정PW', colored(TARGET)),  // L162
    gb.text('targetPath', 100, 'Path', colored(TARGET)),  // L163
    gb.text('targetKey', 100, 'Key', colored(TARGET)),  // L164
  ]), ...colored(TARGET) },
  gb.textArea('note', 250, '비고'),  // L165
];

export const Ifi90_Tab_Config: React.FC = () => {
  const gridRef = useRef<AgGridReact<IfiConfig>>(null);
  /** 조회·등록·저장 뒤 그리드가 행을 채우면 선택할 설정 */
  const keepId = useRef<number | null>(null);
  const tempSeq = useRef(0);
  // settings() L97-141: I/F구분 = 전체, 검색어 = 빈칸
  const sp = useSearchParams(() => ({ ifType: ALL, searchText: '' }));
  const [rows, setRows] = useState<IfiConfig[]>([]);
  const [selected, setSelected] = useState<IfiConfig | null>(null);
  /** 조회·행 선택마다 편집 폼을 다시 만든다 (AS-IS retrieveEditPage → editDriver.edit(model)) */
  const [formSeq, setFormSeq] = useState(0);

  // retrieveEditPage() L170-180: 선택 행이 있으면 editConfig.retrieve(model) + 활성, 없으면 init() + 비활성
  const retrieveEditPage = (row: IfiConfig | null) => {
    setSelected(row);
    setFormSeq(n => n + 1);
  };

  // retrieve() L183-199: 서비스 ifi.Ifi90_Config.selectByIfType(ifType, "%" + searchText + "%") → 행이 있으면 첫 행 선택 → retrieveEditPage()
  const retrieve = useCallback(async () => {
    try {
      const { ifType, searchText } = sp.current.current;
      const list = await ifiApi.searchConfigs(ifType, searchText);
      keepId.current = list[0]?.configId ?? null;
      setRows(list);
      retrieveEditPage(list[0] ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp.current]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] 화면 열림 (생성자 L62-95) → settings() (I/F구분 콤보가 다 불러지면 retrieve() — L48-53)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E4] insertButton[등록].Select (L129) → insertRow() L206-209: GridInsertRow — 맨 아래(03 원칙 17)에 빈 행(임시 ID)을 넣고 선택·스크롤 (DB에는 저장하지 않는다)
  const insertRow = () => {
    const row: IfiConfig = { configId: --tempSeq.current };
    keepId.current = row.configId;
    setRows(prev => [...prev, row]);
    retrieveEditPage(row);
    setTimeout(() => {
      const index = gridRef.current?.api?.getRowNode(String(row.configId))?.rowIndex;
      if (index != null) gridRef.current?.api.ensureIndexVisible(index);
    });
  };

  // [E5] deleteButton[삭제].Select (L135) → deleteRow() L212-250: 선택이 없으면 "삭제대상을 선택하세요", 있으면 확인창 → [E6] YES → 서비스 ifi.Ifi90_Config.delete
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await ifiApi.deleteConfigs(checked.map(r => r.configId));
          message.success('삭제가 완료되었습니다');
          // 콜백 L235-236: editConfig.init() + setEnabled(false)
          const gone = new Set(checked.map(r => r.configId));
          keepId.current = null;
          setRows(prev => prev.filter(r => !gone.has(r.configId)));
          retrieveEditPage(null);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // 저장 뒤 그리드 행을 바꾼다 (AS-IS Ifi90_Edit_Config.update → GridUpdate가 grid.getStore()를 갱신)
  const onSaved = (oldId: number, row: IfiConfig) => {
    keepId.current = row.configId;
    setRows(prev => prev.map(r => (r.configId === oldId ? row : r)));
    retrieveEditPage(row);
  };

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', boxSizing: 'border-box', padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E3] retrieveButton[조회].Select (L123) → retrieve() */}
          <SearchBar onSearch={retrieve} onReset={sp.reset} extra={<>
            {/* [E4] insertButton[등록].Select (L129) → insertRow() */}
            <Button type="register" onClick={insertRow}>등록</Button>
            {/* [E5] deleteButton[삭제].Select (L135) → deleteRow(), [E6] msgBox.DialogHide [YES] (L220) → execute() */}
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </>}>
            <SearchBar.Field label="I/F구분">
              <SystemCodeComboBox kindCd="InterfaceType" altCode={[ALL, '전체']} style={{ width: 150 }}
                value={sp.values.ifType} onChange={c => sp.set('ifType', c ?? ALL)} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              {/* [E1] searchText.KeyPress [Enter] (L105) → retrieve() */}
              <SearchBar.Input style={{ width: 250 }} placeholder="IF코드/IF명/IF방식/IP/URL/비고"
                value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] grid.SelectionChanged [선택>0] (L114) → retrieveEditPage() */}
            <SingleGrid<IfiConfig>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.configId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onSelect={row => { if (row && row.configId !== selected?.configId) retrieveEditPage(row); }}
              onRowDataUpdated={e => {
                if (keepId.current != null) e.api.getRowNode(String(keepId.current))?.setSelected(true, true);
              }}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={270} max={900} min={100}>
        <Ifi90_Edit_Config key={`${selected?.configId ?? 'none'}-${formSeq}`} model={selected} onSaved={onSaved} />
      </Splitter.Panel>
    </Splitter>
  );
};
