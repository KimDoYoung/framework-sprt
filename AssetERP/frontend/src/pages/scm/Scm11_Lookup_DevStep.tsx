/**
 * 진행상태 조회창 (EE16) — Scm10_Grid_Dev의 진행상태 [보기] 아이콘이 연다 (보기 `view(devId)`는 EE17 Scm11_Edit_DevStep이 쓴다)
 * AS-IS: myApp/client/vi/scm/Scm11_Lookup_DevStep.java (327줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 모달 1290×400 "진행상태": 위 [등록][저장] + 새로고침 아이콘 / 그리드(체크 단일) / [닫기]
 *   edit(devId) L70-75: 읽기 전용 단계·담당자(열 2·3) 숨김 · view(devId) L77-87: 버튼 줄과 편집 열(4·5)·비고·▲·▼(10~12) 숨김, 폭 1140
 *   열 buildApprStepGrid() L144-218: 단계(읽기) 100 · 담당자(읽기) 100 · 단계(콤보 DevStepCode) 100 · 담당자(조회창) 100 · 결과 100 · 확인일시 200 · 결과상세 400 · [보기] 30 · 비고 200 · ▲ 30 · ▼ 30 · 삭제 30
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { scmApi } from '@/api/scm';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { DevStep } from '@/types/scm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { LookupModal } from '@/components/lookup/LookupModal';
import { arrowCell, MODAL_HEADER_STYLE } from './scmGridCells';
import { Scm11_Lookup_Result } from './Scm11_Lookup_Result';

const gb = gbFor<DevStep>();
/** setChecked(SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
let tempId = 0;

interface Props {
  open: boolean;
  devId: number | null;
  /** edit(devId) / view(devId) */
  mode?: 'edit' | 'view';
  onClose: () => void;
}

