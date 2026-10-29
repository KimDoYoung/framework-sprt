# yunhee page-style 판별 수정 요청

작성 2026-10-29. 대상: `yunhee page-style`(`--all`·`--json`·`--compare`)의 SID 판별기. 이 문서는 yunhee 쪽에 전달할 내용을 모은 것이다(yunhee 코드는 이 저장소에 없다 — 05 §7 "yunhee 수정사항 제안").
SID 정의는 `docs/page-style.md`, 견본은 `docs/page-style/{SID}/`.

## 1. 지금 문제 (2026-10-29, TOBE `*_Tab_*.tsx` 311개)

분포(견본 정립 전): SG 83 · CG 73 · GG 46 · **미분류 40** · SGP 31 · SGTP 15 · SGEF 9 · TG 8 · SGT 4 · SGVF 2.
미분류 40개 중 이미 SID가 정해진 화면(아래 §2)도 판별기에 규칙이 없어 미분류로 나온다. 판별 오류(선언과 다름)도 있다.

| 증상 | 화면 | 선언 → 판별 |
|:---|:---|:---|
| 선언과 판별이 다름 | `Est02_Tab_PfResultReport` | GG → SGTP |
| | `Apr16_Tab_StampFileCheck` | SG → CG |
| | `Apr16_Tab_StampList` / `StampListOrg`, `Car04_Tab_*`(T11·T14), `Bbs20_Tab_FloralRequestMng` | 판별기 GG≠SG, SG≠CG 등 (작업기록 "결과확인 13") |
| 탭이 <Tabs>/<PageTabs>로 인라인이라 `tabpage` 아님 | `Rpt10_Tab_FssOrg`, `Pay20_Tab_Deduct` | → 미분류(그리드 없음) |
| 구조를 자식 컴포넌트에 맡김 | `Dcr01_Tab_DcrUser`, `Flt00_Tab_Info`, `Tdm35_Tab_TaskList` 등 | 특징이 전부 0 |

## 2. SID별 판별 규칙 (19개, 견본은 모두 확정 — 2026-10-29)

SID 정의는 `docs/page-style.md` "스타일 목록", 견본은 `docs/page-style/{SID}/`. 판별 특징 이름은 §4의 열 설명을 따른다. ★ = 이번에 새로 만든 SID(지금 판별기에 규칙이 없다).

