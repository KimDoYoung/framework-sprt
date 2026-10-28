/**
 * 연차 탭 — 연차휴가 사용촉진(Emp21_Tab_UnLeaveList, S08)의 첫 탭 "연차".
 * AS-IS: myApp/client/vi/emp/Emp21_TabPage_UnLeaveList1.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L92-130, CG): 툴바(해당 연도 · 구분 · [조회][저장][삭제][생성] + 안내 글) + 셀 편집 그리드(체크 다중) + 아래 문서분류 줄(문서분류 · [상신][문자발송])
 * 1단계(사용자 결정 2026-10-28): [상신]의 결재문서 일괄 생성(emp.Emp21_UnLeave.insertAppr)·[문자발송](sendMessage)·상세보기(Apr01_Edit_ApprDoc)는 다음 단계 —
 * 원본의 선택·상태 검사와 확인창까지만 한다.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Input, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { empUnLeaveApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { UnLeave } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud, editableCol } from '@/hooks/useGridCrud';
import { Emp21_Lookup_Insert } from './Emp21_Lookup_Insert';

const gb = gbFor<UnLeave>();

/** 상신 진행 중(10 상신·20 진행·30 완료) */
const isApprBusy = (code: string | null | undefined) => code === '10' || code === '20' || code === '30';
const EMPTY_TEXT_NONE = '구분값을 먼저 선택해주세요';
const EMPTY_TEXT_AUTO = '미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.';

