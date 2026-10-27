/**
 * [1240] 펀드관리 > 10. 펀드회계 일일점검 > 일일점검내역 관리 (R01)
 * AS-IS: myApp/client/vi/chk/Chk02_Tab_DailyList.java (361줄) + Chk02_Lookup_UseYn.java (277줄) + Chk02_Edit_DailyList.java (283줄, 공용) + Chk01_Lookup_ClassTree(공용) + Sch22_Lookup_WriteGroup(공용)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L69-99: north = 툴바 50(분류 300 · 검색 250 "분류/점검내용/설명" · [조회][등록][삭제][사용여부설정][담당그룹 지정]), center = 점검내역 그리드(행번호, 체크박스 다중)
 * 스타일: SGP (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree, ChkDailyList } from '@/types/chk';
import { Sch22WriteGroup } from '@/types/sch';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Sch22_Lookup_WriteGroup } from '../sch/Sch22_Lookup_WriteGroup';
import { Chk01_Lookup_ClassTree } from './Chk01_Lookup_ClassTree';
import { Chk02_Edit_DailyList, ChkDailyListEdit } from './Chk02_Edit_DailyList';
import { Chk02_Lookup_UseYn } from './Chk02_Lookup_UseYn';

const gb = gbFor<ChkDailyList>();

export const Chk02_Tab_DailyList: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<ChkDailyList>>(null);
  // settings() L101-193: 링크코드 "01" 분류가 기준 분류(classTreeModel), 분류칸은 그 이름 · 검색어 빈칸
  const [classTreeModel, setClassTreeModel] = useState<ChkClassTree | null>(null);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<ChkDailyList[]>([]);
  const [editTarget, setEditTarget] = useState<ChkDailyListEdit | null>(null);
  const [classOpen, setClassOpen] = useState(false);
  const [useYnOpen, setUseYnOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  // retrieve() L227-234: 서비스 chk.Chk02_DailyList.selectBySearchText(companyId(서버), classTreeId, useYn "true", "%검색어%")
  const retrieve = useCallback(async (over?: { id?: number | null }) => {
    const id = over?.id !== undefined ? over.id : classTreeId;
    if (id == null) return;  // 원본은 기준 분류가 없으면 classTreeId가 null인 채로 조회 → 결과 없음
    try {
      setRows(await chkApi.searchDailyLists(id, 'true', searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId, searchText]);

  // [E0] 화면 열림 (생성자 L69-99) → settings(): 서비스 chk.Chk01_ClassTree.selectByLinkCode(linkCode "01") → 분류칸 채우고 retrieve()
  useEffect(() => {
    void (async () => {
      try {
        const model = await chkApi.getClassTreeByLinkCode('01');
        if (!model) return;
        setClassTreeModel(model);
        setClassTreeId(model.classTreeId);
        setClassTreeName(model.classTreeName ?? '');
        await retrieve({ id: model.classTreeId });
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] classTreeName.TriggerClick [result != null] (L125) → Chk01_Lookup_ClassTree.open(기준 분류): 결과가 있으면 분류 교체, [전체](null)이면 기준 분류로 되돌린다
  const onClassResult = (node: ChkClassTree | null) => {
    if (node) {
      setClassTreeId(node.classTreeId);
      setClassTreeName(node.classTreeName ?? '');
    } else if (classTreeModel) {
      setClassTreeId(classTreeModel.classTreeId);
      setClassTreeName(classTreeModel.classTreeName ?? '');
    }
  };

  // [E4] insertButton[등록].Select (L163) → insertRow() L292-317: 회사·사용 true·adminDailyListId 0인 새 점검내역으로 Chk02_Edit_DailyList.edit
  const insertRow = () => setEditTarget({ companyId: user.companyId, useYn: 'true', adminDailyListId: 0 });

  // Chk02_Edit_DailyList 콜백: 저장하면 그 행을 그리드에 넣는다 (AS-IS grid.getStore().update(result)). 새 행은 맨 아래(03 원칙 17)로 보여 준다. 저장 없이 닫으면 새 행은 없다(원본의 retrieve()와 같다)
  const onSaved = (saved: ChkDailyList) => {
    const exists = rows.some(r => r.dailyListId === saved.dailyListId);
    setRows(prev => (exists ? prev.map(r => (r.dailyListId === saved.dailyListId ? saved : r)) : [...prev, saved]));
    if (!exists) setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(saved.dailyListId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // [E5] deleteButton[삭제].Select (L169) → deleteChk() L319-337: "n건의 항목을 삭제하시겠습니까?"(제목 "삭제", 폭 300)
  //   → [E9] msgBox.DialogHide [YES] (L322) → deleteRow() L339-356: 잠긴(adminYn) 행이 있으면 "잠겨있는 점검내역은 삭제가 불가능합니다", 아니면 chk.Chk02_DailyList.delete → retrieve()
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }  // 05 §8: 선택 없이 삭제는 확인창 없이 경고(원본은 빈 목록으로 서버를 불러 오류)
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 항목을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        if (checked.some(r => r.adminYn)) { message.warning('잠겨있는 점검내역은 삭제가 불가능합니다'); return; }
        try {
          await chkApi.deleteDailyLists(checked.map(r => r.dailyListId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // [E7] batchMangerButton[담당그룹 지정].Select (L187) → batchMangerChk() L236-254: "n건의 항목을 담당그룹 지정하시겠습니까?"(제목 "담당그룹 지정", 폭 350)
  //   → [E8] msgBox.DialogHide [YES] (L239) → batchManger() L256-290: 선택 없으면 "대상을 먼저 선택해주세요", Sch22_Lookup_WriteGroup.open(callback)
  const batchMangerChk = () => {
    const count = gridRef.current?.api?.getSelectedRows().length ?? 0;
    Modal.confirm({
      title: '담당그룹 지정',
      content: `${count}건의 항목을 담당그룹 지정하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => {
        if ((gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) { message.warning('대상을 먼저 선택해주세요'); return; }
        setGroupOpen(true);
      },
    });
  };

  // Sch22_Lookup_WriteGroup callback: 고른 그룹(작성그룹없음이면 null)을 선택한 점검내역에 일괄 지정 → chk.Chk02_DailyList.updateWriteGroupId → "설정이 저장되었습니다" → retrieve()
  const batchManger = async (group: Sch22WriteGroup | null) => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    try {
      await chkApi.updateDailyListWriteGroup(group?.writeGroupId ?? null, selected.map(r => r.dailyListId));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('설정이 저장되었습니다');
    await retrieve();
  };

  // buildGrid() L195-225
  const columnDefs = useMemo(() => [
    gb.booleanIcon(undefined, 40, '', { colId: 'lock', valueGetter: p => !!p.data?.adminYn }),  // L214 addBooleanIcon(adminYn) — 관리자 점검내역이면 잠금
    iconCell<ChkDailyList>('edit', 'actionCell', 60, '수정', row => setEditTarget(row)),  // L215 addCell → Chk02_Edit_DailyList.edit(classTreeModel, selectModel, callback → grid.getStore().update)
    gb.text('classTreeName', 210, '분류'),  // L216
    gb.textArea('content', 400, '점검내용'),  // L217
    gb.textArea('reason', 400, '설명'),  // L218 — 원본은 chk02_reason(테이블에 없음)을 보여 줘 항상 빈칸 (원본 그대로)
    gb.textCenter('cutoff', 100, 'CutOff'),  // L219
    gb.textCenter('windowNo', 100, '화면번호'),  // L220
    gb.longCenter('seq', 50, '순서'),  // L221
    gb.text('writeGroupName', 200, '담당그룹'),  // L222
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L157) → retrieve(), [E2] searchText.KeyPress [Enter] (L148) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
            {/* [E6] useYnButton[사용여부설정].Select (L175) → Chk02_Lookup_UseYn.open(callback → retrieve()) */}
            <Button type="view" onClick={() => setUseYnOpen(true)}>사용여부설정</Button>
            <Button type="assign" onClick={batchMangerChk}>담당그룹 지정</Button>
          </>
        }
      >
        <SearchBar.Field label="분류">
          <LookupInput width={300} value={classTreeName} onOpen={() => setClassOpen(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="분류/점검내용/설명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<ChkDailyList>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.dailyListId)}
        />
      </div>
      <Chk02_Edit_DailyList model={editTarget} baseClassTreeId={classTreeModel?.classTreeId} onClose={() => setEditTarget(null)} onDone={onSaved} />
      <Chk01_Lookup_ClassTree open={classOpen} mode="open" classTreeId={classTreeModel?.classTreeId} onResult={onClassResult} onClose={() => setClassOpen(false)} />
      <Chk02_Lookup_UseYn open={useYnOpen} onClosed={() => { void retrieve(); }} onClose={() => setUseYnOpen(false)} />
      <Sch22_Lookup_WriteGroup open={groupOpen} mode="pick" onResult={g => { void batchManger(g); }} onClose={() => setGroupOpen(false)} />
    </div>
  );
};
