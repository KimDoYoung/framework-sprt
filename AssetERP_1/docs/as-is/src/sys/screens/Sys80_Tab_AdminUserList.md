# Sys80_Tab_AdminUserList

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > Admin 사용자 관리 (#1197)
- 파일: `client/vi/sys/Sys80_Tab_AdminUserList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys80_AdminUserList.delete` | Sys80_Tab_AdminUserList:139 | [`Sys80_AdminUserList.java:80`](../../sys/services/Sys80_AdminUserList.md) | `UpdateDataModel(sys80_admin_user_list)` 동적 DELETE |
| `sys.Sys80_AdminUserList.selectByAll` | Sys80_Tab_AdminUserList:106 | [`Sys80_AdminUserList.java:27`](../../sys/services/Sys80_AdminUserList.md) | [`sys80_admin_user_list.selectByAll`](../../sys/sql/sys80_admin_user_list.md) |
| `sys.Sys80_AdminUserList.update` | Sys80_Tab_AdminUserList:118 | [`Sys80_AdminUserList.java:75`](../../sys/services/Sys80_AdminUserList.md) | `UpdateDataModel(sys80_admin_user_list)` 동적 INSERT/UPDATE → [`sys80_admin_user_list.selectById`](../../sys/sql/sys80_admin_user_list.md) |

## 테이블

[`sys80_admin_user_list`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys80_Tab_AdminUserList (`client/vi/sys/Sys80_Tab_AdminUserList.java`, 151줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - userPhone 150 "휴대폰" Text 편집:TextField
  - userName 100 "성명" Text 편집:TextField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L44-90) → retrieve()
[E1] retrieveButton[조회].Select (L54) → retrieve()
[E2] insertButton[등록].Select (L60) → insertRow()
[E3] updateButton[저장].Select (L66) → update()
[E4] deleteButton[삭제].Select (L72) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L132) → 서비스 sys.Sys80_AdminUserList.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L103-112 | 생성자,E1 | 서비스 sys.Sys80_AdminUserList.selectByAll | 업무 |
| public update() | L115-119 | E3 | 서비스 sys.Sys80_AdminUserList.update(personId) | 업무 |
| public insertRow() | L122-126 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L129-150 | E4 | ConfirmBox → E5 | 업무 |
| public buildGrid() | L92-100 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('userPhone', 150, '휴대폰', { editor: 'text' }),  // L95
  gb.text('userNm', 100, '성명', { editor: 'text' }),  // L96
  gb.text('note', 500, '비고', { editor: 'text' }),  // L97
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

