# 매뉴얼

## 개요

- TOBE 화면의 사용자 매뉴얼을 **자동으로 만들어** A-Man에 올리는 작업이다. 사람이 화면을 캡처하고 동그라미를 그리는 수고를 없앤다.
- **매뉴얼은 TOBE 기준이다.** AS-IS 화면을 캡처해 만들지 않는다(2026-11-12 사용자 결정). AS-IS는 업무 의미를 확인하는 참고일 뿐이다.
- **변환이 끝난 화면만** 만든다. 화면이 바뀌면(변경반영·UX보강·재설계) 그 화면의 매뉴얼을 다시 만든다.
- 이 작업은 **zip 파일을 만드는 데까지**다. A-Man에 올리는 것은 사람이 한다(자동 업로드 없음).

## A-Man

- AssetERP를 위한 도움말 시스템. Spring Boot 2.x + React + sqlite, Java 8, tomcat 8.5에 `aman.war`로 배포. **AssetERP와 다른 서버.**
- AssetERP 메뉴 체계(3단계: 대분류 > 중분류 > 화면)를 왼쪽 트리로 그대로 따른다.
- 말단 화면뿐 아니라 **대분류·중분류 메뉴에도 도움말**이 있다.
- 한국펀드서비스 AssetERP 담당자가 markdown과 이미지로 편집하고, 일반 사용자는 매뉴얼 보기 화면으로 본다. AssetERP 각 페이지의 Help 버튼이 해당 A-Man URL을 연다(로그인 상태).

## A-Man zip 규격 (샘플 `AssetERP/data/aman-samples/1412.zip`·`56745.zip` 확인, 2026-11-12)

- **화면 문서 = 화면번호 하나당 zip 하나. md는 한 개, 이미지는 여러 개.**

```
1412 책무 등록.md           ← {화면번호} {화면명}.md
images/{uuid hex}.png ×n    ← 캡처 이미지(본문에서 상대 경로 images/xxx.png로 참조)
```

- **상위 메뉴 문서**(대분류·중분류)는 md만 있고 이름이 `{메뉴명}.md`(예: `책무.md`). 내용은 업무 진행 순서와 하위 메뉴 안내. 샘플 파일명 56745는 화면번호가 아니라 A-Man 쪽 id로 보이나 **확정 못 함**(`menus.md`에는 말단 화면만 있고 56745 없음).
- 동영상·유튜브는 **링크**로 본문에 넣는다(파일 포함 아님). 링크 문법은 아직 모른다.
- 파일 이름은 UTF-8이다.
- 화면 간 링크는 `[1477 회사규정(관리자)](https://aview.k-fs.co.kr:7171/aman/manual/1345)` 꼴이다. **`1345`는 화면번호(1477)가 아닌 A-Man 내부 id**라, 자동으로 링크를 만들려면 화면번호 ↔ id 대응표가 필요하다(아직 없음).

### 본문 md의 모양 (1412 샘플)

- 첫머리 `> 💡` 인용문(화면 설명·대상 사용자) + 첫 캡처 → 절마다 `---` 뒤 `## 책무 등록하기`.
- 절은 작업별: 등록·수정·삭제·세부내용·연결 등. 번호 목록 단계마다 이미지가 붙는다.
- 버튼은 `` `등록` `` 또는 `<kbd>저장</kbd>`, 팝업 이름은 「책무」, 강조는 `**굵게**`.
- 버튼은 **글자를 백틱으로 감싸면 A-Man이 버튼 모양으로 그려 준다**(아래 "버튼 표기"). 이미지를 오려 붙이지 않는다.
- HTML 허용: `<font color>`, `<span style>`, `<br/>`, `&nbsp;`, `<table style=…>`.

### 버튼 표기 (A-Man 소스 확인: `frontend/src/components/shared/AssetKbdRenderer.tsx`, `index.css`의 `kbd.asset-kbd-btn`)

마크다운의 **인라인 코드(백틱)** 를 A-Man 뷰어가 가로채 `<kbd class="asset-kbd-btn">` 버튼으로 그린다(`MarkdownViewer.tsx`의 `code` 렌더러).

