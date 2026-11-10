# EMP-BZ-0013 증명서를 발급한다 (재직·경력·징계내역)

> **한 줄 요약** — 직원에게 재직증명서 같은 증명서가 필요하면 경영관리 담당이 #1115에서 **증명서를 만들고 전자결재로 상신**한다. 결재가 끝나면 문서번호(발급번호)가 붙은 증명서를 출력·메일로 보낸다. 직원이 #1331 기타신청서로 먼저 신청했다면 #1115의 [신청내역 가져오기]로 그 신청에서 시작한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 신청: 직원(#1331, BBS) · 발급: 경영관리 담당 — kalpa는 과장 `kalpa/301/Kalpa1234!`(`경영 관리자`) · 결재: 상신자가 고른 결재자, 이번엔 부장 `kalpa/201` |
| 언제 | 직원이 증명서를 요청할 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001·0002(사원·발령 — 증명서 내용), 문서분류 `인사 > 증명서 발급 > 재직증명서` 등. **발급번호를 받으려면** 회사 인감(`apr10_stamp`, #1026)과 결재문서의 인감 선택(또는 분류의 기본 인감), **본문 양식을 받으려면** 회사 증명서 양식(`com10_form_mapping` + `dcr30_link` B01~B04)이 있어야 한다(아래 "주의") |
| 다음 이벤트 | 메일보내기(DCR), 출력 |
| 실제 실행 | kalpa, 2026-11-10 — 과장이 김사원 재직증명서(금융기관 제출용) 저장 → 결재문서 상신(결재 박부장) → 연결 → 부장 승인 → **결재 완료**. 이 기록은 시나리오 데이터로 남겨 뒀다(발급번호는 없음). 같은 날 저녁(집 DB) 회사 인감을 #1026에 등록하고 대외문서 + 인감으로 다시 발급 → **발급번호 `1`**(아래 "주의") |

## 따라 하기

### 직접 발급

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 | **#1115** 경영관리 > 01. 조직 및 사원관리 > 증명서 발급 | 조회기간 → [조회] | 발급 목록(발급신청일·증명서종류·사원·용도·발급번호·결재상태). 처리할 신청이 있으면 "신청내역 가져오기" 안내가 보인다 |
| 2 | 〃 | 〃 | [생성] → "증명서 발급" 창: 증명서종류 `재직증명서`, 사원 `김사원`(돋보기), 용도 `금융기관 제출용`(`직접입력`이면 글칸이 열림), 문서분류(회사에 연결 분류가 있으면 자동, 없으면 돋보기로 `인사/증명서 발급/재직증명서`) → [상신] | 빠지면 "증명서종류를 지정해주세요"·"사원을 지정해주세요"·"용도를 지정해주세요"·"문서분류를 지정해주세요" |
| 3 | 〃 | 결재문서 창 | 제목 `재직증명서 발급_(2026-11-10)_김사원`(고정), 본문은 회사 양식에 사원정보가 채워져 나온다, 수신·참조 `-` → 결재선에 **결재: 박부장** → [결재요청] | 창이 닫히고 #1115 행의 결재상태 `상신` |
| 4 | 부장 | 결재할 문서함 → 그 문서 | [승인] → `승인합니다` | #1115 결재상태 `완료`, (인감이 있으면) 발급번호가 보인다 |
| 5 | 과장 | #1115 | 그 행의 [메일보내기] | 메일 보내기 창(실행 안 함) |
| — | 〃 | 〃 | 결재가 시작된 행 [삭제] | "해당 항목은 삭제불가능합니다" |
| — | 〃 | 〃 | [문서분류지정] | 증명서 종류별 연결 분류 지정 창(`Dcr30_Lookup_Link`) — 지정해 두면 2단계에서 분류를 자동으로 고른다 |

### 신청내역에서 발급 (분석만 — kalpa에 #1331·#1332 메뉴 없음)

1. 직원: **#1331** 신청 > 90. 기타신청 > 기타신청서 작성 — 신청구분(10 재직 · 11 경력 · 12 징계내역) → `bbs11_application`(상태 `10 신청`)
2. 과장: #1115 [신청내역 가져오기] → 신청 목록(`Emp15_Lookup_GetCert`, 상태 10만) → 고르면 "증명서 발급" 창이 신청 내용을 오른쪽에 보이며 열린다(증명서종류는 신청구분으로 자동: 10→B01, 11→B03, 12→B04)
3. [상신] → 결재문서 저장 → 증명서에 결재문서 연결 → **신청 상태를 `20 접수`로 바꾼다**(`bbs.Bbs11_Application.updateAppStatus`)
4. 신청 처리 현황은 #1332 경영관리 > 90. 신청서관리 > 기타신청서 확인

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp15_cert` | 증명서(발급일·종류 B01~B04·사원·용도·문서분류·결재문서 ID) | 2 저장 +1, 3 뒤 결재문서 ID 채움 |
| `apr01_appr` | 결재문서(연결코드 B01, 상태 10 상신 → 30 완료, 대외문서·인감이면 발급번호 `apr01_stamp_seq`) | 3 +1, 4 완료 |
| `apr04_appr_step` | 결재선 001 상신 · 002 결재 | 3 +2, 4 승인 |
| `bbs11_application` | 신청 상태 10 → 20 | 신청 경로 3 |

## 결과를 볼 수 있는 화면

- #1115 목록(결재상태·발급번호), 결재 문서함, #1332(신청 경로).

## 업무 규칙 · 주의

- 목록은 원본 SQL과 같다(`yunhee compare` `emp15_cert.selectByCompanyId` 1 = 1, 열 11개 포함). 결재상태·발급번호는 연결된 결재문서에서 읽는다.
- **발급번호는 대외문서 + 인감일 때만 붙는다.** asseterpdb의 완료된 증명서 결재문서 25건은 모두 대외(`apr01_inout_cd = 10`) + 인감이고 발급번호가 있다. 처음 실행 때는 **kalpa에 인감이 하나도 없어**(`apr10_stamp` 0건) 발급번호가 생기지 않았다.
- **회사 인감을 등록하면 발급번호가 붙는다(2026-11-10 저녁 확인, 집 DB).** 아래 순서로 했다:
  1. 인감 등록 — **#1026** 문서작성 > 04. 전자결재 > 사용인감등록 [등록]: 부서 `경영지원본부`, (정)책임자 김과장, (부)책임자 김사원, 인감이름 `법인인감`, 2026-01-01~9999-12-31, 법인인감 ✓, 전체사용 ✓, 결재선 필수추가 ✗ → [저장] → 그 줄의 올리기 아이콘으로 `data/samples/인감1.png` 복사본(`stamp-kalpa-company.png`). API `PUT /api/v1/apr/stamps/manage` → `apr10_stamp` +1, `POST /api/v1/sys/files?parentId={stampId}` → `sys10_file` +1, 그림은 `GET /api/v1/sys/files/image?parentId={stampId}`로 보임. 전체사용이라 다른 본부 직원(401)의 인감 찾기(`GET /api/v1/apr/stamps`)에도 나온다. (kalpa에 #1026 메뉴가 없어 과장 301로 API만 불렀다 — 메뉴를 열지는 [EMP 흐름도 메뉴 범위](EMP-업무흐름.md#가상-회사-kalpa의-메뉴-범위)에 맞춰 정할 것)
  2. 직접 발급 2~3단계를 다시 하되, 결재문서 창에서 **인감종류 돋보기 → `법인인감`**(E32 `findLookupStamp` → `GET /api/v1/apr/apprs/stamp-line`: `outType=true`라 대외문서로 바뀜, 결재선 필수추가가 아니라 인감 줄은 안 붙음), 대표회사 `(주)칼파테크`, 수신 `-` → [결재요청] (박부장 결재)
  3. 부장 [승인] → `apr01_status_cd 30`, **`apr01_stamp_seq = 1`**(그해 회사의 첫 번호. 회사 문서번호 방식 `sys01_dcr_numbering_cd`가 1이라 식별단어 없이 숫자만), 응답 `makePdf: true`(인감 날인본 PDF를 만들 차례 — RD/PDF는 확인 안 함). #1115 목록의 발급번호 칸에 `1`.
- 문서분류에 기본 인감을 지정(`dcr01_seal_cd`, kalpa 재직증명서는 비어 있음)하면 2단계에서 인감을 고르지 않아도 새 문서가 그 인감·대외로 열린다(TOBE `Apr01_Edit_ApprDoc.tsx` L180·L218). 이 길은 실행하지 않았다.
- **본문 양식도 회사마다 필요하다.** 본문은 `com10_form_mapping`(회사) + `dcr30_link`(B01~B04)에 등록된 양식에 `#{성명}`·`#{입사일}`·`#{근속년수}` 같은 값을 넣어 만든다. 양식은 회사 0(시스템)에만 있고 kalpa에는 없어서 **원본에서도 본문이 빈 채로 열린다**(TOBE `ComFormMappingMapper.selectByLinkCode`가 원본과 같다). → 양식 복사가 선행이다([SYS-BZ-0022](../SYS/SYS-BZ-0022-문서양식복사.md)). 2026-11-10 kalpa에 B01~B04를 복사했지만 **회사 0의 증명서 양식이 시험용 글**("복사 테스트!!!" 등)이라 본문이 그 글로 열린다 — 진짜 증명서 양식은 asseterpdb 어디에도 없다.
- ⚠ **TOBE 부족 — 신청내역으로 발급해도 신청 상태가 바뀌지 않는다.** 원본 `Emp15_Lookup_StampDocCert.updateApplication` L393-406은 상신 뒤 신청을 `20 접수`로 바꾼다. TOBE `Emp15_Lookup_StampDocCert.tsx` L6에 "다음 단계"로 미뤄 두었다. 그래서 발급한 신청이 계속 `10 신청`으로 남아 [신청내역 가져오기]에 다시 나오고, #1332에서도 처리되지 않은 것으로 보인다.
- 작은 차이 — 결재가 시작된 증명서의 삭제 막기는 화면에만 있다(원본·TOBE 같음). `DELETE /api/v1/emp/certs/{id}`를 직접 부르면 지워지고 결재문서만 남는다(시험은 안 함).
- 결재 저장 API는 실패도 HTTP 200에 `ok: false`와 문구로 돌려준다(예: "시행일은 필수입력 항목입니다"). 자동 시험은 응답의 `ok`를 봐야 한다.
- 클래스 대조: `Emp15_Tab_Cert`·`Emp15_Lookup_GetCert`는 수가 같다. `Emp15_Lookup_Cert`·`Emp15_Lookup_StampDocCert`는 TOBE에서 공통 폼 `Emp15_CertEdit.tsx`로 합쳐져 yunhee 대조에 0으로 나오지만, 원본 이벤트 E0~E8이 공통 폼에 모두 있다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0013
needs: [EMP-BZ-0001, EMP-BZ-0002]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: POST /api/v1/emp/certs
    body: { issueDate: "2026-11-10", linkCode: "B01", personId: "<401>", certUseCode: "1", certUse: "금융기관 제출용", dcrClassTreeId: "<인사/증명서 발급/재직증명서>" }
    expect: { table: emp15_cert, delta: +1 }
  - no: 3
    actor: { user: "301" }
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<재직증명서>                      # apprId, 001 상신 김과장
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=B01&refId=<certId>   # 제목 "재직증명서 발급_(2026-11-10)_김사원"
      - PUT /api/v1/apr/apprs/{apprId}   # mode=request, linkCode=B01, effectDate·regDate 필수, steps: 001 상신(00) 김과장 + 002 결재(10) 박부장
      - PUT /api/v1/emp/certs/{certId}/appr-id   # { apprId }
    expect: [{ table: apr01_appr, delta: +1 }, { table: apr04_appr_step, delta: +2 }, { field: "apprStatusName", value: "상신" }]
  - no: 4
    actor: { company: kalpa, user: "201", password: "Kalpa1234!" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: "승인합니다" }
    expect: { field: "apprStatusName", value: "완료" }
  # 인감 있는 발급 (2026-11-10 저녁)
  - no: 인감
    actor: { user: "301" }
    api:
      - PUT /api/v1/apr/stamps/manage   # [{ stampId: 0, orgId: <경영지원본부>, aprEmpId: <301>, secondEmpId: <401>, stampName: 법인인감, startDate: 2026-01-01, closeDate: 9999-12-31, corpStampYn: "true", allUseYn: "true", stepUseYn: "false" }]
      - POST /api/v1/sys/files?parentId=<stampId>   # file = data/samples/인감1.png 복사본
    expect: [{ table: apr10_stamp, delta: +1 }, { table: sys10_file, delta: +1 }]
  - no: 2~3 (인감)
    actor: { user: "301" }
    api:
      - GET /api/v1/apr/apprs/stamp-line?classTreeId=<재직증명서>&stampId=<stampId>&checkRole=false   # outType: true
      - PUT /api/v1/apr/apprs/{apprId}   # inOutTypeCode "10", stampId, signCompany "(주)칼파테크", receiveName "-", content 필수
  - no: 4 (인감)
    actor: { user: "201" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    expect: [{ field: makePdf, value: true }, { db: "apr01_stamp_seq", value: "1" }, { api: "GET /api/v1/emp/certs", field: stampSeqText, value: "1" }]
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp15_Tab_Cert`(#1115, E0~E7 — [생성] `insertCert` L255-263, [삭제] `deleteRow` L230-253, 결재요청 칸 `checkAppr` L275-305, `checkDcr` L329-357, `checkStampDoc` L392-416), `Emp15_Lookup_Cert`(직접 발급, `update` L204-248), `Emp15_Lookup_GetCert`(신청 목록), `Emp15_Lookup_StampDocCert`(신청으로 발급, `update` L284-328 → `updateApprId` L379-391 → `updateApplication` L393-406), 본문 `createMapping` L418-443
- AS-IS 서버: `emp.Emp15_Cert.selectByCompanyId`·`modelUpdate`·`updateApprId`·`delete`, `bbs.Bbs11_Application.selectByAppStatus`·`updateAppStatus`, `com.Com10_FormMapping.selectByLinkCode`
- TOBE: `/api/v1/emp/certs`(`GET`·`POST`·`PUT /{id}/appr-id`·`DELETE /{id}`), 결재 `/api/v1/apr/apprs`(`/new`·`/link-seed`(`CertLinkSeedProvider`)·`PUT /{id}`·`POST /{id}/confirm`), 신청 `GET /api/v1/bbs/applications?appStatus=10`
- TOBE 상태(2026-11-10): **실행(API, 과장 301 → 부장 201)** — 저장·상신·연결·승인·목록 비교, 회사 인감(#1026) 등록 뒤 대외+인감 문서의 발급번호(`1`). 신청 경로·메일·출력(날인본 PDF)·문서분류 기본 인감은 미확인. 화면 눈 확인은 `대기`.
- 발급번호 근거: TOBE `AprApprActionService.confirm` L132-137(완료 + 인감이면 `selectStampSeq`), `AprApprActionMapper.xml` L195-225(그해 회사 최대번호 + 1, `apr99_appr_del` 포함), 바로 완료 저장은 `AprApprWriteService` L96-99(대외 + 인감).
</details>
