# APR-BZ-0008 법인서류·인감날인을 신청하고 관리한다

> **한 줄 요약** — 직원이 #1330(또는 결재문서의 날인신청 영역)에서 **법인인감증명서·법인등기부등본·인감날인**을 신청하면, 경영관리팀이 #1328에서 "신청내역 가져오기"로 등록일을 찍어 **서류 매수(발급·사용·잔여)**를 관리하고, #1329·#1484에서 날인일자를 적고, #1350에서 **날인본 업로드를 확인**한다. 대외문서번호(발급번호)는 결재문서가 완료되면 붙는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(`kalpa/401/Kalpa1234!`) → 결재자(부장 `201`) → 경영관리팀(과장 `301`) |
| 언제 | 수시(서류 필요할 때), 매수는 서류를 받을 때 |
| 먼저 있어야 하는 것 | [APR-BZ-0007](APR-BZ-0007-사용인감대표명의.md)(인감·추가 대표명의), 결재 흐름(APR-BZ-0001·0002 — 날인신청을 결재문서에 붙일 때) |
| 다음 이벤트 | 날인본 업로드 확인 뒤 끝. 구)화면은 APR-BZ-0010 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 직원이 신청 3건(인감날인·등기부등본·인감증명서) 저장, 결재문서에 날인신청 2줄 붙여 상신·승인, 과장이 신청내역 가져오기·발급매수 등록·사용매수·날인일자·확인·확인취소, 직원이 같은 API 호출 |
| 메뉴 | #1330 신청 > 90. 기타신청 > 법인서류 및 날인 신청 → #1328 경영관리 > 91. 법인서류 > 법인서류 매수관리 → #1329 인감날인대장(부서용 #1484) → #1350 인감날인본 업로드확인. **kalpa에는 메뉴가 없다** — API로만 실행, 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1330** | 신청일자(올해 1/1~오늘)·검색어(제공처/목적)·`미처리만 조회` → [조회] | 내 신청 목록(신청일자·구분·인감 및 대표명의·제공처·목적·비고·요청자·신청/날인 부수·인감반출·날인일자·문서명·상태) |
| 2 | 〃 | 〃 | [등록] → 신청 창: 구분 `인감날인`, 인감 `업무분석법인인감`, 부수 `3`, 인감반출 ✗, 제출처 `한국거래소`, 목적 `계약서 날인`, 요청자, 비고 → [저장] | 목록에 줄이 생김. 구분 `등기부등본`이면 인감 대신 **대표명의**를 고른다. 빈 값이면 "인감을 선택하세요"·"신청/날인 부수를 입력하세요"·"제출처를 입력하세요"·"목적을 입력하세요" |
| 3 | 〃 | 신청 창 | [문서연결] → 결재문서 고르기 / [문서보기] / [연결제거] | 연관상신문서가 문서명·상태 칸에 나옴 |
| 4 | 〃 | 결재문서 창(날인신청 영역) | 새 결재문서에서 날인신청 [+] → 구분·인감(또는 대표명의)·부수 → 결재 상신 | 문서 안에 "인감날인 2부 · 업무분석법인인감" 같은 줄. 결재한 사람이 생기면 [+]·[-]가 꺼짐 |
| 5 | 부장 | 결재할 문서함 | [승인] | 결재 `완료`. #1330 목록의 상태·문서명에 반영 |
| 6 | 과장 | **#1328** | 신청이 있으면 상단 "※ 법인서류 신청내역이 존재합니다. **신청내역 가져오기**" → 고르기 | 선택한 신청에 등록일(오늘)이 찍혀 매수관리 목록에 들어옴 |
| 7 | 〃 | 〃 | [등록] → 구분·인감(대표명의)·등록일·발급매수·목적 → [저장], 그리드에서 발급·사용매수 고치고 [저장] | 하단 요약: 구분·인감/대표명의별 **발급·사용·잔여매수**(`발급 5 / 사용 2 / 잔여 3`) |
| 8 | 〃 | 〃 | [삭제] | 신청에서 온 행은 등록일만 비워 신청내역으로 되돌리고, 직접 등록한 행은 지운다 |
| 9 | 〃 | **#1329 / #1484** | 조회기간·인감·`반출만` → [조회], 행 [수정]으로 **날인일자** 적기 → [출력/다운로드] | 인감날인 신청 줄이 대외문서번호·날인일자와 함께 나옴(#1484는 내 부서만) |
| 10 | 〃 | **#1350** | 신청일자·인감·`날인본 미첨부 내역만 조회` → [조회] → 행 선택 → [확인]/[확인취소] | 확인일자·확인자(김과장). "이미 확인 완료된 건이 포함되어 있습니다" 등 |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr16_stamp_doc` | 신청(구분 `1` 법인인감증명서 / `2` 법인등기부등본 / `3` 인감날인, 인감·대표명의, 신청/날인 부수, 인감반출, 제공처·목적, 연관상신 `apr16_appr_id`, 등록일·날인일자·확인자·확인일) | 2 +1(`3`은 `stamp_qty`, `1`·`2`는 `doc_appl_qty`), 4 +줄 수, 6 `reg_date`, 7 +발급매수 행, 9 `stamp_date`, 10 `confirmer_id`·`confirm_date` |
| `apr01_appr`·`apr04_appr_step` | 날인신청이 붙은 결재문서(상신→완료) | 4~5 +1 |
| `sys99_print` | 출력(#1328·#1329 [출력/다운로드]) | 이번에 안 함 |

## 결과를 볼 수 있는 화면

- #1330(내 신청·상태), #1328(요약: `GET /api/v1/apr/stamp-docs/sum`), #1329·#1484(`GET /api/v1/apr/stamp-docs/stamp-list`, 부서용 `org=true`), #1350(`stamp-check`), 결재 문서함. 신청·승인·날인이 끝나면 직원의 문서에 날인일자와 확인 정보가 이어진다.

## 업무 규칙 · 주의

- **실행 결과(2026-11-12)**: 직원 401이 신청 3건 저장 → 서버가 구분 `3`이면 `stampQty`, 그 밖이면 `docApplQty`에 부수를 넣는다. 결재문서에 날인신청 2줄(`인감날인 2부`·`법인등기부등본 1부`)을 붙여 상신하고 부장이 승인하면 `#1330` 목록 상태가 `완료`가 된다. 과장이 신청내역 가져오기를 하면 신청 3건에 등록일이 찍히고, 발급 5매·인감증명서 10매를 등록, 사용 2매를 적으면 요약이 `5/2/3`. 날인일자를 `2026-11-13`으로 정하고 [확인]하면 확인자 `김과장`·확인일자 오늘.
- **필수 검사는 화면에만 있다**(`preUpdate` L331-383, 원본·TOBE 같음). 서버 `PUT /stamp-docs/mine`은 부수 0·제출처 빈 값·목적 빈 값도 저장한다(신청 `인감증명`처럼 정상 값 대신 빈 값이 들어간 행이 생겼다).
- **결재문서에서 붙이는 날인신청**(`POST /apprs/{id}/stamp-docs`)은 서버가 막는 게 많다: 인감·대표명의 필수("인감을 선택해주세요"), 부수 필수, 구분 1·2·3만, **내 문서가 아니면 `ACCESS_DENIED`**, 결재한 사람이 있거나 상신 이후 상태면 "날인신청을 바꿀 수 없는 문서입니다".
- **아래는 서버가 막지 않아서, 메뉴 권한이 없는 직원 `401`이 모두 200으로 성공했다**(보안·버그 의심 후보):
  - 매수관리·대장의 읽기·쓰기 API 전부: `GET /stamp-docs`, `PUT /stamp-docs`(발급매수), `DELETE /stamp-docs`(401이 과장이 등록한 인감증명서 10매 행을 지움), `PUT /reg-date`, `PUT /stamp-date`, `PUT /confirm`.
  - **`PUT /confirm` check=false**: 확인자가 본인이어야 취소할 수 있다는 규칙은 화면에만 있다. 직원 401이 과장 301의 확인을 취소했다. 이미 확인된 건을 다시 [확인]해도 서버는 200을 준다("이미 확인 완료된 건" 검사도 화면뿐).
  - **남의 신청 수정**: 과장 301이 직원 401의 신청 행(`stampDocId` 지정)을 부수 3→9·목적 `301이 수정`으로 고쳤다(`updateAppl`이 신청자를 안 봄). 삭제(`DELETE /stamp-docs/mine`)도 신청자를 안 본다.
- 인감을 지우면 신청·대표명의가 없는 인감을 가리킨다([APR-BZ-0007](APR-BZ-0007-사용인감대표명의.md)). 결재 진행 중인 날인신청이 있어도 마찬가지.
- #1329 `stampSeq`(대외문서번호)는 **대외문서 + 인감 + 결재 완료**일 때만 붙는다. 이번 신청서는 내부문서라 빈칸이다. #1329 `apprStatusName`은 `30`처럼 코드가 그대로 나온다(`stamp-list` 응답 값, 원본 열 `apprStatusName`은 "문서보기" 버튼 칸이라 화면에서는 아이콘으로 보임 — 눈 확인 필요).
- `GET /stamp-docs`(매수관리 목록)는 `applType`을 안 주면 구분 1·2(서류)만 준다. 인감날인(3)은 #1329 대장이 다룬다.
- 안 한 것: 화면 눈 확인, [출력/다운로드](RD), 날인본 첨부(`stampFileChk` — 결재문서 날인본 파일이 있어야 ✓), 이미 날인일자가 있는 신청 삭제 막기, 접수(등록일) 뒤 삭제 막기(`deleteChk`), 구분 `2`(등기부등본) 서류 매수 부족 경고, 신청창 [등록(복사)].

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0008
needs: [APR-BZ-0007, EMP-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: PUT /api/v1/apr/stamp-docs/mine
    body: { stampDocId: 0, applDate: "2026-11-12", applType: "3", stampId: <인감>, applQty: 3, stampOutYn: "false", provideCo: 한국거래소, purpose: 계약서 날인, requester: 김사원, note: 계약서 3부 }
    expect: { table: apr16_stamp_doc, delta: +1 }
  - no: 4~5
    api:
      - GET /api/v1/apr/apprs/new-id
      - POST /api/v1/apr/apprs/{apprId}/stamp-docs   # { applType: "3", stampReprCorpId: <인감>, qty: 2, outYn: false }, { applType: "2", stampReprCorpId: <대표명의>, qty: 1 }
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, classTreeId <휴가신청서>, regDate 필수("상신일은 필수입력 항목입니다"), steps 00/001 401 + 10/002 201
    actor2: { user: "201" }
    api2: POST /api/v1/apr/apprs/{apprId}/confirm   # { action: confirm, message }
  - no: 6~7
    actor: { user: "301" }
    api:
      - GET /api/v1/apr/stamp-docs/appl
      - PUT /api/v1/apr/stamp-docs/reg-date   # [stampDocId …]
      - PUT /api/v1/apr/stamp-docs   # [{ stampDocId: 0, regDate, applType: "2", reprCorpId, docIssueQty: 5 }, …]
    expect: { api: GET /api/v1/apr/stamp-docs/sum, fields: { docIssueQty: 5, docUseQty: 2, docRemainQty: 3 } }
  - no: 9
    api: PUT /api/v1/apr/stamp-docs/stamp-date   # { stampDocId, stampDate: "2026-11-13" }
  - no: 10
    api: PUT /api/v1/apr/stamp-docs/confirm   # { ids: [...], check: true }
    expect: { api: GET /api/v1/apr/stamp-docs/stamp-check, fields: { confirmerName: 김과장 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr16_Tab_StampDocAppl`(#1330, E0~E6, [조회]·[등록]·[등록(복사)]·[삭제]) + 조회창 `Apr16_Lookup_StampDocAppl`(신청 창, E1~E9, `preUpdate` L331-383, `setEnable` L529-563). `Apr16_Tab_StampDocManager`(#1328, `retrieve` L365·375, `update` L403-412, 신청내역 가져오기 `Apr16_Lookup_GetDocAppl`), `Apr16_Tab_StampList`(#1329)·`StampListOrg`(#1484), `Apr16_Lookup_UpdateStampDate`, `Apr16_Tab_StampFileCheck`(#1350, `confirmChk` L204-256). 결재문서 안 신청줄은 `Apr16_Lookup_StampApplQty.update` L146-181.
- AS-IS 서버: `apr.Apr16_StampDoc`(`selectByApplEmpId` L26, `selectByApplType` L31, `selectApplDocByRegDateIsNull` L36, `selectDocByRegDate` L41, `selectDocGroupSum` L46, `selectStampByCompanyId` L51, `selectStampCheck` L56, `updateRegDate` L71, `updateStampDate` L81, `updateConfirmDate` L92, `update` L120, `deleteReg` L125, `delete` L147).
- TOBE: `AprStampDocController` `/api/v1/apr/stamp-docs`(`GET`·`/sum`·`/lookup`·`/appl`·`/mine`·`PUT`·`DELETE`·`/reg-date`·`/stamp-list`·`/stamp-date`·`/stamp-check`·`/confirm`·`/rd-print`), `AprStampDocService`(`saveAppl` L83-97, `deleteAppl` L101-108, `deleteReg` L112-125, `registerRegDate` L129-137, `updateStampDate` L186-188, `confirm` L197-204 — 모두 신청자·메뉴 권한을 안 봄), `AprStampApplController` `/api/v1/apr/apprs/{apprId}/stamp-docs`(`AprStampApplService.add` L43-61, `requireOpen` L79-87), `AprRelateStampController`(구) `/api/v1/apr/relate-stamps`.
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
