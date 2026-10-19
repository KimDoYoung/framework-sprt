/**
 * [1398] 기초자료 > 30. 자산&경영 > 인사평가 항목(Admin) (E26) — 경영관리 > 05. 인사평가 > 인사평가 항목 #1391도 같은 화면
 * AS-IS: myApp/client/vi/emp/Emp41_Tab_EvalList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L79-119: 위(높이 50, 테두리) = 왼쪽 70% [조회][등록][확정][확정취소][삭제] / 오른쪽 30%(오른쪽 정렬) [행 추가][행 삭제][저장],
 *   아래 = 왼쪽 280px 기준 적용일 그리드(행번호 · 기준 적용일 100 · 평가등급 80(아이콘) · 확정 50) + 오른쪽 인사평가 항목 셀 편집 그리드(행번호, 체크박스 다중:
 *   평가항목 180(콤보 EmpEvalClassCode) · 내용 550 · 가중치(%) 조직원 80·조직장 80 · 조회순번 80, 맨 아래 합계 행). 여백 20
 * 처음에는 [삭제]·[행 추가]·[행 삭제]·[저장]이 비활성 — 기준 적용일을 고르면(retrieveForm) 확정 전일 때만 활성
 * UX보강(10): 저장 = 저장(n)(UX-03, 삭제대기 포함). 검색 조건이 없어 SearchBar·초기화(UX-02)는 쓰지 않는다
 * 로그인 회사 전용(서비스가 LoginUser.getCompanyId()만 보낸다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { EvalList, EvalListStd } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp40_Lookup_Insert } from './Emp40_Lookup_Insert';
import { Emp42_Lookup_EvalGrade } from './Emp42_Lookup_EvalGrade';

const gb1 = gbFor<EvalListStd>();
const gb2 = gbFor<EvalList>();

/** 'yyyy-MM-dd' → "yyyy년 MM월 dd일" (DateTimeFormat.getFormat("yyyy년 MM월 dd일")) */
const koDate = (d: string) => `${d.slice(0, 4)}년 ${d.slice(5, 7)}월 ${d.slice(8, 10)}일`;

/** buildGrid02() L292-327 — [E14] evalClassComboBox[EmpEvalClassCode].Collapse (L309) → 고른 코드·이름을 그 행에 반영 */
const buildGrid02 = (classCodes: Code[]) => [
  gb2.textCenter('evalClassName', 180, '평가항목', {  // L318
    editor: 'select',
    values: classCodes.map(c => c.name),
    valueSetter: p => {
      p.data.evalClassName = p.newValue;
      p.data.evalClassCode = classCodes.find(c => c.name === p.newValue)?.code ?? p.data.evalClassCode;
      return true;
    },
  }),
  gb2.textArea('content', 550, '내용', { editor: 'largeText' }),  // L319
  // L317 HeaderGroupConfig("가중치(%)") — [E12] weightMemberField.KeyUp (L294)·[E13] weightLeaderField.ValueChange (L301)는 셀 편집이 처리
  gb2.group('가중치(%)', [
    gb2.long('weightMember', 80, '조직원', { editor: 'number' }),  // L320
    gb2.long('weightLeader', 80, '조직장', { editor: 'number' }),  // L321
  ]),
  gb2.long('seq', 80, '조회순번', { editor: 'number' }),  // L322
];

