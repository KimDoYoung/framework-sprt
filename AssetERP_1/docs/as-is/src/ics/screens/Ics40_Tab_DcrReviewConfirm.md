# Ics40_Tab_DcrReviewConfirm

- 종류: 화면
- 메뉴: 준법감시 > 90. 기타 > 심사필 확인대장 (#1499)
- 파일: `client/vi/ics/Ics40_Tab_DcrReviewConfirm.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Emp93_Lookup_SmsNoticeTarget`](../../emp/components/Emp93_Lookup_SmsNoticeTarget.md), [`Ics40_Edit_Msg`](../../ics/components/Ics40_Edit_Msg.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics40_DcrPreconfirm.selectByReviewConfirm` | Ics40_Tab_DcrReviewConfirm:205 | [`Ics40_DcrPreconfirm.java:78`](../../ics/services/Ics40_DcrPreconfirm.md) | [`ics40_dcr_preconfirm.selectByReviewConfirm`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `sys.Sys00_Common.selectIcs41DcrType` | Ics40_Tab_DcrReviewConfirm:101 | [`Sys00_Common.java:181`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectIcs41DcrType`](../../sys/sql/sys09_code.md) |

## 테이블

[`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics40_Tab_DcrReviewConfirm (`client/vi/ics/Ics40_Tab_DcrReviewConfirm.java`, 241줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 대장분류: {dcrTypeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="심사필번호/제공처/내용/신청자/대장분류", `dcrTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectIcs41DcrType", "%", "전체", "전체"), `lookup` Emp93_Lookup_SmsNoticeTarget, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 90 "신청일" Date
  - dcrTypeName 100 "대장분류" Text
  - apprNoPrefix 120 "심사필번호" TextCenter
  - provideCo 120 "제공처" Text
  - content 360 "내용" TextArea
  - personName 180 "신청자" Text
  - actionCell 70 "문서확인" Cell 편집:actionCell01
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - confirmerName 100 "승인자" TextCenter
  - confirmDate 90 "승인일" Date
  - statusName 100 "승인여부" TextStatus
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - msgYnStr 80 "의견" TextCenter
  - actionCell 27 " " Cell 편집:actionCell02
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
[E0] 화면 열림 (생성자 L62-91) → settings()
[E1] dcrTypeComboBox[sys.Sys00_Common.selectIcs41DcrType].Collapse (L109) → retrieve()
[E2] searchText.KeyPress [Enter] (L118) → retrieve()
[E3] retrieveButton[조회].Select (L127) → retrieve()
[E4] noticeButton[알림설정].Select (L133) → 인라인 L133-139 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L194-211 | E1,E2,E3,settings | 서비스 ics.Ics40_DcrPreconfirm.selectByReviewConfirm(companyId, empId, orgId, startDate, closeDate, dcrTypeCode, searchText) | 업무 |
| private viewAppr() | L213-236 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다" | 업무 |
| private settings() | L93-140 | 생성자 | 조회창 Emp93_Lookup_SmsNoticeTarget 열기, 서비스 sys.Sys00_Common.selectIcs41DcrType, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-MM-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L142-192 | 필드 초기화 | 팝업 Ics40_Edit_Msg 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '신청일'),  // L158
  gb.text('dcrTypeNm', 100, '대장분류'),  // L159 SQL 계산 컬럼(selectByReviewConfirm: ics41_dcr_type_nm)
  gb.textCenter('apprNoPrefix', 120, '심사필번호'),  // L160
  gb.text('provideCo', 120, '제공처'),  // L161
  gb.textArea('content', 360, '내용'),  // L162
  gb.text('personNm', 180, '신청자'),  // L163 SQL 계산 컬럼(selectByReviewConfirm: ( f_emp_kor_nm(ics40_person_id) ||'(' |…)
  // ⚠ 대응 없음 (GridBuilder L164) addCell
  // ⚠DB없음 L168 newHeaderGroupMap012newHeaderGroupConfig110 100 "광고물 추가정보" (ics40_new_header_group_map012new_header_group_config110 컬럼 없음)
  gb.textCenter('confirmerNm', 100, '승인자'),  // L169 SQL 계산 컬럼(selectByReviewConfirm: f_emp_kor_nm(ics40_confirmer_id))
  gb.date('confirmDate', 90, '승인일'),  // L170
  gb.textStatus('statusNm', 100, '승인여부'),  // L171 SQL 계산 컬럼(selectByReviewConfirm: f_cdnm('StatusCode', ics40_status_cd, i…)
  // ⚠DB없음 L175 newHeaderGroupMap09newHeaderGroupConfig110 100 "광고물 추가정보" (ics40_new_header_group_map09new_header_group_config110 컬럼 없음)
  gb.textCenter('msgYnStr', 80, '의견'),  // L179 SQL 계산 컬럼(selectByReviewConfirm: ( CASE WHEN ics40_confirm_msg IS NOT NU…)
  // ⚠ 대응 없음 (GridBuilder L180) addCell
  gb.text('adTypeNm', 100, '광고종류'),  // L181 SQL 계산 컬럼(selectByReviewConfirm: f_cdnm('AdType', ics40_ad_type, ics40_c…)
  gb.text('mediaTypeNm', 100, '매체종류'),  // L182 SQL 계산 컬럼(selectByReviewConfirm: f_cdnm('MediaType', ics40_media_type, i…)
  gb.text('adItemNm', 100, '광고상품명'),  // L183
  gb.text('adContent', 100, '광고내용'),  // L184
  gb.date('startDate', 100, '최초<br>사용예정일'),  // L185
  gb.date('closeDate', 100, '최종<br>사용예정일'),  // L186
  gb.text('spec', 100, '규격'),  // L187
  gb.text('qtyCnt', 100, '수량/회수'),  // L188
  gb.textCenter('preApprNo', 100, '과거<br>심사필번호 '),  // L189
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={() => /* 인라인 L133-139 (new SelectHandler() { @Override publi…) */}>알림설정</Button>

