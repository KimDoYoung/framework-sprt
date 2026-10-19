# Fnd06_Tab_OfficeWorkManager

- 종류: 화면
- 메뉴: I/F > 91. 기관정보관리(관리자) > 사무수탁사정보 관리(관리자) (#1094)
- 파일: `client/vi/fnd/Fnd06_Tab_OfficeWorkManager.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd06_OfficeWork.selectByCompanyId0` | Fnd06_Tab_OfficeWorkManager:132 | [`Fnd06_OfficeWork.java:50`](../../fnd/services/Fnd06_OfficeWork.md) | [`fnd06_office_work.selectByCompanyId0`](../../fnd/sql/fnd06_office_work.md) |
| `fnd.Fnd06_OfficeWork.selectIcamOfficeWork` | Fnd06_Tab_OfficeWorkManager:160 | [`Fnd06_OfficeWork.java:155`](../../fnd/services/Fnd06_OfficeWork.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd06_office_work.insertUpdate`](../../fnd/sql/fnd06_office_work.md), [`fnd06_office_work.selectByCd`](../../fnd/sql/fnd06_office_work.md) |
| `fnd.Fnd06_OfficeWork.update` | Fnd06_Tab_OfficeWorkManager:145 | [`Fnd06_OfficeWork.java:198`](../../fnd/services/Fnd06_OfficeWork.md) | `UpdateDataModel(fnd06_office_work)` 동적 INSERT/UPDATE → [`fnd06_office_work.selectById`](../../fnd/sql/fnd06_office_work.md) |

## 테이블

[`fnd06_office_work`](../../../db/tables/fnd.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd06_Tab_OfficeWorkManager (`client/vi/fnd/Fnd06_Tab_OfficeWorkManager.java`, 184줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 사무수탁사명: {searchText} {retrieveButton} {updateButton} {importButton} 사용여부: {useYnBox}
- 입력·하위 화면: `searchText` TextField 빈칸="전체", `useYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - officeWorkName 250 "사무수탁사명" Text
  - officeWorkCode 80 "ICAM" TextCenter 편집:TextField
  - kofiaCode 80 "협회코드" TextCenter 편집:TextField
  - etcOfficeWorkCode01 80 "신한펀드" TextCenter 편집:TextField
  - officeWorkUseYn 70 "사용여부" Boolean
  - officeWorkNote 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L49-109) → retrieve()
[E1] searchText.KeyPress [Enter] (L52) → retrieve()
[E2] retrieveButton[조회].Select (L60) → retrieve()
[E3] updateButton[저장].Select (L66) → update()
[E4] importButton[ICAM가져오기].Select (L72) → importIcam()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L125-141 | 생성자,E1,E2,update,importIcam | 서비스 fnd.Fnd06_OfficeWork.selectByCompanyId0(searchText, companyId, useYn) | 업무 |
| public update() | L143-157 | E3 | 서비스 fnd.Fnd06_OfficeWork.update | 업무 |
| private importIcam() | L159-175 | E4 | 서비스 fnd.Fnd06_OfficeWork.selectIcamOfficeWork(companyId) | 업무 |
| public insertRow() | L177-179 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L111-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L181-183 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('officeWorkNm', 250, '사무수탁사명'),  // L115
  gb.textCenter('officeWorkCd', 80, 'ICAM', { editor: 'text' }),  // L116
  gb.textCenter('kofiaCd', 80, '협회코드', { editor: 'text' }),  // L117
  gb.textCenter('etcOfficeWorkCd01', 80, '신한펀드', { editor: 'text' }),  // L118
  gb.boolean('officeWorkUseYn', 70, '사용여부'),  // L119
  gb.text('officeWorkNote', 300, '비고', { editor: 'text' }),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={importIcam}>ICAM가져오기</Button>

