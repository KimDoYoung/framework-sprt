# SYS-BZ-0014 메뉴를 새로 만들거나 고친다(화면안내 포함)

> **한 줄 요약** — 새 화면을 배포하면 KFS 관리자가 #1077에서 메뉴(`sys06_menu`: 이름·화면번호·클래스명·순서·사용)를 만들고, 오른쪽 회사 목록에서 쓸 회사를 체크해 연다(`sys03_company_menu`). 화면 설명은 #1360(또는 #1077 화면안내 칸)에 적는다. 메뉴표는 **모든 회사가 함께 쓰는 하나의 표**다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` |
| 언제 | 화면 배포 때, 메뉴 이름·순서를 바꿀 때 |
| 먼저 있어야 하는 것 | 화면 클래스가 배포돼 있어야 함(TOBE는 `frontend/src/pages/screens.ts`에 등록된 클래스 이름으로 화면을 연다) |
| 다음 이벤트 | SYS-BZ-0003(회사에 메뉴 열기)·0005(권한그룹에 메뉴 주기) — 직원에게 보이려면 권한그룹에도 넣어야 한다 |
| 실제 실행 | 2026-11-10, **시험 메뉴를 만들어 확인한 뒤 지움**(메뉴표는 전 회사 공용이라 흔적을 남기지 않음) |

## 따라 하기

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1077** 관리자 > 01. 고객관리 > 메뉴 관리 | 트리에서 `관리자 > 09. 기타` 선택 → [하위매뉴 등록] | "매뉴 편집" 창 |
| 2 | 매뉴 편집 | 매뉴명 `업무분석 시험메뉴`, 순서 `99`, 화면번호 `9901`, 클래스명 `Sys12_Tab_Calendar`, 사용 체크 → [저장] | 트리 `09. 기타` 아래에 새 메뉴 |
| 3 | #1077 오른쪽 회사 목록(`Sys01_Grid_CompanyMenu`) | 새 메뉴 선택 → `(주)칼파테크` 체크 → [저장] | 칼파테크에 메뉴가 열림 |
| 4 | **#1360** 관리자 > 02. 시스템관리 > 화면안내등록 | 메뉴명으로 조회 → 화면안내 칸 입력 → [저장] | #1077 그리드의 화면안내 열에도 같은 글 |
| 5 | (확인) `kalpa/admin/1111`로 로그인 | 메뉴 | `관리자 > 09. 기타 > 업무분석 시험메뉴`(누르면 일자관리 화면) |
| 6 | (정리) #1077 | 회사 목록에서 칼파테크 체크 해제 → [저장], 매뉴 편집 → [삭제] | 메뉴·연결 모두 0건 |

※ 여러 메뉴를 여러 회사에 한 번에 열거나 닫을 때는 [일괄복사](`Sys06_Lookup_CopyMulti`, 권한부여·권한삭제)를 쓴다 — 아래 "TOBE 차이".

## DB에 남는 것 (이번 실행: 만들었다가 지움 → 최종 0)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys06_menu` | 메뉴(전 회사 공용) | 추가(2), 화면안내 `sys06_note` 수정(4), 삭제(6) | +1 → 0 |
| `sys03_company_menu` | 회사별 메뉴 연결 | 추가(3), 삭제(6) | +1 → 0 |

## 업무 규칙 · 주의 (실행으로 확인)

- 매뉴명 필수("매뉴명을 입력하세요."), 화면번호는 4자까지, **다른 메뉴와 같은 화면번호 금지** — `1080`으로 만들면 "이미 사용 중인 화면번호입니다: 1080"(**확인**, 저장 안 됨).
- **삭제는 메뉴 행만 지운다.** 회사 연결(`sys03`)·권한그룹 연결(`sys07`)·하위 메뉴는 남는다(AS-IS `deleteModel` 그대로). 그래서 지우기 전에 회사 연결부터 끊어야 한다 — 이번엔 연결을 먼저 끊고 지워 0건을 확인했다.
- 회사에 열어도 **고객사 관리자에게만** 바로 보인다. 직원에게 보이려면 권한그룹에 넣어야 한다(SYS-BZ-0005).
- 화면안내(`sys06_note`)는 메뉴 행의 칸이라 전 회사에 같은 글이 보인다.

## TOBE 차이 (변경반영 대상)

**[일괄복사] 창의 권한부여·권한삭제가 현재 원본과 다르다.**

