/**
 * [1228] 준법감시 > 30. 내부통제 체크리스트 > 내부통제 체크리스트 관리 (K04)
 * AS-IS: myApp/client/vi/ics/Ics10_Tab_Checklist.java (522줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L80-113: center(여백 20) = 툴바 50(대분류 180 · 중분류 230 · 검색 250 "대분류/중분류/체크내용/근거" · [조회][등록][삭제] · [출력/다운로드] · [담당그룹 지정][기본설정]) + 체크리스트 그리드(체크 다중:
 *   수정 45 · 잠금 35 · 대분류 180 · 중분류 230 · 체크대상 550 · 근거 300 · 보기 45 · 담당그룹 200)
 * 기본설정 팝업(SettingPopup)에 숨은 버튼 4개: 사용여부설정(Ics10_Lookup_UseYn) · 분류관리(Ics21_Lookup_CheckList) · 담당그룹관리(Sch22_Lookup_WriteGroup edit) · 데이터업로드(Ics10_Lookup_ExcelUpload)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다
 * 출력/다운로드는 RD 리포트(Ics10_Rd_Checklist) 대신 서버가 한 시트 xlsx를 만든다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Select } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklist, IcsChecklistClassCode, IcsChecklistUser } from '@/types/ics';
import { Sch22WriteGroup } from '@/types/sch';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SettingPopup } from '@/components/lookup/SettingPopup';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';
import { Ics21_Lookup_CheckList } from './Ics21_Lookup_CheckList';
import { Ics10_Lookup_UseYn } from './Ics10_Lookup_UseYn';
import { Ics10_Lookup_ExcelUpload } from './Ics10_Lookup_ExcelUpload';
import { Sch22_Lookup_WriteGroup } from '../sch/Sch22_Lookup_WriteGroup';

const gb = gbFor<IcsChecklistUser>();
const ALL = '%';  // 대분류·중분류 "전체"

export const Ics10_Tab_Checklist: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcsChecklistUser>>(null);
  // settings() L115-276: 대분류·중분류 "전체", 검색어 빈칸
  const [lClass, setLClass] = useState(ALL);
  const [mClass, setMClass] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [rows, setRows] = useState<IcsChecklistUser[]>([]);
  const [editTarget, setEditTarget] = useState<ChecklistEditTarget | null>(null);
  const [viewTarget, setViewTarget] = useState<ChecklistEditTarget | null>(null);
  const [settingOpen, setSettingOpen] = useState(false);
  const [useYnOpen, setUseYnOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [groupMode, setGroupMode] = useState<'pick' | 'edit' | null>(null);

  const loadLCodes = useCallback(async () => {
    try { setLCodes(await icsApi.searchChecklistLCodes()); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);

  // retrieve() L491-517: ics.Ics10_Checklist.selectBySearchText(companyId(서버), 대분류·중분류 id(전체면 없음), useYn "true", "%검색어%", 기준일 오늘)
  const retrieve = useCallback(async (over?: { l?: string; m?: string }) => {
    const l = over?.l ?? lClass;
    const m = over?.m ?? mClass;
    try {
      setRows(await icsApi.searchChecklistsForCompany({
        checklistLClassId: l === ALL ? null : Number(l),
        checklistMClassId: m === ALL ? null : Number(m),
        useYn: 'true',
        searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [lClass, mClass, searchText]);

  // refreshCode() L278-290: 대분류에 맞춰 중분류 콤보를 다시 읽고 retrieve()
  const refreshCode = async (l: string) => {
    try { setMCodes(await icsApi.searchChecklistMCodes(l === ALL ? null : Number(l))); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    await retrieve({ l, m: ALL });
  };

  // [E0] 화면 열림 (생성자 L80-113) → settings(): 대분류 콤보를 읽는다. 열릴 때 조회는 없다(콤보를 고르거나 [조회])
  useEffect(() => { void loadLCodes(); void icsApi.searchChecklistMCodes(null).then(setMCodes).catch(() => undefined); }, [loadLCodes]);

  // [E4] insertButton[등록].Select (L149) → insertRow() L403-427: 회사·사용 true인 새 체크리스트(id는 미리 받는다)로 Ics10_Edit_Checklist.edit(…, 저장하면 그 행을 넣고 아니면 retrieve())
  const insertRow = async () => {
    try {
      setEditTarget({ model: { checklistId: await icsApi.getChecklistNextId(), useYn: 'true' }, isNew: true });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // Ics10_Edit_Checklist 콜백: 저장하면 그 행을 그리드에 넣는다 (AS-IS grid.getStore().update(result)). 새 행은 맨 위에
  const onSaved = (saved: IcsChecklist) => {
    setRows(prev => prev.some(r => r.checklistId === saved.checklistId)
      ? prev.map(r => (r.checklistId === saved.checklistId ? { ...r, ...saved } : r))
      : [saved, ...prev]);
  };

  // [E5] deleteButton[삭제].Select (L155) → deleteChk() L429-478: 선택 없음 "삭제대상을 선택하세요", 공통(회사 0) 포함 "삭제불가능한 체크리스트가 포함되어 있습니다",
  //   ics.Ics10_Checklist.preDelete — 작성내역이 있으면 "이미 작성한 체크리스트가 포함되어 있어 삭제할 수 없습니다. 미사용으로 저장하세요" → "n건의 항목을 삭제하시겠습니까?"(제목 "삭제", 폭 300)
  //   → [E14] msgBox.DialogHide [YES] (L460) → deleteRow() L480-489: ics.Ics10_Checklist.delete → retrieve()
  const deleteChk = async () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    if (checked.some(r => r.companyId === 0)) {
      message.warning('삭제불가능한 체크리스트가 포함되어 있습니다');
      return;
    }
    try {
      if ((await icsApi.checkDeleteChecklists(checked.map(r => r.checklistId))) !== 0) {
        message.warning('이미 작성한 체크리스트가 포함되어 있어 삭제할 수 없습니다. 미사용으로 저장하세요');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 항목을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await icsApi.deleteChecklists(checked.map(r => r.checklistId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // [E6] batchMangerButton[담당그룹 지정].Select (L161) → batchMangerChk() L342-360: "n건의 항목을 담당그룹 지정하시겠습니까?"(제목 "담당그룹 지정", 폭 350)
  //   → [E13] msgBox.DialogHide [YES] (L345) → batchManger() L362-401: 선택 없으면 "대상을 먼저 선택해주세요", Sch22_Lookup_WriteGroup.open(callback)
  const batchMangerChk = () => {
    const count = gridRef.current?.api?.getSelectedRows().length ?? 0;
    Modal.confirm({
      title: '담당그룹 지정',
      content: `${count}건의 항목을 담당그룹 지정하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => {
        if ((gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) {
          message.warning('대상을 먼저 선택해주세요');
          return;
        }
        setGroupMode('pick');
      },
    });
  };

  // Sch22_Lookup_WriteGroup callback: 고른 그룹(작성그룹없음이면 null)을 선택한 체크리스트에 일괄 지정 → ics.Ics11_ChecklistCompany.updateWriteGroupId → "설정이 저장되었습니다" → retrieve()
  const batchManger = async (group: Sch22WriteGroup | null) => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    try {
      await icsApi.updateChecklistWriteGroup(group?.writeGroupId ?? null, selected.map(r => ({ checklistId: r.checklistId, useYn: r.useYn ?? 'true' })));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('설정이 저장되었습니다');
    await retrieve();
  };

  // [E12] rdButton[출력/다운로드].Select (L223): sys.Sys99_Print.insertRdCheckList(대분류·중분류 id, useYn "true", "%검색어%") 뒤 RD 뷰어 → 한 시트 xlsx로 받는다
  const rdDownload = async () => {
    try {
      await icsApi.downloadChecklistExcel({
        checklistLClassId: lClass === ALL ? null : Number(lClass),
        checklistMClassId: mClass === ALL ? null : Number(mClass),
        searchText,
      });
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // buildGrid() L292-340
  const columnDefs = useMemo(() => [
    // L330 수정 아이콘: 공통(회사 0) 체크리스트는 "수정 불가능한 체크리스트입니다", 아니면 Ics10_Edit_Checklist.edit(selectModel, callback → grid.getStore().update(result))
    iconCell<IcsChecklistUser>('edit', 'editCell', 45, '수정', row => {
      if (row.companyId === 0) { message.warning('수정 불가능한 체크리스트입니다'); return; }
      setEditTarget({ model: row });
    }),
    gb.booleanIcon(undefined, 35, ' ', { colId: 'lock', valueGetter: p => p.data?.companyId === 0 }),  // L331 addLongLockIcon(companyId)
    gb.text('checkLClassName', 180, '대분류'),  // L332
    gb.text('checkMClassName', 230, '중분류'),  // L333
    gb.textArea('content', 550, '체크대상'),  // L334
    gb.textArea('criterion', 300, '근거'),  // L335
    iconCell<IcsChecklistUser>('view', 'viewCell', 45, '보기', row => setViewTarget({ model: row })),  // L336 Ics10_Edit_Checklist.open(selectModel, callback → retrieve())
    gb.text('writeGroupName', 200, '담당그룹'),  // L337
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        {/* [E3] retrieveButton[조회].Select (L143) → retrieve(). 초기화(UX-02)는 줄바꿈이 늘어 넣지 않는다 */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              <Button type="register" onClick={insertRow}>등록</Button>
              <Button type="delete" onClick={deleteChk}>삭제</Button>
              <Button type="download" onClick={rdDownload}>출력/다운로드</Button>
              <Button type="assign" onClick={batchMangerChk}>담당그룹 지정</Button>
              {/* [E7] settingButton[기본설정].Select (L167) → SettingPopup("기본설정") */}
              <Button type="settings" onClick={() => setSettingOpen(true)}>기본설정</Button>
            </>
          }
        >
          <SearchBar.Field label="대분류">
            {/* [E1] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L122) → 중분류를 "전체"로 되돌리고 refreshCode() */}
            <Select style={{ width: 180 }} value={lClass} onChange={v => { setLClass(v); setMClass(ALL); void refreshCode(v); }}
              options={[{ value: ALL, label: '전체' }, ...lCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="중분류">
            {/* [E2] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L133) → retrieve() */}
            <Select style={{ width: 230 }} value={mClass} onChange={v => { setMClass(v); void retrieve({ m: v }); }}
              options={[{ value: ALL, label: '전체' }, ...mCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="대분류/중분류/체크내용/근거" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<IcsChecklistUser>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.checklistId)}
          />
        </div>
      </div>
      <SettingPopup
        open={settingOpen}
        title="기본설정"
        onClose={() => setSettingOpen(false)}
        items={[
          // [E8] useYnButton[사용여부설정].Select (L179) → Ics10_Lookup_UseYn.open(callback → retrieve())
          { type: 'view', label: '사용여부설정', onClick: () => setUseYnOpen(true) },
          // [E9] checkListButton[분류관리].Select (L191) → Ics21_Lookup_CheckList.open(callback → 대분류 콤보 다시 읽기 + refreshCode())
          { type: 'register', label: '분류관리', onClick: () => setClassOpen(true) },
          // [E10] mangerButton[담당그룹관리].Select (L204) → Sch22_Lookup_WriteGroup.edit()
          { type: 'group', label: '담당그룹관리', onClick: () => setGroupMode('edit') },
          // [E11] uploadButton[데이터업로드].Select (L211) → Ics10_Lookup_ExcelUpload.open(callback → retrieve())
          { type: 'upload', label: '데이터업로드', onClick: () => setUploadOpen(true) },
        ]}
      />
      <Ics10_Edit_Checklist target={editTarget} onSaved={onSaved} onClose={() => setEditTarget(null)} />
      <Ics10_Edit_Checklist target={viewTarget} readOnly onClosed={() => { void retrieve(); }} onClose={() => setViewTarget(null)} />
      <Ics10_Lookup_UseYn open={useYnOpen} onClosed={() => { void retrieve(); }} onClose={() => setUseYnOpen(false)} />
      <Ics21_Lookup_CheckList open={classOpen} onClosed={() => { void loadLCodes(); void refreshCode(lClass); }} onClose={() => setClassOpen(false)} />
      <Ics10_Lookup_ExcelUpload open={uploadOpen} onClosed={() => { void retrieve(); }} onClose={() => setUploadOpen(false)} />
      <Sch22_Lookup_WriteGroup
        open={groupMode != null}
        mode={groupMode ?? 'edit'}
        onResult={g => { void batchManger(g); }}
        onClose={() => setGroupMode(null)}
      />
    </div>
  );
};
