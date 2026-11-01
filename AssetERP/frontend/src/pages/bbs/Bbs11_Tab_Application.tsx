/**
 * [1331] 신청 > 90. 기타신청 > 기타신청서 작성 (Y13)
 * AS-IS: myApp/client/vi/bbs/Bbs11_Tab_Application.java (309줄) + Bbs11_Edit_Application (422줄, 신청서 작성 창) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-88: north = 툴바(조회기간 ~ · 신청구분 · [조회][등록][삭제]), center = 신청서 그리드(행번호, 체크박스 다중)
 * 스타일: SGP (견본 — docs/page-style/SGP/Chk02_Tab_DailyList.tsx, 편집 팝업 Bbs11_Edit_Application)
 * 연결(미사용): lookupEmpTransInfo() L190-202 · sendMessage() L204-223 — 호출처 없는 미사용 후보라 옮기지 않았다(Emp00_Lookup_SelectMulti)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsApplicationApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsApplicationMine } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Bbs11_Edit_Application, BbsApplicationEdit } from './Bbs11_Edit_Application';

const gb = gbFor<BbsApplicationMine>();
const DATE = 'YYYY-MM-DD';

export const Bbs11_Tab_Application: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<BbsApplicationMine>>(null);
  const [rows, setRows] = useState<BbsApplicationMine[]>([]);
  const [editTarget, setEditTarget] = useState<BbsApplicationEdit | null>(null);

  // settings() L90-133: 조회기간 = 올해 1월 1일 ~ 오늘, 신청구분 빈칸(전체)
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('year'), closeDate: dayjs(), appTypeCode: undefined as string | undefined }));
  const { startDate, closeDate, appTypeCode } = sp.values;

  // retrieve() L225-242: 서비스 bbs.Bbs11_Application.selectByPersonId(companyId·personId(서버), startDate, closeDate, appTypeCode)
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      setRows(await bbsApplicationApi.searchMine(v.startDate.format(DATE), v.closeDate.format(DATE), v.appTypeCode));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // [E0] 화면 열림 (생성자 L60-88) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E3] insertButton[등록].Select (L115) → Bbs11_Edit_Application.insert(): 신청일 오늘·신청자 로그인 사원인 새 신청서
  const insertRow = () => setEditTarget({ appDate: dayjs().format(DATE), appEmpId: user.userId, appEmpName: user.name, appStatus: null });

  // Bbs11_Edit_Application의 grid.getStore().update(model): 저장·신청취소로 바뀐 행을 그리드에 넣는다. 새 행은 맨 아래(03 원칙 17)로 보여 준다
  const onChanged = (saved: BbsApplicationMine) => {
    const exists = rows.some(r => r.applicationId === saved.applicationId);
    setRows(prev => (exists ? prev.map(r => (r.applicationId === saved.applicationId ? saved : r)) : [...prev, saved]));
    if (!exists) setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(saved.applicationId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // [E4] deleteButton[삭제].Select (L127) → delete() L244-277
  //   → [E6] msgBox.DialogHide [YES] (L259) → GridDeleteData → 서비스 bbs.Bbs11_Application.delete
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }  // 05 §8: 선택 없이 삭제는 확인창 없이 경고(원본은 빈 목록으로 서버를 부른다)
    for (const r of checked) {
      if (r.appStatus != null && r.appStatus !== '') { message.warning('진행된 신청서는 삭제할 수 없습니다.'); return; }
      if (r.appEmpId !== user.userId) { message.warning('본인 것만 삭제 가능합니다.'); return; }
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        try {
          await bbsApplicationApi.deleteMine(checked.map(r => r.applicationId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L135-188
  const columnDefs = useMemo(() => [
    gb.date('appDate', 100, '신청일'),  // L179
    gb.textCenter('appEmpName', 100, '신청자'),  // L180
    gb.text('appTypeName', 200, '신청구분'),  // L181
    gb.textCenter('appStatusName', 100, '신청상태'),  // L182
    gb.date('closeDate', 100, '완료일'),  // L183
    // [E5] actionCell01 (ImageCell "View").callbackOnCreate (L142) → Bbs11_Edit_Application.edit(선택 행, callback → retrieve())
    iconCell<BbsApplicationMine>('view', 'actionCell', 70, '상세보기', row => setEditTarget(row)),  // L184
    gb.text('note', 250, '비고'),  // L186
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L109) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          {/* [E1] startDate.ValueChange (L97) → applicationComboBox.setCodeList(startDate) — 신청구분 목록을 그 날짜 기준으로 */}
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="신청구분">
          <SystemCodeComboBox kindCd="ApplicationType" applyDate={startDate.format(DATE)} style={{ width: 150 }} allowClear placeholder="전체" value={appTypeCode} onChange={c => sp.set('appTypeCode', c)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BbsApplicationMine>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.applicationId)}
        />
      </div>
      <Bbs11_Edit_Application model={editTarget} userId={user.userId} onClose={() => setEditTarget(null)} onChanged={onChanged} onApplied={() => { void retrieve(); }} />
    </div>
  );
};
