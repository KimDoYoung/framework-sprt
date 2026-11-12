# APR-BZ-0007 회사 인감과 추가 대표명의를 등록한다

> **한 줄 요약** — 경영관리팀이 #1026에서 "부서·(정)(부)책임자·인감이름·사용기간·법인인감 여부"를 정해 **사용인감**을 등록하고, #1506에서 인감과 묶어 **추가 대표명의**(PEF·리츠 등 회사 이름으로 따로 날인하는 경우)를 등록한다. 인감이 있어야 결재문서에서 인감을 고르고(대외문서 발급번호 → [EMP-BZ-0013](../EMP/EMP-BZ-0013-증명서발급.md)), 법인서류 신청([APR-BZ-0008](APR-BZ-0008-법인서류날인.md))에서 인감·대표명의를 고른다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(과장 `kalpa/301/Kalpa1234!`). 화면은 일반 직원 메뉴(문서작성 > 04. 전자결재) |
| 언제 | 도입 때, 인감·대표명의가 바뀔 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(책임자 사원), ORG-BZ-0001(부서) |
| 다음 이벤트 | 결재문서에서 인감 선택([EMP-BZ-0013](../EMP/EMP-BZ-0013-증명서발급.md)), [APR-BZ-0008](APR-BZ-0008-법인서류날인.md) |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 인감 등록 → 필수 검사 → 직원 401 수정 → 타사 부서·사원 지정 → 대표명의 등록 → 삭제 검사 |
| 메뉴 | #1026 문서작성 > 04. 전자결재 > 사용인감등록, #1506 〃 > 추가 대표명의 등록. **kalpa에는 메뉴가 없다**(`sys03_company_menu` 120개 중 APR 화면 0) — API로만 실행, 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 | **#1026** | [조회] | 인감 목록(부서·(정)·(부)책임자·인감이름·시작/종료날짜·사용용도·법인인감·결재선필수추가·전체사용·미사용 문서분류) |
| 2 | 〃 | 〃 | [등록] → 부서 `경영지원본부`, (정)책임자 김과장, (부)책임자 김사원, 인감이름 `업무분석법인인감`, 2026-01-01~9999-12-31, 법인인감 ✓, 전체사용 ✓ → [저장] | 행 저장. 부서·(정)(부)책임자·인감이름·시작날짜 중 하나라도 비면 "…는 필수선택/필수입력 항목입니다" |
| 3 | 〃 | 〃 | 줄의 인감 셀로 그림 올리기 | 인감 이미지(→ EMP-BZ-0013 5단계, 이번에는 안 함) |
| 4 | 과장 | **#1506** | [조회] → [등록] → 구분 `PEF`, 대표회사 `업무분석PEF(유)`, 대표자 `김사장`, 법인등기 ✓, 인감 `업무분석법인인감`(조회창), 사용 ✓ → [저장] | 행 저장. 구분이 비면 "구분을 선택하세요" |
| 5 | 〃 | 〃 | 행 선택 → [삭제] | 그 대표명의로 쓴 법인서류가 있으면 "…는 사용이력이 존재하는 대표명의입니다. 삭제할 수 없습니다." |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr10_stamp` | 인감(법인인감 `apr10_corp_stamp_yn`·전체사용·책임자 2명) | 2 +1 |
| `sys10_file` | 인감 그림(`parentId = stampId`) | 3 (이번에 안 함) |
| `apr15_repr_corp` | 추가 대표명의(구분 10 PEF / 20 리츠, 인감 연결) | 4 +1 |

## 결과를 볼 수 있는 화면

- 결재문서 창의 인감 조회창(`GET /api/v1/apr/stamps/doc`, `/by-org`), 법인서류 신청·매수관리의 인감·대표명의 조회창(`GET /api/v1/apr/repr-corps/lookup`: 회사 자신 + 추가 대표명의), 신청창 기본값(`GET /api/v1/apr/stamps/corp-stamp` → 첫 법인인감).

## 업무 규칙 · 주의

- **법인인감이 하나 이상이면 신청 창이 그 인감을 기본으로 채운다**(`selectCorpStampYn`). 추가 대표명의 목록 첫 줄은 항상 회사 자신(`(주)칼파테크`, 구분 `법인`, 법인등기 여부 `selectCorpRegYn`으로 확인)이다.
- **서버가 막는 것**: 인감 [저장]의 필수 4가지, 대표명의 구분 필수, 대표명의 삭제 때 사용이력 검사(`apr16_stamp_doc.selectByReprCorpId`).
- **서버가 막지 않는 것**(보안·버그 의심 후보):
  - 직원 `401`(메뉴 권한 없음)이 `PUT /apr/stamps/manage`로 인감을 고쳤다(200).
  - 다른 회사의 부서·사원(`orgId` 202404031667093 · `aprEmpId` 10232)을 책임자로 넣은 인감이 저장되고 조회에도 나온다(회사 소속 검사 없음).
  - **인감 삭제에 사용 검사가 없다**(원본도 `UpdateDataModel.deleteModel`뿐). 신청서·추가 대표명의가 붙어 있는 인감이 지워졌고(200) 대표명의의 `stampId`와 법인서류의 `stampId`는 없는 인감을 가리키게 됐다.
- 시험으로 만든 인감은 위 실험에서 지워졌다. 대표명의 `업무분석PEF(유)`와 그 대표명의로 쓴 등기부등본 신청(APR-BZ-0008)이 남아 있다.
- 안 한 것: 그림 올리기·내려받기, 미사용 문서분류(`dcr40_stamp_auth`), 사용 가능 부서(`org10_role_stamp`) 지정, 인감 사용기간 경계, 전체사용 ✗일 때 결재문서 인감 조회 제한, 화면 눈 확인.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0007
needs: [EMP-BZ-0001, ORG-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: PUT /api/v1/apr/stamps/manage
    body: [{ stampId: 0, orgId: <경영지원본부>, aprEmpId: <301>, secondEmpId: <401>, stampName: 업무분석법인인감, startDate: "2026-01-01", closeDate: "9999-12-31", useName: 업무분석, corpStampYn: "true", stepUseYn: "false", allUseYn: "true" }]
    expect: { table: apr10_stamp, delta: +1 }
    error: { body: aprEmpId 없음, message: "(정)책임자는 필수선택 항목입니다" }
  - no: 4
    api: PUT /api/v1/apr/repr-corps
    body: [{ reprCorpId: 0, corpType: "10", corpName: 업무분석PEF(유), reprName: 김사장, corpRegYn: "true", stampId: "<2>", useYn: "true" }]
    expect: { table: apr15_repr_corp, delta: +1, lookup: "GET /api/v1/apr/repr-corps/lookup 2행(회사 자신 + 추가)" }
  - no: 5
    api: DELETE /api/v1/apr/repr-corps   # 법인서류 신청이 붙은 뒤
    expect: { status: 400, message: "…는 사용이력이 존재하는 대표명의입니다. 삭제할 수 없습니다." }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr10_Tab_Stamp`(#1026) — [조회]·[등록]·[저장]·[삭제], 그리드 17열(부서·(정)(부)책임자·인감이름·시작/종료날짜·사용용도·인감·법인인감·결재선필수추가·전체사용·사용가능 부서·미사용 문서분류·비고), 서버 `apr.Apr10_Stamp`(`selectByCodeName` L79, `update` L142, `delete` L148, `selectCorpStampYn` L137). `Apr15_Tab_ReprCorp`(#1506) — [조회]·[등록]·[저장]·[삭제], 그리드 7열, 서버 `apr.Apr15_ReprCorp`(`selectByCompanyId` L23, `selectCorpRegYn` L28, `update` L33, `delete` L38, 삭제 전 `apr16_stamp_doc.selectByReprCorpId`).
- TOBE: `AprStampController` `/api/v1/apr/stamps`(`GET /manage`·`PUT /manage`·`DELETE /manage`·`GET /corp-stamp`·`/doc`·`/by-org`), `AprStampService.saveManage` L55-76(필수 검사 4가지, 회사 ID는 로그인에서, 부서·사원 소속은 안 봄), `AprReprCorpController` `/api/v1/apr/repr-corps`(`GET`·`PUT`·`DELETE`·`/lookup`·`/corp-reg-exists`).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
