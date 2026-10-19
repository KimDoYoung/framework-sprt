# Sys04_Tab_Role

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 권한그룹 관리 (#1069)
- 파일: `client/vi/sys/Sys04_Tab_Role.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.delete` | Sys04_Tab_Role:216 | [`Sys04_Role.java:115`](../../sys/services/Sys04_Role.md) | `UpdateDataModel(sys04_role)` 동적 DELETE |
| `sys.Sys04_Role.selectByName` | Sys04_Tab_Role:136 | [`Sys04_Role.java:24`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |
| `sys.Sys04_Role.update` | Sys04_Tab_Role:179 | [`Sys04_Role.java:56`](../../sys/services/Sys04_Role.md) | `UpdateDataModel(sys04_role)` 동적 INSERT/UPDATE → [`sys04_role.selectById`](../../sys/sql/sys04_role.md) |

## 테이블

[`sys04_role`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys04_Tab_Role (`client/vi/sys/Sys04_Tab_Role.java`, 222줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 권한명: {roleName} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `roleName` TextField
- 그리드 `grid` (buildGrid()):
  - roleName 200 "*권한명" Text 편집:TextField
  - seq 70 "조회순서" TextCenter 편집:TextField
  - note 800 "권한설명" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L53-110) → retrieve()
[E1] retrieveButton[조회].Select (L55) → retrieve()
[E2] updateButton[저장].Select (L61) → update()
[E3] insertButton[등록].Select (L67) → insertRow()
[E4] deleteButton[삭제].Select (L73) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L195) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L123-137 | 생성자,E1 | 서비스 sys.Sys04_Role.selectByName(roleName, companyId) | 업무 |
| public update() | L140-181 | E2 | 서비스 sys.Sys04_Role.update | 업무 |
| public insertRow() | L184-190 | E3 | 상태 처리 | 업무 |
| private deleteChk() | L192-210 | E4 | ConfirmBox → E5 | 업무 |
| public deleteRow() | L213-217 | E5 | GridDeleteData sys.Sys04_Role.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L112-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L219-221 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '*권한명', { editor: 'text' }),  // L114
  gb.textCenter('seq', 70, '조회순서', { editor: 'text' }),  // L115
  gb.text('note', 800, '권한설명', { editor: 'text' }),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

