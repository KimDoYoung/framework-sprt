# Fnd03_Tab_ConsignmentManager

- 종류: 화면
- 메뉴: I/F > 91. 기관정보관리(관리자) > 수탁사정보 관리(관리자) (#1102)
- 파일: `client/vi/fnd/Fnd03_Tab_ConsignmentManager.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd03_Consignment.insertCheck` | Fnd03_Tab_ConsignmentManager:157 | [`Fnd03_Consignment.java:93`](../../fnd/services/Fnd03_Consignment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd03_consignment.insertUpdate`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectById`](../../fnd/sql/fnd03_consignment.md) |
| `fnd.Fnd03_Consignment.selectByCompanyId0` | Fnd03_Tab_ConsignmentManager:144 | [`Fnd03_Consignment.java:39`](../../fnd/services/Fnd03_Consignment.md) | [`fnd03_consignment.selectByCompanyId0`](../../fnd/sql/fnd03_consignment.md) |
| `fnd.Fnd03_Consignment.selectIcamConsignment` | Fnd03_Tab_ConsignmentManager:108 | [`Fnd03_Consignment.java:142`](../../fnd/services/Fnd03_Consignment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd03_consignment.insertUpdate`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectByCd`](../../fnd/sql/fnd03_consignment.md), [`sys01_company.selectIcamCompanyCode`](../../sys/sql/sys01_company.md) |

## 테이블

[`fnd03_consignment`](../../../db/tables/fnd.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd03_Tab_ConsignmentManager (`client/vi/fnd/Fnd03_Tab_ConsignmentManager.java`, 174줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 사무수탁사명: {searchText} {retrieveButton} {updateButton} {importButton} 사용여부: {useYnBox}
- 입력·하위 화면: `searchText` TextField 빈칸="전체", `useYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - consignmentCode 80 "수탁사코드" Text 편집:TextField
  - consignmentName 250 "수탁사명" Text 편집:TextField
  - useYn 70 "사용여부" Boolean
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L47-105) → 초기화
[E1] searchText.KeyPress [Enter] (L50) → retrieve()
[E2] retrieveButton[조회].Select (L58) → retrieve()
[E3] updateButton[저장].Select (L64) → update()
[E4] importButton[ICAM가져오기].Select (L70) → importIcam()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private importIcam() | L107-123 | E4 | 서비스 fnd.Fnd03_Consignment.selectIcamConsignment | 업무 |
| public retrieve() | L137-153 | E1,E2,importIcam,update | 서비스 fnd.Fnd03_Consignment.selectByCompanyId0(searchText, companyId, useYn) | 업무 |
| public update() | L155-169 | E3 | 서비스 fnd.Fnd03_Consignment.insertCheck | 업무 |
| private buildGrid() | L125-135 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L171-173 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('consignmentCd', 80, '수탁사코드', { editor: 'text' }),  // L129
  gb.text('consignmentNm', 250, '수탁사명', { editor: 'text' }),  // L130
  gb.boolean('useYn', 70, '사용여부'),  // L131
  gb.text('note', 300, '비고', { editor: 'text' }),  // L132
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={importIcam}>ICAM가져오기</Button>

