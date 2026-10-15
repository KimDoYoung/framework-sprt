/**
 * 겸직발령 탭 (C01-6) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp04_TabPage_AddTitle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 그리드: 체크박스 단일(setChecked SINGLE), 편집기 없음, 맨 뒤 [수정] 셀 → Emp04_Edit_AddTitle
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message, Modal, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ColDef } from 'ag-grid-community';
import { empAddTitleApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { AddTitle } from '@/types/emp';
import { Button } from '@/components/button';
import { gbFor, SingleGrid } from '@/components/grid';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';
import { AddTitleTarget, Emp04_Edit_AddTitle } from './Emp04_Edit_AddTitle';

const gb = gbFor<AddTitle>();

export const Emp04_TabPage_AddTitle: React.FC<TransInfoTabProps> = ({ row }) => {
  const personId = row?.personId;
  const [rows, setRows] = useState<AddTitle[]>([]);
  const [selected, setSelected] = useState<AddTitle>();
  const [editTarget, setEditTarget] = useState<AddTitleTarget>();

  // [E1] searchBarBuilder[조회].Retrieve (L55) → retrieve() L104-113
  const retrieve = useCallback(async () => {
    if (!personId) {
      message.warning('사원을 먼저 선택해주세요');
      return;
    }
    try {
      setRows(await empAddTitleApi.getAddTitles(personId));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [personId]);

  // [E0] 화면 열림 (생성자 L49-61) — 사원이 바뀌면 다시 조회 (다른 탭과 같음)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (personId) void retrieve(); else setRows([]); }, [personId]);

  // [E2] searchBarBuilder[등록].Insert (L56) → insertRow() L121-138: 팝업 insert(personId) → 저장 후 다시 조회
  const insertRow = () => {
    if (!personId) return message.warning('사원을 먼저 선택해주세요');
    setEditTarget({ personId });
  };

  // [E4] msgBox.DialogHide [YES] (L144) → delete() L161-179: deleteList(결재 확인 + 겸직사원 삭제) → delete(emp04)
  const remove = async (target: AddTitle) => {
    try {
      await empAddTitleApi.deleteAddTitle(target.addTitleId);
      setRows(prev => prev.filter(r => r.addTitleId !== target.addTitleId));
      setSelected(undefined);
    } catch (err) {
      // 결재에 쓰인 겸직: "해당 겸직은 삭제할 수 없습니다. 관리자에게 문의해주세요"
      message.warning(errorMessage(err, '해당 겸직은 삭제할 수 없습니다. 관리자에게 문의해주세요'));
    }
  };

  // [E3] searchBarBuilder[삭제].Delete (L57) → deleteRow() L141-159
  const deleteRow = () => {
    // 원본은 선택 없이도 확인창을 띄우고 delete()에서 null 모델로 서버 오류 — 선택이 없으면 아무것도 하지 않는다
    const target = selected;
    Modal.confirm({
      title: '삭제',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: () => { if (target) void remove(target); },
    });
  };

  // buildGrid() L64-80: [수정] ImageCell → 팝업 edit(personId, 행) → 저장 후 다시 조회
  const columnDefs = useMemo<ColDef<AddTitle>[]>(() => [
    gb.date('startDate', 100, '겸직시작일'),
    gb.date('closeDate', 100, '종료일'),
    gb.text('orgNm', 200, '조직'),
    gb.text('titleNm', 100, '직책'),
    gb.text('transReason', 600, '겸직사유'),
    {
      colId: 'actionCell',
      headerName: '수정',
      width: 60,
      sortable: false,
      // ImageCell("Edit") — 아이콘 버튼. 클릭이 행 선택으로 번지지 않게 막는다
      cellRenderer: (p: { data?: AddTitle }) => (
        <AntButton size="small" type="text" icon={<EditOutlined />} aria-label="수정"
          onClick={e => { e.stopPropagation(); if (personId && p.data) setEditTarget({ personId, row: p.data }); }} />
      ),
    },
  ], [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px', boxSizing: 'border-box' }}>
      <Space>
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="delete" onClick={deleteRow}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AddTitle>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.addTitleId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          onSelect={setSelected}
        />
      </div>
      <Emp04_Edit_AddTitle target={editTarget} onClose={() => setEditTarget(undefined)} onSaved={retrieve} />
    </div>
  );
};
