# EMP-BZ-0006 직원의 인사기록을 채운다 (학력·가족·경력·자격·상벌·계좌 등)

> **한 줄 요약** — 입사 등록(EMP-BZ-0001)이 사람·발령·급여공제만 만들기 때문에, 학력·가족·경력·자격·계좌 같은 **인사기록은 비어 있다.** 고객사 관리자가 #1029에서 사원을 고르고 탭마다 한 줄씩 채운다. 모든 탭이 같은 틀(조회·등록·삭제·저장)이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 입사 뒤, 정보가 바뀔 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001 |
| 다음 이벤트 | 인사기록카드 출력(#1029 [인사기록카드], RD), 증명서(EMP-BZ-0013) |
| 실제 실행 | kalpa, 2026-11-10 — `401 김사원`에 탭별 시험 행을 넣었다가 모두 지움(행 수 처음과 같음). 저녁(집 DB)에 401 사진을 API로 올림(화면엔 올리기 없음 — 아래 "부족 6") |

## 따라 하기

사원 선택(왼쪽 목록) 뒤 오른쪽 탭에서 한다. 사원을 고르지 않고 [등록]을 누르면 "사원을 먼저 선택해주세요"(계좌 탭은 "은행을 먼저 선택해주세요").

| 단계 | 탭 | [등록] 뒤 입력 → [저장] | 쓰는 테이블 | 확인한 것 |
|:---:|:---|:---|:---|:---|
| 1 | 인적사항 | 한자명·영문명·**주민등록번호**·생일·성별·주소·전화 → [저장] (주민번호 칸은 `Emp02_Edit_CtzNo` 창에서 입력, 입력하면 생일·성별이 자동 채워짐) | `emp02_others` | 주민번호가 **암호화(32자)**로 저장되고 조회 때 풀려 나온다 |
| 1-1 | 〃 | [기타 입사일 정보] 창: 입사일(그룹사 기준)·입사일(연차계산용) | `emp02_others` | 저장 됨 |
| 2 | 학력 | 입학년월 `2010.03`, 졸업년월 `2014.02`, 학교 및 과정, 학력등급 | `emp05_academic` | +1 |
| 3 | 가족 | 성명·관계(콤보: 부·모·배우자·자녀…)·생년월일·직업·동거여부 | `emp06_family` | +1 (⚠ TOBE는 관계가 글자 입력 — 실행에서 넣은 `10`은 "부") |
| 4 | 경력 | 시작년월 `2015.03`, 종료년월 `현재`, 회사명, 금융관련·주요경력 | `emp07_career` | +1 |
| 5 | 자격 | 취득일·자격명·자격번호·발급기관·금융관련 | `emp08_license` | +1 |
| 5-1 | 자격 → 아래 하위 그리드 | 자격 행 누름 → 금융투자전문인력구분·대표여부 [등록]·[저장] | `emp32_relate_license` | **TOBE에 없음**(⚠ 3) |
| 6 | 인사평가 | 평가일자·평가부서·평가담당자·등급 | `emp09_evaluation` | +1 |
| 7 | 상벌 | 상벌구분·일자·내용 | `emp11_reward` | +1 |
| 8 | 경조사 | 일자·경조사명·구분 | `emp12_event` | +1 |
| 9 | 프로젝트 | 시작·종료년월·프로젝트명 | `emp13_project` | +1 |
| 10 | 계좌 | 시작일·은행·계좌번호 | `emp14_account` | +1(은행명 `국민은행` 풀이 됨) |
| 11 | 교육 | 이수일·교육내용·이수여부 | `emp19_education` | +1 (일괄등록 버튼은 따로) |
| 12 | 첨부 | 파일 올리기(`sys11_relate_file`·`emp18_relate_file`) | | **실행 안 함** — 파일 업로드 시험은 `data/samples`로 따로 |
| 13 | 탭마다 | 행 선택 → [삭제] → 확인 | 위 각 테이블 | -1씩, 모두 처음 행 수로 복귀 |

## DB에 남는 것

탭마다 **그 사원의 행이 한 줄씩** 는다(위 표). 사원 하나에 여러 줄을 넣는 탭이다(`emp02_others`만 사원당 한 줄 — 입사 때 비어 있는 행이 이미 만들어져 있고 [저장]은 그 행을 채운다).

## 결과를 볼 수 있는 화면

- #1029 각 탭, 인사기록카드(RD), #1474 사원정보 변경조회(바뀐 값 이력).

## 업무 규칙 · 주의

- 년월 칸(학력·경력·프로젝트)은 `YYYY.MM` 문자 7칸이다(DB `varchar(7)`).
- ⚠ **TOBE 부족 1 — 경력 탭 년월 검사가 없다.** 원본(2026-05-11 추가, `Emp07_TabPage_Career.update` L122-197)은 저장 전에 검사한다: 시작·종료년월 필수, 7자리 이하, `2026-05`는 `2026.05`로 바꿔 주고 `YYYY.MM` 형식이 아니면 "…날짜 형식이 잘못되었습니다. "YYYY.MM" 형식으로 입력하세요 (예: 2026.05)", `현제`는 `현재`로 고쳐 주고 "현재"는 단독만 허용. TOBE는 화면·서버 모두 검사가 없어서 **`15년3월`·`현재 근무` 같은 값이 그대로 저장된다**(실행: 두 값 모두 200 저장).
- ⚠ **TOBE 부족 2 — 학력 탭 7자리 검사가 없다.** 원본(2024-07-10, `Emp05_TabPage_Academic.update` L128-159)은 입학·졸업년월이 7자리를 넘으면 "입학년월은 7자리 이하로 입력해주세요. ex)2001.01"이라고 알려 준다. TOBE는 검사 없이 DB까지 가서 **500 "서버 내부 오류"**가 난다(실행: `2010.03.01` 입력 → `value too long for type character varying(7)`). 사용자는 원인을 모른다.
- ⚠ **TOBE 차이 — 인사평가 탭의 평가부서·담당자 입력.** 원본은 평가부서 칸을 누르면 사원 선택 창(`Emp00_Lookup_SelectSingle`, 평가일자를 먼저 넣어야 열림 — "평가일자를 등록해주세요")이 떠서 부서명·사원명을 채운다. TOBE는 이를 "직접 텍스트 입력으로 단순화"했다(`Emp09_TabPage_Evaluation.tsx` L5). 원본이 정답이라는 변환 원칙과 다르므로 사용자 확인이 필요하다(UX보강 등록표에는 없음).
- ⚠ **TOBE 부족 3 — 자격 탭의 "금융투자전문인력구분" 하위 그리드가 통째로 없다.** 원본은 자격 행을 누르면(E5 `retrievePage`) 아래에 `Emp32_TabPage_RelateLicense`가 열려 그 자격의 금융투자전문인력 구분(`FinanceProType` 콤보)·대표여부를 등록·저장·삭제한다(대표여부는 하나만 — "대표여부는 하나만 지정 가능합니다."). 테이블 `emp32_relate_license`(asseterpdb 15행). TOBE `Emp08_TabPage_License.tsx` L5에 "Emp32_TabPage_RelateLicense는 C01-5에서 구현"이라고 미뤄 둔 채 남아 있고 API도 없다(TOBE에서는 #1474 사원정보 변경조회가 읽기만 한다). 원본 2023-08·2024-01.
- ⚠ **TOBE 부족 4 — 가족 탭의 가족관계가 콤보가 아니라 글자 입력이다.** 원본은 `FamilyRelateCode2` 콤보(10 부 · 11 모 · 20 배우자 · 30 자녀 · 40 형제자매 …, 2026-03-18 변경)로 코드를 넣고 이름을 보여 준다. TOBE `Emp06_TabPage_Family.tsx` L22는 `relationCd`를 텍스트로 보여 주고 고친다 — 화면에 `10`이 그대로 보이고 아무 글자나 저장된다.
- ⚠ **TOBE 부족 5 — 교육 탭에 [교육기관] 열이 없다.** 원본 4열(교육일자·교육기관·교육내용·수료여부, 교육기관은 2026-08-20 추가), TOBE 3열. 저장 요청(`EducationSaveReq`)에도 없다. 그런데 [일괄등록] 요청(`EducationCopyReq`)에는 `educationCorpNm`이 있어 두 경로가 서로 다르다.
- ⚠ **TOBE 부족 6 — 인적사항(기타정보) 사진 올리기가 없다.** 원본 E1~E3(사진 누름 → 파일 선택 → 올리고 다시 그림). TOBE `Emp02_TabPage_Others.tsx` L116은 "파일 공통(B10) 뒤"로 자리만 두었다. B10 파일 공통(`fileApi`·`FileUpdownForm`)은 첨부 탭에서 이미 쓰고 있으므로 이제 옮길 수 있다.
  - **서버 쪽은 된다(2026-11-10 저녁 확인, 집 DB)**: `data/samples/얼굴1.png` 복사본(`photo-401.png`)을 `POST /api/v1/sys/files?parentId={401 personId}&mode=emp01`로 올리면 `sys10_file` +1, 그 뒤 `GET /api/v1/sys/files/monitoring?parentId=…`(상단 프로필 사진)·`/image?parentId=…`(#1030 조직별 사원조회 등 사진 칸)가 그 PNG를 돌려준다. 즉 **화면에 올리는 길만 없다** — 다른 화면에서 올린 사진은 TOBE에서도 보인다.
  - 원본과 다른 점: 원본은 `mode=emp01`이면 사진을 줄여 저장한다. TOBE는 `mode`를 무시하고 원본 크기로 저장한다(`frontend/src/api/file.ts` L75 "사진 축소는 2026-11-04 뺌").
  - 환경 메모: 사진이 없을 때 원본은 업로드 폴더의 `noimage.jpg`(`/image`는 `nonamed.jpg`)를 보여 주는데, 집 서버 업로드 폴더(`~/tmp/asseterp-data/uploads/`)에 이 파일이 없어 `404 FILE_NOT_FOUND`가 난다(코드 문제 아님, 기본 그림 파일을 놓으면 된다).
- 작은 차이 — 열 제목: 경력 "업무(역활,권한)" → TOBE "역활(권한)", 자격 "자격증번호(협회등록번호)" → TOBE "자격증번호".
- 교육 [일괄등록](원본 `multiInsert` L205-243): 고른 교육 한 줄을 사원 선택 창에서 고른 여러 사원에게 복사한다. 교육을 고르지 않으면 "공유할 교육사항을 선택해주세요", 저장 안 한 행이 있으면 "일괄등록은 저장 후 가능합니다", 끝나면 "등록완료되었습니다.". 실행은 안 했다.
- 위 ⚠는 원본 변경일이 `yunhee drift` 기준보다 앞이라 drift에 걸리지 않는다(변환 때 빠짐).
- 검증 메모(2026-11-10, Opus 재검토): 탭별 원본 그리드 열과 TOBE 열을 하나씩 맞대 봤다. 학력·가족·경력·자격·평가·상벌·경조사·프로젝트·계좌·첨부·인적사항 폼은 열·칸 구성이 같다(위 차이 빼고).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0006
needs: [EMP-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - { api: PUT /api/v1/emp/academics,  body: [{ personId: "<401>", frYm: "2010.03", toYm: "2014.02", schoolName: "칼파대학교 경영학과", bachelorDegree: "20" }], expect: { table: emp05_academic, delta: +1 } }
  - { api: PUT /api/v1/emp/families,   body: [{ personId: "<401>", familyNm: "김배우자", relationCd: "20", birthday: "1990-05-01" }], expect: { table: emp06_family, delta: +1 } }   # FamilyRelateCode2: 20 배우자
  - { api: PUT /api/v1/emp/careers,    body: [{ personId: "<401>", frYm: "2015.03", toYm: "현재", companyNm: "(주)시험금융", extrAddTitleYn: "false" }], expect: { table: emp07_career, delta: +1 } }
  - { api: PUT /api/v1/emp/licenses,   body: [{ personId: "<401>", certifiedDt: "2024-06-01", certifiedNm: "펀드투자권유자문인력" }], expect: { table: emp08_license, delta: +1 } }
  - { api: PUT /api/v1/emp/accounts,   body: [{ personId: "<401>", startDate: "2026-11-01", bankCd: "004", accountNoDec: "123-45-67890" }], expect: { table: emp14_account, delta: +1 } }
  - { api: PUT /api/v1/emp/others,     body: { othersId: "<401>", personId: "<401>", decCtzNo: "950101-1234567", birthday: "1995-01-01", genderCode: "M" }, expect: { table: emp02_others, delta: 0 } }
  - { api: PUT /api/v1/emp/academics,  body: [{ personId: "<401>", frYm: "2010.03.01" }], expect: { http: 500 } }   # 원본은 화면 검사 — TOBE 부족
cleanup: 각 탭 DELETE /api/v1/emp/{academics|families|careers|licenses|…} (id 배열)
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp00_Tab_TransInfo`(#1029) 하위 탭 `Emp02_TabPage_Others`(`update` L168-194, `autodecCtzNo` L352-396), `Emp05_…Academic`(L128-159), `Emp06_…Family`, `Emp07_…Career`(L122-197), `Emp08_…License`, `Emp09_…Evaluation`(`lookupOrg` L106-124), `Emp11_…Reward`, `Emp12_…Event`, `Emp13_…Project`, `Emp14_…Account`, `Emp19_…education`, `Emp02_Lookup_HireDate`
- AS-IS 서버: `emp.Emp0x_*.update`(UpdateDataModel, 탭마다), `emp.Emp02_Others.updateOne`(`emp02_others.upsert`), `updateHireDate`
- TOBE: `PUT·DELETE /api/v1/emp/{academics|families|careers|licenses|evaluations|rewards|events|projects|accounts|educations}`, `PUT /api/v1/emp/others`, `PUT /api/v1/emp/persons/{id}/hire-dates`
- TOBE 상태(2026-11-10): **실행** — 탭 10개 +1/-1, 기타정보·입사일 저장 후 되돌림, 주민번호 암호화 확인. 첨부 탭·인사기록카드(RD)·일괄등록은 안 함. 화면 눈 확인은 `대기`.
- 확인하지 않은 탭: 첨부(`Emp18`), 교육 일괄등록, 급여공제 탭(EMP-BZ-0009).
</details>
