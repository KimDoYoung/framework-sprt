/**
 * [1023] 문서작성 > 05. 메일관리 > 발신메일목록 (G14)
 * AS-IS: myApp/client/vi/dcr/Dcr10_Tab_MailHistory.java (247줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L66-95: center(테두리, 여백 20) — 툴바 [발신일자 시작~끝][메일구분 콤보 100][연관펀드 300][검색 200 빈칸 "제목"][조회] + 그리드(단일 선택, 행번호, 8열:
 *   보낸시간 150 · 발신자 100 · 발신 150 · 수신 300 · 참조 300 · 제목 300 · 내용 60 · 문서 60)
 * 1단계(G01~G06과 같은 사유): ① [문서] 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(apr) ② 연관펀드 조회창 Fnd01_Lookup_SelectSingle(fnd, 큰 SQL)은
 *   다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다. 연관펀드 조건을 받는 서버(`fundId`)는 구현해 두었다.
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
import { Dcr10_Lookup_MailViwer } from './Dcr10_Lookup_MailViwer';

const gb = gbFor<DcrMailHistory>();
const DATE_FORMAT = 'YYYY-MM-DD';
const MAIL_GUBUN = ['전체', '개인메일', '공용메일'];

export const Dcr10_Tab_MailHistory: React.FC = () => {
  // settings() L97-148: 발신일자 = 이번 달 1일 ~ 말일, 메일구분 "전체", 연관펀드 "전체", 검색칸 빈칸 "제목"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [mailGubun, setMailGubun] = useState('전체');
  const [fundName] = useState('전체');
  const [titleText, setTitleText] = useState('');
  const [rows, setRows] = useState<DcrMailHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState<DcrMailHistory | null>(null);

  // retrieve() L224-242: 서비스 dcr.Dcr10_MailHistory.selectBySenderEmail(empId, startDate, endDate, titleText, fundId, mailGubun), 끝나면 첫 행 선택
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await dcrMailHistoryApi.searchMailHistories({
        startDate: startDate.format(DATE_FORMAT), endDate: endDate.format(DATE_FORMAT), titleText, mailGubun,
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

  // [E2] fundName.TriggerClick (L134) → openLookupOpr() L207-222: Fnd01_Lookup_SelectSingle.openNone(callback)
  // [E2 생략] 펀드 조회창은 다른 도메인(fnd)이라 다음 단계
  const openLookupOpr = () => message.info('펀드 조회창은 다음 단계에서 연결됩니다');

  // buildGrid() L150-205
  const columnDefs = useMemo(() => [
    gb.text('sendTimeString', 150, '보낸시간'),  // L194
    gb.textCenter('personName', 100, '발신자'),  // L195
    gb.text('senderEmail', 150, '발신'),  // L196
    gb.text('receiverEmail', 300, '수신'),  // L197
    gb.text('referencerEmail', 300, '참조'),  // L198
    gb.text('titleText', 300, '제목'),  // L199
    // L151-158 actionCell1(Detail) → Dcr10_Lookup_MailViwer.open(선택한 행)
    iconCell<DcrMailHistory>('view', 'contentCell', 60, '내용', row => setViewing(row)),
    // L159-192 actionCell2(Detail): aprId가 없으면 "해당 메일의 연관된 문서가 존재하지않습니다", 있으면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …)
    // [L184 생략] 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인(apr)이라 다음 단계
    iconCell<DcrMailHistory>('view', 'docCell', 60, '문서', row => {
      if (row.aprId == null) {
        message.warning('해당 메일의 연관된 문서가 존재하지않습니다');
        return;
      }
      message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    }),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        {/* [E1] titleTextField.KeyPress [Enter] (L123) → retrieve(), [E3] retrieveButton[조회].Select (L140) → retrieve() */}
        <div style={{ overflowX: 'auto' }}>
          <SearchBar onSearch={retrieve} loading={loading} style={{ flexWrap: 'nowrap' }}>
            <SearchBar.Field label="발신일자">
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
              <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
            </SearchBar.Field>
            <Select style={{ width: 100 }} value={mailGubun} onChange={setMailGubun} options={MAIL_GUBUN.map(v => ({ value: v, label: v }))} />
            <SearchBar.Field label="연관펀드">
              <LookupInput width={300} value={fundName} onOpen={openLookupOpr} />
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
      <Dcr10_Lookup_MailViwer mail={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};
