# Ics40_Tab_DcrPreConfirm

- 종류: 화면
- 메뉴: 준법감시 > 90. 기타 > 준감인 사전확인대장 (#1425)
- 파일: `client/vi/ics/Ics40_Tab_DcrPreConfirm.java`
- 함께 쓰는 클래스 1개:
  - `Ics41_Lookup_DcrType` `client/vi/ics/Ics41_Lookup_DcrType.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Emp93_Lookup_SmsNoticeTarget`](../../emp/components/Emp93_Lookup_SmsNoticeTarget.md), [`Ics40_Edit_Msg`](../../ics/components/Ics40_Edit_Msg.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics40_DcrPreconfirm.selectByCompanyId` | Ics41_Lookup_DcrType:168 | [`Ics40_DcrPreconfirm.java:29`](../../ics/services/Ics40_DcrPreconfirm.md) | [`ics40_dcr_preconfirm.selectByCompanyId`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `ics.Ics40_DcrPreconfirm.selectByConfirm` | Ics40_Tab_DcrPreConfirm:285 | [`Ics40_DcrPreconfirm.java:64`](../../ics/services/Ics40_DcrPreconfirm.md) | [`ics40_dcr_preconfirm.selectByConfirm`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `ics.Ics40_DcrPreconfirm.updateByStatus` | Ics40_Tab_DcrPreConfirm:354 | [`Ics40_DcrPreconfirm.java:94`](../../ics/services/Ics40_DcrPreconfirm.md) | [`ics40_dcr_preconfirm.countByApprNo`](../../ics/sql/ics40_dcr_preconfirm.md), [`ics40_dcr_preconfirm.updateByStatus01`](../../ics/sql/ics40_dcr_preconfirm.md), [`ics40_dcr_preconfirm.updateByStatus02`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `ics.Ics41_DcrType.adYnCheck` | Ics40_Tab_DcrPreConfirm:167 | [`Ics41_DcrType.java:36`](../../ics/services/Ics41_DcrType.md) | [`ics41_dcr_type.adYnCheck`](../../ics/sql/ics41_dcr_type.md) |
| `ics.Ics41_DcrType.delete` | Ics41_Lookup_DcrType:296 | [`Ics41_DcrType.java:64`](../../ics/services/Ics41_DcrType.md) | `UpdateDataModel(ics41_dcr_type)` 동적 DELETE |
| `ics.Ics41_DcrType.notInDcrTypeIdList` | Ics41_Lookup_DcrType:243 | [`Ics41_DcrType.java:47`](../../ics/services/Ics41_DcrType.md) | [`ics41_dcr_type.notInDcrTypeIdList`](../../ics/sql/ics41_dcr_type.md) |
| `ics.Ics41_DcrType.selectByText` | Ics41_Lookup_DcrType:323 | [`Ics41_DcrType.java:24`](../../ics/services/Ics41_DcrType.md) | [`ics41_dcr_type.selectByText`](../../ics/sql/ics41_dcr_type.md) |
| `ics.Ics41_DcrType.update` | Ics41_Lookup_DcrType:283 | [`Ics41_DcrType.java:59`](../../ics/services/Ics41_DcrType.md) | `UpdateDataModel(ics41_dcr_type)` 동적 INSERT/UPDATE → [`ics41_dcr_type.selectById`](../../ics/sql/ics41_dcr_type.md) |
| `sys.Sys00_Common.selectIcs41DcrType` | Ics40_Tab_DcrPreConfirm:129 | [`Sys00_Common.java:181`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectIcs41DcrType`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdDcrPreConfirm` | Ics40_Tab_DcrPreConfirm:410 | [`Sys99_Print.java:5224`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics40_dcr_preconfirm.selectByConfirm`](../../ics/sql/ics40_dcr_preconfirm.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics40_Tab_DcrPreConfirm (`client/vi/ics/Ics40_Tab_DcrPreConfirm.java`, 468줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 대장분류: {dcrTypeComboBox} 검색: {searchText} {retrieveButton} {excelDownloadButton} {confirmButton} {cancelButton} {settingButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="심사필번호/제공처/내용/신청자/대장분류", `dcrTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectIcs41DcrType", "%", "전체", "전체"), `lookup` Ics41_Lookup_DcrType, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 90 "신청일" Date
  - dcrTypeName 100 "대장분류" Text
  - apprNoPrefix 120 "심사필번호" TextCenter
  - provideCo 120 "제공처" Text
  - content 360 "내용" TextArea
  - personName 180 "신청자" Text
  - actionCell 70 "문서확인" Cell 편집:viewAppr
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - confirmerName 100 "승인자" TextCenter
  - confirmDate 90 "승인일" Date
  - statusName 100 "승인여부" TextStatus
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - msgYnStr 80 "의견" TextCenter
  - actionCell 27 " " Cell 편집:actionCell
  - adTypeName 100 "광고종류" Text
  - mediaTypeName 100 "매체종류" Text
  - adItemName 100 "광고상품명" Text
  - adContent 100 "광고내용" Text
  - startDate 100 "최초<br>사용예정일" Date
  - closeDate 100 "최종<br>사용예정일" Date
  - spec 100 "규격" Text
  - qtyCnt 100 "수량/회수" Text
  - preApprNo 100 "과거<br>심사필번호 " TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L82-119) → settings()
[E1] dcrTypeComboBox[sys.Sys00_Common.selectIcs41DcrType].Collapse (L137) → retrieve()
[E2] searchText.KeyPress [Enter] (L146) → retrieve()
[E3] retrieveButton[조회].Select (L155) → retrieve()
[E4] excelDownloadButton[엑셀다운로드].Select (L161) → downLoad()
[E5] confirmButton[승인].Select (L195) → updateChk()
       └ [E9] msgBox.DialogHide [YES] (L320) → update()
[E6] cancelButton[취소].Select (L201) → updateChk()
[E7] settingButton[대장분류설정].Select (L207) → 인라인 L207-213 (new SelectHandler() { @Override publi…)
[E8] noticeButton[알림설정].Select (L214) → 인라인 L214-220 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L276-291 | E1,E2,E3,settings,buildGrid,update | 서비스 ics.Ics40_DcrPreconfirm.selectByConfirm(companyId, startDate, closeDate, dcrTypeCode, searchText) | 업무 |
| private updateChk() | L293-335 | E5,E6 | 미선택 시 alert "이미 승인처리된 내용이 포함되어있습니다" → 확인창 E9 | 업무 |
| private update() | L337-370 | E9 | 미선택 시 alert, 서비스 ics.Ics40_DcrPreconfirm.updateByStatus(statusCode, confirmerId) | 업무 |
| private viewAppr() | L372-395 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다" | 업무 |
| private downLoad() | L397-463 | E4 | 서비스 sys.Sys99_Print.insertRdDcrPreConfirm(companyId, personId, windowClassName, startDate, closeDate, dcrTypeCode, searchText) | 업무 |
| private settings() | L121-221 | 생성자 | 조회창 Ics41_Lookup_DcrType 열기, 조회창 Emp93_Lookup_SmsNoticeTarget 열기, 서비스 sys.Sys00_Common.selectIcs41DcrType, ics.Ics41_DcrType.adYnCheck(dcrTypeCode, companyId), 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-MM-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L223-274 | 필드 초기화 | 팝업 Ics40_Edit_Msg 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L465-467 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '신청일'),  // L246
  gb.text('dcrTypeNm', 100, '대장분류'),  // L247 SQL 계산 컬럼(selectByConfirm: ics41_dcr_type_nm)
  gb.textCenter('apprNoPrefix', 120, '심사필번호'),  // L248
  gb.text('provideCo', 120, '제공처'),  // L249
  gb.textArea('content', 360, '내용'),  // L250
  gb.text('personNm', 180, '신청자'),  // L251 SQL 계산 컬럼(selectByConfirm: ( f_emp_kor_nm(ics40_person_id) ||'(' |…)
  // ⚠ 대응 없음 (GridBuilder L252) addCell
  // ⚠DB없음 L254 newHeaderGroupMap012newHeaderGroupConfig110 100 "광고물 추가정보" (ics40_new_header_group_map012new_header_group_config110 컬럼 없음)
  gb.textCenter('confirmerNm', 100, '승인자'),  // L255 SQL 계산 컬럼(selectByConfirm: f_emp_kor_nm(ics40_confirmer_id))
  gb.date('confirmDate', 90, '승인일'),  // L256
  gb.textStatus('statusNm', 100, '승인여부'),  // L257 SQL 계산 컬럼(selectByConfirm: f_cdnm('StatusCode', ics40_status_cd, i…)
  // ⚠DB없음 L259 newHeaderGroupMap09newHeaderGroupConfig110 100 "광고물 추가정보" (ics40_new_header_group_map09new_header_group_config110 컬럼 없음)
  gb.textCenter('msgYnStr', 80, '의견'),  // L261 SQL 계산 컬럼(selectByConfirm: ( CASE WHEN ics40_confirm_msg IS NOT NU…)
  // ⚠ 대응 없음 (GridBuilder L262) addCell
  gb.text('adTypeNm', 100, '광고종류'),  // L263 SQL 계산 컬럼(selectByConfirm: f_cdnm('AdType', ics40_ad_type, ics40_c…)
  gb.text('mediaTypeNm', 100, '매체종류'),  // L264 SQL 계산 컬럼(selectByConfirm: f_cdnm('MediaType', ics40_media_type, i…)
  gb.text('adItemNm', 100, '광고상품명'),  // L265
  gb.text('adContent', 100, '광고내용'),  // L266
  gb.date('startDate', 100, '최초<br>사용예정일'),  // L267
  gb.date('closeDate', 100, '최종<br>사용예정일'),  // L268
  gb.text('spec', 100, '규격'),  // L269
  gb.text('qtyCnt', 100, '수량/회수'),  // L270
  gb.textCenter('preApprNo', 100, '과거<br>심사필번호 '),  // L271
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={downLoad}>엑셀다운로드</Button>
3. <Button type="save" onClick={updateChk}>승인</Button>
4. <Button type="cancel" onClick={updateChk}>취소</Button>
5. <Button type="register" onClick={() => /* 인라인 L207-213 (new SelectHandler() { @Override publi…) */}>대장분류설정</Button>
6. <Button type="save" onClick={() => /* 인라인 L214-220 (new SelectHandler() { @Override publi…) */}>알림설정</Button>

### Ics41_Lookup_DcrType (`client/vi/ics/Ics41_Lookup_DcrType.java`, 334줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스):
  - dcrTypeCode 100 "분류코드" TextCenter 편집:TextField
  - dcrTypeName 200 "분류명" Text 편집:TextField
  - adYn 100 "광고물" Boolean
  - useYn 100 "사용여부" Boolean

#### 이벤트
[E1] retrieveButton[조회].Select (L90) → retrieve()
[E2] updateButton[저장].Select (L96) → checkGrid01()
[E3] insertButton[등록].Select (L102) → insert()
[E4] deleteButton[삭제].Select (L108) → checkGrid01()
[E5] closeButton[닫기].Select (L114) → hide()
[E6] msgBox.DialogHide [YES] (L289) → 서비스 ics.Ics41_DcrType.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-87 | 공개 메서드 | 상태 처리 | 업무 |
| private checkGrid01() | L134-235 | E2,E4 | 미선택 시 alert "분류코드는 필수입력항목입니다", 서비스 ics.Ics40_DcrPreconfirm.selectByCompanyId(companyId) | 업무 |
| private checkGrid02() | L237-279 | checkGrid01 | 서비스 ics.Ics41_DcrType.notInDcrTypeIdList(companyId, dcrTypeIdList) | 업무 |
| private update() | L281-284 | checkGrid02 | 서비스 ics.Ics41_DcrType.update | 업무 |
| private delete() | L286-306 | checkGrid02 | 확인창 표시, GridDeleteData ics.Ics41_DcrType.delete(체크된 행 목록) | 업무 |
| private insert() | L308-314 | E3 | 상태 처리 | 업무 |
| public retrieve() | L316-329 | E1,open | 서비스 ics.Ics41_DcrType.selectByText(companyId, searchText, useYn) | 업무 |
| private settings() | L89-120 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L122-132 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L331-333 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('dcrTypeCd', 100, '분류코드', { editor: 'text' }),  // L126
  gb.text('dcrTypeNm', 200, '분류명', { editor: 'text' }),  // L127
  gb.boolean('adYn', 100, '광고물'),  // L128
  gb.boolean('useYn', 100, '사용여부'),  // L129
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={checkGrid01}>저장</Button>
3. <Button type="register" onClick={insert}>등록</Button>
4. <Button type="delete" onClick={checkGrid01}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

