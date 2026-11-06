/**
 * 체크리스트 창 (EE54) — Frm01_Lookup_CheckList(알림)의 [체크리스트]가 연다. 오늘 내 데일리 체크 항목을 곧바로 처리완료·해당없음으로 체크
 * AS-IS: myApp/client/vi/frm/Frm01_Lookup_DailyCheckList.java (246줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L48-65: 950×400, 머리말 "체크리스트", 단일 그리드(묶음 헤더 "체크"). settings() L67-139: 체크하면 곧바로 저장(O05 Sch04_Tab_DailyCheckList와 같음)
 * buildGrid() L141-157: 업무구분 120 · 제목 500 · 상세보기 80 · 처리완료 100 · 해당없음 100. view() L187-236: 업무일정('1')·공모주('5') 보기
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch04DailyCheck, Sch10Ipo } from '@/types/sch';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sch01_Lookup_InfoView, InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';

const gb = gbFor<Sch04DailyCheck>();
const FORMAT = 'YYYY-MM-DD';
/** 상신중(10)·결재중(20)·완료(30)이면 고칠 수 없다 — settings() L76 */
const isApprBusy = (r: Sch04DailyCheck) => ['10', '20', '30'].includes(r.apprStatusCode ?? '');

interface Props {
  open: boolean;
  /** AS-IS callback.execute() — 체크가 바뀔 때마다(L71). 부르는 쪽이 건수를 다시 읽는다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Frm01_Lookup_DailyCheckList: React.FC<Props> = ({ open, onChanged, onClose }) => {
  const [rows, setRows] = useState<Sch04DailyCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<InfoViewTarget | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  // retrieve() L159-185 — sch.Sch04_List.selectByManagerId (처리일 오늘·취소건 제외·나의 스케줄·데일리 일정만, 분류·검색어 전체)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await schApi.searchDailyCheck({ startDate: dayjs().format(FORMAT), classId: null, searchText: '' }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L48-65, open L43-46) → settings(), show(), retrieve()
  useEffect(() => { if (open) void retrieve(); }, [open, retrieve]);

  // [E1] grid.getStore().StoreRecordChange (L68) → 서비스 sch.Sch04_List.statusUpdateCheck: 체크를 곧바로 저장한다.
  //   상신중(10·20·30)이면 "상신중인 업무는 수정이 불가능합니다." 하고 되돌린다. 처리일은 오늘(L106)
  const checkValue = (code: '1' | '5') => ({
    valueGetter: (p: { data?: Sch04DailyCheck }) => p.data?.statusCode === code,
    valueSetter: (p: { data: Sch04DailyCheck }) => {
      if (isApprBusy(p.data)) { message.warning('상신중인 업무는 수정이 불가능합니다.'); return false; }
      p.data.statusCode = code;
      p.data.manageDate = dayjs().format(FORMAT);
      return true;
    },
  });

  const onCellValueChanged = async (e: CellValueChangedEvent<Sch04DailyCheck>) => {
    const row = e.data;
    onChanged?.();
    e.api.refreshCells({ rowNodes: e.node ? [e.node] : undefined, force: true });
    if (!row) return;
    try {
      row.listId = await schApi.updateDailyCheckStatus(row);
      e.api.refreshCells({ rowNodes: e.node ? [e.node] : undefined, force: true });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      void retrieve();
    }
  };

  // actionCell (ImageCell "View") → view() L187-236: 업무일정('1')이면 Sch01_Lookup_InfoView, 공모주('5')면 sch.Sch10_Ipo.selectById → Sch10_Lookup_Ipo
  const view = async (row: Sch04DailyCheck) => {
    if (row.infoId == null) return;
    if (row.scheduleCode === '1') {
      if (row.deadlineId != null) setViewTarget({ infoId: row.infoId, deadlineId: row.deadlineId });
    } else if (row.scheduleCode === '5') {
      try { setIpo(await schApi.getIpo(row.infoId)); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    }
  };

  const columns = useMemo(() => [
    gb.textCenter('className', 120, '업무구분'),
    gb.text('title', 500, '제목'),
    iconCell<Sch04DailyCheck>('view', 'actionCell', 80, '상세보기', view),
    gb.group('체크', [
      gb.boolean('yes', 100, '처리완료', { editable: true, ...checkValue('1') }),
      gb.boolean('not', 100, '해당없음', { editable: true, ...checkValue('5') }),
    ]),
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="체크리스트"
        width={950}
        maskClosable={false}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ height: 300 }}>
          <SingleGrid<Sch04DailyCheck>
            rowData={rows}
            columnDefs={columns}
            loading={loading}
            getRowId={p => String(p.data.listId)}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </LookupModal>
      <Sch01_Lookup_InfoView target={viewTarget} onClose={() => setViewTarget(null)} />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </>
  );
};
