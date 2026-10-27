/**
 * 기본 항목 조회/관리 모달 (R09) — Ast02_Lookup_Detail
 * AS-IS: myApp/client/vi/ast/Ast02_Lookup_Detail.java (232줄)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { AstDetail, AstItemDetail } from '@/types/ast';

interface Ast02LookupDetailProps {
  open: boolean;
  onClose: () => void;
  onSelect: (items: AstItemDetail[]) => void;
}

const gb = gbFor<AstItemDetail>();

export const Ast02_Lookup_Detail: React.FC<Ast02LookupDetailProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<AstItemDetail[]>([]);
  const deleteList = useRef<number[]>([]);

  const crud = useGridCrud<AstItemDetail>({
    idField: 'detailId',
    search: useCallback(() => astApi.searchItemDetailTemplates(searchText), [searchText]),
    save: useCallback(async (changed: AstItemDetail[]) => {
      const payload: AstDetail[] = changed.map((r) => ({
        detailId: r.detailId > 0 ? r.detailId : 0,
        seq: r.seq,
        title: r.title,
        tag: r.tag ?? '',
        useYn: r.useYn ?? 'true',
      }));
      const saved = await astApi.saveItemDetailTemplates(payload);
      return saved.map((s) => ({
        detailId: s.detailId,
        seq: s.seq ?? 0,
        title: s.title ?? '',
        tag: s.tag,
        useYn: s.useYn ?? 'true',
        defaultYn: 'true',
      }));
    }, []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(
      () => ({
        astClassTreeId: 0,
        defaultYn: 'true',
        useYn: 'true',
      }),
      []
    ),
    firstEditField: 'seq',
    reloadAfterSave: true,
  });

  // [E4] retrieveButton[조회].Select (L119) & [E1] searchText.KeyPress [Enter] (L86) → retrieve()
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    setSelectedRows([]);
    await crud.retrieve();
  }, [crud]);

  // [E0] 화면 열림 (생성자 L67-83) → show()
  useEffect(() => {
    if (open) {
      setSearchText('');
      deleteList.current = [];
      setSelectedRows([]);
      crud.retrieve();
    } else {
      crud.clear();
      deleteList.current = [];
      setSelectedRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] cancleButton[닫기].Select (L112) → hide()
  const hide = () => {
    onClose();
  };

  // [E2] confirmButton[확인].Select (L94) → callback(detailList), hide()
  const confirm = () => {
    if (crud.hasChanges() || deleteList.current.length > 0) {
      message.warning('저장되지 않은 데이터가 존재합니다.');
      return;
    }
    if (selectedRows.length === 0) {
      message.warning('항목을 선택해주세요');
      return;
    }
    onSelect(selectedRows);
    hide();
  };

  // [E6] insertButton[행 추가].Select (L131) → insertRow()
  const insertRow = () => {
    crud.addRow();
  };

  // [E7] deleteButton[행 삭제].Select (L137) → deleteRow()
  const deleteRow = () => {
    if (selectedRows.length === 0) return;
    for (const model of selectedRows) {
      if (model.detailId > 0) {
        deleteList.current.push(model.detailId);
      }
    }
    crud.removeRows(selectedRows.map((r) => r.detailId));
    setSelectedRows([]);
  };

  // [E5] updateButton[저장].Select (L125) → update()
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    for (const chkModel of changed) {
      if (chkModel.seq == null) {
        message.warning('조회순번은 필수입력 항목입니다.');
        return;
      }
      if (chkModel.title == null || chkModel.title === '') {
        message.warning('항목은 필수입력 항목입니다.');
        return;
      }
    }
    try {
      if (changed.length > 0) {
        await crud.saveRows();
      }
      if (deleteList.current.length > 0) {
        await astApi.deleteItemDetailTemplates(deleteList.current);
        deleteList.current = [];
        await crud.retrieve();
      }
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // buildCfInfoGrid 컬럼 (L153-162)
  const columns: ColDef<AstItemDetail>[] = useMemo(
    () => [
      gb.long('seq', 60, '조회순번', { editor: 'number' }),
      gb.text('title', 200, '항목', { editor: 'text' }),
      gb.text('tag', 280, '연관태그', { editor: 'text' }),
    ],
    []
  );

  return (
    <LookupModal
      open={open}
      title="항목추가"
      onCancel={hide}
      width={730}
      footer={[
        // [E2] confirmButton[확인].Select
        <Button key="confirm" type="save" onClick={confirm}>
          확인
        </Button>,
        // [E3] cancleButton[닫기].Select
        <Button key="close" type="close" onClick={hide}>
          닫기
        </Button>,
      ]}
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ fontWeight: 500 }}>검색</span>
        {/* [E1] searchText.KeyPress [Enter] */}
        <Input
          placeholder="연관태그를 입력해주세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={retrieve}
          allowClear
          style={{ width: 200 }}
        />
        {/* [E4] retrieveButton[조회].Select */}
        <Button type="search" onClick={retrieve}>
          조회
        </Button>
        {/* [E5] updateButton[저장].Select */}
        <Button type="save" onClick={update}>
          저장
        </Button>
        {/* [E6] insertButton[행 추가].Select */}
        <Button type="addRow" onClick={insertRow}>
          행 추가
        </Button>
        {/* [E7] deleteButton[행 삭제].Select */}
        <Button type="removeRow" onClick={deleteRow}>
          행 삭제
        </Button>
      </div>

      <div style={{ height: 420 }}>
        <CellEditGrid<AstItemDetail>
          crud={crud}
          columnDefs={columns}
          onSelectionChanged={(e) => setSelectedRows(e.api.getSelectedRows())}
        />
      </div>
    </LookupModal>
  );
};
