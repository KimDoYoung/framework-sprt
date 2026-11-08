/**
 * 법규 목록 창 (V10) — 결재 전·결재중 문서의 [연관법규 추가/수정/삭제]가 연다. 연관법규를 더하고 빼고 기준일·마감일을 정한다.
 * AS-IS: myApp/client/vi/apr/Apr20_Lookup_RelateIcsList.java (307줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L65-132: 850×500 모달 "법규 목록", 위 [행 추가][행 삭제] + 오른쪽 새로고침 아이콘, 단일 체크 그리드(법규 510 · 주기 80 · 마감일 100 · 설정 80), 푸터 [저장][닫기]
 * 동작: 변경이 있으면 상신자에게 "상신문서 연관법규 변동알림"이 간다(서버).
 * EE70: 내규판 Apr22_Lookup_RelateIcrList(AS-IS 304줄, 법규 → 내규, Icr01_Lookup_SelectMulti)는 `kind="icr"`로 같은 부품을 쓴다.
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { aprRelateEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprRelateIcsRow } from '@/types/apr';
import { IcsLawDeadline } from '@/types/ics';
import { IcrClassTreeDeadline } from '@/types/icr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Ics01_Lookup_SelectMulti } from '@/pages/ics/Ics01_Lookup_SelectMulti';
import { Icr01_Lookup_SelectMulti } from '@/pages/icr/Icr01_Lookup_SelectMulti';
import { Apr20_Lookup_RelateIcs } from './Apr20_Lookup_RelateIcs';

interface Row extends AprRelateIcsRow {
  /** 화면용 줄 번호(저장된 줄은 relateIcsId, 새 줄은 음수) */
  rowKey: number;
}

const gb = gbFor<Row>();

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  target: { apprId: number; statusCode: string } | null;
  /** [닫기] — AS-IS callback.execute(apprModel): 문서창이 연관법규 탭을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
  /** 'icr'이면 내규 목록 창(Apr22_Lookup_RelateIcrList) */
  kind?: 'ics' | 'icr';
}

