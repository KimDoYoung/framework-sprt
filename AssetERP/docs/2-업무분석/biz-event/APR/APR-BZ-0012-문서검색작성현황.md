# APR-BZ-0012 문서를 펀드별로 검색하고, 문서 작성현황(운영현황표·건별명세)을 본다

> **한 줄 요약** — 결재가 쌓인 뒤 **찾아보는 쪽** 이벤트다(쓰기 없음). #1005는 펀드를 고르면 그 펀드에 연결된 **완료(30) 문서 중 내가 볼 수 있는 것**을 보여 주고, #1010 운영현황표는 담당부서·담당자별로 문서 건수(일반·내부통제, 완료·미완료)를 세고, #1011 건별명세는 그 문서 목록이다. 앞의 둘(#1005)은 문서마다 열람 권한을 따지는데, 뒤의 둘(#1010·#1011)은 **회사 전체 문서를 그대로** 보여 준다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(#1005 — 펀드를 연결한 문서의 결재자·열람권한자), 경영관리·감사(#1010·#1011 — 메뉴 권한이 있는 사람) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | 완료된 결재문서(APR-BZ-0001·0002), #1005는 문서에 연결된 펀드(`apr03_relate_fund`)와 펀드 권한(`fnd08_org_auth`) |
| 다음 이벤트 | — (읽기 전용) |
| 실제 실행 | kalpa, 2026-11-12, API: 401·301로 #1010·#1011. #1005는 **kalpa에 펀드가 없어서**(`fnd01_fund_code` 0행) 화면 API는 빈 목록까지만, 문서 목록 쿼리는 다른 회사 자료(회사 28000)로 `mapper-run` 시험 |
| 메뉴 | #1005 문서작성 > 02. 문서검색 > 펀드별 문서검색, #1010 문서작성 > 06. 문서작성현황 > 운영현황표, #1011 같은 곳 > 건별명세. **kalpa 회사 메뉴에는 셋 다 없다**(S1 상품). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1005 | 펀드유형·클래스구분(전체)·펀드명·"해지펀드포함"·"클래스펀드&차등분배형 제외"(기본 켬) → [조회](펀드명·수신자 칸에서 Enter도 같음) | 내 조직이 권한을 가진 펀드 목록(코드·펀드명·유형·설정일·해지일·상태·신탁구분·운용본부·운용역·**생성문서** 건수) |
| 2 | 〃 | 〃 | 펀드 한 줄 선택 | 아래 문서 목록: 그 펀드(와 그 실제펀드)에 연결된 **완료** 문서(등록일·시행일·문서분류·문서명·수신자·첨부·[메일]) |
| 3 | 경영관리 | #1010 | 조회기간(기본)·담당부서·담당자 → [조회] | 담당부서·담당자별 `일반문서·내부통제문서·계` 세 묶음(전체 · 완료 · 미완료) |
| 4 | 〃 | 〃 | 한 줄의 [건별명세] 셀 | #1011이 그 담당자·기간으로 열린다 |
| 5 | 〃 | #1011 | 조회기간·담당부서·담당자·문서종류·상태 → [조회] | 문서 목록(시행일·문서종류·문서분류·문서명·담당부서·담당자·결재상태). 상태 `완료`/`미완료`/전체 |

## DB에 남는 것

없음(읽기만). 읽는 테이블: #1005 `apr01_appr`·`apr03_relate_fund`·`apr04_appr_step`·`apr13_person_auth`·`dcr03_org_auth`·`dcr04_emp_auth`·`fnd00_fund`·`fnd01_fund_code`·`fnd08_org_auth`, #1010·#1011 `apr01_appr`·`apr20_relate_ics`·`emp01_person`·`emp03_trans`.

## 결과를 볼 수 있는 화면

- 이 이벤트가 결과 화면이다. 문서 한 줄을 누르면 결재문서 창(상세보기)이 열린다.

## 업무 규칙 · 주의

