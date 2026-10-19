/**
 * 법규 기한 창 (E01-1) — 법규관리의 기한 아이콘(Ics01_Grid_IcsType)·분류 등록 창의 수시알림 [설정](Ics01_Edit_ClassTree·Icr01_Edit_ClassTree)에서 연다.
 * ics·icr 도메인이 쓰는 공통 조회창(IM-02)
 * AS-IS: myApp/client/vi/sch/Sch03_Lookup_Ics.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 makeLayout() L79-157: 모달 900×300 "법규 기한", 위 툴바(기본 기한 콤보 250 "선택하세요" · [선택] · [일회성조건] · [반복주기조건] · [삭제]) + 오른쪽 새로고침 아이콘,
 *   그리드(체크박스 단일: 주기구분 120 · 처리일 정보 450 · 시작일 100 · 종료일 100 · 수정 아이콘 50), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Select, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { ReloadOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch03Deadline, Sch03DeadlineTemplate } from '@/types/sch';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sch03_Lookup_Cycle } from './Sch03_Lookup_Cycle';
import { Sch03_Lookup_Short } from './Sch03_Lookup_Short';

const gb = gbFor<Sch03Deadline>();

interface Props {
  /** open(classTreeId, scheduleCode, callback) L71-77 — 값이 있으면 열린다 */
  classTreeId: number | null;
  /** 스케줄 구분 (호출하는 화면은 모두 "2") */
  scheduleCode: string;
  /** closeButton[닫기]의 callback.execute() — 부른 쪽이 법규·분류 행을 다시 읽는다 */
  onClosed: () => void;
  /** 창의 닫기(X) — callback 없이 닫는다 */
  onClose: () => void;
}

type Target = { kind: 'short' | 'cycle'; deadline: Sch03Deadline | null; scheduleCode: string };

export const Sch03_Lookup_Ics: React.FC<Props> = ({ classTreeId, scheduleCode, onClosed, onClose }) => {
  const [rows, setRows] = useState<Sch03Deadline[]>([]);
  const [templates, setTemplates] = useState<Sch03DeadlineTemplate[]>([]);
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [target, setTarget] = useState<Target | null>(null);
  const gridRef = useRef<AgGridReact<Sch03Deadline>>(null);

  // retrieve() L196-200: 서비스 sch.Sch03_Deadline.selectByClassTreeId(classTreeId) — 새로고침 아이콘(E1)도 같다
  const retrieve = useCallback(async () => {
    if (classTreeId == null) return;
    try {
      setRows(await schApi.searchDeadlines(classTreeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId]);

  // [E0] 화면 열림 (생성자 L67-69, open() L71-77) → makeLayout(), retrieve(). 기본 기한 콤보는 CommonComboBoxField("sys.Sys00_Common.selectDeadLine")
  useEffect(() => {
    if (classTreeId == null) return;
    setRows([]);
    setTemplateId(undefined);
    void retrieve();
    schApi.searchDeadlineTemplates().then(setTemplates).catch(err => message.error(errorMessage(err, '조회 실패')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId]);

  // [E2] loadButton[선택].Select (L98) → load() L202-220: 콤보를 안 골랐으면 안내, 골랐으면 서비스 sch.Sch03_Deadline.updateModel(기본 기한을 이 법규에 복사, 스케줄 구분 "2") → retrieve()
  const load = async () => {
    if (templateId == null || classTreeId == null) {
      message.warning('상단 메뉴바의 좌측구분값을 선택해주세요');
      return;
    }
    try {
      await schApi.copyDeadline(Number(templateId), classTreeId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] deleteButton[삭제].Select (L104) → deleteRow() L242-257: "선택한 정보를 삭제하시겠습니까?" → [E7] messageBox.DialogHide [YES] (L245) → 서비스 sch.Sch03_Deadline.delete
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '삭제',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        if (checked.length === 0) return;
        try {
          await schApi.deleteDeadlines(checked.map(r => r.deadlineId));
          setRows(prev => prev.filter(r => !checked.some(c => c.deadlineId === r.deadlineId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L159-194: 수정 아이콘(editCell) → 주기 "99"면 Sch03_Lookup_Short, 아니면 Sch03_Lookup_Cycle (수정 — 스케줄 구분은 이 창에 열린 값)
  const columnDefs = useMemo(() => [
    gb.textCenter('cycleName', 120, '주기구분'),  // L187
    gb.text('deadlineFullName', 450, '처리일 정보'),  // L188
    gb.date('startDate', 100, '시작일'),  // L189
    gb.date('closeDate', 100, '종료일'),  // L190
    iconCell<Sch03Deadline>('edit', 'actionCell', 50, '수정', row =>  // L191
      setTarget({ kind: row.cycleCode === '99' ? 'short' : 'cycle', deadline: row, scheduleCode })),
  ], [scheduleCode]);

  if (classTreeId == null) return null;
  return (
    <>
      <LookupModal
        open
        title="법규 기한"
        width={940}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E6] closeButton[닫기].Select (L123) → callback.execute(); hide() */}
            <Button type="close" onClick={() => { onClosed(); onClose(); }}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 190 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Space wrap style={{ flex: 1 }}>
              <Select style={{ width: 250 }} placeholder="선택하세요" value={templateId} onChange={setTemplateId}
                options={templates.map(t => ({ value: t.code, label: t.name }))} />
              <Button type="select" onClick={load}>선택</Button>
              {/* [E4] shortButton[일회성조건].Select (L110) → shortInsert() L222-230: Sch03_Lookup_Short(classTreeId, "3") → retrieve() */}
              <Button type="addRow" onClick={() => setTarget({ kind: 'short', deadline: null, scheduleCode: '3' })}>일회성조건</Button>
              {/* [E5] cycleButton[반복주기조건].Select (L116) → cycleInsert() L232-240: Sch03_Lookup_Cycle(classTreeId, "2") → retrieve() */}
              <Button type="addRow" onClick={() => setTarget({ kind: 'cycle', deadline: null, scheduleCode: '2' })}>반복주기조건</Button>
              <Button type="delete" onClick={deleteRow}>삭제</Button>
            </Space>
            {/* [E1] anchor.MouseDown (L88) → retrieve() */}
            <ReloadOutlined style={{ cursor: 'pointer', marginRight: 5 }} onMouseDown={() => void retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<Sch03Deadline>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.deadlineId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            />
          </div>
        </div>
      </LookupModal>
      {target?.kind === 'short' && (
        <Sch03_Lookup_Short deadline={target.deadline} classTreeId={classTreeId} scheduleCode={target.scheduleCode}
          onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
      )}
      {target?.kind === 'cycle' && (
        <Sch03_Lookup_Cycle deadline={target.deadline} classTreeId={classTreeId} scheduleCode={target.scheduleCode}
          onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
      )}
    </>
  );
};