export const Apr20_Lookup_RelateIcsList: React.FC<Props> = ({ target, onClosed, onClose, kind = 'ics' }) => {
  const icr = kind === 'icr';
  const label = icr ? '내규' : '법규';
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Row | undefined>(undefined);
  /** deleteList */
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);
  const finished = target != null && (target.statusCode === '30' || target.statusCode === '40');

  // retrieve() L164-171: apr.Apr20_RelateIcs.selectByApprId
  const retrieve = useCallback(async () => {
    if (target == null) return;
    setLoading(true);
    try {
      const list = icr ? await aprRelateEditApi.getRelateIcr(target.apprId) : await aprRelateEditApi.getRelateIcs(target.apprId);
      setRows(list.map(r => ({ ...r, rowKey: r.relateIcsId as number })));
      setSelected(undefined);
      setDeleteIds([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [target, icr]);
  useEffect(() => {
    if (target == null) { setRows([]); setSelected(undefined); setDeleteIds([]); return; }
    void retrieve();
  }, [target, retrieve]);

  const info = (content: string) => Modal.info({ title: '확인', content, okText: '확인' });

  // [E2] insertButton[행 추가].Select (L82) → insertCheck() L258-265 → insertRow() L267-302: Ics01_Lookup_SelectMulti.open("deadline") — 고른 법규·기한마다 새 줄을 맨 아래에 (03 원칙 17)
  const insertCheck = () => {
    if (finished) return info('결재가 완료된 문서는 연관' + label + ' 추가/삭제가 불가능합니다');
    setLookupOpen(true);
  };
  const onPicked = async (list: (IcsLawDeadline | IcrClassTreeDeadline)[]) => {
    setLookupOpen(false);
    try {
      const added: Row[] = [];
      for (const m of list) {
        const r = icr ? await aprRelateEditApi.getRelateIcrInfo(m.classTreeId, m.deadlineId ?? null) : await aprRelateEditApi.getRelateIcsInfo(m.classTreeId, m.deadlineId ?? null);
        added.push({ ...r, rowKey: --seq.current, relateIcsId: null });
      }
      setRows(prev => [...prev, ...added]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E3] deleteButton[행 삭제].Select (L88) → deleteCheck() L241-248 → deleteRow() L250-256
  const deleteCheck = () => {
    if (finished) return info('결재가 완료된 문서는 연관' + label + ' 추가/삭제가 불가능합니다');
    if (!selected) return;
    if (selected.relateIcsId != null) setDeleteIds(prev => [...prev, selected.relateIcsId as number]);
    setRows(prev => prev.filter(r => r.rowKey !== selected.rowKey));
    setSelected(undefined);
  };

  // [E4] updateButton[저장].Select (L95) → update() L173-234: 마감일 검사 → apr.Apr20_RelateIcs.check → "정상적으로 반영되어 상신자에게 변경알람이 발송되었습니다" / "변경된 사항이 없습니다" → deleteList
  const update = async () => {
    if (target == null) return;
    for (const r of rows) {
      const missing = r.cycleName === '수시' ? (r.standCode === '20' && !r.closeDate) : !r.closeDate;
      if (missing) return info('마감일을 입력해주세요');
    }
    try {
      const changed = await (icr ? aprRelateEditApi.saveRelateIcr : aprRelateEditApi.saveRelateIcs)(target.apprId, {
        rows: rows.map(r => ({ relateIcsId: r.relateIcsId, classTreeId: r.classTreeId, deadlineId: r.deadlineId, standCode: r.standCode, standDate: r.standDate, closeDate: r.closeDate })),
        deleteIds,
      });
      info(changed ? '정상적으로 반영되어 상신자에게 변경알람이 발송되었습니다' : '변경된 사항이 없습니다');
      if (changed) await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E5] closeButton[닫기].Select (L101) → close() L236-239: callback.execute(apprModel), hide()
  const close = () => { onClosed(); onClose(); };

  // buildGrid() L134-162
  const columnDefs = useMemo(() => [
    gb.textArea('classTreeFullName', 510, label),  // L155
    gb.text('cycleName', 80, '주기'),  // L156
    gb.date('closeDate', 100, '마감일'),  // L157
    iconCell<Row>('edit', 'editCell', 80, '설정', setEditRow),  // L158 editCell → Apr20_Lookup_RelateIcs.open
  ], [label]);

  return (
    <>
      <LookupModal
        open={target != null}
        title={`${label} 목록`}
        width={900}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="save" onClick={update}>저장</Button>
            <Button type="close" onClick={close}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="addRow" onClick={insertCheck}>행 추가</Button>
            <Button type="removeRow" onClick={deleteCheck}>행 삭제</Button>
            <span style={{ flex: 1 }} />
            {/* [E1] anchor.MouseDown (L76) → retrieve() — 새로고침 이미지 링크 */}
            <a role="button" title="새로고침" onClick={() => void retrieve()} style={{ fontSize: 15, color: '#595959', cursor: 'pointer' }}><ReloadOutlined spin={loading} /></a>
          </div>
          <div style={{ height: 'min(360px, calc(100vh - 290px))' }}>
            <SingleGrid<Row>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.rowKey)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onSelect={setSelected}
            />
          </div>
        </div>
      </LookupModal>
      {icr
        ? <Icr01_Lookup_SelectMulti open={lookupOpen && target != null} actionCode="deadline" onResultDeadlines={list => void onPicked(list)} onClose={() => setLookupOpen(false)} />
        : <Ics01_Lookup_SelectMulti open={lookupOpen && target != null} actionCode="deadline" onResultDeadlines={list => void onPicked(list)} onClose={() => setLookupOpen(false)} />}
      <Apr20_Lookup_RelateIcs
        row={editRow}
        kind={kind}
        onSet={patch => {
          setRows(prev => prev.map(r => (editRow && r.rowKey === editRow.rowKey ? { ...r, ...patch } : r)));
        }}
        onClose={() => setEditRow(null)}
      />
    </>
  );
};