| 쓰는 법 | 결과 |
|:---|:---|
| `` `저장` `` | **미리 등록된 제목(약 330개)이면** 그 제목의 색·아이콘으로 버튼을 그림(저장 → 민트+체크, 삭제 → 빨강+휴지통, 등록 → 초록+연필 …). 등록 안 된 글자는 그냥 코드 글자. |
| `` `색:아이콘:글자` `` | 직접 지정. 색은 `rrggbb` 16진수, 아이콘은 FontAwesome 이름(`pen`, `fas fa-check`). 예 `` `17A2B8:check:저장` `` |
| `` `색:아이콘:` `` | 글자 없이 **아이콘만**(그리드 안의 연필 수정 버튼): `` `2EAC7E:pen:` `` |
| `` `색::글자` `` | 아이콘 없이 글자만. 밝은 색(`eef2fc`)이면 검은 글자 — 팝업 아래 버튼(`저 장`, `닫 기`)용: `` `eef2fc::저 장` `` |

- 색은 AS-IS 팔레트(`ColorButtonBar`)와 같다: blue `456EA6` · mint `17A2B8` · red `DD5E5E` · orange `E89646` · green `2EAC7E` · lightBlue `6AB6CF` · darkGray `646362` · dark `343A40`.
- 모양: 글자 11px 굵게, 모서리 4px, 테두리는 배경보다 어두운 색, 글자 사이 0.5px.

**TOBE 대응 (결론)**
- TOBE의 버튼(`components/button`, `docs/button-types.md`)은 **AS-IS `ColorButtonBar`의 같은 팔레트와 제목**에서 나왔다. 그래서 `` `저장` `` 처럼 제목만 써도 A-Man 모양과 TOBE 실제 버튼이 거의 같다(색 같음, 아이콘은 FontAwesome ↔ antd 같은 뜻의 아이콘).
- **빠지는 경우**: A-Man 등록 목록은 AS-IS 제목 기준이다. TOBE에서 제목이 새로 생기거나 바뀐(UX보강·재설계) 버튼은 등록 목록에 없어 일반 코드 글자로 나온다. → 매뉴얼 글을 쓸 때 **그 제목이 A-Man 목록에 있는지 먼저 확인**하고, 없으면 `` `색:아이콘:글자` ``로 직접 쓴다(색·아이콘은 `button-types.md`의 type 표에서 정함: 예 `save` = mint `17A2B8` + `check`).
- **A-Man 소스는 고치지 않는다**(사용자 결정 2026-11-12). 그래서 `buttonGroups`에 제목을 더하거나 TOBE용 버튼 모양을 만드는 길은 없다. 글 속 버튼은 A-Man 모양(GXT 느낌) 그대로이고 TOBE 실제 버튼(antd)과 모양이 조금 다른 것은 받아들인다. 빠진 제목은 `` `색:아이콘:글자` ``로 직접 지정해 때운다.
- 해야 할 일(미착수): TOBE 화면의 버튼 제목 전체를 뽑아 A-Man 등록 목록과 대조해 "빠진 제목" 목록 만들기. 앞으로 만들 매뉴얼 초안 생성기는 제목 → (등록되어 있으면 백틱만, 아니면 `색:아이콘:글자`)로 자동 판정한다.

### 배포·주소 (A-Man 무수정)

- A-Man은 컨텍스트 경로 `/aman`이 소스(프런트 `base`·`basename`·`baseURL`, 백엔드 `context-path`)에 박혀 있어 **`aman20.war`처럼 경로가 다른 war로는 쓸 수 없다**(소스 확인, 실제로 올려 보진 않음).
- 대신 **같은 `aman.war`를 다른 서버나 다른 포트에 한 번 더 띄우고**, `aman.base-dir`(DB·이미지·로그가 모두 그 아래)와 포트만 설정으로 달리하면 소스 수정 없이 AS-IS용과 TOBE용을 따로 둘 수 있다(스프링 외부 설정). 주소는 `http://호스트:포트/aman` 그대로. 아직 해 보지 않았다.
- 현재 로컬 A-Man: `http://localhost:8081/aman`, 데이터 `/data/asseterp/aman/`(`db/aman.db`, `data/images`, `logs`).
- AssetERP(TOBE)는 `asseterp.help.aman-url`(프로필 `omen`·`t3600`·`test`에 있음, 지금 값은 `https://aview.k-fs.co.kr:7171/aman`)과 환경변수 `ASSETERP_AMAN_SECRET`(A-Man과 같은 서명 키)로 연결한다. 가리킬 A-Man을 바꾸려면 이 속성만 바꾸면 되고 코드 수정은 필요 없다.
- 화면번호(메뉴 번호)는 TOBE도 AS-IS와 같으므로, 한 A-Man을 쓸 때는 화면이 TOBE로 넘어가는 시점에 그 화면 문서를 TOBE 매뉴얼로 교체하면 된다(Strangler Fig).