export const Emp41_Tab_EvalList: React.FC = () => {
  const gridRef = useRef<AgGridReact<EvalListStd>>(null);
  const [stds, setStds] = useState<EvalListStd[]>([]);
  const [selected, setSelected] = useState<EvalListStd>();
  const selectedRef = useRef<EvalListStd | undefined>(undefined);
  /** retrieveForm() L484-499: 고른 기준 적용일이 확정이면 [삭제]·[행 추가]·[행 삭제]·[저장]을 끈다. 처음에는 꺼져 있다 */
  const [formEnabled, setFormEnabled] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [gradeTarget, setGradeTarget] = useState<{ evalListStdId: number; fixYn: boolean } | null>(null);
  const [classCodes, setClassCodes] = useState<Code[]>([]);
  // deleteList (L72): [행 삭제]가 모아 두었다가 [저장]에서 보낸다. 건수는 저장(n)에 보이도록 상태로도 든다
  const deleteList = useRef<number[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState(0);

  const columnDefs01 = useMemo(() => [
    gb1.date('startDate', 100, '기준 적용일'),  // L283
    // L276-281 viewCell(ImageCell "Edit") → Emp42_Lookup_EvalGrade.open(evalListStdId, fixYn)
    iconCell<EvalListStd>('edit', 'actionCell', 80, '평가등급', row => setGradeTarget({ evalListStdId: row.evalListStdId, fixYn: row.fixYn === 'true' })),  // L284
    gb1.booleanYn('fixYn', 50, '확정'),  // L285
  ], []);
  const columnDefs02 = useMemo(() => buildGrid02(classCodes), [classCodes]);

  const crud = useGridCrud<EvalList>({
    idField: 'evalListId',
    // retrieveForm() L484-513 → emp.Emp41_EvalList.selectByEvalListStdId
    search: useCallback(() => {
      const id = selectedRef.current?.evalListStdId;
      return id ? empEvalApi.searchEvalLists(id) : Promise.resolve([]);
    }, []),
    save: useCallback(async () => [], []),  // 쓰지 않음 — updateForm()이 변경 행 + 삭제대기를 한 번에 보낸다
    remove: useCallback(async () => 0, []),  // 쓰지 않음 — 삭제는 deleteList에 모은다
    // insertForm() L393-409: evalListStdId만 지정
    newRow: useCallback(() => ({ evalListStdId: selectedRef.current?.evalListStdId }), []),
    firstEditField: 'evalClassName',
  });

  /** retrieveForm(selectModel) L484-513 [E1] grid01.RowClick (L125): 버튼 활성 정리 → 삭제대기 비움 → 항목 조회 */
  const retrieveForm = (row: EvalListStd) => {
    selectedRef.current = row;
    setSelected(row);
    setFormEnabled(row.fixYn !== 'true');
    deleteList.current = [];
    setPendingDeletes(0);
    return crud.retrieve();
  };

  /** retrieve() L470-482 [E2]: 기준 적용일 목록을 읽고, 있으면 첫 행을 선택해 retrieveForm */
  const retrieve = useCallback(async () => {
    try {
      setStds(await empEvalApi.searchEvalListStds());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L79-119) → settings(), retrieve()
  useEffect(() => {
    sysApi.searchCodes('EmpEvalClassCode').then(setClassCodes).catch(() => {});
    void retrieve();
  }, [retrieve]);

  // 목록이 그려진 다음에 선택해야 해서 목록이 바뀐 뒤에 첫 행을 선택한다 (select(0) → retrieveForm)
  useEffect(() => {
    if (stds.length === 0) return;
    const t = setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true), 50);
    return () => clearTimeout(t);
  }, [stds]);

  /** 확정·확정취소 확인창: "yyyy년 MM월 dd일 적용 인사평가 항목리스트를 확정하시겠습니까?" */
  const askFix = (fixYn: boolean, row: EvalListStd) => {
    Modal.confirm({
      title: '확인',
      content: `${koDate(row.startDate)} 적용 인사평가 항목리스트를 ${fixYn ? '확정' : '확정 취소'}하시겠습니까?`,
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: () => confirm(fixYn, row),
    });
  };

  // [E4] confirmButton[확정].Select (L144): 이미 확정이면 알리고, 아니면 확인창 [YES] → [E5] confirm(true)
  const confirmFix = () => {
    if (!selected) return;
    if (selected.fixYn === 'true') {
      message.warning('이미 확정된 인사평가 항목리스트입니다');
      return;
    }
    askFix(true, selected);
  };

  // [E6] cancleButton[확정취소].Select (L176): 확정 전이면 알리고, 사용중이면 알리고, 아니면 확인창 [YES] → [E7] confirm(false)
  const cancelFix = async () => {
    if (!selected) return;
    if (selected.fixYn !== 'true') {
      message.warning('확정 전 인사평가 항목리스트입니다');
      return;
    }
    try {
      if (await empEvalApi.isEvalListStdInUse(selected.evalListStdId)) {
        message.warning('해당 기준적용일로 작성중 또는 완료된 인사평가 내역이 존재합니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    askFix(false, selected);
  };

  /** confirm(fixYn) L254-273 → emp.Emp40_EvalListStd.updateFixYn: 실패면 서버 메시지, 아니면 retrieve() */
  const confirm = async (fixYn: boolean, row: EvalListStd) => {
    try {
      await empEvalApi.updateEvalListStdFix(row.startDate, fixYn);
      await retrieve();
    } catch (err) {
      message.warning(errorMessage(err, '처리 실패'));
    }
  };

  // [E8] deleteButton[삭제].Select (L224) → delete() L329-375 → [E15] msgBox.DialogHide [YES] (L342) → retrieve()
  const deleteStd = () => {
    if (!selected) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    if (selected.fixYn === 'true') {
      message.warning('확정된 기준 적용일은 삭제가 불가능합니다');
      return;
    }
    const target = selected;
    Modal.confirm({
      title: '삭제',
      content: '해당 적용일을 삭제하시겠습니까?',
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await empEvalApi.deleteEvalListStd(target.evalListStdId);
          crud.clear();  // status == 1: retrieve() 뒤 grid02.getStore().clear()
          await retrieve();
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));  // "이미 사용중인 적용일입니다"
        }
      },
    });
  };

  // [E9] insertFormButton[행 추가].Select (L231) → insertForm() L393-409
  const insertForm = () => {
    if (!selected) {
      message.warning('기준 적용일을 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E10] deleteFormButton[행 삭제].Select (L237-245): 체크한 행을 store에서 빼고 deleteList에 모은다
  const deleteForm = () => {
    const ids = (crud.gridRef.current?.api?.getSelectedRows() ?? []).map(r => r.evalListId);
    deleteList.current.push(...ids.filter(id => id > 0));
    setPendingDeletes(deleteList.current.length);
    crud.removeRows(ids);
  };

  // [E11] updateFormButton[저장].Select (L246) → updateFormChk() L411-451 → updateForm() L453-468
  const updateFormChk = async () => {
    if (!selected) return;
    if (selected.fixYn === 'true') {
      message.warning('확정된 기준 적용일은 수정이 불가능합니다');
      return;
    }
    crud.gridRef.current?.api?.stopEditing();
    // updateFormChk()는 화면의 모든 행을 모은다. 서버는 새 행(ID 0 이하)만 INSERT, 나머지는 UPDATE. 가중치 합계도 모든 행으로 센다 (비어 있으면 0)
    const all: EvalList[] = [];
    crud.gridRef.current?.api?.forEachNode(n => { if (n.data) all.push(n.data); });
    const weightMember = all.reduce((sum, r) => sum + (r.weightMember ?? 0), 0);
    const weightLeader = all.reduce((sum, r) => sum + (r.weightLeader ?? 0), 0);
    if (weightMember !== 100) {
      message.warning('조직원 가중치의 합계는 100(%)이어야합니다');
      return;
    }
    if (weightLeader !== 100) {
      message.warning('조직장 가중치의 합계는 100(%)이어야합니다');
      return;
    }
    try {
      await empEvalApi.updateEvalLists(selected.evalListStdId, all, deleteList.current);
      message.success('정상적으로 저장되었습니다');
      await retrieveForm(selected);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* buttonBarHlc L100-102: 70% | 30%, 높이 50, 테두리 */}
      <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <div style={{ width: '70%', display: 'flex', gap: 4, padding: '0 8px', alignItems: 'center' }}>
          {/* [E2] retrieveButton[조회].Select (L132) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E3] insertButton[등록].Select (L138) → insert(): 지금 적용일들을 들고 Emp40_Lookup_Insert 열기 */}
          <Button type="register" onClick={() => setInsertOpen(true)}>등록</Button>
          <Button type="save" onClick={confirmFix}>확정</Button>
          <Button type="cancel" onClick={cancelFix}>확정취소</Button>
          <Button type="delete" disabled={!formEnabled} onClick={deleteStd}>삭제</Button>
        </div>
        <div style={{ width: '30%', display: 'flex', gap: 4, padding: '0 8px', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button type="addRow" disabled={!formEnabled} onClick={insertForm}>행 추가</Button>
          <Button type="removeRow" disabled={!formEnabled} onClick={deleteForm}>행 삭제</Button>
          {/* 저장(n)은 UX-03 — 삭제대기도 센다 */}
          <Button type="save" disabled={!formEnabled} count={{ ...crud.changes, modified: crud.changes.modified + pendingDeletes }} onClick={updateFormChk}>저장</Button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', marginTop: 0 }}>
        <div style={{ width: 280, flex: 'none' }}>
          <SingleGrid<EvalListStd> gridRef={gridRef} rowData={stds} columnDefs={columnDefs01}
            onSelect={row => { if (row) void retrieveForm(row); }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CellEditGrid<EvalList> crud={crud} columnDefs={columnDefs02}
            sumRow={{ labelField: 'content', label: '합계', sum: ['weightMember', 'weightLeader'] }} />
        </div>
      </div>
      <Emp40_Lookup_Insert open={insertOpen} dateList={stds.map(s => s.startDate)} onSaved={retrieve} onClose={() => setInsertOpen(false)} />
      <Emp42_Lookup_EvalGrade target={gradeTarget} onClose={() => setGradeTarget(null)} />
    </div>
  );
};