| SID | 판별 규칙(제안) | 견본 | 같은 SID로 정한 다른 화면(검증용) |
|:---|:---|:---|:---|
| SG | 조회 툴바 + 그리드 하나 | `Tdm01_Tab_Hr` | — 지금도 판별됨 |
| SGP | SG + 편집 팝업(`*_Edit_*`) | `Chk02_Tab_DailyList` | — 지금도 판별됨 |
| SGVF | 위아래 분할 + 그리드 + 읽기 전용 폼 | `Fnd01_Tab_FundSearch` | — 지금도 판별됨 |
| SGEF | 위아래 분할 + 그리드 + 편집 폼 | `Fnd01_Tab_FundCode` | — 지금도 판별됨 |
| SGTP | 위아래 분할 + 그리드 + 아래 탭 영역 | `Fnd20_Tab_Plan` | — 지금도 판별됨 |
| GG | 그리드 2개(마스터·상세) | `Est02_Tab_PfResultReport` | `Est02`는 SGTP로 잘못 나온다(§1) |
| CG | 편집 가능한 그리드 하나 | `Apr10_Tab_Stamp` | — 지금도 판별됨 |
| SGT | 툴바 전체 폭 + 좌(그리드)·우(트리) 분할 | `Fnd08_Tab_OrgAuth` | — 지금도 판별됨 |
| TG | 트리 + 오른쪽 내용이 좌우 분할(오른쪽이 `SingleGrid`가 아니어도) | `Sys06_Tab_Menu` | `Dcr01_Tab_DcrManager`, `Dcr01_Tab_DcrUser`(껍데기), `Emp00_Tab_OrgPerson` |
| STP | 툴바(`SearchBar`) 있음 + 탭 컨테이너(`<Tabs>`·`<PageTabs>`·`*_TabPage_*`) 있음 + 그리드·트리 없음 | `Pay10_Tab_Retire` | `Biz01_Tab_LimitCheckList`, `Flt10_Tab_CeoReport`, `Pay10_Tab_List`, `Tdm50_Tab_CheckJob` |
| TP | 탭 컨테이너만 있고 툴바·그리드·트리 없음 | `Rpt10_Tab_FssOrg` | `Emp21_Tab_UnLeaveList`, `Pay20_Tab_DeductAdmin`, `Pay31_Tab_InsureApply`, `Pay20_Tab_Deduct` |
| SR | 툴바 있음 + RD 영역(`*_Rd_*` import·`iframe`) + 탭·그리드·트리 없음 | `Emp01_Tab_InoutState` | `Emp01_Tab_DueDiligence` |
| GCG | 위아래 분할 + 그리드 둘 + 달력(`Calendar`) | `Car03_Tab_List` | — |
| ★SGHF | 조회 줄 + 그리드 + 편집 폼을 **좌우**로 배치(`layout=horizontal`, edit 폼 있음) | `Biz01_Tab_Card` | `Biz01_Tab_Other`·`CardContents`·`CardSimple`·`OtherSimple`·`CardContentsSimple` |
| ★MG | 조회 줄 + 그리드 2개 이상 + 편집/보기 폼, 위아래 분할 아님(`layout=none`) | `Sys90_Tab_AfterService` | `Sys90_Tab_AfterServiceAdmin`, `Ics20_Tab_RevisionHistory`·`Admin`, `Sms03_Tab_SendAdmin` |
| ★TO | 트리 중심, 오른쪽이 일반 그리드가 아님/없음, 편집은 팝업 | `Org01_Tab_OrgCode` | `Chk01_Tab_ClassTree`, `Fbx01_Tab_Document`(탭 페이지·편집 그리드가 함께 있어 TO가 아닐 수 있다) |
| ★GO | 그리드 하나 + **직접 만든 조건 줄**(`SearchBar` 아님) 또는 조건 줄 없음 | `Tdm54_Tab_CheckInsuff` | `Sms02_Tab_TotalCount`, `Sys10_Tab_TotalSize`(조건 줄이 없는 화면일 수 있다) |
| ★DB | 그리드·트리·툴바 없이 탭 + 카드/요약 영역(조회 API 호출, 값을 보여 준다) | `Tdm50_Tab_TotalDashboard` | `Tdm35_Tab_TaskList` |
| ★IN | 그리드·트리·폼·툴바·탭이 없고 안내 문구/링크(HTML)만 있는 문서 화면. **조회·저장 API 호출이 없고 `openMenuByNo` 같은 메뉴 열기 링크가 있다** | `Flt00_Tab_Info` | — |

SGP/SG, TP/TG 등 이미 판별되는 SID는 규칙을 바꾸지 말고 그대로 두고, 위 표의 ★와 STP·TP·SR·GCG·TG 규칙만 보강한다.

### 2-1. 특징값으로 구분이 안 되는 쌍

다음 SID는 `--json` 특징값(§4)이 전부 0이거나 비슷해서 **구조만으로는 갈리지 않는다**. 선언(`스타일: XXX`, §3-8)을 우선 읽고, 선언이 없을 때만 아래 보조 신호로 추정한다.

| 쌍 | 구분 신호 |
|:---|:---|
| IN ↔ DB | 화면이 `*Api`(조회 API)를 import해 호출하는가. IN은 호출이 없고 DB는 있다. DB는 탭(`<PageTabs>`)이 있다 |
| IN ↔ TP | TP는 탭 컨테이너가 있다. IN은 탭이 없다 |
| GO ↔ SG | GO는 조건 줄이 `SearchBar`가 아니라 직접 만든 `div`(`Typography.Text`·`DatePicker` 직접 배치) |
| STP ↔ TP | `SearchBar` 또는 직접 만든 조건 줄 유무 |
| MG ↔ SGEF | MG는 위아래 `Splitter`가 아니거나 그리드가 2개 이상. SGEF는 위아래 분할 + 그리드 하나 |

## 3. 판별기에 필요한 기능 수정

