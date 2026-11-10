# EMP-BZ-0012 주소록을 관리한다 (개인·공용·그룹)

> **한 줄 요약** — 메일을 보낼 바깥 담당자를 직원마다 **개인 주소록**(#1025)에 적고, 회사가 함께 쓰는 연락처는 **공용 주소록**(#1211)에 적는다. 자주 보내는 사람들은 **그룹**(그룹설정 창)으로 묶는다. 그룹에는 주소록 항목과 사내 직원을 섞어 넣을 수 있다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 개인: **직원 본인**(`kalpa/401/Kalpa1234!`) · 공용: 과장(`경영 관리자`, kalpa 메뉴 배분) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | EMP-BZ-0001, SYS-BZ-0012. kalpa는 2026-11-10에 메뉴를 열었다([메뉴 범위](EMP-업무흐름.md#가상-회사-kalpa의-메뉴-범위)) |
| 다음 이벤트 | 메일 보내기(DCR·EML 도메인 — 받는 사람을 주소록·그룹에서 고른다) |
| 실제 실행 | kalpa, 2026-11-10 — 401로 개인·공용 항목과 그룹을 만들었다가 모두 지움(주소록 24행 · 그룹 27행, 처음과 같음) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1025** 문서작성 > 05. 메일관리 > 주소록 관리 | [등록] → 담당자명 `홍길동`, 이메일, 핸드폰, 회사이름 `(주)시험상사`, 직위 `대리` → [저장] | 한 줄. **나만 보인다**(다른 직원 목록에는 없음) |
| 2 | 직원 | **#1211** 문서작성 > 05. 메일관리 > 공용주소록 관리 | [등록] → `공용담당` … → [저장] | 회사 모두에게 보인다. "등록자" 칸에 내 이름 |
| 3 | 〃 | #1211 | 남이 올린 줄을 골라 [삭제] | "등록자만 삭제 가능합니다." (화면 검사) |
| 4 | 〃 | #1025 또는 #1211 | [그룹설정] → 그룹 창 [등록] → 그룹명 `거래처 담당`, 전체공개 끔 → 저장 | 왼쪽 그룹 목록에 한 줄 |
| 5 | 〃 | 그룹 창 | 그룹 선택 → 오른쪽 [등록] → 주소록 선택 창(개인·사내·공용 탭)에서 `홍길동`(외부)과 `최사원`(사내) 고름 → 저장 | 구분 `외부 (주)시험상사 홍길동 대리` · `사내 최사원 (운용본부)` |
| 6 | 〃 | 그룹 창 | 그룹 [삭제] → 확인 | 그룹과 구성원이 함께 지워진다. 남이 만든 그룹이면 "해당 내용을 등록한 사용자가 아닙니다. 그래도 삭제를 진행하시겠습니까?" 뒤 지울 수 있다(원본 설계) |

- 검색칸: #1025 "담당자명"(담당자·이메일·회사이름), #1211 "담당자명/회사이름/비고".
- 비공개 그룹은 만든 사람만, 전체공개 그룹은 회사 모두가 본다.

## DB에 남는 것

| 테이블 | 무엇 | 변화 |
|:---|:---|---|
| `emp10_addr_book` | 주소록 한 줄(등록자 `emp10_person_id`, 공용이면 `emp10_public_yn = 'true'`) | 단계 1·2마다 +1 |
| `emp57_addr_book_group` | 그룹(`parent_id = 0`)과 구성원(`parent_id = 그룹`, `relate_id` = 주소록 ID 또는 사원 ID) | 그룹 +1, 구성원 +1씩, 그룹 삭제 때 함께 - |

## 결과를 볼 수 있는 화면

- #1025, #1211, 그룹 창, 메일 보내기의 받는 사람 선택(주소록 선택 창 `Emp10_Lookup_List`).

## 업무 규칙 · 주의

- 목록은 원본 SQL과 같다(`yunhee compare`: 개인 `emp10_addr_book.selectByText` 1 = 1, 공용 `selectByPublicText`, 그룹 구성원 `emp57_addr_book_group.selectByParentId` 2 = 2).
- 원본 그대로인 점: 그룹 구성원 이름은 `회사명 || ' ' || 담당자 || ' ' || 직위`로 만든다 — **세 칸 중 하나라도 비면 이름 전체가 빈칸**이 된다(실행: 회사·직위 없는 `이몽룡` → 이름 빈칸). 저장은 보낸 값으로 통째로 덮어쓴다(빈 칸으로 보내면 지워진다).
- ⚠ **TOBE 보안 1 — 다른 회사의 주소록 그룹 구성원이 보인다.** `GET /api/v1/emp/addr-book-groups/{그룹ID}/members`·`/select-items`는 로그인 정보를 받지 않는다(`EmpAddrBookGroupService.searchMembers`). 실행: kalpa 직원 401이 다른 회사 그룹 `202607039773811`의 구성원 2명(이름·이메일·휴대폰)을 읽었다. 개인정보라 가장 먼저 막아야 한다.
- ⚠ **TOBE 보안 2 — 같은 회사 직원이 남의 개인 주소록을 고치고, 남의 공용 항목을 지울 수 있다.** 저장·삭제(`EmpAddrBookService.save`·`delete`, 그룹 구성원 `saveMembers`·`deleteMembers`)가 회사만 보고 등록자를 보지 않는다. 실행: 402가 401의 개인 항목 이름을 바꿨고(200), 401의 공용 항목을 API로 지웠다(1건). "등록자만 삭제" 검사는 화면에만 있다(원본도 화면만). 다른 회사에서는 지워지지 않는다(0건).
- 클래스 대조(`yunhee analysis ui --tobe frontend/src`): #1025·#1211 본 화면, 그룹 창 `Emp57_Lookup_Insert`, `Emp57_TabPage_Insert`, `Emp10_Lookup_List`, `Emp57_Edit_GroupName` 모두 버튼·이벤트·그리드 수가 같다. (그룹 창을 화면 대조에서 보면 "버튼 11/3"으로 나오는데, yunhee가 원본은 하위 클래스까지 합쳐 세고 TOBE는 파일 하나만 세서 생긴 차이다.)

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0012
needs: [EMP-BZ-0001, SYS-BZ-0012]
actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
steps:
  - no: 1
    api: PUT /api/v1/emp/addr-books
    body: [{ contactName: "홍길동", emailAddress: "hong@test.kr", mobileTelNo: "010-1111-2222", companyName: "(주)시험상사", posName: "대리" }]
    expect: { table: emp10_addr_book, delta: +1 }
  - no: 2
    api: PUT /api/v1/emp/addr-books
    body: [{ contactName: "공용담당", emailAddress: "pub@test.kr", companyName: "(주)공용", publicYn: "true" }]
  - { actor: { user: "402" }, api: "GET /api/v1/emp/addr-books?searchText=", expect: { rows: 0 } }
  - { actor: { user: "402" }, api: "GET /api/v1/emp/addr-books/public?searchText=", expect: { rows: 1 } }
  - no: 4
    api: POST /api/v1/emp/addr-book-groups
    body: { groupName: "거래처 담당", publicYn: "false" }
  - no: 5
    api: PUT /api/v1/emp/addr-book-groups/members
    body: [{ parentId: "<그룹>", relateId: "<홍길동>" }, { parentId: "<그룹>", relateId: "<402 사원ID>" }]
    expect: { table: emp57_addr_book_group, delta: +2 }
  - no: 6
    api: DELETE /api/v1/emp/addr-book-groups/{그룹}
    expect: { data: 3 }
security:
  - { actor: { user: "402" }, api: "PUT /api/v1/emp/addr-books [{addrBookId: <401 개인>}]", expect: { http: 403 } }   # 지금은 200 (⚠)
  - { api: "GET /api/v1/emp/addr-book-groups/{다른 회사 그룹}/members", expect: { http: 404 } }                    # 지금은 200 + 구성원 (⚠)
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp10_Tab_AddrBook`(#1025, E0~E7, `retrieve` L157-168 = 내 것만·비공개만), `Emp10_Tab_PublicAddrBook`(#1211, `insertRow` L160-166 공용 표시, `deleteRow` L188-198 "등록자만 삭제 가능합니다."), 그룹 `Emp57_Lookup_Insert`(`deleteRow` 등록자 아니면 다른 확인 문구) · `Emp57_TabPage_Insert` · `Emp57_Edit_GroupName` · `Emp10_Lookup_List`
- AS-IS 서버: `emp.Emp10_AddrBook.selectByText`·`selectByPublicText`·`update`·`delete`, `emp.Emp57_AddrBookGroup.getPersonList`(회사 조건 EXISTS)·`selectByParentId`·`modelUpdate`·`update`·`delete`·`deleteAll`
- TOBE: `/api/v1/emp/addr-books`(`GET`·`GET /public`·`PUT`·`DELETE`), `/api/v1/emp/addr-book-groups`(`GET`·`GET /list`·`POST`·`PUT /{id}`·`DELETE /{id}`·`GET /{id}/members`·`GET /{id}/select-items`·`PUT·DELETE /members`)
- TOBE 상태(2026-11-10): **실행(API, 직원 401·402)** — 개인·공용 등록·목록 분리, 그룹·구성원·삭제, 보안 확인. 메일 보내기와의 연결·화면 눈 확인은 `대기`.
</details>
