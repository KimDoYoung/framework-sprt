# Sys15_Lookup_Corp

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `adv`, `ast`, `biz`, `flt`, `fnd`, `icam`, `pay`, `scm`
- 파일: `client/vi/sys/Sys15_Lookup_Corp.java`
- 함께 쓰는 클래스 1개:
  - `Sys15_Lookup_AddCorp` `client/vi/sys/Sys15_Lookup_AddCorp.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Sys15_Lookup_AddCorp:184 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys15_Corp.selectByUseYn` | Sys15_Lookup_Corp:233 | [`Sys15_Corp.java:30`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.selectByUseYn`](../../sys/sql/sys15_corp.md) |
| `sys.Sys15_Corp.update` | Sys15_Lookup_AddCorp:204 | [`Sys15_Corp.java:45`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.insert`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectById`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectCorpCodeCheck`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectNewCorpCodeByBizNo`](../../sys/sql/sys15_corp.md), [`sys15_corp.update`](../../sys/sql/sys15_corp.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp14_account`](../../../db/tables/emp.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys15_Lookup_Corp (`client/vi/sys/Sys15_Lookup_Corp.java`, 273줄)

- 툴바 `buttonBar`: 구분: {corpTypeComboBox} 검색: {searchText} {retrieveButton} {addButton}
- 입력·하위 화면: `searchText` TextField 빈칸="거래처명/비고", `corpTypeComboBox` ComboBoxField("CorpType", "%", "전체", "전체", "Z99", "임직원"), `lookupAddCorp` Sys15_Lookup_AddCorp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - corpTypeName 120 "거래처구분" Text
  - corpName 200 "거래처명" Text
  - note 200 "비고" Text

#### 이벤트
[E1] corpTypeComboBox[CorpType].Collapse (L141) → retrieve()
[E2] searchText.KeyPress [Enter] (L150) → retrieve()
[E3] grid.RowDoubleClick (L159) → confirm()
[E4] retrieveButton[조회].Select (L166) → retrieve()
[E5] addButton[거래처추가].Select (L172) → lookupAddCorp()
[E6] confirmButton[확인].Select (L179) → confirm()
[E7] selectAllButton[전체].Select [callback != null] (L189) → hide()
[E8] cancelButton[닫기].Select (L198) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openSearch() | L59-64 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L66-70 | openSearch | 상태 처리 | 업무 |
| public open() | L72-75 | openSearch | 상태 처리 | 업무 |
| public open() | L77-81 | openSearch | 상태 처리 | 업무 |
| public open() | L83-120 | openSearch | 상태 처리 | 업무 |
| private setting() | L122-204 | open | 상태 처리 | 업무 |
| private retrieve() | L218-239 | E1,E2,E4,setting,lookupAddCorp | 서비스 sys.Sys15_Corp.selectByUseYn(companyId, corpType, searchText, empYn) | 업무 |
| private confirm() | L241-250 | E3,E6 | 상태 처리 | 업무 |
| private lookupAddCorp() | L252-260 | E5 | 조회창 Sys15_Lookup_AddCorp 열기 | 업무 |
| private buildGrid() | L206-216 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L262-264 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L266-268 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlButtonBottomStyle() | L270-272 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpTypeNm', 120, '거래처구분'),  // L211
  gb.text('corpNm', 200, '거래처명'),  // L212
  gb.text('note', 200, '비고'),  // L213
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={lookupAddCorp}>거래처추가</Button>
3. <Button type="save" onClick={confirm}>확인</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys15_Lookup_AddCorp (`client/vi/sys/Sys15_Lookup_AddCorp.java`, 232줄)

- 입력·하위 화면: `corpType` TextField, `corpName` TextField, `corpCode` TextField 빈칸="미입력시 사업자번호로 등록.", `bizNo` TextField, `note` TextField, `tel` TextField, `addr` TextField, `corpTypeName` ComboBoxField("CorpType"), `seq` LongField, `useYn` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L62-63) → 초기화
[E1] corpName[거래처명].KeyPress [Enter] (L96) → 인라인 L96-103 (new KeyPressHandler() { @Override pub…)
[E2] bizNo[사업자번호].KeyPress [Enter] (L104) → 인라인 L104-111 (new KeyPressHandler() { @Override pub…)
[E3] corpCode[거래처코드].KeyPress [Enter] (L112) → 인라인 L112-119 (new KeyPressHandler() { @Override pub…)
[E4] tel[전화번호].KeyPress [Enter] (L120) → 인라인 L120-127 (new KeyPressHandler() { @Override pub…)
[E5] addr[주소].KeyPress [Enter] (L128) → 인라인 L128-135 (new KeyPressHandler() { @Override pub…)
[E6] note[비고].KeyPress [Enter] (L136) → 인라인 L136-143 (new KeyPressHandler() { @Override pub…)
[E7] updateButton[저장].Select (L145) → update()
[E8] closeButton[닫기].Select (L151) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L65-82 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L84-159 | open | 상태 처리 | 업무 |
| private getEditor() | L161-181 | open | 상태 처리 | 업무 |
| private insertRow() | L183-198 | setting | 상태 처리 | 업무 |
| private update() | L200-221 | E7 | 서비스 sys.Sys15_Corp.update | 업무 |
| private setHtmlStyle() | L223-225 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L226-228 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L229-231 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

