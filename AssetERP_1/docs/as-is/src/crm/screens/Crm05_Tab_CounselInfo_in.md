# Crm05_Tab_CounselInfo_in

- 종류: 화면
- 파일: `client/vi/crm/Crm05_Tab_CounselInfo_in.java`
- 함께 쓰는 클래스 1개:
  - `Crm05_Edit_CounselInfo_in` `client/vi/crm/Crm05_Edit_CounselInfo_in.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crm.Crm05_Counsel.delete` | Crm05_Tab_CounselInfo_in:221 | [`Crm05_Counsel.java:79`](../../crm/services/Crm05_Counsel.md) | `UpdateDataModel(crm05_counsel)` 동적 DELETE |
| `crm.Crm05_Counsel.selectByFindText` | Crm05_Tab_CounselInfo_in:169 | [`Crm05_Counsel.java:29`](../../crm/services/Crm05_Counsel.md) | [`crm05_counsel.selectByFindText`](../../crm/sql/crm05_counsel.md) |
| `crm.Crm05_Counsel.update` | Crm05_Edit_CounselInfo_in:197 | [`Crm05_Counsel.java:67`](../../crm/services/Crm05_Counsel.md) | `UpdateDataModel(crm05_counsel)` 동적 INSERT/UPDATE → [`crm05_counsel.selectById`](../../crm/sql/crm05_counsel.md) |
| `getSeq` | Crm05_Edit_CounselInfo_in:138 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |

## 테이블

[`crm05_counsel`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crm05_Tab_CounselInfo_in (`client/vi/crm/Crm05_Tab_CounselInfo_in.java`, 228줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {findText} 업무구분: {itemWorkCodeComboBox} 유형구분: {itemTypeCodeComboBox} {retrieveButton} {insertRootButton} {deleteButton}
- 입력·하위 화면: `findText` TextField 빈칸="제목/내용", `itemTypeCodeComboBox` ComboBoxField("CounselTypeCode", "%", "전체"), `itemWorkCodeComboBox` ComboBoxField("CounselWorkCode", "%", "전체"), `inoutCode` TextField, `editItem` Crm05_Edit_CounselInfo_in, `EditItem` Crm05_Edit_CounselInfo_in
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - fromDate 100 "공지일" Date
  - workName 100 "업무구분" Text
  - typeName 100 "유형구분" Text
  - title 400 "제목" Text
  - counselInfo 400 "내용" Text
  - actionCell 80 "상세보기" Cell 편집:downloadCell
  - createDate 100 "작성일" Date
  - korName 100 "작성자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L57-116) → 초기화
[E1] findText.KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L72) → retrieve()
[E3] insertRootButton[등록].Select (L78) → insert()
[E4] deleteButton[삭제].Select (L84) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L201) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L157-178 | E1,E2,buildGrid,insert | 서비스 crm.Crm05_Counsel.selectByFindText(companyId, inoutCode, itemWorkCode, itemTypeCode, findText) | 업무 |
| private insert() | L180-196 | E3 | 팝업 Crm05_Edit_CounselInfo_in 열기 | 업무 |
| private deleteCheck() | L198-216 | E4 | ConfirmBox → E5 | 업무 |
| private delete() | L218-222 | E5 | GridDeleteData crm.Crm05_Counsel.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L118-155 | 필드 초기화 | 팝업 Crm05_Edit_CounselInfo_in 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L224-226 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('fromDate', 100, '공지일'),  // L145
  gb.text('workNm', 100, '업무구분'),  // L146 SQL 계산 컬럼(selectByFindText: f_cdnm('CounselWorkCode', crm05_work_cd…)
  gb.text('typeNm', 100, '유형구분'),  // L147 SQL 계산 컬럼(selectByFindText: f_cdnm('CounselTypeCode', crm05_type_cd…)
  gb.text('title', 400, '제목'),  // L148
  gb.text('counselInfo', 400, '내용'),  // L149
  // ⚠ 대응 없음 (GridBuilder L150) addCell
  gb.date('createDate', 100, '작성일'),  // L151
  gb.text('korNm', 100, '작성자'),  // L152
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Crm05_Edit_CounselInfo_in (`client/vi/crm/Crm05_Edit_CounselInfo_in.java`, 225줄)

- 입력·하위 화면: `typeCode` TextField, `workCode` TextField, `inoutCode` TextField, `fromDate` MyDateField, `toDate` MyDateField, `createDate` MyDateField, `title` TextArea 빈칸="제목을 입력해주세요.", `counselInfo` TextArea 빈칸="내용을 입력해주세요.", `note` TextArea, `typeName` ComboBoxField("CounselTypeCode") 빈칸="업무구분을 선택해주세요", `workName` ComboBoxField("CounselWorkCode") 빈칸="유형구분을 선택해주세요", `korName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L62-131) → 초기화
[E1] updateButton[저장].Select (L114) → update()
[E2] closeButton[닫기].Select (L122) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L133-155 | 공개 메서드 | 상태 처리 | 업무 |
| public manager() | L157-164 | 공개 메서드 | 상태 처리 | 업무 |
| public user() | L166-173 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L175-215 | E1 | 서비스 crm.Crm05_Counsel.update(counselModel) | 업무 |
| private setHtmlStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L221-223 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

