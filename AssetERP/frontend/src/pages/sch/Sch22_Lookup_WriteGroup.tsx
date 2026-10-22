/**
 * 작성(담당)그룹 창 (K04) — Ics10_Tab_Checklist의 [담당그룹 지정](일괄지정, pick)·[담당그룹관리](관리, edit)에서 연다
 * AS-IS: myApp/client/vi/sch/Sch22_Lookup_WriteGroup.java (295줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L81-110): 모달 1200×400, 왼쪽 = 툴바 50([조회][등록][저장][삭제]) + 작성그룹 그리드(체크박스 단일: 작성그룹명 300 편집 · 확인자 100 사원 조회창 트리거),
 *   오른쪽 700 = 공유 페이지(Sch02_Page_Share), 아래 가운데 [확인][작성그룹없음][닫기]. edit() L67: [확인][작성그룹없음]을 감추고 제목 "그룹 관리", open() L73: 제목 "그룹 일괄지정"
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { SelectionChangedEvent } from 'ag-grid-community';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch22WriteGroup } from '@/types/sch';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Sch02_Page_Share } from './Sch02_Page_Share';

const gb = gbFor<Sch22WriteGroup>();
/** 작성그룹 그리드는 체크박스 단일 선택(setChecked SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 상수로 둔다 */
const SELECTION = { mode: 'singleRow', checkboxes: true } as const;

interface Props {
  open: boolean;
  /** 'pick' = open(callback) 그룹 일괄지정, 'edit' = edit() 그룹 관리 */
  mode: 'pick' | 'edit';
  /** [확인]=고른 그룹, [작성그룹없음]=null (callback.execute) */
  onResult?: (group: Sch22WriteGroup | null) => void;
  onClose: () => void;
}

export const Sch22_Lookup_WriteGroup: React.FC<Props> = ({ open, mode, onResult, onClose }) => {
  /** 공유 페이지에 보여 줄 작성그룹 */
  const [shareGroupId, setShareGroupId] = useState<number | null>(null);
  /** 확인자를 고르는 중인 행 */
  const [empTarget, setEmpTarget] = useState<Sch22WriteGroup | null>(null);

  const crud = useGridCrud<Sch22WriteGroup>({
    idField: 'writeGroupId',
    // retrieve() L214-218: sch.Sch22_WriteGroup.selectByCompanyId(companyId)
    search: useCallback(() => schApi.searchWriteGroups(), []),
    // update() L220-223: GridUpdate → sch.Sch22_WriteGroup.update
    save: useCallback((rows: Sch22WriteGroup[]) => schApi.saveWriteGroups(rows), []),
    remove: useCallback(async (ids: number[]) => { for (const id of ids) await schApi.deleteWriteGroup(id); setShareGroupId(null); }, []),
    // insertRow() L225-230: 회사 = 로그인 회사(서버가 채운다)
    newRow: () => ({ writeGroupName: '' }),
    firstEditField: 'writeGroupName',
    deleteConfirm: false,
  });

  // [E0] 화면 열림 (생성자 L81-110) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setShareGroupId(null);
    crud.gridRef.current?.api?.deselectAll();
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid() L173-204
  const columnDefs = useMemo(() => [
    gb.text('writeGroupName', 300, '작성그룹명', { editor: 'text' }),  // L200
    // L201 확인자: LookupTriggerField(읽기 전용) — 돋보기를 누르면 Emp00_Lookup_SelectSingle.openNull(오늘, true, …)
    gb.text('confirmerName', 100, '확인자', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: Sch22WriteGroup; value?: string }) => (
        <>
          <SearchOutlined style={{ cursor: 'pointer', marginRight: 4 }} onClick={e => { e.stopPropagation(); if (p.data) setEmpTarget(p.data); }} />
          {p.value}
        </>
      ),
    }),
  ], []);

  // [E9] lookupEmp.TriggerClick (L177) → 인라인 L177-196: 고른 사원이면 확인자 id·이름을 바꾸고, [선택안함]이면 둘 다 비운다
  const onEmpResult = (row: TransInfo | null) => {
    if (empTarget) {
      crud.updateRow(empTarget.writeGroupId, row ? { confirmerId: row.personId, confirmerName: row.korNm } : { confirmerId: null, confirmerName: null });
    }
    setEmpTarget(null);
  };

  // [E5] grid.SelectionChanged (L138) → retrievePage() L206-212: 고른 행이 있으면 그 그룹의 공유를 읽는다
  const retrievePage = (e: SelectionChangedEvent<Sch22WriteGroup>) => {
    const sel = e.api.getSelectedRows();
    if (sel.length > 0) setShareGroupId(sel[0].writeGroupId > 0 ? sel[0].writeGroupId : null);
  };

  // [E4] deleteButton[삭제].Select (L132) → deleteCheck() L232-269: 선택 없으면 "삭제할 정보를 먼저 선택해주세요" → 확인 "확인"/"선택한 정보를 삭제하시겠습니까?"(폭 300)
  //   → [E10] msgBox.DialogHide [YES] (L240): sch.Sch22_WriteGroup.checkByWriteGroupId — 쓰는 중이면 "사용중인 작성자그룹으로 삭제가 불가능합니다" → delete() L271-290
  const deleteCheck = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제할 정보를 먼저 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          const first = selected[0];
          if (first.writeGroupId > 0 && (await schApi.isWriteGroupInUse(first.writeGroupId))) {
            message.warning('사용중인 작성자그룹으로 삭제가 불가능합니다');
            return;
          }
          await crud.deleteChecked();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E6] confirmButton[확인].Select (L144) → 고른 그룹이 있으면 callback.execute(그룹); hide(), 없으면 "좌측 그룹을 선택해주세요"
  const confirm = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('좌측 그룹을 선택해주세요');
      return;
    }
    if (selected[0].writeGroupId <= 0) {
      message.warning('저장 후 선택해주세요.');  // 저장 안 한 새 행은 아직 id가 없다(AS-IS는 임시 id를 그대로 넘김)
      return;
    }
    onResult?.(selected[0]);
    onClose();
  };

  // [E7] nullButton[작성그룹없음].Select (L156) → callback != null이면 callback.execute(null); hide()
  const pickNone = () => {
    onResult?.(null);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title={mode === 'pick' ? '그룹 일괄지정' : '그룹 관리'}
      width={1250}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {mode === 'pick' && <Button type="save" onClick={confirm}>확인</Button>}
          {mode === 'pick' && <Button type="cancel" onClick={pickNone} style={{ marginLeft: 8 }}>작성그룹없음</Button>}
          {/* [E8] closeButton[닫기].Select (L165) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', height: 400, gap: 0 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            {/* [E1] retrieveButton[조회].Select (L114) → retrieve() */}
            <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
            {/* [E2] insertButton[등록].Select (L120) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E3] updateButton[저장].Select (L126) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<Sch22WriteGroup> crud={crud} columnDefs={columnDefs} rowSelection={SELECTION} onSelectionChanged={retrievePage} />
          </div>
        </div>
        <div style={{ width: 700, flex: 'none', border: '1px solid #d9d9d9', marginLeft: -1, boxSizing: 'border-box' }}>
          <Sch02_Page_Share writeGroupId={shareGroupId} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle
        open={empTarget != null}
        separateAddTitle
        noneLabel="선택안함"
        transDate={dayjs().format('YYYY-MM-DD')}
        onResult={onEmpResult}
        onClose={() => setEmpTarget(null)}
      />
    </LookupModal>
  );
};
