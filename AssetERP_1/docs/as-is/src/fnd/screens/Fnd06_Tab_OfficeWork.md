# Fnd06_Tab_OfficeWork

- 종류: 화면
- 메뉴: 펀드관리 > 90. 기관정보관리 > 사무수탁사정보 관리 (#1052)
- 파일: `client/vi/fnd/Fnd06_Tab_OfficeWork.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd06_OfficeWork.delete` | Fnd06_Tab_OfficeWork:261 | [`Fnd06_OfficeWork.java:203`](../../fnd/services/Fnd06_OfficeWork.md) | `UpdateDataModel(fnd06_office_work)` 동적 DELETE |
| `fnd.Fnd06_OfficeWork.preUpdate` | Fnd06_Tab_OfficeWork:208 | [`Fnd06_OfficeWork.java:115`](../../fnd/services/Fnd06_OfficeWork.md) | [`fnd06_office_work.selectByCd`](../../fnd/sql/fnd06_office_work.md), [`fnd06_office_work.selectById`](../../fnd/sql/fnd06_office_work.md) |
| `fnd.Fnd06_OfficeWork.selectByCompanyId` | Fnd06_Tab_OfficeWork:178 | [`Fnd06_OfficeWork.java:45`](../../fnd/services/Fnd06_OfficeWork.md) | [`fnd06_office_work.selectByCompanyId`](../../fnd/sql/fnd06_office_work.md) |
| `fnd.Fnd06_OfficeWork.selectIcamOfficeWork` | Fnd06_Tab_OfficeWork:272 | [`Fnd06_OfficeWork.java:155`](../../fnd/services/Fnd06_OfficeWork.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd06_office_work.insertUpdate`](../../fnd/sql/fnd06_office_work.md), [`fnd06_office_work.selectByCd`](../../fnd/sql/fnd06_office_work.md) |
| `fnd.Fnd06_OfficeWork.update` | Fnd06_Tab_OfficeWork:230 | [`Fnd06_OfficeWork.java:198`](../../fnd/services/Fnd06_OfficeWork.md) | `UpdateDataModel(fnd06_office_work)` 동적 INSERT/UPDATE → [`fnd06_office_work.selectById`](../../fnd/sql/fnd06_office_work.md) |

## 테이블

[`fnd06_office_work`](../../../db/tables/fnd.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd06_Tab_OfficeWork (`client/vi/fnd/Fnd06_Tab_OfficeWork.java`, 292줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 사무수탁사명: {searchText} 사용여부: {useYnBox} {retrieveButton} {insertButton} {updateButton} {deleteButton} {importButton}
- 입력·하위 화면: `searchText` TextField 빈칸="전체", `useYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - officeWorkCode 150 "사무수탁사 코드" TextCenter 편집:TextField
  - officeWorkName 250 "사무수탁사명" Text 편집:TextField
  - kofiaCode 150 "금융투자협회코드" TextCenter 편집:TextField
  - etcOfficeWorkCode01 100 "신한펀드" TextCenter 편집:TextField
  - officeWorkUseYn 70 "사용여부" Boolean
  - officeWorkNote 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L63-146) → retrieve()
[E1] searchText.KeyPress [Enter] (L66) → retrieve()
[E2] retrieveButton[조회].Select (L81) → retrieve()
[E3] insertButton[등록].Select (L87) → insertRow()
[E4] updateButton[저장].Select (L93) → preUpdate()
[E5] deleteButton[삭제].Select (L99) → deleteRow()
       └ [E7] messageBox.DialogHide (L246) → delete()
[E6] importButton[가져오기(ICAM)].Select (L105) → importIcam()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected PDF() | L167-168 | 미사용 후보 | 상태 처리 | 업무 |
| public retrieve() | L171-187 | 생성자,E1,E2,importIcam | 서비스 fnd.Fnd06_OfficeWork.selectByCompanyId(searchText, companyId, useYn) | 업무 |
| public preUpdate() | L189-225 | E4 | 서비스 fnd.Fnd06_OfficeWork.preUpdate | 업무 |
| public update() | L228-231 | preUpdate | 서비스 fnd.Fnd06_OfficeWork.update | 업무 |
| public insertRow() | L234-240 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L243-256 | E5 | ConfirmBox → E7 | 업무 |
| public delete() | L258-269 | E7 | GridDeleteData fnd.Fnd06_OfficeWork.delete(체크된 행 목록) | 업무 |
| private importIcam() | L271-287 | E6 | 서비스 fnd.Fnd06_OfficeWork.selectIcamOfficeWork | 업무 |
| public buildGrid() | L148-165 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L289-291 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('officeWorkCd', 150, '사무수탁사 코드', { editor: 'text' }),  // L152
  gb.text('officeWorkNm', 250, '사무수탁사명', { editor: 'text' }),  // L153
  gb.textCenter('kofiaCd', 150, '금융투자협회코드', { editor: 'text' }),  // L154
  gb.textCenter('etcOfficeWorkCd01', 100, '신한펀드', { editor: 'text' }),  // L155
  gb.boolean('officeWorkUseYn', 70, '사용여부'),  // L156
  gb.text('officeWorkNote', 300, '비고', { editor: 'text' }),  // L157
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={preUpdate}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={importIcam}>가져오기(ICAM)</Button>

