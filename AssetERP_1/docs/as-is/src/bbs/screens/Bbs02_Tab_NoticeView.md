# Bbs02_Tab_NoticeView

- 종류: 화면
- 메뉴: 커뮤니티 > 02. 공지사항 > 공지사항 (#1065)
- 파일: `client/vi/bbs/Bbs02_Tab_NoticeView.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs02_Notice.selectByPersonIdPaging` | Bbs02_Tab_NoticeView:87 | [`Bbs02_Notice.java:125`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByPersonIdPaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByPersonIdTotal`](../../bbs/sql/bbs02_notice.md) |
| `sys.Sys09_Code.selectByCode3` | Bbs02_Tab_NoticeView:138 | [`Sys09_Code.java:115`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCode3`](../../sys/sql/sys09_code.md) |

## 테이블

[`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Tab_NoticeView (`client/vi/bbs/Bbs02_Tab_NoticeView.java`, 320줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 공지구분: {noticeTypeCombo} {noticeDetailCombo} 공지기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `noticeTypeCombo` ComboBoxField("NoticeType", "%", "전체", "전체"), `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="공지번호/공지구분/제목", `noticeDetailCombo` CommonComboBoxField("sys.Sys09_Code.selectByCode3", "%", "전체", "전체"), `popup` Bbs02_Popup_NoticeAdmin
- 그리드 `grid` (buildGrid()):
  - topYn 35 "" Pin
  - fromDate 100 "공지일" Date
  - noticeNo 100 "공지번호" TextCenter
  - noticeDetailFullName 200 "공지구분" TextHtml
  - title 600 "제목" TextHtml
  - actionCell 70 "상세보기" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-104) → settings(), setDefaultParams()
[E1] noticeTypeCombo[NoticeType].Collapse (L120) → getNoticeTypeCode(), setDateField(), retrieve(), getNoticeTypeCode(), execute(), setDateField(), retrieve()
[E2] noticeDetailCombo[sys.Sys09_Code.selectByCode3].Collapse (L166) → retrieve()
[E3] searchText.KeyPress [Enter] (L184) → retrieve()
[E4] retrieveButton[조회].Select (L192) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L52-54 | E1,settings,buildGrid,viewNotice,retrieve | 상태 처리 | 업무 |
| private setDefaultParams() | L106-114 | 생성자 | 상태 처리 | 업무 |
| private viewNotice() | L219-242 | buildGrid | 팝업 Bbs02_Popup_NoticeAdmin 열기 | 업무 |
| public retrieve() | L244-280 | E1,E2,E3,E4 | 상태 처리 | 업무 |
| private setDateField() | L282-290 | E1 | 상태 처리 | 업무 |
| private getNoticeTypeCode() | L292-299 | E1,retrieve,setDateField | 상태 처리 | 업무 |
| private getNoticeDetailCode() | L301-308 | retrieve | 상태 처리 | 업무 |
| private nvl() | L310-315 | retrieve | 상태 처리 | 업무 |
| private settings() | L116-198 | 생성자 | 서비스 sys.Sys09_Code.selectByCode3, sys.Sys09_Code.selectByCode3, 이벤트 연결, 초기값: startDate=tmpDate, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L200-217 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L317-319 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L209) addPin
  gb.date('fromDate', 100, '공지일'),  // L210
  gb.textCenter('noticeNo', 100, '공지번호'),  // L211
  // ⚠ 대응 없음 (GridBuilder L212) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L213) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L214) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

