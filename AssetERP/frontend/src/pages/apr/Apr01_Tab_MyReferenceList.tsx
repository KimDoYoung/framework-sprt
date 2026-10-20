/**
 * [1093] 문서작성 > 04. 전자결재 > 참조내역 조회 (G03, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_MyReferenceList.java (355줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L79-117: center=vlc — 툴바 2줄(등록기간 · 문서분류 / 결재상태 · 검색 · 완료/반려건 포함 · [검색] [출력/다운로드]) + 참조 문서 그리드(체크박스 단일 선택)
 * 1단계(F01~F12·G01·G02와 같은 사유): [상세보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc, [메일보내기]가 여는 Dcr10_Lookup_MailSender는 다른 도메인이라
 *   다음 단계에서 연결한다 — 지금은 원본의 사전 검사 메시지까지만 하고 안내를 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprMyReference } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr01_Lookup_DcrClass } from '@/pages/dcr/Dcr01_Lookup_DcrClass';

const gb = gbFor<AprMyReference>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField("AprStatusCode", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
const ALL_TEXT = '전체';
/** 폐기된 문서의 제목에 들어 있는 표시 (원본 buildGrid editDocCell indexOf, 메일은 sendMailCell '[폐기]') */
const DISPOSED_VIEW = 'style=color:#E33E31;>[폐기]';
const DISPOSED_MAIL = '[폐기]';

export const Apr01_Tab_MyReferenceList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L79-117) → settings() L119-229 — 열 때 자동 조회는 없다(원본 생성자는 retrieve()를 부르지 않는다)
  // settings(): 등록기간 = 오늘 -7일 ~ 오늘, 결재상태 "전체", 문서분류 "전체", [완료/반려건 포함] 체크
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(7, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_TEXT);
  const [statusCode, setStatusCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [aprYn, setAprYn] = useState(true);
  const [rows, setRows] = useState<AprMyReference[]>([]);
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

  // [E2] searchText.KeyPress [Enter] (L159)·[E3] searchButton[검색].Select (L167) → retrieve() L298-317: apr.Apr01_Appr.selectByReferenceEmpId
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    setRows([]);       // grid.getStore().clear()
    try {
      const list = await aprApi.searchMyReference(params());
      if (my !== seq.current) return;
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.apprId}-${i}` })));  // 참조 단계 조인으로 같은 문서가 두 행 이상 올 수 있어 apprId만으로 행 ID를 쓸 수 없다
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E5] grid.SelectionChanged [선택>0] (L222) → 인라인 L222-228: 본문이 비어 있다(`if (size > 0) {}`) — 할 일 없음. 선택 행은 아이콘 클릭이 바로 쓴다
  // [E4] downLoadButton[출력/다운로드].Select (L173) → sys.Sys99_Print.insertRdReferenceList + RD 리포트 Apr01_Rd_MyReferenceList: 조회 조건 그대로 "참조내역 조회(시작 ~ 끝).xlsx" 받기
  const download = async () => {
    const p = params();
    try {
      await aprApi.downloadMyReferenceExcel(p, `참조내역 조회(${p.startDate} ~ ${p.closeDate}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // sendMail() L338-346 — 완료(30)가 아니면 "완료되지 않은 문서입니다", 아니면 Dcr10_Lookup_MailSender.open(apprId)
  // [생략] 메일 보내기 창은 다음 단계
  const sendMail = (row: AprMyReference) => {
    if (row.statusCode !== '30') message.warning('완료되지 않은 문서입니다');
    else message.info('메일 보내기 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L231-296 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '상신일'),  // L281
    gb.date('effectDate', 100, '시행일'),  // L282
    gb.text('statusName', 80, '결재상태'),  // L283
    gb.text('classTreeName', 170, '문서분류'),  // L284
    gb.textCenter('inOutTypeName', 70, '문서구분'),  // L285
    gb.textHtml('title', 400, '문서명'),  // L286 addTextHtml
    // editDocCell(View) → 폐기 문서면 "해당문서는 폐기되어 열람이 불가능합니다", 아니면 ApprCallbackResult(열람권한 없으면 "해당문서의 열람권한이 없습니다") → Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback → retrieveOne L319-336)
    // [생략] 편집창은 다음 단계
    iconCell<AprMyReference>('view', 'actionCell', 80, '상세보기', row => {
      if ((row.title ?? '').includes(DISPOSED_VIEW)) message.warning('해당문서는 폐기되어 열람이 불가능합니다');
      else message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    }),
    // sendMailCell(Send) → 폐기 문서면 "해당문서는 폐기되어 메일발송이 불가능합니다", 아니면 sendMail()
    iconCell<AprMyReference>('send', 'actionCell02', 80, '메일보내기', row => {
      if ((row.title ?? '').includes(DISPOSED_MAIL)) message.warning('해당문서는 폐기되어 메일발송이 불가능합니다');
      else sendMail(row);
    }),
    gb.text('mailYn', 70, '송신여부'),  // L289
    gb.text('regEmpName', 100, '상신자'),  // L290
    gb.text('recentApprovalName', 150, '최근결재자'),  // L291
    gb.date('recentApprovalDate', 100, '최근결재일'),  // L292
    gb.text('note', 200, '비고'),  // L293
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
            {/* [E1] classTreeName.TriggerClick (L137) → Dcr01_Lookup_DcrClass.open("%", 오늘): [전체]면 "전체"·classTreeId null
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
          <SingleGrid<AprMyReference>
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
