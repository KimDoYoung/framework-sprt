/**
 * 문서구분(T) 그리드 (E16) — Dcr01_Tab_ClassTree의 오른쪽(center). 왼쪽 트리에서 고른 문서분류 아래 문서구분을 보고 고친다.
 * AS-IS: myApp/client/vi/dcr/Dcr01_Grid_DocType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-161: 위 툴바(검색 200 "구분코드/문서구분명" + [조회]) + 체크박스 단일 셀 편집 그리드, 아래 가운데 [삭제][등록][저장] — 문서분류를 고르기 전에는 모두 꺼져 있다
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AprApprStepGroup, AprStamp } from '@/types/apr';
import { DcrClassTree, DcrDocTypeRow } from '@/types/dcr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { sysApi } from '@/api/sys';
import { Code } from '@/types/sys';
import { Apr10_Lookup_DocStamp } from '@/pages/apr/Apr10_Lookup_DocStamp';
import { Apr30_Lookup_ApprStepGroup } from '@/pages/apr/Apr30_Lookup_ApprStepGroup';
import { Dcr01_Move_Grid } from './Dcr01_Move_Grid';
import { Dcr06_Lookup_Form } from './Dcr06_Lookup_Form';
import { Dcr07_Lookup_ClassDetail } from './Dcr07_Lookup_ClassDetail';
import { Dcr20_Lookup_Ics } from './Dcr20_Lookup_Ics';
import { Dcr21_Lookup_Icr } from './Dcr21_Lookup_Icr';

const gb = gbFor<DcrDocTypeRow>();

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

interface Props {
  /** retrieve(classTreeModel) L315 — 왼쪽 트리에서 고른 문서분류. 처음 고를 때까지 undefined */
  classTree?: DcrClassTree;
}