export const Scm11_Lookup_DevStep: React.FC<Props> = ({ open, devId, mode = 'edit', onClose }) => {
  const view = mode === 'view';
  const gridRef = useRef<AgGridReact<DevStep>>(null);
  const [rows, setRows] = useState<DevStep[]>([]);
  /** 편집기(콤보·조회창)로 고친 줄 — AS-IS grid.getStore().getModifiedRecords() */
  const [modified, setModified] = useState<Set<number>>(new Set());
  const [deleteList, setDeleteList] = useState<DevStep[]>([]);
  const [names, setNames] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [empTarget, setEmpTarget] = useState<DevStep | null>(null);
  const [resultTarget, setResultTarget] = useState<DevStep | null>(null);

  // retrieve() L259-270: scm.Scm11_DevStep.selectByDevId(devId)
  const retrieve = useCallback(async () => {
    if (devId == null) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await scmApi.searchDevSteps(devId));
      setModified(new Set());
      setDeleteList([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [devId]);

  // [E0] 화면 열림 (생성자 L89-121) → settings(), show() + edit()/view() 끝에서 retrieve()
  useEffect(() => {
    if (!open) return;
    void retrieve();
    sysApi.searchCodes('DevStepCode').then(list => setNames(list.map(c => ({ code: c.code, name: c.name })))).catch(() => setNames([]));
  }, [open, retrieve]);

  // getSeq() L251-257: 순서 번호 = (줄 위치 + 1) × 10
  const withSeq = (list: DevStep[]) => list.map((r, i) => ({ ...r, devStepSeq: String((i + 1) * 10) }));

  // changeRow() L220-249: up / down / delete(결과가 이미 있는 줄은 "처리완료된 담당자는 수정이 불가능합니다")
  const changeRow = (action: 'up' | 'down' | 'delete', row: DevStep) => {
    const i = rows.findIndex(r => r.devStepId === row.devStepId);
    if (i < 0) return;
    const next = [...rows];
    if (action === 'up' && i > 0) [next[i - 1], next[i]] = [next[i], next[i - 1]];
    else if (action === 'down' && i < next.length - 1) [next[i + 1], next[i]] = [next[i], next[i + 1]];
    else if (action === 'delete') {
      if (row.resultCd != null) { message.warning('처리완료된 담당자는 수정이 불가능합니다'); return; }
      setDeleteList(prev => [...prev, row]);
      next.splice(i, 1);
    }
    setRows(withSeq(next));
  };

  // [E2] insertButton[등록].Select (L124) → insertRow() L310-322: 순서 = (개수 + 1) × 10, devId. 03 원칙 17: 맨 아래에 넣고 보이게 스크롤
  const insertRow = () => {
    const row: DevStep = { devStepId: --tempId, devId, devStepSeq: String((rows.length + 1) * 10) };
    setRows(prev => [...prev, row]);
    setTimeout(() => {
      const node = gridRef.current?.api?.getRowNode(String(row.devStepId));
      if (!node) return;
      node.setSelected(true);
      gridRef.current?.api?.ensureNodeVisible(node);
    }, 0);
  };

  // [E3] updateButton[저장].Select (L130) → update() L272-308: 고친 줄 중 결과가 있으면 중단, 아니면 삭제 목록을 지우고 전체 줄을 inUpdateProgress → retrieve()
  const update = async () => {
    if (devId == null) return;
    if (rows.some(r => modified.has(r.devStepId) && r.resultCd != null)) {
      message.warning('처리완료된 담당자는 수정이 불가능합니다');
      return;
    }
    try {
      await scmApi.saveDevSteps(
        devId,
        deleteList.filter(r => r.devStepId > 0).map(r => r.devStepId),
        rows.map(r => ({ devStepId: r.devStepId, devStepSeq: r.devStepSeq ?? null, devStepCd: r.devStepCd ?? null, personId: r.personId ?? null })),
      );
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const markModified = (id: number) => setModified(prev => new Set(prev).add(id));

  const columnDefs = useMemo(() => {
    const cols: ColDef<DevStep>[] = [];
    if (!view) {
      // edit(devId) L72-73: 읽기 전용 단계·담당자(열 2·3) 숨김
    } else {
      cols.push(gb.textCenter('devStepNm', 100, '단계'), gb.textCenter('personNm', 100, '담당자'));
    }
    if (!view) {
      // [E5] devStepComboBox[DevStepCode].Collapse (L149-158): 선택한 이름·코드를 그 행에 넣는다
      cols.push(gb.textCenter('devStepNm', 100, '단계', {
        editor: 'select', values: names.map(n => n.name),
        onCellValueChanged: p => {
          const code = names.find(n => n.name === p.newValue)?.code ?? null;
          markModified(p.data.devStepId);
          setRows(prev => prev.map(r => (r.devStepId === p.data.devStepId ? { ...r, devStepNm: p.newValue ?? null, devStepCd: code } : r)));
        },
      }));
      // [E6] lookupEmpTransInfo.TriggerClick (L161-176): Emp00_Lookup_SelectSingle
      cols.push(gb.textCenter('personNm', 100, '담당자', {
        cellStyle: { color: '#1677ff', textAlign: 'center' },
        cellRenderer: (p: { data?: DevStep; value?: string }) => (
          <>
            <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setEmpTarget(p.data); }} />
            {p.value}
          </>
        ),
      }));
    }
    cols.push(
      gb.textCenter('resultNm', 100, '결과'),
      gb.textCenter('resultDateStr', 200, '확인일시'),
      gb.text('arrangeResult', 400, '결과상세'),
      iconCell<DevStep>('view', 'viewCell', 30, ' ', row => setResultTarget(row)),
    );
    if (!view) {
      cols.push(
        gb.text('note', 200, '비고'),
        arrowCell<DevStep>('up', 'upCell', row => changeRow('up', row)),
        arrowCell<DevStep>('down', 'downCell', row => changeRow('down', row)),
      );
    }
    cols.push(iconCell<DevStep>('delete', 'deleteCell', 30, '삭제', row => changeRow('delete', row)));
    return cols;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, names, rows]);

  return (
    <>
      <LookupModal
        open={open}
        title="진행상태"
        width={view ? 1160 : 1310}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        focusFirst={false}
        styles={{ header: MODAL_HEADER_STYLE }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E4] closeButton[닫기].Select (L136) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!view && (
            <Space>
              <Button type="register" onClick={insertRow}>등록</Button>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E1] anchor.MouseDown (L100) → retrieve() */}
              <AntButton type="text" icon={<ReloadOutlined />} onClick={() => void retrieve()} />
            </Space>
          )}
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<DevStep>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.devStepId)}
              loading={loading}
              rowSelection={SINGLE_CHECK}
            />
          </div>
        </div>
      </LookupModal>
      {/* 결과상세 [보기] (L177-183) → Scm11_Lookup_Result.open(devStepModel) */}
      <Scm11_Lookup_Result open={resultTarget != null} devStep={resultTarget} onClose={() => setResultTarget(null)} />
      {/* lookupEmpTransInfo.TriggerClick → Emp00_Lookup_SelectSingle.open(new Date(), callback) */}
      <Emp00_Lookup_SelectSingle
        open={empTarget != null}
        transDate={dayjs().format('YYYY-MM-DD')}
        noneLabel={null}
        onResult={emp => {
          const target = empTarget;
          setEmpTarget(null);
          if (!emp || !target) return;
          markModified(target.devStepId);
          setRows(prev => prev.map(r => (r.devStepId === target.devStepId ? { ...r, personId: emp.personId, personNm: emp.korNm ?? null } : r)));
        }}
        onClose={() => setEmpTarget(null)}
      />
    </>
  );
};
