# SYS-BZ-0005 권한그룹에 메뉴를 준다

> **한 줄 요약** — 방금 만든 `임원` 권한그룹은 비어 있다. 고객사 관리자가 임원이 볼 **경영관리 > 01. 조직 및 사원관리** 메뉴를 체크해 준다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` (KFS 관리자 대행: #1286, 다른 회사로 복사: #1247) |
| 언제 | 권한그룹을 만든 직후, 메뉴 구성이 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0004(권한그룹), SYS-BZ-0003(회사 메뉴) |
| 다음 이벤트 | SYS-BZ-0006 직원에게 권한그룹 주기 |
| 실제 실행 | kalpa, 2026-11-09 (`임원` 메뉴 8개) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1070** 관리자 > 01. 화면권한관리 > 권한그룹별 메뉴 맵핑 | 왼쪽 권한그룹 목록에서 `임원` 클릭 | 오른쪽에 메뉴 트리. 아직 "권한" 체크가 하나도 없다 |
| 2 | 〃 | #1070 | 트리에서 `경영관리` → `01. 조직 및 사원관리` 아래의 메뉴 "권한"을 체크 | 체크한 메뉴가 켜진다 |
| 3 | 〃 | 〃 | [저장] | 저장된 메뉴가 다시 체크돼 보인다 |

이번에 켠 메뉴(8개, 상위 메뉴 포함): `경영관리`, `01. 조직 및 사원관리`, 조직정보 등록(#1028), 사원정보 관리(#1029), 조직별 사원조회(#1030), 증명서 발급(#1115), 임원정보 관리(#1294), 사원정보 변경조회(#1474).

## DB에 남는 것

| 테이블 | 무엇 | 추가 | 행 |
|:---|:---|:---|---:|
| `sys07_role_menu` | 권한그룹별 메뉴 | 추가 | 8 (모두 `use_yn=true`) |

## 결과를 볼 수 있는 화면

- #1070 트리, #1284 메뉴별 그룹권한(View). 직원이 이 권한을 받은 뒤(0006) 자기 메뉴.

## 업무 규칙 · 주의

- 트리는 회사에 열린 메뉴(#1076, SYS-BZ-0003) 기준으로 나온다(이번 조회 495행). 회사 메뉴에 없는 메뉴를 줄 수 있는지는 확인하지 않았다.
- 상위 메뉴(`경영관리` 등)도 같이 켜야 화면 위에서 아래로 열린다.
- 이미 있던 `일반 사용자` 같은 권한그룹의 메뉴도 같은 화면에서 고친다.
- 이번에는 켤 메뉴 8행만 보내 저장했다. 보내지 않은 메뉴를 끄는 방법(체크 해제 = `useYn=false`)은 따로 확인하지 않았다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0005
needs: [SYS-BZ-0004]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 1
    api: GET /api/v1/sys/roles/{roleId}/menus      # 트리 조회
  - no: 3
    screen: 1070
    action: '권한 체크 → [저장]'
    api: PUT /api/v1/sys/roles/{roleId}/menus
    body: [ { menuId: 4000, roleMenuId: null, useYn: "true" },   # 경영관리
            { menuId: 4100, ... },                               # 01. 조직 및 사원관리
            { menuId: 4110 }, { menuId: 4120 }, { menuId: 4130 },
            { menuId: 77524 }, { menuId: 202308141568775 }, { menuId: 202602099474807 } ]
expect:
  - { table: sys07_role_menu, where: "role = 임원", rows: 8, use_yn: "true" }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select count(*) from sys07_role_menu where sys07_role_id = :roleId and sys07_use_yn = 'true';
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys07_Tab_RoleMenu`(#1070, 왼쪽 `roleGrid`, 오른쪽 트리 "권한" 칼럼, [저장])
- TOBE: `GET·PUT /api/v1/sys/roles/{roleId}/menus`(`SysMenuController.getRoleMenuTree`·`updateRoleMenus`), 요청 `[{menuId, roleMenuId, useYn}]`
- TOBE 상태(2026-11-09): **실행** — kalpa에서 API로 8개 저장·조회 확인. 자동 시험·화면 눈 확인은 아직(`대기`).
- 응답의 `depth`가 모두 0으로 오는 것은 이번에 확인한 TOBE 동작이다(AS-IS 트리 깊이와 같은지 비교 안 함).
</details>
