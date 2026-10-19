# Sys31_Lookup_LeaveCompany

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/sys/Sys31_Lookup_LeaveCompany.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys09_Lookup_Code`](../../sys/components/Sys09_Lookup_Code.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys31_LeaveCompany.selectByCompanyId` | Sys31_Lookup_LeaveCompany:143 | [`Sys31_LeaveCompany.java:24`](../../sys/services/Sys31_LeaveCompany.md) | [`sys31_leave_company.selectByCompanyId`](../../sys/sql/sys31_leave_company.md) |
| `sys.Sys31_LeaveCompany.update` | Sys31_Lookup_LeaveCompany:153 | [`Sys31_LeaveCompany.java:30`](../../sys/services/Sys31_LeaveCompany.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys31_leave_company.selectById`](../../sys/sql/sys31_leave_company.md), `UpdateDataModel(sys31_leave_company)` 동적 INSERT/UPDATE → [`sys31_leave_company.selectById`](../../sys/sql/sys31_leave_company.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys31_leave_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys31_Lookup_LeaveCompany (`client/vi/sys/Sys31_Lookup_LeaveCompany.java`, 174줄)

- 툴바 `buttonBarL`: {retrieveButton} {updateButton}
- 툴바 `buttonBarR`: {spcLeaveButton}
- 입력·하위 화면: `calcTypeCombo` ComboBoxField("LeaveDaysCalcType"), `lookup` Sys09_Lookup_Code
- 그리드 `grid` (buildGrid()):
  - leaveName 150 "휴가구분" Text
  - spcLeaveName 400 "특별휴가<br>상세구분" Text
  - days 100 "특별휴가<br>기간(일)" LongCenter 편집:LongField
  - calcName 100 "기간계산기준" Text 편집:calcTypeCombo
  - unUseYn 80 "미사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L48-84) → settings(), show()
[E1] retrieveButton[조회].Select (L91) → retrieve()
[E2] updateButton[저장].Select (L97) → update()
[E3] spcLeaveButton[특별휴가 추가].Select (L103) → lookupCode()
[E4] cancelButton[닫기].Select (L109) → hide()
[E5] calcTypeCombo[LeaveDaysCalcType].Collapse (L121) → 인라인 L121-127 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L138-149 | E1,open,update | 서비스 sys.Sys31_LeaveCompany.selectByCompanyId(companyId) | 업무 |
| private update() | L151-160 | E2 | 서비스 sys.Sys31_LeaveCompany.update | 업무 |
| private lookupCode() | L162-169 | E3 | 조회창 Sys09_Lookup_Code 열기 | 업무 |
| private settings() | L90-115 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L117-136 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L171-173 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('leaveNm', 150, '휴가구분'),  // L129 SQL 계산 컬럼(selectByCompanyId: f_cdnm('leaveCode' , leaveCode , #{comp…)
  gb.text('spcLeaveNm', 400, '특별휴가<br>상세구분'),  // L130 SQL 계산 컬럼(selectByCompanyId: f_cdnm('SpecialLeaveCode' , spcLeaveCod…)
  gb.longCenter('days', 100, '특별휴가<br>기간(일)', { editor: 'number' }),  // L131
  gb.text('calcNm', 100, '기간계산기준'),  // L132 SQL 계산 컬럼(selectByCompanyId: f_cdnm('LeaveDaysCalcType', COALESCE(sy…)
  gb.boolean('unUseYn', 80, '미사용'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={lookupCode}>특별휴가 추가</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

