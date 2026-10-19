# Fnd03_Tab_Consignment

- 종류: 화면
- 메뉴: 펀드관리 > 90. 기관정보관리 > 수탁사정보 관리 (#1051)
- 파일: `client/vi/fnd/Fnd03_Tab_Consignment.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd03_Consignment.delete` | Fnd03_Tab_Consignment:238 | [`Fnd03_Consignment.java:137`](../../fnd/services/Fnd03_Consignment.md) | `UpdateDataModel(fnd03_consignment)` 동적 DELETE |
| `fnd.Fnd03_Consignment.preUpdate` | Fnd03_Tab_Consignment:196 | [`Fnd03_Consignment.java:53`](../../fnd/services/Fnd03_Consignment.md) | [`fnd03_consignment.selectByCd`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectById`](../../fnd/sql/fnd03_consignment.md) |
| `fnd.Fnd03_Consignment.selectByCompanyId` | Fnd03_Tab_Consignment:167 | [`Fnd03_Consignment.java:34`](../../fnd/services/Fnd03_Consignment.md) | [`fnd03_consignment.selectByCompanyId`](../../fnd/sql/fnd03_consignment.md) |
| `fnd.Fnd03_Consignment.selectIcamConsignment` | Fnd03_Tab_Consignment:249 | [`Fnd03_Consignment.java:142`](../../fnd/services/Fnd03_Consignment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd03_consignment.insertUpdate`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectByCd`](../../fnd/sql/fnd03_consignment.md), [`sys01_company.selectIcamCompanyCode`](../../sys/sql/sys01_company.md) |
| `fnd.Fnd03_Consignment.update` | Fnd03_Tab_Consignment:217 | [`Fnd03_Consignment.java:132`](../../fnd/services/Fnd03_Consignment.md) | `UpdateDataModel(fnd03_consignment)` 동적 INSERT/UPDATE → [`fnd03_consignment.selectById`](../../fnd/sql/fnd03_consignment.md) |

## 테이블

[`fnd03_consignment`](../../../db/tables/fnd.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd03_Tab_Consignment (`client/vi/fnd/Fnd03_Tab_Consignment.java`, 269줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 수탁사명: {searchText} 사용여부: {useYnBox} {retrieveButton} {insertButton} {updateButton} {deleteButton} {importButton}
- 입력·하위 화면: `searchText` TextField 빈칸="전체", `useYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - consignmentCode 100 "수탁사코드" Text 편집:TextField
  - consignmentName 250 "수탁사명" Text 편집:TextField
  - useYn 70 "사용여부" Boolean
  - note 300 "비고" Text 편집:TextField
  - etcConsignmentCode01 100 "신한아이타스" Text 편집:TextField
  - etcConsignmentCode02 100 "우리펀드" Text 편집:TextField
  - etcConsignmentCode03 100 "하나펀드" Text 편집:TextField
  - etcConsignmentCode04 100 "미래에셋" Text 편집:TextField
  - etcConsignmentCode05 100 "예탁원" Text 편집:TextField
  - etcConsignmentCode06 100 "국민" Text 편집:TextField
  - etcConsignmentCode07 100 "코스콤" Text 편집:TextField
  - etcConsignmentCode08 100 "삼정" Text 편집:TextField
  - etcConsignmentCode09 100 "스카이" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L61-137) → retrieve()
[E1] searchText.KeyPress [Enter] (L64) → retrieve()
[E2] retrieveButton[조회].Select (L72) → retrieve()
[E3] insertButton[등록].Select (L78) → insertRow()
[E4] updateButton[저장].Select (L84) → preUpdate()
[E5] deleteButton[삭제].Select (L90) → deleteRow()
       └ [E7] messageBox.DialogHide (L223) → delete()
[E6] importButton[가져오기(ICAM)].Select (L96) → importIcam()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L160-176 | 생성자,E1,E2,importIcam | 서비스 fnd.Fnd03_Consignment.selectByCompanyId(searchText, companyId, useYn) | 업무 |
| public insertRow() | L178-184 | E3 | 상태 처리 | 업무 |
| public preUpdate() | L186-213 | E4 | 서비스 fnd.Fnd03_Consignment.preUpdate | 업무 |
| public update() | L215-218 | preUpdate | 서비스 fnd.Fnd03_Consignment.update | 업무 |
| public deleteRow() | L220-233 | E5 | ConfirmBox → E7 | 업무 |
| public delete() | L235-246 | E7 | GridDeleteData fnd.Fnd03_Consignment.delete(체크된 행 목록) | 업무 |
| private importIcam() | L248-264 | E6 | 서비스 fnd.Fnd03_Consignment.selectIcamConsignment | 업무 |
| public buildGrid() | L139-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L266-268 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('consignmentCd', 100, '수탁사코드', { editor: 'text' }),  // L143
  gb.text('consignmentNm', 250, '수탁사명', { editor: 'text' }),  // L144
  gb.boolean('useYn', 70, '사용여부'),  // L145
  gb.text('note', 300, '비고', { editor: 'text' }),  // L146
  gb.text('etcConsignmentCd01', 100, '신한아이타스', { editor: 'text' }),  // L147
  gb.text('etcConsignmentCd02', 100, '우리펀드', { editor: 'text' }),  // L148
  gb.text('etcConsignmentCd03', 100, '하나펀드', { editor: 'text' }),  // L149
  gb.text('etcConsignmentCd04', 100, '미래에셋', { editor: 'text' }),  // L150
  gb.text('etcConsignmentCd05', 100, '예탁원', { editor: 'text' }),  // L151
  gb.text('etcConsignmentCd06', 100, '국민', { editor: 'text' }),  // L152
  gb.text('etcConsignmentCd07', 100, '코스콤', { editor: 'text' }),  // L153
  gb.text('etcConsignmentCd08', 100, '삼정', { editor: 'text' }),  // L154
  gb.text('etcConsignmentCd09', 100, '스카이', { editor: 'text' }),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={preUpdate}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={importIcam}>가져오기(ICAM)</Button>