1. **탭 인식**: `*_TabPage_*` import가 없어도 `<Tabs>`·`<PageTabs>`(`components/tabs`)가 있으면 `tabs: true`로 본다. `Rpt10_Tab_FssOrg`·`Pay20_Tab_Deduct`가 TP로 나와야 한다.
2. **STP/TP 구분**: 탭이 있을 때 `top_search`(`SearchBar`)가 있으면 STP, 없으면 TP. 직접 만든 조건 줄(`Tdm50_Tab_CheckJob`)도 STP로 읽는다.
3. **SR**: 탭이 없고 `top_search` + RD 영역(`*_Rd_*` import 또는 `iframe`)이면 SR.
4. **TG 확장**: `trees ≥ 1` + `layout=horizontal`이면 오른쪽이 `SingleGrid`가 아니어도 TG(`Dcr01_Tab_DcrManager`·`Emp00_Tab_OrgPerson`이 지금 "트리가 있으나 그리드와 좌우 분할이 아니다"로 빠진다).
5. **자식 컴포넌트 추적**: Tab 파일에 특징이 없으면 같은 폴더의 자식(`*_Page_*`·`*_Grid_*`·`*_Rd_*`)을 한 단계 따라가 합산한다.
   - **상속한 껍데기 화면**: 다른 `_Tab_` 컴포넌트를 import해 그대로 렌더링하는 짧은 화면(`Dcr01_Tab_DcrUser` → `Dcr01_Tab_DcrManager`, `Flt10_Tab_ViolateUser` → `Flt10_Tab_Violate`)은 **부모의 SID를 따른다**.
   - **세로 Splitter에 SG 두 개를 얹은 화면**(`Sys07_Tab_Company`: 위 버튼 줄 + 출발지/목적지 SG 둘): GG 변형으로 읽을지 규칙이 필요하다(열어서 최종 확인 전, 임시로 GG 후보).
6. **새 SID 규칙** SGHF·MG·TO·GO·DB·IN(§2). 특징 필드에 `calendar`(달력)·`rd`(RD 영역)·`tabs`(인라인 탭)·`api_calls`(조회/저장 API 호출 여부)·`menu_link`(`openMenuByNo` 등 메뉴 열기)를 추가해야 §2-1의 쌍이 갈린다.
7. **`--compare` 정확도**: AS-IS(GXT)와 TOBE(React)가 같은 SID인데 다르게 나오는 경우(GG≠SG, SG≠CG)가 있다. AS-IS 판별 규칙과 TOBE 판별 규칙의 기준을 같게 맞추거나, 불일치 이유를 `why`에 남긴다.
8. **선언 우선**: 화면 머리 주석 `스타일: XXX`(괄호 안 설명 제외)를 `declared`로 읽는다. 지금 `스타일: STP (견본 — docs/page-style.md)`처럼 뒤에 설명이 붙어도 SID만 읽어야 한다. 머리 주석은 `/** … */` 블록뿐 아니라 `// 스타일: IN …` 한 줄 주석도 읽어야 한다(`Flt00_Tab_Info`).
9. **SID 목록 동기화**: 유효한 SID 목록(19개)을 `docs/page-style.md`의 "스타일 목록" 표 첫 열에서 읽는다. 선언이 목록에 없는 SID면 경고한다.

## 4. 현재 미분류 화면의 특징값 (2026-10-29 `--json`)

`s` = SearchBar, `g` = 그리드 수, `t` = 트리 수, `e` = 폼(edit/view), `p` = 팝업, `tp` = `*_TabPage_*`, 그 뒤 `layout`, `ts` = 상단 검색, `eg` = 편집 그리드.

