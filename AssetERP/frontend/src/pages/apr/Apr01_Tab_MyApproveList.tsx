/**
 * [1018] 문서작성 > 04. 전자결재 > 결재내역 조회 (G01, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_MyApproveList.java (359줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L86-133: center=vlc — 툴바 2줄(조회기간 상신일/시행일 · 문서분류 / 결재상태 · 검색 · 완료/반려건 포함 · [검색] [출력/다운로드]) + 결재 문서 그리드(체크박스 단일 선택)
 * 1단계(F01~F12와 같은 사유): [상세보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc, [메일보내기]가 여는 Dcr10_Lookup_MailSender는 다른 도메인이라
 *   다음 단계에서 연결한다 — 지금은 원본의 사전 검사(폐기·완료 여부) 메시지까지만 하고 안내를 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprMyApprove } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr01_Lookup_DcrClass } from '@/pages/dcr/Dcr01_Lookup_DcrClass';

const gb = gbFor<AprMyApprove>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField("AprStatusCode", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
const ALL_TEXT = '전체';
/** 폐기된 문서의 제목에 들어 있는 표시 (원본 buildGrid L266·L284 indexOf) */
const DISPOSED_VIEW = 'style=color:#E33E31;>[폐기]';
const DISPOSED_MAIL = '[폐기]';

/** AS-IS GridBuilder.addApprStep L579-607: 굵은 글씨 가운데 정렬, 인감·승인은 파랑(#4472C4), 반려는 빨강(#DD5E5E) */
const apprStepRenderer = (p: { value?: string | null }) => {
  const v = p.value;
  if (v == null) return <b />;
  const color = v === '인감' || v === '승인' ? '#4472C4' : v === '반려' ? '#DD5E5E' : undefined;
  return <b style={color ? { color } : undefined}>{v}</b>;
};

export const Apr01_Tab_MyApproveList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L86-133) → settings() L135-257 — 열 때 자동 조회는 없다(원본 생성자는 retrieve()를 부르지 않는다)
  // settings(): 조회기간 = 오늘 -3개월 ~ 오늘(상신일 기준), 결재상태 "전체", 문서분류 "전체", [완료/반려건 포함] 체크
  const [dateType, setDateType] = useState<'reg' | 'effect'>('reg');
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(3, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_TEXT);
  const [statusCode, setStatusCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [aprYn, setAprYn] = useState(true);
  const [rows, setRows] = useState<AprMyApprove[]>([]);
  const [loading, setLoading] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const seq = useRef(0);

  const params = () => ({
    classTreeId: classTreeId ?? undefined,
    startDate: startDate.format(DATE_FORMAT),
    closeDate: closeDate.format(DATE_FORMAT),
    statusCode,
    aprYn,
    dateType,
    searchText,
  });

  // [E2] searchText.KeyPress [Enter] (L173)·[E3] searchButton[검색].Select (L181) → retrieve() L315-336: apr.Apr01_Appr.selectApprListByEmpId
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    setRows([]);       // grid.getStore().clear()
    try {
      const list = await aprApi.searchMyApprove(params());
      if (my !== seq.current) return;
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.apprId}-${i}` })));  // 같은 문서가 두 행 이상 올 수 있어 apprId만으로 행 ID를 쓸 수 없다
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E4] downLoadButton[출력/다운로드].Select (L187) → sys.Sys99_Print.insertRdApproveList + RD 리포트 Apr01_Rd_MyApproveList: 조회 조건 그대로 "결재내역 조회(시작 ~ 끝).xlsx" 받기
  const download = async () => {
    const p = params();
    try {
      await aprApi.downloadMyApproveExcel(p, `결재내역 조회(${p.startDate} ~ ${p.closeDate}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // sendMail() L338-346 — 완료(30)가 아니면 "완료되지 않은 문서입니다", 아니면 Dcr10_Lookup_MailSender.open(apprId)
  // [L338 생략] 메일 보내기 창은 다음 단계
  const sendMail = (row: AprMyApprove) => {
    if (row.statusCode !== '30') message.warning('완료되지 않은 문서입니다');
    else message.info('메일 보내기 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L259-313 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.text('statusName', 80, '결재상태', { cellRenderer: apprStepRenderer, cellStyle: { textAlign: 'center' } }),  // L297 addApprStep
    gb.date('regDate', 100, '등록(상신)일'),  // L298
    gb.textCenter('inOutTypeName', 70, '문서구분'),  // L299
    gb.textHtml('title', 400, '문서명'),  // L300 addTextHtml
    gb.text('regEmpName', 100, '상신자'),  // L301
    gb.text('nextApprName', 120, '다음결재자'),  // L302
    gb.date('effectDate', 100, '시행일'),  // L303
    gb.text('classTreeName', 170, '문서분류'),  // L304
    // L305 actionCell01(View) → 폐기 문서면 "해당문서는 폐기되어 열람이 불가능합니다", 아니면 Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback → retrieve())
    // [L305 생략] 편집창은 다음 단계
    iconCell<AprMyApprove>('view', 'actionCell', 80, '상세보기', row => {
      if ((row.title ?? '').includes(DISPOSED_VIEW)) message.warning('해당문서는 폐기되어 열람이 불가능합니다');
      else message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    }),
    // L306 actionCell02(Send) → 폐기 문서면 "해당문서는 폐기되어 메일발송이 불가능합니다", 아니면 sendMail()
    iconCell<AprMyApprove>('send', 'actionCell02', 80, '메일보내기', row => {
      if ((row.title ?? '').includes(DISPOSED_MAIL)) message.warning('해당문서는 폐기되어 메일발송이 불가능합니다');
      else sendMail(row);
    }),
    gb.text('mailYn', 70, '송신여부'),  // L307
    gb.date('myApprovalDate', 100, '나의결재일'),  // L308
    gb.date('finalApprovalDate', 100, '결재완료일'),  // L309
    gb.text('note', 200, '비고'),  // L310
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
          <SearchBar.Field label="조회기간">
            {/* [E5] toggleDate.ValueChange [radioReg.getValue()] (L245) → dateType = 'reg'(상신일) | 'effect'(시행일) */}
            <Radio.Group value={dateType} onChange={e => setDateType(e.target.value)}>
              <Radio value="reg">상신일</Radio>
              <Radio value="effect">시행일</Radio>
            </Radio.Group>
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서분류">
            {/* [E1] classTreeName.TriggerClick (L152) → Dcr01_Lookup_DcrClass.open("%", 오늘): [전체]면 "전체"·classTreeId null
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
            <SearchBar.Input style={{ width: 586 }} placeholder="문서명/문서분류/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={aprYn} onChange={e => setAprYn(e.target.checked)}>완료/반려건 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprMyApprove>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => p.data.rowKey ?? String(p.data.apprId)}
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