export const Dcr01_Grid_DocType: React.FC<Props> = ({ classTree }) => {
  const user = useLoginUser();
  const [searchText, setSearchText] = useState('');
  const [approvalCodes, setApprovalCodes] = useState<Code[]>([]);
  // 연결 창들 (각 칸 아이콘)
  const [moveRow, setMoveRow] = useState<DcrDocTypeRow | null>(null);
  const [formId, setFormId] = useState<number | null>(null);
  const [icsId, setIcsId] = useState<number | null>(null);
  const [icrId, setIcrId] = useState<number | null>(null);
  const [detailRow, setDetailRow] = useState<DcrDocTypeRow | null>(null);
  const [stampRow, setStampRow] = useState<DcrDocTypeRow | null>(null);
  const [groupRow, setGroupRow] = useState<DcrDocTypeRow | null>(null);

  const parentId = classTree?.classTreeId ?? null;

  const crud = useGridCrud<DcrDocTypeRow>({
    idField: 'classTreeId',
    // retrieve() L315-344: 서비스 dcr.Dcr01_ClassTree.selectByClassTreeId(companyId, parentId, searchText "%…%")
    search: useCallback(() => (parentId == null ? Promise.resolve([]) : dcrApi.searchDocTypeRows(parentId, searchText)), [parentId, searchText]),
    // update() L377-413: GridUpdate → dcr.Dcr01_ClassTree.update (새 행은 INSERT, 아니면 UPDATE)
    save: rows => dcrApi.saveDocTypeRows(rows.map(r => ({
      classTreeId: r.classTreeId, parentTreeId: r.parentTreeId, classTreeName: n(r.classTreeName), classTreeCode: n(r.classTreeCode), seq: n(r.seq), note: n(r.note),
      approvalTypeCode: n(r.approvalTypeCode), apprStepGroupId: r.apprStepGroupId ?? null, sealCode: n(r.sealCode),
      compYn: r.compYn ?? null, mngmYn: r.mngmYn ?? null, printFundYn: r.printFundYn ?? null,
    }))),
    // 삭제는 deleteCheck → deleteAll로 따로 한다(체크 행 삭제 안 씀)
    remove: async () => 0,
    // insertRow() L562-576: 회사·상위(고른 분류)·유형 T·사용 true·관리자 회사면 adminYn true
    newRow: useCallback(() => ({ parentTreeId: parentId ?? 0, adminYn: user.companyId === 0 ? 'true' : 'false' }), [parentId, user.companyId]),
    firstEditField: 'classTreeCode',
    // update() L377-413: 바뀐 행마다 구분코드 → 문서명 → 결재구분 → 정렬순서 순서로 검사
    validate: changed => {
      for (const m of changed) {
        if (!m.classTreeCode) return '구분코드를 넣어주십시오';
        if (!m.classTreeName || m.classTreeName.length < 1) return '문서명을 넣어 주십시오';
        if (!m.approvalTypeCode) return '결재구분을 넣어 주십시오';
        if (!m.seq) return '정렬순서를 넣어주십시오';
      }
      return undefined;
    },
    reloadAfterSave: false,
  });

  // [E6 생략] docItemComboBox[DocItemTypeCode].Collapse (L165) — 상품분류 컬럼이 원본에서 주석 처리라 화면에 없다
  // [E9 생략] sealName.KeyDown (L187) — 입력 막기: 인감종류 칸은 아이콘으로만 고른다(읽기 전용 표시)
  // [E0] 화면 열림 (생성자 L95-161) → 초기화 / 결재구분 콤보(ApprovalTypeCode) 코드 로드
  useEffect(() => {
    sysApi.searchCodes('ApprovalTypeCode').then(setApprovalCodes).catch(() => {});
  }, []);

  // 왼쪽 트리에서 문서분류를 고르면 다시 읽는다 (Dcr01_Tab_ClassTree.retrievePage → gridDocType.retrieve(classTreeModel))
  useEffect(() => {
    if (parentId == null) return;
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  // [E2] retrieveButton[조회].Select (L108) · [E1] searchText.KeyPress [Enter] (L100) → retrieve(classTreeModel)
  const retrieve = () => crud.retrieve();

  // [E10] lookupGroup.TriggerClick [result == null] (L249) → Apr30_Lookup_ApprStepGroup: 선택안함이면 추가결재를 비운다
  const pickGroup = (data: DcrDocTypeRow, result: AprApprStepGroup | null) => {
    crud.updateRow(data.classTreeId, result == null
      ? { apprStepGroupId: null, apprStepGroupName: null }
      : { apprStepGroupId: result.apprStepGroupId, apprStepGroupName: result.apprStepGroupName });
  };

  // [E8] sealName.TriggerClick (L181) → findStamp() L346-373: Apr10_Lookup_DocStamp(전체) → 고른 인감의 ID·이름 (해당사항 없음은 빈 모델 = 비움)
  const pickStamp = (data: DcrDocTypeRow, result: AprStamp | null) => {
    crud.updateRow(data.classTreeId, result == null
      ? { sealCode: null, sealName: null }
      : { sealCode: String(result.stampId), sealName: result.stampName });
  };

  // buildGrid() L163-303: setChecked(SINGLE)
  const columnDefs = useMemo<ColDef<DcrDocTypeRow>[]>(() => [
    iconCell<DcrDocTypeRow>('move', 'actionMove', 50, '이동', row => setMoveRow(row)),  // L280 moveCell(TreeChange) → moveItem() L305-313
    gb.booleanIcon('adminYn', 40, ''),  // L281
    gb.text('classTreeCode', 80, '구분코드', { editor: 'text' }),  // L282
    gb.textArea('classTreeName', 250, '문서구분명', { editor: 'largeText' }),  // L283
    gb.textArea('note', 300, '업무개요', { editor: 'largeText' }),  // L284
    gb.text('seq', 80, '정렬순서', { editor: 'text' }),  // L285
    gb.text('formCountStr', 50, '양식지정'),  // L286
    iconCell<DcrDocTypeRow>('add', 'actionForm', 30, '', row => setFormId(row.classTreeId)),  // L287 formCell → formList() L415-418
    gb.text('icsCountStr', 50, '법규연결'),  // L288
    // L289 icsCell: 관리자 회사이거나 관리자가 내려준 분류가 아니면 icsList(), 아니면 icsListUser() — 둘 다 같은 창
    iconCell<DcrDocTypeRow>('add', 'actionIcs', 30, '', row => setIcsId(row.classTreeId)),
    gb.text('icrCountStr', 50, '내규연결'),  // L290
    // L291 icrCell: 관리자 회사이거나 관리자가 내려준 분류가 아니면 icrList(), 아니면 icrListUser() — 둘 다 같은 창
    iconCell<DcrDocTypeRow>('add', 'actionIcr', 30, '', row => setIcrId(row.classTreeId)),
    iconCell<DcrDocTypeRow>('add', 'actionDetail', 80, '세부분류', row => setDetailRow(row)),  // L292 detailCell → Dcr07_Lookup_ClassDetail.open(model)
    // L293 approvalComboBox[ApprovalTypeCode] [E7] Collapse (L173) → approvalTypeCode 동기화
    gb.text('approvalTypeName', 100, '결재구분', {
      editor: 'select',
      values: approvalCodes.map(c => c.name),
      valueSetter: p => {
        p.data.approvalTypeName = p.newValue;
        p.data.approvalTypeCode = approvalCodes.find(c => c.name === p.newValue)?.code ?? p.data.approvalTypeCode;
        return true;
      },
    }),
    gb.text('apprStepGroupName', 120, '추가결재', {  // L294 lookupGroup(LookupTriggerField, 편집 불가) — 아이콘으로 지정그룹 찾기
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: CustomCellRendererProps<DcrDocTypeRow>) => (
        <Space size={4}>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setGroupRow(p.data); }} />
          {p.value}
        </Space>
      ),
    }),
    gb.text('sealName', 200, '인감종류', {  // L295 sealName(LookupTriggerField, KeyDown 막음) — 아이콘으로 인감 찾기
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: CustomCellRendererProps<DcrDocTypeRow>) => (
        <Space size={4}>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setStampRow(p.data); }} />
          {p.value}
        </Space>
      ),
    }),
    gb.boolean('compYn', 70, '준법감시', { editable: true }),  // L296
    gb.boolean('mngmYn', 70, '경영지원', { editable: true }),  // L298
    gb.boolean('printFundYn', 70, '펀드출력', { editable: true }),  // L299
  ], [approvalCodes]);

  // [E5] updateButton[저장].Select (L126) → updateCheck() L440-470: 바뀐 행을 서버 점검(dcr.Dcr01_ClassTree.updateCheck, status 1이면 update()), 아니면 서버 문구
  const updateCheck = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.length === 0) return;
    try {
      const check = await dcrApi.checkUpdate(changed.map(r => ({
        classTreeId: r.classTreeId, classTreeCode: n(r.classTreeCode), classTreeName: n(r.classTreeName), seq: n(r.seq), note: n(r.note),
      })));
      if (check.status === 1) await crud.saveRows();
      else message.warning(check.message ?? '');
    } catch (err) {
      message.error(errorMessage(err, '점검 실패'));
    }
  };

  // deleteAll() L578-592: dcr.Dcr01_ClassTree.deleteAll → 다시 읽는다
  const deleteAll = async (row: DcrDocTypeRow) => {
    try {
      if (row.classTreeId > 0) await dcrApi.deleteClassTree(row.classTreeId);
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // deleteCheck() L486-560: 서버 점검(dcr.Dcr01_ClassTree.deleteCheck) → status 0이면 "해당 문서분류를 삭제하시겠습니까?"(폭 350) [YES] [E11] msgBox.DialogHide (L499) → deleteAll()
  const deleteCheck = async (row: DcrDocTypeRow) => {
    try {
      const check = row.classTreeId > 0 ? await dcrApi.checkDelete(row.classTreeId) : { status: 0, message: '' };
      if (check.status === 0) {
        Modal.confirm({ title: '확인', content: '해당 문서분류를 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 350, onOk: () => deleteAll(row) });
      } else if (check.message === 'continue') {
        message.warning('상신문서가 존재합니다. 문서이동 후 삭제하세요');
      } else {
        message.warning(`${check.message}가 존재합니다. 문서분류지정 해제후 재시도 부탁드립니다`);
      }
    } catch (err) {
      message.error(errorMessage(err, '점검 실패'));
    }
  };

  // [E3] deleteButton[삭제].Select (L114) → adminCheck() L472-484: 관리자 분류는 관리자 회사만 지울 수 있다
  const adminCheck = () => {
    const row = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (!row) return message.warning('삭제할 행을 선택하세요.');
    if (row.adminYn === 'true') {
      if (user.companyId === 0) void deleteCheck(row);
      else message.warning("'Asset-ERP'에서 제공하는 문서분류는 변경불가능합니다");
    } else {
      void deleteCheck(row);
    }
  };

  const enabled = classTree != null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: 0 }}>
      <div style={{ border: '1px solid #d9d9d9', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
          <SearchBar onSearch={retrieve} loading={crud.loading}>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="구분코드/문서구분명" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<DcrDocTypeRow> crud={crud} columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
        </div>
      </div>
      <div style={{ textAlign: 'center', flex: 'none', padding: '4px 0' }}>
        <Space>
          <Button type="delete" disabled={!enabled} onClick={adminCheck}>삭제</Button>
          {/* [E4] insertButton[등록].Select (L120) → insertRow() */}
          <Button type="register" disabled={!enabled} onClick={crud.addRow}>등록</Button>
          <Button type="save" disabled={!enabled} count={crud.changes} onClick={updateCheck}>저장</Button>
        </Space>
      </div>
      <Dcr01_Move_Grid model={moveRow} onMoved={() => void crud.retrieve()} onClose={() => setMoveRow(null)} />
      {/* 연결 창을 닫아도 양식지정·법규연결·내규연결 건수는 다시 읽지 않는다(AS-IS 그대로 — 조회를 다시 눌러야 바뀐다) */}
      <Dcr06_Lookup_Form classTreeId={formId} onClose={() => setFormId(null)} />
      <Dcr20_Lookup_Ics dcrClassTreeId={icsId} onClose={() => setIcsId(null)} />
      <Dcr21_Lookup_Icr dcrClassTreeId={icrId} onClose={() => setIcrId(null)} />
      <Dcr07_Lookup_ClassDetail model={detailRow} onClose={() => setDetailRow(null)} />
      <Apr10_Lookup_DocStamp classTreeId={stampRow?.classTreeId ?? null}
        onResult={r => { if (stampRow) pickStamp(stampRow, r); }} onClose={() => setStampRow(null)} />
      <Apr30_Lookup_ApprStepGroup open={groupRow != null}
        onResult={r => { if (groupRow) pickGroup(groupRow, r); }} onClose={() => setGroupRow(null)} />
    </div>
  );
};
