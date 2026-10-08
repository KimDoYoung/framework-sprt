/**
 * 일반발령 탭 (C01) — Emp00_Tab_TransInfo 아래 탭 3번째.
 * AS-IS: myApp/client/vi/emp/Emp03_TabPage_Trans.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 사원의 발령(emp03_trans)을 셀 편집 그리드(체크 단일)로 조회·등록·삭제·저장한다. 특정직위 조회창(E1)은 2단계.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space, Typography, Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { empApi, orgApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code } from '@/types/sys';
import { Trans } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Org00_Lookup_SelectSingle } from '../org/Org00_Lookup_SelectSingle';
import type { TransInfoTabProps } from './Emp00_Tab_TransInfo';

const gb = gbFor<Trans>();

type CodeField = 'transCd' | 'kindCd' | 'titleCd' | 'posCd';
type NameField = 'transNm' | 'kindNm' | 'titleNm' | 'posNm';

/** ComboBoxField 편집 컬럼: 이름을 고르면 코드도 바꾼다 (AS-IS Collapse → addChange(코드)) */
const codeCol = (name: NameField, code: CodeField, width: number, header: string, codes: Code[]): ColDef<Trans> =>
  gb.text(name, width, header, {
    editor: 'select',
    values: codes.map(c => c.name),
    valueSetter: p => {
      p.data[name] = p.newValue;
      p.data[code] = codes.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  });

/** AS-IS buildGrid() L88-160 (setChecked SINGLE) */
const buildGrid = (codes: Record<string, Code[]>, lookupOrgCode: (r: Trans) => void): ColDef<Trans>[] => [
  gb.date('transDate', 100, '발령일', { editor: 'date' }),  // L143
  codeCol('transNm', 'transCd', 120, '발령구분', codes.EmpTransCode ?? []),  // L144 [E7]
  codeCol('kindNm', 'kindCd', 80, '사원구분', codes.EmpKindCode ?? []),  // L145 [E6]
  // L146 lookupOrgCode(LookupTriggerField, 편집 불가) — 아이콘으로 조직찾기
  gb.text('orgNm', 200, '발령조직', {
    cellStyle: { color: '#1677ff' },
    cellRenderer: (p: CustomCellRendererProps<Trans>) => (
      <Space size={4}>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) lookupOrgCode(p.data); }} />
        {p.value}
      </Space>
    ),
  }),
  codeCol('titleNm', 'titleCd', 100, '발령직책', codes.EmpTitleCode ?? []),  // L147 [E9]
  codeCol('posNm', 'posCd', 100, '발령직위', codes.EmpPosCode ?? []),  // L148 [E10]
  gb.text('gradeNm', 100, '특정직위'),  // L150 (편집 컬럼 L149는 원본에서 주석)
  gb.text('duty', 150, '담당업무', { editor: 'text' }),  // L151
  gb.date('expiryDate', 100, '계약만료일', { editor: 'date' }),  // L152
  gb.text('transReason', 200, '비고', { editor: 'text' }),  // L153
  gb.boolean('orgHeadYn', 80, '조직장'),  // L154
  gb.boolean('officerYn', 80, '등기임원'),  // L155
  gb.boolean('tdmTargetYn', 80, '책무대상'),  // L156
  gb.boolean('nonStayYn', 80, '비상근'),  // L157
];

const CODE_KINDS = ['EmpTransCode', 'EmpKindCode', 'EmpTitleCode', 'EmpPosCode'];

