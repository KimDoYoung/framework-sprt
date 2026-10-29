/**
 * [1362] 경영관리 > 90. 신청서관리 > 화환신청 확인 (T21)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Tab_FloralRequestMng.java (261줄) + Bbs22_Lookup_FloralMessage (97줄) + Bbs20_Lookup_RelateFile (112줄) + Bbs20_Lookup_Message (196줄)
 *   + Bbs20_Edit_FloralRequest (762줄, 보기 모드만 — 1단계) + Bbs21_Lookup_FloralRequestShare (317줄) + Bbs20_Grid_RelateFile (261줄)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-91: center = 툴바 50(조회기간 ~ · 검색 200 "신청자/거래처/거래처담당자" · ☑미완료건만 보기 · [조회][저장][경조구분별 문구등록]) + 셀 편집 그리드(행번호, 체크박스 단일)
 * 스타일: SGP (page-style — 조회 툴바 + 그리드 하나 + 편집 팝업)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 초기화는 원본 버튼이 셋 붙어 넣지 않음), 저장 = 저장(n)(UX-03), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { bbsFloralApi } from '@/api/bbs';
import { sysApi } from '@/api/sys';
import { BbsFloralRequest } from '@/types/bbs';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Bbs20_Edit_FloralRequest } from './Bbs20_Edit_FloralRequest';
import { Bbs20_Lookup_Message } from './Bbs20_Lookup_Message';
import { Bbs20_Lookup_RelateFile } from './Bbs20_Lookup_RelateFile';
import { Bbs22_Lookup_FloralMessage } from './Bbs22_Lookup_FloralMessage';

const gb = gbFor<BbsFloralRequest>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** update() L207-235: 저장 전 검사. 같은 변경 행에 둘 다 걸리면 나중 문구가 남는다(원본 그대로) */
const validate = (changed: BbsFloralRequest[]): string | undefined => {
  let msg: string | undefined;
  for (const r of changed) {
    if (r.statusCode === '10' || r.statusCode === '20') {
      if (r.endDate != null) msg = "신청상태가 '발송완료' 일 경우에만 완료일 설정이 가능합니다";
    }
    if (r.statusCode === '92') {
      if (r.endDate == null) msg = "신청상태가 '발송완료' 일 경우 완료일은 필수선택값입니다";
    }
  }
  return msg;
};

