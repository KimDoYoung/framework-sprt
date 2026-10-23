/**
 * [1431] 준법감시 > 12. 대외활동 > 대외활동신청 (M01)
 * AS-IS: myApp/client/vi/ics/Ics35_Tab_ExtrActivity.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 툴바(조회기간 ~ · 조회 · 등록 · 삭제) + 대외활동 그리드(행번호, 체크박스 단일). 그리드 L123-204: 수정 50 · 신청일자 100 · 활동처 200 · 활동대상 300 · 활동기간 280 · 첨부자료 80 · (보기 30) ·
 *   [활동신청] 결재요청 80 · 결재상태 100 · 문서보기 80 / [결과보고] 결재요청 80 · 결재상태 100 · 문서보기 80. 짝: Ics35_Tab_ExtrActivityList(M02)
 * 1단계(F·I와 같은 방침): 전자결재 편집창 Apr01_Edit_ApprDoc(다른 도메인)을 여는 [결재요청]·[문서보기]는 상태 검사까지 하고 안내만 띄운다 — 다음 단계(전자결재 편집창)에서 연결
 * UX보강(10): 툴바 = SearchBar(UX-01 조회 로딩·Enter). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsExtrActivity } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { Sys10_Lookup_File } from '@/pages/sys/Sys10_Lookup_File';
import { Ics35_Edit_ExtrActivity, Ics35_Edit_ExtrActivityTarget } from './Ics35_Edit_ExtrActivity';

const gb = gbFor<IcsExtrActivity>();

/** 상신중(10)·결재중(20)·완료(30)이면 고칠 수도 지울 수도 없다 — AS-IS 같은 문구 */
const isApprBusy = (code?: string | null) => code === '10' || code === '20' || code === '30';
const BUSY_MSG = '이미 상신중이거나 완료된 문서가 존재합니다';

export const Ics35_Tab_ExtrActivity: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcsExtrActivity>>(null);
  const [rows, setRows] = useState<IcsExtrActivity[]>([]);
  const [selected, setSelected] = useState<IcsExtrActivity[]>([]);
  const [loading, setLoading] = useState(false);
  // settings() L97-121: 조회기간 = 올해 1월 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [editTarget, setEditTarget] = useState<Ics35_Edit_ExtrActivityTarget | null>(null);
  const [fileParentId, setFileParentId] = useState<number | null>(null);

  // retrieve() L254-268: 서비스 ics.Ics35_ExtrActivity.selectByPersonId(companyId, personId, startDate, closeDate)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await icsApi.searchExtrActivities(startDate.format('YYYY-MM-DD'), closeDate.format('YYYY-MM-DD')));
      setSelected([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate]);

  // [E0] 화면 열림 (생성자 L69-95) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E2] insertButton[등록].Select (L109) → insertRow() L206-214: Ics35_Edit_ExtrActivity.insert(callback = retrieve)
  const insertRow = () => setEditTarget({ mode: 'insert' });

  // [E3] deleteButton[삭제].Select (L115) → deleteRow() L216-252: 고른 행 중 상신중·완료가 있으면 안내, 확인 창(폭 350) [YES] → [E4] 서비스 ics.Ics35_ExtrActivity.delete
  const deleteRow = () => {
    for (const r of selected) {
      if (isApprBusy(r.apprStatusCd) || isApprBusy(r.resultApprStatusCd)) {
        message.warning(BUSY_MSG);
        return;
      }
    }
    Modal.confirm({
      title: '확인',
      content: '해당 파일을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await icsApi.deleteExtrActivities(selected.map(r => r.extrActivityId));
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // dcrChk(linkCode, model) L294-335: 상신중·완료면 안내 → 문서분류(dcr.Dcr30_Link.selectByLinkCode, 없으면 Dcr01_Lookup_Class) → insertLinkApproval() L337-353 → Apr01_Edit_ApprDoc → updateApprId·updateResultApprId
  const dcrChk = (linkCode: 'B15' | 'B16', row: IcsExtrActivity) => {
    const status = linkCode === 'B15' ? row.apprStatusCd : row.resultApprStatusCd;
    if (isApprBusy(status)) {
      message.warning(BUSY_MSG);
      return;
    }
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 다음 단계
    message.info('전자결재 상신 화면은 아직 연결되지 않았습니다 (다음 단계)');
  };

  // viewAppr(apprId) L270-292: ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(model, false), 없으면 "해당문서의 열람권한이 없습니다"
  const viewAppr = (apprId: number | null) => {
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 다음 단계
    void apprId;
    message.info('전자결재 문서보기는 아직 연결되지 않았습니다 (다음 단계)');
  };

  // buildGrid() L123-204
  const columnDefs = useMemo(() => [
    iconCell<IcsExtrActivity>('edit', 'actionCellEdit', 50, '수정', row => {  // actionCell01 L124-148: 상신중·완료면 안내, 아니면 Ics35_Edit_ExtrActivity.edit(model, retrieve)
      if (isApprBusy(row.apprStatusCd) || isApprBusy(row.resultApprStatusCd)) {
        message.warning(BUSY_MSG);
        return;
      }
      setEditTarget({ mode: 'edit', row });
    }),
    gb.date('regDate', 90, '신청일자'),  // L190 (원본 100 — UX-08 읽기 전용 날짜는 90)
    gb.text('activityCorp', 200, '활동처'),  // L191
    gb.text('activityTgtNm2', 300, '활동대상'),  // L192
    gb.text('activityPeriod', 280, '활동기간'),  // L193
    gb.textCenter('fileCntStr', 80, '첨부자료'),  // L194
    iconCell<IcsExtrActivity>('view', 'actionCellFile', 30, '', row => setFileParentId(row.extrActivityId)),  // L195 actionCell02 → Sys10_Lookup_File.open(extrActivityId)
    gb.group('활동신청', [  // HeaderGroupMap(0, 9, "활동신청", 1, 3)
      iconCell<IcsExtrActivity>('edit', 'actionCellAppr', 80, '결재요청', row => dcrChk('B15', row)),  // L196 actionCell03
      gb.textStatus('apprStatusNm', 100, '결재상태'),  // L197
      iconCell<IcsExtrActivity>('view', 'actionCellApprView', 80, '문서보기', row => viewAppr(row.apprId)),  // L198 actionCell04
    ]),
    gb.group('결과보고', [  // HeaderGroupMap(0, 12, "결과보고", 1, 3)
      iconCell<IcsExtrActivity>('edit', 'actionCellResult', 80, '결재요청', row => dcrChk('B16', row)),  // L199 actionCell05
      gb.textStatus('resultApprStatusNm', 100, '결재상태'),  // L200
      iconCell<IcsExtrActivity>('view', 'actionCellResultView', 80, '문서보기', row => viewAppr(row.resultApprId)),  // L201 actionCell06
    ]),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] retrieveButton[조회].Select (L103) → retrieve() */}
      <div style={{ overflowX: 'auto' }}>
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}
          extra={<>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker allowClear={false} style={{ width: 130 }} value={startDate} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker allowClear={false} style={{ width: 130 }} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<IcsExtrActivity>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.extrActivityId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          onSelect={r => setSelected(r ? [r] : [])}
        />
      </div>
      <Ics35_Edit_ExtrActivity target={editTarget} onSaved={() => void retrieve()} onClose={() => setEditTarget(null)} />
      <Sys10_Lookup_File parentId={fileParentId} onClose={() => setFileParentId(null)} />
    </div>
  );
};
