# Ics01_Tab_FileList

- 종류: 화면
- 파일: `client/vi/ics/Ics01_Tab_FileList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys11_RelateFile.selectBySeachText` | Ics01_Tab_FileList:153 | [`Sys11_RelateFile.java:49`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectBySeachText`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_ics_class_tree_nm_allpath`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_FileList (`client/vi/ics/Ics01_Tab_FileList.java`, 182줄)

- 레이아웃: center=vlc
- 입력·하위 화면: `searchText` TextField 빈칸="법규명/서식파일명"
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fullPathName 700 "법규명" Text
  - fileName 500 "서식파일" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L52-116) → retrieve(), show()
[E1] fileUploadForm.SubmitComplete (L59) → resetFileUpload(), retrieve()
[E2] retrieveButton[조회].Select (L70) → retrieve()
[E3] fileUpload.Change (L76) → 인라인 L76-83 (new ChangeHandler() { @Override publi…)
[E4] searchText.KeyPress [Enter] (L87) → retrieve()
[E5] fileUpload.Change (L168) → 인라인 L168-175 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L118-138 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L140-159 | 생성자,E1,E2,E4 | 서비스 sys.Sys11_RelateFile.selectBySeachText(companyId, searchText) | 업무 |
| private resetFileUpload() | L161-176 | E1 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fullPathNm', 700, '법규명'),  // L133 SQL 계산 컬럼(selectBySeachText: f_ics_class_tree_nm_allpath(ics01_class…)
  gb.text('fileNm', 500, '서식파일'),  // L134 SQL 계산 컬럼(selectBySeachText: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L135) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