export const Bbs20_Tab_FloralRequestMng: React.FC = () => {
  const [statuses, setStatuses] = useState<Code[]>([]);
  const [editTarget, setEditTarget] = useState<BbsFloralRequest | null>(null);
  const [fileParentId, setFileParentId] = useState<number | null>(null);
  const [messageTarget, setMessageTarget] = useState<{ option: '01' | '02'; model: BbsFloralRequest } | null>(null);
  const [floralMessageOpen, setFloralMessageOpen] = useState(false);

  // settings() L93-129: 조회기간 = 올해 1월 1일 ~ 오늘, ☑미완료건만 보기, 검색칸 빈칸
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('year'), closeDate: dayjs(), confirmYn: true, searchText: '' }));
  const { startDate, closeDate, confirmYn, searchText } = sp.values;

  const crud = useGridCrud<BbsFloralRequest>({
    idField: 'floralRequestId',
    // retrieve() L237-252: 서비스 bbs.Bbs20_FloralRequest.selectByTextAdmin(companyId, startDate, closeDate, "%검색어%", confirmYn)
    search: useCallback(() => {
      const v = sp.current.current;
      return bbsFloralApi.searchRequests(v.startDate.format('YYYY-MM-DD'), v.closeDate.format('YYYY-MM-DD'), v.searchText, v.confirmYn);
    }, [sp]),
    // update() L207-235: GridUpdate → bbs.Bbs20_FloralRequest.update (신청상태·완료일·비고·반려사유)
    save: bbsFloralApi.saveRequests,
    remove: async () => 0,
    newRow: useCallback(() => ({}), []),
    validate,
  });

  // [E0] 화면 열림 (생성자 L62-91) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    // buildGrid() L132-137: 신청상태 콤보 = sys.Sys00_Common.selectByKindGroupCode(코드그룹 ApplicationStatusCode001)
    sysApi.searchCodesByKindGroup('ApplicationStatusCode001').then(setStatuses).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // buildGrid() L131-200
  const columnDefs = useMemo(() => [
    iconCell<BbsFloralRequest>('view', 'viewCell1', 40, '보기', row => setEditTarget(row)),  // L177 viewCell1 → [E6] Bbs20_Edit_FloralRequest.view(model, callback → retrieve())
    gb.date('regDate', 90, '신청일'),  // L178
    gb.text('personInfo', 130, '신청자'),  // L179
    gb.textCenter('occasionsName', 70, '경조구분'),  // L180
    gb.text('reason', 200, '신청사유'),  // L181
    gb.text('sendEmp', 150, '발신인'),  // L182
    gb.group('받는 사람', [  // L176 addHeaderGroupMap(HeaderGroupConfig "받는 사람", 1, 2)
      gb.text('rcvCompany', 150, '회사명'),  // L185
      gb.text('rcvInfo', 150, '담당자'),  // L186 — SQL에 없는 열이라 원본도 늘 빈칸
    ]),
    gb.date('sendRequestDate', 90, '발송요청일'),  // L190
    gb.longCenter('fileCount', 70, '증빙자료'),  // L191
    iconCell<BbsFloralRequest>('view', 'viewCell2', 40, ' ', row => setFileParentId(row.floralRequestId)),  // L192 viewCell2 → Bbs20_Lookup_RelateFile.open(keyId)
    // [E5] statusComboBox.Collapse (L138) → 고른 코드·이름을 신청상태(statusCode·statusName)로 바꾼다
    gb.textCenter('statusName', 80, '신청상태', {  // L193
      editor: 'select',
      values: statuses.map(c => c.name),
      valueSetter: p => {
        p.data.statusName = p.newValue;
        p.data.statusCode = statuses.find(c => c.name === p.newValue)?.code ?? p.data.statusCode;
        return true;
      },
    }),
    gb.date('endDate', 90, '완료일', { editor: 'date' }),  // L194
    iconCell<BbsFloralRequest>('send', 'sendCell', 70, '문자발송', row => setMessageTarget({ option: '02', model: row })),  // L195 sendCell → sendMessage() L202-205: Bbs20_Lookup_Message.open("02", model)
    gb.text('note', 150, '비고', { editor: 'text' }),  // L196
    gb.text('rejectReason', 250, '반려사유', { editor: 'text' }),  // L197
  ], [statuses]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E1] searchText.KeyPress [Enter] (L102) → retrieve(), [E2] retrieveButton[조회].Select (L110) → retrieve() */}
      <SearchBar
        onSearch={() => crud.retrieve()}
        extra={
          <>
            {/* [E3] updateButton[저장].Select (L116) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] commentButton[경조구분별 문구등록].Select (L122) → Bbs22_Lookup_FloralMessage.open() */}
            <Button type="register" onClick={() => setFloralMessageOpen(true)}>경조구분별 문구등록</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="신청자/거래처/거래처담당자" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={confirmYn} onChange={e => sp.set('confirmYn', e.target.checked)}>미완료건만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BbsFloralRequest> crud={crud} columnDefs={columnDefs} getRowId={p => String(p.data.floralRequestId)} rowSelection={SINGLE_CHECKED} />
      </div>
      <Bbs20_Edit_FloralRequest model={editTarget} onClose={() => setEditTarget(null)} />
      <Bbs20_Lookup_RelateFile parentId={fileParentId} onClose={() => setFileParentId(null)} />
      <Bbs20_Lookup_Message target={messageTarget} onClose={() => setMessageTarget(null)} />
      <Bbs22_Lookup_FloralMessage open={floralMessageOpen} onClose={() => setFloralMessageOpen(false)} />
    </div>
  );
};