export const Emp03_TabPage_Trans: React.FC<TransInfoTabProps> = ({ row, onRowChanged }) => {
  const personId = row?.personId;
  const [codes, setCodes] = useState<Record<string, Code[]>>({});
  const [orgTarget, setOrgTarget] = useState<Trans>();

  // updateTransInfoGrid() L249-273: 현재 발령(Emp00_Current_TransInfoModel, 발령코드 '%')을 다시 읽어 목록 행을 바꾼다
  const updateTransInfoGrid = useCallback(async () => {
    if (!row) return;
    try {
      onRowChanged?.(await empApi.getCurrentTransInfo(row.personId), row);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [row, onRowChanged]);

  const crud = useGridCrud<Trans>({
    idField: 'transId',
    // retrieve() L202-208: 서비스 emp.Emp03_Trans.selectByPersonId(personId, companyId)
    search: useCallback(async () => (personId ? empApi.searchTranses(personId) : []), [personId]),
    // update() L211-247: GridUpdate → emp.Emp03_Trans.update → updateTransInfoGrid()
    save: empApi.updateTranses,
    remove: empApi.deleteTranses,
    newRow: () => ({}),
    firstEditField: 'transNm',
    // update() L221-238: 같은 발령일이 두 행이면 저장하지 않는다
    validate: (_changed, all) => {
      const dates = all.map(r => r.transDate);
      return dates.some((d, i) => dates.indexOf(d) !== i) ? '동일안 발령일에 이미 발령내용이 존재합니다' : undefined;
    },
    // delete() L345-364
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    onChanged: updateTransInfoGrid,
  });

  // lookupOrgCode() L162-179: 발령일 기준 조직찾기(openFixDate)
  const lookupOrgCode = useCallback((r: Trans) => {
    if (!r.transDate) {
      message.warning('발령일을 먼저 등록해주세요');
      return;
    }
    setOrgTarget(r);
  }, []);

  const columnDefs = useMemo(() => buildGrid(codes, lookupOrgCode), [codes, lookupOrgCode]);

  useEffect(() => {
    Promise.all(CODE_KINDS.map(k => sysApi.searchCodes(k).catch(() => [] as Code[])))
      .then(lists => setCodes(Object.fromEntries(CODE_KINDS.map((k, i) => [k, lists[i]]))));
  }, []);

  // retrieve(param) ← Emp00_Tab_TransInfo.retrieveTabpage (사원 선택·탭 전환) / init(): 비운다
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) crud.retrieve(); else crud.clear(); }, [personId]);

  // [E3] searchBarBuilder[등록].Insert (L79) → insertRow() L276-323
  const insertRow = async () => {
    if (!row) {
      message.warning('사원을 먼저 선택해주세요');
      return;
    }
    const today = dayjs().format('YYYY-MM-DD');
    // 서비스 org.Org00_OrgInfo.selectByOrgCodeId(사원의 현재 조직, 오늘) → 발령조직 (원본은 행을 넣은 뒤 채운다)
    let org = null;
    try {
      org = row.orgCodeId ? await orgApi.getOrgInfo(row.orgCodeId, today) : null;
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    crud.gridRef.current?.api.deselectAll();
    crud.addRows([{
      personId: row.personId,
      kindCd: row.kindCd, kindNm: row.kindNm,
      titleCd: row.titleCd, titleNm: row.titleNm,
      posCd: row.posCd, posNm: row.posNm,
      transDate: today,
      officerYn: row.officerYn,
      ...(org ? { orgCodeId: org.orgCodeId, orgNm: org.korNm } : {}),
    }]);
  };

  // [E4] searchBarBuilder[삭제].Delete (L80) → deleteRow() L326-343: 서비스 emp.Emp03_Trans.deleteCheck(personId) — DB 발령이 2건 이상일 때만
  const deleteRow = async () => {
    if (!personId) return;
    try {
      if ((await empApi.searchTranses(personId)).length > 1) {
        // delete() → [E12] messageBox.DialogHide [YES] (L348) → GridDeleteData → updateTransInfoGrid()
        crud.deleteChecked();
      } else {
        message.warning('발령정보는 1(개)이상 있어야합니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L64-86)
  // [E11 생략] gradeNameComboBox Collapse (L134): 특정직위 편집 컬럼이 원본에서 주석 처리 — 특정직위는 보기만
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
      <Space>
        <Typography.Text strong>일반발령</Typography.Text>
        {/* [E2] searchBarBuilder[조회].Retrieve (L78) → retrieve() */}
        <Button type="search" onClick={crud.retrieve} disabled={!personId}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
        {/* [E5] searchBarBuilder[저장].Update (L81) → update() */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
        {/* [E1 생략] gradeCodeButton[특정직위 및 알림설정].Select (L68) → Emp03_Lookup_Grade — 2단계 */}
        <Button type="org" disabled title="2단계">특정직위 및 알림설정</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Trans>
          crud={crud}
          columnDefs={columnDefs}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      {/* [E8] lookupOrgCode.TriggerClick (L110) → 조직 선택 시 발령조직 코드·이름을 바꾼다 */}
      <Org00_Lookup_SelectSingle
        baseDate={orgTarget?.transDate ?? undefined}
        onClose={() => setOrgTarget(undefined)}
        onSelect={org => orgTarget && crud.updateRow(orgTarget.transId, { orgCodeId: org.orgCodeId, orgNm: org.korNm })}
      />
    </div>
  );
};