### 이미지의 모양

- 가로 약 1200px PNG. 화면 위에 **주황 원 번호 배지(①②)**, **빨간 사각 테두리**(대상 버튼·행·팝업), **빨간 화살표**(버튼 → 팝업). 본문 번호 목록과 배지 번호를 맞춘다.
- 실데이터(사원 이름·계좌 등)가 나오는 화면은 가린다(mask).

## 만드는 흐름

```
1. yunhee screen-capture {화면번호} --boxes   → PNG + *.boxes.json (요소 이름·좌표)
2. Claude: boxes.json을 읽고 draw.json 작성    → "등록 버튼에 ①, 팝업에 ②, ①→② 화살표" 를 이름으로 지시
3. yunhee mark {png} {draw.json} --out {png-alpha}   → 주석 이미지
4. Claude: 주석 이미지를 보며 md 작성
5. zip 생성 ({화면번호} {화면명}.md + images/) → 사람이 A-Man에 업로드
```

- **번호 원은 대상 글자를 가리지 않게 바깥에 놓는다.** `circle-number`의 A-Man 기본 크기(반지름 약 29px)는 작은 버튼(높이 32px)보다 커서 모서리에 붙이면 버튼 글자를 가린다. 작은 버튼에는 `style.fontSize` 18 + `anchor: "top-left"` + `offset: [0,-14]`(버튼 위쪽 바깥), 큰 영역(팝업·그리드)은 모서리 바깥에 놓는다(`outside-*` 앵커는 yunhee 수정사항059 §7 요청 중).
- **설명의 근거는 TOBE 화면**이다: `yunhee analysis ui --tobe …`, `screen-desc`. 재설계·UX보강으로 AS-IS와 달라진 곳은 TOBE 기준으로 쓴다.
- 화면을 사용자에게 알릴 때는 화면번호 중심 규칙(루트 `CLAUDE.md`)을 따른다.

## 작업 절차 ("N번 매뉴얼 만들어줘" 라고 하면 이대로 한다) — #1412로 확정(2026-11-12)

사람이 만든 같은 종류의 매뉴얼(AS-IS A-Man): `https://aview.k-fs.co.kr:7171/aman/admin/folder/148`. 품질 기준은 그 수준이다. (Claude가 웹으로 열면 제목 "A-Man - AssetERP 도움말 시스템"만 오고 본문은 못 읽는다 — 화면이 자바스크립트로 그려져서다. 참고하려면 사용자가 그 문서를 zip으로 내려받아 `AssetERP/data/aman-samples/`에 두거나 본문을 붙여 준다.) 화면을 알릴 때는 화면번호 중심(루트 `CLAUDE.md`).

