# Sch10_Tab_Ipo2

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 공모주일정 (#1296)
- 파일: `client/vi/sch/Sch10_Tab_Ipo2.java`
- 함께 쓰는 클래스 3개:
  - `Sch12_Lookup_IpoCorpList` `client/vi/sch/Sch12_Lookup_IpoCorpList.java`
  - `Sch10_Lookup_Rd_IpoList` `client/vi/sch/Sch10_Lookup_Rd_IpoList.java`
  - `Sch02_Lookup_Share` `client/vi/sch/Sch02_Lookup_Share.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sch06_Lookup_AlarmSetup`](../../sch/components/Sch06_Lookup_AlarmSetup.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch02_Share.delete` | Sch02_Lookup_Share:260 | [`Sch02_Share.java:95`](../../sch/services/Sch02_Share.md) | `UpdateDataModel(sch02_share)` 동적 DELETE |
| `sch.Sch02_Share.selectByInfoId3` | Sch02_Lookup_Share:318 | [`Sch02_Share.java:51`](../../sch/services/Sch02_Share.md) | [`sch02_share.selectByInfoId3`](../../sch/sql/sch02_share.md) |
| `sch.Sch02_Share.selectShareInto` | Sch02_Lookup_Share:290 | [`Sch02_Share.java:62`](../../sch/services/Sch02_Share.md) | [`sch02_share.selectShareInto`](../../sch/sql/sch02_share.md) |
| `sch.Sch02_Share.update` | Sch02_Lookup_Share:274 | [`Sch02_Share.java:90`](../../sch/services/Sch02_Share.md) | `UpdateDataModel(sch02_share)` 동적 INSERT/UPDATE → [`sch02_share.selectById`](../../sch/sql/sch02_share.md) |
| `sch.Sch10_Ipo.selectBySearchText` | Sch10_Tab_Ipo2:359 | [`Sch10_Ipo.java:26`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectBySearchText`](../../sch/sql/sch10_ipo.md) |
| `sch.Sch11_IpoCompany.insertInterest` | Sch10_Tab_Ipo2:392 | [`Sch11_IpoCompany.java:29`](../../sch/services/Sch11_IpoCompany.md) | [`sch11_ipo_company.insertInterest`](../../sch/sql/sch11_ipo_company.md) |
| `sch.Sch12_IpoCorp.selectByCorpName` | Sch10_Tab_Ipo2:276 | [`Sch12_IpoCorp.java:33`](../../sch/services/Sch12_IpoCorp.md) | [`sch12_ipo_corp.selectByCorpName`](../../sch/sql/sch12_ipo_corp.md) |
| `sch.Sch12_IpoCorp.selectByCorpNameList` | Sch12_Lookup_IpoCorpList:113 | [`Sch12_IpoCorp.java:43`](../../sch/services/Sch12_IpoCorp.md) | [`sch12_ipo_corp.selectByCorpNameList`](../../sch/sql/sch12_ipo_corp.md) |
| `sys.Sys99_Print.insertRdIpo` | Sch10_Tab_Ipo2:212 | [`Sys99_Print.java:2631`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch10_ipo.selectBySearchText`](../../sch/sql/sch10_ipo.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`icam25_ipo`](../../../db/tables/icam.md), [`sch02_share`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md), [`sch12_ipo_corp`](../../../db/tables/sch.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch10_Tab_Ipo2 (`client/vi/sch/Sch10_Tab_Ipo2.java`, 432줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar1`: 조회일자: {dateComboBox} {startDate} ~: {closeDate} 시장구분: {marketComboBox} 검색: {searchText} {interestYn} {retrieveButton} {downLoadListButton} {homePageOpenButton}
- 툴바 `buttonBar2`: {interestButton} {interestDeleteButton} {downLoadButton} {vlcNotice}
- 입력·하위 화면: `searchText` TextField 빈칸="종목명/주간사", `startDate` MyDateField, `closeDate` MyDateField, `interestYn` CheckBox, `marketComboBox` ComboBoxField("MarketCode", "%", "전체") 빈칸="전체", `dateComboBox` ComboBoxField("IpoScheduleDateType", "수요예측일"), `lookupIpoList` Sch10_Lookup_Rd_IpoList, `lookupShare` Sch02_Lookup_Share, `lookupIpoCorp` Sch12_Lookup_IpoCorpList
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - interestName 60 "관심" TextCenter
  - marketName 100 "시장구분" TextCenter
  - itemName 250 "종목" TextBold
  - demandStartDate 95 "시작일" Date
  - demandCloseDate 95 "종료일" Date
  - subscriptionStartDate 95 "시작일" Date
  - subscriptionCloseDate 95 "종료일" Date
  - payDate 120 "납입(환불)일" Date
  - listDate 120 "상장(예정)일" Date
  - priceBracket 120 "희망공모가" TextCenter
  - price 80 "공모가" LongBold
  - note 250 "주간사" TextArea
  - actionCell 60 "바로가기" Cell 편집:siteCell
  - subscriptionRate 80 "ICAM<br>청약률(%)" DoubleHtml
  - shareInfo 150 "일정공유" Text 편집:"0069B4"
  - actionCell 30 "" Cell 편집:shareCell

#### 이벤트
[E0] 화면 열림 (생성자 L77-135) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L161) → retrieve()
[E2] retrieveButton[조회].Select (L169) → retrieve()
[E3] downLoadButton[공모주 달력].Select (L175) → 인라인 L175-192 (new SelectHandler() { @Override publi…)
[E4] downLoadListButton[출력/다운로드].Select (L193) → 서비스 sys.Sys99_Print.insertRdIpo(companyId, personId, windowClassName, dateType, startDate, closeDate, searchText, marketCode, interestYn)
[E5] homePageOpenButton[DART 바로가기].Select (L238) → 인라인 L238-243 (메시지: "https://dart.fss.or.kr")
[E6] interestButton[관심종목 등록].Select (L244) → interest()
[E7] interestDeleteButton[관심종목 제거].Select (L250) → interest()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L332-368 | 생성자,E1,E2,settings,interest | 서비스 sch.Sch10_Ipo.selectBySearchText(companyId, dateType, startDate, closeDate, searchText, marketCode, interestYn, ManagerYn) | 업무 |
| private lookupShare() | L370-380 | buildGrid | 조회창 Sch02_Lookup_Share 열기 | 업무 |
| public interest() | L382-406 | E6,E7 | 서비스 sch.Sch11_IpoCompany.insertInterest(companyId, interestYn) | 업무 |
| private lookupIpoCorpList() | L408-421 | buildGrid | 조회창 Sch12_Lookup_IpoCorpList 열기 | 업무 |
| private settings() | L137-257 | 생성자 | 조회창 Sch10_Lookup_Rd_IpoList 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdIpo(companyId, personId, windowClassName, dateType, startDate, closeDate, searchText, marketCode, interestYn), 이벤트 연결, 초기값: interestYn=false("관심종목만 보기"), startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-12-31" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L259-330 | 필드 초기화 | 미선택 시 alert "해당 주간사에 대한 주소가 없습니다. 관리자에게 문의해주세요.", 서비스 sch.Sch12_IpoCorp.selectByCorpName(corpName), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L423-425 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L426-428 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L429-431 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L307 newHeaderGroupMap05newHeaderGroupConfig12 100 "수요예측일정" (sch10_new_header_group_map05new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L308 newHeaderGroupMap07newHeaderGroupConfig12 100 "청약일정" (sch10_new_header_group_map07new_header_group_config12 컬럼 없음)
  gb.textCenter('interestNm', 60, '관심'),  // L311 SQL 계산 컬럼(selectBySearchText: (CASE WHEN COALESCE(sch11_interest_yn,'…)
  gb.textCenter('marketNm', 100, '시장구분'),  // L312 SQL 계산 컬럼(selectBySearchText: f_cdnm('MarketCode', sch10_market_cd, s…)
  // ⚠ 대응 없음 (GridBuilder L313) addTextBold
  gb.date('demandStartDate', 95, '시작일'),  // L314
  gb.date('demandCloseDate', 95, '종료일'),  // L315
  gb.date('subscriptionStartDate', 95, '시작일'),  // L316
  gb.date('subscriptionCloseDate', 95, '종료일'),  // L317
  gb.date('payDate', 120, '납입(환불)일'),  // L318
  gb.date('listDate', 120, '상장(예정)일'),  // L319
  gb.textCenter('priceBracket', 120, '희망공모가'),  // L320
  // ⚠ 대응 없음 (GridBuilder L321) addLongBold
  gb.textArea('note', 250, '주간사'),  // L322
  // ⚠ 대응 없음 (GridBuilder L323) addCell
  // ⚠ 대응 없음 (GridBuilder L325) addDoubleHtml
  gb.text('shareInfo', 150, '일정공유'),  // L326 SQL 계산 컬럼(selectBySearchText: ( SELECT CASE WHEN sch02_share_cd = '1'…)
  // ⚠ 대응 없음 (GridBuilder L327) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 인라인 L175-192 (new SelectHandler() { @Override publi…) */}>공모주 달력</Button>
3. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdIpo(companyId, personId, windowClassName, dateType, startDate, closeDate, searchText, marketCode, interestYn) */}>출력/다운로드</Button>
4. <Button type="goto" onClick={() => /* 인라인 L238-243 (메시지: "https://dart.fss.or.kr") */}>DART 바로가기</Button>
5. <Button type="save" onClick={interest}>관심종목 등록</Button>
6. <Button type="delete" onClick={interest}>관심종목 제거</Button>

