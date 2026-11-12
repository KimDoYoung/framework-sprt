# APR-BZ-0011 대외활동 신청서와 이익제공(수령) 사전승인 신청서를 올린다

> **한 줄 요약** — 직원이 #1343에서 "대외활동신고서(보고서)", #1134에서 "이익제공·이익수령 사전승인 신청서"를 올린다. 두 화면은 **이름표(링크코드 `A40`·`A10`~`A12`)가 붙은 문서분류로 결재문서 창을 여는 얇은 화면**이다. 먼저 관리자가 #1280 문서분류지정에서 이름표마다 문서분류를 정해 둬야 하고, 그러지 않으면 [승인신청]이 막힌다. 목록은 **내가 올린 문서만** 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(사원 `kalpa/401/Kalpa1234!`) → 결재자(과장 `kalpa/301`). 문서분류는 고객사 관리자(`kalpa/admin/1111`) |
| 언제 | 수시(대외 강연·기고, 거래처 접대·선물 한도 초과) |
| 먼저 있어야 하는 것 | #1280 문서분류지정(`A40`·`A10`·`A11`·`A12`), 공통코드 `PreProvideRcvType`(A10·A11·A12 — kalpa는 회사 코드 3개 있음), 결재선에 넣을 사원 |
| 다음 이벤트 | APR-BZ-0002(승인·반려), APR-BZ-0004(문서함) |
| 실제 실행 | kalpa, 2026-11-12, API. 401이 올리고 301이 승인 |
| 메뉴 | #1343 신청 > 90. 기타신청 > 대외활동 신청서 작성, #1134 준법감시 > 40. 이익제공(수령)현황 > 이익제공 사전승인신청. **kalpa 회사 메뉴에는 둘 다 없다**(S1 상품) — API로만 실행. 화면 눈 확인 `대기` |
| 참고 | `#1453` 사무수탁사 확인서(`Apr01_Tab_OfficeWorkCert`)는 메뉴가 없어 다루지 않는다 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | #1280 문서분류지정 | `A40`→`컴플라이언스/임직원 대외활동 승인`, `A10`→`…/재산상 이익수령제외 신청`, `A11`→`…/재산상 이익제공 금액 사전 이사회 의결`, `A12`→`…/이사회가 의결한 재산상 이익제공 금액기준 마련` 선택 → [저장] | 저장 4건. 안 하면 직원 화면 문서분류 칸에 "문서분류가 미지정 상태입니다. 관리자에게 문의해주세요" |
| 2 | 직원 | #1343 | 조회기간(기본) → [조회] | 내가 올린 "대외활동신고서(보고서)…" 문서(등록일·시행일·문서분류·문서명·결재상태·상세보기). 없으면 빈 목록 |
| 3 | 〃 | 〃 | [승인신청] (문서분류 칸이 비어 있으면 "문서분류를 선택해주세요") | 결재문서 창. 제목 `대외활동신고서(보고서)_김사원`(읽기 전용), 시행일 오늘, [저장] 버튼 숨김 |
| 4 | 〃 | 결재문서 창 | 본문 작성, 결재선 `상신 김사원 → 결재 김과장`, [결재요청] | 문서 `상신(10)`. 목록 [조회]하면 결재상태 `상신` |
| 5 | 결재자 | 결재할 문서함 | [승인] | 결재상태 `완료`(30) |
| 6 | 직원 | #1134 | 신청서 구분 콤보에서 `이익제공 사전승인 신청서(한도초과)` 선택 | 문서분류 칸의 빈칸 글이 그 이름표의 문서분류로 바뀐다 |
| 7 | 〃 | 〃 | [승인신청] → 결재문서 창(제목 `이익제공 사전승인 신청서(한도초과)_김사원`) → 결재요청 | `상신`. 같은 방법으로 `이익수령 사전승인 신청서(한도초과)`(A12)도 |
| 8 | 직원 | 〃 | [조회] | 내가 올린 A10·A11·A12 문서만 나온다(결재상태 `완료`·`상신`) |

#1134의 [문서분류지정] 버튼은 문서분류지정 조회창(`Dcr30_Lookup_Link`)을 연다(원본 이벤트 E3). 이 창의 동작은 이번에 확인하지 못했다.

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `dcr30_link` | 이름표별 문서분류(`dcr30_class_tree_id`) 4행 수정 | 1 |
| `apr01_appr` | 결재문서(`apr01_link_cd`에 `A40`·`A11`·`A12`, 상태 10 → 30) | 4·7 +3 |
| `apr04_appr_step` | 결재선(상신·결재) 2줄 | 4·7 +6 |

## 결과를 볼 수 있는 화면

- #1343·#1134 목록(결재상태), #1019 상신내역, #1018 결재내역(결재자), 결재 알림.

## 업무 규칙 · 주의

