/**
 * 사원정보 변경조회 (S02) — 경영관리 > 01. 조직 및 사원관리 > 사원정보 변경조회 #1474
 * AS-IS: myApp/client/vi/emp/Emp00_Tab_ChangeHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L87-105: 탭 3개(일반발령 vlc01 · 자격사항 vlc02 · 상벌내역 vlc03), 탭마다 툴바(조회 조건 · [조회] · [출력/다운로드]) + SingleGrid. 생성자가 세 탭을 모두 조회한다(retrieve01·02·03).
 * 시작일은 일반발령·상벌내역이 오늘 기준 12개월 전, 나머지 날짜는 오늘(settings L107-124).
 * [출력/다운로드]는 서비스 sys.Sys99_Print.insertRdEmp03/08/11History → RDViewer.viewer(mrd Emp03/08/11_Rd_ChangeHistory) — `rdApi` + `RdViewer`.
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 그리드 날짜 폭(UX-08)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message, Select, Tabs } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empChangeHistoryApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { ChangeHistoryLicense, ChangeHistoryReward, ChangeHistoryTrans } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { RdViewer } from '@/components/lookup/RdViewer';

const fmtDate = (d: Dayjs) => d.format('YYYY-MM-DD');

/** 재직구분 transName (L145-148) → transCode (retrieve02 L360-371) */
const TRANS_NAMES = [
  { value: '전체', code: '000' },
  { value: '재직', code: '100' },
  { value: '겸직', code: '800' },
  { value: '퇴직', code: '900' },
];
const transCodeOf = (name: string) => TRANS_NAMES.find(t => t.value === name)?.code ?? '000';

const gb1 = gbFor<ChangeHistoryTrans>();
const gb2 = gbFor<ChangeHistoryLicense>();
const gb3 = gbFor<ChangeHistoryReward>();

// buildGrid01 — SingleGrid(Emp03_TransModel)
const transCols = [
  gb1.date('transDate', 90, '발령일'),
  gb1.textCenter('empKorName', 100, '성명'),
  gb1.textCenter('transName', 80, '발령구분'),
  gb1.textCenter('kindName', 80, '사원구분'),
  gb1.text('orgName', 200, '발령조직'),
  gb1.text('titleName', 100, '발령직책'),
  gb1.text('posName', 100, '발령직위'),
  gb1.text('gradeName', 100, '특정직위'),
  gb1.text('duty', 150, '담당업무'),
  gb1.date('expiryDate', 90, '계약만료일'),
  gb1.booleanYn2('orgHeadYn', 70, '조직장'),
  gb1.booleanYn2('officerYn', 70, '등기임원'),
  gb1.booleanYn2('tdmTargetYn', 70, '책무대상'),
  gb1.booleanYn2('nonStayYn', 70, '비상근'),
  gb1.text('transReason', 200, '비고'),
];

// buildGrid02 — SingleGrid(Emp08_LicenseModel)
const licenseCols = [
  gb2.text('empOrgName', 200, '본부(부서)'),
  gb2.textCenter('empKorName', 100, '성명'),
  gb2.text('certifiedName', 200, '자격증명'),
  gb2.date('certifiedDt', 90, '취득일자'),
  gb2.text('licenseNumber', 150, '자격증번호(협회등록번호)'),
  gb2.text('issuingAgency', 150, '발급기관'),
  gb2.text('financeProTypeName', 150, '금융투자전문인력구분'),
  gb2.booleanYn2('financeRelateYn', 120, '금융관련자격증'),
  gb2.date('kofiaRegDate', 90, '협회등록일'),
  gb2.text('note', 240, '비고'),
];

// buildGrid03 — SingleGrid(Emp11_RewardModel)
const rewardCols = [
  gb3.date('rewardDt', 90, '상벌일자'),
  gb3.textCenter('empKorName', 100, '성명'),
  gb3.textCenter('rewardCodeName', 60, '상벌구분'),
  gb3.text('rewardGroup', 200, '상벌단체'),
  gb3.textArea('rewardName', 350, '수상(징계)사유'),
  gb3.textArea('rewardDesc', 350, '수상(징계)처분'),
  gb3.text('note', 200, '비고'),
];

