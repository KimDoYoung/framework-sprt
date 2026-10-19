# Apr08_Tab_ApprRole

- 종류: 화면
- 메뉴: 문서작성 > 05. 메일관리 > (X)직책별 결재자 등록 (#1027, 미사용)
- 파일: `client/vi/apr/Apr08_Tab_ApprRole.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr08_ApprRole.delete` | Apr08_Tab_ApprRole:136 | [`Apr08_ApprRole.java:71`](../../apr/services/Apr08_ApprRole.md) | `UpdateDataModel(apr08_appr_role)` 동적 DELETE |
| `apr.Apr08_ApprRole.selectByAll` | Apr08_Tab_ApprRole:108 | [`Apr08_ApprRole.java:38`](../../apr/services/Apr08_ApprRole.md) | [`apr08_appr_role.selectByAll`](../../apr/sql/apr08_appr_role.md) |
| `apr.Apr08_ApprRole.update` | Apr08_Tab_ApprRole:114 | [`Apr08_ApprRole.java:62`](../../apr/services/Apr08_ApprRole.md) | `UpdateDataModel(apr08_appr_role)` 동적 INSERT/UPDATE → [`apr08_appr_role.selectById`](../../apr/sql/apr08_appr_role.md) |

## 테이블

[`apr08_appr_role`](../../../db/tables/apr.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr08_Tab_ApprRole (`client/vi/apr/Apr08_Tab_ApprRole.java`, 143줄)

- 레이아웃: center=vlc
- 입력·하위 화면: `titleNameComboBox` ComboBoxField("EmpTitleCode"), `apprStepComboBox` ComboBoxField("OrgLevelCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - seq 80 "우선순위" Text 편집:TextField
  - useYnFlag 80 "사용여부" Boolean
  - titleName 220 "직책코드" Text 편집:titleNameComboBox
  - apprStepName 220 "결재등급" Text 편집:apprStepComboBox
  - note 440 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L38-41) → makeLayout(), setInitData()
[E1] searchBarBuilder[조회].Retrieve (L45) → retrieve()
[E2] searchBarBuilder[저장].Update (L46) → update()
[E3] searchBarBuilder[등록].Insert (L47) → insertRow()
[E4] searchBarBuilder[삭제].Delete (L48) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L130) → 서비스 apr.Apr08_ApprRole.delete
[E5] titleNameComboBox[EmpTitleCode].Collapse (L77) → 인라인 L77-83 (new CollapseHandler() { @Override pub…)
[E6] apprStepComboBox[OrgLevelCode].Collapse (L87) → 인라인 L87-93 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInitData() | L63-68 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L105-109 | E1,setInitData | 서비스 apr.Apr08_ApprRole.selectByAll(companyId) | 업무 |
| public update() | L112-115 | E2 | 서비스 apr.Apr08_ApprRole.update | 업무 |
| public insertRow() | L118-123 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L126-141 | E4 | ConfirmBox → E7 | 업무 |
| private makeLayout() | L43-61 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L70-102 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('seq', 80, '우선순위', { editor: 'text' }),  // L95
  // ⚠DB없음 L96 useYnFlag 80 "사용여부" (apr08_use_yn_flag 컬럼 없음)
  // ⚠DB없음 L97 titleName 220 "직책코드" (apr08_title_nm 컬럼 없음)
  // ⚠DB없음 L98 apprStepName 220 "결재등급" (apr08_appr_step_nm 컬럼 없음)
  gb.text('note', 440, '비고', { editor: 'text' }),  // L99
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