export const Emp21_TabPage_UnLeaveList1: React.FC = () => {
  // [E0] 화면 열림 (생성자 L92-130 → settings() L132-200): 기준연도 = 올해, 구분 콤보·문서분류 칸(구분을 고르기 전에는 꺼짐). 조회는 하지 않는다
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [code, setCode] = useState<string | undefined>(undefined);
  const [codeName, setCodeName] = useState<string | undefined>(undefined);
  const [insertOpen, setInsertOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  // 문서분류: 기본(defaultName)·고른 값(openLookupDoc)
  const [defaultClassTreeId, setDefaultClassTreeId] = useState<number | null>(null);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeFullName, setClassTreeFullName] = useState('');
  const [classEmptyText, setClassEmptyText] = useState(EMPTY_TEXT_NONE);
  const cur = useRef({ year, code });
  cur.current = { year, code };

  // retrieve() L332-363: 서비스 emp.Emp21_UnLeave.selectByUnLeaveCode(companyId, unLeaveCode, stdYear)
  const crud = useGridCrud<UnLeave>({
    idField: 'unLeaveId',
    search: useCallback(() => empUnLeaveApi.searchYear(cur.current.year, cur.current.code ?? '%'), []),
    // [E3] updateButton[저장].Select (L160) → update() L365-377: GridUpdate → emp.Emp21_UnLeave.update
    save: useCallback(async (rows: UnLeave[]) => { await empUnLeaveApi.save(rows); return rows; }, []),
    reloadAfterSave: true,
    // [E4] deleteButton[삭제].Select (L166) → deleteCheck() L379-406 → [E11] msgBox.DialogHide [YES] (L391) → delete() L408-412: GridDeleteData → emp.Emp21_UnLeave.delete(체크된 행)
    remove: useCallback((ids: number[]) => empUnLeaveApi.remove(ids), []),
    newRow: useCallback(() => ({}), []),
    // update() L366-374: 수정한 행 중 상신 10·20·30이 있으면 저장하지 않는다
    validate: useCallback((changed: UnLeave[]) => (changed.some(r => isApprBusy(r.apprStatusCode)) ? '상신 중이거나 완료된 건은 수정이 불가능합니다' : undefined), []),
    deleteConfirm: '해당 구분의 정보를 삭제하시겠습니까?',
  });

  // defaultName() L202-238: 구분을 고르면 문서분류를 켜고, Link 코드(01 → B07 사용촉진, 그 밖 → B08 지정통보)에 지정된 분류가 정확히 1건이면 기본으로 쓴다
  const defaultName = async (c: string | undefined) => {
    if (c == null || c === '%') {
      setClassEmptyText(EMPTY_TEXT_NONE);
      return;
    }
    setClassEmptyText(EMPTY_TEXT_AUTO);
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(c === '01' ? 'B07' : 'B08');
      if (list.length === 1) {
        setDefaultClassTreeId(list[0].classTreeId);
        setClassTreeId(list[0].classTreeId);
        setClassEmptyText(list[0].classTreeFullName);
      } else {
        setClassEmptyText('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
      }
    } catch { /* 기본 분류를 못 읽으면 안내 글 그대로 */ }
  };

  // [E2] retrieveButton[조회].Select (L154) → retrieve()
  const retrieve = async () => {
    if (cur.current.code == null) { message.warning('구분을 선택해주세요'); return; }
    await crud.retrieve();
  };

  // [E1] unLeaveComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L116) → defaultName(), retrieve()
  const onCollapse = () => {
    void defaultName(cur.current.code);
    void retrieve();
  };

  // [E4] deleteButton[삭제].Select (L166) → deleteCheck() L379-406: 상신 중인 건이 있으면 안내
  const deleteCheck = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.some(r => !(r.apprStatusCode == null || r.apprStatusCode === '40' || r.apprStatusCode === '99'))) {
      message.warning('상신중인 미사용휴가정보가 포함되어있습니다');
      return;
    }
    return crud.deleteChecked();
  };

  // [E5] insertButton[생성].Select (L172) → insert() L319-330: Emp21_Lookup_Insert.open(구분 이름, 닫으면 retrieve())
  const insert = () => setInsertOpen(true);

  // [E6] classTreeFullName[문서분류].TriggerClick (L178) → openLookupDoc() L415-424: Dcr30_Move_DcrClass.open(defaultModel, callback) → 고른 분류
  const onPickClass = (r: { classTreeId: number | null; classTreeFullName: string | null }) => {
    setClassOpen(false);
    if (r.classTreeId == null) return;
    setClassTreeId(r.classTreeId);
    setClassTreeFullName(r.classTreeFullName ?? '');
  };

  // [E7] apprButton[상신].Select (L184) → insertApprCheck() L426-462
  const insertApprCheck = () => {
    if (cur.current.code == null) { message.warning('구분을 선택해주세요'); return; }
    if (classTreeId == null) { message.warning('문서분류를 먼저 선택해주세요'); return; }
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.some(r => isApprBusy(r.apprStatusCode))) { message.warning('상신 진행 중인 공지구분입니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '선택한 사원의 결재문서가 일괄 자동생성됩니다. 진행하시겠습니까?',
      width: 380,
      okText: '예',
      cancelText: '아니오',
      // [E12] msgBox.DialogHide [YES] (L446) → insertAppr() L464-485: 서비스 emp.Emp21_UnLeave.insertAppr(companyId, regEmpId, classTreeId, 선택 행) — 다음 단계
      onOk: () => { message.info('결재문서 일괄 자동생성은 아직 변환 전입니다(다음 단계).'); },
    });
  };

  // [E8] sendButton[문자발송].Select (L190) → sendMessage() L487-540
  const sendMessage = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('문자발송할 사원을 선택해주세요'); return; }
    const last = selected[selected.length - 1].personName ?? '';
    Modal.confirm({
      title: '확인',
      content: selected.length === 1 ? `${last}님에게 문자를 발송하시겠습니까?` : `${last} 외 ${selected.length - 1}인에게 문자를 발송하시겠습니까?`,
      width: 380,
      okText: '예',
      cancelText: '아니오',
      // [E13] msgBox.DialogHide [YES] (L509) → 서비스 emp.Emp21_UnLeave.sendMessage(companyId, 선택 행), 성공 "문자알림이 발송되었습니다" / "문자발송 기능을 미신청한 고객사입니다…" — 다음 단계
      onOk: () => { message.info('문자발송은 아직 변환 전입니다(다음 단계).'); },
    });
  };

  // [E9] actionCell (ImageCell).callbackOnCreate (L259) → 서비스 apr.Apr01_Appr.selectById(apprId) → 없으면 "관련 상신문서가 존재하지 않습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false) — 편집창은 다음 단계
  // [E10] actionCell2 (ImageCell).callbackOnCreate (L289) → 위와 같음, expectApprId(지정통보)
  const viewAppr = (apprId: number | null) => {
    if (apprId == null) { message.warning('관련 상신문서가 존재하지 않습니다'); return; }
    message.info('전자결재 문서 보기는 아직 변환 전입니다(다음 단계).');
  };

  // retrieve() L340-350: 구분 01(사용촉진)이면 열 9·10 제목이 "사용촉진…", 열 11·12(지정통보)를 보이고, 그 밖이면 열 9·10 제목이 "지정통보…"이고 열 11·12를 감춘다
  const isFirst = code === '01';
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 50, '사번'),
    gb.textCenter('personName', 100, '성명'),
    gb.date('hireDate', 90, '입사일자'),
    editableCol(gb.double('totalDays', 100, '발생휴가', { editor: 'number' })),
    editableCol(gb.double('useDays', 100, '사용휴가', { editor: 'number' })),
    editableCol(gb.double('remainDays', 100, '잔여휴가', { editor: 'number' })),
    gb.date('startDate', 90, '생성일자'),
    gb.textCenter('apprStatusName', 140, isFirst ? '사용촉진통보' : '지정통보'),
    iconCell<UnLeave>('view', 'actionCell', 60, isFirst ? '사용촉진<br>상세보기' : '지정통보<br>상세보기', row => viewAppr(row.apprId)),
    { ...gb.textCenter('expectApprStatusName', 100, '지정통보'), hide: !isFirst },
    { ...iconCell<UnLeave>('view', 'actionCell2', 60, '지정통보<br>상세보기', row => viewAppr(row.expectApprId)), hide: !isFirst },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [isFirst]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, boxSizing: 'border-box' }}>
      <SearchBar
        onSearch={() => void retrieve()}
        extra={(
          <>
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
            <Button type="generate" onClick={insert}>생성</Button>
            <span style={{ color: '#4472C4', whiteSpace: 'nowrap' }}>※ 기타직은 미사용 연차휴가관리 대상자가 아니므로 생성 시 제외됩니다.</span>
          </>
        )}
      >
        <SearchBar.Field label="해당 연도">
          <Input style={{ width: 60 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          <SystemCodeComboBox
            kindGroupCd="unLeaveCode001"
            style={{ width: 150 }}
            placeholder="구분을 선택해주세요"
            value={code}
            onChange={(c, n) => { cur.current = { ...cur.current, code: c }; setCode(c); setCodeName(n); }}
            onOpenChange={open => { if (!open) onCollapse(); }}
          />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<UnLeave> crud={crud} columnDefs={columnDefs} />
      </div>
      <div style={{ border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 95, textAlign: 'right', paddingRight: 10, flexShrink: 0 }}>문서분류</span>
        <LookupInput
          width={800}
          value={classTreeFullName}
          placeholder={classEmptyText}
          disabled={code == null || code === '%'}
          onOpen={() => setClassOpen(true)}
        />
        <Button type="register" onClick={insertApprCheck}>상신</Button>
        <Button type="send" onClick={sendMessage}>문자발송</Button>
      </div>
      <Emp21_Lookup_Insert
        open={insertOpen}
        unLeaveName={codeName ?? null}
        onClose={() => { setInsertOpen(false); void retrieve(); }}
      />
      <Dcr30_Move_DcrClass
        open={classOpen}
        authCheck
        defaultClassTreeId={defaultClassTreeId}
        onResult={onPickClass}
        onClose={() => setClassOpen(false)}
      />
    </div>
  );
};
