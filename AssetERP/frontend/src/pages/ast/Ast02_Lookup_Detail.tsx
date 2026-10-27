/**
 * 기본 항목 조회/관리 모달 (R09) — Ast02_Lookup_Detail
 * AS-IS: myApp/client/vi/ast/Ast02_Lookup_Detail.java (232줄)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Modal } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { AstDetail, AstItemDetail } from '@/types/ast';

interface Ast02LookupDetailProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selected: AstItemDetail[]) => void;
}

const gb = gbFor<AstItemDetail>();

export const Ast02_Lookup_Detail: React.FC<Ast02LookupDetailProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstItemDetail[]>([]);
  const [selectedRows, setSelectedRows] = useState<AstItemDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // [E4] retrieveButton[조회].Select (L119) & [E1] searchText.KeyPress [Enter] (L86) → retrieve()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const data = await astApi.searchItemDetailTemplates(searchText);
      setRows(data);
      setSelectedRows([]);
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  // [E0] 화면 열림 (생성자 L67-83) → show()
  useEffect(() => {
    if (open) {
      setSearchText('');
      retrieve();
    } else {
      setRows([]);
      setSelectedRows([]);
    }
  }, [open, retrieve]);

  // [E3] cancleButton[닫기].Select (L112) → hide()
  const hide = () => {
    onClose();
  };

  // [E2] confirmButton[확인].Select (L94) → callback(detailList), hide()
  const confirm = () => {
    if (selectedRows.length === 0) {
      message.warning('항목을 선택해주세요.');
      return;
    }
    onSelect(selectedRows);
    hide();
  };

  // [E6] insertButton[행 추가].Select (L131) → insertRow()
  const insertRow = () => {
    const newRow: AstItemDetail = {
      detailId: -Date.now(),
      seq: rows.length + 1,
      title: '',
      tag: '',
      useYn: 'true',
    };
    setRows((prev) => [...prev, newRow]);
  };

  // [E7] deleteButton[행 삭제].Select (L137) → deleteRow()
  const deleteRow = () => {
    if (selectedRows.length === 0) {
      message.warning('삭제할 항목을 선택해주세요.');
      return;
    }
    const selectedIds = new Set(selectedRows.map((r) => r.detailId));
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.detailId)));
    setSelectedRows([]);
  };

  // [E5] updateButton[저장].Select (L125) → update()
  const update = async () => {
    try {
      const payload: AstDetail[] = rows.map((r) => ({
        detailId: r.detailId > 0 ? r.detailId : 0,
        seq: r.seq,
        title: r.title,
        tag: r.tag,
        useYn: r.useYn,
      }));
      await astApi.saveDetails(payload);
      message.success('저장되었습니다.');
      retrieve();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // buildCfInfoGrid 컬럼 (L157-159)
  const columns: ColDef<AstItemDetail>[] = useMemo(
    () => [
      gb.long('seq', 60, '조회순번', { editable: true }),
      gb.text('title', 200, '항목', { editable: true }),
      gb.text('tag', 280, '연관태그', { editable: true }),
    ],
    []
  );

  return (
    <Modal
      open={open}
      title="기본 항목 관리"
      onCancel={hide}
      width={680}
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
        {/* [E1] searchText.KeyPress [Enter] */}
        <Input
          placeholder="연관태그를 입력해주세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={retrieve}
          style={{ width: 220 }}
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

      <div style={{ height: 350 }}>
        <MultiGrid<AstItemDetail>
          columnDefs={columns}
          rowData={rows}
          loading={loading}
          onCheckedChange={(selected: AstItemDetail[]) => setSelectedRows(selected)}
          getRowId={(params) => String(params.data.detailId)}
        />
      </div>
    </Modal>
  );
};
