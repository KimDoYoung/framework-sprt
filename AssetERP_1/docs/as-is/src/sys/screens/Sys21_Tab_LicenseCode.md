# Sys21_Tab_LicenseCode

- 종류: 화면
- 파일: `client/vi/sys/Sys21_Tab_LicenseCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys21_LicenseCode.delete` | Sys21_Tab_LicenseCode:115 | [`Sys21_LicenseCode.java:46`](../../sys/services/Sys21_LicenseCode.md) | `UpdateDataModel(sys21_license_code)` 동적 DELETE |
| `sys.Sys21_LicenseCode.selectByName` | Sys21_Tab_LicenseCode:90 | [`Sys21_LicenseCode.java:24`](../../sys/services/Sys21_LicenseCode.md) | [`sys21_license_code.selectByName`](../../sys/sql/sys21_license_code.md) |
| `sys.Sys21_LicenseCode.update` | Sys21_Tab_LicenseCode:96 | [`Sys21_LicenseCode.java:41`](../../sys/services/Sys21_LicenseCode.md) | `UpdateDataModel(sys21_license_code)` 동적 INSERT/UPDATE → [`sys21_license_code.selectById`](../../sys/sql/sys21_license_code.md) |

## 테이블

[`sys21_license_code`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys21_Tab_LicenseCode (`client/vi/sys/Sys21_Tab_LicenseCode.java`, 121줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), center=grid
- 입력·하위 화면: `licenseName` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - licenseCode 120 "자격면허코드" Text 편집:TextField
  - licenseName 300 "자격면허명" Text 편집:TextField
  - issueOrgName 200 "발급기관명" Text 편집:TextField
  - applyDate 100 "적용일" Date 편집:MyDateField
  - closeYnFlag 100 "사용여부" Boolean
  - note 400 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L36-59) → 초기화
[E1] licenseName[자격면허명].EnterKey [Enter] (L40) → retrieve()
[E2] searchBarBuilder[조회].Retrieve (L41) → retrieve()
[E3] searchBarBuilder[저장].Update (L42) → update()
[E4] searchBarBuilder[등록].Insert (L43) → insertRow()
[E5] searchBarBuilder[삭제].Delete (L44) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L109) → 서비스 sys.Sys21_LicenseCode.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L77-91 | E1,E2 | 서비스 sys.Sys21_LicenseCode.selectByName(licenseName, companyId) | 업무 |
| public update() | L94-97 | E3 | 서비스 sys.Sys21_LicenseCode.update | 업무 |
| public insertRow() | L100-103 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L106-120 | E5 | ConfirmBox → E6 | 업무 |
| private buildGrid() | L61-74 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('licenseCd', 120, '자격면허코드', { editor: 'text' }),  // L66
  gb.text('licenseNm', 300, '자격면허명', { editor: 'text' }),  // L67
  gb.text('issueOrgNm', 200, '발급기관명', { editor: 'text' }),  // L68
  gb.date('applyDate', 100, '적용일', { editor: 'date' }),  // L69
  // ⚠DB없음 L70 closeYnFlag 100 "사용여부" (sys21_close_yn_flag 컬럼 없음)
  gb.text('note', 400, '비고', { editor: 'text' }),  // L71
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

