/**
 * 법규 사용여부 설정 창 (H08) — 법규관리의 [사용여부 일괄설정]이 연다
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_Except.java (366줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L85-125: 모달 1300×700 "법규 사용여부 설정", 위 툴바(분류 300 "전체" · 사용여부 콤보 100 "전체/사용/미사용" · 검색 150 "분류코드/분류명" · 상세내용 포함 · [조회][저장][전체선택][전체해제])
 *   + 그리드(아이콘 30 · 분류코드 100 가운데 · 분류명 780 · 주기 150 · 미사용 80 체크, 단일 선택), 아래 가운데 [닫기]
 * 열릴 때 조회한다(cycleComboBox 콜백 L69-74). 사용여부 콤보를 닫을 때·검색 Enter·[조회]도 조회.
 * UX보강(10): UX-05·06 LookupModal, 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Select, message } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode, IcsLawExcept } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ics01_Lookup_SelectParent } from './Ics01_Lookup_SelectParent';

/** 같은 법규가 기한 수만큼 여러 행으로 나온다(AS-IS selectByExcept의 sch03_deadline 조인) — 행마다 임시 번호를 붙여 구분한다 */
type Row = IcsLawExcept & { rowId: number };
const gb = gbFor<Row>();
const EXCEPT_OPTIONS = ['전체', '사용', '미사용'];  // StringComboBox L137-139
const exceptYnParam = (label: string) => (label === '사용' ? 'false' : label === '미사용' ? 'true' : undefined);  // retrieve() L250-258

interface Props {
  open: boolean;
  /** [닫기] → callback.execute() (AS-IS: 닫을 때 부르는 쪽이 다시 조회한다) */
  onClose: () => void;
}

export const Ics01_Lookup_Except: React.FC<Props> = ({ open, onClose }) => {
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [exceptLabel, setExceptLabel] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [detailSearchYn, setDetailSearchYn] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const latest = useRef({ classTreeId, exceptLabel, searchText, detailSearchYn });
  latest.current = { classTreeId, exceptLabel, searchText, detailSearchYn };

  // retrieve() L247-274: ics.Ics01_ClassTree.selectByExcept
  const search = useCallback(() => {
    const c = latest.current;
    return icsApi.searchLawExcept({ classTreeId: c.classTreeId, exceptYn: exceptYnParam(c.exceptLabel), searchText: c.searchText, detailSearchYn: c.detailSearchYn })
      .then(list => list.map((r, i): Row => ({ ...r, rowId: i + 1 })));
  }, []);

  // update() L276-328: 고친 법규마다 ics.Ics03_CompanyInfo.selectByClassTreeId → modelUpdate (제외·자동 false), 끝나면 retrieve()
  const save = useCallback(async (changed: Row[]) => {
    await icsApi.saveCompanyInfo(changed.map(r => ({ classTreeId: r.classTreeId, exceptYn: r.exceptYn === 'true' })));
    return changed;
  }, []);

  const crud = useGridCrud<Row>({
    idField: 'rowId',
    search,
    save,
    remove: async () => undefined,
    newRow: () => ({}),
    reloadAfterSave: true,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L85-125) → show(). setting() L127-227: 분류 "전체", 사용여부 "전체"로 초기화하고 cycleComboBox 콜백이 retrieve()
  useEffect(() => {
    if (!open) return;
    setClassTreeId(null);
    setClassTreeName('');
    setExceptLabel('전체');
    setSearchText('');
    setDetailSearchYn(false);
    latest.current = { classTreeId: null, exceptLabel: '전체', searchText: '', detailSearchYn: false };
    void retrieve();
  }, [open]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] classTreeName[전체].TriggerClick [result == null] (L151) → Ics01_Lookup_SelectParent: [전체]면 "전체"·id null, 아니면 전체 이름·id
  const selectParent = async (node: ClassTreeNode | null) => {
    if (!node) {
      setClassTreeName('');
      setClassTreeId(null);
      return;
    }
    let name = node.classTreeName ?? '';
    try {
      name = (await icsApi.getLawDetail(node.classTreeId)).classTreeFullName ?? name;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    setClassTreeName(name);
    setClassTreeId(node.classTreeId);
  };

  // [E3] selectAllButton[전체선택].Select (L188) → selectAll() L330-335 / [E4] releaseAllButton[전체해제].Select (L194) → releaseAll() L337-342
  const setAll = (value: boolean) => crud.rows.forEach(r => crud.updateRow(r.rowId, { exceptYn: String(value) }));

  // buildGrid() L229-245
  const columnDefs = useMemo(() => [
    // L238 detailCell(View) → viewLaw() L349-353: Ics01_Lookup_ClassTreeDetail.open(classTreeId)
    iconCell<Row>('view', 'actionCellDetail', 30, '', row => setDetailId(row.classTreeId)),
    gb.textCenter('classTreeCode', 100, '분류코드'),  // L239
    gb.text('classTreeFullName', 780, '분류명'),  // L240
    gb.text('cycleName', 150, '주기'),  // L241
    gb.boolean('exceptYn', 80, '미사용', { editable: true }),  // L242 addBoolean
  ], []);

  return (
    <LookupModal
      open={open}
      title="법규 사용여부 설정"
      width={1300}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E7] cancleButton[닫기].Select (L212) → callback.execute(), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 560, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L200) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          searchText="조회"
          loading={crud.loading}
          extra={(
            <>
              {/* [E6] updateButton[저장].Select (L206) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E3] selectAllButton[전체선택] */}
              <Button type="addRow" onClick={() => setAll(true)}>전체선택</Button>
              {/* [E4] releaseAllButton[전체해제] */}
              <Button type="removeRow" onClick={() => setAll(false)}>전체해제</Button>
            </>
          )}
        >
          <SearchBar.Field label="분류">
            <LookupInput value={classTreeName} placeholder="전체" width={300} onOpen={() => setParentOpen(true)} onClear={() => void selectParent(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="사용여부">
            {/* [E2] exceptYnComboBox[전체].Collapse (L176) → retrieve() */}
            <Select
              style={{ width: 100 }} value={exceptLabel} options={EXCEPT_OPTIONS.map(v => ({ value: v, label: v }))}
              onChange={v => { latest.current.exceptLabel = v; setExceptLabel(v); }}
              onOpenChange={o => { if (!o) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E8] searchText.KeyPress [Enter] (L219) → retrieve() */}
            <SearchBar.Input style={{ width: 150 }} placeholder="분류코드/분류명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={detailSearchYn} onChange={e => setDetailSearchYn(e.target.checked)}>상세내용 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Row>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          />
        </div>
      </div>
      <Ics01_Lookup_SelectParent open={parentOpen} onResult={node => { void selectParent(node); }} onClose={() => setParentOpen(false)} />
      <Ics01_Lookup_ClassTreeDetail classTreeId={detailId} onClose={() => setDetailId(null)} />
    </LookupModal>
  );
};
