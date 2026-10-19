/**
 * 문서권한설정 조회창 (A15-4) — Sys50_TabPage_SpecificMenu의 '문서권한' 칸에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys52_Lookup_SpecificMenuLink.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(companyId, specificMenuModel) L53-80: 제목 "문서권한설정", 900×350, 모달. 툴바 조회·등록·저장·삭제 + 체크(단일) 셀 편집 그리드
 * UX보강(10) B12-2: 저장 = 저장(n)(UX-03). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { sysApi } from '@/api/sys';
import { Code, SpecificMenu, SpecificMenuLink } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

type Row = SpecificMenuLink;
const gb = gbFor<Row>();

/** AS-IS buildGrid() L115-131: linkCodeComboBox.Collapse → addChange(linkCode, getCode()) + addChange(linkName, getName()) [E6] */
const buildGrid = (links: Code[]) => [
  gb.text('linkNm', 300, 'Link명', {
    editor: 'select',
    values: links.map(c => c.name),
    valueSetter: p => {
      p.data.linkNm = p.newValue;
      p.data.linkCd = links.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),  // L126
  gb.text('note', 480, '비고', { editor: 'text' }),  // L127
];

interface Props {
  /** open(companyId, specificMenuModel) — 값이 있으면 열린다 */
  companyId?: number;
  specificMenu?: SpecificMenu;
  onClose: () => void;
}

export const Sys52_Lookup_SpecificMenuLink: React.FC<Props> = ({ companyId, specificMenu, onClose }) => {
  const [links, setLinks] = useState<Code[]>([]);
  const open = !!companyId && !!specificMenu;
  const specificWorkCd = specificMenu?.specificWorkCd ?? '';

  const crud = useGridCrud<Row>({
    idField: 'specificMenuLinkId',
    // retrieve() L133-143: specificWorkCode, companyId → sys.Sys52_SpecificMenuLink.selectBySpecificWorkCode
    search: useCallback(() => (open ? sysApi.searchSpecificMenuLinks(companyId!, specificWorkCd) : Promise.resolve([])), [open, companyId, specificWorkCd]),
    // update() L176-179: GridUpdate → sys.Sys52_SpecificMenuLink.update
    save: useCallback((rows: Row[]) => sysApi.updateSpecificMenuLinks(companyId!, rows), [companyId]),
    remove: useCallback((ids: number[]) => sysApi.deleteSpecificMenuLinks(companyId!, ids), [companyId]),
    // insertRow() L145-151: companyId, specificWorkCode를 모델에 넣는다(아무것도 안 고치고 저장하면 저장 안 됨)
    newRow: useCallback(() => ({ companyId, specificWorkCd }), [companyId, specificWorkCd]),
    firstEditField: 'linkNm',
    // deleteRow() L153-174 → [E7] msgBox.DialogHide [YES] (L156) → sys.Sys52_SpecificMenuLink.delete (useGridCrud 안)
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
  });

  const columnDefs = useMemo(() => buildGrid(links), [links]);

  useEffect(() => { sysApi.searchCodes('LinkCode').then(setLinks).catch(() => setLinks([])); }, []);

  // open() L53-80 마지막 줄: this.retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) crud.retrieve(); else crud.clear(); }, [open, companyId, specificWorkCd]);

  return (
    <LookupModal
      open={open}
      title="문서권한설정"
      width={900}
      maskClosable={false}
      closable={false}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select (L107) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 230, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L83) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L89) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E3] updateButton[저장].Select (L95) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L101) → deleteRow() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* setChecked(SINGLE): 체크박스 단일 선택 */}
          <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
        </div>
      </div>
    </LookupModal>
  );
};