- **목록은 서버가 로그인 사원으로 걸러 준다**(`GET /apr/apprs/by-title`·`/pre-provide` 모두 `principal.userId`·`companyId`). 실행: 401이 올린 문서는 401 목록에만 나오고 301(결재자)·관리자 목록은 비어 있다. 요청에 사원 번호를 보낼 길이 없다 → 남의 문서가 목록으로 새지 않는다(양호).
- **#1343은 제목으로 찾는다**: 제목이 `대외활동신고서(보고서)`로 시작하는 내 문서(서버가 뒤에 `%`를 붙임). 링크코드가 `A40`이어도 제목을 다르게 올리면 안 보인다(원본 같음). 제목은 문서 창에서 읽기 전용이라 정상 경로에서는 같아진다. `title` 값을 안 보내면 400, `%`를 보내면 내 문서 전체가 나온다.
- **#1134는 링크코드로 찾는다**: `apr01_link_cd`가 공통코드 `PreProvideRcvType`(시스템 코드는 회사 0, 아니면 내 회사)의 코드(A10·A11·A12)인 내 문서. 제목은 보지 않는다.
- **제목 만드는 법**: 시드(`GET /apr/apprs/link-seed?linkCode=A40|A10|A11|A12&typeName=…`)가 `typeName + "_" + 내 이름`을 돌려준다. `typeName`을 안 넘기면 `null_김사원`이 된다(원본도 콤보 글을 그대로 이어 붙임).
- 결재 규칙(저장·결재요청 검사, 상태 99/10/20/30/40)은 [APR-BZ-0001](APR-BZ-0001-기안상신.md)·[0002](APR-BZ-0002-승인반려.md)와 같다. 이 화면들이 하는 일은 "분류 정하고 시드 받아 창을 여는 것"까지다.
- 문서분류지정 저장 `PUT /api/v1/dcr/links`는 **직원도 호출할 수 있다**: 401이 같은 값으로 저장 → 200 `Data: 1`(바꾸지는 않았다). 관리자 화면(#1280)인데 서버가 메뉴 권한을 안 본다 → [보안_및_버그_의심 의심 #48].
- 안 한 것: 화면 눈 확인, 첨부 올리기, 이익수령 제외 신청서(A10)·사무수탁사 확인서(#1453)의 문서 올리기, 반려 뒤 재상신, 이익제공 신청서의 한도 계산, 본문 양식(`formType`).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0011
needs: [EMP-BZ-0001, APR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "admin", password: "1111" }
    api:
      - GET /api/v1/dcr/links/lookup?linkCodeList=A40     # 한 번에 하나씩(콤마 목록은 0행)
      - PUT /api/v1/dcr/links   # [{linkId:<A40>, classTreeId:<임직원 대외활동 승인>}, A10·A11·A12도]
    expect: { api: "GET /api/v1/dcr/links/class-tree-by-code?linkCode=A40", rows: 1 }
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: GET /api/v1/apr/apprs/by-title?startDate=2026-11-01&endDate=2026-11-30&title=대외활동신고서(보고서)
    expect: { rows: 0 }
  - no: 3~4
    api:
      - GET /api/v1/apr/apprs/link-seed?classTreeId=<대외활동 승인>&linkCode=A40&typeName=대외활동신고서(보고서)   # 제목 "대외활동신고서(보고서)_김사원"
      - GET /api/v1/apr/apprs/new?classTreeId=<대외활동 승인>
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A40, steps 00:401 · 10:301, effectDate·regDate 필수
    expect: { data: { ok: true, statusCode: "10" } }
  - no: 5
    actor: { user: "301" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm   # { action: confirm, message }
    expect: { api: "GET /api/v1/apr/apprs/by-title (401)", fields: { statusName: "완료" } }
  - no: 7~8
    actor: { user: "401" }
    api:
      - PUT /api/v1/apr/apprs/{apprId}   # linkCode A11, title "이익제공 사전승인 신청서(한도초과)_김사원"; A12도
      - POST /api/v1/apr/apprs/{apprId}/confirm   # 301, A11만
      - GET /api/v1/apr/apprs/pre-provide?startDate=2026-11-01&endDate=2026-11-30
    expect: { rows: 2, byUser: { "301": 0, admin: 0 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr01_Tab_ExternalBiz`(#1343, 이벤트 E0~E4: 생성자·문서분류 조회창·[승인신청]·[조회]·상세보기 셀, `insertLinkApproval` L234-254 링크코드 `A40`), `Apr01_Tab_BizPriorApproval`(#1134, E0~E6: 신청서 구분 콤보 `PreProvideRcvType`·문서분류 조회창·[문서분류지정]·[승인신청]·[조회]·상세보기 셀, `insertLinkApproval` L362-382, `retrieve` L277-295 `preProvideRcvApprYn=true`).
- AS-IS 서버: `apr.Apr01_Appr.selectByText`(L126), `dcr.Dcr30_Link.selectByLinkCode`(L46).
- TOBE: 화면 `Apr01_Tab_ExternalBiz.tsx`·`Apr01_Tab_BizPriorApproval.tsx`, API `GET /api/v1/apr/apprs/by-title`·`/pre-provide`(`AprApprService.searchByTitle`·`searchPreProvide`, 매퍼 `AprApprMapper.selectByTitle`·`selectPreProvide`), 시드 `PriorApprovalLinkSeedProvider`(A10·A11·A12·A40), `GET /api/v1/dcr/links/class-tree-by-code`.
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
