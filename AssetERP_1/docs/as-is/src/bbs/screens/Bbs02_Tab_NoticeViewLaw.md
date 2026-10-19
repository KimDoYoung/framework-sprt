# Bbs02_Tab_NoticeViewLaw

- 종류: 화면
- 메뉴: 준법감시 > 00. 법규정보 > 법규공지 (#1258)
- 파일: `client/vi/bbs/Bbs02_Tab_NoticeViewLaw.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs02_Notice.selectByNoticeDetailCodePaging` | Bbs02_Tab_NoticeViewLaw:64 | [`Bbs02_Notice.java:143`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByNoticeDetailCodePaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByNoticeDetailCodeTotal`](../../bbs/sql/bbs02_notice.md) |
| `sys.Sys00_Common.selectByKindCode` | Bbs02_Tab_NoticeViewLaw:86 | [`Sys00_Common.java:111`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByKindCode` | Bbs02_Tab_NoticeViewLaw:43 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`bbs02_notice`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Tab_NoticeViewLaw (`client/vi/bbs/Bbs02_Tab_NoticeViewLaw.java`, 181줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 공지구분: {noticeDetailCode} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `noticeDetailCode` CommonComboBoxField("sys.Sys09_Code.selectByKindCode", "%", "전체"), `searchText` TextField, `popup` Bbs02_Popup_NoticeAdmin
- 그리드 `grid` (buildGrid()):
  - fromDate 100 "공지일" Date
  - noticeTypeName 120 "공지구분" Text
  - noticeNo 100 "공지번호" TextCenter
  - noticeDetailName 120 "구분상세" Text
  - title 800 "제목" TextHtml
  - publicYnName 70 "공개여부" TextCenter
  - actionCell 70 "상세보기" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L47-78) → settings()
[E1] searchText.KeyPress [Enter] (L97) → retrieve()
[E2] retrieveButton[조회].Select (L106) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private viewNotice() | L134-152 | buildGrid | 팝업 Bbs02_Popup_NoticeAdmin 열기 | 업무 |
| public retrieve() | L154-176 | E1,E2,settings | 상태 처리 | 업무 |
| private settings() | L80-112 | 생성자 | 서비스 sys.Sys00_Common.selectByKindCode, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L114-132 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('fromDate', 100, '공지일'),  // L123
  gb.text('noticeTypeNm', 120, '공지구분'),  // L124
  gb.textCenter('noticeNo', 100, '공지번호'),  // L125
  gb.text('noticeDetailNm', 120, '구분상세'),  // L126
  // ⚠ 대응 없음 (GridBuilder L127) addTextHtml
  gb.textCenter('publicYnNm', 70, '공개여부'),  // L128
  // ⚠ 대응 없음 (GridBuilder L129) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