- **#1005 열람 규칙**(원본·TOBE 같음): 문서가 `완료(30)`이고 문서분류가 쓰는 중이며, 다음 중 하나여야 한다 — ① 내 사원 권한(`dcr04_emp_auth`) 또는 내 조직 권한(`dcr03_org_auth`)에 그 문서분류의 [조회]가 있다(사원 권한이 조직 권한보다 우선), ② 내가 그 문서의 상신자·결재자·합의자·참조자이거나 공람(`apr13`)을 받았다. 임시저장·반려·진행 중 문서는 안 나온다.
- 실행(`mapper-run`, 회사 28000 자료, 펀드 82965 / 완료 문서 16건): 문서 6건이 연결된 결재자(사원 29035)는 **6건**, 아무 권한·참여 없는 사원(조직 0·사원 -1, 조직 1·사원 1, 권한 조직 10917)은 **0건**. AS-IS 쿼리와 **6건 = 6건 ✅**(열 포함).
- **펀드 목록**(`GET /api/v1/fnd/fund-codes/org-auth`)은 서버가 로그인 사원의 조직과 관리자 여부(`isManager`)를 직접 정한다(클라이언트가 보내는 값이 아니다). kalpa 401: 0행(펀드 없음).
- 문서 목록(`GET /api/v1/apr/apprs/fund-doc-list?fundCodeId=`)은 **회사 조건이 없다**(원본도 쿼리에서 `companyId`를 안 쓴다). 위 열람 규칙이 문서마다 막으므로 같은 회사 안에서는 문제가 없지만, 다른 회사의 펀드 ID를 주고 그 회사 문서에 내가 결재자·공람자로 들어 있지 않으면 0건이 되는 구조에만 기대고 있다 → [보안_및_버그_의심 의심 #49](다른 회사 값은 재현하지 않음, 코드·쿼리로만 확인).
- **#1010·#1011은 문서마다 권한을 따지지 않는다.** 상태가 `반려(40)`·`임시저장(99)`인 문서만 뺀 **회사 전체** 문서의 제목·분류·담당자·결재상태를 그대로 준다. 원본도 같다(쿼리가 `companyId`와 기간·이름만 본다). 그래서 이 두 화면은 메뉴 권한이 접근 제어의 전부인데, **TOBE 서버는 메뉴 권한을 보지 않아** 메뉴가 없는 직원도 호출하면 받는다(실행: 401·301이 `total-list` 같은 5줄, 401이 `sub-list` 38줄 응답. 완료 35·상신 2·결재중 1, 반려 2건은 빠짐) → [보안_및_버그_의심 의심 #50].
- 운영현황표 집계 규칙: 시행일(`apr01_effect_date`)이 기간 안이고 반려·임시저장이 아닌 문서를 **상신자의 그날 소속 부서**로 센다(`f_get_empTrans`). 내부통제 문서 = 연결된 내부통제(`apr20_relate_ics`)가 하나라도 있는 문서. 완료(30)면 처리, 아니면 미처리. kalpa 실행: 김과장 16건(일반 16·처리 14·미처리 2)이 첫 줄.
- 쿼리 대조: `mapper-run … --compare`로 운영현황표 5줄 = 5줄, 건별명세 38줄 = 38줄 ✅(회사 kalpa, 2026년 전체).
- 안 한 것: 화면 눈 확인, kalpa에서 펀드를 만들어 #1005 끝까지 따라가기(펀드 등록은 FND 이벤트), [메일]·[엑셀] 셀, 건별명세 한 줄에서 결재문서 창 열기, 운영현황표 [건별명세] 셀이 넘기는 값, 문서종류(`docType`) 필터 값 목록.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0012
needs: [APR-BZ-0001, APR-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: GET /api/v1/fnd/fund-codes/org-auth?closeYn=true&classFundExceptYn=false
    expect: { rows: 0 }          # kalpa에는 펀드가 없다
  - no: 2
    mapper: AprApprMapper.xml#selectByFundDocList   # 회사 28000 자료로
    params: { c.fundCodeId: 82965, c.orgId: 0, c.personId: 29035 }
    expect: { rows: 6, asIs: 6 }
    params2: { c.fundCodeId: 82965, c.orgId: 0, c.personId: -1 }
    expect2: { rows: 0 }
  - no: 3
    api: GET /api/v1/apr/apprs/total-list?startDate=2026-01-01&closeDate=2026-12-31&orgName=%&personName=%
    expect: { rows: 5, first: { aprOrgName: 경영지원본부, aprPersonName: 김과장, genCnt: 16, procGenCnt: 14, unProcGenCnt: 2 } }
  - no: 5
    api: GET /api/v1/apr/apprs/sub-list?startDate=2026-01-01&closeDate=2026-12-31&orgName=%&personName=%&docType=%&statusCode=%
    expect: { rows: 38, countBy: { 완료: 35, 상신: 2, 결재중: 1 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr01_Tab_FundDocument`(#1005, 이벤트 E0~E4: 조회·Enter·펀드 선택 → 문서 목록; `retrieveFundList` L172-198)·`Apr01_Grid_FundDocList`(문서 목록, `selectByFundDocList` L84), `Apr01_Tab_TotalList`(#1010, E0~E1, `retrieve` L144-174), `Apr01_Tab_SubList`(#1011).
- AS-IS 서버: `fnd.Fnd01_FundCode.selectByFundOrgAuth`(L56), `apr.Apr01_Appr.selectByFundDocList`(L982), `selectByTotalList`, `selectBySubList`.
- TOBE: 화면 `Apr01_Tab_FundDocument.tsx`·`Apr01_Grid_DocList.tsx`(문서 목록)·`Apr01_Tab_TotalList.tsx`·`Apr01_Tab_SubList.tsx`, API `GET /api/v1/fnd/fund-codes/org-auth`, `GET /api/v1/apr/apprs/fund-doc-list`·`/total-list`·`/sub-list`, 서비스 `AprApprService.searchFundDocList`(L138)·`searchTotalList`·`searchSubList`, 매퍼 `AprApprMapper.selectByFundDocList`(L965)·`selectByTotalList`·`selectBySubList`.
- TOBE 상태(2026-11-12): 실행(API, #1005는 쿼리·빈 목록까지). 화면 눈 확인 `대기`.
</details>
