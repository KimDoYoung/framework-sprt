# AST-BZ-0002 회사가 고유자산 분류를 가져오고 예금계좌를 등록한다

> **한 줄 요약** — 회사 관리자가 #1087 고유자산 기본등록에서 **[가져오기]**로 관리자 회사(0)의 고유자산 분류(현금및예금 > 보통예금 … 종목까지)를 내 회사로 복사한다. 종목마다 회사의 모든 부서가 담당 부서(`ast10_manager`)로 들어간다. 그 뒤 자금관리 담당이 분류(예: 보통예금)를 골라 **우리 회사 계좌**를 종목으로 [등록]하고, [상세]에서 자산 대·중·소분류(보통예금 `101003`)·계좌유형·통화를 넣는다. 이 계좌가 자금집행(#1386)의 **출금계좌**, 미지급 결제(AST-BZ-0003)의 **결제계좌**가 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회사 관리자(가져오기) → 자금관리(kalpa 과장 301, 계좌 등록) |
| 언제 | 회사 개설 때, 계좌를 새로 열 때 |
| 먼저 있어야 하는 것 | AST-BZ-0001, ORG(부서 — 담당 부서로 들어감) |
| 다음 이벤트 | AST-BZ-0003(미지급 결제), PAY-BZ-0011(출금계좌), 0004~ |
| 실제 실행 | kalpa, 2026-11-12, API: kalpa 관리자 [가져오기](대상 회사 0) → `ast01_class_tree` +176(IC 38·IT 138), `ast10_manager` +414(종목 138 × 부서 3). 사원 301의 [가져오기]는 403. 301이 보통예금 아래 `우리은행 1002-555-000111(칼파 운영)` 등록(`202611129141714`, 코드 `0450000008`) → 상세 대 10·중 1010·소 101003·계좌유형 99·KRW → 출금계좌 조회창(`GET /ast/corp-accounts?searchText=우리은행`)에 나옴 |
| 메뉴 | #1087 고유자산 > 10. 고유자산 등록 > 고유자산 기본등록 ①, #1088 상세등록 ②. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회사 관리자 | #1087 | [가져오기] → 회사 고름(관리자 회사) | 왼쪽 트리에 분류·종목. 버튼은 회사 관리자에게만 보임 |
| 2 | 자금관리 | #1087 | 트리에서 `보통예금` 클릭 → 오른쪽 종목 그리드 [등록] → 이름 → [저장] | 새 종목(코드 자동) |
| 3 | 〃 | 〃 | 종목 줄 [상세] → 대·중·소분류·계좌유형·통화·거래처 → [저장] | 자산 분류가 붙음(이게 있어야 예금잔고·분개 계정이 맞는다) |
| 4 | 〃 | 〃 | [담당자] → 담당 사원·부서 | 미수/미지급 목록은 담당자·담당 부서만 본다 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast01_class_tree` | 분류(IC)·종목(IT) | +176 (가져오기) +1 (우리은행) |
| `ast10_manager` | 종목 담당 부서(유형 2) | +414 |

## 업무 규칙 · 주의

- [가져오기]는 서버가 회사 관리자만 허용한다(`user.getUserId() < 0`).
- 종목의 소분류가 예금잔고 대상 그룹(`ItemSClassCode003`: 101003 보통예금·101005 외화예금 …)이어야 예금잔고(0004)에 나온다.
- ⚠ 사원이 고유자산 종목(계좌)을 등록·삭제한다(분류 API 전체에 권한 검사 없음) → [의심 #105](../../보안_및_버그_의심.md).
- ⚠ [가져오기]의 대상 회사를 서버가 제한하지 않고, 복사된 종목이 원래 회사의 거래처를 가리킨다(kalpa 종목 16개 거래처 = 회사 28000의 `신한은행` 등) → [의심 #106](../../보안_및_버그_의심.md).
- 회사 0의 분류에 시험용 종목(공모주 이름·`신한은행#011` 등 138개)이 있어 그대로 kalpa로 들어왔다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0002
needs: [AST-BZ-0001]   # + ORG 부서(담당 부서로 들어감)
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/ast/class-trees/pull-data?targetCompanyId=0
    expect: { track: { ast01_class_tree: +176, ast10_manager: +414 } }
  - no: 2
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/ast/class-trees/{보통예금 분류}/items
    body: [{ parentTreeId: <보통예금>, classTreeName: "우리은행 1002-555-000111(칼파 운영)", seq: 10, typeCode: IT, useYn: "true", assetType: "1" }]
    expect: { track: { ast01_class_tree: +1 } }
  - no: 3
    api: PUT /api/v1/ast/class-trees/{id}/item-class
    body: { classTreeId: <id>, itemLClassCode: "10", itemMClassCode: "1010", itemSClassCode: "101003", accountType: "99", curCode: KRW }
  - no: 4
    api: GET /api/v1/ast/corp-accounts?stdDate=2026-11-12&searchText=우리은행
    expect: { first: { classTreeId: <id>, itemSClassName: 보통예금 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast01_Tab_ClassTreeIntrinsic`(#1087 E0~E8, pullData L367), `Ast01_Grid_AstType`(insert L272), `Ast01_Lookup_ItemClass`(modelUpdate L348), `Ast10_Lookup_Manager`, 서버 `Ast01_ClassTree.pullData` L362-441·`insert` L199·`modelUpdate` L174.
- TOBE: `AstClassTreeController`(`/api/v1/ast/class-trees` · `/pull-data` · `/{parentId}/items` · `/{id}/item-class` · `DELETE /{id}`), `AstClassTreeService.pullData` L89-, `AstCorpAccountController`(`/api/v1/ast/corp-accounts`).
</details>
