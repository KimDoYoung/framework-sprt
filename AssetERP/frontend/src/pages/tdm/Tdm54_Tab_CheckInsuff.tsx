/**
 * [1459] 책무 > 04. 책무이행점검 > 미흡내역 조치 (N24)
 * AS-IS: myApp/client/vi/tdm/Tdm54_Tab_CheckInsuff.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L69-102: BorderLayout center(여백 20, 테두리) = 툴바(높이 50: 조회기간 [시작~종료, 진행중만 보기가 켜져 있으면 비활성] · 직책 [220] · 부서 [180] · 조치상태 [85] · 진행중만 보기 · [조회]) + 미흡/개선 내역 그리드(한 행 선택)
 * 조치등록 아이콘 = Tdm54_Lookup_ChckInsuff.open(행), 승인이력 아이콘 = Tdm55_Lookup_ChckRecord.open(chckInsuffId, "TDM54"). 다음 단계: 조치 창의 증빙자료 창(Tdm00_Lookup_RelateAppr)은 안내만
 * UX보강(10): 툴바 = Button(UX-01), 직책·부서 칸 = LookupInput, 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmChckInsuffRow } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';
import { Tdm54_Lookup_ChckInsuff } from './Tdm54_Lookup_ChckInsuff';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

const gb = gbFor<TdmChckInsuffRow>();
const DATE_FORMAT = 'YYYY.MM.DD';

/** buildGrid() L196-235 */
const buildGrid = (openAction: (row: TdmChckInsuffRow) => void, openRecord: (row: TdmChckInsuffRow) => void) => [
  gb.textCenter('checkYm', 65, '발생년월'),  // L220
  gb.date('regDate', 90, '점검일'),  // L221
  gb.text('roleName', 150, '담당직책'),  // L222
  gb.text('orgName', 150, '담당부서'),  // L223
  gb.text('actionName', 400, '조치명'),  // L225
  // [E7] actionCell01 (ImageCell).callbackOnCreate (L203) → Tdm54_Lookup_ChckInsuff.open(선택 행, cb) L198-209
  iconCell<TdmChckInsuffRow>('edit', 'actionCell', 80, '조치등록', openAction),  // L226
  gb.textStatus('statusName', 80, '조치상태'),  // L227
  gb.textCenter('planActionEmpName', 85, '조치예정자'),  // L228
  gb.textCenter('actionEmpName', 100, '조치자'),  // L229
  gb.date('dueDate', 90, '완료예정일'),  // L230
  gb.date('actionDate', 90, '완료일'),  // L231
  iconCell<TdmChckInsuffRow>('view', 'recordCell', 75, '승인이력', openRecord),  // L232 → Tdm55_Lookup_ChckRecord.open(chckInsuffId, "TDM54")
];