1. **대상 확인**: `yunhee screen-desc N --summary --section tobe,popup,events`로 메뉴 경로와 `✔ TOBE 변환완료`를 확인한다. 변환 안 된 화면이면 알리고 멈춘다. 작업 폴더 `manual/N/{src,draw,images}`를 만든다.
2. **내용 파악(TOBE 기준)**: 화면 구성·팝업·그리드 컬럼은 위 `screen-desc`로, **사용자에게 보이는 규칙은 TOBE 소스에서 확인**한다 — 필수 입력(`message.warning`), 삭제 조건·확인창(`Modal.confirm`), 사유 입력(`AreaMessage`), 검증 문구(`validate`), 조회 조건의 의미(매퍼 SQL의 `<if>`). `yunhee outline`·`yunhee grep`·`yunhee cat 파일:줄`만 쓰고 소스를 통째로 읽지 않는다. 문장은 확인한 것만 쓴다(추측 금지).
3. **캡처**: `yunhee screen-capture N --login kfstest/admin/1111 --boxes -o manual/N/.cap` → 생기는 `N_클래스/` 안의 파일을 `manual/N/src/`로 옮기고 `.cap`을 지운다. 첫 실행에서 Chromium이 없다고 하면 `~/.local/share/uv/tools/yunhee/bin/python -m playwright install chromium`. 팝업은 yunhee가 자동으로 연다. **저장·삭제는 누르지 않으므로 변경사유·삭제사유·삭제 확인창은 캡처되지 않는다**(글로만 설명하고 보고에 적는다).
4. **요소 이름 확인**: 이미지에 쓸 팝업·요소의 이름을 `*.boxes.json`에서 뽑아 본다(`area: modal`의 이름, 모달은 `이름(모달)`). 같은 이름이 둘이면 `…#2`가 있다(경고가 나오고 첫 번째가 쓰인다).
5. **이미지 설계**: 한 이미지에는 한 가지 설명과 번호 원 **6개 이하**. `draw/NN_이름.json`에 쓰고 `yunhee mark src/원본.png draw/NN_이름.json -o images/NN_이름.png`. 규칙:
   - 설명할 요소마다 `box` + `circle-number`(`style.fontSize` 14~16). 번호 원은 **대상 글자를 가리지 않게** 바깥에 둔다: 버튼·입력칸은 `anchor: "outside-top"`, 폼 라벨 왼쪽에는 `anchor: "left"`+`offset`, 그리드 행 아이콘은 `outside-bottom`. 팝업 제목이 길면 버튼 번호를 `outside-bottom`으로.
   - 팝업 이미지는 `crop`의 `target: "팝업이름(모달)"`, `padding: 10`으로 팝업만 남긴다. 본 화면은 필요한 줄만 `x,y,width,height`로 자른다.
   - **개인정보(사원 이름 등)가 보이는 열은 자르거나 `mask`로 가린다.**
   - 결과 PNG는 **반드시 눈으로 본다**(`Read`). 번호 원이 글자를 가리거나 번호가 다른 요소와 겹치면 `offset`을 고쳐 다시 한다.
6. **본문 md 작성** `manual/N/N 화면명.md`: 첫머리 `> 💡` 한두 줄 → 작업별 절(`---` + `## …하기`: 조회·등록·복사·수정·삭제·세부 팝업 순) → 번호 목록과 이미지 → 경고는 `<font color="#E03E3E">**※ …**</font>`. "~합니다" 체. 안내문구는 화면에 나오는 문구를 그대로 인용한다. 이미지는 `![image](images/파일.png)`.
   - **버튼은 백틱**: `` `조회` ``. A-Man 등록 목록에 있는지 먼저 확인한다(`AssetERP`가 아닌 A-Man 소스의 `AssetKbdRenderer.tsx` `buttonGroups`를 읽기만). 없으면 `` `색:아이콘:글자` ``(예 `` `6AB6CF:exchange-alt:변경이력` ``, `` `E89646:ban:닫기` ``). 색·아이콘은 `docs/button-types.md`의 type 표에서 정한다.
   - 행 안의 아이콘은 TOBE에서 버튼이 아니라 연필 글자 모양이므로 `2EAC7E:pen:` 같은 버튼 표기를 쓰지 않고 "연필 모양 아이콘"이라고 쓴다.
