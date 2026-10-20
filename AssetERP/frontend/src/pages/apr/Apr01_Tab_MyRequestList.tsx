/**
 * [1019] 문서작성 > 04. 전자결재 > 상신내역 조회 (G02, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_MyRequestList.java (423줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L82-120: center=vlc — 툴바 2줄(등록기간 · 문서분류 / 결재상태 · 검색 · 완료/반려건 포함 · [검색] [출력/다운로드]) + 상신 문서 그리드(체크박스 단일 선택)
 * 1단계(F01~F12·G01과 같은 사유): [상세보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc, [신청]이 여는 Ics40_Edit_DcrPreconfirm,
 *   준감인의견 아이콘이 여는 Ics40_Edit_Msg, [메일보내기]가 여는 Dcr10_Lookup_MailSender는 다른 도메인이라 다음 단계에서 연결한다 — 지금은 원본의 사전 검사 메시지까지만 하고 안내를 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprMyRequest } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr01_Lookup_DcrClass } from '@/pages/dcr/Dcr01_Lookup_DcrClass';

const gb = gbFor<AprMyRequest>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField("AprStatusCode", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
const ALL_TEXT = '전체';
/** 폐기된 문서의 제목에 들어 있는 표시 (원본 buildGrid actionCell01 indexOf, 메일은 actionCell04 '[폐기]') */
const DISPOSED_VIEW = 'style=color:#E33E31;>[폐기]';
const DISPOSED_MAIL = '[폐기]';