export const Tdm54_Tab_CheckInsuff: React.FC = () => {
  const [rows, setRows] = useState<TdmChckInsuffRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));   // settings() L110-113: 올해 1월 1일 ~ 오늘
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [unDoneYn, setUnDoneYn] = useState(true);                             // L173-174
  const [status, setStatus] = useState('%');                                  // statusComboBox 전체
  const [role, setRole] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [org, setOrg] = useState<{ id: number | null; name: string }>({ id: null, name: '' });   // 처음은 로그인 사용자의 부서 (L161-162)
  const [roleLookup, setRoleLookup] = useState(false);
  const [orgLookup, setOrgLookup] = useState(false);
  const [actionTarget, setActionTarget] = useState<TdmChckInsuffRow | null>(null);
  const [recordInsuffId, setRecordInsuffId] = useState<number | null>(null);

  // 조회 조건은 ref로 읽는다 — 콜백(아이콘·조회창)이 낡은 값을 쥐지 않게
  const latest = useRef({ startDate, endDate, unDoneYn, status, role, org });
  latest.current = { startDate, endDate, unDoneYn, status, role, org };

  // retrieve() L237-255: tdm.Tdm54_ChckInsuff.selectByRegDate
  const retrieve = useCallback(async (over: Partial<typeof latest.current> = {}) => {
    const c = { ...latest.current, ...over };
    setLoading(true);
    try {
      setRows(await tdmApi.searchChckInsuffs({
        startDate: c.startDate.format('YYYY-MM-DD'), endDate: c.endDate.format('YYYY-MM-DD'), unDoneYn: c.unDoneYn,
        roleId: c.role.id, orgId: c.org.id, statusCode: c.status,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L69-102) → settings() L104-194, [E1] statusComboBox.callbackOnCreate (L53) → retrieve()
  useEffect(() => {
    void (async () => {
      let over: Partial<typeof latest.current> = {};
      try {
        const my = await tdmApi.getDashboardMyOrg();               // LoginUser.getOrgCodeId()·getOrgInfoModel().getKorName()
        if (my) {
          over = { org: { id: my.orgCodeId, name: my.korName ?? '' } };
          setOrg(over.org!);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      await retrieve(over);
    })();
  }, [retrieve]);

  const columnDefs = useMemo(
    () => buildGrid(r => setActionTarget(r), r => setRecordInsuffId(r.chckInsuffId)),
    [],
  );

  // 조치 창이 처리한 행을 목록에 반영 — grid.getStore().update(chckInsuffModel)
  const onChanged = (row: TdmChckInsuffRow) => setRows(prev => prev.map(r => (r.chckInsuffId === row.chckInsuffId ? row : r)));

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', flexWrap: 'nowrap', overflow: 'hidden' }}>
          <Typography.Text strong>조회기간</Typography.Text>
          <DatePicker style={{ width: 120 }} format={DATE_FORMAT} allowClear={false} disabled={unDoneYn} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 120 }} format={DATE_FORMAT} allowClear={false} disabled={unDoneYn} value={endDate} onChange={d => d && setEndDate(d)} />
          <Typography.Text strong style={{ marginLeft: 8 }}>직책</Typography.Text>
          {/* [E2] lookupRole.TriggerClick [result != null] (L118) → Tdm20_Lookup_SelectRole.openAll(null, cb): 고른 직책 / [전체]는 직책을 비운다 */}
          <LookupInput value={role.name} width={220} onOpen={() => setRoleLookup(true)} onClear={() => setRole({ id: null, name: '' })} />
          <Typography.Text strong style={{ marginLeft: 8 }}>부서</Typography.Text>
          {/* [E3] lookupOrg.TriggerClick [result != null] (L142) → Org00_Lookup_SelectTdm.openAll(오늘, null, true, cb) */}
          <LookupInput value={org.name} width={180} onOpen={() => setOrgLookup(true)} onClear={() => setOrg({ id: null, name: '' })} />
          <Typography.Text strong style={{ marginLeft: 8 }}>조치상태</Typography.Text>
          {/* [E4] statusComboBox[TdmInsuffStatus].Collapse (L166) → retrieve() */}
          <SystemCodeComboBox
            kindCd="TdmInsuffStatus"
            altCode={['%', '전체']}
            style={{ width: 100 }}
            value={status}
            onChange={code => { const v = code ?? '%'; setStatus(v); void retrieve({ status: v }); }}
          />
          {/* [E5] unDoneYn.ValueChange (L175) → 조회기간 사용/비활성 */}
          <Checkbox checked={unDoneYn} onChange={e => setUnDoneYn(e.target.checked)}>진행중만 보기(조회기간 제한없음)</Checkbox>
          {/* [E6] retrieveButton[조회].Select (L188) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TdmChckInsuffRow>
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.chckInsuffId)}
          />
        </div>
      </div>
      <Tdm20_Lookup_SelectRole
        open={roleLookup}
        allButton
        onAll={() => setRole({ id: null, name: '' })}
        onSelect={r => setRole({ id: r.roleId, name: r.roleName ?? '' })}
        onClose={() => setRoleLookup(false)}
      />
      <Org00_Lookup_SelectTdm
        stdDate={orgLookup ? dayjs().format('YYYY-MM-DD') : undefined}
        allButton
        onSelect={o => setOrg(o ? { id: o.orgCodeId, name: o.korNm ?? '' } : { id: null, name: '' })}
        onClose={() => setOrgLookup(false)}
      />
      <Tdm54_Lookup_ChckInsuff target={actionTarget} onChanged={onChanged} onClose={() => setActionTarget(null)} />
      <Tdm55_Lookup_ChckRecord insuffId={recordInsuffId} onClose={() => setRecordInsuffId(null)} />
    </div>
  );
};
