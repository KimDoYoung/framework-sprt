/**
 * 사원권한설정 조회창 (A15-4) — Sys50_TabPage_SpecificMenu의 '사원권한' 칸에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys51_Lookup_SpecificMenuPerson.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(companyId, specificMenuModel) L64-101: 제목 "사원권한설정", 900×350, 모달. 툴바 왼쪽 조회·등록·저장·삭제, 오른쪽 끝 [일괄 권한설정] + 체크(단일) 셀 편집 그리드
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import dayjs from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { SpecificMenu, SpecificMenuPerson } from '@/types/sys';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

type Row = SpecificMenuPerson;
const gb = gbFor<Row>();

/** AS-IS buildGrid() L142-150 */
const buildGrid = () => [
  gb.text('personNm', 300, '사원명'),  // L145 SQL 계산 컬럼(selectBySpecificMenuId: 조직명 + 사원명)
  gb.boolean('useYn', 100, '사용여부', { editable: true }),  // L146
  gb.text('note', 380, '비고', { editor: 'text' }),  // L147
];

interface Props {
  /** open(companyId, specificMenuModel) — 값이 있으면 열린다 */
  companyId?: number;
  specificMenu?: SpecificMenu;
  onClose: () => void;
}

export const Sys51_Lookup_SpecificMenuPerson: React.FC<Props> = ({ companyId, specificMenu, onClose }) => {
  const [empOpen, setEmpOpen] = useState(false);
  const open = !!companyId && !!specificMenu;
  const specificMenuId = specificMenu?.specificMenuId;
  const specificWorkCd = specificMenu?.specificWorkCd ?? '';

  const crud = useGridCrud<Row>({
    idField: 'specificMenuPersonId',
    // retrieve() L152-162: specificWorkCode, specificMenuId → sys.Sys51_SpecificMenuPerson.selectBySpecificMenuId
    search: useCallback(
      () => (open ? sysApi.searchSpecificMenuPersons(companyId!, specificMenuId!, specificWorkCd) : Promise.resolve([])),
      [open, companyId, specificMenuId, specificWorkCd]),
    // update() L215-218: GridUpdate → sys.Sys51_SpecificMenuPerson.update
    save: useCallback((rows: Row[]) => sysApi.updateSpecificMenuPersons(companyId!, specificMenuId!, rows), [companyId, specificMenuId]),
    remove: useCallback((ids: number[]) => sysApi.deleteSpecificMenuPersons(companyId!, specificMenuId!, ids), [companyId, specificMenuId]),
    newRow: useCallback(() => ({}), []),
    // deleteRow() L192-213 → [E7] msgBox.DialogHide [YES] (L195) → sys.Sys51_SpecificMenuPerson.delete (useGridCrud 안)
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
  });

  const columnDefs = useMemo(buildGrid, []);

  // open() L64-101 마지막 줄: this.retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) crud.retrieve(); else crud.clear(); }, [open, companyId, specificMenuId, specificWorkCd]);

  // insertRow() L164-190 콜백: 고른 사원마다 행 추가 + addChange(specificMenuId, personName, personId, useYn=true, specificWorkCode)
  const onEmployees = (list: TransInfo[]) => {
    setEmpOpen(false);
    crud.addRows(list.map(m => ({
      specificMenuId,
      personNm: `${m.orgKorNm ?? ''} ${m.korNm ?? ''}`,
      personId: m.personId,
      useYn: 'true',
      specificWorkCd,
    })), true);
  };

  // updateGroupCheck() L220-244: 저장하지 않은 변경이 있으면 막고, 확인 → [E8] updateGroup() L246-259
  const updateGroupCheck = () => {
    if (crud.hasChanges()) {
      message.warning('저장 후 이용해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '해당 정보를 일괄설정하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.updateSpecificMenuPersonGroup(companyId!, specificMenuId!, specificWorkCd);
          message.success('일괄설정이 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '일괄설정 실패'));
        }
      },
    });
  };

  return (
    <>
      <LookupModal
        open={open}
        title="사원권한설정"
        width={900}
        maskClosable={false}
        closable={false}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E6] closeButton[닫기].Select (L134) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 230, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              {/* [E1] retrieveButton[조회].Select (L104) → retrieve() */}
              <Button type="search" onClick={crud.retrieve}>조회</Button>
              {/* [E2] insertButton[등록].Select (L110) → insertRow() */}
              <Button type="register" onClick={() => setEmpOpen(true)}>등록</Button>
              {/* [E3] updateButton[저장].Select (L116) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E4] deleteButton[삭제].Select (L122) → deleteRow() */}
              <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            </Space>
            {/* [E5] updateGroupButton[일괄 권한설정].Select (L128) → updateGroupCheck() */}
            <Button type="save" onClick={updateGroupCheck}>일괄 권한설정</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* setChecked(SINGLE): 체크박스 단일 선택 */}
            <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
          </div>
        </div>
      </LookupModal>
      {/* insertRow() L164: Emp00_Lookup_SelectMulti.open(companyId, new Date(), callback) */}
      <Emp00_Lookup_SelectMulti open={open && empOpen} companyId={companyId} transDate={dayjs().format('YYYY-MM-DD')}
        onResult={onEmployees} onClose={() => setEmpOpen(false)} />
    </>
  );
};