7. **zip**: Python `zipfile`로 `N 화면명.md`와 본문이 참조하는 `images/*.png`를 묶어 `manual/N/N.zip`(한글 이름은 UTF-8). 묶기 전에 본문의 이미지 참조와 파일이 일치하는지(없는 것·안 쓰는 것) 검사한다.
8. **기록**: `manual/N/meta.json`에 화면번호·화면명·만든 날·yunhee 버전·로그인·TOBE 화면 파일 해시(`git hash-object`)를 적는다(화면이 바뀌었는지 판정용). 사용자가 볼 수 있게 결과를 `~/tmp/aman-preview/N/`에 복사한다.
9. **보고**: 화면번호 · 메뉴 경로, 만든 이미지 목록, **확인하지 못한 것**(캡처 못 한 확인창, 직접 지정한 버튼의 A-Man 모양, 코드로 확인 못 한 문장)을 적는다. 업로드는 사람이 한다. 작업이 끝나면 루트 `CLAUDE.md`의 ntfy 알림을 보낸다.

- 소요: 화면 하나(팝업 4개) 기준 캡처 약 30초, 이미지 8장. 한 번에 여러 화면을 만들 때는 화면마다 3~6번을 반복한다.
- 화면이 바뀌면(변경반영·UX보강) `meta.json`의 해시와 비교해 낡았는지 보고, 다시 만들 때는 A-Man의 현재 문서를 먼저 받아 고친다(A-Man이 정본).

## 도구

