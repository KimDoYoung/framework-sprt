/**
 * 대장분류설정 (M05 [대장분류설정]) — AS-IS: myApp/client/vi/ics/Ics41_Lookup_DcrType.java (334줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open L61-87: 모달 600×450 "대장분류설정", 툴바([조회][저장][등록][삭제]) + 셀 편집 그리드(행번호, 체크박스 단일, 분류코드 100·분류명 200 편집, 광고물 100·사용여부 100 체크), 아래 [닫기]
 * 열 때 retrieve() — selectByText(companyId, searchText '%', useYn '%')
 * [저장]·[삭제]는 checkGrid01(actionCode)로 먼저 검사한다: 고친 행의 필수·3자리, 사전확인대장에 쓰인 코드(selectByCompanyId)의 삭제·변경·중복 사용 검사 → checkGrid02 (그리드 안 중복 코드)
 * UX보강(10): 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { message, Modal, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { errorMessage } from '@/api/client';
import { icsApi } from '@/api/ics';
import { IcsDcrType } from '@/types/ics';

const gb = gbFor<IcsDcrType>();

/** buildGrid() L122-132 */
const buildGrid = () => [
  gb.textCenter('dcrTypeCode', 100, '분류코드', { editor: 'text' }),  // L126
  gb.text('dcrTypeName', 200, '분류명', { editor: 'text' }),  // L127
  gb.boolean('adYn', 100, '광고물', { editable: true }),  // L128
  gb.boolean('useYn', 100, '사용여부', { editable: true }),  // L129
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Ics41_Lookup_DcrType: React.FC<Props> = ({ open, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);
  // 불러온 그대로의 행(AS-IS의 originModelMap·record.revert()) / 사전확인대장에 쓰인 분류코드(checkGrid01의 usedCodeSet)
  const originRef = useRef(new Map<number, IcsDcrType>());
  const usedRef = useRef(new Set<string>());
  const crudRef = useRef<ReturnType<typeof useGridCrud<IcsDcrType>> | null>(null);

  /** AS-IS checkGrid01 L134-235 중 고친 행 검사 + checkGrid02 L237-279 중 그리드 안 중복. 메시지를 돌려주면 저장·삭제하지 않는다 */
  const validate = useCallback((changed: IcsDcrType[], all: IcsDcrType[]): string | undefined => {
    for (const m of changed) {
      if (!m.dcrTypeCode || !m.dcrTypeCode.trim()) return '분류코드는 필수입력항목입니다';
      if (m.dcrTypeCode.length > 3) return '분류코드는 3자리 이하로 입력해야 합니다';
      if (!m.dcrTypeName || !m.dcrTypeName.trim()) return '분류명은 필수입력항목입니다';
    }
    const used = usedRef.current;
    const onlyAdOrUse = (m: IcsDcrType, o?: IcsDcrType) => !o || m.dcrTypeCode === o.dcrTypeCode;
    for (const m of changed) {
      const o = originRef.current.get(m.dcrTypeId);
      if (o && o.dcrTypeCode !== m.dcrTypeCode && used.has(o.dcrTypeCode) && !onlyAdOrUse(m, o)) {
        crudRef.current?.replaceRow(m.dcrTypeId, o);
        return `기존 분류코드 '${o.dcrTypeCode}' 는 이미 사용 중이므로 변경할 수 없습니다`;
      }
    }
    for (const m of changed) {
      const o = originRef.current.get(m.dcrTypeId);
      if (used.has(m.dcrTypeCode) && !onlyAdOrUse(m, o)) {
        if (o) crudRef.current?.replaceRow(m.dcrTypeId, o);
        return `분류코드 '${m.dcrTypeCode}' 는 이미 사용 중입니다`;
      }
    }
    const codes = new Set<string>();
    for (const m of all) {
      if (m.dcrTypeCode == null) continue;
      if (codes.has(m.dcrTypeCode)) return `분류코드 '${m.dcrTypeCode}' 가 중복됩니다`;
      codes.add(m.dcrTypeCode);
    }
    return undefined;
  }, []);

  const crud = useGridCrud<IcsDcrType>({
    idField: 'dcrTypeId',
    // retrieve() L316-329: selectByText(companyId, searchText '%', useYn '%')
    search: useCallback(async () => {
      const list = await icsApi.searchDcrTypes();
      originRef.current = new Map(list.map(r => [r.dcrTypeId, r]));
      return list;
    }, []),
    // update() L281-284: GridUpdate → ics.Ics41_DcrType.update
    save: useCallback((rows: IcsDcrType[]) => icsApi.saveDcrTypes(rows), []),
    remove: useCallback((ids: number[]) => icsApi.deleteDcrTypes(ids), []),
    // insert() L308-314: companyId = 로그인 회사(서버), useYn = true
    newRow: useCallback(() => ({ dcrTypeCode: '', dcrTypeName: '', adYn: false, useYn: true }), []),
    firstEditField: 'dcrTypeCode',
    validate,
    // delete() L286-306: "삭제"/"n건을 삭제하시겠습니까?" (폭 300)
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
    reloadAfterSave: true,
  });
  crudRef.current = crud;
  const { retrieve } = crud;

  // [E0] open() L61-87 → settings(), show(), retrieve()
  useEffect(() => {
    if (open) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // checkGrid01의 selectByCompanyId — 저장·삭제를 누를 때마다 쓰인 코드를 다시 읽는다
  const loadUsed = async () => {
    usedRef.current = new Set(await icsApi.getDcrTypeUsedCodes());
  };

  // [E2] updateButton[저장].Select (L96) → checkGrid01("update")
  const update = async () => {
    try {
      await loadUsed();
      await crud.saveRows();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] deleteButton[삭제].Select (L108) → checkGrid01("delete") → checkGrid02 → delete() L286-306
  //   [E6] msgBox.DialogHide [YES] (L289) → ics.Ics41_DcrType.delete — useGridCrud.deleteChecked의 확인 창 [예]
  const remove = async () => {
    try {
      await loadUsed();
      const checked = (crud.gridRef.current?.api.getSelectedRows() ?? []) as IcsDcrType[];
      const msg = validate(crud.getChanged(), crud.rows);
      if (msg) { message.warning(msg); return; }
      for (const m of checked) {
        if (m.dcrTypeCode && usedRef.current.has(m.dcrTypeCode)) {
          message.warning(`분류코드 '${m.dcrTypeCode}' 는 이미 사용 중이므로 삭제할 수 없습니다`);
          return;
        }
      }
      await crud.deleteChecked();
    } catch (err) {
      Modal.error({ title: '삭제 실패', content: errorMessage(err, '삭제 실패') });
    }
  };

  return (
    <LookupModal open={open} title="대장분류설정" width={700} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] closeButton[닫기].Select (L114) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L90) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          <Button type="save" count={crud.changes} onClick={update}>저장</Button>
          {/* [E3] insertButton[등록].Select (L102) → insert() */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          <Button type="delete" onClick={remove}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<IcsDcrType> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </LookupModal>
  );
};
