/**
 * 진행단계 기본설정 조회창 (EE16) — Scm01_Edit_DevMng의 [진행단계 기본설정]이 연다
 * AS-IS: myApp/client/vi/scm/Scm12_Lookup_DevStepRule.java (229줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 모달 320×500 "진행단계 설정": 위 [등록] / 그리드(체크 단일: 구분 150(콤보 DevStepCode) · ▲ 30 · ▼ 30 · 삭제 30) / [저장][닫기]
 * 개발자를 처음 저장할 때 이 규칙대로 진행단계가 만들어진다(서버 Scm10_Dev.updateList)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { DevStepRule } from '@/types/scm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { arrowCell, MODAL_HEADER_STYLE } from './scmGridCells';

const gb = gbFor<DevStepRule>();
/** setChecked(SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
let tempId = 0;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Scm12_Lookup_DevStepRule: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<DevStepRule>>(null);
  const [rows, setRows] = useState<DevStepRule[]>([]);
  const [deleteList, setDeleteList] = useState<DevStepRule[]>([]);
  const [names, setNames] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // retrieve() L178-188: scm.Scm12_DevStepRule.getList
  const retrieve = useCallback(async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await scmApi.searchDevStepRules());
      setDeleteList([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L57-79) → settings(), show() + open() L53-55: retrieve()
  useEffect(() => {
    if (!open) return;
    void retrieve();
    sysApi.searchCodes('DevStepCode').then(list => setNames(list.map(c => ({ code: c.code, name: c.name })))).catch(() => setNames([]));
  }, [open, retrieve]);

  // getSeq() L170-176: 순서 번호 = (줄 위치 + 1) × 10
  const withSeq = (list: DevStepRule[]) => list.map((r, i) => ({ ...r, devStepSeq: String((i + 1) * 10) }));

  // changeRow() L144-168: up / down / delete
  const changeRow = (action: 'up' | 'down' | 'delete', row: DevStepRule) => {
    const i = rows.findIndex(r => r.devStepRuleId === row.devStepRuleId);
    if (i < 0) return;
    const next = [...rows];
    if (action === 'up' && i > 0) [next[i - 1], next[i]] = [next[i], next[i - 1]];
    else if (action === 'down' && i < next.length - 1) [next[i + 1], next[i]] = [next[i], next[i + 1]];
    else if (action === 'delete') { setDeleteList(prev => [...prev, row]); next.splice(i, 1); }
    setRows(withSeq(next));
  };

  // [E1] insertButton[등록].Select (L82) → insertRow() L213-224: 순서 = (개수 + 1) × 10. 03 원칙 17: 맨 아래에 넣고 보이게 스크롤
  const insertRow = () => {
    const row: DevStepRule = { devStepRuleId: --tempId, devStepSeq: String((rows.length + 1) * 10) };
    setRows(prev => [...prev, row]);
    setTimeout(() => {
      const node = gridRef.current?.api?.getRowNode(String(row.devStepRuleId));
      if (!node) return;
      node.setSelected(true);
      gridRef.current?.api?.ensureNodeVisible(node);
    }, 0);
  };

  // [E2] confirmButton[저장].Select (L88) → update() L190-211: 삭제 목록을 지우고(delete) 그리드 전체를 updateList → retrieve()
  const update = async () => {
    setSaving(true);
    try {
      await scmApi.saveDevStepRules(
        deleteList.filter(r => r.devStepRuleId > 0).map(r => r.devStepRuleId),
        rows.map(r => ({ devStepRuleId: r.devStepRuleId, devStepSeq: r.devStepSeq ?? null, devStepCd: r.devStepCd ?? null })),
      );
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // buildApprStepGrid() L102-142 (체크 단일)
  const columnDefs = useMemo(() => [
    // [E4] devStepComboBox[DevStepCode].Collapse (L107) → 선택한 이름·코드를 그 행에 넣는다
    gb.text('devStepNm', 150, '구분', {
      editor: 'select', values: names.map(n => n.name),
      onCellValueChanged: p => {
        const code = names.find(n => n.name === p.newValue)?.code ?? null;
        setRows(prev => prev.map(r => (r.devStepRuleId === p.data.devStepRuleId ? { ...r, devStepNm: p.newValue ?? null, devStepCd: code } : r)));
      },
    }),
    arrowCell<DevStepRule>('up', 'upCell', row => changeRow('up', row)),
    arrowCell<DevStepRule>('down', 'downCell', row => changeRow('down', row)),
    iconCell<DevStepRule>('delete', 'deleteCell', 30, '삭제', row => changeRow('delete', row)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [names, rows]);

  return (
    <LookupModal
      open={open}
      title="진행단계 설정"
      width={320}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" loading={saving} onClick={update}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L94) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div><Button type="register" onClick={insertRow}>등록</Button></div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<DevStepRule>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.devStepRuleId)}
            loading={loading}
            rowSelection={SINGLE_CHECK}
          />
        </div>
      </div>
    </LookupModal>
  );
};