| 도구 | 하는 일 | 상태 |
|:---|:---|:---|
| `yunhee screen-capture` | TOBE 화면 로그인·오픈·조회·팝업 순회 캡처 | 있음. `--boxes`(요소 좌표 파일)는 **0.8.9에 구현됨**(2026-11-12 #1412로 검증: 좌표·scale·`--modal-only` origin 정확. **0.9.2(수정사항059)에서 보완·재검증 완료**: 가려진 본 화면 요소 제외, 모달 안 이름이 전체·`--modal-only` 캡처에서 같음(모달은 `책무(모달)`), 아이콘 컬럼 헤더·셀 이름이 사람이 읽는 이름(`헤더:세부내용 수정`), 팝업 체크박스·textarea 이름이 라벨 글자. 남은 사소한 점: 행 선택 체크박스 상자가 12×16(실제 16×16), 같은 컬럼의 셀이 `…#2`로 나옴) |
| `yunhee mark` | PNG와 `draw.json`으로 번호 원·강조 상자·화살표·말풍선·글자·가리기·자르기를 그림 | **0.9.1에 구현됨**(2026-11-12 #1412로 검증: 번호 원·상자·화살표·말풍선·글자·가리기·`crop`, 전체 캡처와 `--modal-only` 모두 정상, 없는 `target`은 후보와 함께 오류). 0.9.2에서 모르는 `type`은 후보와 함께 오류(종료코드 1, 출력 없음)로 처리되고 `outside-*` 앵커 8종이 추가됨(재검증 완료). 별도 도구 `mim`은 만들지 않기로 함 |

- 규격서(yunhee-cli 저장소): `~/work/yunhee-cli/docs/boxes-json-규격.md`
  - 1~10절 `boxes.json`: PNG마다 같은 이름 `.boxes.json`, `box=[x,y,w,h]` PNG 픽셀 기준, 이름은 화면에 보이는 글자, 같은 이름은 `#2`.
  - 11절 `draw.json`: **A-Man 이미지 편집기의 요소 어휘를 그대로** 쓴다(`circle-number`·`box`·`arrow`·`text`·`callout` + 우리가 더한 `mask`·`crop`). 기본 모양도 A-Man 값이라 사람이 만든 이미지와 같게 나온다. A-Man 소스: `~/work/aman/frontend/src/components/imageditor/`.
- `draw.json`은 `"target": "등록"`처럼 boxes.json의 이름으로 요소를 가리키거나 `x, y, width, height`로 픽셀을 직접 준다. yunhee에 `--boxes`·`mark`가 생기기 전에는 좌표를 직접 지정해 시험한다.
- A-Man 편집기에서 다시 손볼 이미지는 필요할 때 **작업 JSON**(`yunhee mark --json`의 해석된 요소 + 원본·결과 PNG의 base64를 `{title, originalImageUrl, editedImageUrl, items, circleCounter, imageScale}`로 감싼 것)을 15줄쯤의 스크립트로 만들어 `POST /admin/image-work`로 등록한다(A-Man 무수정, 미시험·yunhee 요청 불필요, `mask`·`crop`은 A-Man 요소가 아니라 원본에 미리 반영해야 함).
- OCR 같은 `find`(이미지에서 위치 찾기)는 두지 않는다. 좌표는 캡처 때 DOM에서 얻는다. DOM 밖 요소(캔버스 등)가 많아지면 그때 다시 검토.

## 열린 문제 / 결정 대기

1. ~~A-Man에 문서를 어느 메뉴에 붙이는지~~ → **해결(2026-11-12, A-Man `ContentController.importPageFromZip` 확인)**: 업로드 요청의 `folderId`로 정해진다(업로드할 때 폴더를 고른다). 제목은 zip 안 **첫 번째 `.md`** 파일 이름에서 `.md`를 뺀 것이다.
2. 상위 메뉴 문서 id(56745 같은 번호)의 정체와 화면번호 ↔ A-Man id 대응표.
3. 동영상·유튜브 링크 문법, A-Man 전용 문법 전체, 허용 이미지 형식·크기.
4. 매뉴얼용 로그인 계정·데이터(`kfstest`/`kalpa` 중), 실데이터 가리기 기준.
5. 시범 화면: 미정. (샘플 `1412.zip`은 A-Man 소개용 예시로 사용자가 가져온 것이라 시범 대상이 아니다. 규격서의 1412 예시도 설명용일 뿐이다.)
6. 매뉴얼 파일을 이 저장소 어디에 두는지(`6-매뉴얼/` 아래 화면별 폴더 안: 후보), 이미지는 용량 때문에 git 제외할지.

## 산출물 보관 (결정 2026-11-12)

- **확정된 매뉴얼은 A-Man이 보관한다.** 우리는 만들어서 zip으로 올리고, 확정(검토·수정)은 A-Man에서 한다. 그래서 산출물 폴더 **`AssetERP/manual/`은 `.gitignore`에 넣어 커밋하지 않는다**(작업 폴더일 뿐이다).
- 화면 하나의 작업 폴더: `AssetERP/manual/<메뉴번호>/`

```
manual/1412/
  1412 책무 등록.md       ← 본문(images/ 상대경로 참조)
  images/                 ← mark 결과(A-Man에 올라가는 최종 이미지)
  src/                    ← yunhee 캡처 원본 PNG + .boxes.json
  draw/                   ← 이미지별 draw.json (원본과 같은 이름)
  meta.json               ← 화면번호·화면명·만든 날·yunhee 버전·로그인·TOBE 화면 파일 해시(낡았는지 판정용)
  1412.zip                ← 빌드 결과(사람이 A-Man에 올린다)
```

- 대분류·중분류 문서는 화면번호가 없어 `manual/_menu/<메뉴경로>/`에 둔다(미정, 첫 문서를 만들 때 확정).
- **이미지 파일 이름은 읽기 쉬운 이름(`01_등록버튼.png`) 그대로 zip에 넣는다.** A-Man 가져오기가 본문의 `![](…)` 참조를 읽어 이미지를 **새 uuid 이름으로 저장하고 본문 주소를 `/aman/images/yyyy/MM/dd/{uuid}.png`로 바꾼다**(A-Man 코드 확인). 샘플 zip의 uuid 이름은 내보내기 결과일 뿐 요구 사항이 아니다.
- 커밋하지 않으므로 **재생성 가능성**은 `draw.json`·본문 md를 로컬에 두는 것으로 만족한다(분실해도 A-Man에 올린 확정본이 남는다). 화면이 바뀌어 매뉴얼을 다시 만들 때는 A-Man의 현재 문서를 먼저 내려받아 고친다(A-Man이 정본).
- 이 폴더(`docs/6-매뉴얼/`)에는 **규칙과 기록**만 둔다. 진행 현황표(`매뉴얼-대장.md`: 화면별 상태·낡음 여부)는 필요해질 때 만든다.

## 연결되는 다른 작업

- 화면은 `../1-변환/`(TOBE 변환 결과)에서, 화면이 바뀐 것은 `../3-변경반영/`·UX보강에서 온다.
- 업무 의미·흐름은 `../2-업무분석/`과 `../1-변환/09-업무흐름.md`를 참고한다(상위 메뉴 문서의 업무 진행 순서).
