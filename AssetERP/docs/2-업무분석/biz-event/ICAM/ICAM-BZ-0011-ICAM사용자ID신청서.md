# ICAM-BZ-0011 KFS가 ICAM 사용자ID 신청서를 작성해 상신한다

> **한 줄 요약** — KFS 담당이 #1314 사용자ID 신청서 작성에서 고객사 사용자의 ICAM 계정 신청(신청일·회사명·사용자·처리구분 등록/수정/삭제·신청내용)을 등록한다(`icam55_icam_user`, 신청서구분 1). 행을 골라 **[결재요청]**을 누르면 링크코드 **A33**(ICAM 사용자ID 신청서) 결재문서를 올리고 행에 결재 ID를 붙인다. 결재 중·완료 행은 고치거나 지울 수 없다. 결재 전 행을 지우면 붙은 결재문서도 폐기된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS ICAM 운영 담당(시험은 104 천영임) → 결재자(시험은 박동진 29025) |
| 언제 | 고객사가 ICAM 계정을 신청할 때 |
| 먼저 있어야 하는 것 | 회사의 A33 문서분류 지정(#1280). **KFS 28000에는 비어 있었다** → 회사 관리자(`admin/kfstest`)로 A33·A34를 "상품전략/상품개발/기타"(`202604029585642`)에 지정 |
| 다음 이벤트 | 0012 처리결과 등록 |
| 실제 실행 | 2026-11-14, API(104). 목록 AS-IS 13 = 13(그리드 12열). 신청서 `202611149151481` 저장(+1) → A33 결재문서 `202611149151484` 상신(상태 10, 결재 박동진) → 연결(`PUT /users/{id}/appr-id`) → 목록 결재상태 `상신`. 상신 중 행 수정·삭제 400. **kalpa 사원 401이 KFS 신청서를 모두 보고, 고치고, 결재 연결을 끊고, 행을 지우면서 붙은 KFS 결재문서를 폐기했다**(⚠#244 — 시험 행·임시저장 문서로만) |
| 메뉴 | #1314 KFS > 04. ICAM 사용자ID 관리 > 사용자ID 신청서 작성 (KFS·미래에셋·TDM·원자산운용 등 6곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1314 | 기간·검색어·처리결과 포함 → [조회] (`GET /icam/users?startDate=&closeDate=&searchText=&procResult=`) | 신청일·회사·사용자·처리구분(O)·결재상태 |
| 2 | 〃 | 〃 | [등록] → 오른쪽 편집(`Icam55_Edit_UserRegAppr`) 신청일·회사명·사용자·처리구분·신청내용(`Icam55_Lookup_RegContent`) → [저장] (`PUT /icam/users`) | 새 행. 빈칸이면 "신청일자를/회사명을/사용자를/처리구분을/신청내용을 …" |
| 3 | 〃 | 〃 | 행 선택 → [결재요청] → A33 결재문서(문서분류 1건일 때만) → 결재선·상신 (`PUT /apr/apprs/{id} mode:"request"`) → 연결 (`PUT /icam/users/{id}/appr-id {apprId}`) | 결재상태 `상신`. 문서분류가 없으면 "문서분류 지정이 안 되어있습니다" |
| 4 | 〃 | 〃 | [상세보기] | 결재문서 창 |
| 5 | 〃 | 〃 | 행 체크 → [삭제] (`DELETE /icam/users?ids=`) | 결재 중이면 "결재진행 중인 문서가 존재합니다". 아니면 붙은 결재문서를 폐기(`apr99`)하고 행 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam55_icam_user` | 신청서(구분 1)·결재 ID | +1(`202611149151481`, 0012에서 씀) · 시험 행 2는 +1 → −1 |
| `apr01_appr`·`apr04_appr_step` | A33 결재문서(상신 10) | +1(`202611149151484`) · 임시저장 시험 문서 +1 → 401 삭제로 −1 |
| `apr99_appr_del` | 폐기 문서 | +1(삭제자 kalpa 401 — #244 재현 흔적) |
| `dcr30_link` | KFS 28000 A33·A34 문서분류 | 빈칸 → "기타" |

## 업무 규칙 · 주의

- 저장 입력 검사·결재 중 잠금(`결재 중인 문서이거나, 완료된 문서가 포함되어있습니다`)은 서버도 한다(TOBE가 화면 검사를 서버로 옮김).
- 삭제 잠금은 결재 10·20만이다. 임시저장(99)·완료(30)·반려(40) 문서가 붙은 행은 지워지고, 문서는 폐기 문서로 옮겨진다(원본 `deleteCheck`와 같음).
- **회사 구분이 없다**: 표에 회사 열이 없고 API에 메뉴·회사 검사가 없다. 그래서 다른 고객사 사원이 KFS 신청서를 보고, 고치고, 지우고, 결재 연결까지 바꾼다 → [의심 #244](../../보안_및_버그_의심.md). 원본도 같은 SQL이지만 메뉴가 6곳에만 있다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0011
company: 28000 (KFS, 기본 계정 104)
pre:
  - api: PUT /api/v1/dcr/links      # 회사 관리자 admin/kfstest
    body: [{linkId: 202609019856649, classTreeId: 202604029585642}, {linkId: 202609019856650, classTreeId: 202604029585642}]
steps:
  - no: 1
    api: GET /api/v1/icam/users?startDate=2000-01-01&closeDate=2099-12-31
    expect: rows 13
  - no: 2
    api: PUT /api/v1/icam/users
    body: {icamUserId: 0, regDate: 2026-11-14, companyName: ZZ칼파테크, userName: ZZ시험사용자, procAddYn: true, regContent: "ZZ ICAM 조회 권한 신청(시험)"}
  - no: 3
    api: GET /api/v1/apr/apprs/new?classTreeId=202604029585642 → PUT /api/v1/apr/apprs/{apprId}
    body: {mode: request, linkCode: A33, effectDate: "2026-11-14T00:00:00", steps: [00:29049, 10:29025]}
    expect: statusCode 10
  - no: 4
    api: PUT /api/v1/icam/users/{2의 id}/appr-id
    body: {apprId: "{3의 apprId}"}
  - no: 5
    as: kalpa/401
    api: PUT /api/v1/icam/users/{2의 id}/appr-id
    expect: 403 이어야 함 (지금 200 — #244)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam55_Tab_UserRegAppr`(#1314 E2~E5, `retrieveDoc` L269-287 `dcr.Dcr30_Link.selectByLinkCode("A33")`, `updateApprId` L290, `aprDelete` L486, `delete` L511-521), `Icam55_Edit_UserRegAppr.updateRow` L209-277, SQL `icam55_icam_user.selectBySearchText`.
- TOBE: `IcamUserController` L38-67, `IcamUserService` L44-153, `frontend/src/pages/icam/Icam55_Tab_UserRegAppr.tsx` L28·L69·L147.
- 확인: `compare GET /icam/users --sql icam55_icam_user.selectBySearchText --grid Icam55_Tab_UserRegAppr` 13=13, `api DELETE /icam/users?ids=… -u 401 -c kalpa --track apr01_appr,icam55_icam_user,apr99_appr_del`.
</details>
