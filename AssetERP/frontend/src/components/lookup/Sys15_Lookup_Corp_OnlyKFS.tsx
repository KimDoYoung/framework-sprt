/**
 * 운용사 목록 조회창 (EE20) — Biz13_TabPage_WithCorp의 [운용사코드 등록]이 연다 (다른 도메인 컴포넌트, 구분이 CorpType0001 그룹인 거래처의 등록·수정·삭제)
 * AS-IS: myApp/client/vi/sys/Sys15_Lookup_Corp_OnlyKFS.java (287줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L64-98: 모달 910×650 "운용사 목록", 툴바 [구분 콤보][검색][사용만 보기][조회][등록][저장][삭제] + 체크박스(다중) 셀 편집 그리드, [닫기]
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 조회창 UX-05·06 (삭제·저장용 체크를 쓰는 CRUD 그리드라 rowClick은 쓰지 않는다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { Code, Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Corp>();
const ALL_CODE: [string, string] = ['%', '전체'];
/** setChecked(MULTI) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다. 행 클릭이 삭제 대상을 바꾸지 않게 enableClickSelection은 쓰지 않는다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true } as const;

/** buildGrid() L167-193: corpTypeComboBox Collapse(E9)가 corpType·corpTypeName을 함께 바꾼다 */
const buildGrid = (types: Code[]) => [
  gb.textCenter('corpTypeName', 120, '구분', {
    editor: 'select',
    values: types.map(c => c.name),
    valueSetter: p => {
      p.data.corpTypeName = p.newValue;
      p.data.corpType = types.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
  gb.text('corpName', 200, '운용사명', { editor: 'text' }),  // L187
  gb.textCenter('corpCode', 80, '코드', { editor: 'text' }),  // L188
  gb.text('note', 350, '비고', { editor: 'text' }),  // L189
  gb.boolean('useYn', 70, '사용', { editable: true }),  // L190
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sys15_Lookup_Corp_OnlyKFS: React.FC<Props> = ({ open, onClose }) => {
  const [types, setTypes] = useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(types), [types]);
  const [corpType, setCorpType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [useOnly, setUseOnly] = useState(false);
  const cond = useRef({ corpType: '%', searchText: '', useOnly: false });
  cond.current = { corpType, searchText, useOnly };

  useEffect(() => { sysApi.searchCodesByKindGroup('CorpType0001').then(setTypes).catch(() => setTypes([])); }, []);

  const crud = useGridCrud<Corp>({
    idField: 'corpId',
    // retrieve() L195-209: 서비스 sys.Sys15_Corp.selectByKFS(companyId, corpType, useYn, searchText "%…%")
    search: useCallback(() => sysApi.searchKfsCorps(cond.current.corpType, cond.current.useOnly, cond.current.searchText), []),
    // update() L221-235: GridUpdate → sys.Sys15_Corp.update (실패 메시지는 서버가 준다)
    save: useCallback((rows: Corp[]) => sysApi.updateCorps(rows), []),
    // deleteRow() L237-275: 확인 "선택한 정보를 삭제하시겠습니까?" → [E10] msgBox.DialogHide [YES] (L245) → sys.Sys15_Corp.delete
    remove: useCallback((ids: number[]) => sysApi.deleteCorps(ids), []),
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L211-219: 구분 5(운용사)·사용 true
    newRow: useCallback(() => ({ corpType: '5', corpTypeName: '운용사', useYn: 'true' }), []),
    firstEditField: 'corpName',
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // open() L64-98 → setting(), show() · [E1] corpTypeComboBox.callbackOnCreate (L106) → retrieve() — 구분 콤보를 읽은 뒤 "전체"로 조회한다
  useEffect(() => {
    if (!open) return;
    setCorpType('%');
    setSearchText('');
    setUseOnly(false);
    cond.current = { corpType: '%', searchText: '', useOnly: false };
    void crudRetrieve();
  }, [open, crudRetrieve]);

  // [E7] deleteButton[삭제].Select (L153) → deleteRow() L237-275: 선택이 없으면 "삭제할 정보를 선택하세요"
  const deleteRow = () => {
    if ((crud.gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 정보를 선택하세요');
      return;
    }
    void crud.deleteChecked();
  };

  return (
    <LookupModal open={open} title="운용사 목록" width={910} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E8] closeButton[닫기].Select (L159) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 500, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] searchText.KeyPress [Enter] (L124)·[E4] retrieveButton[조회].Select (L135) → retrieve() */}
        <SearchBar
          onSearch={() => crud.retrieve()}
          extra={<>
            {/* [E5] insertButton[등록].Select (L141) → insertRow() · [E6] updateButton[저장].Select (L147) → update() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" disabled={!crud.hasChecked} onClick={deleteRow}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="구분">
            {/* [E2] corpTypeComboBox.Collapse (L113)·[E9] (L177) → retrieve() */}
            <SystemCodeComboBox kindGroupCd="CorpType0001" altCode={ALL_CODE} style={{ width: 100 }} value={corpType}
              onChange={c => { const v = c ?? '%'; setCorpType(v); cond.current = { ...cond.current, corpType: v }; void crud.retrieve(); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 180 }} placeholder="운용사명/코드/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={useOnly} onChange={e => setUseOnly(e.target.checked)}>사용만 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Corp> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_CHECK} />
        </div>
      </div>
    </LookupModal>
  );
};
