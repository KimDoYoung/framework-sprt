/**
 * 포상휴가 대상 직원 — 포상휴가관리(Emp22_Tab_EtcLeave, S10)의 오른쪽 페이지.
 * AS-IS: myApp/client/vi/emp/Emp23_Page_EtcLeavePerson.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L44-77): 툴바([등록][저장][삭제]) + 체크 다중 그리드(조직 180 · 성명 100). 부르는 쪽이 고른 포상휴가 ID(etcLeaveId)를 준다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { empEtcLeaveApi } from '@/api/emp';
import { EtcLeavePerson, TransPerson } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Emp01_Lookup_PersonModel } from '@/components/lookup/Emp01_Lookup_PersonModel';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<EtcLeavePerson>();

interface Props {
  /** 고른 포상휴가 ID (AS-IS retrieve(etcLeaveId)) — null이면 그리드를 비운다 */
  etcLeaveId: number | null;
}

export const Emp23_Page_EtcLeavePerson: React.FC<Props> = ({ etcLeaveId }) => {
  const [personOpen, setPersonOpen] = useState(false);
  const idRef = useRef<number | null>(etcLeaveId);
  idRef.current = etcLeaveId;
  const retrieveRef = useRef<() => Promise<void>>(async () => {});

  // retrieve(etcLeaveId) L94-105: 서비스 emp.Emp23_EtcLeavePerson.selectByEtcLeaveId, ID가 없으면 그리드를 비운다
  const crud = useGridCrud<EtcLeavePerson>({
    idField: 'etcLeavePersonId',
    search: useCallback(async () => (idRef.current != null && idRef.current > 0 ? empEtcLeaveApi.searchPersons(idRef.current) : []), []),
    // [E2] updateButton[저장].Select (L56) → updateCheck() L137-156(상신 문서가 있으면 "상신 중인 문서의 정보는 수정이 불가능합니다") → update() L158-166: emp.Emp23_EtcLeavePerson.update → retrieve()
    save: useCallback((rows: EtcLeavePerson[]) => empEtcLeaveApi.savePersons(rows), []),
    reloadAfterSave: true,
    // [E3] deleteButton[삭제].Select (L62) → deleteCheck() L168-187 → deleteRow() L189-198: GridDeleteData → emp.Emp23_EtcLeavePerson.delete → retrieve()
    remove: useCallback((ids: number[]) => empEtcLeaveApi.removePersons(ids), []),
    deleteConfirm: false,
    onChanged: useCallback(() => { void retrieveRef.current(); }, []),
    newRow: useCallback(() => ({}), []),
  });
  retrieveRef.current = crud.retrieve;

  // [E0] 화면 열림 (생성자 L44-77) → 초기화: 부르는 쪽이 고른 포상휴가가 바뀔 때마다 retrieve(etcLeaveId)
  useEffect(() => { void crud.retrieve(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [etcLeaveId]);

  // [E1] insertButton[등록].Select (L45) [etcLeaveId == null] → "포상휴가를 먼저 선택해주세요", 아니면 insertRow() L107-135
  const insertRow = () => {
    if (etcLeaveId == null) { message.warning('포상휴가를 먼저 선택해주세요'); return; }
    if (etcLeaveId <= 0) { message.warning('포상휴가를 먼저 저장해주세요'); return; }
    setPersonOpen(true);
  };
  // insertRow() L107-135: Emp01_Lookup_PersonModel.open → 고른 사원마다 행 추가(조직·성명 채움, 변경으로 침)
  const onPickPersons = (persons: TransPerson[]) => {
    setPersonOpen(false);
    crud.addRows(persons.map(p => ({ etcLeaveId: etcLeaveId ?? 0, personId: p.personId, orgName: p.orgNm ?? null, personName: p.korNm ?? null })), true);
  };

  // AS-IS buildGrid() (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.text('orgName', 180, '조직'),
    gb.textCenter('personName', 100, '성명'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<EtcLeavePerson> crud={crud} columnDefs={columnDefs} />
      </div>
      <Emp01_Lookup_PersonModel open={personOpen} onSelect={onPickPersons} onClose={() => setPersonOpen(false)} />
    </div>
  );
};
