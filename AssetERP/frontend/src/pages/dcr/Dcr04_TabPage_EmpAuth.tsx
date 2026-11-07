/**
 * 조회권한 예외사원 등록 오른쪽 — 문서분류에 조회권한 예외 사원을 등록하는 셀 편집 그리드 (EE08, Dcr04_Tab_EmpAuth의 center)
 * AS-IS: myApp/client/vi/dcr/Dcr04_TabPage_EmpAuth.java (286줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L62-87: 테두리 박스 = 툴바 50(검색 · 입력 200 · [조회][등록][저장][삭제] · [사원별 권한현황]) + 그리드(부서 300 · 성명 100 · 직위 100 · 사원구분 100 · 비고 500, 체크 다중)
 * 부모가 고른 문서분류를 prop으로 받는다(AS-IS retrieve(classTreeModel)). 고르지 않았거나 문서분류(C)면 [조회][등록][저장][삭제]가 꺼지고 그리드가 빈다
 */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Input, message, Typography } from 'antd';
import dayjs from 'dayjs';
import { dcrEmpAuthApi } from '@/api/dcr';
import { DcrClassTree, DcrEmpAuth } from '@/types/dcr';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { Dcr04_Lookup_DocList } from './Dcr04_Lookup_DocList';

const gb = gbFor<DcrEmpAuth>();

interface Props {
  /** 왼쪽 트리에서 고른 문서분류. 없으면(선택 없음·여러 건) 꺼진다 — AS-IS tabPage.retrieve(null) */
  classTree: DcrClassTree | null;
}

export const Dcr04_TabPage_EmpAuth: React.FC<Props> = ({ classTree }) => {
  const [searchText, setSearchText] = useState('');
  const [pickOpen, setPickOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  // retrieve() L154-190: classTreeModel이 없거나 typeCode가 C(문서분류)면 그리드를 비우고 [조회][등록][저장][삭제]를 끈다
  const usable = classTree != null && classTree.typeCode !== 'C';

  // retrieve() L154-190 → dcr.Dcr04_EmpAuth.selectByText(classTreeId, "%"+searchText+"%) — companyId는 서버가 세션에서
  const crud = useGridCrud<DcrEmpAuth>({
    idField: 'empAuthId',
    search: async () => (usable ? dcrEmpAuthApi.search(classTree!.classTreeId, searchText) : []),
    // [E4] updateButton[저장].Select (L112) → update() L193-213: dcr.Dcr04_EmpAuth.updateList — 끝나면 retrieve()
    save: async rows => {
      await dcrEmpAuthApi.update(rows.map(r => ({ classTreeId: r.classTreeId, personId: r.personId, note: r.note })));
      return rows;
    },
    reloadAfterSave: true,
    // [E5]·[E7] deleteButton[삭제].Select (L118) → deleteChk() L256-274: "삭제"/"n건을 삭제하시겠습니까?"(폭 300) → deleteRow() L277-281: dcr.Dcr04_EmpAuth.delete
    remove: ids => dcrEmpAuthApi.delete(ids),
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
    newRow: () => ({}),
  });
  // 오래 사는 콜백이 최신 crud 를 부르게 한다 (crud 는 rows 가 바뀔 때마다 새 객체)
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // [E0] 생성자 L62-87 → retrieve() — 부모가 문서분류를 바꿀 때마다 다시 조회
  useEffect(() => { void crudRef.current.retrieve(); }, [classTree?.classTreeId, classTree?.typeCode]);

  // [E3] insertButton[등록].Select (L106) → insertRow() L216-254: 사원찾기(다중, 오늘) → 고른 사원마다 한 줄(문서조회여부 false). 값은 addChange라 변경으로 친다
  const insertRow = () => {
    if (classTree == null) { message.warning('좌측 문서분류를 먼저 선택해주세요'); return; }
    if (classTree.typeCode === 'C') { message.warning('좌측 문서분류의 최하위 문서분류를 선택해주세요'); return; }
    setPickOpen(true);
  };
  const onPick = (list: TransInfo[]) => {
    setPickOpen(false);
    if (classTree == null || list.length === 0) return;
    crud.addRows(list.map(e => ({
      classTreeId: classTree.classTreeId, personId: e.personId,
      orgName: e.parentFullNm, personName: e.korNm, posName: e.posNm, kindName: e.kindNm, retrieveYn: 'false',
    })), true);
  };

  // buildGrid() L137-147
  const columnDefs = useMemo(() => [
    gb.text('orgName', 300, '부서'),  // L140
    gb.textCenter('personName', 100, '성명'),  // L141
    gb.textCenter('posName', 100, '직위'),  // L142
    gb.textCenter('kindName', 100, '사원구분'),  // L143
    gb.text('note', 500, '비고', { editor: 'text' }),  // L144
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
        <Typography.Text strong style={{ flex: 'none' }}>검색</Typography.Text>
        {/* [E1] searchText.KeyPress [Enter] (L92) → retrieve() */}
        <Input style={{ width: 200, flex: 'none' }} allowClear placeholder="부서/성명/직위/사원구분" value={searchText}
          onChange={e => setSearchText(e.target.value)} onPressEnter={() => void crud.retrieve()} />
        {/* [E2] retrieveButton[조회].Select (L100) → retrieve() */}
        <Button type="search" disabled={!usable} onClick={() => void crud.retrieve()}>조회</Button>
        <Button type="register" disabled={!usable} onClick={insertRow}>등록</Button>
        <Button type="save" disabled={!usable} count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" disabled={!usable} onClick={crud.deleteChecked}>삭제</Button>
        {/* [E6] deleteListButton[사원별 권한현황].Select (L124) → Dcr04_Lookup_DocList.open(callback: retrieve()) */}
        <Button type="view" onClick={() => setListOpen(true)}>사원별 권한현황</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<DcrEmpAuth> crud={crud} columnDefs={columnDefs} />
      </div>
      <Emp00_Lookup_SelectMulti open={pickOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickOpen(false)} />
      <Dcr04_Lookup_DocList open={listOpen} onClosed={() => void crud.retrieve()} onClose={() => setListOpen(false)} />
    </div>
  );
};
