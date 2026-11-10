/**
 * 관리자 > 04. 전자결재 > 발신메일 목록(관리자) (EE09, #1024)
 * 스타일: SG
 * AS-IS: myApp/client/vi/dcr/Dcr10_Tab_MailHistory_Manager.java (247줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L66-95: 툴바 [발신일자 시작~끝][메일구분 콤보 100][연관펀드 300][검색 200 빈칸 "제목"][조회] + 그리드(단일 선택, 행번호, 8열:
 *   보낸시간 150 · 발신자 100 · 발신 150 · 수신 300 · 참조 300 · 제목 300 · 내용 60 · 문서 60)
 * G14 Dcr10_Tab_MailHistory(내가 보낸 메일)와 짝: 같은 화면이지만 로그인 회사 사원이 보낸 모든 메일을 본다(selectByTitleText, empId 대신 companyId).
 * G14가 "다음 단계"로 미룬 연관펀드 조회창 Fnd01_Lookup_SelectSingle·문서 창 Apr01_Edit_ApprDoc은 이미 있어 여기서는 모두 연결했다.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { dcrMailHistoryApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrMailHistory } from '@/types/dcr';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Fnd01_Lookup_SelectSingle } from '@/components/lookup/Fnd01_Lookup_SelectSingle';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Dcr10_Lookup_MailViwer } from './Dcr10_Lookup_MailViwer';

const gb = gbFor<DcrMailHistory>();
const DATE_FORMAT = 'YYYY-MM-DD';
const MAIL_GUBUN = ['전체', '개인메일', '공용메일'];

export const Dcr10_Tab_MailHistory_Manager: React.FC = () => {
  // settings() L97-148: 발신일자 = 이번 달 1일 ~ 말일, 메일구분 "전체", 연관펀드 "전체", 검색칸 빈칸 "제목"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [mailGubun, setMailGubun] = useState('전체');
  const [fundId, setFundId] = useState<number | null>(null);
  const [fundName, setFundName] = useState('전체');
  const [fundOpen, setFundOpen] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [rows, setRows] = useState<DcrMailHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState<DcrMailHistory | null>(null);
  const [apprId, setApprId] = useState<number | null>(null);

  // retrieve() L224-242: 서비스 dcr.Dcr10_MailHistory.selectByTitleText(companyId는 서버가 세션에서, startDate, endDate, titleText, fundId, mailGubun), 끝나면 첫 행 선택
  const retrieve = async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await dcrMailHistoryApi.searchMailHistoriesManager({
        startDate: startDate.format(DATE_FORMAT), endDate: endDate.format(DATE_FORMAT), titleText, fundId, mailGubun,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L66-95) → settings() → retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E2] fundName.TriggerClick (L134) → openLookupOpr() L207-222: Fnd01_Lookup_SelectSingle.openNone(callback) — 펀드를 고르면 그 펀드, [전체]면 "전체"·fundId 비움
  const onFundResult = (fund: { fundId: number; fundName?: string | null } | null) => {
    setFundOpen(false);
    setFundId(fund?.fundId ?? null);
    setFundName(fund?.fundName ?? '전체');
  };

  // buildGrid() L150-205
  const columnDefs = useMemo(() => [
    gb.text('sendTimeString', 150, '보낸시간'),  // L195
    gb.textCenter('personName', 100, '발신자'),  // L196
    gb.text('senderEmail', 150, '발신'),  // L197
    gb.text('receiverEmail', 300, '수신'),  // L198
    gb.text('referencerEmail', 300, '참조'),  // L199
    gb.text('titleText', 300, '제목'),  // L200
    // L151-158 actionCell1(Detail) → Dcr10_Lookup_MailViwer.open(선택한 행)
    iconCell<DcrMailHistory>('view', 'contentCell', 60, '내용', row => setViewing(row)),
    // [E4] actionCell2 (ImageCell).callbackOnCreate (L182) L159-192: aprId가 없으면 "해당 메일의 연관된 문서가 존재하지않습니다",
    //   있으면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …) (문서 읽기 창)
    iconCell<DcrMailHistory>('view', 'docCell', 60, '문서', row => {
      if (row.aprId == null) {
        message.warning('해당 메일의 연관된 문서가 존재하지않습니다');
        return;
      }
      setApprId(row.aprId);
    }),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] titleTextField.KeyPress [Enter] (L123) → retrieve(), [E3] retrieveButton[조회].Select (L140) → retrieve() */}
        <div style={{ overflowX: 'auto', flex: 'none' }}>
          <SearchBar onSearch={retrieve} loading={loading} style={{ flexWrap: 'nowrap' }}>
            <SearchBar.Field label="발신일자">
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
              <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
            </SearchBar.Field>
            <Select style={{ width: 100 }} value={mailGubun} onChange={setMailGubun} options={MAIL_GUBUN.map(v => ({ value: v, label: v }))} />
            <SearchBar.Field label="연관펀드">
              <LookupInput width={300} value={fundName} onOpen={() => setFundOpen(true)} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="제목" value={titleText} onChange={e => setTitleText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<DcrMailHistory>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.mailHistoryId)}
            loading={loading}
            // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
      </div>
      <Dcr10_Lookup_MailViwer mail={viewing} manager onClose={() => setViewing(null)} />
      <Fnd01_Lookup_SelectSingle open={fundOpen} none="all" onResult={onFundResult} onClose={() => setFundOpen(false)} />
      <Apr01_Edit_ApprDoc apprId={apprId} onClose={() => setApprId(null)} />
    </div>
  );
};
