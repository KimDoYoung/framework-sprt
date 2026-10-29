/**
 * [1332] 경영관리 > 90. 신청서관리 > 기타신청서 확인 (T22)
 * AS-IS: myApp/client/vi/bbs/Bbs11_Tab_ApplicationMng.java (402줄) + Bbs12_Lookup_ApplicationMng (246줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L85-159: north 툴바 50(조회기간 ~ · 신청구분 · ☑미완료건만 보기 · [조회][저장][증명서 발급 바로가기] · 오른쪽 [신청구분별 내용관리][알림수신인 설정])
 *   · center 셀 편집 그리드(행번호, 체크박스 단일) · east 650 "내    용" 머리 + HTML 편집기(행을 고르기 전에는 가려 둔다)
 * 1단계: [알림수신인 설정](Emp93_Lookup_SmsNoticeTarget, 다른 도메인 조회창)은 안내 메시지만 — 다음 단계
 * 스타일: CG로 분류되나 견본이 없어 SG 견본(Tdm01_Tab_Hr: SearchBar + 그리드)을 뼈대로 썼다 — 결과확인 13
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 초기화는 원본 버튼이 많아 넣지 않음), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import { bbsApplicationApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { BbsApplicationMng } from '@/types/bbs';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { openMenuByNo } from '@/utils/tempData';
import { Bbs12_Lookup_ApplicationMng } from './Bbs12_Lookup_ApplicationMng';

const gb = gbFor<BbsApplicationMng>();
const DATE = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Bbs11_Tab_ApplicationMng: React.FC = () => {
  const [statuses, setStatuses] = useState<Code[]>([]);
  const [selected, setSelected] = useState<BbsApplicationMng | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  // 편집기 내용(AS-IS getHtmlText()) — 고치지 않았으면 null, 저장 때 원래 내용을 그대로 둔다(편집기가 HTML을 다시 쓰므로)
  const html = useRef<string | null>(null);

  // settings() L161-239: 조회기간 = 올해 1월 1일 ~ 오늘, 신청구분 빈칸(전체), ☑미완료건만 보기
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('year'), closeDate: dayjs(), appTypeCode: undefined as string | undefined, resultCheck: true }));
  const { startDate, closeDate, appTypeCode, resultCheck } = sp.values;

  const crud = useGridCrud<BbsApplicationMng>({
    idField: 'applicationId',
    // retrieve() L284-298: 서비스 bbs.Bbs11_Application.selectByResultCheck(companyId, startDate, closeDate, appTypeCode, resultCheck)
    search: useCallback(() => {
      const v = sp.current.current;
      return bbsApplicationApi.searchByResultCheck(v.startDate.format(DATE), v.closeDate.format(DATE), v.appTypeCode, v.resultCheck);
    }, [sp]),
    // update() L304-332: GridUpdate → bbs.Bbs11_Application.update (신청상태·완료일·비고)
    save: bbsApplicationApi.saveMng,
    remove: async () => 0,
    newRow: useCallback(() => ({}), []),
  });

  // [E0] 화면 열림 (생성자 L85-159) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    // buildGrid() L245: 신청상태 콤보 = ComboBoxField("ApplicationStatusCode")
    sysApi.searchCodes('ApplicationStatusCode').then(setStatuses).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 다시 조회하면 그리드 선택이 풀리므로 편집기도 비운다
  const retrieve = async () => {
    html.current = null;
    setSelected(null);
    await crud.retrieve();
  };

  // [E2] grid.Selection (L184) → 편집기에 선택한 신청의 내용을 넣는다(고르기 전에는 가려 둔다)
  const onSelectionChanged = useCallback((e: { api: { getSelectedRows: () => BbsApplicationMng[] } }) => {
    html.current = null;
    setSelected(e.api.getSelectedRows()[0] ?? null);
  }, []);

  // update() L304-332 → updateContent() L334-356
  const update = async () => {
    // 변경 행이 있으면 GridUpdate(bbs.Bbs11_Application.update)를 먼저 하고, 실패하면 멈춘다
    await crud.saveRows();
    if (crud.hasChanges()) return;
    // 선택한 신청의 내용 저장: bbs.Bbs11_Application.modelUpdate (신청구분이 있는 행만)
    if (selected?.appType != null) {
      try {
        await bbsApplicationApi.updateContent(selected.applicationId, html.current ?? selected.content ?? '');
        message.success('저장이 완료되었습니다.');
      } catch (err) {
        message.error(errorMessage(err, '저장 실패'));
        return;
      }
    }
    await retrieve();
  };

  // sendTagetMessage() L358-379: sms.Sms02_History.sendMessage(companyId, personId = 신청자, msg)
  const sendTagetMessage = async (row: BbsApplicationMng) => {
    // 91 : 발급완료 / 92 : 발송완료
    if (row.appStatus !== '91' && row.appStatus !== '92') {
      message.warning('완료되지 않은 신청서는 문자발송이 제한됩니다');
      return;
    }
    const msg = `'${row.appEmpName ?? ''}'님의 ${row.appTypeName ?? ''}이 완료되었습니다.`;
    try {
      await bbsApplicationApi.sendMessage(row.appEmpId as number, msg);
      message.success('발송이 완료되었습니다');
    } catch {
      message.warning('문자발신 서비스를 미신청한 고객사입니다. 관리자에게 문의하세요');
    }
  };

  // buildGrid() L241-282
  const columnDefs = useMemo(() => [
    gb.date('appDate', 100, '신청일'),  // L272
    gb.text('appEmpName', 80, '신청자'),  // L273
    gb.text('appTypeName', 150, '신청구분'),  // L274
    // [E8] appStatusComboBox[ApplicationStatusCode].Collapse (L246) → 고른 코드를 신청상태(appStatus)의 변경으로 기록하고,
    //      91·92면 완료일 = 오늘, 아니면 완료일 = 없음
    gb.textCenter('appStatusName', 80, '신청상태', {  // L275
      editor: 'select',
      values: statuses.map(c => c.name),
      valueSetter: p => {
        const code = statuses.find(c => c.name === p.newValue)?.code;
        if (code == null) return false;
        p.data.appStatusName = p.newValue;
        p.data.appStatus = code;
        p.data.closeDate = code === '91' || code === '92' ? dayjs().format(DATE) : null;
        setTimeout(() => p.api.refreshCells({ rowNodes: p.node ? [p.node] : [], columns: ['closeDate'], force: true }), 0);
        return true;
      },
    }),
    gb.date('closeDate', 100, '완료일', { editor: 'date' }),  // L276
    iconCell<BbsApplicationMng>('send', 'actionCell', 100, '완료문자발송', row => void sendTagetMessage(row)),  // L277 actionCell
    gb.text('note', 190, '비고', { editor: 'text' }),  // L278
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [statuses]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L196) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        extra={
          <>
            {/* [E4] updateButton[저장].Select (L202) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={update}>저장</Button>
            {/* [E7] certButton[증명서 발급 바로가기].Select (L227) → MenuOpener.openTabCallback(MenuGrid.tabPanel, "1115") */}
            <Button type="goto" onClick={() => { if (!openMenuByNo('1115')) message.warning('증명서 발급(1115) 화면을 열 수 없습니다'); }}>증명서 발급 바로가기</Button>
            {/* [E5] updateFormButton[신청구분별 내용관리].Select (L208) → Bbs12_Lookup_ApplicationMng.open() */}
            <Button type="register" onClick={() => setFormOpen(true)}>신청구분별 내용관리</Button>
            {/* [E6] noticeButton[알림수신인 설정].Select (L220) → Emp93_Lookup_SmsNoticeTarget.open("B03") */}
            <Button type="register" onClick={() => message.info('알림수신인 설정 창(Emp93_Lookup_SmsNoticeTarget)은 다음 단계에서 제공됩니다')}>알림수신인 설정</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          {/* [E1] startDate.ValueChange (L169) → applicationComboBox.setCodeList(startDate) — 신청구분 목록을 그 날짜 기준으로 */}
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="신청구분">
          <SystemCodeComboBox kindCd="ApplicationType" applyDate={startDate.format(DATE)} style={{ width: 150 }} allowClear placeholder="전체" value={appTypeCode} onChange={c => sp.set('appTypeCode', c)} />
        </SearchBar.Field>
        <Checkbox checked={resultCheck} onChange={e => sp.set('resultCheck', e.target.checked)}>미완료건만 보기</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel min={300}>
            <CellEditGrid<BbsApplicationMng>
              crud={crud}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.applicationId)}
              rowSelection={SINGLE_CHECKED}
              onSelectionChanged={onSelectionChanged}
            />
          </Splitter.Panel>
          <Splitter.Panel defaultSize={650} min={300} max={1000}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9', marginLeft: 8 }}>
              <div style={{ height: 32, lineHeight: '32px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #d9d9d9' }}>내&nbsp;&nbsp;&nbsp;&nbsp;용</div>
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: selected ? undefined : '#f5f5f5' }}>
                {selected ? (
                  <HtmlEditor key={selected.applicationId} value={selected.content} onChange={h => { html.current = h; }} height={500} />
                ) : null}
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <Bbs12_Lookup_ApplicationMng open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
};