const paneStyle: React.CSSProperties = { height: '100%', display: 'flex', flexDirection: 'column', gap: 8 };

type OnRd = (url: string, title: string) => void;

/** 일반발령 탭 vlc01 — [E1] searchText01 Enter · [E5] empTransComboBox Collapse · [E6] 조회 · [E9] 출력/다운로드 */
const TransPane: React.FC<{ onRd: OnRd }> = ({ onRd }) => {
  const sp = useSearchParams(() => ({ startDate: dayjs().subtract(12, 'month'), closeDate: dayjs(), searchText: '', empTransCode: '' }));
  const { startDate, closeDate, searchText, empTransCode } = sp.values;
  const [rows, setRows] = useState<ChangeHistoryTrans[]>([]);

  // retrieve01 L339-354: 서비스 emp.Emp03_Trans.selectByHistory(companyId, startDate, closeDate, searchText = '%…%', empTransCode)
  const retrieve = async () => {
    const v = sp.current.current;
    try {
      setRows(await empChangeHistoryApi.searchTrans(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText, v.empTransCode || undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // downLoadButton01 L402-441: insertRdEmp03History → RDViewer.viewer(mrd Emp03_Rd_ChangeHistory · rv rdGroupId·startDate·closeDate)
  const downLoad = async () => {
    const v = sp.current.current;
    try {
      const groupId = await empChangeHistoryApi.rdPrintTrans({ startDate: fmtDate(v.startDate), closeDate: fmtDate(v.closeDate), searchText: v.searchText, empTransCode: v.empTransCode || undefined });
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp03_Rd_ChangeHistory',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: fmtDate(v.startDate), closeDate: fmtDate(v.closeDate) },
      });
      onRd(res.url, '사원정보 변경조회 - 일반발령');
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E0] 생성자 L87-105 → retrieve01()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={paneStyle}>
      <SearchBar onSearch={retrieve} extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="발령구분">
          {/* [E5] empTransComboBox[EmpTransCode].Collapse (L174) → retrieve01() */}
          <SystemCodeComboBox
            kindCd="EmpTransCode"
            altCode={['', '전체']}
            style={{ width: 120 }}
            value={empTransCode}
            onChange={c => sp.set('empTransCode', c ?? '')}
            onOpenChange={open => { if (!open) void retrieve(); }}
          />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="성명" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<ChangeHistoryTrans> rowData={rows} columnDefs={transCols} />
      </div>
    </div>
  );
};

/** 자격사항 탭 vlc02 — [E2] searchText02 Enter · [E3] transName Collapse · [E7] 조회 · [E10] 출력/다운로드 */
const LicensePane: React.FC<{ onRd: OnRd }> = ({ onRd }) => {
  const sp = useSearchParams(() => ({ startDate: dayjs(), transName: '재직', searchText: '' }));
  const { startDate, transName, searchText } = sp.values;
  const [rows, setRows] = useState<ChangeHistoryLicense[]>([]);

  // retrieve02 L356-384: transName → transCode, 서비스 emp.Emp08_License.selectByHistory(companyId, startDate, searchText = '%…%', transCode)
  const retrieve = async () => {
    const v = sp.current.current;
    try {
      setRows(await empChangeHistoryApi.searchLicenses(fmtDate(v.startDate), v.searchText, transCodeOf(v.transName)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // downLoadButton02 L443-477: insertRdEmp08History(startDate, searchText) → RDViewer.viewer(mrd Emp08_Rd_ChangeHistory · rv rdGroupId·startDate)
  const downLoad = async () => {
    const v = sp.current.current;
    try {
      const groupId = await empChangeHistoryApi.rdPrintLicenses({ startDate: fmtDate(v.startDate), searchText: v.searchText });
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp08_Rd_ChangeHistory',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: fmtDate(v.startDate) },
      });
      onRd(res.url, '사원정보 변경조회 - 자격사항');
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E0] 생성자 L87-105 → retrieve02()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={paneStyle}>
      <SearchBar onSearch={retrieve} extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}>
        <SearchBar.Field label="기준일">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="재직구분">
          {/* [E3] transName[재직].Collapse (L152) → retrieve02() */}
          <Select
            style={{ width: 100 }}
            value={transName}
            options={TRANS_NAMES.map(t => ({ value: t.value, label: t.value }))}
            onChange={v => sp.set('transName', v)}
            onOpenChange={open => { if (!open) void retrieve(); }}
          />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="성명/자격증명/협회등록번호/발급기관" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<ChangeHistoryLicense> rowData={rows} columnDefs={licenseCols} />
      </div>
    </div>
  );
};

/** 상벌내역 탭 vlc03 — [E4] searchText03 Enter · [E8] 조회 · [E11] 출력/다운로드 */
const RewardPane: React.FC<{ onRd: OnRd }> = ({ onRd }) => {
  const sp = useSearchParams(() => ({ startDate: dayjs().subtract(12, 'month'), closeDate: dayjs(), searchText: '' }));
  const { startDate, closeDate, searchText } = sp.values;
  const [rows, setRows] = useState<ChangeHistoryReward[]>([]);

  // retrieve03 L386-400: 서비스 emp.Emp11_Reward.selectByHistory(companyId, startDate, closeDate, searchText = '%…%')
  const retrieve = async () => {
    const v = sp.current.current;
    try {
      setRows(await empChangeHistoryApi.searchRewards(fmtDate(v.startDate), fmtDate(v.closeDate), v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // downLoadButton03 L479-515: insertRdEmp11History → RDViewer.viewer(mrd Emp11_Rd_ChangeHistory · rv rdGroupId·startDate·closeDate)
  const downLoad = async () => {
    const v = sp.current.current;
    try {
      const groupId = await empChangeHistoryApi.rdPrintRewards({ startDate: fmtDate(v.startDate), closeDate: fmtDate(v.closeDate), searchText: v.searchText });
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp11_Rd_ChangeHistory',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: fmtDate(v.startDate), closeDate: fmtDate(v.closeDate) },
      });
      onRd(res.url, '사원정보 변경조회 - 상벌내역');
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E0] 생성자 L87-105 → retrieve03()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={paneStyle}>
      <SearchBar onSearch={retrieve} extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="성명" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<ChangeHistoryReward> rowData={rows} columnDefs={rewardCols} />
      </div>
    </div>
  );
};

export const Emp00_Tab_ChangeHistory: React.FC = () => {
  const [rd, setRd] = useState<{ url: string; title: string } | null>(null);
  const onRd: OnRd = (url, title) => setRd({ url, title });

  // 생성자가 세 탭을 모두 조회하므로 닫힌 탭도 그려 둔다(forceRender)
  const tabs = [
    { key: 'trans', label: '일반발령', children: <TransPane onRd={onRd} /> },
    { key: 'license', label: '자격사항', children: <LicensePane onRd={onRd} /> },
    { key: 'reward', label: '상벌내역', children: <RewardPane onRd={onRd} /> },
  ];

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column' }}>
        <Tabs
          type="card"
          className="emp00-change-history-tabs"
          style={{ flex: 1, minHeight: 0 }}
          items={tabs.map(t => ({ ...t, forceRender: true, style: { height: '100%' } }))}
        />
      </div>
      <style>{`
        .emp00-change-history-tabs { display: flex; flex-direction: column; }
        .emp00-change-history-tabs > .ant-tabs-content-holder { flex: 1; min-height: 0; }
        .emp00-change-history-tabs > .ant-tabs-content-holder > .ant-tabs-content { height: 100%; }
        .emp00-change-history-tabs .ant-tabs-tabpane { height: 100%; }
      `}</style>
      <RdViewer url={rd?.url ?? null} title={rd?.title ?? ''} onClose={() => setRd(null)} />
    </div>
  );
};
