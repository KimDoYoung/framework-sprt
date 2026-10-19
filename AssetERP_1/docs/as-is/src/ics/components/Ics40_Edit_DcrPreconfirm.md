# Ics40_Edit_DcrPreconfirm

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/ics/Ics40_Edit_DcrPreconfirm.java`
- 함께 쓰는 클래스 1개:
  - `Ics40_Lookup_SelectSingle` `client/vi/ics/Ics40_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics40_DcrPreconfirm.delete` | Ics40_Edit_DcrPreconfirm:408 | [`Ics40_DcrPreconfirm.java:168`](../../ics/services/Ics40_DcrPreconfirm.md) | `UpdateDataModel(ics40_dcr_preconfirm)` 동적 DELETE |
| `ics.Ics40_DcrPreconfirm.modelUpdate` | Ics40_Edit_DcrPreconfirm:353 | [`Ics40_DcrPreconfirm.java:132`](../../ics/services/Ics40_DcrPreconfirm.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics40_dcr_preconfirm)` 동적 INSERT/UPDATE → [`ics40_dcr_preconfirm.selectById`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `ics.Ics40_DcrPreconfirm.selectByDate` | Ics40_Lookup_SelectSingle:151 | [`Ics40_DcrPreconfirm.java:50`](../../ics/services/Ics40_DcrPreconfirm.md) | [`ics40_dcr_preconfirm.selectByDate`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `ics.Ics40_DcrPreconfirm.updateByStatus01` | Ics40_Edit_DcrPreconfirm:384 | [`Ics40_DcrPreconfirm.java:146`](../../ics/services/Ics40_DcrPreconfirm.md) | [`ics40_dcr_preconfirm.updateByStatus01`](../../ics/sql/ics40_dcr_preconfirm.md) |
| `sys.Sys00_Common.selectIcs41DcrType` | Ics40_Edit_DcrPreconfirm:161 | [`Sys00_Common.java:181`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectIcs41DcrType`](../../sys/sql/sys09_code.md) |

## 테이블

[`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics40_Edit_DcrPreconfirm (`client/vi/ics/Ics40_Edit_DcrPreconfirm.java`, 433줄)

- 입력·하위 화면: `dcrTypeCode` TextField, `content` MyTextArea, `provideCo` TextField, `apprNo` TextField, `adTypeName` ComboBoxField("AdType") 빈칸="선택", `adType` TextField, `mediaTypeName` ComboBoxField("MediaType") 빈칸="선택", `mediaType` TextField, `adItemName` TextField, `adContent` TextField, `startDate` MyDateField, `closeDate` MyDateField, `spec` TextField, `qtyCnt` TextField, `preApprNo` LookupTriggerField, `dcrTypeName` CommonComboBoxField("sys.Sys00_Common.selectIcs41DcrType") 빈칸="선택하세요", `lookup` Ics40_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L89-107) → settings(), show()
[E1] adTypeName[광고종류].Collapse (L146) → 인라인 L146-151 (new CollapseHandler() { @Override pub…)
[E2] mediaTypeName[매체종류].Collapse (L153) → 인라인 L153-158 (new CollapseHandler() { @Override pub…)
[E3] preApprNo[과거심사필번호].TriggerClick [result != null] (L165) → 인라인 L165-179 (new TriggerClickHandler(){ @Override …)
[E4] applyButton[신청].Select (L180) → update()
[E5] cancelButton[신청취소].Select (L195) → update()
[E6] updateButton[저장].Select (L213) → update()
[E7] deleteButton[삭제].Select [YES] (L220) → delete()
[E8] msgBox.DialogHide [YES] (L232) → delete()
[E9] closeButton[닫기].Select (L251) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L109-121 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L123-141 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L260-331 | insert,edit | 상태 처리 | 업무 |
| public update() | L333-381 | E4,E5,E6 | 서비스 ics.Ics40_DcrPreconfirm.modelUpdate | 업무 |
| private updateByStatus01() | L383-397 | update | 서비스 ics.Ics40_DcrPreconfirm.updateByStatus01(confirmerId) | 업무 |
| public delete() | L399-420 | E7,E8 | 서비스 ics.Ics40_DcrPreconfirm.delete | 업무 |
| private settings() | L143-258 | 생성자 | 조회창 Ics40_Lookup_SelectSingle 열기, 확인창 표시, 서비스 sys.Sys00_Common.selectIcs41DcrType, 이벤트 연결, 초기값: adType=adTypeName.getCode(, mediaType=mediaTypeName.getCode(, preApprNo=resultModel.getApprNoPrefix(("과거심사필번호") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L422-424 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L426-428 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L430-432 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>신청</Button>
2. <Button type="cancel" onClick={update}>신청취소</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics40_Lookup_SelectSingle (`client/vi/ics/Ics40_Lookup_SelectSingle.java`, 180줄)

- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="내용/제공처"
- 그리드 `grid` (buildGrid(), 체크박스):
  - dcrTypeName 100 "대장분류" Text
  - content 500 "내용" TextArea
  - provideCo 200 "제공처" Text
  - apprNoPrefix 100 "심사필번호" TextCenter

#### 이벤트
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L103) → retrieve()
[E3] confirmButton[확인].Select (L109) → confirm()
[E4] cancelButton[닫기].Select (L115) → hide()
[E5] grid.CellDoubleClick (L121) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-85 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L141-157 | E1,E2,open | 서비스 ics.Ics40_DcrPreconfirm.selectByDate(companyId, startDate, closeDate, searchText, statusCode) | 업무 |
| public confirm() | L159-170 | E3,E5 | 미선택 시 alert "선택된 과거심사필번호가 없습니다" | 업무 |
| private settings() | L87-127 | open | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L129-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L172-174 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L176-178 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('dcrTypeNm', 100, '대장분류'),  // L133 SQL 계산 컬럼(selectByDate: ics41_dcr_type_nm)
  gb.textArea('content', 500, '내용'),  // L134
  gb.text('provideCo', 200, '제공처'),  // L135
  gb.textCenter('apprNoPrefix', 100, '심사필번호'),  // L136
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

