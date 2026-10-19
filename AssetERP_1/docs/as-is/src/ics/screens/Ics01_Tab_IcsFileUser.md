# Ics01_Tab_IcsFileUser

- 종류: 화면
- 메뉴: 준법감시 > 00. 법규정보 > 법규보고 서식파일 (#1009)
- 파일: `client/vi/ics/Ics01_Tab_IcsFileUser.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.getIcsFile` | Ics01_Tab_IcsFileUser:114 | [`Sys10_File.java:81`](../../sys/services/Sys10_File.md) | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_IcsFileUser (`client/vi/ics/Ics01_Tab_IcsFileUser.java`, 135줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton} {fileDownloadForm}
- 입력·하위 화면: `searchTextField` TextField
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - lawName 150 "법령구분" Text
  - note 150 "내용" Text
  - regDate 100 "등록일" Date
  - fileName 500 "서식파일" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L40-79) → show(), retrieve()
[E1] retrieveButton[조회].Select (L42) → retrieve()
[E2] searchTextField.KeyPress [Enter] (L48) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L81-104 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L106-130 | 생성자,E1,E2 | 서비스 sys.Sys10_File.getIcsFile(parentId, lawType, searchText) | 업무 |
| private setHtmlBarStyle() | L132-134 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('lawNm', 150, '법령구분'),  // L97 SQL 계산 컬럼(getIcsFile: f_cdnm('LawType', sys10_law_type, 0, f_…)
  gb.text('note', 150, '내용'),  // L98
  gb.date('regDate', 100, '등록일'),  // L99
  gb.text('fileNm', 500, '서식파일'),  // L100
  // ⚠ 대응 없음 (GridBuilder L101) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

