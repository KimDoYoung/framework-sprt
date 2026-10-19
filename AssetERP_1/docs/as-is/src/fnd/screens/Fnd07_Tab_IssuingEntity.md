# Fnd07_Tab_IssuingEntity

- 종류: 화면
- 메뉴: 펀드관리 > 90. 기관정보관리 > 발행기관정보 관리 (#1053)
- 파일: `client/vi/fnd/Fnd07_Tab_IssuingEntity.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd07_IssuingEntity.delete` | Fnd07_Tab_IssuingEntity:198 | [`Fnd07_IssuingEntity.java:47`](../../fnd/services/Fnd07_IssuingEntity.md) | `UpdateDataModel(fnd07_issuing_entity)` 동적 DELETE |
| `fnd.Fnd07_IssuingEntity.selectByCodeName` | Fnd07_Tab_IssuingEntity:169 | [`Fnd07_IssuingEntity.java:23`](../../fnd/services/Fnd07_IssuingEntity.md) | [`fnd07_issuing_entity.selectByCodeName`](../../fnd/sql/fnd07_issuing_entity.md) |
| `fnd.Fnd07_IssuingEntity.update` | Fnd07_Tab_IssuingEntity:182 | **(없음)** | - |

## 테이블

[`fnd07_issuing_entity`](../../../db/tables/fnd.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd07_Tab_IssuingEntity (`client/vi/fnd/Fnd07_Tab_IssuingEntity.java`, 205줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 발행기관명: {codeNameField} {retrieveButton} {updateButton} {deleteButton} {fileUploadButton}
- 입력·하위 화면: `codeNameField` TextField 빈칸="전체", `nationComboBox` ComboBoxField("NationCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - issuingEntityCode 90 "발행기관코드" Text 편집:TextField
  - issuingEntityName 250 "발행기관명" Text 편집:TextField
  - issuingEntityAttachCode 80 "소속구분" Text 편집:TextField
  - issuingEntityFaceValue 80 "액면가" Long 편집:LongField
  - issuingEntitySettleMonth 80 "결산월" Text 편집:TextField
  - kukaName 80 "국가코드" Text 편집:nationComboBox
  - issuingEntityUseYn 70 "사용여부" Boolean
  - issuingEntityNote 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L53-132) → 초기화
[E1] codeNameField.KeyPress [Enter] (L56) → retrieve()
[E2] retrieveButton[조회].Select (L64) → retrieve()
[E3] updateButton[저장].Select (L70) → update()
[E4] fileUploadButton[파일업로드].Select (L76) → insertRow()
[E5] deleteButton[삭제].Select (L82) → deleteRow()
[E6] fileUpdownForm.Change (L105) → 메시지 "확인"
[E7] nationComboBox[NationCode].Collapse (L145) → 인라인 L145-151 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L160-177 | E1,E2 | 서비스 fnd.Fnd07_IssuingEntity.selectByCodeName(issuingEntityName) | 업무 |
| public update() | L180-183 | E3 | 서비스 fnd.Fnd07_IssuingEntity.update | 업무 |
| public insertRow() | L186-192 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L195-199 | E5 | GridDeleteData fnd.Fnd07_IssuingEntity.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L134-157 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L201-203 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('issuingEntityCd', 90, '발행기관코드', { editor: 'text' }),  // L138
  gb.text('issuingEntityNm', 250, '발행기관명', { editor: 'text' }),  // L139
  gb.text('issuingEntityAttachCd', 80, '소속구분', { editor: 'text' }),  // L140
  gb.long('issuingEntityFaceValue', 80, '액면가', { editor: 'number' }),  // L141
  gb.text('issuingEntitySettleMonth', 80, '결산월', { editor: 'text' }),  // L142
  gb.text('kukaNm', 80, '국가코드', { editor: 'select' }),  // L153 SQL 계산 컬럼(selectByCodeName: f_cdnm('EmpNationCode', fnd07_issuing_e…)
  gb.boolean('issuingEntityUseYn', 70, '사용여부'),  // L154
  gb.text('issuingEntityNote', 300, '비고', { editor: 'text' }),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="upload" onClick={insertRow}>파일업로드</Button>