| 클래스 | s | g | t | e | p | tp | layout | ts | eg |
|:---|:--:|:--:|:--:|:--|:--:|:--:|:--|:--:|:--:|
| Biz01_Tab_Card | 1 | 4 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_CardContents | 1 | 4 | 0 | edit | 0 | 0 | horizontal | 1 | 0 |
| Biz01_Tab_CardContentsSimple | 1 | 1 | 0 | edit | 0 | 0 | horizontal | 1 | 0 |
| Biz01_Tab_CardSimple | 1 | 1 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_Other | 1 | 4 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_OtherSimple | 1 | 1 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_LimitCheckList | 1 | 0 | 0 | - | 0 | 1 | none | 1 | 0 |
| Chk01_Tab_ClassTree | 0 | 0 | 1 | - | 1 | 0 | none | 0 | 1 |
| Dcr01_Tab_DcrManager | 0 | 0 | 1 | - | 0 | 0 | horizontal | 0 | 0 |
| Dcr01_Tab_DcrUser | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Emp00_Tab_OrgPerson | 1 | 0 | 1 | - | 0 | 0 | horizontal | 1 | 0 |
| Emp01_Tab_DueDiligence | 1 | 0 | 0 | - | 0 | 0 | none | 1 | 0 |
| Emp01_Tab_InoutState | 1 | 0 | 0 | - | 0 | 0 | none | 1 | 0 |
| Emp21_Tab_UnLeaveList | 0 | 0 | 0 | - | 0 | 1 | none | 0 | 0 |
| Fbx01_Tab_Document | 1 | 0 | 1 | - | 0 | 1 | vertical | 0 | 1 |
| Flt00_Tab_Info | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Flt10_Tab_CeoReport | 1 | 0 | 0 | - | 0 | 1 | none | 1 | 0 |
| Flt10_Tab_ViolateUser | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Ics20_Tab_RevisionHistory | 1 | 3 | 0 | view | 0 | 0 | none | 1 | 0 |
| Ics20_Tab_RevisionHistoryAdmin | 1 | 5 | 0 | edit | 0 | 0 | none | 1 | 0 |
| Org01_Tab_OrgCode | 0 | 0 | 1 | - | 1 | 0 | none | 0 | 0 |
| Pay10_Tab_List | 1 | 0 | 0 | - | 0 | 0 | none | 1 | 1 |
| Pay10_Tab_Retire | 1 | 0 | 0 | - | 0 | 1 | none | 1 | 1 |
| Pay20_Tab_Deduct | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Pay20_Tab_DeductAdmin | 0 | 0 | 0 | - | 0 | 1 | none | 0 | 0 |
| Pay31_Tab_InsureApply | 0 | 0 | 0 | - | 0 | 1 | none | 0 | 0 |
| Rpt10_Tab_FssOrg | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Sms02_Tab_TotalCount | 0 | 1 | 0 | - | 0 | 1 | horizontal | 0 | 0 |
| Sms03_Tab_SendAdmin | 0 | 3 | 0 | edit | 0 | 0 | none | 0 | 0 |
| Sys07_Tab_Company | 0 | 0 | 0 | - | 0 | 0 | vertical | 0 | 0 |
| Sys10_Tab_TotalSize | 0 | 1 | 0 | - | 0 | 1 | horizontal | 0 | 0 |
| Sys90_Tab_AfterService | 1 | 3 | 0 | edit | 0 | 0 | none | 1 | 0 |
| Sys90_Tab_AfterServiceAdmin | 1 | 3 | 0 | edit | 0 | 0 | none | 1 | 0 |
| Tdm35_Tab_TaskList | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Tdm50_Tab_CheckJob | 0 | 0 | 0 | - | 1 | 1 | none | 0 | 1 |
| Tdm50_Tab_TotalDashboard | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Tdm54_Tab_CheckInsuff | 0 | 1 | 0 | - | 0 | 0 | none | 0 | 0 |

(`Car03_Tab_List`·`Car03_Tab_DayofMonth`(GCG), `Cmp10_Edit_Tab_MailBook`(`_Tab_`이 아닌 편집 부품)는 표에서 뺐다.)

## 5. 완료 기준

- `yunhee page-style --all`에서 `미분류`가 `_Tab_` 화면 기준 0에 가깝다(껍데기 화면은 부모를 따르고, 선언이 있는 화면은 선언이 우선이다).
- §2 표의 "견본"과 "같은 SID로 정한 다른 화면"이 모두 그 SID로 나온다.
- `yunhee page-style --compare`가 TOBE 머리 주석 선언과 판별을 비교해 불일치를 보고한다.
- §2-1의 쌍(IN↔DB, IN↔TP, GO↔SG, STP↔TP, MG↔SGEF)이 구분된다.
- 새 SID 6개(SGHF·MG·TO·GO·DB·IN)는 규칙이 확정이 아니다. 같은 SID로 묶은 화면을 실제로 맞추면서 규칙을 다시 조정한다.
