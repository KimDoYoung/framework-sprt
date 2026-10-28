/**
 * 일일점검내역 사용여부 설정 창 (R01) — Chk02_Tab_DailyList의 [사용여부설정]에서 연다
 * AS-IS: myApp/client/vi/chk/Chk02_Lookup_UseYn.java (277줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-108: 모달 "일일점검내역 체크리스트", 툴바 50(분류 300 · 검색 250 "분류/점검내용" · [조회][저장][전체선택][전체해제]),
 *   그리드(분류명 300 · 점검내용 645 · 상세보기 60 · 사용여부 80 편집), 아래 가운데 [닫기]. 열릴 때 곧바로 조회한다(open L69-74)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree, ChkDailyList } from '@/types/chk';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Chk01_Lookup_ClassTree } from './Chk01_Lookup_ClassTree';
import { Chk02_Edit_DailyList } from './Chk02_Edit_DailyList';

const gb = gbFor<ChkDailyList>();

interface Props {
  open: boolean;
  /** cancleButton[닫기] (L190) — callback.execute(); hide(). 부른 쪽이 다시 조회한다 */
  onClosed: () => void;
  /** 창의 닫기(X) — callback 없이 닫는다 */
  onClose: () => void;
}

export const Chk02_Lookup_UseYn: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const gridRef = useRef<AgGridReact<ChkDailyList>>(null);
  // setting() L110-197: 링크코드 "01" 분류가 기준 분류(classTreeModel), 분류칸은 그 이름 · 검색어 빈칸
  const [classTreeModel, setClassTreeModel] = useState<ChkClassTree | null>(null);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<ChkDailyList[]>([]);
  /** 사용여부를 바꾼(addChange) 점검내역 id */
  const dirty = useRef<Set<number>>(new Set());
  const [classOpen, setClassOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<ChecklistView | null>(null);

  // retrieve() L237-243: 서비스 chk.Chk02_DailyList.selectBySearchText2(companyId(서버), classTreeId, "%검색어%")
  const retrieve = useCallback(async (over?: { id?: number | null; text?: string }) => {
    const id = over?.id !== undefined ? over.id : classTreeId;
    if (id == null) return;  // 원본은 기준 분류가 없으면 classTreeId가 null인 채로 조회 → 결과 없음
    try {
      const list = await chkApi.searchAllDailyLists(id, over?.text ?? searchText);
      dirty.current = new Set();
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId, searchText]);

  // [E0] 화면 열림 (생성자 L76-108, open() L69-74) → show() → retrieve(), setting(): 링크코드 "01" 분류를 읽어 분류칸을 채우고 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    dirty.current = new Set();
    void (async () => {
      try {
        const model = await chkApi.getClassTreeByLinkCode('01');
        if (!model) return;
        setClassTreeModel(model);
        setClassTreeId(model.classTreeId);
        setClassTreeName(model.classTreeName ?? '');
        await retrieve({ id: model.classTreeId, text: '' });
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] classTreeName.TriggerClick (L134) → Chk01_Lookup_ClassTree.open(기준 분류): 결과가 있으면 분류 교체, [전체](null)이면 기준 분류로 되돌린다
  const onClassResult = (node: ChkClassTree | null) => {
    if (node) {
      setClassTreeId(node.classTreeId);
      setClassTreeName(node.classTreeName ?? '');
    } else if (classTreeModel) {
      setClassTreeId(classTreeModel.classTreeId);
      setClassTreeName(classTreeModel.classTreeName ?? '');
    }
  };

  // [E5] selectAllButton[전체선택].Select (L177) → selectAll() L223-228 / [E6] releaseAllButton[전체해제].Select (L183) → releaseAll() L230-235: 모든 행의 사용여부를 바꾼다
  const setAllUseYn = (yn: 'true' | 'false') => {
    rows.forEach(r => dirty.current.add(r.dailyListId));
    setRows(prev => prev.map(r => ({ ...r, useYn: yn })));
  };

  // [E4] updateButton[저장].Select (L171) → update() L245-268: 바꾼 행으로 chk.Chk02_DailyList.updateUseYn → "설정이 저장되었습니다" → retrieve()
  const update = async () => {
    const changed = rows.filter(r => dirty.current.has(r.dailyListId)).map(r => ({ dailyListId: r.dailyListId, useYn: r.useYn ?? 'true' }));
    try {
      await chkApi.updateDailyListUseYn(changed);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('설정이 저장되었습니다');
    await retrieve();
  };

  // buildGrid() L199-221
  const columnDefs = useMemo(() => [
    gb.text('classTreeName', 300, '분류명'),  // L215
    gb.textArea('content', 645, '점검내용'),  // L216
    iconCell<ChkDailyList>('view', 'actionCell', 60, '상세보기', row => setViewTarget({ model: row })),  // L217 Chk02_Edit_DailyList.open(selectModel, callback → retrieve())
    gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L218
  ], []);

  return (
    <LookupModal
      open={open}
      title="일일점검내역 체크리스트"
      width={1250}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E7] cancleButton[닫기].Select (L190) → callback.execute(); hide() */}
          <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 540, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L165) → retrieve(), [E2] searchText.KeyPress [Enter] (L157) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              <Button type="save" onClick={update}>저장</Button>
              <Button type="addRow" onClick={() => setAllUseYn('true')}>전체선택</Button>
              <Button type="removeRow" onClick={() => setAllUseYn('false')}>전체해제</Button>
            </>
          }
        >
          <SearchBar.Field label="분류">
            <LookupInput width={300} value={classTreeName} onOpen={() => setClassOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="분류/점검내용" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<ChkDailyList>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.dailyListId)}
            onCellValueChanged={e => { if (e.colDef.field === 'useYn' && e.data) dirty.current.add(e.data.dailyListId); }}
          />
        </div>
      </div>
      {/* [E8] actionCell (ImageCell).callbackOnCreate (L206) → 상세보기 창 [닫기]에서 retrieve() */}
      <Chk02_Edit_DailyList model={viewTarget?.model ?? null} baseClassTreeId={classTreeModel?.classTreeId} readOnly
        onClosed={() => { void retrieve(); }} onClose={() => setViewTarget(null)} />
      <Chk01_Lookup_ClassTree open={classOpen} mode="open" classTreeId={classTreeModel?.classTreeId} onResult={onClassResult} onClose={() => setClassOpen(false)} />
    </LookupModal>
  );
};

interface ChecklistView { model: ChkDailyList }
