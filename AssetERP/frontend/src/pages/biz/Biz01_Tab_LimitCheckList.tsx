/**
 * [1133] 준법감시 > 40. 이익제공(수령)현황 > 이익제공 한도초과현황 (L07)
 * AS-IS: myApp/client/vi/biz/Biz01_Tab_LimitCheckList.java (164줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L45-75: north(50, 여백 20 20 0 20) = 툴바(기준년도 [YYYY 50] 제공/수령 [콤보 100] [조회] [엑셀다운로드]), center(여백 0 20 20 20) = 탭 3개
 *   (인별 1회 초과건 · 인별 연간 초과건 · 회사별 연간 초과건). 탭 안은 각각 그리드 1개(Biz01_TabPage_*). overCheckBox("회사한도 초과건만 조회")는 툴바에 붙이지 않았고(L53 주석) SQL도 안 쓴다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 넣지 않는다 — 조건이 연도·콤보 둘이고 원본에 초기화가 없다
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Tabs } from 'antd';
import dayjs from 'dayjs';
import { bizLimitCheckApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizLimitCompanyYear, BizLimitPersonDay, BizLimitPersonYear } from '@/types/biz';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Biz01_TabPage_PersonDay } from './Biz01_TabPage_PersonDay';
import { Biz01_TabPage_PersonYear } from './Biz01_TabPage_PersonYear';
import { Biz01_TabPage_CompanyYear } from './Biz01_TabPage_CompanyYear';

const ALL = '%';
/** 콤보 "전체"(ComboBoxField("ProvideRcvType", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];

type TabKey = 'day' | 'person' | 'company';

export const Biz01_Tab_LimitCheckList: React.FC = () => {
  // setting() L77-122: 기준년도 = 올해, 제공/수령 "전체"
  const [yearText, setYearText] = useState(() => dayjs().format('YYYY'));
  const [rcvType, setRcvType] = useState<string>(ALL);
  const [active, setActive] = useState<TabKey>('day');
  const [day, setDay] = useState<BizLimitPersonDay[]>([]);
  const [person, setPerson] = useState<BizLimitPersonYear[]>([]);
  const [company, setCompany] = useState<BizLimitCompanyYear[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // retrieveTabpage() L137-155: 제공/수령을 안 골랐으면 '%'. 활성 탭 하나만 읽는다 (InterfaceTabPage.retrieve(param))
  const retrieveTabpage = async (tab: TabKey = active) => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      if (tab === 'day') {
        const list = await bizLimitCheckApi.searchPersonDay(yearText, rcvType);
        if (my === seq.current) setDay(list);
      } else if (tab === 'person') {
        const list = await bizLimitCheckApi.searchPersonYear(yearText, rcvType);
        if (my === seq.current) setPerson(list);
      } else {
        const list = await bizLimitCheckApi.searchCompanyYear(yearText, rcvType);
        if (my === seq.current) setCompany(list);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L45-75) → setting(), retrieveTabpage()
  useEffect(() => { void retrieveTabpage(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] downloadButton[엑셀다운로드].Select (L101) → downloadExcel() L124-135: ExcelDownload?actionCode=biz01List — 세 탭을 시트 3개로 담은 "이익제공 한도초과현황(연도).xls"
  const downloadExcel = async () => {
    try {
      await bizLimitCheckApi.downloadExcel(yearText, rcvType);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] yearText.KeyPress [Enter] (L82)·[E2] retrieveButton[조회].Select (L95) → retrieveTabpage() */}
        <SearchBar
          onSearch={() => void retrieveTabpage()}
          searchText="조회"
          loading={loading}
          extra={(
            <>
              {/* [E3] downloadButton[엑셀다운로드] */}
              <Button type="download" onClick={downloadExcel}>엑셀다운로드</Button>
            </>
          )}
        >
          <SearchBar.Field label="기준년도">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" maxLength={4} value={yearText} onChange={e => setYearText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="제공/수령">
            <SystemCodeComboBox kindCd="ProvideRcvType" altCode={ALL_CODE} style={{ width: 100 }} value={rcvType} onChange={c => setRcvType(c ?? ALL)} />
          </SearchBar.Field>
        </SearchBar>
        {/* [E4] tabPanel.Selection (L116) → retrieveTabpage() — 탭을 바꾸면 그 탭을 읽는다.
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
