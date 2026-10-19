# Bbs10_Tab_BizShare

- 종류: 화면
- 메뉴: 커뮤니티 > 03. 업무활동 > 업무공유 (#1254)
- 파일: `client/vi/bbs/Bbs10_Tab_BizShare.java`
- 함께 쓰는 클래스 1개:
  - `Bbs10_Edit_BizShare` `client/vi/bbs/Bbs10_Edit_BizShare.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs10_BizShare.delete` | Bbs10_Tab_BizShare:239 | [`Bbs10_BizShare.java:57`](../../bbs/services/Bbs10_BizShare.md) | `UpdateDataModel(bbs10_biz_share)` 동적 DELETE |
| `bbs.Bbs10_BizShare.modelUpdate` | Bbs10_Edit_BizShare:170 | [`Bbs10_BizShare.java:39`](../../bbs/services/Bbs10_BizShare.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs10_biz_share)` 동적 INSERT/UPDATE → [`bbs10_biz_share.selectById`](../../bbs/sql/bbs10_biz_share.md) |
| `bbs.Bbs10_BizShare.selectByText` | Bbs10_Tab_BizShare:208 | [`Bbs10_BizShare.java:26`](../../bbs/services/Bbs10_BizShare.md) | [`bbs10_biz_share.selectByText`](../../bbs/sql/bbs10_biz_share.md) |

## 테이블

[`bbs10_biz_share`](../../../db/tables/bbs.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs10_Tab_BizShare (`client/vi/bbs/Bbs10_Tab_BizShare.java`, 247줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 구분: {bizShareComboBox} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="업무내용/등록자/비고/키워드", `startDate` MyDateField, `closeDate` MyDateField, `bizShareComboBox` ComboBoxField("BizShareType", "%", "전체"), `lookup` Bbs10_Edit_BizShare
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "등록일" Date
  - bizShareTypeName 180 "구분" Text
  - content 550 "업무내용" TextArea
  - keyword 200 "키워드" Text
  - note 350 "비고" TextArea
  - personName 100 "등록자" TextCenter
  - actionCell 80 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L59-63) → init(), settings(), retrieve()
[E1] bizShareComboBox[BizShareType].Collapse (L107) → retrieve()
[E2] searchText.KeyPress [Enter] (L116) → retrieve()
[E3] retrieveButton[조회].Select (L124) → retrieve()
[E4] insertButton[등록].Select (L130) → insertRow()
[E5] deleteButton[삭제].Select [YES] (L136) → deleteRow()
[E6] msgBox.DialogHide [YES] (L141) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L65-97 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L192-215 | 생성자,E1,E2,E3,init,buildGrid,insertRow | 서비스 bbs.Bbs10_BizShare.selectByText(companyId, startDate, closeDate, bizShareType, searchText) | 업무 |
| public insertRow() | L217-225 | E4 | 팝업 Bbs10_Edit_BizShare 열기 | 업무 |
| public deleteRow() | L227-242 | E5,E6 | GridDeleteData bbs.Bbs10_BizShare.delete(체크된 행 목록) | 업무 |
| private settings() | L99-159 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, bizShareComboBox="전체"("BizShareType") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L161-190 | 필드 초기화 | 팝업 Bbs10_Edit_BizShare 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L244-246 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '등록일'),  // L181
  gb.text('bizShareTypeNm', 180, '구분'),  // L182 SQL 계산 컬럼(selectByText: f_cdnm('BizShareType', bbs10_biz_share_…)
  gb.textArea('content', 550, '업무내용'),  // L183
  gb.text('keyword', 200, '키워드'),  // L184
  gb.textArea('note', 350, '비고'),  // L185
  gb.textCenter('personNm', 100, '등록자'),  // L186 SQL 계산 컬럼(selectByText: f_emp_kor_nm(bbs10_person_id))
  // ⚠ 대응 없음 (GridBuilder L187) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Bbs10_Edit_BizShare (`client/vi/bbs/Bbs10_Edit_BizShare.java`, 193줄)

- 입력·하위 화면: `date` MyDateField, `keyword` TextField, `content` MyTextArea, `note` MyTextArea, `bizShareComboBox` ComboBoxField("BizShareType")

#### 이벤트
[E0] 화면 열림 (생성자 L85-129) → settings(), show()
[E1] updateButton[저장].Select (L133) → update()
[E2] closeButton[닫기].Select (L139) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L52-64 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L66-82 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L148-183 | E1 | 서비스 bbs.Bbs10_BizShare.modelUpdate | 업무 |
| private settings() | L132-146 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L190-192 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