### Sch12_Lookup_IpoCorpList (`client/vi/sch/Sch12_Lookup_IpoCorpList.java`, 134줄)

- 툴바 `buttonBar`: {retrieveButton} {vlcNotice}
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpName 200 "주간사명" Text
  - homepage 300 "홈페이지주소" Text

#### 이벤트
[E0] 화면 열림 (생성자 L50-96) → show()
[E1] retrieveButton[조회].Select (L57) → retrieve()
[E2] cancleButton[닫기].Select (L63) → hide()
[E3] grid.CellDoubleClick (L69) → 인라인 L69-76 (new CellDoubleClickHandler() { @Overr…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-48 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L109-124 | E1,open | 서비스 sch.Sch12_IpoCorp.selectByCorpNameList(corpName) | 업무 |
| private buildGrid() | L98-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L126-128 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L130-132 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpNm', 200, '주간사명'),  // L103
  gb.text('homepage', 300, '홈페이지주소'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch10_Lookup_Rd_IpoList (`client/vi/sch/Sch10_Lookup_Rd_IpoList.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-51) → show()
[E1] closeButton[닫기].Select (L40) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch02_Lookup_Share (`client/vi/sch/Sch02_Lookup_Share.java`, 338줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti, `lookup` Sch06_Lookup_AlarmSetup
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L148-178) → show()
[E1] anchor.MouseDown (L92) → retrieve()
[E2] insertButton[행 추가].Select (L106) → insertRow()
[E3] deleteButton[행 삭제].Select (L112) → deleteRow()
[E4] alarmButton[알람설정].Select (L118) → lookupAlarm()
[E5] updateButton[저장].Select (L155) → update()
[E6] closeButton[닫기].Select (L161) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L78-81 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L83-87 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L89-135 | open | 상태 처리 | 업무 |
| private grid() | L137-146 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L180-206 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L208-236 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L238-246 | E2 | 상태 처리 | 업무 |
| private update() | L248-283 | E5 | GridDeleteData sch.Sch02_Share.delete, sch.Sch02_Share.update | 업무 |
| private updateEnd() | L285-302 | update | 서비스 sch.Sch02_Share.selectShareInto(companyId, infoId) | 업무 |
| private deleteRow() | L304-310 | E3 | 상태 처리 | 업무 |
| private retrieve() | L312-323 | E1,open | 서비스 sch.Sch02_Share.selectByInfoId3(infoId, companyId) | 업무 |
| private lookupAlarm() | L325-332 | E4 | 조회창 Sch06_Lookup_AlarmSetup 열기 | 업무 |
| private setHtmlHeaderStyle() | L334-336 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L141 SQL 계산 컬럼(selectByInfoId3: f_cdnm('ShareCode', sch02_share_cd, sch…)
  gb.text('orgNm', 250, '부서'),  // L142 SQL 계산 컬럼(selectByInfoId3: f_org_nm(sch02_org_id, f_sysdate()))
  gb.textCenter('personNm', 100, '성명'),  // L143 SQL 계산 컬럼(selectByInfoId3: f_emp_kor_nm(sch02_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
5. <Button type="view" onClick={lookupAlarm}>알람설정</Button>

