/**
 * [1133] 준법감시 > 40. 이익제공(수령)현황 > 이익제공 한도초과현황 (L07)
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_LimitCheckList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, IDMS-IC 2026-11-10)
 * 레이아웃 L58-108: north(92, 여백 20 20 0 20) = 두 줄
 *   1줄 buttonBar01: 기준년도 [YYYY] 제공/수령 [콤보 100] [조회] [엑셀다운로드]
 *   2줄 buttonBar02: [v] 이익제공 편익 기준액 적용  [ ] 임의점검 이익제공 편익상대방 한도액  인별 1회 [80] / 인별 연간 [80] / 회사별 연간 [80]  [한도액 복구]
 *   center(여백 0 20 20 20) = 탭 3개(인별 1회 초과건 · 인별 연간 초과건 · 회사별 연간 초과건), 탭 안은 각각 그리드 1개(Biz01_TabPage_*)
 * 원본 2026-10-29(77b1a76ea 조회조건 추가)·11-04: 2줄째와 getLimit()이 생겼다 (CH-0155~0157·0159, 대장 3-변경반영)
 * UX보강(10): 검색 영역 = SearchPanel(두 줄, UX-01·04). 초기화(UX-02)는 넣지 않는다 — 원본에 없다
 * 스타일: STP (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, InputNumber, message, Tabs } from 'antd';
import dayjs from 'dayjs';
import { bizLimitApi, bizLimitCheckApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizLimitCheckCond, BizLimitCompanyYear, BizLimitPersonDay, BizLimitPersonYear } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchPanel } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Biz01_TabPage_PersonDay } from './Biz01_TabPage_PersonDay';
import { Biz01_TabPage_PersonYear } from './Biz01_TabPage_PersonYear';
import { Biz01_TabPage_CompanyYear } from './Biz01_TabPage_CompanyYear';

const ALL = '%';
/** 콤보 "전체"(ComboBoxField("ProvideRcvType", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];

type TabKey = 'day' | 'person' | 'company';

/** LongField setFormat("#,###") */
const comma = (v: number | string | undefined) => (v === undefined || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const uncomma = (v: string | undefined) => (v ? Number(v.replace(/,/g, '')) : 0);

export const Biz01_Tab_LimitCheckList: React.FC = () => {
  // setting() L119-191: 기준년도 = 올해, 제공/수령 "전체", 편익 기준액 적용 = 켬, 임의점검 = 끔(한도액 3칸·[한도액 복구] 비활성)
  const [yearText, setYearText] = useState(() => dayjs().format('YYYY'));
  const [rcvType, setRcvType] = useState<string>(ALL);
  const [overCheck, setOverCheck] = useState(true);
  const [limitCheck, setLimitCheck] = useState(false);
  const [limit1, setLimit1] = useState<number | null>(null);
  const [limit2, setLimit2] = useState<number | null>(null);
  const [limit3, setLimit3] = useState<number | null>(null);
  const [active, setActive] = useState<TabKey>('day');
  const [day, setDay] = useState<BizLimitPersonDay[]>([]);
  const [person, setPerson] = useState<BizLimitPersonYear[]>([]);
  const [company, setCompany] = useState<BizLimitCompanyYear[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  const cond = (over: Partial<BizLimitCheckCond> = {}): BizLimitCheckCond => ({
    yearText, provideRcvType: rcvType, overCheck, limitCheck, limit1, limit2, limit3, ...over,
  });

  // retrieveTabpage() L226-249: 제공/수령을 안 골랐으면 '%'. 활성 탭 하나만 읽는다 (InterfaceTabPage.retrieve(param)).
  // 체크박스를 바꾼 직후에는 상태가 아직 옛 값이라 바뀐 값을 over로 넘긴다
  const retrieveTabpage = async (tab: TabKey = active, over: Partial<BizLimitCheckCond> = {}) => {
    const c = cond(over);
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      if (tab === 'day') {
        const list = await bizLimitCheckApi.searchPersonDay(c);
        if (my === seq.current) setDay(list);
      } else if (tab === 'person') {
        const list = await bizLimitCheckApi.searchPersonYear(c);
        if (my === seq.current) setPerson(list);
      } else {
        const list = await bizLimitCheckApi.searchCompanyYear(c);
        if (my === seq.current) setCompany(list);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // getLimit() L250-278: biz.Biz90_Limit.getLimit(companyId, stdYear) → 한도액 3칸. 기준년도가 비면 메시지, 한도가 없으면 0
  const getLimit = async () => {
    if (!yearText) { message.warning('기준년도를 입력하세요'); return; }
    try {
      const row = await bizLimitApi.getProvideLimit(yearText);
      setLimit1(row?.companyLimit1 ?? 0);
      setLimit2(row?.companyLimit2 ?? 0);
      setLimit3(row?.companyLimit3 ?? 0);
    } catch (err) {
      message.error(errorMessage(err, '한도액 조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L58-108) → setting()(안에서 getLimit()), retrieveTabpage()
  useEffect(() => { void getLimit(); void retrieveTabpage(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] downloadButton[엑셀다운로드].Select → downloadExcel() L208-224: ExcelDownload?actionCode=biz01List(조건 포함) — 세 탭을 시트 3개로 담은 "이익제공 한도초과현황(연도).xls"
  const downloadExcel = async () => {
    try {
      await bizLimitCheckApi.downloadExcel(cond());
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] yearText.KeyPress [Enter]·[E2] retrieveButton[조회].Select → retrieveTabpage() */}
        <SearchPanel onSearch={() => retrieveTabpage()} loading={loading} fieldsWidth={330}>
          <SearchPanel.Row>
            <SearchPanel.Field label="기준년도">
              <SearchPanel.Input style={{ width: 70 }} placeholder="YYYY" maxLength={4} value={yearText} onChange={e => setYearText(e.target.value)} />
            </SearchPanel.Field>
            <SearchPanel.Field label="제공/수령">
              <SystemCodeComboBox kindCd="ProvideRcvType" altCode={ALL_CODE} style={{ width: 100 }} value={rcvType} onChange={c => setRcvType(c ?? ALL)} />
            </SearchPanel.Field>
          </SearchPanel.Row>
          <SearchPanel.Actions>
            {/* [E3] downloadButton[엑셀다운로드] */}
            <Button type="download" onClick={downloadExcel}>엑셀다운로드</Button>
          </SearchPanel.Actions>
          <SearchPanel.Row>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none', whiteSpace: 'nowrap' }}>
              {/* [E5] overCheckBox.ValueChange → retrieveTabpage() */}
              <Checkbox checked={overCheck} onChange={e => { setOverCheck(e.target.checked); void retrieveTabpage(active, { overCheck: e.target.checked }); }}>
                이익제공 편익 기준액 적용
              </Checkbox>
              {/* [E6] limitCheckBox.ValueChange → 한도액 3칸·[한도액 복구] 켬/끔, retrieveTabpage() */}
              <Checkbox checked={limitCheck} onChange={e => { setLimitCheck(e.target.checked); void retrieveTabpage(active, { limitCheck: e.target.checked }); }}>
                임의점검 이익제공 편익상대방 한도액
              </Checkbox>
              <span>인별 1회</span>
              <InputNumber style={{ width: 100 }} min={0} precision={0} disabled={!limitCheck} value={limit1} onChange={v => setLimit1(v)} formatter={comma} parser={uncomma} />
              <span>/ 인별 연간</span>
              <InputNumber style={{ width: 100 }} min={0} precision={0} disabled={!limitCheck} value={limit2} onChange={v => setLimit2(v)} formatter={comma} parser={uncomma} />
              <span>/ 회사별 연간</span>
              <InputNumber style={{ width: 100 }} min={0} precision={0} disabled={!limitCheck} value={limit3} onChange={v => setLimit3(v)} formatter={comma} parser={uncomma} />
              {/* [E7] limitButton[한도액 복구].Select → getLimit() */}
              <Button type="reset" disabled={!limitCheck} onClick={getLimit}>한도액 복구</Button>
            </div>
          </SearchPanel.Row>
        </SearchPanel>
        {/* [E4] tabPanel.Selection → retrieveTabpage() — 탭을 바꾸면 그 탭을 읽는다.
            antd Tabs 안에 그리드를 넣으면 높이가 0이 되므로(브라우저 확인에서 발견) 탭 줄만 Tabs로 두고 아래 칸에 활성 탭의 그리드를 둔다(Pay20과 같은 방식) */}
        <Tabs
          activeKey={active}
          onChange={k => { const t = k as TabKey; setActive(t); void retrieveTabpage(t); }}
          items={[
            { key: 'day', label: '인별 1회 초과건' },
            { key: 'person', label: '인별 연간 초과건' },
            { key: 'company', label: '회사별 연간 초과건' },
          ]}
          style={{ flex: 'none' }}
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          {active === 'day' && <Biz01_TabPage_PersonDay rows={day} loading={loading} />}
          {active === 'person' && <Biz01_TabPage_PersonYear rows={person} loading={loading} />}
          {active === 'company' && <Biz01_TabPage_CompanyYear rows={company} loading={loading} />}
        </div>
      </div>
    </div>
  );
};