export const Apr01_Tab_MyRequestList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L82-120) → settings() L122-228 — 열 때 자동 조회는 없다(원본 생성자는 retrieve()를 부르지 않는다)
  // settings(): 등록기간 = 오늘 -7일 ~ 오늘, 결재상태 "전체", 문서분류 "전체", [완료/반려건 포함] 체크
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(7, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_TEXT);
  const [statusCode, setStatusCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [aprYn, setAprYn] = useState(true);
  const [rows, setRows] = useState<AprMyRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const seq = useRef(0);

  const params = () => ({
    classTreeId: classTreeId ?? undefined,
    startDate: startDate.format(DATE_FORMAT),
    closeDate: closeDate.format(DATE_FORMAT),
    statusCode,
    aprYn,
    searchText,
  });

  // [E2] searchText.KeyPress [Enter] (L161)·[E3] searchButton[검색].Select (L169) → retrieve() L366-385: apr.Apr01_Appr.selectByRequestEmpId
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    setRows([]);       // grid.getStore().clear()
    try {
      const list = await aprApi.searchMyRequest(params());
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E5] grid.SelectionChanged [선택>0] (L221) → 인라인 L221-227: 본문이 비어 있다(`if (size > 0) {}`) — 할 일 없음. 선택 행은 아이콘 클릭이 바로 쓴다
  // [E4] downLoadButton[출력/다운로드].Select (L175) → sys.Sys99_Print.insertRdRequestList + RD 리포트 Apr01_Rd_MyRequestList: 조회 조건 그대로 "상신내역 조회(시작 ~ 끝).xlsx" 받기
  const download = async () => {
    const p = params();
    try {
      await aprApi.downloadMyRequestExcel(p, `상신내역 조회(${p.startDate} ~ ${p.closeDate}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // sendMail() L406-414 — 완료(30)가 아니면 "완료되지 않은 문서입니다", 아니면 Dcr10_Lookup_MailSender.open(apprId)
  // [생략] 메일 보내기 창은 다음 단계
  const sendMail = (row: AprMyRequest) => {
    if (row.statusCode !== '30') message.warning('완료되지 않은 문서입니다');
    else message.info('메일 보내기 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L230-364 (체크박스 단일 선택, 머리글 묶음 "준법감시인 사전확인" = 신청·상태·준감인의견·아이콘 4열)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '상신일'),  // L346
    gb.date('effectDate', 100, '시행일'),  // L347
    gb.textStatus('statusName', 80, '결재상태'),  // L348
    gb.text('classTreeName', 170, '문서분류'),  // L349
    gb.textCenter('inOutTypeName', 70, '문서구분'),  // L350
    gb.textHtml('title', 360, '문서명'),  // L351 addTextHtml
    // actionCell01(View) → 폐기 문서면 "해당문서는 폐기되어 열람이 불가능합니다", 아니면 Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback → retrieveOne)
    // [생략] 편집창은 다음 단계
    iconCell<AprMyRequest>('view', 'actionCell', 80, '상세보기', row => {
      if ((row.title ?? '').includes(DISPOSED_VIEW)) message.warning('해당문서는 폐기되어 열람이 불가능합니다');
      else message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    }),
    gb.group('준법감시인 사전확인', [
      // actionCell02(Edit) → 완료(30)가 아니면 "결재완료 후 신청할 수 있습니다", 아니면 ics.Ics40_DcrPreconfirm.selectByApprId → Ics40_Edit_DcrPreconfirm.edit/insert
      // [생략] 준법감시인 사전확인 신청창은 다음 단계
      iconCell<AprMyRequest>('edit', 'actionCell02', 70, '신청', row => {
        if (row.statusCode !== '30') message.warning('결재완료 후 신청할 수 있습니다');
        else message.info('준법감시인 사전확인 신청 창은 다음 단계에서 연결됩니다');
      }),
      gb.textCenter('preconfirmStatusName', 70, '상태'),  // L354
      gb.textCenter('preconfirmMsgYnStr', 90, '준감인의견'),  // L355
      // actionCell03(View) → 준감인의견이 "있음"이 아니면 "준감인의견이 존재하지 않습니다", 아니면 ics.Ics40_DcrPreconfirm.selectByApprId → Ics40_Edit_Msg.editRegEmpMsg
      // [생략] 준감인의견 창은 다음 단계
      iconCell<AprMyRequest>('view', 'actionCell03', 27, ' ', row => {
        if (row.preconfirmMsgYnStr !== '있음') message.warning('준감인의견이 존재하지 않습니다');
        else message.info('준감인의견 창은 다음 단계에서 연결됩니다');
      }),
    ]),
    // actionCell04(Send) → 폐기 문서면 "해당문서는 폐기되어 메일발송이 불가능합니다", 아니면 sendMail()
    iconCell<AprMyRequest>('send', 'actionCell04', 80, '메일보내기', row => {
      if ((row.title ?? '').includes(DISPOSED_MAIL)) message.warning('해당문서는 폐기되어 메일발송이 불가능합니다');
      else sendMail(row);
    }),
    gb.text('mailYn', 70, '송신여부'),  // L358
    gb.text('recentApprovalName', 150, '최근결재자'),  // L359
    gb.date('recentApprovalDate', 100, '최근결재일'),  // L360
    gb.text('note', 200, '비고'),  // L361
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={() => void retrieve()}
          searchText="검색"
          loading={loading}
          extra={(
            <>
              {/* [E4] downLoadButton[출력/다운로드] */}
              <Button type="download" onClick={download}>출력/다운로드</Button>
            </>
          )}
        >
          <SearchBar.Field label="등록기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서분류">
            {/* [E1] classTreeName.TriggerClick (L139) → Dcr01_Lookup_DcrClass.open("%", 오늘): [전체]면 "전체"·classTreeId null
                (색인의 "[result == null] → execute()"는 콜백 안 분기를 이벤트 조건으로 잘못 읽은 것) */}
            <LookupInput
              value={classTreeName}
              width={300}
              placeholder="전체"
              onOpen={() => setClassOpen(true)}
              onClear={() => { setClassTreeId(null); setClassTreeName(ALL_TEXT); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="결재상태">
            <SystemCodeComboBox kindCd="AprStatusCode" altCode={ALL_CODE} style={{ width: 132 }} value={statusCode} onChange={c => setStatusCode(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 481 }} placeholder="문서명/문서분류/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={aprYn} onChange={e => setAprYn(e.target.checked)}>완료/반려건 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprMyRequest>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
      <Dcr01_Lookup_DcrClass
        open={classOpen}
        onResult={r => { setClassTreeId(r.classTreeId); setClassTreeName(r.classTreeFullName); }}
        onAll={() => { setClassTreeId(null); setClassTreeName(ALL_TEXT); }}
        onClose={() => setClassOpen(false)}
      />
    </div>
  );
};
