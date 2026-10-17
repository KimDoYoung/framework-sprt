/**
 * [1245] 기초자료 > 00. 내부통제 > 일일점검내역 관리(관리자) (E07)
 * AS-IS: myApp/client/vi/chk/Chk02_Tab_DailyListAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L72-104: north = 툴바(분류 300 · 사용여부 100 · 검색 250 "분류/점검내용/설명" · [조회][등록][삭제][점검내역복사]), center = 점검내역 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree, ChkDailyList } from '@/types/chk';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys01_Lookup_SelectMulti } from '../sys/Sys01_Lookup_SelectMulti';
import { Chk01_Lookup_ClassTree } from './Chk01_Lookup_ClassTree';
import { Chk02_Edit_DailyList, ChkDailyListEdit } from './Chk02_Edit_DailyList';

const gb = gbFor<ChkDailyList>();
const ALL = '%';  // 사용여부 "전체"
const USE_OPTIONS = [{ value: ALL, label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];  // useYnComboBox 전체·사용·미사용

export const Chk02_Tab_DailyListAdmin: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<ChkDailyList>>(null);
  // settings() L106-228: 링크코드 "01" 분류가 기준 분류(classTreeModel), 분류칸은 그 이름 · 사용여부 "전체" · 검색어 빈칸
  const [classTreeModel, setClassTreeModel] = useState<ChkClassTree | null>(null);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [useYn, setUseYn] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<ChkDailyList[]>([]);
  const [editTarget, setEditTarget] = useState<ChkDailyListEdit | null>(null);
  const [classOpen, setClassOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  // retrieve() L262-281: 서비스 chk.Chk02_DailyList.selectByAdmin(companyId(서버), classTreeId, useYn(전체 %·사용 true·미사용 false), "%검색어%")
  const retrieve = useCallback(async (over?: { id?: number | null }) => {
    const id = over?.id !== undefined ? over.id : classTreeId;
    if (id == null) return;  // 원본은 기준 분류가 없으면 classTreeId가 null인 채로 조회 → 결과 없음
    try {
      setRows(await chkApi.searchDailyLists(id, useYn === ALL ? undefined : useYn, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId, useYn, searchText]);

  // [E0] 화면 열림 (생성자 L72-104) → settings(): 서비스 chk.Chk01_ClassTree.selectByLinkCode(linkCode "01") → 분류칸 채우고 retrieve()
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

  // [E1] classTreeName.TriggerClick (L130) → Chk01_Lookup_ClassTree.open(기준 분류): 결과가 있으면 분류 교체, [전체](null)이면 기준 분류로 되돌린다
  const onClassResult = (node: ChkClassTree | null) => {
    if (node) {
      setClassTreeId(node.classTreeId);
      setClassTreeName(node.classTreeName ?? '');
    } else if (classTreeModel) {
      setClassTreeId(classTreeModel.classTreeId);
      setClassTreeName(classTreeModel.classTreeName ?? '');
    }
  };

  // [E4] insertButton[등록].Select (L176) → insertRow() L283-308: 회사·사용 true·adminDailyListId 0인 새 점검내역으로 Chk02_Edit_DailyList.edit
  const insertRow = () => setEditTarget({ companyId: user.companyId, useYn: 'true', adminDailyListId: 0 });

  // Chk02_Edit_DailyList 콜백: 저장하면 그 행을 그리드에 넣는다 (AS-IS grid.getStore().update(result)). 새 행은 맨 위에
  const onSaved = (saved: ChkDailyList) => {
    setRows(prev => prev.some(r => r.dailyListId === saved.dailyListId)
      ? prev.map(r => (r.dailyListId === saved.dailyListId ? saved : r))
      : [saved, ...prev]);
  };

  // [E5] deleteButton[삭제].Select (L182) → deleteChk() L310-328: "n건의 항목을 삭제하시겠습니까?"(제목 "삭제", 폭 300) → [E7] msgBox.DialogHide [YES] (L313) → deleteRow() L330-339: chk.Chk02_DailyList.delete → retrieve()
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 항목을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await chkApi.deleteDailyLists(checked.map(r => r.dailyListId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // [E6] copyButton[점검내역복사].Select [선택>0] (L188, settings L146-218): 선택이 없으면 메시지, 있으면 고객사를 고르게 한다
  const copyDailyList = () => {
    if ((gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) {
      message.warning('복사할 점검내역을 선택해주세요');
      return;
    }
    setCompanyOpen(true);
  };

  // Sys01_Lookup_SelectMulti 콜백: 고른 고객사마다 선택한 점검내역을 복사 → "점검내역 복사가 완료되었습니다" → retrieve()
  const onCompaniesResult = async (companies: { companyId: number }[]) => {
    setCompanyOpen(false);
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    try {
      await chkApi.copyDailyLists({ dailyListIds: checked.map(r => r.dailyListId), companyIds: companies.map(c => c.companyId) });
      message.info('점검내역 복사가 완료되었습니다');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '복사 실패'));
    }
  };

  // buildGrid() L230-260
  const columnDefs = useMemo(() => [
    gb.booleanIcon(undefined, 40, '', { colId: 'lock', valueGetter: p => !!p.data?.adminYn }),  // L249 addBooleanIcon(adminYn) — 관리자 점검내역이면 잠금
    iconCell<ChkDailyList>('edit', 'actionCell', 60, '수정', row => setEditTarget(row)),  // L250 addCell → Chk02_Edit_DailyList.edit(classTreeModel, selectModel, callback → grid.getStore().update)
    gb.text('classTreeName', 210, '분류'),  // L251
    gb.textArea('content', 400, '점검내용'),  // L252
    gb.textArea('reason', 400, '설명'),  // L253 — 원본은 chk02_reason(테이블에 없음)을 보여 줘 항상 빈칸 (원본 그대로)
    gb.textCenter('cutoff', 100, 'CutOff'),  // L254
    gb.textCenter('windowNo', 100, '화면번호'),  // L255
    gb.longCenter('seq', 50, '순서'),  // L256
    gb.boolean('useYn', 60, '사용', { editable: true }),  // L257 addBoolean — 체크박스(클릭하면 값이 바뀌지만 이 화면에는 저장이 없다 — 원본도 같다)
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L170) → retrieve(), [E2] searchText.KeyPress [Enter] (L161) → retrieve(). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다 */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
            <Button type="change" onClick={copyDailyList}>점검내역복사</Button>
          </>
        }
      >
        <SearchBar.Field label="분류">
          <Input readOnly style={{ width: 300, cursor: 'pointer' }} value={classTreeName} suffix={<SearchOutlined />} onClick={() => setClassOpen(true)} />
        </SearchBar.Field>
        <SearchBar.Field label="사용여부">
          <Select style={{ width: 100 }} value={useYn} onChange={setUseYn} options={USE_OPTIONS} />
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
      <Sys01_Lookup_SelectMulti open={companyOpen} onResult={onCompaniesResult} onClose={() => setCompanyOpen(false)} />
    </div>
  );
};