| | 현재 AS-IS (`insertByMenuYn`, 2026-07-07 `c5de7dbf5`에서 바뀜) | TOBE (`updateCompanyMenuUse` = 옛 `updateByMenuYn`) |
|:---|:---|:---|
| 권한부여(연결 없음) | INSERT | INSERT |
| 권한삭제(연결 없음) | **아무것도 안 함** | `use_yn=false`로 **INSERT** |
| 권한삭제(연결 있음) | **행 DELETE** | `use_yn=false` **UPDATE**(부모 아래 사용 중이면 그대로) |

- 원본이 7월에 바뀌었는데 TOBE는 그 전 소스로 변환했다. `yunhee drift`는 기준(baseline) 이후 변경만 보므로 잡히지 않았고, `yunhee trace-pair '#1077'`의 "ASIS에만 있음: `sys.Sys06_Menu.insertByMenuYn`"으로 찾았다.
- 이번 실행에서는 일괄복사를 쓰지 않았다(회사 목록 그리드로 열고 닫음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0014
actor: { company: admin, user: admin, password: "1111" }
steps:
  - no: 2
    screen: 1077
    api: POST /api/v1/sys/menus
    body: { menuNm: "업무분석 시험메뉴", seq: "99", parentId: 9530, useYn: "true", classNm: "Sys12_Tab_Calendar", addTitleUseYn: "false", mobiUseYn: "false", menuNo: "9901" }
  - no: 3
    screen: 1077
    api: PUT /api/v1/sys/companies/menu-yn?menuId={menuId}
    body: [{ companyId: "<칼파테크>", companyMenuId: null, menuYn: "true" }]
  - no: 4
    screen: 1360
    api: PUT /api/v1/sys/menu-guides
    body: [{ menuId: "{menuId}", note: "업무분석 시험용 메뉴입니다. 일자관리 화면을 엽니다." }]
  - no: 5
    actor: { company: kalpa, user: admin, password: "1111" }
    api: GET /api/v1/sys/menus     # 관리자 > 09. 기타 > 업무분석 시험메뉴 (menuNo 9901)
  - no: 6
    api: [PUT /api/v1/sys/companies/menu-yn?menuId={menuId} (menuYn false), DELETE /api/v1/sys/menus/{menuId}]
reject:
  - { api: POST /api/v1/sys/menus, body: { menuNo: "1080" }, message: "이미 사용 중인 화면번호입니다: 1080" }
expect_after_cleanup:
  - { table: sys06_menu, where: "sys06_menu_id = :menuId", rows: 0 }
  - { table: sys03_company_menu, where: "sys03_menu_id = :menuId", rows: 0 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee screen-desc 1077,1360 --summary`(화면·팝업·API·테이블), `yunhee trace-pair '#1077'`(서비스↔API 짝, `insertByMenuYn` 짝 없음), `yunhee trace-crud --screen '#1077'`·`'#1360'`(테이블 C/R/U/D). trace-crud의 "TOBE에 C 없음(#1077)"·"CU 없음(#1360)"은 **오탐** — 매퍼에 `SysMenuMapper.insertMenu`·`updateMenu`, `SysMenuGuideMapper.updateNote`가 있다.
- AS-IS: `Sys06_Tab_Menu`(#1077), `Sys06_Edit_Menu`(저장 `sys.Sys06_Menu.update`, 삭제 `delete`), `Sys01_Grid_CompanyMenu`(`sys.Sys01_Company.updateByMenuYn`), `Sys06_Lookup_CopyMulti` L295(`insertByMenuYn`, Sys06_Menu.java:660-703), `Sys06_Tab_MenuGuide`(#1360, `sys.Sys06_Menu.update`)
- TOBE: `SysMenuController` `POST·PUT·DELETE /api/v1/sys/menus`, `PUT /menus/company-use`(`SysMenuService.updateCompanyMenuUse` L300-336), `SysCompanyController` `GET·PUT /companies/menu-yn`, `SysMenuGuideController` `GET·PUT /menu-guides`
- TOBE 상태(2026-11-10): **실행** — 만들기·회사 열기·화면안내·칼파테크 메뉴에 보임·정리까지 API로. 중복 화면번호 거부 확인. **화면 눈 확인(사용자, 2026-11-10): #1077의 [하위매뉴 등록] 창·오른쪽 회사 목록·[일괄복사] 창이 모두 열림.** 일괄복사 실행·자동 시험은 아직.
</details>
